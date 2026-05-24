#!/bin/bash
# Run this from ~/Desktop/terence-meghani-site
# Sets up the open tracking + unsubscribe API routes

set -e

echo ""
echo "Setting up lead pipeline API routes..."
echo ""

# ── Create directories ──────────────────────────────────────────────────────
mkdir -p app/api/_lib
mkdir -p "app/api/track/open/[leadId]"
mkdir -p app/api/unsubscribe

# ── sheets-client.js ────────────────────────────────────────────────────────
cat > app/api/_lib/sheets-client.js << 'SHEETS'
import { google } from 'googleapis'

const COL = {
  ID:           0,
  EMAIL:        2,
  STATUS:       14,
  OPENED:       18,
  UNSUBSCRIBED: 21,
}

const SHEET = 'Leads'

let _sheets = null

function getSheetsClient() {
  if (_sheets) return _sheets
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  _sheets = google.sheets({ version: 'v4', auth })
  return _sheets
}

async function findRow(columnIndex, value) {
  if (!value) return null
  const sheets = getSheetsClient()
  const colLetter = String.fromCharCode(65 + columnIndex)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range:         `${SHEET}!${colLetter}:${colLetter}`,
  })
  const rows  = res.data.values || []
  const index = rows.findIndex(r => r[0]?.toLowerCase() === value.toLowerCase())
  return index > 0 ? index + 1 : null
}

export const findRowByLeadId = id    => findRow(COL.ID,    id)
export const findRowByEmail  = email => findRow(COL.EMAIL, email)

export async function updateCell(rowNum, columnIndex, value) {
  if (!rowNum) return
  const sheets    = getSheetsClient()
  const colLetter = String.fromCharCode(65 + columnIndex)
  await sheets.spreadsheets.values.update({
    spreadsheetId:    process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range:            `${SHEET}!${colLetter}${rowNum}`,
    valueInputOption: 'RAW',
    requestBody:      { values: [[value]] },
  })
}

export async function markOpened(leadId) {
  const row = await findRowByLeadId(leadId)
  if (row) await updateCell(row, COL.OPENED, 'YES')
}

export async function markUnsubscribed(email) {
  const row = await findRowByEmail(email)
  if (!row) return false
  await Promise.all([
    updateCell(row, COL.UNSUBSCRIBED, 'YES'),
    updateCell(row, COL.STATUS,       'unsubscribed'),
  ])
  return true
}
SHEETS

# ── tracking pixel route ────────────────────────────────────────────────────
cat > "app/api/track/open/[leadId]/route.js" << 'PIXEL'
import { markOpened } from '../../_lib/sheets-client'

const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(request, { params }) {
  const { leadId } = await params
  if (leadId) {
    markOpened(decodeURIComponent(leadId)).catch(() => {})
  }
  return new Response(PIXEL, {
    status: 200,
    headers: {
      'Content-Type':  'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma':        'no-cache',
      'Expires':       '0',
    },
  })
}
PIXEL

# ── unsubscribe route ───────────────────────────────────────────────────────
cat > app/api/unsubscribe/route.js << 'UNSUB'
import crypto               from 'crypto'
import { markUnsubscribed } from '../_lib/sheets-client'

function verifyToken(email, token) {
  const expected = crypto
    .createHmac('sha256', process.env.SIGNING_SECRET || '')
    .update(email.toLowerCase().trim())
    .digest('hex')
    .slice(0, 20)
  return expected === token
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  if (!email || !token || !verifyToken(email, token)) {
    return new Response(html({ success: false }), {
      status:  400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  await markUnsubscribed(email).catch(console.error)

  return new Response(html({ success: true, email }), {
    status:  200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function html({ success, email = '' }) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${success ? "You've been unsubscribed" : "Invalid link"}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9f9f7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;color:#1a1a1a}
    .card{background:#fff;border:1px solid #e8e8e4;border-radius:12px;padding:2.5rem 3rem;max-width:480px;width:100%}
    .icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;font-size:18px;background:${success?'#eaf3de':'#fcebeb'};color:${success?'#3b6d11':'#a32d2d'}}
    h1{font-size:1.125rem;font-weight:500;margin-bottom:.75rem;line-height:1.4}
    p{font-size:.9375rem;color:#555;line-height:1.65;margin-bottom:1.5rem}
    hr{border:none;border-top:1px solid #e8e8e4;margin:1.5rem 0}
    .footer{font-size:.8125rem;color:#999;line-height:1.6}
    a{color:#555}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✓' : '✕'}</div>
    <h1>${success ? "You've been unsubscribed" : "Invalid unsubscribe link"}</h1>
    <p>${success
      ? `<strong>${esc(email)}</strong> has been removed. No further emails will be sent.`
      : "This link is invalid or has already been used. Reply directly if you're still receiving emails."
    }</p>
    <hr/>
    <div class="footer">
      <strong>Terence Meghani</strong> · Brand Consultant &amp; Developer<br>
      Hertfordshire &amp; London · <a href="https://terencemeghani.com">terencemeghani.com</a>
    </div>
  </div>
</body>
</html>`
}
UNSUB

# ── Install dependency ───────────────────────────────────────────────────────
echo "Installing googleapis..."
npm install googleapis --save

echo ""
echo "✓ Files written:"
echo "  app/api/_lib/sheets-client.js"
echo "  app/api/track/open/[leadId]/route.js"
echo "  app/api/unsubscribe/route.js"
echo ""
echo "✓ googleapis installed"
echo ""
echo "Next: add these 4 env vars to Vercel (Settings → Environment Variables):"
echo "  GOOGLE_SERVICE_ACCOUNT_EMAIL"
echo "  GOOGLE_PRIVATE_KEY"
echo "  GOOGLE_SHEETS_SPREADSHEET_ID"
echo "  SIGNING_SECRET"
echo ""
echo "Then: git add . && git commit -m 'add lead pipeline API routes' && git push"
echo ""
