#!/usr/bin/env node
/**
 * Send personalised cold emails to leads in the sheet.
 *
 * Pulls rows where STATUS is "new" and EMAIL contains an @, builds a
 * per-lead message with the open-tracking pixel + signed unsubscribe
 * link, sends via Resend, and marks the row as "sent" with a timestamp.
 *
 * Usage:
 *   npm run send                    send up to LEADS_SEND_LIMIT (default 30)
 *   npm run send -- --dry-run       preview without sending
 *   npm run send -- --limit 3       override limit for a smoke test
 *
 * Required .env:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   RESEND_API_KEY
 *   SIGNING_SECRET                  must match the value in Vercel
 *
 * Optional:
 *   LEADS_SHEET_NAME                default "Leads"
 *   LEADS_FROM_EMAIL                default "Terence Meghani <hello@terencemeghani.com>"
 *   LEADS_SEND_LIMIT                default 30
 *   LEADS_SEND_DELAY_MS             default 2000 (gap between sends)
 *   NEXT_PUBLIC_SITE_URL            default "https://www.terencemeghani.com"
 */

import crypto from 'crypto';
import { google } from 'googleapis';
import { Resend } from 'resend';

/* Sheet column map. STATUS/EMAIL/ID/OPENED/UNSUBSCRIBED match what
   scrape-leads.mjs writes and what app/api/_lib/sheets-client.js expects.
   SENT_AT and SEND_ERROR repurpose columns 19–20 (placeholders in the
   scraper's output) so we don't need to widen the sheet. */
