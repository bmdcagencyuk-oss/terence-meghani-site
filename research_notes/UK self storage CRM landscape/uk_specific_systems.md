# UK-specific and smaller self-storage management systems: UK presence and integration feasibility (as of Oct 2026)

Method caveat: WebFetch could not reach any external host in this session (DNS failures), so all findings come from WebSearch result summaries, not full-page reads. Vendor developer docs and pricing pages were not read directly. Everything below is secondary-source level unless stated, and "no documented API found" means "not found in search", not "does not exist". The UK market-share question could not be answered from public sources.

## 1. Vendor, ownership, UK customer base, approximate market share

### Takeaway
The UK market is a mix of UK-native cloud platforms (Stora, Kinnovis, Space Manager, Storeganise from Estonia/Europe), Australasian StorMan, and US-origin products (SiteLink/Storable, Storage Commander, 6Storage, Unit Trac, CCStorage, Sentinel). No independent UK market-share figure was found. Only Stora makes a vendor-claimed share statement (over 25% of UK facilities).

### Cited Findings
- StorMan: cloud-based, launched in Australia in 1997, opened its UK office ten years later, SSA UK Approved Industry Supplier, with support from Australasia plus local UK support — [search summary of storman.com/about](https://storman.com/about/). Capterra UK rates it 4.4/5 from 9 reviews — [Capterra UK Sentinel/Storman comparison via search](https://www.capterra.co.uk/directory/30606/self-storage/software).
- Space Manager: cloud-based, vendor named RADical Systems Ltd, UK phone +44 (0)1483 238730 (Guildford area code), claims 30+ years of self-storage industry experience — [SSA UK supplier page](https://ssauk.com/supplier/space-manager.html), [Capterra](https://www.capterra.com/p/119327/Space-Manager/).
- Stora: UK web-based suite; vendor claims it powers more than 25% of UK self storage facilities (self-reported, not independently verified) — [Stora blog](https://stora.co/blog/introducing-the-stora-api-the-foundation-for-a-more-connected-automated-self-storage-business). Raised £500K in 2021 led by Techstart Ventures with David Milton (self-storage entrepreneur) increasing his stake — [Inside Self-Storage](https://www.insideselfstorage.com/united-kingdom/self-storage-software-startup-stora-raises-%C2%A3500k-expansion-uk-and-us). A competitor (StorageZen) claims a 50-unit minimum; competitor-authored, unverified — [Product Hunt](https://www.producthunt.com/p/storagezen/picking-self-storage-software-in-the-uk-what-nobody-tells-you-about-sitelink-stora-and-pricing). No acquisition of Stora found.
- Kinnovis (Kinnovis GmbH): suite of Kinnovis Manager (facility management), Kinnovis Access (access control hardware/software), JaneAI (chatbot), Kinnovis Connect (API); used across UK and Europe; Capterra UK 4.6/5 from 17 reviews — [FEDESSA supplier page](https://www.fedessa.org/supplier/kinnovis-gmbh.html), [GetApp UK](https://www.getapp.co.uk/software/2070762/kinnovis).
- Self Storage Manager (SSM), by E-SoftSys: UK customers include Springfield Self Storage and Andersons Removals (Hastings), both vendor-published testimonials — [Mini Storage Messenger](https://www.ministoragemessenger.com/blog-post/springfield-self-storage-uk-implements-self-storage-manager-ssm/), [SSM Kayako](https://selfstoragemanager.kayako.com/article/75-andersons-removals-hastings-limited-uk-implements-self-storage-manager).
- Easy Storage Solutions (probable match for "Easystorage"; not confirmed as the same product): web-based, aimed at small/medium operators; 4.8/5 from 703 reviews on GetApp/Capterra UK (US-heavy review base likely) — [Software Advice](https://www.softwareadvice.com.au/software/1634/easy-storage-solutions), [Capterra UK](https://www.capterra.co.uk/directory/30606/self-storage/software).
- Storage Commander (SC Navigator): Temecula, USA, founded 1998, cloud; UK profile is only a directory listing — [GetApp UK](https://www.getapp.co.uk/software/110109/storage-commander), [GetApp DE](https://www.getapp.de/software/110109/storage-commander).
- Sentinel / WinSen Property Manager (Sentinel Systems): US-centred, Capterra UK 2.6/5 from 8 reviews, available countries listed as United States only in one listing; deployment listed inconsistently (Windows desktop vs cloud) — [Capterra UK](https://www.capterra.co.uk/reviews/132317/winsen-property-manager), [GetApp UK](https://www.getapp.co.uk/software/2096525/winsen-property-manager).
- SiteLink Web Edition (Storable): US-origin (Storable, Austin TX per CB Insights), lists United Kingdom as available country, 4.7/5 from 452 reviews on GetApp UK — [GetApp UK](https://www.getapp.co.uk/software/105395/sitelink-web-edition), [CB Insights](https://www.cbinsights.com/compare/storable-vs-storagebase).
- Other products on Capterra UK: 6Storage (4.7/5, 90 reviews; St. Louis, USA), Unit Trac (4.7/5, 68 reviews), CCStorage (4.5/5, 54 reviews), Selfstorage.team (listed in UK), Storeganise (operators in 20+ countries) — [Capterra UK](https://www.capterra.co.uk/directory/30606/self-storage/software), [GetApp UK 6Storage](https://www.getapp.co.uk/software/113439/6storage), [Software Advice UK Selfstorage.team](https://www.softwareadvice.co.uk/software/526269/Selfstorage-team).

### Inferences
- Review counts (US-skewed for SiteLink, Easy Storage, 6Storage, Unit Trac) are not a proxy for UK share. The UK-native set most likely to matter for an occupancy intelligence SaaS is Stora, Kinnovis, Space Manager, Storeganise, StorMan, plus SiteLink at the larger chains.
- "Smart Storage" and "Easystorage" as named in the brief did not resolve to a clear UK product in searches. "Sentinel" resolves most plausibly to Sentinel Systems/WinSen, which appears marginal in the UK.
- Likely larger UK chains (e.g. Big Yellow, Safestore, Lok'nStore, Storage King) probably run bespoke/enterprise or SiteLink-type systems, but no source found confirming this.

### Gaps
- No UK market-share data from any independent source (SSA UK annual survey, trade press, analyst).
- Ownership of Space Manager (RADical Systems), Kinnovis, StorMan UK entity, E-SoftSys not confirmed beyond names.
- "Smart Storage", "Easystorage" product identity and UK presence unresolved.
- Job-ad and case-study searches naming software at specific UK operators were not completed.

## 2. Public API: existence, documentation, auth

### Takeaway
Only Stora has a clearly public API with dated public docs (OAuth 2.0 / access tokens). Storeganise has public webhook docs but gated Admin API docs. StorMan, Space Manager, Kinnovis and several US products claim an API but no public reference was found.

### Cited Findings
- Stora: public API docs at docs.stora.co (versioned "2025-09"); authentication via access tokens and OAuth 2.0; "Public API gives you programmatic access to your self-storage business" — [Stora docs](https://docs.stora.co/2025-09/guides/introduction), [Stora blog](https://stora.co/blog/introducing-the-stora-api-the-foundation-for-a-more-connected-automated-self-storage-business), [Stora podcast](https://stora.co/podcast/inside-storas-new-api-automation-integrations-whats-coming-next).
- StorMan: markets a "modern, developer-friendly REST API" for website integration covering customer records, payments, quotes, reservations, move-ins/outs; no public documentation URL or auth method found — [StorMan API page](https://storman.com/?p=2786).
- Space Manager: "real time Web API" for website integration (GoodFirms), API listed as a feature (Capterra); no public API reference, auth or rate-limit detail found — [GoodFirms](https://www.goodfirms.co/software/space-manager), [Capterra](https://www.capterra.com/p/119327/Space-Manager/).
- Kinnovis: API sold/described as "Kinnovis Connect" add-on in some listings, while another listing says a public API is included for every customer (the two listings conflict) — [Software Advice](https://www.softwareadvice.com/property/kinnovis-profile/), [GetApp UK](https://www.getapp.co.uk/software/2070762/kinnovis). No developer docs found.
- Storeganise: API keys created in Settings > Developer; "if you'd like to gain access to the Admin API documentation, please contact us" (gated) — [Storeganise Developer settings](https://help.storeganise.com/article/33-developer-settings).
- SiteLink Web Edition, Unit Trac, CCStorage, Storage Commander: directories list "API" as a feature; no documentation, endpoints or auth found in this research — [GetApp UK SiteLink](https://www.getapp.co.uk/software/105395/sitelink-web-edition), [Capterra UK Unit Trac](https://www.capterra.co.uk/software/151482/unit-trac), [GetApp UK Storage Commander](https://www.getapp.co.uk/software/110109/storage-commander).
- 6Storage: apitracker.io page is a generic template; public API existence unverified — [apitracker](https://apitracker.io/a/6storage).
- Self Storage Manager (E-SoftSys), Easy Storage Solutions, Sentinel: no API information found.

### Inferences
- Directory "API" feature tags are often vendor-supplied checkboxes and may mean only a website-widget/booking API rather than a data-extraction API.
- StorMan and Space Manager APIs are described around website integration (rent/reserve flows), so may not expose bulk occupancy or finance data; needs vendor confirmation.

### Gaps
- Auth methods for StorMan, Space Manager, Kinnovis, SiteLink, Unit Trac, CCStorage unknown.
- Stora docs content (resource list, rate limits, scopes) not read because fetch failed.

## 3. Data access: units/occupancy, tenancies, invoices, payments; DB access, reports, CSV

### Takeaway
Little is publicly documented. Stora and Storeganise (via API/webhooks) are the only systems where programmatic access to operational and billing data is plausibly available; for the rest, scheduled reports/CSV export is the likely fallback but was not confirmed in sources.

### Cited Findings
- StorMan API scope lists customer records, payments, quotes, reservations, move-ins/outs (unit-level inventory and invoices not named) — [StorMan API page](https://storman.com/?p=2786).
- Storeganise webhook use cases include syncing invoices to accounting software and automating payments through a custom gateway, implying invoice/payment data is available via API — [Storeganise Webhooks](https://help.storeganise.com/article/19-webhooks).
- Space Manager and OpenTech integration includes real-time inventory and tenant-code retrieval, indicating inventory and tenant data is exposed at least to that partner — [Inside Self-Storage](https://www.insideselfstorage.com/suppliers-products/opentech-integrates-its-self-storage-access-control-system-with-space-manager-stora-management-software).
- Stora docs describe programmatic access to the self-storage business (specific resources not read) — [Stora docs](https://docs.stora.co/2025-09/).
- No source found on direct database access, scheduled report emails or CSV export for any system in scope.

### Inferences
- A third-party occupancy SaaS would most feasibly pull: Stora (API), Storeganise (API under agreement), then negotiated access to StorMan/Space Manager/Kinnovis. For others, operator-run CSV/scheduled report ingestion is the realistic route.
- Cloud-hosted systems make direct DB access unlikely.

### Gaps
- Field-level coverage (unit status, rent rate, tenancy dates, invoices, payments) unconfirmed for every system.
- CSV/scheduled-report features unverified.

## 4. Webhooks / event feeds

### Takeaway
Confirmed webhooks: Stora and Storeganise. Others: none found.

### Cited Findings
- Stora: Webhooks listed as a feature providing real-time notifications when events happen — [Stora docs](https://docs.stora.co/2025-09/), [Stora blog](https://stora.co/blog/introducing-the-stora-api-the-foundation-for-a-more-connected-automated-self-storage-business).
- Storeganise: webhooks configured under Main Settings > Developer > Webhooks (managers only), HTTPS POST with JSON body, event types such as `job.unit_moveIn.created`, alert emails on failure — [Storeganise Webhooks](https://help.storeganise.com/article/19-webhooks).
- No webhook/event-feed evidence found for StorMan, Space Manager, Kinnovis, SiteLink, Unit Trac, CCStorage, 6Storage, Storage Commander, Sentinel, Self Storage Manager, Easy Storage.

### Inferences
- Absence is "not found", not proof of absence.

### Gaps
- Stora webhook event catalogue and signature scheme not read.

## 5. Partner / integration programmes, fees, restrictive terms

### Takeaway
No fee schedules or restrictive terms were found for any vendor. Gated access (Storeganise: contact for Admin API docs) and partner-by-partner integrations (Space Manager/OpenTech) suggest a commercial conversation is needed for most.

### Cited Findings
- Storeganise Admin API docs available on request — [Storeganise Developer settings](https://help.storeganise.com/article/33-developer-settings).
- Storeganise has a partner add-on directory (e.g. HubSpot add-on) — [Storeganise HubSpot](https://storeganise.com/partner/hubspot).
- Kinnovis API possibly a paid add-on (Kinnovis Connect) per some listings, conflicting with "included for every customer" — see Section 2.
- StorMan and Space Manager are SSA UK listed suppliers — [SSA UK Space Manager](https://ssauk.com/supplier/space-manager.html), [StorMan](https://storman.com/about/).
- Stora publishes a UK "business ecosystem" page (integration partners) — [Stora blog](https://stora.co/es/blog/cut-out-guesswork-with-the-uk-self-storage-business-ecosystem) (content not read).

### Inferences
- Third-party access is likely operator-authorised (operator generates API key/OAuth grant), which suits an occupancy SaaS selling to operators; vendor-level partnership likely needed for StorMan, Space Manager and Kinnovis.

### Gaps
- Fees, partner terms, data-use restrictions: nothing found for any vendor.

## 6. Hosting model

### Takeaway
Nearly all UK-sold systems in scope are cloud/web; Sentinel/WinSen is the exception with conflicting listings.

### Cited Findings
- StorMan, Space Manager, Stora, Storeganise, Storage Commander, SiteLink Web Edition, Unit Trac: described as cloud/web-based in sources above (Space Manager cloud per [GoodFirms](https://www.goodfirms.co/software/space-manager); Storeganise "fully cloud-based" per [Capterra](https://www.capterra.com.au/alternatives/1015187/storeganise)).
- StorMan data "hosted locally" is claimed by a third-party listing only; unverified — [GetApp](https://www.getapp.co.uk/software/2048693/storman).
- Sentinel/WinSen: Windows desktop in one listing, cloud/web in another — [Capterra UK](https://www.capterra.co.uk/directory/30606/self-storage/deployment-options/windows/software), [GetApp UK](https://www.getapp.co.uk/software/2096525/winsen-property-manager).
- Self Storage Manager (E-SoftSys) hosting model not established.

### Inferences
- Legacy desktop/on-premise installs at older UK operators likely exist but no source quantified them; these would need agent-based or file-export integration.

### Gaps
- Hosting for SSM, Easy Storage, Kinnovis, CCStorage not confirmed.

## 7. Known existing integrations (websites, access control, accounting, booking, CRM)

### Takeaway
Access control and website/booking integrations are well represented; accounting is patchy; CRM integration appears via Storeganise-HubSpot and generic iPaaS, with no UK-specific Salesforce evidence.

### Cited Findings
- Space Manager: integration with OpenTech Insomniac CIA access control (2023) — [Inside Self-Storage](https://www.insideselfstorage.com/suppliers-products/opentech-integrates-its-self-storage-access-control-system-with-space-manager-stora-management-software); vendor claims websites, payments, access control, CRM tools — [SSA UK](https://ssauk.com/supplier/space-manager.html).
- OpenTech's integration headline also names Stora — same Inside Self-Storage article above.
- Kinnovis ships its own access control (Kinnovis Access) and a HubSpot-focused article for operators — [Kinnovis blog](https://kinnovis.com/self-storage-operators-use-hubspot/) (content not read).
- Storeganise: native HubSpot sync (contact created/updated syncs to HubSpot) — [Storeganise HubSpot](https://storeganise.com/partner/hubspot).
- SiteLink Web Edition integrations listed: Google Maps, QuickBooks Online Advanced, Sage 50, authorize.net — [GetApp UK](https://www.getapp.co.uk/software/105395/sitelink-web-edition).
- Unit Trac: Google Maps and Stripe only; reviewer notes manual QuickBooks entry — [GetApp UK](https://www.getapp.co.uk/software/106629/unit-trac).
- 6Storage lists 14 integrations incl. 6Security, Calcumate, Fortis (US-oriented) — [GetApp UK](https://www.getapp.co.uk/software/113439/6storage).
- Storedge (US) can push leads into HubSpot/Salesforce via Tray.ai iPaaS — [Tray.ai](https://tray.ai/connectors/storedge-salesforce-integrations/); a HubSpot community thread on self-storage CRM setup exists — [HubSpot Community](https://community.hubspot.com/t/self-storage-crm-setup/102870).
- Extra Space (US) used Salesforce with an in-house call centre (old case study, not UK) — [Bitpipe](https://bitpipe.computerweekly.com/detail/RES/1286832041_422.html).

### Inferences
- UK operators using Salesforce/HubSpot most likely use them for marketing/lead capture alongside a storage management system, not as the system of record for units/tenancies. No evidence found of a UK operator running Salesforce or HubSpot as the management system, or of bespoke in-house builds (not searched successfully).
- Zapier/webhook-based sync (Storeganise, Stora) is the lowest-friction route to feed an occupancy product.

### Gaps
- Bespoke/legacy UK systems at large chains not identified (no sources).
- Accounting integrations (Xero, Sage) for UK-native vendors not confirmed.
- Job-ad evidence of software used by UK operators not gathered.
