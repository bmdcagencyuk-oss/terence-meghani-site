import type { Metadata, Viewport } from 'next';
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import './globals.css';
import { TopNav } from '@/components/nav/TopNav';
import { Footer } from '@/components/common/Footer';
import { SkipLink } from '@/components/common/SkipLink';
import { CustomCursor } from '@/components/common/CustomCursor';
import { ScrollProgressBar } from '@/components/common/ScrollProgressBar';
import { FloatingFab } from '@/components/common/FloatingFab';

// Bricolage Grotesque — variable font with width + optical-size axes.
// v23 uses font-variation-settings on .mega .ch to animate wdth 85↔80 during
// FUEL letter pulse, so we must expose the wdth axis here.
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
  metadataBase: new URL('https://terencemeghani.com'),
  title: {
    default: 'Terence Meghani — Give your brand fuel.',
    template: '%s · Terence Meghani',
  },
  description:
    'Brand consultant & developer, Hertfordshire & London. Brand strategy, AI & automation, WordPress plugin development, and web for businesses that want to be remembered. 4.9★ on Trustpilot.',
  keywords: [
    'brand consultant',
    'brand designer',
    'WordPress plugin developer',
    'AI consultant UK',
    'web developer Hertfordshire',
  ],
  authors: [{ name: 'Terence Meghani' }],
  alternates: {
    canonical: '/',
    languages: {
      'en-GB': '/',
      'x-default': '/',
    },
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
    siteName: 'Terence Meghani',
    title: 'Terence Meghani — Give your brand fuel.',
    description:
      'Brand consultant & developer — over a decade of work with News UK, Royal London, NHS, TEDx, BBC, and Fireaway.',
    // og image auto-wired by app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    // twitter image auto-wired by app/opengraph-image.tsx
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#242627',
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
      lang="en-GB"
      className={`${bricolage.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PlausibleProvider domain={plausibleDomain}>
          <CustomCursor />
          <SkipLink />
          <ScrollProgressBar />
          <FloatingFab />
          <TopNav />
          <main id="main">{children}</main>
          <Footer />
        </PlausibleProvider>
      </body>
    </html>
  );
}
