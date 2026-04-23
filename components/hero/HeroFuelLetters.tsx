'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const QUOTES: Record<string, { q: string; a: string }> = {
  G: { q: 'The aim of art is to represent not the outward appearance of things, but their inward significance.', a: 'Aristotle' },
  i: { q: 'Simplicity is the ultimate sophistication.', a: 'Leonardo da Vinci' },
  v: { q: 'Design is not just what it looks like. Design is how it works.', a: 'Steve Jobs' },
  e: { q: 'Good design is obvious. Great design is transparent.', a: 'Joe Sparano' },
  y: { q: 'The details are not the details. They make the design.', a: 'Charles Eames' },
  o: { q: 'Less, but better.', a: 'Dieter Rams' },
  u: { q: "A brand is no longer what we tell the consumer it is — it is what consumers tell each other it is.", a: 'Scott Cook' },
  r: { q: "Your brand is what people say about you when you're not in the room.", a: 'Jeff Bezos' },
  b: { q: "A logo is a flag, a signature, an escutcheon. A logo doesn't sell, it identifies.", a: 'Paul Rand' },
  a: { q: 'There are three responses to a piece of design — yes, no, and WOW! Wow is the one to aim for.', a: 'Milton Glaser' },
  n: { q: "Don't be afraid to be a fool. Then be a better fool.", a: 'Paula Scher' },
  d: { q: 'Designers are meant to be loved, not to be understood.', a: 'Margaret Oscar' },
};

// "Give your brand" = G, i, v, e, ' ', y, o, u, r, ' ', b, r, a, n, d — 13 letters + 2 spaces
const PHRASE = 'Give your brand';

export function HeroFuelLetters() {
  const [hovered, setHovered] = useState<{ i: number; q: string; a: string } | null>(null);

  return (
    <span className="relative inline-block" aria-label={PHRASE}>
      {PHRASE.split('').map((ch, i) => {
        const isSpace = ch === ' ';
        const quote = QUOTES[ch];
        // The two "r" letters share the same quote; index distinguishes for hover targeting.
        const interactive = !isSpace && !!quote;
        return (
          <span key={i} className="inline-block relative" aria-hidden="true">
            {isSpace ? (
              <span>&nbsp;</span>
            ) : interactive ? (
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setHovered({ i, q: quote.q, a: quote.a })}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered({ i, q: quote.q, a: quote.a })}
                onBlur={() => setHovered(null)}
                className={cn(
                  'inline-block bg-transparent border-0 p-0 m-0 cursor-default transition-colors',
                  'hover:text-rocket focus:text-rocket',
                )}
                aria-hidden="true"
              >
                {ch}
              </button>
            ) : (
              <span>{ch}</span>
            )}
            {hovered?.i === i && (
              <span
                role="tooltip"
                className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-ink/95 border border-hairline text-mist text-[11px] leading-snug font-body px-4 py-3 rounded-md shadow-xl pointer-events-none font-normal tracking-normal normal-case"
                style={{ letterSpacing: 'normal' }}
              >
                <span className="italic text-white">&ldquo;{hovered.q}&rdquo;</span>
                <span className="block mt-2 font-mono text-[10px] uppercase tracking-wider text-fog">
                  — {hovered.a}
                </span>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
