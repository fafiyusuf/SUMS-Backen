import axios from 'axios';
import * as cheerio from 'cheerio';
import { sequelize } from '../../config/database';
import config from '../../config/env';
import logger from '../../utils/logger';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';
import { TelebirrPayment } from './telebirrPayment.model';

const RECEIPT_BASE_URL = 'https://transactioninfo.ethiotelecom.et/receipt/';
const SERVICE_FEE = 2;
const FETCH_TIMEOUT_MS = 10_000;

// ─── Helpers ────────────────────────────────────────────────────────────────

function createError(status: number, message: string): Error & { status: number } {
    const err = new Error(message) as Error & { status: number };
    err.status = status;
    return err;
}

/** Lowercase + collapse whitespace for name comparison */
function normalizeName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Extract {invoiceNo} from a valid Telebirr receipt URL. Returns null if invalid. */
function extractInvoiceNo(receiptUrl: string): string | null {
    if (!receiptUrl.startsWith(RECEIPT_BASE_URL)) return null;
    const part = receiptUrl.slice(RECEIPT_BASE_URL.length);
    if (!part || /[/?#]/.test(part)) return null;
    return part;
}

/** Flatten a Sequelize / generic error to a human-readable string. */
function dbErrMsg(err: any): string {
    return (
        (err.message && err.message.trim()) ||
        (err.original?.message && err.original.message.trim()) ||
        err.name ||
        'Unknown DB error'
    );
}

// ─── Receipt scraping ────────────────────────────────────────────────────────

interface ReceiptData {
    invoiceNo: string;
    payerName: string;
    creditedPartyName: string;
    creditedPartyAccount: string;
    totalPaid: number;
    paymentStatus: string;
}

async function fetchAndParseReceipt(receiptUrl: string): Promise<ReceiptData> {
    const response = await axios.get<string>(receiptUrl, {
        timeout: FETCH_TIMEOUT_MS,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SUMS-ReceiptVerifier/1.0)' },
        responseType: 'text'
    });

    const $ = cheerio.load(response.data);

    // Build a map of label → value from all <tr><td>label</td><td>value</td></tr> rows
    const dataMap: Record<string, string> = {};
    $('tr').each((_i, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
            const label = $(cells[0]).text().trim();
            const value = $(cells[1]).text().trim();
            if (label) dataMap[label.toLowerCase()] = value;
        }
    });

    // Fallback: scan all elements for a label match and grab the next sibling
    function findByLabel(label: string): string {
        if (dataMap[label.toLowerCase()]) return dataMap[label.toLowerCase()];
        let found = '';
        $('td, th, dt, dd, span, p, div').each((_i, el) => {
            if ($(el).text().trim().toLowerCase() === label.toLowerCase()) {
                const next = $(el).next();
                if (next.length) { found = next.text().trim(); return false as any; }
                const parentNext = $(el).parent().next();
                if (parentNext.length) { found = parentNext.text().trim(); return false as any; }
            }
            return undefined;
        });
        return found;
    }

    const get = (keys: string[]): string => {
        for (const k of keys) {
            const v = findByLabel(k);
            if (v) return v;
        }
        return '';
    };

    const invoiceNo = get(['Invoice No', 'Invoice Number']);
    const payerName = get(['Payer Name', 'Sender Name']);
    const creditedPartyName = get(['Credited Party Name', 'Receiver Name']);
    const creditedPartyAccount = get(['Credited Party Account', 'Receiver Account']);
    const totalPaidStr = get(['Total Paid Amount', 'Amount', 'Total Amount']);
    const paymentStatus = get(['Payment Status', 'Status']);

    const missing = [
        !invoiceNo && 'Invoice No',
        !payerName && 'Payer Name',
        !creditedPartyName && 'Credited Party Name',
        !creditedPartyAccount && 'Credited Party Account',
        !totalPaidStr && 'Total Paid Amount',
        !paymentStatus && 'Payment Status'
    ].filter(Boolean) as string[];

    if (missing.length > 0) {
        throw createError(422, `Could not extract required fields from receipt: ${missing.join(', ')}`);
    }

    const totalPaid = parseFloat(totalPaidStr.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(totalPaid) || totalPaid <= 0) {
        throw createError(422, 'Invalid Total Paid Amount in receipt.');
    }

    return { invoiceNo, payerName, creditedPartyName, creditedPartyAccount, totalPaid, paymentStatus };
}

// ─── Main service function ───────────────────────────────────────────────────

export interface VerifyReceiptResult {
    invoiceNo: string;
    sender: string;
    creditedAmount: number;
    newBalance: number;
}