const COLUMNS = {
  ID:           0,
  COMPANY_NAME: 1,
  EMAIL:        2,
  CONTACT_NAME: 16,
  STATUS:       14,
  SENT_AT:      19,
  SEND_ERROR:   20,
};
const SHEET_RANGE_END = 'V'; /* column 21 = U; we read through V to be safe */

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = (() => {
  const i = args.indexOf('--limit');
  if (i === -1) return null;
  const n = Number(args[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : null;
})();

const cfg = {
  saEmail:       process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  saKey:         process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  sheetId:       process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  sheet:         process.env.LEADS_SHEET_NAME || 'Leads',
  resendKey:     process.env.RESEND_API_KEY,
  fromAddr:      process.env.LEADS_FROM_EMAIL || 'Terence Meghani <hello@terencemeghani.com>',
  signingSecret: process.env.SIGNING_SECRET,
  baseUrl:       process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terencemeghani.com',
  limit:         limitArg ?? Number(process.env.LEADS_SEND_LIMIT || 30),
  delayMs:       Number(process.env.LEADS_SEND_DELAY_MS || 2000),
};

function requireEnv() {
  const missing = ['saEmail', 'saKey', 'sheetId', 'resendKey', 'signingSecret']
    .filter((k) => !cfg[k]);
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function colLetter(index) {
  let n = index;
  let s = '';
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

function getSheets() {
  const auth = new google.auth.JWT({
    email:  cfg.saEmail,
    key:    cfg.saKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

function unsubToken(email) {
  return crypto
    .createHmac('sha256', cfg.signingSecret)
    .update(email.toLowerCase().trim())
    .digest('hex')
    .slice(0, 20);
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildEmail(lead) {
  const id      = lead[COLUMNS.ID];
  const email   = lead[COLUMNS.EMAIL].trim();
  const company = (lead[COLUMNS.COMPANY_NAME] || '').trim();
  const contact = (lead[COLUMNS.CONTACT_NAME] || '').trim();

  const greeting = contact ? `Hi ${contact.split(/\s+/)[0]}` : 'Hi';
  const subject  = company
    ? `${company}: three vendors, or one?`
    : 'Three vendors, or one?';

  const trackUrl = `${cfg.baseUrl}/api/track/open/${encodeURIComponent(id)}`;
  const unsubUrl = `${cfg.baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubToken(email)}`;

  const text =
`${greeting},

Most new businesses end up with three vendors, four invoices, and a brief nobody actually owns.

I do all three — brand, site, growth — out of Hertfordshire. 12 years in. Saw ${company || 'your company'} on Companies House. Recently incorporated, local, building.

20 minutes — save yourself the agency runaround?

Terence
terencemeghani.com

---
Not a fit? Unsubscribe: ${unsubUrl}
`;

  const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:580px;margin:0;padding:16px;color:#1a1a1a;line-height:1.55;font-size:15px;">
<p style="margin:0 0 1em;">${escapeHtml(greeting)},</p>
<p style="margin:0 0 1em;">Most new businesses end up with three vendors, four invoices, and a brief nobody actually owns.</p>
<p style="margin:0 0 1em;">I do all three — brand, site, growth — out of Hertfordshire. 12 years in. Saw <strong>${escapeHtml(company || 'your company')}</strong> on Companies House. Recently incorporated, local, building.</p>
<p style="margin:0 0 1em;">20 minutes — save yourself the agency runaround?</p>
<p style="margin:0;">Terence<br><a href="https://terencemeghani.com" style="color:#1a1a1a;">terencemeghani.com</a></p>
<hr style="border:none;border-top:1px solid #e8e8e4;margin:28px 0 14px;">
<p style="font-size:12px;color:#888;margin:0;">Not a fit? <a href="${unsubUrl}" style="color:#888;">Unsubscribe</a>.</p>
<img src="${trackUrl}" alt="" width="1" height="1" style="display:block;border:0;width:1px;height:1px;">
</body></html>`;

  return { subject, html, text };
}

async function fetchLeads(sheets) {
  const range = `${cfg.sheet}!A:${SHEET_RANGE_END}`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: cfg.sheetId, range });
  const rows = res.data.values || [];
  return rows.map((data, i) => ({ rowNum: i + 1, data }));
}

async function markRow(sheets, rowNum, status, sentAt = '', errMsg = '') {
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: cfg.sheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        { range: `${cfg.sheet}!${colLetter(COLUMNS.STATUS)}${rowNum}`,     values: [[status]] },
        { range: `${cfg.sheet}!${colLetter(COLUMNS.SENT_AT)}${rowNum}`,    values: [[sentAt]] },
        { range: `${cfg.sheet}!${colLetter(COLUMNS.SEND_ERROR)}${rowNum}`, values: [[errMsg]] },
      ],
    },
  });
}

async function main() {
  requireEnv();
  const sheets = getSheets();
  const resend = new Resend(cfg.resendKey);

  const all = await fetchLeads(sheets);
  const pending = all
    .filter(({ data }) => {
      const status = String(data[COLUMNS.STATUS] || '').toLowerCase().trim();
      const email  = String(data[COLUMNS.EMAIL]  || '').trim();
      return status === 'new' && email.includes('@');
    })
    .slice(0, cfg.limit);

  console.log(`Sheet rows: ${all.length}. Eligible (status=new, email present): ${pending.length}.`);
  if (!pending.length) {
    console.log('Nothing to send. Add emails to status=new rows or check column mapping.');
    return;
  }
  if (dryRun) console.log('— DRY RUN — no emails will actually be sent.');

  let sent = 0;
  let failed = 0;

  for (const { rowNum, data } of pending) {
    const email = data[COLUMNS.EMAIL].trim();
    const { subject, html, text } = buildEmail(data);

    if (dryRun) {
      console.log(`[dry] row ${rowNum} → ${email}\n      subject: ${subject}`);
      continue;
    }

    try {
      const res = await resend.emails.send({
        from: cfg.fromAddr,
        to: email,
        subject,
        html,
        text,
      });
      if (res.error) throw new Error(res.error.message || JSON.stringify(res.error));
      await markRow(sheets, rowNum, 'sent', new Date().toISOString());
      sent++;
      console.log(`✓ row ${rowNum} → ${email}`);
    } catch (e) {
      const msg = e?.message || String(e);
      try { await markRow(sheets, rowNum, 'failed', '', msg); } catch { /* swallow */ }
      failed++;
      console.error(`✗ row ${rowNum} → ${email}: ${msg}`);
    }

    await new Promise((r) => setTimeout(r, cfg.delayMs));
  }

  console.log(`\nDone. Sent: ${sent}. Failed: ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
