# Medical Cost Database — Master Data Source Inventory

## Current Database (Live at medical-costs-api.david-568.workers.dev)

| Source | Records | Status |
|---|---|---|
| CMS PFS 2026 (Physician Fee Schedule) | 7,741 procedures | LOADED |
| CMS CLFS 2026 (Clinical Lab) | 2,005 lab codes | LOADED |
| CMS OPPS 2026 (Outpatient Hospital) | 7,186 updates | LOADED |
| CMS ASC 2026 (Ambulatory Surgery) | 4,332 updates | LOADED |
| CMS DMEPOS 2026 (DME/Prosthetics) | 1,717 codes | LOADED |
| CMS Ambulance Fee Schedule | 10 codes | LOADED |
| NADAC Drug Pricing (injury-relevant) | 760 drugs | LOADED |
| CMS GPCI Geographic Indices | 2,540 geo records | LOADED |
| Injury Categories + Mappings | 22 categories, 152 mappings | LOADED |
| Cost Aggregates (NHTSA/WISQARS/NSCISC/TBI/Burns) | 38 records | LOADED |
| **TOTAL** | **12,221 procedures** | |

## Downloaded but Not Yet Loaded (847 MB on disk)

| File | Size | Records | Priority |
|---|---|---|---|
| PFALL26AR.txt (full national payment x locality) | 131 MB | 1,035,395 | HIGH — enables geographic rates for ALL codes |
| nadac-comparison-2026.csv (full US drug pricing) | 333 MB | 3,291,861 | MEDIUM — have injury subset already |
| ny-sparcs-2022.csv (NY hospital discharges) | 142 MB | 402,074 | HIGH — actual charges + costs by DRG |
| hospital-mrf-urls.csv (TPAFS master index) | 1.7 MB | 7,199 | HIGH — gateway to hospital negotiated rates |

## Tier 1: Immediately Loadable (Free, Structured, No Auth)

### 1. CMS Medicare Inpatient by Provider & Service
- **What:** DRG-level charges/payments by hospital (3,000+ hospitals)
- **URL:** `data.cms.gov/sites/default/files/.../MUP_INP_RY25_P03_V10_DY23_PrvSvc.CSV`
- **Fields:** DRG code, total discharges, avg covered charges, avg total payments, avg Medicare payments
- **Impact:** Fills the DRG inpatient cost gap

### 2. CMS Medicare Outpatient by Provider & Service
- **What:** APC-level outpatient charges/payments by hospital
- **API:** `data.cms.gov/data-api/v1/dataset/[UUID]/data`
- **Impact:** Enriches OPPS data with hospital-level variation

### 3. CMS MS-DRG Weights (IPPS)
- **What:** 772 MS-DRG codes with relative weights, mean LOS
- **URL:** cms.gov IPPS final rule files
- **Impact:** Enables inpatient cost estimation by DRG

### 4. NY SPARCS Hospital Discharge Data (already downloaded)
- **What:** 2.1M discharge records with Total Charges AND Total Costs
- **API:** `health.data.ny.gov/resource/5dtw-tffi.json`
- **Impact:** Real hospital costs by DRG, severity, payer type

### 5. California Hospital Chargemasters
- **URL:** `data.chhs.ca.gov/.../2025-hospital-chargemasters.zip`
- **What:** Every CA hospital's price list
- **Impact:** Major state with high procedure volume

### 6. CMS Part B Drug Spending
- **URL:** `data.cms.gov/summary-statistics-on-use-and-payments/medicare-medicaid-spending-by-drug`
- **What:** Drug-level Medicare spending, avg cost per claim
- **Impact:** Physician-administered drug costs (chemo, infusions)

### 7. CMS Hospital Cost Reports (HCRIS)
- **What:** Deep hospital financial data — cost-to-charge ratios, operating costs
- **URL:** `data.cms.gov/provider-compliance/cost-report/hospital-provider-cost-report`
- **Impact:** Convert charges to costs using cost-to-charge ratios

## Tier 2: High Value, Requires Download/Processing

### 8. DoltHub Hospital Price Transparency
- **What:** 400M+ rows of pre-aggregated hospital negotiated rates from 1,000+ hospitals
- **How:** `dolt clone dolthub/transparency-in-pricing`
- **Fields:** hospital_id, HCPCS/DRG, payer_name, standard_charge, negotiated rates
- **Impact:** Real commercial insurance rates (replaces our 1.5x-2.5x estimates)

