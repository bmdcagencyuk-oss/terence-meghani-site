import Link from 'next/link';

export function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="f-cta">
          <div className="f-cta-copy">
            <h3>
              Got a brand, a build, or a bottleneck? <em>Let&apos;s fix it.</em>
            </h3>
            <p>Thirty-minute discovery call — no slides, no fluff. Leave with a concrete next step.</p>
          </div>
          <a
            href="https://calendly.com/terencemeghani"
            target="_blank"
            rel="noopener noreferrer"
            className="f-cta-btn"
            data-cc="go"
          >
            Book a call <span className="icon" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="f-top">
          <div className="f-brand-block">
            <div className="f-brand">
              <span className="e" aria-hidden="true" />
              Terence Meghani
            </div>
            <p className="f-tagline">
              Brand consultant &amp; developer — branding, AI&nbsp;&amp;&nbsp;automation, WordPress plugins and higher-tier web development.
            </p>
            <span className="f-location">Hertfordshire &amp; London · UK</span>
          </div>

          <div className="f-col">
            <h5>Services</h5>
            <ul>
              <li className="primary"><Link href="/services/brand-identity/">Brand &amp; Identity</Link></li>
              <li className="primary"><Link href="/services/ai-automation/">AI &amp; Automation</Link></li>
              <li className="primary"><Link href="/services/wordpress-plugin-development/">WordPress Plugins</Link></li>
              <li className="primary"><Link href="/services/web-development/">Web Development</Link></li>
              <li><Link href="/services/ppc-paid-media/">PPC &amp; Paid Media</Link></li>
              <li><Link href="/services/seo-organic-growth/">SEO &amp; Organic Growth</Link></li>
              <li><Link href="/engage/growth-partnership/">Growth Partnership</Link></li>
            </ul>
          </div>

          <div className="f-col">
            <h5>Studio</h5>
            <ul>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#work">Selected work</Link></li>
              <li><Link href="/#testimonials">Reviews</Link></li>
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
                <a href="tel:+447756267157">+44 (0)7756 267 157</a>
              </li>
              <li>
                <span className="k">Schedule</span>
                <a
                  href="https://calendly.com/terencemeghani"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book 30 min ↗
                </a>
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
          Give your brand <em>fuel.</em>
        </div>
      </div>
    </footer>
  );
}
