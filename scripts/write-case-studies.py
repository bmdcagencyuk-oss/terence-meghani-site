#!/usr/bin/env python3
"""
Writes all 24 approved v2-voice case-study narratives from message 2 to
content/case-studies/*.mdx. Narratives verbatim from handover — no rewording.

Each MDX file structure:
  ---
  slug: foo
  testimonialId: optional
  ---

  ## (01) The Challenge
  [prose]

  ## (02) The Approach
  [prose]

  ## (03) The Outcome
  [prose]
"""
import os, textwrap

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'case-studies')
os.makedirs(OUT_DIR, exist_ok=True)

NARRATIVES = {
    "news-uk": {
        "testimonialId": "mu-news-uk",
        "challenge": """Every major publisher is a target. For News UK — publisher of The Times, The Sun, The Sunday Times and Times Radio — cyber and information-security risk isn't abstract. Every journalist, editor, engineer and support-function colleague interacts daily with systems holding source material, stories-in-progress, and sensitive personal data.

The security team had a strong technical programme. What they didn't have was a way to make that programme resonate internally. Corporate security communications tend to fail in predictable ways — dense policy documents, stock-image posters, a tone of voice that reads as legal compliance rather than professional responsibility. News UK wanted communications colleagues would actually read.""",
        "approach": """The brief was treated as an editorial brand problem, not a poster problem. Working with the internal security team, a bespoke illustration system was developed to simplify complex security concepts — phishing, credential hygiene, access control, incident reporting — into clear visual language. Every illustration was commissioned, not stock, and designed to feel native to the organisation rather than parachuted in.

Tone of voice guidelines were written to match: direct, respectful, and grounded in the reality of a newsroom environment. Interactive modules and workshops were developed to reinforce best practice, tailored to the specific risks faced across editorial, commercial, and operational functions.""",
        "outcome": """A full illustration library, voice guidelines, and campaign assets delivered across the internal programme.""",
    },

    "al-jannah-villa-marrakech": {
        "challenge": """Al Jannah Villa is a six-bedroom private retreat set in the countryside south of Marrakech. The property is quietly extraordinary — Moroccan design language, generous gardens, the privacy and scale of a secondary residence rather than a rental. The brand did not yet match.

Luxury hospitality is a difficult category to brand well. The visual language is crowded — gold, serif, heavy imagery — and risks feeling either generic-resort or touristic. For a property competing at the upper end of private rentals in Marrakech, the identity had to convey the specific character of the villa: the Moroccan heritage of the setting, and the contemporary standard of the experience.""",
        "approach": """The identity was rooted in the contrast that defines the villa itself — established Moroccan craft meeting contemporary composition. A custom wordmark pairs a refined modern serif with restrained letterforms. The palette was drawn from the materials on site rather than from a hospitality-category template.

Photography direction leaned into architectural framing rather than lifestyle editorial — the villa is the protagonist. The website was built to match a high-end booking enquiry experience: considered scroll, no clutter, a concierge path rather than a transactional "book now" button.""",
        "outcome": """Full brand identity system and website delivered. Collateral extended to welcome packs, signage, stationery, and the enquiry experience.""",
    },

    "tedx-university-of-salford": {
        "challenge": """TEDx events operate under tight licensing constraints. The TED brand guidelines are non-negotiable — typography, logo usage, colour relationships — and local organisers are expected to produce a complete event programme without modifying any of those fixed elements. The challenge, every year, is to make a TEDx event feel distinctive while staying completely within-guideline.

The University of Salford's independently-licensed edition needed a creative programme that would uphold the prestige associated with the TED platform, resonate with a university-based audience, and travel across every promotional touchpoint — from Instagram squares to concourse banners — without compromise.""",
        "approach": """The approach started with a rigorous audit of what the TEDx guidelines permit versus what they prohibit. Within that brief, a local visual system was developed that layered custom typography, imagery, and motion-ready graphics on top of the TEDx core mark. Every promotional asset — social, print, banner, digital display, email — was built from a single design system, so assets scaled from 4K venue screens down to a phone thumbnail without rework.""",
        "outcome": """A full promotional asset library delivered across digital and print. The campaign ran consistently across pre-event marketing, on-day collateral, and post-event content.""",
    },

    "dcd-connect": {
        "challenge": """DCD Connect is the premier annual gathering for Europe's data centre sector — 4,000+ senior leaders, operators, investors and technologists working across the digital infrastructure that underpins the modern internet. For the London edition hosted at Westminster Plaza, DCD needed event-grade photography and marketing support that would stand up to the scale and profile of the audience.

Event photography at the enterprise end is an underrated discipline. The goal isn't artistic — it's functional. Sponsor visibility needs to be captured cleanly. Senior speakers need usable portrait coverage. The energy of the room needs to be preserved for post-event marketing, partner decks, and the following year's prospectus.""",
        "approach": """A full editorial photography brief was built around the event's actual commercial needs: keynote coverage, panel documentation, sponsor-moment capture, networking-floor ambience, and hero imagery for DCD's post-event asset library. Every deliverable was tagged and catalogued for rapid deployment back into DCD's marketing pipeline.""",
        "outcome": """A licensed event photography library delivered, catalogued, and handed over for reuse across DCD's marketing channels.""",
    },

    "fireaway-pizza": {
        "challenge": """Fireaway is a UK pizza chain with strong in-store standards, an engaged local following, and a clear product — pizza cooked to order. The in-store experience was already working. What wasn't working was the digital front door. Organic search visibility was underdeveloped, online engagement was inconsistent, and the digital footprint didn't match the quality of the physical experience.

Fireaway came to me with one clear goal: meaningful organic growth across the chain's digital channels, grounded in content that reflected the quality of the product.""",
        "approach": """The programme combined content, SEO, and commissioned product photography into a single editorial pipeline. Location-level SEO pages were produced for each restaurant, giving every outlet its own discoverable presence. Food and lifestyle photography was commissioned to replace generic library imagery across the site and social channels. Paid and organic social campaigns ran against a consistent visual and tonal identity.""",
        "outcome": """Organic search traffic grew by 75%, significantly improving local search rankings across the estate. The content and photography library continues to support the chain's ongoing marketing programme.""",
    },

    "japex-automotive": {
        "challenge": """Japex Automotive is an independent servicing specialist in Kings Langley, covering MOT, general service, EV work and specialist engine tuning across most makes and models. Independent garages live or die by local reputation and digital discoverability — customers decide within the space of a postcode search, often from a mobile phone, often within minutes of a warning light coming on.

The commercial challenge was sharp: compete against dealership service departments and national chains on discoverability, while communicating the technical depth and trust that an independent specialist can offer but rarely communicates well.""",
        "approach": """High-resolution brand photography was commissioned on-site — real vehicles, real bays, real technicians — replacing the generic imagery that dominates the category. Paid campaigns were structured around specific service intents (MOT, EV servicing, tuning) and a defined geographic catchment, rather than broad "mechanic near me" coverage. Social marketing ran in parallel to build local presence and surface completed customer work.""",
        "outcome": """A full brand photography library licensed for continued use. The digital marketing programme was handed over with ongoing support available as required.""",
    },

    "tulsi-vagjiani": {
        "testimonialId": "tulsi-vagjiani-self",
        "challenge": """Tulsi was the sole survivor of a plane crash at the age of ten, in which she lost her parents and her younger brother and sustained 45% burns. In the years since, she has built a professional speaking career around resilience, identity, and life after trauma — and has been profiled in The Guardian, among others.

The brief was to build a personal brand that could sit alongside that story without reducing it. Personal brands in the resilience space tend to lean in one of two directions: clinical wellness aesthetics, or heavy trauma visuals. Neither fits the composed, deliberately understated way Tulsi speaks on stage.""",
        "approach": """The identity was built on restraint. A pared-back wordmark, a tight serif-to-sans pairing, and a palette of two working tones with a single accent — every visual decision deferring to what Tulsi would say on stage, not competing with it.

Website, speaker collateral, and press kit all follow the same editorial logic: generous white space, considered typography, and photography that places Tulsi front and centre without theatre. The result reads as a brand for a senior professional voice, not a motivational content creator.""",
        "outcome": """A full identity system rolled out across website, speaker collateral, booking materials, and press kit — supporting Tulsi's ongoing national speaking engagements and editorial features.""",
    },

    "triage-vets": {
        "challenge": """Veterinary decisions are emotional rather than economic — pet owners choose a practice on first impression, long before they meet a clinician. Triage Vets, an independently-owned RCVS-accredited practice in Mill Hill, had the clinical credentials and the bedside manner, but a brand presence indistinguishable from hundreds of other local practices.

The remit covered everything client-facing: identity, website, photography direction, and a marketing framework the clinic's team could run independently.""",
        "approach": """The identity was designed to signal trust before a visitor reads the first line of copy. A confident wordmark, a restrained three-colour palette, and a typography system chosen for legibility across signage, forms, and screen.

No stock imagery — every photograph on the site was commissioned, featuring real staff and patients in real treatment rooms. The website was rebuilt with practical utility in mind: booking and emergency contact within two taps on mobile, service descriptions written in plain English, and transparent information about what an appointment involves. Marketing support included Google Business Profile optimisation, a review capture workflow, and local SEO pages aligned with the clinic's catchment area.""",
        "outcome": """Brand system delivered across signage, digital, and print. Website live at triagevets.com. Photography library licensed in perpetuity. Marketing framework handed over with documentation, so the clinic's own team can maintain it without ongoing retainer.""",
    },

    "kbmd": {
        "challenge": """KBMD has served clients from Kenton, Harrow since 1996 — a book built on long client relationships and referrals, with a team carrying more than fifty years of collective professional experience. The firm's reputation was ahead of its identity: the visual brand dated from an earlier era and no longer reflected the standard of work or the seniority of the client roster.

The brief was a refresh that would feel inevitable rather than reinvented — something a firm of KBMD's standing could introduce to existing clients without explanation, and put in front of new prospects without apology.""",
        "approach": """Professional services brands fail in two directions: generic corporate, or overly modern and uncomfortable on a tax return. KBMD needed neither.

The new wordmark uses custom letterforms built on a single geometric logic, with the K and B sharing a stem — a quiet signature of partnership. The palette reduces to one deep signature colour and a metallic accent for premium applications: embossed business cards, letterhead, pitch covers. The type system pairs an editorial serif for headings and numbers with a neutral humanist sans for body. No illustration, no iconography.

The result is a mark that reads as considered on premium stock and equally at home in a digital pitch deck. Quiet, correct, legible at every scale.""",
        "outcome": """Complete brand identity system delivered: wordmark, palette, typography, business cards, letterhead, pitch and report templates, email signatures, and brand guidelines for the team.""",
    },

    "vijays-virasat": {
        "testimonialId": "dhiren-sanghani-vijays",
        "challenge": """Vijay's Virasat is a family-run Indian restaurant in East London built on three generations of culinary tradition. The food, and the family behind it, carries genuine heritage. In an East London market saturated with competing Indian restaurants, being family-run across three generations is a significant differentiator — the brand needed to communicate that weight without shouting.""",
        "approach": """The identity was built around craft and lineage rather than trend. The wordmark draws on traditional Indian motifs — paisley and mandala — rendered with clean, scalable line work that reads at any size, from a menu footer to a restaurant fascia. The palette pairs warm spice tones with a deep anchor colour, suggesting authenticity without resorting to pastiche. Photography direction captured the dishes and the kitchen rather than the dining room — the work and the skill as the hero.""",
        "outcome": """A complete brand and digital system delivered across logo, menus, website, photography, and marketing collateral.""",
    },

    "protech-motors": {
        "challenge": """Independent garages compete against dealership service departments on trust, not price. The visual category is notoriously poor — clip-art logos, generic "we service all makes" taglines, stock imagery of spanners. Protech had strong technical work and an established local following, and needed a brand that would sit credibly alongside the dealerships they were quietly outperforming.""",
        "approach": """The identity was rebuilt from the ground up — discovery and market research first, wordmark and system second. Colour and typography were chosen to feel authoritative rather than chummy. Photography was commissioned on-site, featuring real vehicles, real technicians, real working bays, replacing category-standard stock imagery entirely. Web, marketing, and digital assets extended the same visual logic.""",
        "outcome": """A full automotive brand identity delivered alongside commissioned photography, a new website, and an ongoing marketing framework.""",
    },

    "metro-laundrette-dry-cleaners": {
        "challenge": """High-street laundry and dry cleaning is a category defined by local loyalty and invisible digital presence. Most competing businesses rely entirely on walk-in footfall, with websites — where they exist — that are outdated, mobile-unfriendly, and rarely updated. Metro came to us to build a digital presence that matched the in-store standard already being delivered.""",
        "approach": """The identity was refreshed to bring consistency across signage, packaging, and digital. A new website was built with mobile usage as the primary mode — showcasing services, transparent pricing, and contact information without friction. Local SEO was implemented to capture search intent from the surrounding catchment, supplemented by Google Business Profile optimisation and review capture. Commissioned photography replaced stock imagery across the site and collateral.""",
        "outcome": """Complete brand refresh and new website live. Local search and review presence rebuilt around the catchment area.""",
    },

    "london-kings-clothing": {
        "challenge": """Urban fashion is one of the most visually crowded categories in UK retail. For a clothing brand selling across the whole country rather than to a single city's scene, distinctiveness is the difference between selling and sitting on inventory. London Kings needed an identity with the energy and confidence of its product — and a digital presence that would stand up in a feed alongside established national competitors.""",
        "approach": """The wordmark was built on bold, dynamic typography. The palette was chosen for saturation and signal — a combination that would cut through on social feeds and street photography alike. Photography direction leaned into real context: the product worn, not lifestyle-shot. A digital marketing framework supported launch, with paid and organic campaigns running against a consistent visual system.""",
        "outcome": """A full brand and digital system delivered across identity, web, social assets, and marketing support.""",
    },

    "hd-security-systems": {
        "challenge": """Specialist security installers operate in a trust-driven market where customers are reassured by credentialing and deterred by anything that looks amateur. HD Security Systems' core service range — CCTV, monitored alarms, gate automation — is specified by customers who want to understand capability before they enquire. A single-page web presence wasn't supporting that decision process.""",
        "approach": """A new landing page was built with service clarity as the primary design goal. Each core offering — CCTV, monitored alarms, gate automation — was given a dedicated section that could answer the specific questions a customer arrives with. Navigation was stripped to essentials. Business card design ran in parallel, ensuring brand consistency between the digital and in-person first impressions.""",
        "outcome": """New landing page and business cards delivered.""",
    },

    "ecoboxes": {
        "challenge": """The sustainability category is increasingly competitive. For Ecoboxes, strong products and an environmental mission weren't translating into market reach. Visibility in organic and paid search was underdeveloped, and brand recognition as a pioneer in sustainable packaging needed active building rather than assumption.""",
        "approach": """A digital marketing programme was built around Ecoboxes' core environmental positioning. Content was produced addressing the actual decisions buyers make when switching to sustainable packaging — a lead-generation approach rather than awareness-only. Paid campaigns were structured around product intent and buyer-stage. Brand voice and visual system were tightened for consistent deployment across channels.""",
        "outcome": """A full digital marketing programme live across paid and organic, with content and creative assets handed over for ongoing internal use.""",
    },

    "high-five-family-fitness": {
        "challenge": """High Five Family Fitness runs Family Fun Fitness classes — sessions blending exercise with music and movement for parents and children together, held every Monday and Thursday at 9:45am at the YMCA in Leavesden Country Park, Abbots Langley. Like most small local businesses, they compete for attention against much larger, more generic chain gyms with significantly larger marketing budgets.""",
        "approach": """The digital presence was built around specificity — which classes, where, when. A fast-loading website was designed mobile-first, since most class enquiries happen on a phone. Local SEO focused on the Watford and Hertfordshire catchment. Marketing materials prioritised social-first content that could show the classes in action rather than relying on stock imagery.""",
        "outcome": """New website delivered and a marketing framework aligned to the local catchment.""",
    },

    "mhv-clinic": {
        "challenge": """Wellness and healthcare clinics live or die on trust and discoverability. MHV Clinic needed a strong digital presence aligned with its mission to support individuals toward total wellness — and a website that would perform reliably on every device a prospective patient might use.""",
        "approach": """The new website was built for speed, clarity, and mobile-first usability. Every element — from content structure to page load — was optimised for accessibility and responsiveness, giving visitors a frictionless path from research to booking. A paid search programme ran in parallel to capture intent-based traffic from prospective patients actively searching for wellness services.""",
        "outcome": """New website live and paid search programme running.""",
    },

    "ddg-windows-london": {
        "challenge": """Home improvement is a category defined by loyalty-building across long sales cycles — customers rarely buy windows twice, and when they do it's often a decade or more later. DDG Windows needed a brand refresh that conveys reliability, professionalism, and longevity without looking dated.""",
        "approach": """The refresh began with in-depth research into DDG's market position and customer base. The new mark uses a sleek, stylised window form — a subtle visual reference to the product — paired with a modern, clean typeface for readability across everything from van livery to quote documents. The palette centres on blues and greys, a considered choice conveying professionalism and trust.""",
        "outcome": """Full brand refresh delivered, applied across identity, collateral, and brand guidelines.""",
    },

    "chear-beauty": {
        "challenge": """The luxury beauty space rewards brands that can hold two positions simultaneously: authentic natural credentials, and genuine premium presentation. Miss either and the brand slides — into wellness cliché or into generic cosmetic aesthetics. Chear Beauty needed a digital presence that achieved both.""",
        "approach": """The website was designed as the primary brand experience — every element, from typography to imagery to interaction, calibrated to convey luxury while foregrounding the natural ingredients that underpin the product. Navigation was designed for discovery rather than transaction, allowing browsing to feel like an editorial experience. Paid marketing ran alongside, structured around intent-driven search and lifestyle targeting.""",
        "outcome": """New luxury brand website delivered, with a supporting digital marketing programme.""",
    },

    "kemp-services": {
        "challenge": """Commercial cleaning is a B2B category where buyers want clarity before they enquire: exactly which services are offered, in what contexts, at what scale. Kemp Services — specialising in contract cleaning, office cleaning, and builders' cleaning — needed a site that reflected the professionalism of their operation and made the service offering navigable at a glance.""",
        "approach": """The website was redeveloped with a clean, modern design aligned to Kemp's professional ethos. Each of the core service lines was given its own detailed section so prospective clients could immediately understand which offering fits their requirement. Responsive design ensures parity across devices, and the structure is built for clarity over embellishment.""",
        "outcome": """New website delivered, serving as the primary enquiry channel.""",
    },

    "the-hollybush-bar-restaurant": {
        "challenge": """Bar-restaurant brands in any local market are plural and crowded. The Hollybush came in with an established customer base and a specific character, but with a visual identity that didn't reflect what made the venue distinctive. The brief was to develop an identity that positioned the venue as a modern, confident destination without sacrificing the character that already brought customers in.""",
        "approach": """Discovery included interviews with staff and patrons alongside market analysis of the local dining scene. The resulting identity pairs an elegant wordmark with carefully crafted business cards and menu layouts — each designed with the same attention to detail the venue brings to service. Menus were treated as brand artefacts as much as operational documents: layout, hierarchy, and typography supporting the dining experience rather than competing with it.""",
        "outcome": """Complete brand identity delivered across logo, business cards, menus, and marketing collateral.""",
    },

    "sefia-london": {
        "challenge": """Luxury fashion photography succeeds or fails at the level of craft. For Sefia London — a brand built around footwear, jewellery and accessories — photography needed to match the meticulous artistry of the product itself. Generic ecommerce imagery was never going to be enough.""",
        "approach": """A commissioned fashion photography programme was developed specifically for Sefia London's product range. Lighting, composition, and styling were planned to highlight the detail of each piece while evoking the glamour and exclusivity Sefia's customers expect. The resulting library was built to work across the brand's website, campaigns, and editorial deployments.""",
        "outcome": """A licensed luxury product and lifestyle photography library delivered for ongoing brand use.""",
    },

    "taur-security": {
        "challenge": """Security services companies operate in a category where customer decisions happen at moments of real concern — a break-in, a staffing change, a new premises. The brand needs to project strength and competence without descending into the heavy-handed military aesthetics that dominate the category.""",
        "approach": """A modern, memorable wordmark was designed using bold, clean letterforms — strength conveyed through confident proportions rather than aggressive visual language. The identity was developed for consistent application across every touchpoint the business uses: uniforms, vehicles, marketing collateral, and digital platforms. A commissioned photography programme captured the team and fleet in operational contexts.""",
        "outcome": """Complete brand identity system delivered, with implementation guidance for vehicle livery, uniforms, stationery, and digital assets.""",
    },

    "la-royale": {
        "testimonialId": "k-thakrar-la-royale",
        "challenge": """Wedding and event venues compete in one of the most visual-first categories in UK hospitality. Couples choose venues months — sometimes years — in advance, and the decision is made emotionally, on Instagram and on the venue's own website, long before anyone walks through a door. La Royale, a two-suite banqueting venue in Tottenham with onsite parking and full kitchen facilities, needed a digital presence that matched the quality of the experience already being delivered in person.""",
        "approach": """A full brand and digital programme ran across several disciplines. The identity was developed to convey the warmth of a family-run venue alongside the professionalism of a serious events business. Commissioned photography captured both suites dressed for different event types — wedding, corporate, private occasion — giving prospective clients the visual context they needed to picture their own event in the space. The website was rebuilt for direct enquiry rather than for third-party aggregators, and the marketing programme focused on the North London catchment where most bookings originate.""",
        "outcome": """Complete brand identity, website, and marketing framework delivered.""",
    },
}