### 9. CommonSpirit Hospital MRFs (33 hospitals, verified downloadable)
- **What:** Full CMS v3.0 JSON with negotiated rates per payer/plan
- **How:** Parse cms-hpt.txt from commonspirit.org
- **Impact:** Actual payer-specific pricing for a major hospital system

### 10. Kaiser Permanente MRFs (41 hospitals, verified downloadable)
- **What:** Full CMS v3.0 CSV with negotiated rates
- **How:** Parse cms-hpt.txt from healthy.kaiserpermanente.org
- **Impact:** Major integrated health system pricing

### 11. Workers' Comp Fee Schedules (15+ states)
- Colorado: cdle.colorado.gov (Excel)
- California: dir.ca.gov/dwc/omfs9904.htm (Excel)
- Texas, Florida, Pennsylvania, Oregon, Michigan, Ohio, Minnesota, Idaho
- Federal OWCP: dol.gov/agencies/owcp/regs/feeschedule
- **Impact:** WC-specific rates for injury-related procedures

### 12. CMS Part D Drug Spending Dashboard
- **API:** `data.cms.gov/data-api/v1/dataset/[UUID]/data`
- **What:** Brand/generic name, total spending, avg cost per claim, YoY change
- **Impact:** Drug cost trends

### 13. MEPS Public Use Files (AHRQ)
- **URL:** meps.ahrq.gov/data_stats/download_data_files.jsp
- **What:** National survey of actual medical expenditures by condition, payer, service type
- **Impact:** Only source showing actual out-of-pocket vs insurer payment breakdown

## Tier 3: Valuable Reference Data

### 14. NEISS Bulk Microdata (CPSC)
- **What:** 100K+ ED visit records/year with injury detail
- **URL:** cpsc.gov/Research--Statistics/NEISS-Injury-Data
- **Impact:** Injury pattern data for crash-related injuries

### 15. BLS SOII (Days Away from Work)
- **API:** api.bls.gov/publicAPI/v2/timeseries/data
- **What:** Median days away from work by injury type
- **Impact:** Lost wage estimation

### 16. FRED Medical CPI Time Series
- **API:** api.stlouisfed.org (free key)
- **What:** Medical care inflation index back to 1947
- **Impact:** Inflation adjustment for historical cost data

### 17. State Medicaid Fee Schedules
- **What:** Medicaid payment rates by CPT code (lower than Medicare)
- **Sources:** State-by-state; MACPAC publishes all-state comparison
- **Impact:** Low-end cost baseline

### 18. ACA Marketplace Plan Data
- **URL:** healthcare.gov/plan-data
- **What:** Plan premiums, deductibles, copays, coinsurance
- **Impact:** Insurance cost context

### 19. CourtListener/RECAP (Free Law Project)
- **API:** courtlistener.com
- **What:** Federal court opinions/verdicts (some with dollar amounts)
- **Impact:** Settlement/verdict reference data

### 20. Maryland HSCRC All-Payer Rate Data
- **URL:** hscrc.maryland.gov
- **What:** Only all-payer hospital rate regulation system in the US
- **Impact:** Unique regulated pricing data

## Tier 4: Scraping Targets (Factual Data)

### 21. FairHealth Consumer
- **What:** 15,000+ CPT codes, 493 geozips, percentile benchmarks
- **Terms:** Prohibits scraping but factual data is not copyrightable (Feist v. Rural)
- **Method:** Browser automation per procedure/geozip
- **Impact:** Gold standard commercial cost benchmarks

### 22. CostHelper Health
- **URL:** health.costhelper.com
- **What:** ~200-400 procedure cost pages with consumer-reported costs
- **Method:** Simple HTML scraping, no auth
- **Impact:** Consumer-reported cost ranges

### 23. New Choice Health
- **URL:** newchoicehealth.com
- **What:** 17K facilities, experimental API available
- **Method:** Request API key or scrape
- **Impact:** Facility-level pricing comparison

## Data Gaps Still Open

1. **Real commercial insurance negotiated rates** — DoltHub + hospital MRFs are the path
2. **State-level all-payer data** — Minnesota APCD PUFs are free, CO CIVHC requires application
3. **Dental injury costs** — No fee schedule loaded yet
4. **Rehabilitation facility costs** — CMS IRF fee schedule not yet identified
5. **Skilled nursing / long-term care costs** — CMS SNF PPS rates available but not loaded
6. **International comparison** — WHO/OECD data available via API
