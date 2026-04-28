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
import { SITE } from '@/lib/site';

const HOME_DESCRIPTION =
  'Studio of one — brand, code, growth. WordPress operations, plugin development, AI and automation, strategy-led brand work. Hertfordshire & London. Built to compound.';

export const metadata: Metadata = {
  title: { absolute: SITE.defaultTitle },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE.defaultTitle,
    description: HOME_DESCRIPTION,
    url: '/',
  },
  twitter: {
    title: SITE.defaultTitle,
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
