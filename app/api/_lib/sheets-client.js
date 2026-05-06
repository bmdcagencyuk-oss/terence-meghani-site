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
