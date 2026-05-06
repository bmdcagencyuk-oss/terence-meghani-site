#!/usr/bin/env node
/**
 * Hertfordshire lead scraper.
 *
 * Pulls active companies registered at a Hertfordshire postcode from the
 * Companies House Advanced Search API and appends them as new rows to the
 * Leads Google Sheet. Deduplicated against the existing company_number
 * column. Email is left blank — fill in via Hunter / Apollo / manual
 * enrichment before sending.
 *
 * Required .env vars:
 *   COMPANIES_HOUSE_API_KEY        REST API key (free, register at
 *                                  developer.company-information.service.gov.uk)
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   sheet-write service account
 *   GOOGLE_PRIVATE_KEY             "-----BEGIN PRIVATE KEY-----\n..." with \n preserved
 *   GOOGLE_SHEETS_SPREADSHEET_ID   sheet ID (the long part of the URL)
 *
 * Optional:
 *   LEADS_SHEET_NAME               sheet/tab name (default "Leads")
 *   LEADS_INCORPORATED_FROM        YYYY-MM-DD (default: 2 years ago)
 *   LEADS_LIMIT                    max new rows per run (default 200)
 *
 * Run:
 *   npm run scrape
 */

import crypto from 'crypto';
import { google } from 'googleapis';

const API_BASE = 'https://api.company-information.service.gov.uk';

/* Hertfordshire postcode prefixes that fall (mostly) within the county.
   EN postcodes also cover Enfield/N London, so we narrow to the EN sectors
   Hertsmere/Broxbourne/East Herts use. Adjust if you want a wider catchment. */
const HERTS_PREFIXES = [
  /^AL\d/,
  /^SG\d/,
  /^WD\d/,
  /^HP[1-3]\b/, /* HP1–HP3 covers Hemel Hempstead / Berkhamsted / Tring */
  /^HP[4-5]/,
  /^HP23/,
  /^EN(6|7|8|10|11)/,
];

/* Column layout. Aligned to what sheets-client.js (used by the open-pixel
   and unsubscribe routes) expects: ID=0, EMAIL=2, STATUS=14, OPENED=18,
   UNSUBSCRIBED=21. The other columns are reasonable defaults — adjust
   the indices below to match your actual Leads sheet header row. */
const COLUMNS = {
  ID:               0,
  COMPANY_NAME:     1,
  EMAIL:            2,
  COMPANY_NUMBER:   3,
  SIC_CODES:        4,
  DEDUP_KEY:        5,  /* read by getExistingCompanyNumbers — must hold the company number */
  ADDRESS_1:        6,
  ADDRESS_2:        7,
  LOCALITY:         8,
  POSTCODE:         9,
  INCORPORATED:    10,
  COMPANY_TYPE:    11,
  CH_URL:          12,
  DATE_ADDED:      13,
  STATUS:          14,
  NOTES:           15,
  CONTACT_NAME:    16,
  PHONE:           17,
  OPENED:          18,
  REPLIED:         19,
  REPLIED_AT:      20,
  UNSUBSCRIBED:    21,
};
const ROW_WIDTH = Object.values(COLUMNS).reduce((m, n) => Math.max(m, n), 0) + 1;

const cfg = {
  apiKey:   process.env.COMPANIES_HOUSE_API_KEY,
  saEmail:  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  saKey:    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  sheetId:  process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  sheet:    process.env.LEADS_SHEET_NAME || 'Leads',
  fromDate: process.env.LEADS_INCORPORATED_FROM || daysAgo(730),
  limit:    Number(process.env.LEADS_LIMIT || 200),
};

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}

