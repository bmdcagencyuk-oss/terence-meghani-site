'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

type Props = {
  source: string;
  /** Show a "Your site URL" field above the email input (Site Audit hero). */
  withUrl?: boolean;
  /** Show optional name field. */
  withName?: boolean;
  submitLabel?: string;
  successMessage?: string;
  /** Visual variant — "panel" for hero (light input on dark panel), "inline" for in-card. */
  variant?: 'panel' | 'inline';
};

const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
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
  padding: '12px 14px',
  background: 'var(--color-char-2)',
  border: '1px solid var(--color-hairline)',
  color: '#fff',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  lineHeight: 1.4,
};

export function LeadCaptureForm({
  source,
  withUrl = false,
  withName = false,
  submitLabel = 'Send',
  successMessage = "Got it. I'll be in touch shortly.",
  variant = 'panel',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source, ...data }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || 'Request failed');
      }
      form.reset();
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: variant === 'inline' ? 10 : 14 }}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {withUrl && (
        <label style={fieldWrap}>
          <span style={labelStyle}>Your site URL</span>
          <input
            name="url"
            type="url"
            placeholder="https://example.com"
            required
            style={inputStyle}
          />
        </label>
      )}

      <label style={fieldWrap}>
        <span style={labelStyle}>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          style={inputStyle}
        />
      </label>

      {withName && (
        <label style={fieldWrap}>
          <span style={labelStyle}>Name (optional)</span>
          <input name="name" autoComplete="name" style={inputStyle} />
        </label>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
          style={{ opacity: status === 'sending' ? 0.6 : 1 }}
        >
          {status === 'sending' ? 'Sending…' : submitLabel}
        </button>
        {variant === 'panel' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-mist)',
            }}
          >
            No spam. One email.
          </span>
        )}
      </div>

      {status === 'success' && (
        <p style={{ color: 'var(--color-cyan, #00E1FF)', fontSize: 14 }}>{successMessage}</p>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--color-rocket)', fontSize: 14 }}>Error: {error}</p>
      )}
    </form>
  );
}
