import { Hero } from '@/components/hero/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { WorkCarousel } from '@/components/sections/WorkCarousel';
import { WhyMe } from '@/components/sections/WhyMe';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactForm } from '@/components/sections/ContactForm';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllTestimonials } from '@/lib/case-studies';
import { homeSchema } from '@/lib/schema';

export default function Home() {
  const testimonials = getAllTestimonials();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema()) }}
      />
      <Hero />
      <Manifesto />
      <ServicesGrid />
      <WorkCarousel />
      <WhyMe />
      <Testimonials items={testimonials} />
      <FAQ />
      <ContactForm />
      <LaunchCTA headline="brand" />
    </>
  );
}
