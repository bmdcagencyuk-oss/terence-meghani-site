import pluginsData from '@/data/plugins.json';

export type PluginStatus = 'in-production' | 'beta' | 'bespoke' | 'available';

export type Plugin = {
  slug: string;
  name: string;
  vertical: string;
  tagline: string;
  status: PluginStatus;
  statusLabel: string;
  eta?: string;
  version: string;
  ctaLabel: string;
  ctaHref: string;
  note?: string;
  /** Path to a preview SVG/PNG under /public, e.g. /plugins/storax.svg. */
  heroImage?: string;
  heroImageAlt?: string;
  /** Short description, rendered after "Preview · " on the plugin detail page. */
  previewCaption?: string;
};

export type PluginLongForm = {
  whatItDoes: string[];
  whoItsFor: string;
  capabilities: string[];
};

const plugins = pluginsData.plugins as Plugin[];

export function getAllPlugins(): Plugin[] {
  return plugins;
}

export function getPluginBySlug(slug: string): Plugin | undefined {
  return plugins.find((p) => p.slug === slug);
}

export function getVerticals(): string[] {
  return pluginsData.meta.groups;
}

export function getPluginsByVertical(vertical: string): Plugin[] {
  return plugins.filter((p) => p.vertical === vertical);
}

export function getRelatedPlugins(slug: string): Plugin[] {
  const p = getPluginBySlug(slug);
  if (!p) return [];
  return plugins.filter((q) => q.vertical === p.vertical && q.slug !== p.slug);
}

