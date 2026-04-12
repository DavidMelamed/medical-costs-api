# Medical Cost Data Sources Research

Comprehensive research on prescription drug pricing, ambulance/EMS costs, scrapable public sources, AHRQ data tools, insurance rate filings, and medical device/implant costs for the medical-costs-api project.

**Date:** 2026-04-11

---

## 1. Prescription Drug Pricing

### 1.1 CMS Medicare Part B Drug Average Sales Price (ASP) Files

| Field | Detail |
|---|---|
| **URL** | https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files |
| **Access Method** | Direct CSV/ZIP download (no auth) |
| **Format** | ZIP containing CSV files |
| **Update Frequency** | Quarterly (Jan, Apr, Jul, Oct) |
| **Current Files** | April 2026 and January 2026 final files available |
| **Data Fields** | HCPCS code, short descriptor, payment limit (per billing unit), NDC-HCPCS crosswalk |
| **Volume** | ~800-1,000 drug HCPCS codes per quarter |
| **Legal** | Public domain (US government data). Free to use. |
| **Download URLs** | ASP Payment Limit files + NDC-HCPCS Crosswalk files per quarter, ZIP format |

**Key files:**
- **ASP Payment Limit Files** -- per-HCPCS payment limits (what Medicare pays per billing unit)
- **NDC-HCPCS Crosswalk** -- maps individual NDC drug codes to HCPCS billing codes; critical for linking to pharmacy-level data

**Integration Notes:** These are the Part B drug rates -- drugs administered in physician offices/outpatient settings. Already partially covered via J-codes in HCPCS fee schedule. The ASP files add the per-unit payment limit specifically for drugs.

---

### 1.2 CMS Part D Prescriber Data

| Field | Detail |
|---|---|
| **URL (Prescribers)** | https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/medicare-part-d-prescribers-by-provider-and-drug |
| **URL (Spending)** | https://data.cms.gov/summary-statistics-on-use-and-payments/medicare-medicaid-spending-by-drug/medicare-part-d-spending-by-drug |
| **URL (Part B Spending)** | https://data.cms.gov/summary-statistics-on-use-and-payments/medicare-medicaid-spending-by-drug/medicare-part-b-spending-by-drug |
| **Access Method** | data.cms.gov API (JSON) + CSV bulk download |
| **API Endpoint Pattern** | `https://data.cms.gov/data-api/v1/dataset/{dataset-id}/data` |
| **Format** | JSON (API), CSV (download) |
| **Volume** | Part D prescribers: ~25M+ rows (provider x drug); Part D spending: ~4,000 drugs; Part B spending: ~500 HCPCS codes |
| **Data Fields** | Drug name, generic name, brand/generic flag, total spending, total claims, avg spending per claim, avg cost per dosage unit, beneficiary count, total dosage units |
| **Legal** | Public domain. No restrictions. |

**Integration Notes:** The spending-by-drug datasets are ideal for building drug cost benchmarks. Part D covers retail pharmacy drugs; Part B covers physician-administered drugs. Together they cover essentially all Medicare drug spending.

---

### 1.3 GoodRx Pricing

| Field | Detail |
|---|---|
| **URL** | https://www.goodrx.com/developer |
| **API Docs** | https://www.goodrx.com/developer/documentation (v1) and /v2-documentation (v2) |
| **Access Method** | REST API with API key + HMAC signature |
| **Key Endpoints** | `GET /v2/price/compare` (lowest prices), `POST /v2/coupon` (coupon details) |
| **Format** | JSON responses |
| **Auth** | API key + shared private key (HMAC signing). Must request access. |
| **Legal** | **NOT freely scrapable.** TOS explicitly prohibits caching/storing price data. API is for real-time user-driven requests only. Contractually prohibited from extracting data for later use. |
| **Scraping** | Third-party scrapers exist on Apify but violate GoodRx TOS. Not recommended. |

**URL Structure (public pages):**
- Drug page: `https://www.goodrx.com/{drug-name}`
- With params: `https://www.goodrx.com/{drug-name}?dosage={dose}&form={form}&quantity={qty}&label_override={brand-or-generic}`
- Example: `https://www.goodrx.com/amoxicillin?dosage=500mg&form=capsule&quantity=30`