function colLetter(index) {
  /* 0 → A, 25 → Z, 26 → AA … */
  let n = index;
  let s = '';
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

function requireEnv() {
  const missing = ['apiKey', 'saEmail', 'saKey', 'sheetId'].filter((k) => !cfg[k]);
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function inHerts(pc) {
  if (!pc) return false;
  const code = pc.toUpperCase().replace(/\s+/g, '');
  return HERTS_PREFIXES.some((rx) => rx.test(code));
}

async function chFetch(path, params, retries = 3) {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const auth = 'Basic ' + Buffer.from(cfg.apiKey + ':').toString('base64');
  const res = await fetch(url, { headers: { Authorization: auth } });
  if (res.status === 429 && retries > 0) {
    const wait = 60_000;
    console.log(`Rate limit, waiting ${wait / 1000}s…`);
    await new Promise((r) => setTimeout(r, wait));
    return chFetch(path, params, retries - 1);
  }
  if (!res.ok) {
    throw new Error(`Companies House ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function getSheetsClient() {
  const auth = new google.auth.JWT({
    email:  cfg.saEmail,
    key:    cfg.saKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function getExistingCompanyNumbers(sheets) {
  const col = colLetter(COLUMNS.DEDUP_KEY);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: cfg.sheetId,
    range:         `${cfg.sheet}!${col}:${col}`,
  });
  const rows = res.data.values || [];
  return new Set(
    rows
      .flat()
      .filter(Boolean)
      .map((s) => String(s).trim().toUpperCase()),
  );
}

function makeRow(c) {
  const addr = c.registered_office_address || {};
  const row = new Array(ROW_WIDTH).fill('');
  const set = (col, v) => { row[col] = v == null ? '' : v; };

  set(COLUMNS.ID,             crypto.randomUUID());
  set(COLUMNS.COMPANY_NAME,   c.company_name);
  set(COLUMNS.EMAIL,          ''); /* enrich later */
  set(COLUMNS.COMPANY_NUMBER, c.company_number);
  set(COLUMNS.SIC_CODES,      (c.sic_codes || []).join(', '));
  set(COLUMNS.DEDUP_KEY,      c.company_number);
  set(COLUMNS.ADDRESS_1,      addr.address_line_1);
  set(COLUMNS.ADDRESS_2,      addr.address_line_2);
  set(COLUMNS.LOCALITY,       addr.locality);
  set(COLUMNS.POSTCODE,       addr.postal_code);
  set(COLUMNS.INCORPORATED,   c.date_of_creation);
  set(COLUMNS.COMPANY_TYPE,   c.company_type);
  set(
    COLUMNS.CH_URL,
    `https://find-and-update.company-information.service.gov.uk/company/${c.company_number}`,
  );
  set(COLUMNS.DATE_ADDED,     new Date().toISOString().slice(0, 10));
  set(COLUMNS.STATUS,         'new');
  return row;
}

async function appendRows(sheets, rows) {
  if (!rows.length) return;
  await sheets.spreadsheets.values.append({
    spreadsheetId:    cfg.sheetId,
    range:            `${cfg.sheet}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody:      { values: rows },
  });
}

async function main() {
  requireEnv();
  const sheets   = getSheetsClient();
  const existing = await getExistingCompanyNumbers(sheets);
  console.log(`Existing leads in sheet: ${existing.size}`);
  console.log(`Searching CH from ${cfg.fromDate}, target ${cfg.limit} new leads…`);

  const newRows = [];
  const PAGE = 100;
  let startIndex = 0;
  let scanned = 0;

  while (newRows.length < cfg.limit) {
    const data = await chFetch('/advanced-search/companies', {
      company_status:    'active',
      incorporated_from: cfg.fromDate,
      location:          'Hertfordshire',
      size:              PAGE,
      start_index:       startIndex,
    });
    const items = data.items || [];
    if (!items.length) break;
    scanned += items.length;

    for (const c of items) {
      if (newRows.length >= cfg.limit) break;
      const num = String(c.company_number || '').toUpperCase();
      if (!num || existing.has(num)) continue;
      if (!inHerts(c.registered_office_address?.postal_code)) continue;
      newRows.push(makeRow(c));
      existing.add(num);
    }

    if (items.length < PAGE) break;
    startIndex += PAGE;
    /* CH allows 600 reqs / 5 min — pace at ~2/sec to stay well under. */
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`Scanned ${scanned} CH records, ${newRows.length} new leads to write.`);
  if (newRows.length) {
    await appendRows(sheets, newRows);
    console.log(`Appended ${newRows.length} rows to "${cfg.sheet}".`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
