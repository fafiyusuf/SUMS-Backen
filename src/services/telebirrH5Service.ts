import axios, { AxiosResponse } from 'axios';
import https from 'https';
import crypto from 'crypto';
import config from '../config/env';
import logger from '../utils/logger';

export interface PreOrderInput {
  amount: number;
  subject?: string;
  outTradeNo?: string;
  notifyUrl?: string;
  redirectUrl?: string;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => sortObjectKeys(v));
  if (value !== null && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((acc, k) => {
        acc[k] = sortObjectKeys((value as Record<string, unknown>)[k]);
        return acc;
      }, {} as Record<string, unknown>);
  }
  return value;
}

function normalizePrivateKey(raw: string): string {
  if (!raw) return '';
  let key = raw.trim().replace(/\\n/g, '\n');
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(key)) return key;
  const body = key.replace(/-----.*PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  const lines = body.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
}

function signRsaSha256(payload: Record<string, unknown>, privateKeyPem: string): string {
  const signer = crypto.createSign('RSA-SHA256');
  const sorted = sortObjectKeys(payload);
  signer.update(JSON.stringify(sorted));
  signer.end();
  return signer.sign(privateKeyPem, 'base64');
}

async function requestWithRetry<T = unknown>(fn: () => Promise<AxiosResponse<T>>, retries = 3, delayMs = 500): Promise<AxiosResponse<T>> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.code;
      const isTransient = status === 502 || status === 504 || code === 'ECONNRESET' || code === 'ECONNABORTED' || code === 'ETIMEDOUT';
      attempt += 1;
      if (attempt >= retries || !isTransient) throw err;
      // exponential backoff
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}

// Shared HTTPS agent for keep-alive and TLS options. In dev you may set TELEBIRR_ALLOW_SELF_SIGNED=true
const httpsAgent = new https.Agent({ keepAlive: true, rejectUnauthorized: process.env.TELEBIRR_ALLOW_SELF_SIGNED ? false : true, maxSockets: 10 });

const DEFAULT_TIMEOUT = 30000;