**Verdict:** GoodRx has the best real-time retail pricing data but is **legally off-limits** for bulk extraction/storage. Only usable via their API for live lookups. Consider for real-time widget integration, not database population.

---

### 1.4 Drugs.com Pricing

| Field | Detail |
|---|---|
| **URL** | https://www.drugs.com/price-guide/ |
| **URL Structure** | `https://www.drugs.com/price-guide/{drug-name}` |
| **Access Method** | Scraping only (no public API) |
| **Format** | HTML pages |
| **Data Available** | Average retail price, pharmacy-specific prices, coupon prices |
| **Legal** | **High risk.** No API. TOS likely prohibits scraping. Cloudflare-protected. |

**Verdict:** Not recommended for bulk extraction. Lacks API. Better alternatives exist.

---

### 1.5 NADAC (National Average Drug Acquisition Cost)

| Field | Detail |
|---|---|
| **URL** | https://www.medicaid.gov/medicaid/nadac |
| **Data Portal** | https://data.medicaid.gov (Socrata/SODA platform) |
| **2026 Dataset** | https://data.medicaid.gov/dataset/fbb83258-11c7-47f5-8b18-5f8e79f7e704 |
| **2025 Dataset** | https://data.medicaid.gov/dataset/f38d0706-1239-442c-a3cc-40ef1b686ac0 |
| **Direct CSV Download** | `https://download.medicaid.gov/data/nadac-national-average-drug-acquisition-cost-{MM-DD-YYYY}.csv` |
| **API** | Socrata Open Data API (SODA) -- supports filtering, paging, JSON/CSV output |
| **API Endpoint Pattern** | `https://data.medicaid.gov/resource/{4x4-id}.json?$limit=50000&$offset=0` |
| **Format** | CSV download or JSON via SODA API |
| **Update Frequency** | **Weekly** (monthly snapshots on 1st Monday after 15th) |
| **Volume** | ~80,000-90,000 NDC records per weekly file |
| **Data Fields** | NDC, drug name, NDC description, pharmacy type (retail/mail), NADAC per unit, effective date, pricing unit, explanation code, classification, corresponding OTC indicator |
| **Legal** | **Public domain.** US government data. Completely free to use. |

**This is the single best source for actual drug acquisition costs.** NADAC represents what pharmacies actually pay wholesalers. Updated weekly. Covers virtually all drugs dispensed by Medicaid pharmacies (~90K NDCs).

**Integration Priority: HIGH** -- Can be loaded directly into D1 as a `drug_prices` table. Weekly CSV download is trivial to automate.

---

### 1.6 FDA Orange Book Data

| Field | Detail |
|---|---|
| **URL** | https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files |
| **Download** | https://www.fda.gov/media/76860/download?attachment (ZIP file) |
| **Format** | ZIP containing 3 tilde-delimited (~) ASCII text files |
| **Files** | `Products.txt`, `Patent.txt`, `Exclusivity.txt` |
| **API Alternative** | openFDA API: https://open.fda.gov/apis/drug/drugsfda/ (JSON, daily updates M-F) |
| **Bulk Download** | https://api.fda.gov/download.json (master index of all downloadable files) |
| **Update Frequency** | Monthly (data files); Daily M-F (openFDA API) |
| **Legal** | Public domain |

**Products.txt fields:** Active ingredient, dosage form, route, trade name, applicant, strength, application type, NDA number, product number, therapeutic equivalence code (TE), approval date, RLD status, drug type (RX/OTC/DISCN)

**Patent.txt fields:** NDA number, patent number, patent expiration, drug substance/product flags, patent use code

**Integration Notes:** Orange Book does NOT contain pricing data. It contains approval status, therapeutic equivalence (generic substitution ratings), and patent/exclusivity data. Useful for:
- Determining which drugs have generic equivalents (TE codes)
- Patent expiry dates (when generics will be available)
- Linking brand to generic products

