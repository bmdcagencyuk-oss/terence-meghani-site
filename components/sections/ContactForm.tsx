'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      form.reset();
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <section className="py-20" style={{ background: 'var(--color-char)' }}>
      <div className="wrap" style={{ maxWidth: 640 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: '#fff',
            marginBottom: 24,
          }}
        >
          Get in touch.
        </h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <label>
            <span style={{ display: 'block', color: 'var(--color-mist)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Your name</span>
            <input name="name" required autoComplete="name" style={inputStyle} />
          </label>
          <label>
            <span style={{ display: 'block', color: 'var(--color-mist)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Email</span>
            <input name="email" type="email" required autoComplete="email" style={inputStyle} />
          </label>
          <label>
            <span style={{ display: 'block', color: 'var(--color-mist)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Message</span>
            <textarea name="message" required rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="nav-cta"
            style={{ justifySelf: 'start' }}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'success' && (
            <p style={{ color: 'var(--color-cyan)' }}>Thanks — I&rsquo;ll be in touch shortly.</p>
          )}
          {status === 'error' && (
            <p style={{ color: 'var(--color-rocket)' }}>Error: {error}</p>
          )}
        </form>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 14px',
  background: 'var(--color-char-2)',
  border: '1px solid var(--color-hairline)',
  color: '#fff',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
};
