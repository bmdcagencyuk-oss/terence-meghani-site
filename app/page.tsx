import { Hero } from '@/components/hero/Hero';
import { HazardStripe } from '@/components/sections/HazardStripe';
import { Ticker } from '@/components/sections/Ticker';
import { About } from '@/components/sections/About';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Why } from '@/components/sections/Why';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Launch } from '@/components/sections/Launch';
import { homeSchema } from '@/lib/schema';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema()) }}
      />
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
