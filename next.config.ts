import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
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
};

export default nextConfig;
