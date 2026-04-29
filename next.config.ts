import type { NextConfig } from "next";

// Case studies that previously lived at root on the legacy WordPress install
// (e.g. /al-jannah-villa-marrakech/). New canonical URLs live under /work/.
// Listed explicitly so root-level redirect rules can't catch first-class
// routes like /about or /reviews.
const LEGACY_CASE_STUDY_SLUGS = [
  "al-jannah-villa-marrakech",
  "bettafi",
  "dcd-connect",
  "fireaway-pizza",
  "japex-automotive",
  "kbmd",
  "kinnovis",
  "london-kings-clothing",
  "news-uk",
  "pedagogy-club",
  "taur-security",
  "tedx-university-of-salford",
  "tulsi-vagjiani",
  "vijays-virasat",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    const caseStudyRedirects = LEGACY_CASE_STUDY_SLUGS.flatMap((slug) => [
      { source: `/${slug}`,  destination: `/work/${slug}/`, permanent: true },
      { source: `/${slug}/`, destination: `/work/${slug}/`, permanent: true },
    ]);

    return [
      // Apex → www. Code-level safety net for any apex traffic that lands
      // on Vercel; the canonical fix is at Vercel domain settings (mark
      // terencemeghani.com as redirect to www.terencemeghani.com) plus DNS
      // A/AAAA records at the registrar pointing apex at Vercel rather
      // than the legacy WordPress host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "terencemeghani.com" }],
        destination: "https://www.terencemeghani.com/:path*",
        permanent: true,
      },

      // Legacy case studies — old WP slugs at root → /work/<slug>/.
      ...caseStudyRedirects,

      // Legacy /services/branding/ → /services/brand-identity/ (renamed in
      // the rebrand to align with the four-practice taxonomy).
      { source: "/services/branding",  destination: "/services/brand-identity/", permanent: true },
      { source: "/services/branding/", destination: "/services/brand-identity/", permanent: true },

      // PPC & Paid Media sunset — page deleted, send historical traffic to
      // the live services grid on the homepage.
      {
        source: "/services/ppc-paid-media",
        destination: "/#services",
        permanent: true,
      },
      {
        source: "/services/ppc-paid-media/",
        destination: "/#services",
        permanent: true,
      },
    ];
  },
  images: {
    // Whitelist remote hosts that next/image is allowed to optimise. Most case
    // study heroImage values point at Cloudinary (legacy WordPress media that
    // hasn't been migrated into /public yet). Without this entry the image
    // proxy returns 400 and the card shows alt text only.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dmdp4f2wp/**',
      },
    ],
  },
};

export default nextConfig;
