import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// POST /api/lead
// Single-field email lead capture used by the Site Audit hero and Q2 2026
// plugin waitlists. Payload: { source, email, name?, url?, website? }
export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    source = '',
    email = '',
    name = '',
    url = '',
    website = '', // honeypot
  } = payload as Record<string, string>;

  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }
  if (!source.trim() || !email.trim()) {
    return NextResponse.json({ error: 'Source and email are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_FORM_TO || 'hello@terencemeghani.com';
  const from = process.env.CONTACT_FORM_FROM || 'Terence Meghani <hello@terencemeghani.com>';

  const lines = [
    `Source: ${source}`,
    `Email: ${email}`,
    name.trim() ? `Name: ${name}` : null,
    url.trim() ? `URL: ${url}` : null,
  ].filter(Boolean) as string[];

  if (!apiKey) {
    console.warn('[lead] RESEND_API_KEY missing; logging payload instead of sending');
    console.log({ source, email, name, url });
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Lead — ${source}`,
      text: lines.join('\n'),
    });
    if (error) {
      console.error('[lead] resend error', error);
      return NextResponse.json({ error: 'Email send failed.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lead] unexpected error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
