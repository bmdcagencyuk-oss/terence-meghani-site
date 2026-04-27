'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-fog)',
};
const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '14px 16px',
  background: 'var(--color-char-2)',
  border: '1px solid var(--color-hairline)',
  color: '#fff',
  fontFamily: 'var(--font-body)',
  fontSize: 16,
  lineHeight: 1.4,
};

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
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 18 }}>
      {/* honeypot — hidden from humans, harvested by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <label style={fieldWrap}>
        <span style={labelStyle}>Name</span>
        <input name="name" required autoComplete="name" style={inputStyle} />
      </label>

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label style={fieldWrap}>
          <span style={labelStyle}>Email</span>
          <input name="email" type="email" required autoComplete="email" style={inputStyle} />
        </label>
        <label style={fieldWrap}>
          <span style={labelStyle}>Company (optional)</span>
          <input name="company" autoComplete="organization" style={inputStyle} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label style={fieldWrap}>
          <span style={labelStyle}>Service</span>
          <select name="service" style={inputStyle}>
            <option value="">— any —</option>
            <option value="brand-identity">Brand &amp; Identity</option>
            <option value="wordpress-plugin-development">WordPress Plugin Development</option>
            <option value="ai-automation">AI &amp; Automation</option>
            <option value="wordpress-operations">WordPress Operations</option>
            <option value="web-development">Web Development</option>
            <option value="seo-organic-growth">SEO &amp; Organic Growth</option>
            <option value="growth-partnership">Growth Partnership</option>
            <option value="other">Something else</option>
          </select>
        </label>
        <label style={fieldWrap}>
          <span style={labelStyle}>Estimated budget</span>
          <select name="budget" style={inputStyle}>
            <option value="">— select —</option>
            <option value="under-5k">Under £5k</option>
            <option value="5-15k">£5k – £15k</option>
            <option value="15-40k">£15k – £40k</option>
            <option value="40k-plus">£40k+</option>
            <option value="retainer">Retainer (monthly)</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </label>
      </div>

      <label style={fieldWrap}>
        <span style={labelStyle}>How can I help?</span>
        <textarea
          name="message"
          required
          minLength={20}
          rows={6}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 160 }}
        />
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
          style={{ opacity: status === 'sending' ? 0.6 : 1 }}
        >
          {status === 'sending' ? 'Sending…' : 'Send brief'}
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mist)' }}>
          Replies under 4 hours
        </span>
      </div>

      {status === 'success' && (
        <p style={{ color: 'var(--color-cyan)', fontSize: 15 }}>
          Thanks — I&rsquo;ll be in touch shortly.
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--color-rocket)', fontSize: 15 }}>Error: {error}</p>
      )}
    </form>
  );
}
