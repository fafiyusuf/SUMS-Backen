import axios from 'axios';
import https from 'https';
import crypto from 'crypto';
import config from '../config/env';
import logger from '../utils/logger';
import { Transaction } from '../models';
import walletService from './walletService';

export interface CreateCheckoutInput {
  amount: number;
  subject?: string;
  outTradeNo?: string;
  timeoutExpress?: string;
  notifyUrl?: string;
  redirectUrl?: string;
}

interface TokenResponse {
  token?: string;
  access_token?: string;
}

interface ApiError extends Error {
  status?: number;
}

function createApiError(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeys(item));
  }

  if (value !== null && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {} as Record<string, unknown>);
  }

  return value;
}

function normalizePrivateKey(rawPrivateKey: string): string {
  if (!rawPrivateKey) return '';

  // Trim and convert escaped newlines to real newlines
  let key = rawPrivateKey.trim().replace(/\\n/g, '\n');

  // If it already looks like a PEM (any PRIVATE KEY header), return as-is
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(key) && /-----END [A-Z ]*PRIVATE KEY-----/.test(key)) {
    return key;
  }

  // Otherwise normalize: remove any non-base64 chars and re-wrap at 64 chars
  const body = key.replace(/-----.*PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  const lines = body.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
}

function signPayload(payload: Record<string, unknown>, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  const sortedPayload = sortObjectKeys(payload);
  sign.update(JSON.stringify(sortedPayload));
  sign.end();
  return sign.sign(privateKey, 'base64');
}

export interface TelebirrWebhookPayload {
  outTradeNo: string;
  status: string;
  amount: number;
}

export class WalletTelebirrService {
  private httpsAgent = new https.Agent({ rejectUnauthorized: process.env.TELEBIRR_ALLOW_SELF_SIGNED ? false : true });

