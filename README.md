# terencemeghani.com

Next.js 15 rebuild of terencemeghani.com.
Brand consultant & developer — Hertfordshire & London.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env — copy and fill in
cp .env.example .env.local
# Edit .env.local with your RESEND_API_KEY etc.

# 3. Dev
npm run dev       # http://localhost:3000

# 4. Production build
npm run build
npm run start
```

## Stack

- **Next.js 15.5** — App Router, Server Components by default, Turbopack
- **React 19** — the current stable line
- **Tailwind v4** — CSS-first config in `app/globals.css` (`@theme` block)
- **framer-motion 12** — animations
- **GSAP 3** — per-letter hero interactions
- **Lenis** — smooth scroll
- **next-mdx-remote 5** — case-study narratives from MDX
- **next-plausible** — analytics (no cookies)
- **resend 4 + @react-email/components 1** — contact form email pipeline
- **lucide-react 1.8** — icons
- **TypeScript strict**, ESLint (Next config)

## Project structure

```
app/
  page.tsx                       home
  about/page.tsx
  work/page.tsx                  /work/ grid with filter chips
  work/[slug]/page.tsx           dynamic case-study — reads MDX + JSON
  services/[slug]/page.tsx       dynamic service page — per-slug copy
  engage/growth-partnership/     canonical URL for growth partnership
  reviews/page.tsx
  contact/page.tsx
  privacy/ terms/ cookies/       legal placeholders
  api/contact/route.ts           POST → Resend
  robots.ts, sitemap.ts
  opengraph-image.tsx            dynamic OG card via next/og
  layout.tsx, not-found.tsx, globals.css

components/
  ui/         Button, Chip, Kicker, Emblem
  common/     Footer, SkipLink, FallbackImg
  nav/        TopNav, MegaMenu, MobileMenu
  hero/       Hero, RocketCanvas, HeroFuelLetters
  sections/   Manifesto, ServicesGrid, WorkCarousel, WhyMe,
              Testimonials, FAQ, ContactForm
  launch/     Countdown, Starfield, LaunchCTA
  case-study/ WorkCard, WorkGrid, CaseStudyHero, CaseStudyMeta,
              CaseStudyAct, CaseStudyMetric, CaseStudyQuote, CaseStudyRelated

content/case-studies/
  24 x {slug}.mdx — three-act narratives in voice 2

data/
  case-studies.json   (24 studies, with featured order + related)
  testimonials.json   (20 reviews, 4 matched to case studies)
  services.json       (4 core + 3 secondary)
  redirects.json      (41 permanent redirects from the WP site)

emails/
  contact.tsx         React Email template for contact form

lib/
  utils.ts            cn() helper
  case-studies.ts     typed loaders, MDX narrative parser
  schema.ts           JSON-LD generators (Person/Org/CreativeWork/LocalBusiness)

middleware.ts         41-entry redirect map, 301s, skips /api, /_next
```

## Environment variables

See `.env.example`. Required:

| Var | Where it's used |
|-----|-----------------|
| `RESEND_API_KEY` | `app/api/contact/route.ts` — contact form email |
| `CONTACT_FORM_TO` | same — recipient inbox |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `app/layout.tsx` — analytics domain |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Case-study hero images (URLs are baked into JSON) |
| `NEXT_PUBLIC_SITE_URL` | Sitemap + OG card base URL (defaults to `https://terencemeghani.com`) |

## Pre-launch checklist

Before DNS cutover from the WordPress site:

- [ ] Verify 18 tail case-study Cloudinary hero URLs exist (6 flagships verified).
      `WorkCard` and `CaseStudyHero` already fall back to client initials if a 404 occurs.
- [ ] Add `terencemeghani.com` to Plausible as a new site
- [ ] Verify `terencemeghani.com` with Resend (SPF + DKIM)
- [ ] Set all env vars in Vercel
- [ ] Run Lighthouse against a Vercel preview URL — target 95+ on all four pillars
- [ ] Commission real headshot — `public/hero-placeholder.svg` is the interim
- [ ] Submit new sitemap to Google Search Console; mark old URLs as moved
- [ ] Lower DNS TTL 24h before cutover

## Version drift from the original spec (all functional)

| Package | Spec | Actual | Why |
|---------|------|--------|-----|
| `framer-motion` | `^11` | `^12` | Latest stable; API-compatible |
| `lucide-react` | `^0.383` | `^1.8` | Required for React 19 peer |
| `@react-email/components` | `^0.0.20` | `^1.0` | Required for React 19 peer |
| `services.json` growth-partnership icon | `Diamond` | `Gem` | Canonical Lucide name |

## Data integrity sign-off

All four data files pass integrity checks:
- JSON parses cleanly
- Tag distribution: 15 Brand / 17 Web / 17 Marketing / 3 PPC / 12 Photography
- All `testimonialId` references resolve
- All 24 case-study slugs have matching redirects + MDX files
- 4 core + 3 secondary services

The three tag corrections agreed during handover are baked in:
- `news-uk` → `["Brand", "Web"]`
- `fireaway-pizza` → `["Web", "Marketing", "Photography"]`
- `dcd-connect` → `["Marketing", "Photography"]` (Brand removed)

## Build verification

`npm run build` has been run in this sandbox and passes:
- 46 pages generate (24 case studies + 7 service routes + 9 static + middleware + API + OG image)
- First Load JS shared: 102 kB; heaviest page (home): 164 kB
- TypeScript strict: no errors
- ESLint: passes (2 `<img>` warnings on components that use external Cloudinary URLs — intentional, not blocking)

## Things that might catch you on a fresh clone

1. **First `npm run build` will pull four Google Fonts** (Bricolage, Instrument Sans, Instrument Serif, JetBrains Mono) — needs internet access to fonts.googleapis.com.
2. **Middleware redirects** use exact-path matching with optional trailing slash — new redirects go in `data/redirects.json`.
3. **Case-study narratives** live in `content/case-studies/*.mdx` and are parsed at build time. Adding a new study = add to `data/case-studies.json` AND write the MDX file.
