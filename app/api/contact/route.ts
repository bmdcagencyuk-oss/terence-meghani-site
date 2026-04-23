import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmail } from '@/emails/contact';

// POST /api/contact
// Payload: { name, email, company?, service, budget, message, website (honeypot) }
export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    name = '',
    email = '',
    company = '',
    service = '',
    budget = '',
    message = '',
    website = '', // honeypot
  } = payload as Record<string, string>;

  // Honeypot — bots fill hidden fields; silently succeed without sending
  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Validation
  if (!name.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json(
      { error: 'Name, email, and message are all required.' },
      { status: 400 },
    );
  }
  if (message.trim().length < 20) {
    return NextResponse.json(
      { error: 'Message must be at least 20 characters.' },
      { status: 400 },
    );
  }
  // Basic email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_FORM_TO || 'hello@terencemeghani.com';
  const from = process.env.CONTACT_FORM_FROM || 'Terence Meghani <hello@terencemeghani.com>';

  if (!apiKey) {
    // In dev, log + succeed so the form flow works without a key
    console.warn('[contact] RESEND_API_KEY missing; logging payload instead of sending');
    console.log({ name, email, company, service, budget, message });
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New enquiry — ${name} · ${service}`,
      react: ContactEmail({ name, email, company, service, budget, message }),
    });
    if (error) {
      console.error('[contact] resend error', error);
      return NextResponse.json({ error: 'Email send failed.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
