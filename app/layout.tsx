import type { Metadata, Viewport } from 'next';
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { TopNav } from '@/components/nav/TopNav';
import { Footer } from '@/components/common/Footer';
import { SkipLink } from '@/components/common/SkipLink';
import { ScrollProgressBar } from '@/components/common/ScrollProgressBar';
import { FloatingFab } from '@/components/common/FloatingFab';
import { SITE } from '@/lib/site';
import { siteGraph, siteLocalBusinessSchema, ldJsonProps } from '@/lib/schema';

// Bricolage Grotesque — variable font with width + optical-size axes.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  preload: true,
  axes: ['wdth', 'opsz'],
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.defaultTitle,
    template: SITE.titleTemplate,
  },
  description:
    'Studio of one — brand, code, growth. WordPress operations, plugin development, AI and automation, strategy-led brand work. Hertfordshire & London. Built to compound.',
  keywords: [
    'brand consultant',
    'WordPress engineer',
    'WordPress operations',
    'WordPress plugin developer',
    'AI automation',
    'studio of one',
    'Hertfordshire',
    'London',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.studioName,
  alternates: {
    canonical: '/',
    languages: { 'en-GB': '/', 'x-default': '/' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description:
      'Studio of one — brand, code, growth. WordPress operations, plugin development, AI and automation, strategy-led brand work. Built to compound.',
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.defaultTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: 'Studio of one — brand, code, growth. Built to compound.',
    images: ['/opengraph-image'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: SITE.themeColor,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'terencemeghani.com';

  return (
    <html
      lang={SITE.locale}
      className={`${bricolage.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Site-wide Person + ProfessionalService + WebSite @graph */}
        <script {...ldJsonProps(siteGraph())} />
        {/* Site-wide LocalBusiness for knowledge-panel signals */}
        <script {...ldJsonProps(siteLocalBusinessSchema())} />
      </head>
      <body>
        <PlausibleProvider domain={plausibleDomain}>
          <SkipLink />
          <ScrollProgressBar />
          <FloatingFab />
          <TopNav />
          <main id="main">{children}</main>
          <Footer />
        </PlausibleProvider>
        <Analytics />
      </body>
    </html>
  );
}