function buildUrl(baseOrFull: string, path: string) {
  if (path.startsWith('http')) return path;
  return `${baseOrFull.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export class TelebirrH5Service {
  private telebirr = config.telebirr;

  private getBaseUrl(): string {
    // TELEBIRR_BASE_URL is preferred for runtime control (https://app.developerportal.ethiotelebirr.et:38443/ or https://api.telebirr.et)
    return (process.env.TELEBIRR_BASE_URL || this.telebirr.apiUrl || '').replace(/\/$/, '');
  }

  async getFabricToken(): Promise<string> {
    const base = this.getBaseUrl();
    const url = process.env.TELEBIRR_TOKEN_URL || this.telebirr.tokenUrl || buildUrl(base, '/payment/v1/token');

    const fn = () => axios.post(url, { appSecret: this.telebirr.appSecret }, { headers: { 'Content-Type': 'application/json', 'X-APP-Key': this.telebirr.fabricAppId, Connection: 'keep-alive' }, timeout: DEFAULT_TIMEOUT, httpsAgent });
    const resp = await requestWithRetry(fn);
    const token = (resp.data as any)?.token || (resp.data as any)?.access_token;
    if (!token) throw new Error(`No fabric token returned: ${JSON.stringify(resp.data)}`);
    return token;
  }

  async getAuthToken(fabricToken: string): Promise<string> {
    const base = this.getBaseUrl();
    const url = process.env.TELEBIRR_AUTH_TOKEN_URL || buildUrl(base, '/payment/v1/auth/authToken');
    const body = { appId: this.telebirr.appId || this.telebirr.appKey || this.telebirr.fabricAppId };
    const fn = () => axios.post(url, body, { headers: { 'Content-Type': 'application/json', 'X-APP-Key': this.telebirr.fabricAppId, Authorization: `Bearer ${fabricToken}`, Connection: 'keep-alive' }, timeout: DEFAULT_TIMEOUT, httpsAgent });
    const resp = await requestWithRetry(fn);
    const token = (resp.data as any)?.auth_token || (resp.data as any)?.access_token;
    if (!token) throw new Error(`No auth token returned: ${JSON.stringify(resp.data)}`);
    return token;
  }

  async createPreOrder(input: PreOrderInput, authToken?: string): Promise<Record<string, unknown>> {
    const base = this.getBaseUrl();
    const url = process.env.TELEBIRR_CREATE_ORDER_URL || this.telebirr.createOrderUrl || buildUrl(base, '/payment/v1/merchant/preOrder');

    const outTradeNo = input.outTradeNo || `ORDER_${Date.now()}`;
    const payload: Record<string, unknown> = {
      method: 'merchant.preOrder',
      nonce_str: crypto.randomBytes(12).toString('hex'),
      timestamp: Math.floor(Date.now() / 1000).toString(),
      version: '1.0',
      biz_content: {
        trans_currency: 'ETB',
        total_amount: input.amount.toFixed(2),
        subject: input.subject || 'Payment',
        out_trade_no: outTradeNo,
        notify_url: input.notifyUrl,
        redirect_url: input.redirectUrl
      }
    };

    // remove undefined fields
    const biz = payload.biz_content as Record<string, unknown>;
    Object.keys(biz).forEach((k) => (biz[k] === undefined ? delete biz[k] : undefined));

    // sign only if privateKey is configured; some environments require unsigned server request
    const privateKey = normalizePrivateKey(this.telebirr.privateKey || '');
    let bodyPayload: Record<string, unknown> = { ...payload };
    let sign: string | undefined;
    if (privateKey) {
      sign = signRsaSha256(payload, privateKey);
      bodyPayload = { ...payload, sign, sign_type: 'SHA256WithRSA' };
    }

    const tokenToUse = authToken || (await this.getFabricToken());

    const fn = () => axios.post(url, bodyPayload, { headers: { 'Content-Type': 'application/json', 'X-APP-Key': this.telebirr.fabricAppId, Authorization: `Bearer ${tokenToUse}`, Connection: 'keep-alive' }, timeout: DEFAULT_TIMEOUT, httpsAgent });
    const resp = await requestWithRetry(fn);

    const responseData = resp.data as Record<string, unknown>;

    // Build rawRequest for H5 to call SuperApp JS
    const prepayId = (responseData.prepay_id as string) || ((responseData.biz_content as any)?.prepay_id as string);
    const rawRequest: Record<string, unknown> = {
      prepay_id: prepayId,
      out_trade_no: outTradeNo,
      nonce_str: payload.nonce_str,
      timestamp: payload.timestamp,
      version: payload.version,
      biz_content: payload.biz_content
    };
    if (sign) {
      rawRequest.sign_type = 'SHA256WithRSA';
      rawRequest.sign = sign;
    }

    const rawRequestString = JSON.stringify(sortObjectKeys(rawRequest));

    return {
      providerResponse: responseData,
      prepayId,
      rawRequest,
      rawRequestString
    };
  }

  async refundOrder(outTradeNo: string, refundAmount: string, reason?: string): Promise<Record<string, unknown>> {
    const base = this.getBaseUrl();
    const url = `${base}/payment/v1/merchant/refund`;
    const payload = {
      method: 'merchant.refund',
      nonce_str: crypto.randomBytes(12).toString('hex'),
      timestamp: Math.floor(Date.now() / 1000).toString(),
      version: '1.0',
      biz_content: {
        out_trade_no: outTradeNo,
        refund_amount: refundAmount,
        reason: reason || 'refund'
      }
    } as Record<string, unknown>;

    const privateKey = normalizePrivateKey(this.telebirr.privateKey || '');
    if (!privateKey) throw new Error('Telebirr private key not configured');

    const sign = signRsaSha256(payload, privateKey);
    const body = { ...payload, sign, sign_type: 'SHA256WithRSA' };

    const fabricToken = await this.getFabricToken();
    const fn = () => axios.post(url, body, { headers: { 'Content-Type': 'application/json', 'X-APP-Key': this.telebirr.fabricAppId, Authorization: `Bearer ${fabricToken}`, Connection: 'keep-alive' }, timeout: DEFAULT_TIMEOUT, httpsAgent });
    const resp = await requestWithRetry(fn);

    return { providerResponse: resp.data };
  }

  // Verify incoming notify payload using TELEBIRR_PUBLIC_KEY if provided
  verifyNotify(payload: Record<string, unknown>, signatureBase64?: string): boolean {
    const pub = process.env.TELEBIRR_PUBLIC_KEY || '';
    if (!pub || !signatureBase64) return true; // can't verify, allow for flexibility
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(JSON.stringify(sortObjectKeys(payload)));
    verifier.end();
    try {
      return verifier.verify(pub.replace(/\\n/g, '\n'), signatureBase64, 'base64');
    } catch (e) {
      logger.error('Notify signature verification failed', e as Error);
      return false;
    }
  }

  // Combined flow: fabric -> auth -> preOrder -> return rawRequest (for H5)
  async createCheckoutUrl(params: { totalAmount: string; notifyUrl: string; returnUrl?: string; subject?: string; outTradeNo?: string; shortCode?: string }) {
    const fabric = await this.getFabricToken();
    const auth = await this.getAuthToken(fabric);
    const pre = await this.createPreOrder({ amount: parseFloat(params.totalAmount), subject: params.subject, outTradeNo: params.outTradeNo, notifyUrl: params.notifyUrl, redirectUrl: params.returnUrl }, auth);

    const responseData = pre as Record<string, any>;
    const prepayId = responseData.prepay_id || responseData.prepayId || (responseData.biz_content && responseData.biz_content.prepay_id);

    const rawRequest = {
      prepay_id: prepayId,
      out_trade_no: params.outTradeNo,
      nonce_str: crypto.randomBytes(12).toString('hex'),
      timestamp: Math.floor(Date.now() / 1000).toString(),
      version: '1.0'
    } as Record<string, unknown>;

    if (this.telebirr.privateKey) {
      const pk = normalizePrivateKey(this.telebirr.privateKey);
      rawRequest['sign'] = signRsaSha256(rawRequest, pk);
      rawRequest['sign_type'] = 'SHA256WithRSA';
    }

    return { providerResponse: responseData, rawRequest };
  }
}

export default new TelebirrH5Service();