export async function verifyReceipt(receiptUrl: string): Promise<VerifyReceiptResult> {
    // Step 1: Validate URL + extract invoice number
    const invoiceNo = extractInvoiceNo(receiptUrl);
    if (!invoiceNo) {
        throw createError(400, 'Invalid receipt URL. Only https://transactioninfo.ethiotelecom.et/receipt/<invoiceNo> is accepted.');
    }

    // Step 2: Check for duplicate invoice in DB
    let existing: TelebirrPayment | null;
    try {
        existing = await TelebirrPayment.findOne({ where: { invoiceNo } });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] Step2 DB error: ${msg}`, { original: dbErr.original });
        throw createError(500, `Database error while checking for duplicate receipt: ${msg}`);
    }
    if (existing) {
        throw createError(409, 'Receipt already used.');
    }

    // Steps 3 & 4: Fetch and parse receipt HTML
    let receipt: ReceiptData;
    try {
        receipt = await fetchAndParseReceipt(receiptUrl);
    } catch (err: any) {
        if (err.status) throw err;
        logger.error(`[PaymentService] Receipt fetch error: ${err.message}`);
        throw createError(502, `Failed to fetch receipt from Telebirr: ${err.message}`);
    }

    const { payerName, creditedPartyName, creditedPartyAccount, totalPaid, paymentStatus } = receipt;

    // Step 5: Payment must be Completed
    if (paymentStatus.toLowerCase() !== 'completed') {
        throw createError(400, `Payment is not completed. Status: "${paymentStatus}"`);
    }

    // Step 6: Verify receiver against env-configured credentials
    const expectedName = config.receipt.receiverName;
    const expectedPhone = config.receipt.receiverPhone;

    if (!expectedName || !expectedPhone) {
        throw createError(500, 'Receiver credentials (TELEBIRR_RECEIVER_NAME / TELEBIRR_RECEIVER_PHONE) are not configured.');
    }

    if (normalizeName(creditedPartyName) !== normalizeName(expectedName)) {
        throw createError(400, `Receiver name mismatch. Expected "${expectedName}", got "${creditedPartyName}".`);
    }
    if (creditedPartyAccount.trim() !== expectedPhone.trim()) {
        throw createError(400, `Receiver account mismatch. Expected "${expectedPhone}", got "${creditedPartyAccount}".`);
    }

    // Step 7: Find the sender user by fullName (case+whitespace insensitive)
    let allUsers: User[];
    try {
        allUsers = await User.findAll({ attributes: ['id', 'fullName'] });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] Step7 DB error: ${msg}`);
        throw createError(500, `Database error while looking up card holder: ${msg}`);
    }

    const normalizedPayer = normalizeName(payerName);
    const matchedUser = allUsers.find(u => normalizeName(u.fullName) === normalizedPayer);
    if (!matchedUser) {
        throw createError(404, 'Card holder not found.');
    }

    let wallet: Wallet | null;
    try {
        wallet = await Wallet.findOne({ where: { userId: matchedUser.id } });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] Wallet lookup DB error: ${msg}`);
        throw createError(500, `Database error while looking up wallet: ${msg}`);
    }
    if (!wallet) {
        throw createError(404, 'Wallet not found for card holder.');
    }

    // Step 8: Calculate credit (total - 2 ETB service fee, min 0)
    const creditedAmount = Math.max(0, totalPaid - SERVICE_FEE);

    // Steps 9 & 10: Update balance + create payment record atomically
    const t = await sequelize.transaction();
    let newBalance: number;
    try {
        await wallet.increment('balance', { by: creditedAmount, transaction: t });
        await wallet.reload({ transaction: t });
        newBalance = parseFloat(wallet.balance as any);

        await TelebirrPayment.create(
            {
                invoiceNo,
                receiptUrl,
                senderName: payerName,
                receiverName: creditedPartyName,
                receiverAccount: creditedPartyAccount,
                totalPaid,
                creditedAmount,
                status: paymentStatus,
                verifiedAt: new Date(),
                userId: matchedUser.id
            },
            { transaction: t }
        );

        await t.commit();
    } catch (err: any) {
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw createError(409, 'Receipt already used.');
        }
        const msg = dbErrMsg(err);
        logger.error(`[PaymentService] Transaction error: ${msg}`, { original: err.original });
        throw createError(500, `Failed to process payment: ${msg}`);
    }

    // Step 11: Return success
    return { invoiceNo, sender: payerName, creditedAmount, newBalance };
}
