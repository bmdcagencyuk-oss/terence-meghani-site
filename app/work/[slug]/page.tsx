import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero';
import { CaseStudyMeta } from '@/components/case-study/CaseStudyMeta';
import { CaseStudyAct, ActProse } from '@/components/case-study/CaseStudyAct';
import { CaseStudyMetric } from '@/components/case-study/CaseStudyMetric';
import { CaseStudyQuote } from '@/components/case-study/CaseStudyQuote';
import { CaseStudyGallery } from '@/components/case-study/CaseStudyGallery';
import { CaseStudyRelated } from '@/components/case-study/CaseStudyRelated';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getRelatedCaseStudies,
  getTestimonialById,
  loadCaseStudyNarrative,
} from '@/lib/case-studies';
import { caseStudySchema } from '@/lib/schema';

export function generateStaticParams() {
  return getAllCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return { title: 'Not found' };
  return {
    title: `${cs.client} — ${cs.projectTitle}`,
    description: cs.excerpt,
    openGraph: {
      title: `${cs.client} — ${cs.projectTitle}`,
      description: cs.excerpt,
      images: cs.heroImage ? [{ url: cs.heroImage, alt: cs.heroImageAlt }] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const narrative = loadCaseStudyNarrative(slug);
  const testimonial = cs.testimonialId ? getTestimonialById(cs.testimonialId) : undefined;
  const related = getRelatedCaseStudies(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema(cs)) }}
      />
      <CaseStudyHero study={cs} />
      <CaseStudyMeta study={cs} />

      {narrative && (
        <>
          <CaseStudyAct number="01" label="Challenge">
            <ActProse text={narrative.challenge} />
          </CaseStudyAct>

          <CaseStudyAct number="02" label="Approach" className="bg-char-2">
            <ActProse text={narrative.approach} />
          </CaseStudyAct>

          <CaseStudyAct number="03" label="Outcome" id="outcome">
            <ActProse text={narrative.outcome} />
            {cs.metric && <CaseStudyMetric metric={cs.metric} />}
          </CaseStudyAct>
        </>
      )}

      {testimonial && <CaseStudyQuote testimonial={testimonial} client={cs.client} />}

      {cs.gallery && cs.gallery.length > 1 && (
        <CaseStudyGallery images={cs.gallery} alt={cs.heroImageAlt} />
      )}

      <CaseStudyRelated related={related} />

      <LaunchCTA headline={`brand like ${cs.client}'s`} />
    </>
  );
}
