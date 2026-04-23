import Link from 'next/link';
import { Emblem } from '@/components/ui/Emblem';
import servicesData from '@/data/services.json';

export function Footer() {
  const year = new Date().getFullYear();
  const coreServices = servicesData.services.filter((s) => s.tier === 'core');
  const secondaryServices = servicesData.services.filter((s) => s.tier === 'secondary');

  return (
    <footer className="relative bg-ink text-mist border-t border-hairline-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-14 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          {/* Brand block */}
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white hover:text-rocket transition-colors"
              aria-label="Terence Meghani home"
            >
              <Emblem size={28} color="currentColor" />
              <span className="font-display text-2xl font-medium tracking-tight">
                Terence Meghani
              </span>
            </Link>
            <p className="text-sm text-mist max-w-sm">
              Brand consultant &amp; developer — branding, AI &amp; automation, WordPress plugins,
              and higher-tier web development. Hertfordshire &amp; London.
            </p>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-fog">
              <li>
                <a href="mailto:hello@terencemeghani.com" className="hover:text-rocket transition-colors">
                  hello@terencemeghani.com
                </a>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <a href="tel:+447756267157" className="hover:text-rocket transition-colors">
                  +44 (0)7756 267 157
                </a>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <a
                  href="https://calendly.com/terencemeghani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rocket transition-colors"
                >
                  Book a call ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {coreServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.url}
                    className="text-white hover:text-rocket transition-colors font-medium"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              {secondaryServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.url}
                    className="text-mist hover:text-rocket transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog mb-4">
              Studio
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about/" className="hover:text-rocket transition-colors">About</Link></li>
              <li><Link href="/work/" className="hover:text-rocket transition-colors">Work</Link></li>
              <li><Link href="/reviews/" className="hover:text-rocket transition-colors">Reviews</Link></li>
              <li><Link href="/contact/" className="hover:text-rocket transition-colors">Contact</Link></li>
              <li>
                <a
                  href="https://www.linkedin.com/in/terencemeghani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rocket transition-colors"
                >
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-hairline-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-wider text-fog">
          <span>© Terence Meghani {year} · All rights reserved</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy/" className="hover:text-rocket transition-colors">Privacy</Link>
            <Link href="/terms/" className="hover:text-rocket transition-colors">Terms</Link>
            <Link href="/cookies/" className="hover:text-rocket transition-colors">Cookies</Link>
            <Link href="/sitemap.xml" className="hover:text-rocket transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
