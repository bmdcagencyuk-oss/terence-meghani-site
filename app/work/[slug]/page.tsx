import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero';
import { CaseStudyMeta } from '@/components/case-study/CaseStudyMeta';
import { CaseStudyAct, ActProse } from '@/components/case-study/CaseStudyAct';
import { CaseStudyMetric } from '@/components/case-study/CaseStudyMetric';
import { CaseStudyScope } from '@/components/case-study/CaseStudyScope';
import { CaseStudyQuote } from '@/components/case-study/CaseStudyQuote';
import { CaseStudyGallery } from '@/components/case-study/CaseStudyGallery';
import { CaseStudyVideos } from '@/components/case-study/CaseStudyVideos';
import { CaseStudyRelated } from '@/components/case-study/CaseStudyRelated';
import { CaseStudyFigure, CaseStudyFigurePair } from '@/components/case-study/CaseStudyFigure';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getRelatedCaseStudies,
  getTestimonialById,
  loadCaseStudyNarrative,
} from '@/lib/case-studies';
import type { CaseStudy, CaseStudyNarrative } from '@/lib/case-studies';
import { breadcrumbSchema, caseStudySchema, ldJsonProps } from '@/lib/schema';

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
  const title = `${cs.client} — ${cs.projectTitle}`;
  const description = cs.excerpt;
  const url = `/work/${cs.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — Terence Meghani`,
      description,
      url,
      images: cs.heroImage ? [{ url: cs.heroImage, alt: cs.heroImageAlt }] : undefined,
    },
    twitter: {
      title: `${title} — Terence Meghani`,
      description,
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

  const isPedagogyClub = slug === 'pedagogy-club';
  const isBettafi = slug === 'bettafi';
  const customLayout = isPedagogyClub || isBettafi;

  return (
    <>
      <script {...ldJsonProps(caseStudySchema(cs))} />
      <script
        {...ldJsonProps(
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Work', href: '/work/' },
            { name: cs.projectTitle, href: `/work/${cs.slug}/` },
          ]),
        )}
      />
      <CaseStudyHero study={cs} hideHeroImage={customLayout} />
      <CaseStudyMeta study={cs} />

      {narrative && !customLayout && (
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
            <CaseStudyScope study={cs} />
          </CaseStudyAct>
        </>
      )}

      {narrative && isPedagogyClub && <PedagogyClubBody narrative={narrative} cs={cs} />}
      {narrative && isBettafi && <BettafiBody narrative={narrative} cs={cs} />}

      {cs.gallery && cs.gallery.length > 1 && !customLayout && (
        <CaseStudyGallery images={cs.gallery} alt={cs.heroImageAlt} />
      )}

      {cs.videos && cs.videos.length > 0 && (
        <CaseStudyVideos videos={cs.videos} client={cs.client} />
      )}

      {testimonial && <CaseStudyQuote testimonial={testimonial} client={cs.client} />}

      <CaseStudyRelated related={related} />

      <LaunchCTA
        title="Want a project like this?"
        body={`If something here resonates with where you're heading, the next step is a thirty-minute call. No slides, no fluff — leave with a concrete plan whether we work together or not.`}
      />
    </>
  );
}

function BettafiBody({
  narrative,
  cs,
}: {
  narrative: CaseStudyNarrative;
  cs: CaseStudy;
}) {
  const approachParas = narrative.approach.split(/\n{2,}/);
  return (
    <>
      <section className="cs-establishing cs-establishing--tall" aria-label="Bettafi launch landing page">
        <div className="wrap">
          <CaseStudyFigure
            src="/work/bettafi/00-frontend-landing-full.png"
            alt="bettafi.com — the public landing surface. Three product mockups establish the fintech offer; the waitlist form sits below the hero"
            width={3201}
            height={8000}
            priority
            device="desktop"
            sizes="(max-width: 1024px) 90vw, 760px"
            caption='bettafi.com — the public landing surface. Three product mockups establish the fintech offer; the waitlist form sits below the hero; the "App that goes with you" trio (Expense Tracking, AI Planning, Debt Management) names the actual product, not just the queue.'
          />
        </div>
      </section>

      <CaseStudyAct number="01" label="Challenge">
        <ActProse text={narrative.challenge} />
      </CaseStudyAct>

      <CaseStudyAct number="02" label="Approach" className="bg-char-2">
        <div className="cs-prose-with-figures">
          {approachParas[0] && <p>{approachParas[0]}</p>}

          {approachParas[1] && <p>{approachParas[1]}</p>}

          <CaseStudyFigure
            src="/work/bettafi/01-frontend-registration-success.png"
            alt="Post-signup state. Each referral moves the user up five places. Five referrals unlocks a month free; ten unlocks six months; the top 250 receive a two-year free subscription on launch day"
            width={4112}
            height={2406}
            caption="Post-signup state. Each referral moves the user up five places. Five referrals unlocks a month free; ten unlocks six months; the top 250 receive a two-year free subscription on launch day. The rewards are real product credits, not virtual positions."
          />

          {approachParas.slice(2).map((p, i) => (
            <p key={`tail-${i}`}>{p}</p>
          ))}

          <CaseStudyFigure
            src="/work/bettafi/02-frontend-login-track-position.png"
            alt="The login screen — entry point to the authenticated dashboard. The three-bullet value prop on the right is what the dashboard surfaces: position in queue, unique referral code, milestone progress"
            width={4112}
            height={2406}
            caption="The login screen — entry point to the authenticated dashboard. The three-bullet value prop on the right is what the dashboard surfaces: position in queue, unique referral code, milestone progress."
          />
        </div>
      </CaseStudyAct>

      <CaseStudyAct number="03" label="Outcome" id="outcome">
        <ActProse text={narrative.outcome} />
        {cs.metric && <CaseStudyMetric metric={cs.metric} />}
        <CaseStudyScope study={cs} />
      </CaseStudyAct>
    </>
  );
}

