# Multi-vendor integration layer for self-storage management systems (UK)

Research date: 2026-10-14. Not legal advice. Evidence base is thinner than planned: WebFetch failed (DNS errors for storable.com, ico.org.uk, scl.org), so all findings come from search-result summaries, not full-page reads. Primary vendor developer terms and ICO pages were NOT read directly. Anything marked "Inference" is my reasoning, not sourced.

## 1. Integration patterns when a vendor has no public API (exports, SFTP/email, DB access, feeds, RPA, unified-API/iPaaS)

### Takeaway
Most storage CRMs expose some API, but access is usually gated (contact the vendor, sometimes fee-bearing). Unified-API providers found (Merge, Propexo) do not cover self storage, so a custom adapter layer is needed. Scraping/RPA carries contract and IP risk that is untested in UK courts.

### Cited Findings
- SiteLink (Storable) API use requires an additional monthly fee; its integrations page says developers can be in-house or vetted third-party technology partners — [Search summary of SiteLink/Storable pages](https://storable.com/sitelink-integrations/xps-solutions) (page not directly fetched; also see [SpareFoot SiteLink overview](https://support.sparefoot.com/sparefoot-marketplace/account-management/marketplace-integrations/sitelink-web-edition-integration/sitelink-integration-overview))
- SpareFoot reads a data feed from SiteLink's API to keep prices/availability current — [SpareFoot](https://support.sparefoot.com/sparefoot-marketplace/account-management/marketplace-integrations/sitelink-web-edition-integration/sitelink-integration-overview)
- A 2019 release says SiteLink and storEDGE changed API licensing so StorageTreasures customers use the API at no extra charge (shows API fees are negotiable per partner) — [OpenTech](https://opentechalliance.com/?p=8792)
- Storeganise: webhooks (POST JSON, must return 200 within 2 seconds, payload carries only an ID which you then fetch via API); API keys created under Developer settings; end-user API docs at /api/docs/ on each instance; Admin API documentation is available only by contacting Storeganise — [webhooks](https://help.storeganise.com/article/19-webhooks), [developer settings](https://help.storeganise.com/article/33-developer-settings), [API FAQ](https://help.storeganise.com/article/21-api-faq)
- Storeganise webhook use cases include accounting sync from new invoices — [webhooks](https://help.storeganise.com/article/19-webhooks)
- Storman advertises a REST API (payments, access control, marketing) but public endpoint docs were not found; UK customers supported — [Storman blog](https://storman.com/how-api-can-transform-your-self-storage-operations/), [Storman FAQ](https://storman.com/faqs/?lang=en)
- PTI/Self Storage Manager integration was originally a desktop "BridgeApp" for file transfers, later a cloud-to-cloud API — [Inside Self Storage](https://www.insideselfstorage.com/software/pti-security-systems-integrates-with-property-management-software-self-storage-manager) (via search summary)
- PTI StorLogix Cloud to Storable Edge is webhook-based, near real time, no extra hardware/fees (March 2026 press release) — [Inside Self Storage](https://insideselfstorage.com/suppliers-products/pti-security-systems-partners-with-storable-to-launch-real-time-cloud-integration-for-self-storage-operators)
- Merge's unified API categories: HRIS, ATS, CRM, accounting, ticketing, file storage, marketing automation, etc.; no property/self-storage category found — [Merge](https://merge.dev/integrations), [Merge help](https://help.merge.dev/en/articles/7206853-what-is-merge)
- Propexo is a unified API for property management systems (Yardi, AppFolio, Entrata; residents, leases, units, charges, payments); industries listed are multifamily/BTR/student/etc., not self storage — [GetApp](https://www.getapp.com/all-software/a/propexo-unified-api/), [Propexo docs](https://docs.propexo.com)
- Apideck, Nango, Zapier, Make, Fivetran: searches returned nothing on self-storage coverage; Storeganise has third-party no-code connectors (Lindy, CodeWords, Metorial) — [Metorial](https://metorial.com/integrations/storeganise/triggers)
- UK scraping law: most common claims are breach of contract and database-right infringement; contract enforceability depends on the scraper having agreed to terms (login/click-through/API key); Ryanair v PR Aviation (CJEU 2015) held operators can contractually restrict screen scraping of unprotected data; Computer Misuse Act theory (bypassing logins/CAPTCHA) untested in UK courts for scraping; sources are law-firm marketing pages — [Sprintlaw](https://sprintlaw.co.uk/articles/is-web-scraping-legal-in-the-uk/), [Rocket Lawyer](https://www.rocketlawyer.com/gb/en/blog/to-scrape-or-not-to-scrape), [webscraping.fyi](https://webscraping.fyi/legal/UK/)

### Inferences
- Ranking of pattern preference (my judgement): official API/webhook > vendor-provided feed or partner export > scheduled CSV/Excel to SFTP or email-in (operator-initiated, so contractually clean) > on-prem read-only DB/agent (needs vendor and operator consent; could breach licence/support terms) > RPA/scraping (last resort; use only with operator's own credentials, operator written authority, and ideally vendor tolerance).
- RPA logging in with the operator's own credentials probably removes the Computer Misuse "unauthorised access" angle, but vendor ToS (no automated access) may still be breached; this is a solicitor question.
- Because no unified-API vendor found covers self storage, build the adapter layer in-house; iPaaS (Zapier/Make) is viable only as an operator-side bridge for vendors with webhooks (e.g. Storeganise).
- Occupancy analytics needs only unit-level snapshots, so scheduled report export (unit list with status, size, rate) is often sufficient and avoids deep integration.

### Gaps
- No direct reading of Storable/SiteLink, Storman, Easistore, Self Storage Manager, Stora developer terms; no confirmed list of UK vendors with no API.
- No evidence found on Apideck, Nango, Zapier, Make, Fivetran self-storage connectors (absence of results, not proof of absence).
- No case law found on RPA with customer's own credentials.
- Which UK vendors offer scheduled exports or SFTP: not confirmed.

## 2. Vendor partner/marketplace programmes and how third parties integrate

### Takeaway
Programmes are mostly bilateral and opaque: API access by application or contact, sometimes with a monthly fee, and partners are "vetted". Access control vendors (PTI) have moved from file-transfer bridges to webhook/cloud-to-cloud integrations.

### Cited Findings
- SiteLink: API needs an extra monthly fee; vetted third-party partners allowed; SiteLink marketplace lists partners (e.g. online auctions) — [Modern Storage Media](https://www.modernstoragemedia.com/blog-post/leading-self-storage-online-auction-site-added-sitelink-marketplace), [Storable](https://storable.com/sitelink-integrations/xps-solutions)
- PTI integrates with Self Storage Manager, Yardi Breeze Premier, DoorSwap, Storeganise (access codes generated on rent), Storable Edge — [Inside Self Storage](https://www.insideselfstorage.com/software/pti-integrates-storlogix-cloud-access-control-software-with-yardi-breeze-self-storage-management-platform), [Storeganise partner page](https://preview2.storeganise.com/partner/pti-security)
- Storman integrations (per directories): Ezidebit, Sentinel, Xero; claims access-control integrations with Nokē, Access Ezy, ICT, Protégé, PTI, Sentinel — [GetApp](https://www.getapp.com/industries-software/a/storman), [Software Advice UK](https://www.softwareadvice.co.uk/software/209680/storman)
- Storeganise lists 30+ integrations and an open API — [Software Advice UK](https://www.softwareadvice.co.uk/software/267449/storeganise)

### Inferences
- Expect to negotiate per vendor; budget for an API fee on SiteLink-type systems, and use "operator pays/operator authorises" as the commercial model where the vendor has no programme.
- Being listed as a recognised partner (SiteLink marketplace-style) probably helps credibility with operators more than it helps access.

### Gaps
- Searches found nothing on Storable marketplace fee structure, approval criteria, revenue share, or data-access terms. Nothing found for Nokē, Openet, Janus, or Xero-to-storage-CRM mechanics beyond Storman/Storeganise directory listings.

## 3. UK GDPR / DPA 2018 implications

### Takeaway
Tenant-level data (names, invoices) is personal data and makes the SaaS a processor (most likely) for the operator, requiring an Article 28 contract. Unit-level aggregate occupancy (no tenant identifiers) can likely avoid personal data, but pseudonymised data remains personal data, so design must strip identifiers at source or in the adapter.

### Cited Findings
- ICO anonymisation guidance published 28 March 2025: anonymised data cannot be re-identified by any reasonably likely means; pseudonymised data remains personal data; recommends data minimisation, key management, access controls, testing — [SCL](https://www.scl.org/ico-publishes-anonymisation-guidance/), [Stevens & Bolton](https://viewpoints.stevens-bolton.com/post/102lrnx/ico-and-edpb-anonymisation-and-pseudonymisation-safeguarding-personal-data)
- ICO consulted on draft anonymisation/pseudonymisation guidance for research, archiving and statistics from 24 Aug 2026 (open to 19 Oct 2026); covers motivated intruder test, controller/processor roles — [A&O Shearman](https://www.aoshearman.com/en/insights/ao-shearman-on-data/ico-launches-consultation-on-draft-guidance-regarding-anonymisation-and-pseudonymisation)
- One commentary says ICO appears to exclude the "whose hands" test when pseudonymised data goes to a processor/joint controller; ICO guidance is non-statutory but considered in compliance assessments — [Slaughter and May](https://thelens.slaughterandmay.com/post/102k8s2/anonymisation-and-pseudonymisation-are-in-vogue-first-the-edpb-and-now-the-uk-i)
- Data (Use and Access) Act 2025: most data protection provisions in force by Feb 2026 (SI 2026/82), others from 19 June 2026; adds recognised legitimate interests (Art 6(1)(ea)); commentary only, not legislation — [RPC](https://www.rpclegal.com/snapshots/data-protection/spring-2026/the-data-use-and-access-act-2025-commencement-update/), [GOV.UK](https://www.gov.uk/guidance/data-use-and-access-act-2025-data-protection-and-privacy-changes)

### Inferences
- Operator = controller, SaaS = processor for any tenant-level data ingested on the operator's instructions; if the SaaS also uses data for its own benchmarking/product improvement, it risks becoming controller for that use, which needs care (solicitor).
- Aggregate unit-level data (unit ID, size, type, status, rate, move-in/out dates) without tenant fields is likely not personal data, but small sites (a single unit tied to one identifiable tenant, combined with dates) may be identifiable; apply the motivated-intruder test and aggregate to facility-level for benchmarks.
- Practical controls: Art 28 DPA, sub-processor list, UK hosting or IDTA/UK Addendum for transfers, DPIA screening, retention limits, field allow-list in adapters (drop names/emails/payment data at ingestion).
- Invoice data: aggregate revenue/arrears figures do not need tenant identity; avoid ingesting tenant-level invoices unless a feature requires it.

### Gaps
- ICO controller/processor guidance and Article 28 checklist pages could not be fetched; relying on general knowledge there (flag as unverified).
- Operator contract terms (what operators must agree to with vendors about third-party data sharing) were not found.
- Solicitor needed for: controller/processor characterisation if SaaS uses data for own benchmarking; anonymisation assessment; vendor-licence conflicts.

## 4. Recommended architecture (canonical model and adapters)

### Takeaway
Inference-based design, since no sources specify one: a canonical, personal-data-free occupancy core with optional tenant/invoice extensions behind capability flags, fed by per-vendor adapters.

### Cited Findings
- Webhook payloads that carry only an ID, requiring a follow-up API fetch (Storeganise) — [webhooks](https://help.storeganise.com/article/19-webhooks)
- Propexo's normalised entities (residents, leases, units, charges, payments) show a precedent for a canonical property-management model — [GetApp](https://www.getapp.com/all-software/a/propexo-unified-api/)

### Inferences
- Canonical entities: Operator, Facility, UnitType, Unit (id, size, climate/features, status vacant/occupied/reserved/overlocked, street rate, actual rate), UnitStatusEvent/Snapshot (daily), Tenancy (pseudonymous tenancy ID, start/end, rate) and Invoice (period, amount, status) as optional modules; Tenant PII held in a separate, access-restricted store or never ingested.
- Capability flags per adapter: supportsUnitSnapshot, supportsHistoricalBackfill, supportsMoveEvents, supportsWebhooks, supportsTenancyDates, supportsInvoices, supportsRateHistory, containsPII, ingestionMode (api | webhook | sftp | email | db-agent | rpa), freshness SLA.
- Layers: connector (auth, pull/push) > raw landing (immutable, short retention) > normaliser with PII allow-list > canonical store > metrics; keep raw landing PII-minimal; per-operator credential vault; reconciliation checks (unit count, occupied total).
- Ingestion fallback ladder per vendor follows Section 1 ranking; always daily snapshot rather than depend on events.

### Gaps
- No public engineering write-ups of multi-vendor storage integrations were found.

## 5. Commercial models and go-to-market

### Takeaway
Storage software is priced cheaply per facility/month, so an analytics add-on must be priced as per-facility subscription with tiering by unit count; vendor partnerships may give distribution but also gatekeep data.

### Cited Findings
- Reference price points (US-dollar listings): Storeganise from $90/month usage-based; Easy Storage Solutions flat from $90/month; EasySpace from $180/month; Rentya $25/month (up to 50 units) and $70/month (51-500 units); QuikStor $295/month plus $999 implementation and $25/month per-facility website add-on — [Capterra Storeganise](https://www.capterra.com/p/232660/Storeganise), [Software Advice](https://www.softwareadvice.com/property/easy-storage-solutions-profile/), [QuikStor](https://quikstor.com/self-storage-management-software-pricing/), [Rentya via Capterra](https://www.capterra.ca/software/1079300/Rentya)
- Unified-API costs scale with linked accounts; one competitor blog cites $156,000 per year at 200 linked accounts for Merge (unverified, competitor source) — [Knit](https://getknit.dev/blog/a-detailed-evaluation-of-merge-dev-as-a-unified-api-platform)

### Inferences
- Pricing: per facility per month, tiered by unit count (e.g. under 100 / 100-500 / 500+), with multi-site discounts; one-off onboarding fee where RPA/SFTP setup is manual; pass through any vendor API fee transparently.
- GTM: lead with operators (multi-site first, as they carry multi-CRM pain), then pursue vendor and access-control partnerships; resellers such as consultants or franchise groups could bundle it; offer a vendor-neutral "read-only, no tenant PII" pitch to reduce vendor and operator resistance.

### Gaps
- No published pricing for storage analytics/benchmarking modules; no UK reseller structure data; no vendor revenue-share terms.
