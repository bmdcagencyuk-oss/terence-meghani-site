import { markOpened } from '../../../_lib/sheets-client'

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
