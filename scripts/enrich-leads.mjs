#!/usr/bin/env node
/**
 * Enrich leads with website + email.
 *
 * For each lead where STATUS='new' and EMAIL is empty, searches
 * DuckDuckGo for the company name + locality, picks the first non-aggregator
 * result, fetches homepage + common contact pages, regex-extracts on-domain
 * emails, and writes the best match (and the discovered website URL) back
 * to the sheet.
 *
 * Free, best-effort. Hit rate depends on whether the company has a public
 * site with a published email — expect ~30–50% on a typical Companies
 * House batch. The rest need a paid finder (Hunter, Apollo) or manual
 * research; nothing about that is wired up here.
 *
 * Usage:
 *   npm run enrich                  process up to LEADS_ENRICH_LIMIT (default 30)
 *   npm run enrich -- --dry-run     preview without writing
 *   npm run enrich -- --limit 5     one-off smoke test
 *
 * Required .env (same as scrape):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *
 * Optional:
 *   LEADS_SHEET_NAME           default "Leads"
 *   LEADS_ENRICH_LIMIT         default 30
 *   LEADS_ENRICH_DELAY_MS      default 3000 (gap between searches — DDG limits)
 */

import { google } from 'googleapis';

/* Reuses the scraper's column layout. Discovered websites are written to
   column P (index 15, "NOTES" in scrape-leads.mjs — left empty by the
   scraper so we repurpose it). */
const COLUMNS = {
  ID:           0,
  COMPANY_NAME: 1,
  EMAIL:        2,
  LOCALITY:     8,
  STATUS:       14,
  WEBSITE:      15,
};
const SHEET_RANGE_END = 'V';

/* Aggregator and social hosts that frequently rank above a company's own
   site for thin-website companies. Skip them so we don't pick e.g.
   yell.com or linkedin.com as the lead's "website". */
const HOST_BLOCKLIST = [
  'yell.com', 'linkedin.com', 'facebook.com', 'instagram.com',
  'twitter.com', 'x.com', 'youtube.com', 'tiktok.com', 'pinterest.com',
  'companieshouse.gov.uk',
  'find-and-update.company-information.service.gov.uk',
  'endole.co.uk', 'companycheck.co.uk', 'check-a-company.co.uk',
  'opencorporates.com', 'companiesintheuk.co.uk', 'duedil.com',
  'gov.uk', 'wikipedia.org', 'wikiwand.com',
  'duckduckgo.com', 'google.com', 'bing.com',
];

const PREFERRED_LOCAL_PARTS = [
  'hello', 'info', 'contact', 'enquiries', 'enquiry',
  'sales', 'admin', 'office', 'team',
];

