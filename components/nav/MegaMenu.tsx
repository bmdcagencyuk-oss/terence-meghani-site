import Link from 'next/link';

/**
 * Services mega-menu — ported from v23.
 * 3-column grid: Core services (left), Also offering (middle), Featured card (right).
 *
 * Styled via .mega-menu / .mm-* classes in globals.css.
 * The grid restructure fixes the v23 overflow bug where description text
 * wrapping to line 2 broke its indent.
 */

const coreServices = [
  {
    href: '/services/wordpress-operations/',
    icon: '◉',
    title: 'WordPress Operations',
    desc: 'Engineer-grade WordPress operations on retainer.',
  },
  {
    href: '/services/wordpress-plugin-development/',
    icon: '🧩',
    title: 'WordPress Plugins',
    desc: 'Custom plugins & bespoke integrations.',
  },
  {
    href: '/services/ai-automation/',
    icon: '✦',
    title: 'AI & Automation',
    desc: 'Brand-aware AI workflows & custom GPTs.',
  },
  {
    href: '/services/brand-identity/',
    icon: '🎨',
    title: 'Brand & Identity',
    desc: 'Strategy, naming, visual system & voice.',
  },
];

const alsoOffering = [
  { href: '/services/web-development/',     icon: '💻', title: 'Web Development' },
  { href: '/services/ppc-paid-media/',      icon: '📈', title: 'PPC & Paid Media' },
  { href: '/services/seo-organic-growth/',  icon: '🔍', title: 'SEO & Organic Growth' },
  { href: '/engage/growth-partnership/',    icon: '◆',  title: 'Growth Partnership' },
];

interface MegaMenuProps {
  id: string;
  labelledBy: string;
  onItemClick?: () => void;
}

export function MegaMenu({ id, labelledBy, onItemClick }: MegaMenuProps) {
  return (
    <div className="mega-menu" id={id} role="menu" aria-labelledby={labelledBy}>
      {/* Column 1 — Core services */}
      <div className="mm-col">
        <h6>Core services</h6>
        <ul>
          {coreServices.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                role="menuitem"
                className="mm-item"
                onClick={onItemClick}
                data-cursor="link"
              >
                <span className="mm-icon" aria-hidden="true">{s.icon}</span>
                <span className="mm-title">{s.title}</span>
                <span className="mm-desc">{s.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2 — Also offering */}
      <div className="mm-col">
        <h6>Also offering</h6>
        <ul>
          {alsoOffering.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                role="menuitem"
                className="mm-item secondary"
                onClick={onItemClick}
                data-cursor="link"
              >
                <span className="mm-icon" aria-hidden="true">{s.icon}</span>
                <span className="mm-title">{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3 — Featured promo card */}
      <div className="mm-featured">
        <span className="mm-tag">Featured</span>
        <h4>
          Need <em>all four?</em>
        </h4>
        <p>
          Growth Partnership bundles brand, AI, plugin dev and web into one
          monthly engagement.
        </p>
        <Link
          href="/engage/growth-partnership/"
          className="mm-cta"
          role="menuitem"
          onClick={onItemClick}
          data-cursor="link"
        >
          Learn more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
