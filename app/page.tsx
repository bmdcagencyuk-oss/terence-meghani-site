import type { Metadata } from 'next';
import { Hero } from '@/components/hero/Hero';
import { HazardStripe } from '@/components/sections/HazardStripe';
import { Ticker } from '@/components/sections/Ticker';
import { About } from '@/components/sections/About';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Why } from '@/components/sections/Why';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ, FAQ_ITEMS } from '@/components/sections/FAQ';
import { Launch } from '@/components/sections/Launch';
import { faqPageSchema, ldJsonProps } from '@/lib/schema';

const HOME_TITLE =
  'Terence Meghani — Brand consultant & WordPress engineer · Hertfordshire & London';
const HOME_DESCRIPTION =
  'Brand consultant and WordPress engineer in Hertfordshire & London. Strategy-led brand identity, custom plugin development, AI workflows, and engineering-grade WordPress operations. From £6,500.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
  },
  twitter: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <script {...ldJsonProps(faqPageSchema(FAQ_ITEMS))} />
      <Hero />
      <HazardStripe />
      <Ticker />
      <About />
      <Manifesto />
      <Services />
      <Work />
      <Why />
      <Testimonials />
      <FAQ />
      <Launch />
    </>
  );
}