const PAGES = ['/', '/contact', '/contact-us', '/about', '/about-us', '/team', '/get-in-touch'];

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = (() => {
  const i = args.indexOf('--limit');
  if (i === -1) return null;
  const n = Number(args[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : null;
})();

const cfg = {
  saEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  saKey:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  sheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  sheet:   process.env.LEADS_SHEET_NAME || 'Leads',
  limit:   limitArg ?? Number(process.env.LEADS_ENRICH_LIMIT || 30),
  delayMs: Number(process.env.LEADS_ENRICH_DELAY_MS || 3000),
};

function requireEnv() {
  const missing = ['saEmail', 'saKey', 'sheetId'].filter((k) => !cfg[k]);
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

function cleanCompanyName(name) {
  return String(name || '')
    .replace(/\b(LIMITED|LTD|PLC|LLP|UK|GROUP|HOLDINGS|COMPANY|CO)\b\.?/gi, '')
    .replace(/[^\w\s&-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function domainMatchesCompany(domain, companyName) {
  const cleaned = cleanCompanyName(companyName).toLowerCase();
  const tokens = cleaned.split(/\s+/).filter((t) => t.length >= 4);
  if (!tokens.length) return true; /* short names — accept and let visitor decide */
  const domainName = domain.split('.')[0].toLowerCase().replace(/[-_]/g, '');
  return tokens.some(
    (word) => domainName.includes(word.replace(/[-_]/g, '')) || word.includes(domainName),
  );
}

async function searchWebsite(companyName, locality) {
  const cleaned = cleanCompanyName(companyName);
  const q = locality ? `${cleaned} ${locality} UK` : `${cleaned} UK`;
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
  let html;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':       UA,
        'Accept-Language':  'en-GB,en;q=0.9',
        Accept:             'text/html',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }
  const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/g)];
  for (const m of matches) {
    let href = m[1];
    if (href.startsWith('//')) href = 'https:' + href;
    try {
      const wrapper = new URL(href, 'https://duckduckgo.com');
      const inner   = wrapper.searchParams.get('uddg');
      const target  = inner ? new URL(decodeURIComponent(inner)) : wrapper;
      const host    = target.hostname.replace(/^www\./, '');
      if (HOST_BLOCKLIST.some((b) => host === b || host.endsWith('.' + b))) continue;
      if (!domainMatchesCompany(host, companyName)) continue;
      return host;
    } catch {
      continue;
    }
  }
  return null;
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers:  { 'User-Agent': UA },
      redirect: 'follow',
      signal:   AbortSignal.timeout(10000),
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

async function findEmailsOnDomain(domain) {
  const found = new Set();
  for (const path of PAGES) {
    const html = await fetchPage(`https://${domain}${path}`);
    if (!html) continue;
    const matches = html.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g);
    for (const m of matches) {
      const e = m[0].toLowerCase();
      /* TLD must be alphabetic — kills version-number false-positives
         like `intl-segmenter@11.7.10` that match the loose email shape. */
      const tld = e.split('.').pop();
      if (!/^[a-z]{2,}$/.test(tld)) continue;
      if (e.endsWith('.png') || e.endsWith('.jpg') || e.endsWith('.svg') || e.endsWith('.gif') || e.endsWith('.webp')) continue;
      if (e.includes('@example.') || e.includes('@sentry.io') || e.includes('@wixpress.com')) continue;
      if (e.includes('@2x') || e.includes('@3x')) continue;
      found.add(e);
    }
  }
  return [...found];
}

function pickBestEmail(emails, domain) {
  const onDomain = emails.filter((e) => e.endsWith('@' + domain) || e.endsWith('.' + domain));
  const pool     = onDomain.length ? onDomain : emails;
  for (const part of PREFERRED_LOCAL_PARTS) {
    const m = pool.find((e) => e.startsWith(part + '@'));
    if (m) return m;
  }
  return pool[0] || null;
}

async function fetchLeads(sheets) {
  const range = `${cfg.sheet}!A:${SHEET_RANGE_END}`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: cfg.sheetId, range });
  return (res.data.values || []).map((data, i) => ({ rowNum: i + 1, data }));
}

async function writeEnrichment(sheets, rowNum, email, website) {
  const data = [];
  if (email) data.push({
    range:  `${cfg.sheet}!${colLetter(COLUMNS.EMAIL)}${rowNum}`,
    values: [[email]],
  });
  if (website) data.push({
    range:  `${cfg.sheet}!${colLetter(COLUMNS.WEBSITE)}${rowNum}`,
    values: [[`https://${website}`]],
  });
  if (!data.length) return;
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: cfg.sheetId,
    requestBody:   { valueInputOption: 'RAW', data },
  });
}

async function main() {
  requireEnv();
  const sheets  = getSheets();
  const all     = await fetchLeads(sheets);
  const pending = all
    .filter(({ data }) => {
      const status = String(data[COLUMNS.STATUS] || '').toLowerCase().trim();
      const email  = String(data[COLUMNS.EMAIL]  || '').trim();
      return status === 'new' && !email;
    })
    .slice(0, cfg.limit);

  console.log(`Sheet rows: ${all.length}. Eligible (status=new, no email): ${pending.length}.`);
  if (!pending.length) return;
  if (dryRun) console.log('— DRY RUN — no writes will happen.');

  let found = 0;

  for (const { rowNum, data } of pending) {
    const company  = data[COLUMNS.COMPANY_NAME];
    const locality = data[COLUMNS.LOCALITY] || '';
    if (!company) continue;

    process.stdout.write(`row ${rowNum} ${company} … `);
    const domain = await searchWebsite(company, locality);
    if (!domain) {
      console.log('no website');
      await sleep(cfg.delayMs);
      continue;
    }

    const emails = await findEmailsOnDomain(domain);
    const best   = pickBestEmail(emails, domain);
    if (!best) {
      console.log(`${domain} (no email)`);
      if (!dryRun) await writeEnrichment(sheets, rowNum, null, domain);
      await sleep(cfg.delayMs);
      continue;
    }

    console.log(`${best} (via ${domain})`);
    found++;
    if (!dryRun) await writeEnrichment(sheets, rowNum, best, domain);
    await sleep(cfg.delayMs);
  }

  console.log(`\nDone. Found emails for ${found}/${pending.length} leads.`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