export const PLUGIN_LONG_FORM: Record<string, PluginLongForm> = {
  storagequoter: {
    whatItDoes: [
      `StorageQuoter embeds real-time unit quotes directly on a self-storage operator's WordPress site. Customers pick a location, pick a unit type, pick a unit — and either capture the price or capture a lead, depending on the operator's positioning. Built for operators with one location or fifty.`,
      `Each quote routes to HubSpot as a contact upsert + deal creation, so the sales team has the lead in the CRM before the customer's even closed the tab. The whole experience drops in via Elementor widget or shortcode — no custom code required to deploy.`,
    ],
    whoItsFor:
      'Self-storage operators running on WordPress who want their website to do real selling — not just describe units they hope someone will phone about.',
    capabilities: [
      'Multi-location, multi-unit-type configuration',
      'Show or hide pricing per unit (capture lead either way)',
      'HubSpot CRM contact + deal sync on every submission',
      'CSV/Excel import for bulk unit creation',
      'Elementor widget + shortcode deployment',
      'Locked-down security: nonce verification, capability checks, rate limiting',
    ],
  },
  'storage-booking': {
    whatItDoes: [
      `Storage Booking is a two-widget Elementor system that takes a customer from "I need a unit" to "here's the reservation request" without leaving the operator's site. The first widget is a unit selector — carousel, images, sizes, prices. The second is a reservation form that captures the customer's details and routes the booking request to the operator's inbox, CRM, and admin dashboard simultaneously.`,
      `Unlike StorageQuoter (which is a quote-and-capture flow), Storage Booking is the final-mile reservation flow. Use them together for operators running their full customer journey on WordPress.`,
    ],
    whoItsFor:
      'Self-storage operators who want their WordPress site to handle reservations directly — without redirecting to an external booking engine and losing the on-site experience.',
    capabilities: [
      'Storage Unit Selector widget (carousel, images, pricing, availability)',
      'Storage Reservation Form widget (customer details, dates, terms)',
      'Callback request handling for unavailable units',
      'Reservation admin dashboard (filter by status, export)',
      'Custom email templates with full merge-tag support',
      'Currency-flexible, label-customisable',
    ],
  },
  storax: {
    whatItDoes: [
      `StoraX connects a WordPress site to a Stora account directly, in minutes, via the Stora Public API. Unit availability, dynamic pricing, the on-site booking flow — all rendered live, all customisable in the WordPress admin, no custom code.`,
      `The killer feature is native on-site booking: customers complete the entire booking journey on the operator's domain — contact details, protection selection, add-ons, promo codes, order review — and only hop to Stora for the final card-entry step (a PCI-compliance requirement that applies to every payment integration). After payment, Stora redirects the customer into their white-label portal and fires a webhook back to WordPress to trigger team notifications.`,
      `For Stora operators, this is the difference between "external booking engine that loses the customer's session" and "on-site booking that keeps them in your brand experience until the moment of payment."`,
    ],
    whoItsFor:
      'Self-storage operators on the Stora platform — UK, EU, and beyond — who run their marketing site on WordPress and want their customer-facing experience tied directly to their backend.',
    capabilities: [
      'Live unit availability and dynamic pricing from the Stora Public API',
      'Native on-site booking flow (v3+) — customer stays on your domain',
      'Three card layouts (Full / Compact / List) with full styling control',
      'Filter bar, branded enquiry form, multiple shortcode entry points',
      'Webhook receiver for order-completion automation',
      'Live preview in the admin Design tab',
      'Shortcode Builder + Unit Browser for URL verification',
    ],
  },
  'kinnovis-client-portal': {
    whatItDoes: [
      `Kinnovis manufactures storage-building templates for operators across the UK. The Kinnovis Client Portal is the WordPress plugin built specifically for Kinnovis's customer-facing template selection, onboarding, and ticket-management workflow.`,
      `Unlike the three other plugins in the self-storage suite, Kinnovis Client Portal is bespoke — built for one company, not a productised plugin with a wider market. It's listed here as part of the same self-storage product line because it shares the same architectural DNA: WordPress-native, HubSpot-integrated, operator-grade security.`,
    ],
    whoItsFor: `Specifically Kinnovis. The plugin isn't available to other operators.`,
    capabilities: [
      'Template selection flow (free template library, premium templates)',
      'Client onboarding journey with HubSpot CRM sync',
      'Submission tracking and status management',
      'Ticket management for customer support',
      'Email automation across the onboarding lifecycle',
      'Database-backed, audit-trailed, branded throughout',
    ],
  },
  'client-approvals-hub': {
    whatItDoes: [
      `Client Approvals Hub turns the messy email-thread approval cycle every agency knows into a clean, structured, trackable workflow. You upload deliverables (web designs, SEO reports, content, ads, branding work), the client gets a tokenised email link (no account required), they approve / request changes / reject — and every action is logged with timestamp, IP, and full audit trail.`,
      `Built for white-labelling: set the brand name, role labels, logo, colour, and email footer in settings, and the entire experience adapts — admin menus, client portal, emails, even the custom post type labels. Each agency runs it as their own.`,
      `The killer features are the ones that make web design feedback bearable: pinned annotations on mockups (clients click anywhere on an image to drop a comment), breakpoint preview modal (preview pages at mobile / tablet / desktop without leaving the approval), AI assistant (generate or improve briefs, suggest titles, draft email subjects), and revision rounds with full version history (when changes are requested, archive Round N's files and start Round N+1).`,
    ],
    whoItsFor:
      'Marketing, branding, web, and digital agencies running monthly client deliverables and tired of "approved? approved? approved?" Slack threads.',
    capabilities: [
      'Tokenised email approval (no client account needed)',
      'Pinned annotations on mockups with threaded replies',
      'Breakpoint preview modal (mobile / tablet / desktop)',
      'Revision rounds with full version history',
      'AI Assistant (Claude / OpenAI) — brief generation, email subject drafting, title suggestions',
      'Slack notifications on client responses',
      'Auto-reminders with hard cap (no chasing fatigue)',
      'Branded HTML emails, editable per-template',
      'Global activity log + CSV export',
      'Full white-labelling — no code edits required',
    ],
  },
  'site-audit': {
    whatItDoes: [
      `Site Audit is a WordPress plugin that gives marketing agencies an automated lead-capture tool: a prospect enters their URL, the plugin runs an SEO and performance audit (powered by Google PageSpeed Insights), and shows the prospect a teaser of the results — with the full report behind a lead-capture form.`,
      `The agency gets a notification email with the lead's details and the audit data. The prospect gets a teaser. Both sides have what they need to start the conversation.`,
      `Built originally for Amax Marketing's own lead generation, it's been running in production capturing real leads for over a year.`,
    ],
    whoItsFor:
      'Small-to-mid marketing agencies in the UK and EU who want a content-marketing-grade lead magnet that runs without a SaaS subscription.',
    capabilities: [
      'Automated SEO + Core Web Vitals audit per submission',
      'Google PageSpeed Insights API integration',
      'Teaser-and-gate flow (prospect sees enough to want more)',
      'Lead capture with notification email to agency team',
      'Calendly / HubSpot booking link integration',
      'Brand-customisable (agency name, colour, copy, accent)',
      'Shortcode + Elementor deployment',
    ],
  },
};