**Priority: MEDIUM** -- Valuable metadata but not pricing data itself. Cross-reference with NADAC for price + equivalence.

---

### 1.7 State Medicaid Drug Utilization Data (SDUD)

| Field | Detail |
|---|---|
| **URL** | https://www.medicaid.gov/medicaid/prescription-drugs/state-drug-utilization-data |
| **Data Portal** | https://data.medicaid.gov |
| **Direct Download** | `https://download.medicaid.gov/data/SDUD{YYYY}.csv` (e.g., SDUD2024.csv) |
| **Also on** | https://catalog.data.gov/dataset/state-drug-utilization-data-2024 |
| **Format** | CSV (bulk), JSON (SODA API) |
| **Volume** | ~10-15M rows per year (state x NDC x quarter) |
| **Data Fields** | State, year, quarter, NDC, drug name, units reimbursed, number of prescriptions, total amount reimbursed, suppression flag, product name, labeler code |
| **Legal** | Public domain |
| **Update** | Quarterly, with ~6-month lag |

**Integration Notes:** Shows what Medicaid actually paid for each drug in each state. Cross-reference with NADAC for acquisition cost vs. reimbursement analysis. Volume data useful for identifying most common drugs for injury treatment.

---

### 1.8 Medicaid Drug Rebate Program - Pharmacy Pricing

| Field | Detail |
|---|---|
| **URL** | https://www.medicaid.gov/medicaid/prescription-drugs/pharmacy-pricing |
| **Data Portal** | https://data.medicaid.gov |
| **Format** | CSV/Excel, exportable from Socrata portal |
| **Legal** | Public domain |

Contains federal upper limit (FUL) prices and other pharmacy pricing benchmarks used by state Medicaid programs.

---

## 2. Ambulance/EMS Cost Data

### 2.1 CMS Ambulance Fee Schedule

| Field | Detail |
|---|---|
| **URL** | https://www.cms.gov/medicare/payment/fee-schedules/ambulance/ambulance-fee-schedule-public-use-files |
| **Download (2026)** | https://www.cms.gov/files/zip/cy-2026-file.zip |
| **Format** | ZIP containing CSV/Excel |
| **Years Available** | 2018-2026 |
| **Data Fields** | Contractor ID, locality, HCPCS codes, RVUs, GPCI, base rates, mileage rates (urban/rural), service levels (BLS, ALS1, ALS2, SCT, paramedic intercept) |
| **Legal** | Public domain |

**HCPCS ambulance codes:**
- A0425-A0436 (ground ambulance levels)
- A0431 (ALS1 emergency)
- A0433 (ALS2)
- A0434 (specialty care transport)
- A0435-A0436 (fixed-wing/rotary-wing air)
- A0888 (noncovered ambulance)

**2026 rates:** 2.0% inflation over 2025. Ground ambulance add-on payments continue.

**Integration Priority: HIGH** -- Direct ZIP download, fits perfectly into existing `medical_procedures` table with HCPCS codes.

---

### 2.2 Medicare Ground Ambulance Data Collection System (GADCS)

| Field | Detail |
|---|---|
| **URL** | https://www.cms.gov/medicare/payment/fee-schedules/ambulance/medicare-ground-ambulance-data-collection-system |
| **Format** | Summary reports (PDF), some data tables |
| **Volume** | Collected 2020-2024 from randomly selected providers |
| **Data** | Cost per transport, revenue, utilization, staffing |
| **Legal** | Public domain (summary data) |

**Key stats from data:** Median cost per ground transport: ~$429-$500+ (varies widely $224-$2,204).

---

### 2.3 GAO Ambulance Cost Reports

| Field | Detail |
|---|---|
| **Ground Report** | https://www.gao.gov/products/gao-13-6 (PDF) |
| **Air Report (2017)** | https://www.gao.gov/products/gao-17-637 |
| **Air Report (2019)** | https://www.gao.gov/products/gao-19-292 |
| **Format** | PDF reports with data tables |
| **Legal** | Public domain |

