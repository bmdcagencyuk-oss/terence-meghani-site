import { Hero } from '@/components/hero/Hero';
import { HazardStripe } from '@/components/sections/HazardStripe';
import { Ticker } from '@/components/sections/Ticker';
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
    </>
  );
}
