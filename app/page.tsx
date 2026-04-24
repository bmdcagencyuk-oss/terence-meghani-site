import { Hero } from '@/components/hero/Hero';
import { HazardStripe } from '@/components/sections/HazardStripe';
import { Ticker } from '@/components/sections/Ticker';
import { About } from '@/components/sections/About';
import { Manifesto } from '@/components/sections/Manifesto';
import { Services } from '@/components/sections/Services';
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
    </>
  );
}