**Key data points:**
- Median ground ambulance cost per transport: $429 (2010 data)
- Median air ambulance charge: $36,400 helicopter, $40,600 fixed-wing (2017)
- Medicare median air ambulance payment: $6,502 per transport (2014)

**Integration Notes:** Static reference data. Best used to seed aggregate cost ranges for ambulance services. Not programmatically updatable.

---

### 2.4 ASPE Air Ambulance Data

| Field | Detail |
|---|---|
| **URL** | https://aspe.hhs.gov/sites/default/files/2021-09/aspe-air-ambulance-ib-09-10-2021.pdf |
| **Format** | PDF issue brief |
| **Data** | Air ambulance utilization, surprise billing rates, cost distributions |
| **Legal** | Public domain |

---

## 3. Scrapable Public Sources for Medical Procedure Costs

### 3.1 MDsave.com

| Field | Detail |
|---|---|
| **URL** | https://www.mdsave.com |
| **API** | GraphQL API at https://developer.mdsave.com |
| **Key Query** | `searchProcedures` -- indexes entire marketplace by location, provider network, specialty |
| **Format** | JSON (GraphQL responses) |
| **Data** | Bundled procedure prices (includes CPT codes), provider info, location, cash pay vs. insurance pricing |
| **Legal** | **HIGH RISK.** MDsave sued Sesame, Green Imaging, and Tripment for scraping in 2024. Allegations of "widespread IP infringement." API access requires approval. |

**Verdict:** Has excellent transparent bundled pricing data. Official GraphQL API exists but requires partnership/approval. **Do NOT scrape without permission** -- active litigation against scrapers.

---

### 3.2 Healthcare Bluebook (Valenz Bluebook)

| Field | Detail |
|---|---|
| **URL** | https://www.healthcarebluebook.com |
| **Access** | Members-only (employer-sponsored benefit). No public API. |
| **Data** | "Fair Price" estimates for 200+ procedures, quality ratings for 4,000+ facilities |
| **Format** | Web-only (no downloads, no API) |
| **Legal** | Proprietary. Login required. Not scrapable. |

**Verdict:** Not viable for data extraction. Requires employer plan membership. No public API or data export.

---

### 3.3 New Choice Health

| Field | Detail |
|---|---|
| **URL** | https://www.newchoicehealth.com |
| **API Page** | https://www.newchoicehealth.com/WebServices |
| **Access** | API key (request via form). "Experimental" service, no uptime guarantee. |
| **Data** | Medical procedure pricing for 17,000+ facilities nationwide. National and local level. |
| **Format** | Presumably JSON (documentation provided after signup) |
| **URL Structure (public)** | `https://www.newchoicehealth.com/places/{state}/{city}/{procedure-category}/{procedure-name}` |
| **Legal** | Proprietary. TOS prohibits reproduction without written permission. API access is officially supported. |
| **Contact** | service@newchoicehealth.com, (850) 898-1410 |

**Verdict:** Worth requesting API access. 17K facilities is substantial. The "experimental" caveat is concerning for production use.

---

### 3.4 CostHelper Health

| Field | Detail |
|---|---|
| **URL** | https://health.costhelper.com |
| **Access** | Scraping (no API) |
| **URL Structure** | `https://health.costhelper.com/{condition-or-procedure}.html` |
| **Categories** | ~20+ medical specialties: cardiology, emergency, orthopedics, surgery, diabetes, etc. |
| **Data** | Typical cost ranges (low/average/high), user-reported prices, insurance vs. uninsured costs |
| **Format** | HTML pages, semi-structured text |
| **Volume** | ~200-400 procedure/condition pages |
| **Legal** | **Moderate risk.** No API. Cloudflare-protected. TOS should be checked. Content is editorial/factual cost reporting. |

**Example pages:**
- `health.costhelper.com/ambulance.html`
- `health.costhelper.com/emergency-room.html`
- `health.costhelper.com/mri-cost.html`
- `health.costhelper.com/broken-arm.html`

**Verdict:** Good for seed data (cost ranges per condition). Small enough to manually transcribe key injury-related pages rather than automated scraping. ~50-100 relevant injury pages.

