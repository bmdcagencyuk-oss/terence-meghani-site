import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import caseStudiesData from '@/data/case-studies.json';
import testimonialsData from '@/data/testimonials.json';

export type CaseStudy = {
  slug: string;
  client: string;
  projectTitle: string;
  year: number;
  industry: string;
  location?: string;
  market?: string;
  founded?: number;
  services: string[];
  tags: string[];
  featured: boolean;
  featuredOrder?: number;
  excerpt: string;
  metric?: { value: string; label: string; source: string };
  heroImage: string;
  heroImageAlt: string;
  gallery?: string[];
  testimonialId?: string;
  related: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  country: string;
  stars: number;
  title: string;
  date: string;
  text: string;
  lengthBucket: 'short' | 'medium' | 'long';
  attachedToCaseStudy: string | null;
};

export type CaseStudyNarrative = {
  challenge: string;
  approach: string;
  outcome: string;
};

const studies = caseStudiesData.studies as CaseStudy[];
const testimonials = testimonialsData.testimonials as Testimonial[];
const contentDir = path.join(process.cwd(), 'content', 'case-studies');

export function getAllCaseStudies(): CaseStudy[] {
  return studies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return studies.find((s) => s.slug === slug);
}

export function getFlagshipCaseStudies(): CaseStudy[] {
  return studies
    .filter((s) => s.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  if (tag === 'all') return studies;
  const normalized = tag.toLowerCase();
  return studies.filter((s) => s.tags.some((t) => t.toLowerCase() === normalized));
}

export function getRelatedCaseStudies(slug: string): CaseStudy[] {
  const study = getCaseStudyBySlug(slug);
  if (!study) return [];
  return study.related
    .map((s) => getCaseStudyBySlug(s))
    .filter((s): s is CaseStudy => s !== undefined);
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id);
}

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}

export function getFilterChips() {
  return caseStudiesData.filterChips;
}

export function getMeta() {
  return caseStudiesData.meta;
}

/**
 * Load the MDX narrative for a given case study.
 * Returns a structured { challenge, approach, outcome } by parsing H2-delimited sections.
 */
export function loadCaseStudyNarrative(slug: string): CaseStudyNarrative | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(raw);

  // Split on ## headings — expect (01) The Challenge, (02) The Approach, (03) The Outcome
  const sections: Record<string, string> = {};
  const parts = content.split(/^##\s+/m).filter(Boolean);
  for (const part of parts) {
    const [firstLine, ...rest] = part.split('\n');
    const body = rest.join('\n').trim();
    const head = firstLine.toLowerCase();
    if (head.includes('challenge')) sections.challenge = body;
    else if (head.includes('approach')) sections.approach = body;
    else if (head.includes('outcome')) sections.outcome = body;
  }

  return {
    challenge: sections.challenge ?? '',
    approach: sections.approach ?? '',
    outcome: sections.outcome ?? '',
  };
}
