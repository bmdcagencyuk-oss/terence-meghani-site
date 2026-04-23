'use client';

import { useState } from 'react';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import servicesData from '@/data/services.json';
import { cn } from '@/lib/utils';

const BUDGETS = ['<£5k', '£5–15k', '£15–40k', '£40k+', 'Retainer', 'Unsure'] as const;

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [service, setService] = useState('Not sure yet');
  const [budget, setBudget] = useState<string>('Unsure');
  const [msgLen, setMsgLen] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      service,
      budget,
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''), // honeypot
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Send failed');
      }
      setState('success');
      form.reset();
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const inputClass =
    'w-full bg-transparent border-b-2 border-hairline focus:border-rocket text-white py-3 px-1 outline-none transition-colors placeholder:text-fog';
  const labelClass = 'block font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-1';

  if (state === 'success') {
    return (
      <section id="contact" className="section-pad bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
          <Kicker className="text-rocket">Message received</Kicker>
          <h2
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-md)' }}
          >
            Thanks — I&rsquo;ll be in touch within{' '}
            <em className="font-italic italic text-rocket">48 hours.</em>
          </h2>
          <p className="mt-6 text-mist text-lg">
            In the meantime, feel free to{' '}
            <a
              href="https://calendly.com/terencemeghani"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rocket underline underline-offset-4"
            >
              book a call
            </a>{' '}
            if something&rsquo;s time-sensitive.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-pad bg-char">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <Kicker>Get in touch</Kicker>
        <h2
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-md)' }}
        >
          Got a brief?{' '}
          <em className="font-italic italic text-rocket">Let&rsquo;s hear it.</em>
        </h2>
        <p className="mt-6 text-mist text-lg max-w-2xl">
          Whether you want a 30-minute call to sanity-check a project, or a detailed
          scope for something bigger — drop the details below. I read every enquiry
          personally and reply within 48 hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7" noValidate>
          {/* Honeypot — hidden from real users, visible to bots */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Website (leave blank)</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                aria-required="true"
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-required="true"
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className={labelClass}>
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className={inputClass}
              placeholder="Optional"
            />
          </div>

          <div>
            <label htmlFor="service" className={labelClass}>
              Service interest *
            </label>
            <select
              id="service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              aria-required="true"
              className={cn(inputClass, 'appearance-none cursor-pointer')}
            >
              <option className="bg-char">Not sure yet</option>
              {servicesData.services.map((s) => (
                <option key={s.slug} className="bg-char">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Budget *</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {BUDGETS.map((b) => (
                <Chip
                  key={b}
                  label={b}
                  active={budget === b}
                  onClick={() => setBudget(b)}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              Message * (min 20 chars)
            </label>
            <textarea
              id="message"
              name="message"
              required
              aria-required="true"
              minLength={20}
              rows={5}
              onChange={(e) => setMsgLen(e.target.value.length)}
              className={cn(inputClass, 'resize-none')}
              placeholder="What are you trying to get done?"
            />
            <div className="mt-1 text-right font-mono text-[10px] text-fog">
              {msgLen} / 20
            </div>
          </div>

          {state === 'error' && (
            <p role="alert" className="text-rocket text-sm">
              {errorMsg || 'Something went wrong — please try again or email hello@terencemeghani.com directly.'}
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={state === 'submitting'}
              ariaBusy={state === 'submitting'}
            >
              {state === 'submitting' ? 'Sending…' : 'Send enquiry'}
            </Button>
            <span className="font-mono text-[10px] uppercase tracking-wider text-fog">
              Or{' '}
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rocket underline underline-offset-4"
              >
                book a call ↗
              </a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
