import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
