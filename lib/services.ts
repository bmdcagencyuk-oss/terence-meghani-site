import servicesData from '@/data/services.json';

export type Service = {
  slug: string;
  label: string;
  icon: string;
  tier: 'core' | 'secondary';
  order: number;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  url: string;
  keywords: string[];
  /** Defaults to true. Set to false to hide a service from menus and routing without deleting it. */
  published?: boolean;
};

const allServices = servicesData.services as Service[];

const isPublished = (s: Service) => s.published !== false;

export function getAllServices(): Service[] {
  return allServices.filter(isPublished);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getAllServices().find((s) => s.slug === slug);
}

export function getCoreServices(): Service[] {
  return getAllServices()
    .filter((s) => s.tier === 'core')
    .sort((a, b) => a.order - b.order);
}

export function getSecondaryServices(): Service[] {
  return getAllServices()
    .filter((s) => s.tier === 'secondary')
    .sort((a, b) => a.order - b.order);
}