---

### 3.5 FAIR Health Consumer

| Field | Detail |
|---|---|
| **Consumer Tool** | https://www.fairhealthconsumer.org/medical |
| **Organization** | https://www.fairhealth.org |
| **API** | Available through **commercial licensing** only |
| **API Coverage** | 15,000+ procedure codes, 493 geozips, charge benchmarks from 5th-95th percentile |
| **Data Source** | Largest private claims database in US (billions of claims) |
| **Update** | Twice per year (12-month rolling data) |
| **Legal** | **Commercially licensed.** API requires paid agreement. Consumer site is for individual lookups only. |
| **Contact** | service@fairhealth.org, 855-301-3247 |

**Important legal note on "factual data not copyrightable":** While raw facts (like a specific price point) are not copyrightable under Feist v. Rural Telephone, FAIR Health's *compilation* and *derived estimates* (percentile calculations from proprietary claims data) likely have compilation copyright protection. Individual facts queried one-at-a-time from the consumer tool are fine, but bulk extraction would violate TOS and potentially CFAA.

**Verdict:** Gold standard for commercial medical cost data. Worth licensing for production if budget allows. Not viable for free bulk extraction.

---

### 3.6 Hospital Price Transparency Machine-Readable Files (NEW - 2026)

| Field | Detail |
|---|---|
| **Mandate** | CMS requires all US hospitals to publish machine-readable files (MRFs) with all standard charges |
| **Effective** | January 1, 2021 (original); major updates effective January 1, 2026, enforcement April 1, 2026 |
| **Format** | JSON or CSV (hospital-specific), typically at `{hospital-website}/chargemaster` or similar |
| **Data Fields (2026)** | Gross charge, discounted cash price, **median allowed amount**, **10th/90th percentile allowed amounts**, payer-specific negotiated rates, de-identified min/max, billing codes (CPT/HCPCS/DRG) |
| **Volume** | 7,000+ US hospitals, each with thousands of charge items |
| **Legal** | **Public data by federal mandate.** Hospitals are required to make this public. |

**Aggregators:**
- **DoltHub** | https://www.dolthub.com/repositories/dolthub/standard-charge-files (free, open source hospital URLs database)
- **Turquoise Health** | https://turquoise.health/researchers (1B+ records, free for non-commercial research)
- **Payless Health** | Uses DoltHub data
- **GitHub** | https://github.com/vsoch/hospital-chargemaster (monthly updated chargemaster data)
- **ChargeMaster Data Aggregator** | https://github.com/Chargemaster/ChargeMaster_Data_Aggregator

**Integration Priority: HIGH** -- This is the most comprehensive source of actual hospital pricing. The 2026 update adding median/percentile allowed amounts makes this dramatically more useful than earlier versions.

---

## 4. AHRQ Data Tools

### 4.1 HCUPnet

| Field | Detail |
|---|---|
| **URL** | https://datatools.ahrq.gov/hcupnet |
| **Access** | Web-based query tool only (no API, no bulk download) |
| **Data** | Average charges, length of stay, in-hospital mortality by DRG, CCS, ICD-10 diagnosis |
| **Databases** | NIS (inpatient, ~35M stays/year), NEDS (ED, ~130M visits/year), SASD (ambulatory surgery) |
| **Breakdowns** | By age, sex, payer, region, state |
| **Legal** | Free to query. Results can be cited. |

**Limitations:**
- No API or programmatic access
- Must use web form to query one combination at a time
- Results are pre-aggregated (no record-level data)
- Suppresses small cell sizes

**Workaround:** Could be systematically queried via browser automation (Puppeteer/Playwright), but this is slow and fragile. Better to use the full HCUP databases if available.

**Full HCUP Databases:**
- **NIS** (Nationwide Inpatient Sample): Requires Data Use Agreement (DUA) + fee ($350-$500/year)
- **NEDS** (Nationwide ED Sample): Same DUA requirement
- Apply at: https://hcup-us.ahrq.gov/databases.jsp

