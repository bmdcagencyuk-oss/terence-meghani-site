# API-first and international self-storage platforms with UK presence: Stora, Storeganise, Storable (SiteLink, Storage Vault, Easystorage)

Research caveat (read first): in this session WebFetch failed with DNS errors for every URL (stora.co, help.storeganise.com, producthunt.com), so only WebSearch result summaries were available. No page was read in full. Every finding below comes from a search summary, not from reading the primary page. Items marked "secondhand" need verification against the primary URL before use. Date of research: 2026-10-14. No vendor documents rate limits, scopes, or webhook signing in anything I could see.

## 1. UK market presence, customer count/share, notable UK operators

### Takeaway
Stora is the clearest UK-headquartered-adjacent challenger (Belfast-based, claims 25% of UK facilities and 580+ UK sites, vendor-reported). Storeganise is international (Hong Kong-listed) and I found no verified UK customer list. SiteLink/Storable is a large US-origin incumbent with UK use, but I found no UK-specific share data.

### Cited Findings
- Stora is a Belfast-based self-storage management software provider; its 2025 UK report says the platform supports 25% of UK self storage facilities and lists 580+ UK sites (vendor-reported, no independent check found) — [Stora 2025 UK Self Storage Industry Insights](https://stora.co/industry-report-2025) (via search summary)
- Stora UK customers named in case studies: Norbreck Self Storage (Lancashire) — [case study](https://www.stora.co/case-studies/how-norbreck-self-storage-built-a-data-led-operation-with-stora); Secured Spaces (Dorset; integrates Bearbox, Stripe, Xero) — [case study](https://www.stora.co/case-studies/secured-spaces-scales-fast-with-stora); Bonny's Self Storage and GB Storage quoted in the 2025 report — [report](https://stora.co/industry-report-2025)
- Stora publishes annual UK industry reports (2024 report covered by trade press) — [Inside Self Storage](https://www.insideselfstorage.com/suppliers-products/software-firm-stora-releases-uk-self-storage-industry-insights-2024-report)
- Storeganise is described in one profile as a self-storage and valet-storage software company listed as based in Hong Kong; it appears as a supplier on the FEDESSA (European federation) supplier directory — [FEDESSA supplier page](https://www.fedessa.org/supplier/storeganise-ltd.html) (search result only)
- No UK operators using Storeganise were found; searches for large UK REIT names (Big Yellow, Safestore, Shurgard, Lok'nStore) returned nothing linking them to Storeganise — search summary, no URL confirms
- SiteLink (Storable) is listed on UK review aggregators — [GetApp UK](https://www.getapp.co.uk/software/105395/sitelink-web-edition), [Software Advice UK](https://www.softwareadvice.co.uk/software/31713/sitelink). No UK customer count found.
- Storable acquired Easy Storage Solutions (a US software firm, 2020) — [Inside Self Storage](https://www.insideselfstorage.com/software/storable-acquires-self-storage-software-provider-easy-storage-solutions). This is NOT the UK operator easyStorage (easyGroup); that is a separate business that raised up to GBP 180m from Arini in 2026 and operates about 45 UK locations — [IREI](https://irei.com/news/easystorage-raises-240m-of-strategic-capital-from-arini-to-support-u-k-expansion/) (note: URL slug says 240m, summary says 180m; figures conflict, verify)
- Shurgard acquired Lok'nStore in August 2024 — search summary, no primary URL

### Inferences
- "Easystorage if applicable": the name likely refers to Storable's Easy Storage Solutions (US-focused) or the UK operator easyStorage (an operator, not a software vendor). Neither appears to be a UK software offering; treat as not applicable unless the commissioner meant something else.
- Storage Vault: I found no evidence of a Storable product by that name or any UK offering. StorageVault (Canadian operator) appeared in results as an unrelated acquirer. Likely a mis-attribution.
- Stora's 25% figure may be inflated by counting sites per brand; unverified.

### Gaps
- No independent UK market-share data for any of the three vendors.
- No verified Storeganise UK customer list.
- No confirmation of a distinct Storable UK product beyond SiteLink.

## 2. Public API: docs, version, auth, scopes, data coverage

### Takeaway
Stora launched a public read/write API (docs URL not surfaced). Storeganise has a public end-user API per instance and a gated Admin API (docs on request). SiteLink has an API reportedly at extra monthly cost; docs appear partner-gated.

### Cited Findings
- Stora public API: programmatic read and write access to bookings, pricing, products, customers, invoices and credit notes; positioned for CRM, accounting and reporting sync, and custom booking with live availability and pricing — [Stora blog: Introducing the Stora API](https://stora.co/blog/introducing-the-stora-api-the-foundation-for-a-more-connected-automated-self-storage-business) (search summary). Podcast: [Inside Stora's New API](https://stora.co/podcast/inside-storas-new-api-automation-integrations-whats-coming-next)
- Stora API: units/occupancy, enquiries/deals, payments are NOT listed in the summary. Unknown whether exposed.
- Storeganise: end-user API docs are served per instance at `https://<businesscode>.storeganise.com/api/docs/`; admin endpoints are a separate API; Admin API keys are created in Developer settings; Admin API docs require contacting Storeganise; keys should have minimum role — [Developer settings](https://help.storeganise.com/article/33-developer-settings), [API FAQ](https://help.storeganise.com/article/21-api-faq)
- Storeganise has a third-party MCP/toolkit via Composio (indicates a usable REST surface) — [Composio toolkit](https://composio.dev/toolkits/storeganise); not an official vendor source
- SiteLink: a SiteLink-branded page states "Additional Monthly Fee Required to Access Sitelink API" and that developers use the API for real-time site data — mirror domain [sitelinkcomau.r6d.dev](https://sitelinkcomau.r6d.dev) (WARNING: appears to be a non-official mirror; verify on storable.com / sitelink.com)
- SiteLink reporting API requires username, password and corp code per Domo's connector help — [Domo](https://domo.com/docs/s/article/4418190973335) (secondhand)

### Inferences
- SiteLink's API is historically SOAP web services (my background knowledge, ReportingWs/CallCenterWs); not confirmed in this session. Treat as unverified.
- Storeganise's data model is likely to include units, unit rentals and invoices (typical), but I have no source.

### Gaps
- No API version, auth scheme (OAuth vs key) or scopes confirmed for Stora or Storable.
- No endpoint lists confirmed for unit-level occupancy for any vendor.

## 3. Webhooks

### Takeaway
Stora and Storeganise both have webhooks; event types and signing unconfirmed. SiteLink webhook status unknown.

### Cited Findings
- Stora has a webhooks system for real-time notifications on data changes — [Stora API blog](https://stora.co/blog/introducing-the-stora-api-the-foundation-for-a-more-connected-automated-self-storage-business)
- Storeganise: webhooks configurable in Developer settings; separate Webhooks help article exists — [Developer settings](https://help.storeganise.com/article/33-developer-settings)

### Gaps
- Event types, payload format and signature scheme: not found for any vendor.
- SiteLink webhooks: nothing found.

## 4. Rate limits and pagination

### Takeaway
Nothing public found.

### Cited Findings
- Storeganise points to an "API Best Practices" article that developers must follow; contents not retrieved — [API FAQ](https://help.storeganise.com/article/21-api-faq)

### Gaps
- Rate limits and pagination for Stora, Storeganise, SiteLink: not found.

## 5. Partner / marketplace programme, cost, approval, data terms

### Takeaway
SiteLink has an established Marketplace (reportedly 61 partners, possibly stale) and a paid API tier; Stora and Storeganise partner terms not found.

### Cited Findings
- SiteLink Marketplace reportedly lists 61 partners; API enables call centres, web design and marketing platforms to access real-time data (date unknown, potentially stale) — [G2 SiteLink Web Edition](https://g2crowd.com/products/sitelink-web-edition)
- Example integrations: StorageTreasures.com added to SiteLink Marketplace in 2018 (stale, pre-2024) — [Modern Storage Media](https://www.modernstoragemedia.com/blog-post/leading-self-storage-online-auction-site-added-sitelink-marketplace)
- SiteLink is being consolidated onto Storable.com (logins, integrations, support); partner docs may move — [Storable](https://www.storable.com/?p=12579) (secondhand, unconfirmed)
- Stora integrations named: Bearbox, Stripe, Xero — [Secured Spaces case study](https://www.stora.co/case-studies/secured-spaces-scales-fast-with-stora)
- Competitor claim (biased, unverified): Stora has a 50-unit minimum, and SiteLink pricing is quote-only — [Product Hunt, StorageZen](https://www.producthunt.com/p/storagezen/picking-self-storage-software-in-the-uk-what-nobody-tells-you-about-sitelink-stora-and-pricing)

### Inferences
- A third party reading operator data would most plausibly need operator-granted credentials (API key per operator for Storeganise; corp code/credentials for SiteLink). A formal partner agreement may be required for SiteLink and Stora.

### Gaps
- How to join, cost, approval, and data-access terms: not found for any vendor.

## 6. Data export options

### Takeaway
Not established.

### Gaps
- No source found on CSV/report exports or BI connectors for any vendor. Only indirect: Domo has a SiteLink connector (reporting API, credentials-based) — [Domo](https://domo.com/docs/s/article/4418190973335). Stora blog says API supports reporting sync.

## Recommended next steps
1. Re-run with working fetch; read stora.co API docs, help.storeganise.com Webhooks and API Best Practices articles, and storable.com developer/partner pages.
2. Contact Storeganise for Admin API docs; contact Stora for API docs and partner terms; contact Storable for SiteLink API terms and pricing.
