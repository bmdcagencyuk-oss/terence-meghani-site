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