**Integration Priority: MEDIUM** -- HCUPnet is the best source for DRG/diagnosis-level cost data. Worth building a scraper for key injury DRGs, or applying for NIS access.

---

### 4.2 MEPS (Medical Expenditure Panel Survey)

| Field | Detail |
|---|---|
| **URL** | https://meps.ahrq.gov/data_stats/download_data_files.jsp |
| **GitHub** | https://github.com/HHS-AHRQ/MEPS (example code in R, SAS, Python) |
| **Access** | Direct file download (no auth required for public use files) |
| **Format** | SAS (.sas7bdat), Stata (.dta), Excel (.xlsx), ASCII (.dat) -- since 2017; earlier years vary |
| **Key Files** | Household Component (HC) full-year files, Medical Conditions, Prescribed Medicines, Office-Based/Hospital events |
| **Volume** | ~30,000-40,000 persons per panel; ~300,000 event records per year |
| **Legal** | Public use files -- free, no DUA required |
| **Update** | Annual (~2-year lag; 2023 data likely available by late 2025) |

**Key MEPS files for this project:**
- **Prescribed Medicines File** (HC-xxx): Drug name, NDC, quantity, expenditures (total, out-of-pocket, Medicare, Medicaid, private insurance), number of refills, condition treated
- **Hospital Inpatient Stays**: Charges, payments by source, diagnoses, procedures
- **Emergency Room Visits**: Same structure
- **Office-Based Medical Provider Visits**: Visit costs, procedures performed

**Data Fields (Prescribed Medicines):**
Drug ID, NDC, medicine name, quantity dispensed, total expenditure, out-of-pocket, Medicare paid, Medicaid paid, private insurance paid, other insurance paid, number of refills, therapeutic class, condition codes

**Integration Priority: HIGH** -- MEPS is the best source for understanding who pays what (payer mix) for medical services and drugs. Ideal for generating "what patients actually pay" estimates vs. "what it costs."

---

## 5. Insurance Rate Filings

### 5.1 SERFF (System for Electronic Rates & Forms Filing)

| Field | Detail |
|---|---|
| **URL** | https://www.serff.com |
| **Public Access** | https://filingaccess.serff.com/sfa/home/{STATE} (e.g., /MI, /TX, /CO) |
| **Access** | Free web search. State-by-state. |
| **Data** | Rate filings (premium calculations), form filings (policy documents), rule filings (underwriting guidelines) |
| **Format** | PDF documents (individual filings) |
| **Legal** | Public record. Free to access and download. |

**Participating states (examples):** Arizona, Georgia, Illinois, Indiana, Michigan, Texas, Washington, and growing.

**Limitations:**
- No API or bulk download
- Each filing is a separate PDF
- Searching is state-by-state through individual portals
- Rate filings contain formulas/methodologies, not simple price tables

**Verdict:** Useful for understanding how insurers calculate premiums but impractical for systematic data extraction. Too fragmented and PDF-heavy.

---

### 5.2 State Insurance Department Rate Filings

| Field | Detail |
|---|---|
| **California** | https://www.insurance.ca.gov/0250-insurers/0800-rate-filings/ |
| **Colorado** | https://doi.colorado.gov (similar structure per state) |
| **Access** | Varies by state. Most offer public search portals. |
| **Format** | PDF filings |
| **Legal** | Public record |

**Verdict:** Same limitations as SERFF. Useful for specific research, not bulk data.

---

### 5.3 ACA Marketplace Plan Data (data.healthcare.gov)

| Field | Detail |
|---|---|
| **Plan Data PUFs** | https://www.healthcare.gov/plan-data/ |
| **Marketplace API** | https://developer.cms.gov/marketplace-api/ |
| **API Endpoints** | `POST /plans/search`, `POST /households/eligibility_estimates`, `GET /drugs_covered`, `GET /providers_covered`, `GET /crosswalk` |
| **Auth** | API key (request from CMS, auto-renews every 60 days) |
| **Format** | JSON (API), CSV (PUFs) |
| **Data** | Plan benefits, premiums, deductibles, copays, formularies, provider networks, metal levels |
| **Legal** | Public data. API TOS prohibits bulk extraction (designed for live user queries). PUFs are bulk-downloadable. |

