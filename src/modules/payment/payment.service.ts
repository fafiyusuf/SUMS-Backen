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

function normalizeName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractInvoiceNo(receiptUrl: string): string | null {
    if (!receiptUrl.startsWith(RECEIPT_BASE_URL)) return null;
    const part = receiptUrl.slice(RECEIPT_BASE_URL.length);
    if (!part || /[/?#]/.test(part)) return null;
    return part;
}

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
    const dataMap: Record<string, string> = {};

    // 1. Process key-value rows (must have at least 2 cells and no nested tables)
    $('tr').each((_i: number, row: any) => {
        if ($(row).find('table').length > 0) return;
        const cells = $(row).find('td, th');
        if (cells.length >= 2) {
            // Label is the second-to-last cell, value is the last cell
            const label = $(cells[cells.length - 2]).text().trim().toLowerCase();
            const value = $(cells[cells.length - 1]).text().trim();
            if (label) {
                dataMap[label] = value;
            }
        }
    });

    // 2. Process column tables specifically (like the Invoice details table)
    $('table').each((_tableIdx: number, table: any) => {
        if ($(table).find('table').length > 0) return;
        
        const rows = $(table).find('tr');
        let invoiceColIdx = -1;
        let headerRowIdx = -1;
        
        rows.each((rowIdx: number, row: any) => {
            const cells = $(row).find('td, th');
            cells.each((colIdx: number, cell: any) => {
                const text = $(cell).text().trim().toLowerCase();
                if (text.includes('invoice no')) {
                    invoiceColIdx = colIdx;
                    headerRowIdx = rowIdx;
                }
            });
        });
        
        if (invoiceColIdx !== -1 && headerRowIdx !== -1 && headerRowIdx < rows.length - 1) {
            const valueRow = rows[headerRowIdx + 1];
            const valueCells = $(valueRow).find('td');
            if (valueCells.length > invoiceColIdx) {
                dataMap['invoice no'] = $(valueCells[invoiceColIdx]).text().trim();
            }
            
            const headerCells = $(rows[headerRowIdx]).find('td, th');
            headerCells.each((colIdx: number, headerEl: any) => {
                const headerText = $(headerEl).text().trim().toLowerCase();
                if (headerText.includes('settled amount')) {
                    if (valueCells.length > colIdx) {
                        dataMap['settled amount'] = $(valueCells[colIdx]).text().trim();
                    }
                }
                if (headerText.includes('payment date')) {
                    if (valueCells.length > colIdx) {
                        dataMap['payment date'] = $(valueCells[colIdx]).text().trim();
                    }
                }
            });
        }
    });

    function findByLabel(targetLabel: string): string {
        const target = targetLabel.toLowerCase();
        for (const [key, val] of Object.entries(dataMap)) {
            if (key.includes(target)) {
                return val;
            }
        }
        return '';
    }

    const get = (keys: string[]): string => {
        for (const k of keys) {
            const v = findByLabel(k);
            if (v) return v;
        }
        return '';
    };

    const invoiceNo = get(['invoice no', 'invoice number']);
    const payerName = get(['payer name', 'sender name']);
    const creditedPartyName = get(['credited party name', 'receiver name']);
    const creditedPartyAccount = get(['credited party account', 'receiver account', 'credited party account no']);
    const totalPaidStr = get(['total paid amount', 'amount', 'total amount', 'settled amount']);
    const paymentStatus = get(['payment status', 'status', 'transaction status']);

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

export interface VerifyReceiptInput {
    receiptUrl: string;
    /** Authenticated user ID from JWT */
    userId: string;
}

export interface VerifyReceiptResult {
    invoiceNo: string;
    sender: string;
    creditedAmount: number;
    newBalance: number;
}

export async function verifyReceipt(input: VerifyReceiptInput): Promise<VerifyReceiptResult> {
    const { receiptUrl, userId } = input;

    // Step 1: Validate URL + extract invoice number
    const invoiceNo = extractInvoiceNo(receiptUrl);
    if (!invoiceNo) {
        throw createError(400, 'Invalid receipt URL. Only https://transactioninfo.ethiotelecom.et/receipt/<invoiceNo> is accepted.');
    }

    // Step 2: Check for duplicate invoice
    let existing: TelebirrPayment | null;
    try {
        existing = await TelebirrPayment.findOne({ where: { invoiceNo } });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] Step2 DB error (${dbErr.name}): ${msg}`);
        console.error('[PaymentService] Step2 raw error:', dbErr);
        throw createError(500, `Database error while checking for duplicate receipt: ${msg}`);
    }
    if (existing) {
        throw createError(409, 'Receipt already used.');
    }

    // Step 3 & 4: Fetch and parse receipt HTML
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
        logger.warn(`[PaymentService] Receiver name mismatch. Expected "${expectedName}", got "${creditedPartyName}".`);
        throw createError(400, 'Invalid receipt. Payment was not sent to the official SUMS account name.');
    }
    if (creditedPartyAccount.trim() !== expectedPhone.trim()) {
        logger.warn(`[PaymentService] Receiver account mismatch. Expected "${expectedPhone}", got "${creditedPartyAccount}".`);
        throw createError(400, 'Invalid receipt. Payment was not sent to the official SUMS receiver phone number.');
    }

    // Step 7: Load the authenticated user (no full-table scan)
    let user: User | null;
    try {
        user = await User.findByPk(userId, { attributes: ['id', 'fullName'] });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] User lookup DB error (${dbErr.name}): ${msg}`);
        throw createError(500, `Database error while loading user: ${msg}`);
    }
    if (!user) {
        throw createError(404, 'Authenticated user not found in database.');
    }

    // Verify the payer name on the receipt matches the authenticated user
    if (normalizeName(payerName) !== normalizeName(user.fullName)) {
        throw createError(400, `Receipt payer name "${payerName}" does not match your account name "${user.fullName}".`);
    }

    // Load the user's wallet
    let wallet: Wallet | null;
    try {
        wallet = await Wallet.findOne({ where: { userId } });
    } catch (dbErr: any) {
        const msg = dbErrMsg(dbErr);
        logger.error(`[PaymentService] Wallet lookup DB error (${dbErr.name}): ${msg}`);
        throw createError(500, `Database error while loading wallet: ${msg}`);
    }
    if (!wallet) {
        throw createError(404, 'Wallet not found for your account.');
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
                userId
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
        logger.error(`[PaymentService] Transaction error (${err.name}): ${msg}`, { original: err.original });
        throw createError(500, `Failed to process payment: ${msg}`);
    }

    return { invoiceNo, sender: payerName, creditedAmount, newBalance };
}
