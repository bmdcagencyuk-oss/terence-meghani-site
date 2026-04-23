'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'How do you work — project or retainer?',
    answer:
      "Both. Most engagements start as a defined project (brand, website, plugin). Many evolve into a monthly Growth Partnership once we've proven the fit.",
  },
  {
    question: "What's the typical project budget?",
    answer:
      'Projects range from £5k for a focused piece (landing page, brand refresh) to £40k+ for full brand + web + marketing programmes. Growth Partnership retainers start from £2.5k/month.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Brand identities: 4–6 weeks. Websites: 6–10 weeks depending on scope. Plugin development: 2–8 weeks depending on complexity. All quoted transparently upfront.',
  },
  {
    question: 'Do you work with businesses outside London?',
    answer:
      "Yes — I'm based in Hertfordshire & London, but work with clients across the UK and internationally (Morocco, EU, US). Remote-friendly for discovery, kickoff, and review; happy to travel for significant in-person moments.",
  },
  {
    question: 'Who owns the work?',
    answer:
      'You do. Full rights transfer on final invoice. Source files (Figma, InDesign, code repositories) delivered at handover. No lock-in.',
  },
  {
    question: 'Do you maintain what you build?',
    answer:
      'Optionally. Many clients move to a Growth Partnership retainer for ongoing support, updates, and new work. Equally happy to hand over cleanly to your internal team or another agency.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad bg-char">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <Kicker>Frequently asked</Kicker>
        <h2
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-md)' }}
        >
          Questions,{' '}
          <em className="font-italic italic text-rocket">answered.</em>
        </h2>

        <ul className="mt-12 divide-y divide-hairline-subtle border-y border-hairline-subtle">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left py-6 group"
                >
                  <span className="font-display text-xl md:text-2xl text-white pr-6 group-hover:text-rocket transition-colors">
                    {f.question}
                  </span>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={cn(
                      'text-fog group-hover:text-rocket transition-transform shrink-0',
                      isOpen && 'rotate-180 text-rocket',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all',
                    isOpen ? 'max-h-96 pb-6' : 'max-h-0',
                  )}
                >
                  <p className="text-mist text-lg leading-relaxed">{f.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