function PedagogyClubBody({
  narrative,
  cs,
}: {
  narrative: CaseStudyNarrative;
  cs: CaseStudy;
}) {
  const approachParas = narrative.approach.split(/\n{2,}/);
  return (
    <>
      <section className="cs-establishing" aria-label="Pedagogy Club homepage">
        <div className="wrap">
          <CaseStudyFigure
            src="/work/pedagogy-club/00-frontend-hero-classroom.png"
            alt={cs.heroImageAlt}
            width={4112}
            height={2406}
            priority
            device="desktop"
            sizes="(max-width: 1024px) 90vw, 1000px"
            caption="pedagogy.club homepage — the editorial register sets the tone before any technical mechanism appears."
          />
        </div>
      </section>

      <CaseStudyAct number="01" label="Challenge">
        <ActProse text={narrative.challenge} />
      </CaseStudyAct>

      <CaseStudyAct number="02" label="Approach" className="bg-char-2">
        <div className="cs-prose-with-figures">
          {approachParas[0] && <p>{approachParas[0]}</p>}

          <CaseStudyFigurePair
            left={{
              src: '/work/pedagogy-club/09-backend-classes-admin.png',
              alt: 'Classes admin — the data model parents never see. Capacity counters, status pills, native WordPress patterns',
              width: 3792,
              height: 974,
              caption:
                'Classes admin — the data model parents never see. Capacity counters, status pills, native WordPress patterns.',
            }}
            right={{
              src: '/work/pedagogy-club/03-frontend-schedule-classes.png',
              alt: 'The same data, parent-side. Year groups, live capacity, no login required to enrol',
              width: 4112,
              height: 2406,
              caption:
                'The same data, parent-side. Year groups, live capacity, no login required to enrol.',
            }}
          />

          {approachParas[1] && <p>{approachParas[1]}</p>}

          <CaseStudyFigurePair
            left={{
              src: '/work/pedagogy-club/04-frontend-six-things.png',
              alt: 'Differentiator mosaic. Brand work doing real conversion work — and explaining the £80.14/month Direct Debit before the parent reaches the form',
              width: 4112,
              height: 2406,
              caption:
                'Differentiator mosaic. Brand work doing real conversion work — and explaining the £80.14/month Direct Debit before the parent reaches the form.',
            }}
            right={{
              src: '/work/pedagogy-club/08-backend-bookings-table.png',
              alt: 'Bookings admin. Reference, child, parent, payment status, due dates — and the GDPR controls (SAR, Erase) sitting as inline row actions, not buried in a settings page',
              width: 3791,
              height: 775,
              caption:
                'Bookings admin. Reference, child, parent, payment status, due dates — and the GDPR controls (SAR, Erase) sitting as inline row actions, not buried in a settings page.',
            }}
          />

          {approachParas[2] && <p>{approachParas[2]}</p>}

          <CaseStudyFigure
            src="/work/pedagogy-club/02-frontend-the-teacher.png"
            alt="The Teacher chapter — Mr Patel's narrative. Long-form copy that reads like an editorial profile, structured around his career arc rather than a CV"
            width={4112}
            height={2406}
            caption="The Teacher chapter — Mr Patel's narrative. Long-form copy that reads like an editorial profile, structured around his career arc rather than a CV."
          />

          {approachParas[3] && <p>{approachParas[3]}</p>}

          <CaseStudyFigure
            src="/work/pedagogy-club/07-backend-payments-dashboard.png"
            alt="Payments dashboard. Three-card KPI summary, status pills, CSV exports, sort by priority. Built on top of the existing booking model — GoCardless integration sits inside this view"
            width={3793}
            height={1180}
            caption="Payments dashboard. Three-card KPI summary, status pills, CSV exports, sort by priority. Built on top of the existing booking model — GoCardless integration sits inside this view."
          />

          {approachParas.slice(4).map((p, i) => (
            <p key={`tail-${i}`}>{p}</p>
          ))}
        </div>
      </CaseStudyAct>

      <CaseStudyAct number="03" label="Outcome" id="outcome">
        <div className="cs-prose-with-figures">
          {narrative.outcome.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <CaseStudyFigurePair
            variant="mobile-pair"
            left={{
              src: '/work/pedagogy-club/06-frontend-mobile-hero.png',
              alt: 'Mobile hero. Same brand voice, same dictionary device, same fee transparency — different viewport',
              width: 860,
              height: 1864,
              device: 'mobile',
              caption:
                'Mobile hero. Same brand voice, same dictionary device, same fee transparency — different viewport.',
            }}
            right={{
              src: '/work/pedagogy-club/05-frontend-mobile-stats.png',
              alt: 'Mobile stats slice. 80%+ offer rate, 2,400+ families, the curriculum framing all surfaced before the parent has scrolled to the schedule',
              width: 860,
              height: 1864,
              device: 'mobile',
              caption:
                'Mobile stats slice. 80%+ offer rate, 2,400+ families, the curriculum framing all surfaced before the parent has scrolled to the schedule.',
            }}
          />

          <CaseStudyFigure
            src="/work/pedagogy-club/01-frontend-footer-contact.png"
            alt="Contact section. WhatsApp first, email second, register-interest third — ordered by what the parent actually wants, not what the studio wants"
            width={4112}
            height={2406}
            caption="Contact section. WhatsApp first, email second, register-interest third — ordered by what the parent actually wants, not what the studio wants."
          />
        </div>

        {cs.metric && <CaseStudyMetric metric={cs.metric} />}
        <CaseStudyScope study={cs} />
      </CaseStudyAct>
    </>
  );
}