def write_mdx(slug, data):
    frontmatter_lines = [f"slug: {slug}"]
    if data.get("testimonialId"):
        frontmatter_lines.append(f"testimonialId: {data['testimonialId']}")
    fm = "---\n" + "\n".join(frontmatter_lines) + "\n---\n"
    body = (
        f"{fm}\n"
        f"## (01) The Challenge\n\n{data['challenge'].strip()}\n\n"
        f"## (02) The Approach\n\n{data['approach'].strip()}\n\n"
        f"## (03) The Outcome\n\n{data['outcome'].strip()}\n"
    )
    out = os.path.join(OUT_DIR, f"{slug}.mdx")
    with open(out, "w", encoding="utf-8") as f:
        f.write(body)
    return out

written = []
for slug, data in NARRATIVES.items():
    written.append(write_mdx(slug, data))

print(f"wrote {len(written)} MDX files to {os.path.abspath(OUT_DIR)}")
missing = {"news-uk","al-jannah-villa-marrakech","tedx-university-of-salford","dcd-connect",
    "fireaway-pizza","japex-automotive","tulsi-vagjiani","triage-vets","kbmd",
    "vijays-virasat","protech-motors","metro-laundrette-dry-cleaners","london-kings-clothing",
    "hd-security-systems","ecoboxes","high-five-family-fitness","mhv-clinic",
    "ddg-windows-london","chear-beauty","kemp-services","the-hollybush-bar-restaurant",
    "sefia-london","taur-security","la-royale"} - set(NARRATIVES.keys())
if missing:
    print(f"MISSING: {missing}")
else:
    print("all 24 slugs present ✓")