  private generateTradeNo(): string {
    return `TB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createCheckoutUrl(input: CreateCheckoutInput): Promise<Record<string, unknown>> {
    const telebirr = config.telebirr;

    if (!telebirr.fabricAppId || !telebirr.appSecret || !telebirr.privateKey || !telebirr.createOrderUrl || !telebirr.tokenUrl) {
      throw createApiError(
        'Telebirr is not fully configured. Set FABRIC_APP_ID/Fabric_App_ID, APP_SECRET/App_Secret, PRIVATE_KEY/PrivateKey, TELEBIRR_TOKEN_URL, and TELEBIRR_CREATE_ORDER_URL.',
        500
      );
    }

    const privateKey = normalizePrivateKey(telebirr.privateKey);
    if (!privateKey) {
      throw createApiError('Telebirr private key is empty or invalid.', 500);
    }

    try {
      const tokenResponse = await axios.post<TokenResponse>(
        telebirr.tokenUrl,
        { appSecret: telebirr.appSecret },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-APP-Key': telebirr.fabricAppId,
            Connection: 'keep-alive'
          },
          timeout: 30000,
          httpsAgent: this.httpsAgent
        }
      );

      const fabricToken = tokenResponse.data.token || tokenResponse.data.access_token;
      if (!fabricToken) {
        throw createApiError('Telebirr token response did not include a token.', 502);
      }

      const outTradeNo = input.outTradeNo || `ORDER_${Date.now()}`;
      const orderPayload: Record<string, unknown> = {
        nonce_str: crypto.randomBytes(16).toString('hex'),
        method: 'payment.preorder',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        version: '1.0',
        biz_content: {
          trans_currency: 'ETB',
          total_amount: input.amount.toFixed(2),
          subject: input.subject || 'SUMS Payment',
          out_trade_no: outTradeNo,
          timeout_express: input.timeoutExpress || '30m',
          notify_url: input.notifyUrl,
          redirect_url: input.redirectUrl,
          short_code: telebirr.merchantCode || undefined,
          appid: telebirr.merchantAppId || undefined
        }
      };

      const bizContent = orderPayload.biz_content as Record<string, unknown>;
      Object.keys(bizContent).forEach((key) => {
        if (bizContent[key] === undefined) {
          delete bizContent[key];
        }
      });

      const sign = signPayload(orderPayload, privateKey);

      const createOrderBody = {
        ...orderPayload,
        sign,
        sign_type: 'SHA256WithRSA'
      };

      const baseUrl = process.env.TELEBIRR_BASE_URL || telebirr.createOrderUrl || '';
      const orderEndpoint = baseUrl.endsWith('/payment/v1/app/checkout')
        ? baseUrl
        : `${baseUrl.replace(/\/$/, '')}/payment/v1/app/checkout`;

      const orderResponse = await axios.post(
        orderEndpoint,
        createOrderBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-APP-Key': telebirr.fabricAppId,
            Authorization: `Bearer ${fabricToken}`,
            Connection: 'keep-alive'
          },
          timeout: 30000,
          httpsAgent: this.httpsAgent
        }
      );

      console.log('Telebirr provider response:', orderResponse.data);

      const responseData = orderResponse.data as Record<string, unknown>;
      const prepayId =
        (responseData.prepay_id as string | undefined) ||
        (responseData.prepayId as string | undefined) ||
        ((responseData.biz_content as Record<string, unknown> | undefined)?.prepay_id as string | undefined);

      const checkoutUrlFromProvider =
        (responseData.checkout_url as string | undefined) ||
        (responseData.checkoutUrl as string | undefined) ||
        ((responseData.biz_content as Record<string, unknown> | undefined)?.checkout_url as string | undefined);

      const checkoutUrl = checkoutUrlFromProvider ||
        (telebirr.checkoutBaseUrl && prepayId ? `${telebirr.checkoutBaseUrl}?prepay_id=${encodeURIComponent(prepayId)}` : undefined);

      const rawRequest = {
        prepay_id: prepayId,
        out_trade_no: outTradeNo,
        nonce_str: orderPayload.nonce_str,
        timestamp: orderPayload.timestamp,
        version: orderPayload.version,
        sign_type: 'SHA256WithRSA',
        sign,
        biz_content: bizContent
      } as Record<string, unknown>;

      const rawRequestString = JSON.stringify(sortObjectKeys(rawRequest));

      if (!checkoutUrl) {
        throw createApiError('Telebirr did not return a checkout URL. Check TELEBIRR_CHECKOUT_BASE_URL or provider response mapping.', 502);
      }

      return {
        checkoutUrl,
        outTradeNo,
        prepayId,
        fabricToken,
        providerResponse: responseData,
        rawRequest,
        rawRequestString
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string; status?: number };
      const providerPayload = axiosError.response?.data ? JSON.stringify(axiosError.response.data) : '';
      console.log('Telebirr checkout error response:', axiosError.response?.data);
      console.log('Telebirr checkout error status:', axiosError.response?.status);
      console.error('Telebirr checkout error:', axiosError.message || String(error));
      logger.error(`Telebirr checkout URL generation failed: ${axiosError.message || String(error)} ${providerPayload}`);

      if ((error as ApiError).status) {
        throw error;
      }

      throw createApiError('Failed to create Telebirr checkout URL.', axiosError.response?.status || 500);
    }
  }

  async createWalletTopup(userId: string, amount: number, userPhone: string): Promise<Record<string, unknown>> {
    try {
      const outTradeNo = this.generateTradeNo();

      await Transaction.create({
        userId,
        amount,
        status: 'pending',
        outTradeNo,
        type: 'credit',
        description: 'Telebirr Wallet Topup'
      } as any);

      const paymentRequest = {
        amount,
        subject: 'Wallet Topup',
        outTradeNo,
        notifyUrl: process.env.TELEBIRR_NOTIFY_URL || 'http://localhost:5001/api/telebirr/webhook',
        redirectUrl: `${process.env.TELEBIRR_RETURN_URL || 'http://localhost:3000/payment/success'}?tradeNo=${outTradeNo}`,
        customer_phone: userPhone
      };

      const response = await this.createCheckoutUrl(paymentRequest);

      return {
        success: true,
        checkoutUrl: response.checkoutUrl,
        outTradeNo
      };
    } catch (error: any) {
      logger.error(`Create wallet topup error: ${error.message}`);
      throw error;
    }
  }

  async processWebhook(payload: TelebirrWebhookPayload): Promise<void> {
    try {
      const { outTradeNo, status, amount } = payload;

      const transaction = await Transaction.findOne({ 
        where: { outTradeNo } 
      });

      if (!transaction) {
        logger.warn(`Transaction not found for outTradeNo: ${outTradeNo}`);
        return;
      }

      if (transaction.get('status') !== 'pending') {
        logger.info(`Transaction ${outTradeNo} already processed`);
        return;
      }

      if (status === 'SUCCESS') {
        await transaction.update({ status: 'completed' });

        await walletService.addBalance(transaction.get('userId'), amount);

        logger.info(`Payment successful for transaction ${outTradeNo}, amount: ${amount}`);
      } else {
        await transaction.update({ status: 'failed' });
        logger.info(`Payment failed for transaction ${outTradeNo}, status: ${status}`);
      }
    } catch (error: any) {
      logger.error(`Process webhook error: ${error.message}`);
      throw error;
    }
  }

  async verifyTransaction(outTradeNo: string): Promise<any> {
    try {
      const transaction = await Transaction.findOne({ 
        where: { outTradeNo } 
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return {
        success: true,
        transaction: {
          id: transaction.get('id'),
          amount: transaction.get('amount'),
          status: transaction.get('status'),
          outTradeNo: transaction.get('outTradeNo'),
          createdAt: transaction.get('createdAt')
        }
      };
    } catch (error: any) {
      logger.error(`Verify transaction error: ${error.message}`);
      throw error;
    }
  }
}

export default new WalletTelebirrService();
