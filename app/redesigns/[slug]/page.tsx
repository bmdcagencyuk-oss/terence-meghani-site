/**
 * app/redesigns/[slug]/page.tsx
 *
 * Renders a redesign demo wrapped in a branded shell with audit findings.
 * Pre-rendered at build time via generateStaticParams.
 *
 * Reads from:
 *   - data/redesigns/{slug}.json         (audit JSON, copied from pipeline)
 *   - public/redesigns/{slug}/index.html (the demo HTML, iframed)
 *   - public/redesigns/{slug}/before-desktop.png (the "before" screenshot)
 *
 * Set `noindex` so demos don't leak into search.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

interface AuditData {
  slug: string;
  prospect: {
    business: string;
    sector: string;
    url: string;
    rating?: string;
    review_count?: string;
    address?: string;
  };
  lighthouse: {
    scores: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
    metrics: {
      lcp?: number | null;
      cls?: number | null;
      tbt?: number | null;
    };
  };
  detection: {
    tech: string[];
    flags: Array<{ severity: string; category: string; message: string }>;
  };
  score: number;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'redesigns');

async function loadAudit(slug: string): Promise<AuditData | null> {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as AuditData;
}

/**
 * Pre-render every demo we have JSON for. Each push to Vercel rebuilds
 * the set — so adding a new demo = sync + commit + push.
 */
export async function generateStaticParams() {
  if (!existsSync(DATA_DIR)) return [];
  const files = await readdir(DATA_DIR);
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audit = await loadAudit(slug);
  if (!audit) return { title: 'Redesign concept' };
  return {
    title: `${audit.prospect.business} — redesign concept | Terence Meghani Studio`,
    description: `A working redesign concept for ${audit.prospect.business}, built in an afternoon. See the before, the after, and the reasoning.`,
    robots: { index: false, follow: false },
  };
}

export default async function RedesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audit = await loadAudit(slug);
  if (!audit) notFound();

  const { prospect, lighthouse, detection, score } = audit;
  const lcpSec = lighthouse.metrics.lcp ? (lighthouse.metrics.lcp / 1000).toFixed(1) : null;
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/terencemeghani/discovery';
  const demoUrl = `/redesigns/${slug}/index.html`;
  const beforeDesktop = `/redesigns/${slug}/before-desktop.png`;

  const sortedFlags = [...detection.flags]
    .sort((a, b) => {
      const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    })
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg tracking-tight">
            <span className="text-2xl">🦍</span>
            <span>Meghani / Studio</span>
          </Link>
          <span className="text-xs uppercase tracking-widest text-stone-500">
            Private preview — not indexed
          </span>
        </div>
      </header>

      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
            Redesign concept · {prospect.sector}
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
            A working redesign for{' '}
            <span className="italic text-stone-600">{prospect.business}</span>,
            <br />
            built in an afternoon.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-600">
            You earned {prospect.rating}★ across {prospect.review_count} reviews on Google. The site
            below doesn&rsquo;t reflect that yet. So I built a version that does — and the
            reasoning is on this page. No obligation, the concept&rsquo;s yours either way.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={calendly}
              className="inline-flex items-center gap-2 bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Book a 15-minute walk-through →
            </a>
            <a
              href="#demo"
              className="text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900"
            >
              Or just see the after
            </a>
          </div>
        </div>
      </section>

      <section id="demo" className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                Before
              </p>
              <h2 className="mb-6 font-serif text-2xl">Your site today</h2>
              <a
                href={prospect.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden border border-stone-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeDesktop}
                  alt={`${prospect.business} current website`}
                  className="w-full grayscale transition hover:grayscale-0"
                />
              </a>
              <p className="mt-3 text-sm text-stone-500">{prospect.url}</p>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                After
              </p>
              <h2 className="mb-6 font-serif text-2xl">What it could be</h2>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden border border-stone-900"
              >
                <iframe
                  src={demoUrl}
                  title={`${prospect.business} redesign concept`}
                  className="h-[420px] w-full"
                  loading="lazy"
                />
              </a>
              <p className="mt-3 text-sm text-stone-500">
                <a
                  href={demoUrl}
                  className="underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
            What the audit found
          </p>
          <h2 className="mb-12 max-w-2xl font-serif text-4xl leading-tight">
            Four things probably costing you bookings.
          </h2>

          <div className="grid gap-px bg-stone-200 md:grid-cols-2">
            {sortedFlags.map((flag, i) => (
              <div key={i} className="bg-stone-50 p-8">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-stone-500">
                  {flag.severity} · {flag.category}
                </p>
                <p className="font-serif text-lg leading-relaxed text-stone-900">{flag.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-px bg-stone-200 md:grid-cols-4">
            {(
              [
                ['Performance', lighthouse.scores.performance],
                ['Accessibility', lighthouse.scores.accessibility],
                ['SEO', lighthouse.scores.seo],
                ['Best Practices', lighthouse.scores.bestPractices],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="bg-white p-6 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-stone-500">{label}</p>
                <p
                  className={`mt-2 font-serif text-5xl ${
                    value >= 90 ? 'text-emerald-600' : value >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
          {lcpSec && (
            <p className="mt-6 text-sm text-stone-500">
              Mobile homepage takes {lcpSec}s to render the main content. Google&rsquo;s &ldquo;good&rdquo;
              threshold is 2.5s. The redesigned version loads in under a second.
            </p>
          )}
        </div>
      </section>

      <section className="bg-stone-900 text-stone-100">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-400">
            Built to compound
          </p>
          <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
            Want the real version?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-stone-300">
            15 minutes on a call. I&rsquo;ll show you the build approach, the timeline, and the
            number. If it&rsquo;s a fit we go. If not, the concept above is still yours to keep.
          </p>
          <a
            href={calendly}
            className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-200"
          >
            Book the call →
          </a>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-8 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>
            Concept by Terence Meghani Studio ·{' '}
            <a
              href="https://terencemeghani.com"
              className="underline decoration-stone-300 hover:decoration-stone-900"
            >
              terencemeghani.com
            </a>
          </p>
          <p>Audit score: {score}/100 · Generated {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </footer>
    </main>
  );
}