**Public Use Files include:**
- Plan Attributes PUF (benefits, metal level, plan type, issuer)
- Rate PUF (premiums by age, tobacco status, rating area)
- Benefits and Cost Sharing PUF (copays, coinsurance, deductibles by service)
- Network PUF (provider networks)
- Formulary PUF (drug tiers)

**Integration Priority: MEDIUM** -- PUFs are great for understanding insurance plan cost structures. Rate PUF can show premium variations. Benefits PUF can show typical copays/coinsurance for medical services.

---

## 6. Medical Device/Implant Costs

### 6.1 CMS DMEPOS Fee Schedule

| Field | Detail |
|---|---|
| **URL** | https://www.cms.gov/medicare/payment/fee-schedules/dmepos |
| **2026 Download** | https://www.cms.gov/files/zip/dme26.zip |
| **Format** | ZIP containing CSV/Excel |
| **Update** | Annual (with quarterly adjustments for some items) |
| **2026 Factor** | 2.0% inflation over 2025 (2.8% for former competitive bidding areas) |
| **Data Fields** | HCPCS code, description, fee schedule amount, floor, ceiling, payment category, jurisdiction |
| **Volume** | ~7,000-10,000 HCPCS codes |
| **Legal** | Public domain |

**Key HCPCS categories for injury treatment:**
- **E-codes**: Durable medical equipment (wheelchairs E1000s, hospital beds E0250s, CPAP E0601)
- **K-codes**: DME temporary codes
- **L-codes**: Orthotics and prosthetics (braces L0000-L4999, prosthetic limbs L5000-L9999)
- **A-codes**: Surgical supplies, ambulance

**Integration Priority: HIGH** -- Direct download, fits existing schema. L-codes (orthotics/prosthetics) are especially relevant for injury treatment costs.

---

### 6.2 Hospital Implant Cost Data

No single centralized source exists. Options:

1. **Hospital Price Transparency Files** (Section 3.6 above) -- Include implant costs in chargemaster data. Most comprehensive.
2. **CMS MS-DRG Weights** -- DRG payments implicitly include device costs for inpatient stays. Available at https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps
3. **Orthopedic Implant Companies** -- Publish list prices in SEC filings (Stryker, Zimmer Biomet, Smith & Nephew, Medtronic)
4. **ECRI Institute** -- Maintains device pricing database (subscription required, ~$20K+/year)

**Typical implant costs (from literature):**
- Hip replacement implant: $2,000-$15,000
- Knee replacement implant: $3,000-$12,000
- Spinal fusion hardware: $5,000-$25,000
- Cardiac stent: $1,500-$5,000
- Pacemaker: $5,000-$20,000

---

## 7. Summary: Recommended Data Loading Priority

### Tier 1 -- Load Immediately (public, bulk CSV, no auth)

| Source | Records | Format | Effort |
|---|---|---|---|
| **NADAC Drug Prices** | ~90K NDCs/week | CSV | Low -- weekly CSV download |
| **CMS Ambulance Fee Schedule** | ~500 rows | CSV/ZIP | Low -- single ZIP |
| **CMS DMEPOS Fee Schedule** | ~8K codes | CSV/ZIP | Low -- single ZIP |
| **CMS ASP Drug Pricing** | ~1K HCPCS/quarter | CSV/ZIP | Low -- quarterly ZIP |
| **FDA Orange Book** | ~35K products | Tilde-delimited TXT | Low -- monthly ZIP |

### Tier 2 -- Load with Moderate Effort (API or large downloads)

| Source | Records | Format | Effort |
|---|---|---|---|
| **CMS Part D Spending by Drug** | ~4K drugs | JSON API / CSV | Medium -- data.cms.gov API |
| **CMS Part B Spending by Drug** | ~500 drugs | JSON API / CSV | Medium -- data.cms.gov API |
| **State Drug Utilization Data** | ~12M rows/year | CSV | Medium -- large files |
| **MEPS Prescribed Medicines** | ~300K events/year | SAS/Stata/CSV | Medium -- needs transformation |
| **ACA Plan Benefits PUF** | ~100K plan-service rows | CSV | Medium -- annual download |
| **Hospital Price Transparency (via DoltHub)** | Millions | JSON/CSV | Medium-High -- aggregation needed |

