/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getAllPlugins } from '@/lib/plugins';

export function Footer() {
  const plugins = getAllPlugins();
  return (
    <footer id="contact">
      <span className="f-emblem-watermark" aria-hidden="true" />
      <div className="wrap">
        <div className="f-top">
          <div className="f-brand-block">
            <div className="f-brand">
              <span className="e" aria-hidden="true" />
              Terence Meghani
            </div>
            <p className="f-tagline">
              Studio of one — brand, code, growth. WordPress operations, plugin
              development, AI and automation, strategy-led brand work.
            </p>
            <span className="f-location">Hertfordshire &amp; London · UK</span>
          </div>

          <div className="f-col">
            <h5>Services</h5>
            <ul>
              <li className="primary"><Link href="/services/wordpress-operations/">WordPress Operations</Link></li>
              <li className="primary"><Link href="/services/wordpress-plugin-development/">WordPress Plugins</Link></li>
              <li className="primary"><Link href="/services/ai-automation/">AI &amp; Automation</Link></li>
              <li className="primary"><Link href="/services/brand-identity/">Brand &amp; Identity</Link></li>
              <li><Link href="/services/web-development/">Web Development</Link></li>
              <li><Link href="/services/seo-organic-growth/">SEO &amp; Organic Growth</Link></li>
              <li><Link href="/engage/growth-partnership/">Growth Partnership</Link></li>
            </ul>
          </div>

          <div className="f-col">
            <h5>Plugins</h5>
            <ul>
              {plugins.map((p) => (
                <li key={p.slug}>
                  <Link href={`/plugins/${p.slug}/`}>{p.name}</Link>
                </li>
              ))}
              <li className="primary"><Link href="/plugins/">All plugins →</Link></li>
            </ul>
          </div>

          <div className="f-col">
            <h5>Studio</h5>
            <ul>
              <li><Link href="/about/">About</Link></li>
              <li><Link href="/work/">Selected work</Link></li>
              <li><Link href="/reviews/">Reviews</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><Link href="/#services">All services</Link></li>
            </ul>
          </div>

          <div className="f-col contact">
            <h5>Contact</h5>
            <ul>
              <li>
                <span className="k">Email</span>
                <a href="mailto:hello@terencemeghani.com">hello@terencemeghani.com</a>
              </li>
              <li>
                <span className="k">Phone</span>
                <a href="tel:+442045245111">020 4524 5111</a>
              </li>
              <li>
                <span className="k">Studio</span>
                <span style={{ color: '#fff' }}>Hertfordshire &amp; London · UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="f-bottom">
          <span>© Terence Meghani {new Date().getFullYear()} · All rights reserved</span>
          <div className="legal">
            <a
              href="https://www.linkedin.com/in/terencemeghani/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-badge"
            >
              LinkedIn
            </a>
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <Link href="/cookies/">Cookies</Link>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>

        <div className="f-tagline-bottom">
          <img
            src="/brand/emblem-gorilla.svg"
            alt=""
            aria-hidden="true"
            className="f-gorilla"
          />
          <em>Built to compound.</em>
        </div>
      </div>
    </footer>
  );
}