### Tier 3 -- Requires Partnership or Licensing

| Source | Access | Cost |
|---|---|---|
| **FAIR Health API** | Commercial license | Contact for pricing |
| **GoodRx API** | Partnership agreement | Free but restricted use |
| **New Choice Health API** | Request API key | Free (experimental) |
| **MDsave GraphQL API** | Partnership required | Unknown |
| **Turquoise Health** | Non-commercial research agreement | Free (limited) |

### Tier 4 -- Manual/Reference Only

| Source | Format | Notes |
|---|---|---|
| **HCUPnet** | Web query tool | Could automate with Playwright for key DRGs |
| **CostHelper Health** | HTML pages | Manual transcription for ~50 key injury pages |
| **GAO Reports** | PDF | Static reference data |
| **SERFF Rate Filings** | PDF | Too fragmented for automation |
| **Healthcare Bluebook** | Members-only web | Not accessible |

---

## 8. Recommended New Schema Additions

Based on this research, the following tables would complement the existing schema:

```sql
-- Drug pricing (NADAC + ASP + Part D spending)
CREATE TABLE drug_prices (
  id TEXT PRIMARY KEY,
  ndc TEXT,                    -- 11-digit NDC
  hcpcs_code TEXT,            -- HCPCS J-code (for Part B drugs)
  drug_name TEXT NOT NULL,
  generic_name TEXT,
  brand_name TEXT,
  dosage_form TEXT,
  strength TEXT,
  package_size TEXT,
  nadac_per_unit REAL,        -- From NADAC
  asp_payment_limit REAL,     -- From CMS ASP (Part B)
  avg_spending_per_claim REAL, -- From CMS spending data
  avg_cost_per_unit REAL,     -- From CMS spending data
  total_claims INTEGER,       -- Volume indicator
  source TEXT NOT NULL,
  effective_date TEXT,
  UNIQUE(ndc, source, effective_date)
);

-- Ambulance service rates
CREATE TABLE ambulance_rates (
  id TEXT PRIMARY KEY,
  hcpcs_code TEXT NOT NULL,   -- A0425-A0436
  service_level TEXT,          -- BLS, ALS1, ALS2, SCT, etc.
  locality TEXT,
  state_code TEXT,
  base_rate REAL,
  mileage_rate REAL,
  urban_rural TEXT,
  effective_year INTEGER,
  source TEXT DEFAULT 'CMS_AFS',
  UNIQUE(hcpcs_code, locality, effective_year)
);

-- DME/Device pricing
CREATE TABLE dme_device_prices (
  id TEXT PRIMARY KEY,
  hcpcs_code TEXT NOT NULL,
  description TEXT,
  category TEXT,               -- DME, Orthotics, Prosthetics, Supplies
  fee_schedule_amount REAL,
  fee_floor REAL,
  fee_ceiling REAL,
  jurisdiction TEXT,
  effective_year INTEGER,
  source TEXT DEFAULT 'CMS_DMEPOS',
  UNIQUE(hcpcs_code, jurisdiction, effective_year)
);
```

---

## 9. Data Volume Estimates

If all Tier 1 + Tier 2 sources are loaded:

| Table | Estimated Rows |
|---|---|
| medical_procedures (existing) | ~17,000 (CMS PFS) |
| drug_prices | ~95,000 (NADAC) + 4,500 (spending) |
| ambulance_rates | ~500 |
| dme_device_prices | ~8,000 |
| injury_cost_aggregates (existing) | ~1,000 |
| medical_cost_geographic (existing) | ~2,000 |

**Total:** ~125,000 rows in D1 -- well within Cloudflare D1 limits.

With hospital transparency data: potentially millions of rows (would need separate storage strategy or pre-aggregation).
