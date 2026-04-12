# Medical Cost Transparency Site -- Complete Architecture

## Table of Contents

1. [Overview](#1-overview)
2. [Data Inventory](#2-data-inventory)
3. [URL Structure](#3-url-structure)
4. [Page Templates](#4-page-templates)
5. [Homepage Design](#5-homepage-design)
6. [Navigation](#6-navigation)
7. [Programmatic Internal Linking](#7-programmatic-internal-linking)
8. [Technical SEO](#8-technical-seo)
9. [Frontend Framework Recommendation](#9-frontend-framework-recommendation)
10. [Cloudflare Infrastructure](#10-cloudflare-infrastructure)
11. [Build & Deployment](#11-build-and-deployment)
12. [Data Pipeline](#12-data-pipeline)

---

## 1. Overview

A medical cost transparency website that turns CMS public pricing data into consumer-facing pages. The site generates 30,000-50,000 static pages targeting long-tail search queries like "how much does an MRI cost in California" and "knee replacement surgery cost near me."

**Domain:** medicalcosts.info (or similar -- TBD)
**Stack:** Astro 5 (static site) + Cloudflare Pages + Cloudflare Workers API (existing `medical-costs-api`)
**Database:** Cloudflare D1 (existing, `medical-costs-db`)

### Page Count Estimates

| Page Type | Count Formula | Estimated Pages |
|---|---|---|
| Homepage | 1 | 1 |
| Procedure index | 1 | 1 |
| Procedure detail | 12,000 (active codes with rates) | 12,000 |
| Procedure + state | 12,000 x 50 (but only where geo data exists) | ~8,750 |
| Condition index | 1 | 1 |
| Condition detail | 80 | 80 |
| Condition + state | 80 x 50 | 4,000 |
| Category index | 1 | 1 |
| Category pages | ~25 categories | 25 |
| Drug index | 1 | 1 |
| Drug detail | 760 (injury-relevant loaded; 10K target) | 760-10,000 |
| State index | 1 | 1 |
| State overview | 50 | 50 |
| DRG index | 1 | 1 |
| DRG detail | 772 MS-DRGs | 772 |
| Estimator | 1 | 1 |
| Compare | 1 | 1 |
| Static pages (about, methodology, sources) | ~5 | 5 |
| **Total** | | **~26,700-36,700** |

---

## 2. Data Inventory

### Currently Loaded in D1

| Dataset | Records | Table |
|---|---|---|
| CMS PFS 2026 (Physician Fee Schedule) | 7,741 | `medical_procedures` |
| CMS CLFS 2026 (Clinical Lab) | 2,005 | `medical_procedures` |
| CMS OPPS 2026 (Outpatient Hospital) | 7,186 | `medical_procedures` (updates) |
| CMS ASC 2026 (Ambulatory Surgery) | 4,332 | `medical_procedures` (updates) |
| CMS DMEPOS 2026 | 1,717 | `medical_procedures` |
| CMS Ambulance | 10 | `medical_procedures` |
| NADAC Drug Pricing | 760 | separate or `medical_procedures` |
| CMS GPCI Geographic Indices | 2,540 | `medical_cost_geographic` |
| Injury Categories + Mappings | 22 + 152 | `injury_categories`, `injury_procedure_mappings` |
| Cost Aggregates | 38 | `injury_cost_aggregates` |

### New Tables Needed for Site

```sql
-- Conditions (80+ mapped to procedures and ICD-10 codes)
CREATE TABLE conditions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,              -- e.g., "Orthopedic", "Neurological"
  description TEXT,           -- 2-3 sentence consumer summary
  body_region TEXT,
  icd10_codes TEXT,           -- JSON array
  symptoms TEXT,              -- JSON array
  common_procedures TEXT,     -- JSON array of procedure codes
  typical_cost_low REAL,
  typical_cost_high REAL,
  recovery_weeks_low INTEGER,
  recovery_weeks_high INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  content_body TEXT,          -- Markdown content for the page
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DRG hospital stays (from CMS Inpatient Provider data)
CREATE TABLE drg_costs (
  id TEXT PRIMARY KEY,
  drg_code TEXT NOT NULL,
  drg_description TEXT NOT NULL,
  drg_weight REAL,
  mean_los REAL,              -- mean length of stay
  geometric_mean_los REAL,
  total_discharges INTEGER,
  avg_covered_charges REAL,
  avg_total_payment REAL,
  avg_medicare_payment REAL,
  effective_year INTEGER DEFAULT 2023,
  UNIQUE(drg_code, effective_year)
);

-- Procedure slugs (human-readable URLs for CPT codes)
CREATE TABLE procedure_slugs (
  code TEXT PRIMARY KEY,       -- CPT/HCPCS code
  slug TEXT NOT NULL UNIQUE,   -- e.g., "mri-lumbar-spine"
  display_name TEXT NOT NULL,  -- e.g., "MRI Lumbar Spine"
  page_title TEXT,
  meta_description TEXT
);

-- Drug pricing (expanded from NADAC)
CREATE TABLE drug_prices (
  id TEXT PRIMARY KEY,
  ndc TEXT,
  generic_name TEXT NOT NULL,
  brand_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  dosage_form TEXT,
  strength TEXT,
  nadac_per_unit REAL,
  effective_date TEXT,
  otc_indicator TEXT,
  category TEXT,              -- e.g., "Pain Management", "Anti-inflammatory"
  common_uses TEXT,           -- JSON array
  meta_title TEXT,
  meta_description TEXT
);
```

---

## 3. URL Structure

### Primary Routes

```
/                                        Homepage
/procedures/                             Procedure index (paginated, filterable)
/procedures/[slug]/                      Procedure detail (e.g., /procedures/mri-lumbar-spine/)
/procedures/[slug]/[state]/              Procedure in state (e.g., /procedures/mri-lumbar-spine/colorado/)
/conditions/                             Condition index
/conditions/[slug]/                      Condition detail (e.g., /conditions/acl-tear/)
/conditions/[slug]/[state]/              Condition in state
/categories/                             Category index
/categories/[slug]/                      Category page (e.g., /categories/radiology/)
/drugs/                                  Drug pricing index
/drugs/[slug]/                           Drug detail (e.g., /drugs/ibuprofen-800mg/)
/states/                                 State index (50-state map)
/states/[state]/                         State overview (e.g., /states/california/)
/drg/                                    Hospital stay costs index
/drg/[code]/                             DRG detail (e.g., /drg/470-hip-knee-replacement/)
/estimator/                              Interactive cost estimator (client-side)
/compare/                                Side-by-side comparison tool (client-side)
/about/                                  About the data
/methodology/                            How costs are calculated
/sources/                                Data sources and citations
```

### Slug Conventions

| Entity | Slug Pattern | Example |
|---|---|---|
| Procedure | Lowercase description, truncated to 60 chars | `mri-lumbar-spine-without-contrast` |
| Condition | Lowercase condition name | `acl-tear`, `herniated-disc` |
| Category | Lowercase category name | `radiology`, `physical-therapy` |
| Drug | Generic name + strength | `ibuprofen-800mg`, `oxycodone-5mg` |
| State | Full lowercase state name | `california`, `new-york`, `colorado` |
| DRG | Code + truncated description | `470-hip-knee-replacement` |

### Trailing Slash Policy

All URLs use trailing slashes. Cloudflare Pages handles this natively with `trailingSlash: "always"` in Astro config. Non-trailing-slash URLs 301 redirect.

### Canonical URL Rules

- `https://medicalcosts.info/procedures/mri-lumbar-spine/` is canonical
- No `www` subdomain (redirect www to apex)
- HTTPS only (Cloudflare automatic)
- State pages canonical to themselves (not to the non-state version)

---

## 4. Page Templates

### 4.1 Procedure Detail Page (`/procedures/[slug]/`)

**Title tag:** `{ProcedureName} Cost in 2026 | How Much Does {ShortName} Cost?`
Example: `MRI Lumbar Spine Cost in 2026 | How Much Does a Lumbar MRI Cost?`

**H1:** `How Much Does {ProcedureName} Cost?`

**Meta description:** `{ProcedureName} (CPT {Code}) costs ${NationalFacilityRate}-${CommercialHigh} in 2026. Compare Medicare, hospital outpatient, and estimated commercial insurance rates by location.`

**Key content sections:**
1. **Cost summary card** -- National Medicare facility rate, non-facility rate, OPPS rate, ASC rate, estimated commercial range. Visual bar chart.
2. **What is {Procedure}?** -- 2-3 sentence consumer-friendly explanation.
3. **Cost breakdown table** -- Medicare facility, Medicare non-facility, Hospital outpatient, ASC, Estimated commercial (low/mid/high).
4. **Cost by state** -- Table of all states with geographic data. Links to `/procedures/[slug]/[state]/`. Sortable.
5. **Related procedures** -- Same category or body system. Links to other procedure pages.
6. **Related conditions** -- Conditions that commonly require this procedure. Links to condition pages.
7. **Understanding your bill** -- Brief FAQ: "Does insurance cover this?", "Why does cost vary?", "Medicare vs commercial rates."
8. **Methodology note** -- Source citation, conversion factor, effective year.

**Internal links:**
- Breadcrumb: Home > Procedures > {Category} > {Procedure}
- Each state row links to `/procedures/[slug]/[state]/`
- Related procedures link to their detail pages
- Related conditions link to condition pages
- Category link in breadcrumb to `/categories/[slug]/`

**Schema markup:** `MedicalProcedure` + `Offer` (priceRange)
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "MRI Lumbar Spine Without Contrast",
  "procedureType": "https://schema.org/DiagnosticProcedure",
  "bodyLocation": "Lumbar spine",
  "code": {
    "@type": "MedicalCode",
    "codeValue": "72148",
    "codingSystem": "CPT"
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "120.00",
    "highPrice": "450.00",
    "priceCurrency": "USD"
  }
}
```

**Data needed:** `medical_procedures` row + `medical_cost_geographic` for all states + `injury_procedure_mappings` + `procedure_slugs`.

---

### 4.2 Procedure + State Page (`/procedures/[slug]/[state]/`)

**Title tag:** `{ProcedureName} Cost in {State} (2026) | {State} {ShortName} Prices`

**H1:** `{ProcedureName} Cost in {State}`

**Meta description:** `{ProcedureName} costs ${FacilityRate}-${CommercialHigh} in {State} in 2026. See Medicare rates, GPCI adjustments, and estimated out-of-pocket costs for {State} patients.`

**Key content sections:**
1. **State cost card** -- Facility rate, non-facility rate, commercial estimate for this state. Comparison to national average (% above/below).
2. **Locality breakdown** -- If multiple CMS localities in state, show each with rates.
3. **How {State} compares** -- Bar chart showing this state vs national average vs highest/lowest states.
4. **GPCI explanation** -- What Geographic Practice Cost Indices mean for this state.
5. **Other procedures in {State}** -- Top 20 most searched procedures in this state.
6. **About {State} healthcare costs** -- Brief paragraph on state cost-of-living factors.

**Internal links:**
- Breadcrumb: Home > Procedures > {Procedure} > {State}
- Link back to national procedure page
- Links to other procedures in this state
- Link to `/states/[state]/` overview
- Links to neighboring states for same procedure

**Schema markup:** `MedicalProcedure` with `areaServed`

**Data needed:** `medical_cost_geographic` filtered by state + procedure + `medical_procedures` row for national baseline.

---

### 4.3 Condition Page (`/conditions/[slug]/`)

**Title tag:** `{ConditionName} Treatment Cost (2026) | Medical Bills for {ShortName}`

**H1:** `How Much Does {ConditionName} Treatment Cost?`

**Meta description:** `{ConditionName} treatment costs ${TypicalLow}-${TypicalHigh} in 2026. See itemized costs for diagnosis, treatment, surgery, and rehabilitation based on Medicare rates.`

**Key content sections:**
1. **Total cost range card** -- Low/mid/high estimates for mild, moderate, severe cases.
2. **What is {Condition}?** -- Consumer explanation, symptoms, causes.
3. **Treatment cost breakdown by phase:**
   - Emergency/diagnosis costs (with linked procedure rows)
   - Surgical/treatment costs
   - Rehabilitation costs
   - Ongoing/chronic care costs
4. **Cost by state** -- Table with links to `/conditions/[slug]/[state]/`.
5. **Common procedures for {Condition}** -- Each links to procedure page.
6. **Related conditions** -- Same body region.
7. **Insurance and coverage** -- Brief FAQ on typical coverage.

**Internal links:**
- Each procedure in the breakdown links to `/procedures/[slug]/`
- State rows link to `/conditions/[slug]/[state]/`
- Related conditions cross-link
- Category breadcrumb link

**Schema markup:** `MedicalCondition` + `MedicalTherapy`
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  "name": "ACL Tear",
  "associatedAnatomy": {
    "@type": "AnatomicalStructure",
    "name": "Anterior Cruciate Ligament"
  },
  "typicalTest": [
    { "@type": "MedicalTest", "name": "MRI Knee" }
  ],
  "possibleTreatment": [
    { "@type": "MedicalTherapy", "name": "ACL Reconstruction Surgery" }
  ]
}
```

**Data needed:** `conditions` row + `injury_procedure_mappings` + joined `medical_procedures` with rates.

---

### 4.4 Condition + State Page (`/conditions/[slug]/[state]/`)

**Title tag:** `{ConditionName} Treatment Cost in {State} (2026)`

**H1:** `{ConditionName} Treatment Cost in {State}`

**Meta description:** `{ConditionName} treatment costs ${StateLow}-${StateHigh} in {State}. See state-adjusted procedure costs for diagnosis, surgery, and rehab.`

**Key content sections:**
1. **State-adjusted total cost range** -- Recalculated using state GPCI.
2. **Itemized procedure costs for {State}** -- Same phase breakdown but with state-specific rates.
3. **How {State} compares** -- Vs national, vs neighboring states.
4. **Find providers in {State}** -- (future: link to provider directories)

**Internal links:**
- Back to national condition page
- Each procedure links to `/procedures/[slug]/[state]/`
- Link to `/states/[state]/`

**Schema markup:** `MedicalCondition` with `areaServed`

**Data needed:** `conditions` + `injury_procedure_mappings` + `medical_cost_geographic` filtered by state.

---

### 4.5 Category Page (`/categories/[slug]/`)

**Title tag:** `{CategoryName} Procedure Costs (2026) | {CategoryName} Medical Prices`

**H1:** `{CategoryName} Procedure Costs`

**Meta description:** `Compare costs for {count} {CategoryName} procedures. See 2026 Medicare rates, hospital outpatient costs, and estimated commercial prices.`

**Key content sections:**
1. **Category overview** -- What this category covers, typical patients.
2. **All procedures table** -- Sortable by name, code, cost (low to high). Paginated if >50.
3. **Most expensive procedures** -- Top 10 by cost.
4. **Most common procedures** -- Top 10 by search volume / utilization.
5. **Related categories** -- Links to related categories.

**Internal links:**
- Each procedure row links to `/procedures/[slug]/`
- Related categories cross-link
- Breadcrumb: Home > Categories > {Category}

**Schema markup:** `MedicalSpecialty` or `ItemList`

**Data needed:** `medical_procedures` filtered by `category` + `procedure_slugs`.

---

### 4.6 Drug Page (`/drugs/[slug]/`)

**Title tag:** `{DrugName} Cost (2026) | {GenericName} Price Without Insurance`

**H1:** `How Much Does {DrugName} Cost?`

**Meta description:** `{DrugName} ({GenericName}) costs ${NADACPerUnit} per unit based on NADAC pricing. Compare pharmacy costs and see brand vs generic options.`

**Key content sections:**
1. **Price card** -- NADAC per unit, estimated 30-day supply cost, brand vs generic comparison.
2. **What is {DrugName} used for?** -- Common conditions, how it works.
3. **Dosage forms and strengths** -- Table of available forms with per-unit pricing.
4. **Brand vs generic** -- Price comparison if both exist.
5. **Related drugs** -- Same category/therapeutic class.
6. **Conditions treated** -- Links to condition pages.

**Internal links:**
- Related drugs link to their pages
- Conditions link to `/conditions/[slug]/`
- Breadcrumb: Home > Drugs > {Category} > {Drug}

**Schema markup:** `Drug` + `Offer`

**Data needed:** `drug_prices` row.

---

### 4.7 State Overview Page (`/states/[state]/`)

**Title tag:** `Medical Costs in {State} (2026) | Healthcare Prices in {State}`

**H1:** `Medical Costs in {State}`

**Meta description:** `Compare medical procedure costs in {State}. See how {State} healthcare prices compare to the national average based on CMS Medicare data.`

**Key content sections:**
1. **State cost index** -- Overall GPCI summary. "X% above/below national average."
2. **CMS localities in {State}** -- Table of localities with GPCI values.
3. **Most searched procedures in {State}** -- Top 20 with state-specific rates.
4. **Common conditions** -- Links to condition + state pages.
5. **How {State} compares** -- Map or chart vs neighboring states.
6. **State healthcare facts** -- Uninsured rate, major hospital systems, Medicaid expansion status.

**Internal links:**
- Procedure links go to `/procedures/[slug]/[state]/`
- Condition links go to `/conditions/[slug]/[state]/`
- Neighboring state links to their overview pages
- Breadcrumb: Home > States > {State}

**Schema markup:** `Place` + `AggregateOffer`

**Data needed:** `medical_cost_geographic` filtered by state + top procedures + state metadata.

---

### 4.8 DRG Page (`/drg/[code]/`)

**Title tag:** `{DRGDescription} Hospital Cost (DRG {Code}) | Inpatient Stay Cost`

**H1:** `{DRGDescription} -- Hospital Stay Cost`

**Meta description:** `DRG {Code} ({DRGDescription}) costs an average of ${AvgTotalPayment} per hospital stay. See average charges, Medicare payments, and length of stay data.`

**Key content sections:**
1. **Cost summary card** -- Avg covered charges, avg total payment, avg Medicare payment.
2. **What this DRG covers** -- Consumer explanation.
3. **Length of stay** -- Mean LOS, geometric mean LOS.
4. **DRG weight** -- Relative weight and what it means.
5. **Related DRGs** -- Same MDC (Major Diagnostic Category).
6. **Related procedures and conditions** -- Cross-links.

**Internal links:**
- Related DRGs link to their pages
- Related conditions link to `/conditions/[slug]/`
- Breadcrumb: Home > Hospital Stays > {DRG}

**Schema markup:** `MedicalProcedure` (inpatient) + `Offer`

**Data needed:** `drg_costs` row.

---

### 4.9 Index Pages

**Procedure Index (`/procedures/`)**
- Title: `Medical Procedure Costs (2026) | Compare 12,000+ Procedure Prices`
- H1: `Medical Procedure Costs`
- Filterable by category, body system, price range
- Alphabetical pagination: A | B | C | ... | Z
- Top 50 most popular procedures above the fold
- Full searchable table below

**Condition Index (`/conditions/`)**
- Title: `Medical Condition Treatment Costs (2026) | Cost by Condition`
- H1: `Medical Condition Treatment Costs`
- Grouped by body region
- Card layout with cost ranges

**State Index (`/states/`)**
- Title: `Medical Costs by State (2026) | Compare Healthcare Prices`
- H1: `Medical Costs by State`
- Interactive US map (SVG, no JS framework dependency)
- Table below with cost index, sorted by most/least expensive

**Drug Index (`/drugs/`)**
- Title: `Drug Prices (2026) | Compare Prescription Costs`
- H1: `Prescription Drug Prices`
- Grouped by therapeutic category
- Search/filter

**DRG Index (`/drg/`)**
- Title: `Hospital Stay Costs by DRG (2026) | Inpatient Procedure Costs`
- H1: `Hospital Stay Costs`
- Sorted by DRG code, filterable by MDC

---

### 4.10 Interactive Pages

**Cost Estimator (`/estimator/`)**
- Title: `Medical Cost Estimator | Estimate Your Procedure Cost`
- Client-side Astro island (Preact or Solid) that calls the Workers API
- Flow: Select procedure(s) > Select state > See itemized estimate
- No static data needed at build time; all data fetched from API at runtime
- Schema markup: `WebApplication`

**Comparison Tool (`/compare/`)**
- Title: `Compare Medical Procedure Costs | Side-by-Side Price Comparison`
- Client-side island: Select 2-4 procedures or states, see visual comparison
- Share URL with encoded selections: `/compare/?p=72148,70551&s=california,texas`

---

## 5. Homepage Design

### Hero Section
```
[H1] Know What Your Medical Care Should Cost
[Subtitle] Compare 12,000+ procedure prices from CMS Medicare data.
           Free, transparent, no login required.
[Search Bar] Search procedures, conditions, or drugs...
[CTAs]  "Estimate My Costs" button  |  "Browse Procedures" button
```

### Section 2: Popular Procedures (6-card grid)
- MRI Lumbar Spine -- $X-$Y
- Knee Replacement -- $X-$Y
- CT Head/Brain -- $X-$Y
- Colonoscopy -- $X-$Y
- Physical Therapy Visit -- $X-$Y
- Emergency Room Visit -- $X-$Y

Each card links to the procedure detail page. Shows national cost range.

### Section 3: Cost Comparison Widget
Interactive mini-widget (Astro island): Pick a procedure, pick two states, see side-by-side. Acts as a teaser for the full `/compare/` tool.

### Section 4: Browse by Category
Grid of category cards (Radiology, Surgery, Emergency Medicine, Physical Therapy, Lab Tests, etc.) linking to `/categories/[slug]/`.

### Section 5: Cost by State
Clickable US map (inline SVG). Hover shows state cost index. Click navigates to `/states/[state]/`.

### Section 6: Trust Signals
- "Data sourced from CMS.gov (Centers for Medicare & Medicaid Services)"
- "Updated for 2026 fee schedules"
- "12,000+ procedures | 109 CMS localities | 50 states"
- Logos/badges: CMS, NADAC, public data

### Section 7: Recent Insights / Blog Teasers
Optional: 3 cards linking to articles like "Why MRI Costs Vary by 300%" or "Understanding Your Hospital Bill."

### Schema Markup (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Medical Costs",
  "url": "https://medicalcosts.info/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://medicalcosts.info/search/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 6. Navigation

### Main Nav (Top Bar)
```
[Logo: Medical Costs]  Procedures  Conditions  Drugs  States  Hospital Stays  Estimator
                                                                    [Search icon]
```

- **Procedures** -- Mega menu dropdown:
  - Left column: Popular categories (Radiology, Surgery, E&M, Physical Therapy, Lab, DME)
  - Right column: Popular procedures (top 10 by traffic)
  - Footer: "View all 12,000+ procedures"
- **Conditions** -- Dropdown grouped by body region
- **Drugs** -- Dropdown with top drug categories
- **States** -- Dropdown with mini US map + alphabetical list
- **Hospital Stays** -- Direct link to `/drg/`
- **Estimator** -- Direct link, highlighted/accent color

### Breadcrumbs
Every page below the homepage gets breadcrumbs. Structured data included (`BreadcrumbList`).

```
Home > Procedures > Radiology > MRI Lumbar Spine Without Contrast
Home > Procedures > MRI Lumbar Spine Without Contrast > California
Home > Conditions > ACL Tear > Texas
Home > States > Colorado
Home > Hospital Stays > DRG 470 - Hip & Knee Replacement
```

### Sidebar (Procedure and Condition pages)
- **On procedure pages:** "Related Procedures" (same category, top 10) + "Related Conditions"
- **On condition pages:** "Other Conditions" (same body region) + "Common Procedures"
- **On state pages:** "Neighboring States" + "Top Procedures in {State}"

### Footer
```
[4-column layout]

Column 1: Procedures
- Emergency Medicine
- Radiology & Imaging
- Surgery
- Physical Therapy
- Lab Tests
- All Procedures

Column 2: Resources
- Cost Estimator
- Compare Costs
- Hospital Stays (DRG)
- Drug Prices
- Browse by State

Column 3: About
- About This Site
- Methodology
- Data Sources
- Privacy Policy
- Terms of Use

Column 4: Data
- "Data from CMS.gov"
- "2026 Fee Schedules"
- "Last updated: {date}"
- [RSS/Sitemap links]
```

---

## 7. Programmatic Internal Linking

### Link Graph Design

The goal is a tightly interconnected graph where every page is reachable within 3 clicks from the homepage, and crawl equity flows from high-authority pages (homepage, indexes) to long-tail pages (procedure+state).

```
                    Homepage
                   /   |    \
          Procedures  Conditions  States
           /    |        |          |
      Categories  Procedures  Conditions  State Overview
           |        /    \       /   \        |
      Proc List  Proc+State  Cond+State   Proc+State
```

### Linking Rules

**1. Every procedure page links to:**
- Its parent category page (`/categories/[slug]/`)
- All state variants where geographic data exists (`/procedures/[slug]/[state]/`)
- 5-10 related procedures (same category or body system)
- Conditions that use this procedure
- The national procedure index

**2. Every procedure+state page links to:**
- The national procedure page (`/procedures/[slug]/`)
- The state overview page (`/states/[state]/`)
- 5 other procedures in the same state
- The same procedure in 3-5 neighboring states
- The condition+state page if applicable

**3. Every condition page links to:**
- All procedures in its treatment breakdown (5-15 links)
- All state variants
- Related conditions (same body region, 3-5)
- Its parent category

**4. Every state page links to:**
- Top 20 procedures with state-specific pricing
- Top 10 conditions with state-specific pricing
- All neighboring states (geographic adjacency)
- State-specific DRG data if available

**5. Every DRG page links to:**
- Related conditions
- Related procedures (component procedures of the DRG)
- Other DRGs in the same MDC

**6. Index pages link to:**
- First ~100 items directly (above fold or first page)
- All items via paginated or alphabetical sub-pages

### Contextual Link Blocks

Each page template includes a "Related" section at the bottom with algorithmically selected links. The selection logic:

```typescript
// Pseudocode for related procedure selection
function getRelatedProcedures(procedure: Procedure): Procedure[] {
  return [
    ...sameCategory(procedure, 3),        // 3 from same category
    ...sameBodySystem(procedure, 2),       // 2 from same body system
    ...similarCostRange(procedure, 2),     // 2 in similar price range
    ...highestTraffic(procedure.category, 3) // 3 most popular in category
  ].deduplicate().slice(0, 10);
}
```

### Pagination Strategy for Large Indexes

The procedure index (12K+ items) uses alphabetical sub-pages:
```
/procedures/          -- Overview + top 50 + letter navigation
/procedures/a/        -- All procedures starting with A
/procedures/b/        -- All procedures starting with B
...
```

Each alphabetical page is statically generated and links to the next/previous letter pages plus back to the main index. This keeps each page under 200 items.

---

## 8. Technical SEO

### Sitemap Strategy

With 30K+ pages, a single sitemap XML would exceed the 50K URL / 50MB limit in practice (and be slow to parse). Use a **sitemap index** with segmented sitemaps:

```
/sitemap-index.xml          -- Sitemap index pointing to all sub-sitemaps
/sitemaps/procedures.xml    -- All /procedures/[slug]/ pages
/sitemaps/procedures-states-1.xml  -- /procedures/[slug]/[state]/ pages (A-M)
/sitemaps/procedures-states-2.xml  -- /procedures/[slug]/[state]/ pages (N-Z)
/sitemaps/conditions.xml    -- All /conditions/ pages
/sitemaps/conditions-states.xml
/sitemaps/drugs.xml         -- All /drugs/ pages
/sitemaps/states.xml        -- All /states/ pages
/sitemaps/drg.xml           -- All /drg/ pages
/sitemaps/pages.xml         -- Static pages (homepage, indexes, about, etc.)
```

Each sub-sitemap stays under 10K URLs. Generated at build time by Astro's sitemap integration with custom serialization.

**Priority values:**
- Homepage: 1.0
- Index pages: 0.8
- Procedure detail: 0.7
- Condition detail: 0.7
- State overview: 0.6
- Procedure+state: 0.5
- Condition+state: 0.5
- DRG pages: 0.5
- Drug pages: 0.5

**Changefreq:** `monthly` for all (data updates quarterly with CMS releases)

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://medicalcosts.info/sitemap-index.xml

# Block search/filter result pages
Disallow: /search?
Disallow: /compare?
Disallow: /estimator?*step=

# Block pagination query params
Disallow: /*?page=
Disallow: /*?sort=
Disallow: /*?filter=
```

### Canonical URLs

- Every page has a `<link rel="canonical">` pointing to itself
- Pagination pages (`/procedures/a/`, `/procedures/b/`) are self-canonical (not canonical to the index)
- Filter/sort URLs are not indexed (`noindex` via meta tag or robots.txt)
- The estimator and compare tools do not get canonical (they use `noindex` since content is dynamic)

### Additional SEO Tags

```html
<!-- Every page -->
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://medicalcosts.info/procedures/mri-lumbar-spine/">

<!-- Open Graph -->
<meta property="og:title" content="{Title Tag}">
<meta property="og:description" content="{Meta Description}">
<meta property="og:type" content="website">
<meta property="og:url" content="{Canonical URL}">
<meta property="og:image" content="/og/{page-type}-default.png">

<!-- Structured data via JSON-LD in <head> -->
<script type="application/ld+json">{ ... }</script>
```

### Performance Targets

- Largest Contentful Paint: <1.5s (static HTML from CDN)
- Cumulative Layout Shift: <0.05 (no layout shifts from data loading)
- First Input Delay: <50ms (minimal JS on static pages)
- Total page weight: <200KB per page (HTML + CSS + minimal JS)

---

## 9. Frontend Framework Recommendation

### Decision: Astro 5 (Static) + Cloudflare Pages

**Why Astro over Next.js:**

| Factor | Astro (Static) | Next.js (ISR on CF) |
|---|---|---|
| Build 30K pages | ~15-25 min (parallel, D1 queries) | Similar, but ISR adds complexity |
| Runtime JS | 0 KB on static pages | ~80-120 KB React runtime |
| Cloudflare Pages | Native support, zero config | Requires `@cloudflare/next-on-pages`, edge quirks |
| Core Web Vitals | Near-perfect (pure HTML/CSS) | Good but heavier hydration |
| Cost | Free tier (unlimited static) | Free tier but Workers invocations for ISR |
| Islands architecture | Native (Preact/Solid for interactive bits) | Full React hydration |
| Build tooling | Vite-based, fast | Webpack/Turbopack |
| Content collections | Built-in, type-safe | Custom or MDX |

**Astro is the clear choice** because:
1. 95% of pages are pure data display with zero interactivity -- shipping 0 JS is a massive performance win.
2. The two interactive pages (estimator, compare) use Astro islands with a lightweight framework (Preact at 3KB).
3. Cloudflare Pages has first-class Astro support with no adapter hacks.
4. Build time for 30K pages is manageable with Astro's parallel builds.

### Architecture

```
site/                          -- Astro project root
  src/
    layouts/
      Base.astro               -- HTML shell, head, nav, footer
      Procedure.astro          -- Procedure page layout
      Condition.astro          -- Condition page layout
      State.astro              -- State page layout
      Drug.astro               -- Drug page layout
      DRG.astro                -- DRG page layout
    pages/
      index.astro              -- Homepage
      procedures/
        index.astro            -- Procedure index
        [slug].astro           -- getStaticPaths() -> 12K pages
        [slug]/
          [state].astro        -- getStaticPaths() -> ~8.7K pages
      conditions/
        index.astro
        [slug].astro
        [slug]/
          [state].astro
      categories/
        index.astro
        [slug].astro
      drugs/
        index.astro
        [slug].astro
      states/
        index.astro
        [state].astro
      drg/
        index.astro
        [code].astro
      estimator/
        index.astro            -- Contains <CostEstimator client:load />
      compare/
        index.astro            -- Contains <ComparisonTool client:load />
      about.astro
      methodology.astro
      sources.astro
      robots.txt.ts            -- Dynamic robots.txt
      sitemap-index.xml.ts     -- Sitemap index endpoint
    components/
      Nav.astro
      Footer.astro
      Breadcrumb.astro
      CostCard.astro
      ProcedureTable.astro
      StateMap.astro           -- SVG US map
      SearchBar.astro          -- Static shell
      CostEstimator.tsx        -- Preact island (client:load)
      ComparisonTool.tsx       -- Preact island (client:load)
      SearchIsland.tsx         -- Preact island (client:idle)
    lib/
      api.ts                   -- Fetch helpers for Workers API
      data.ts                  -- Build-time data fetching from D1
      slugify.ts               -- Slug generation
      states.ts                -- State metadata (names, abbreviations, neighbors)
      seo.ts                   -- Title/meta/schema generation helpers
      linking.ts               -- Related page selection algorithms
    styles/
      global.css               -- Tailwind CSS or vanilla CSS
    data/                      -- Static JSON (pre-fetched at build time)
      procedures.json
      conditions.json
      states.json
      categories.json
  public/
    og/                        -- Pre-generated Open Graph images
    favicon.svg
  astro.config.mjs
  tailwind.config.mjs
```

### Build-Time Data Strategy

At build time, Astro's `getStaticPaths()` functions fetch data from the Workers API (or directly from D1 via a build script). Two approaches:

**Option A: Pre-fetch to JSON (Recommended)**
```bash
# Pre-build step: dump all data from D1 to local JSON
npx tsx scripts/dump-build-data.ts
# Outputs: src/data/procedures.json, conditions.json, etc.
# Astro reads from JSON at build time (fast, no network calls)
```

**Option B: Fetch from Workers API at build time**
```typescript
// In getStaticPaths()
const procedures = await fetch('https://medical-costs-api.david-568.workers.dev/procedures').then(r => r.json());
return procedures.map(p => ({ params: { slug: p.slug }, props: { procedure: p } }));
```

Option A is preferred because it avoids 30K+ API calls during build and eliminates rate limiting concerns.

### Incremental Builds

Astro does not natively support ISR, but with Cloudflare Pages:
- **Full rebuild** on data updates (quarterly CMS releases). 15-25 min build is acceptable for quarterly updates.
- **Partial content updates** (new conditions, corrections) trigger a full rebuild via GitHub push. Cloudflare Pages builds are free and fast.
- **Future option:** If build times become a problem at >50K pages, use Astro's `hybrid` mode and render low-traffic pages (e.g., obscure procedure+state combos) on-demand via Cloudflare Workers with caching.

---

## 10. Cloudflare Infrastructure

### Components

```
                [Cloudflare DNS]
                      |
              [Cloudflare CDN/Pages]
               /              \
    [Static Site]        [Workers API]
    (Astro build)        (medical-costs-api)
                              |
                         [D1 Database]
                        (medical-costs-db)
```

### Cloudflare Pages (Static Site)
- **Build command:** `npm run build` (Astro build)
- **Output directory:** `dist/`
- **Build environment:** Node 20
- **Deploy trigger:** Push to `main` branch
- **Custom domain:** `medicalcosts.info`
- **Headers:** Cache-Control set to `public, max-age=86400` for HTML, `public, max-age=31536000, immutable` for hashed assets

### Cloudflare Workers (API)
- **Existing:** `medical-costs-api` at `medical-costs-api.david-568.workers.dev`
- **Purpose:** Powers the interactive estimator/compare tools, search autocomplete, and serves as the build-time data source
- **New endpoints needed for the site:**
  - `GET /procedures?limit=all` -- All procedures with slugs (build-time)
  - `GET /procedures/:slug` -- Single procedure with all rates
  - `GET /procedures/:slug/states` -- All state rates for a procedure
  - `GET /conditions` -- All conditions
  - `GET /conditions/:slug` -- Condition with linked procedures
  - `GET /drugs` -- All drugs
  - `GET /drugs/:slug` -- Single drug
  - `GET /drg` -- All DRGs
  - `GET /drg/:code` -- Single DRG
  - `GET /states/:code/top-procedures` -- Top procedures in a state
  - `GET /search?q=` -- Autocomplete search (runtime)
  - `GET /estimate` -- Cost estimation (runtime)

### KV Store (Optional Future)
- Cache rendered HTML fragments for high-traffic pages
- Store search analytics to identify popular procedures for homepage

### R2 (Optional Future)
- Store pre-generated Open Graph images
- Store downloadable cost reports (PDF)

---

## 11. Build and Deployment

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 1 1,4,7,10 *'  # Quarterly rebuild for CMS updates

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: cd site && npm ci

      - name: Fetch build data from D1
        run: cd site && npx tsx scripts/dump-build-data.ts
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          D1_DATABASE_ID: f3c4c390-86ac-4ffc-a887-0198c35abdc2

      - name: Build Astro site
        run: cd site && npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          command: pages deploy site/dist --project-name=medical-costs-site
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

### Build Performance

- **12K procedure pages:** ~5 min (Astro parallel file generation)
- **8.7K procedure+state pages:** ~4 min
- **4K condition+state pages:** ~2 min
- **Everything else:** ~1 min
- **Total estimated build:** 12-15 min

Optimization levers if build time grows:
1. **Chunk `getStaticPaths()`** -- return pages in batches
2. **Astro `hybrid` mode** -- SSR low-traffic pages on-demand
3. **Pre-render HTML templates** -- custom build script that bypasses Astro for simple data-in-template pages
4. **Cache build data** -- GitHub Actions cache for `src/data/*.json`

---

## 12. Data Pipeline

### Quarterly Update Process

```
1. CMS releases new fee schedule (January, April, July, October)
2. Run data loaders:
   npx tsx load-cms-bulk.ts > data/cms/bulk-procedures.sql
   npx tsx load-all-cms.ts
3. Update D1 database:
   wrangler d1 execute medical-costs-db --remote --file=data/cms/bulk-procedures.sql
4. Update condition content (if new conditions):
   npx tsx scripts/generate-conditions.ts
5. Regenerate procedure slugs:
   npx tsx scripts/generate-slugs.ts
6. Push to main -> triggers build and deploy
```

### Slug Generation Script

```typescript
// scripts/generate-slugs.ts
// Converts CPT descriptions to URL-friendly slugs
// "MRI lumbar spine without contrast" -> "mri-lumbar-spine-without-contrast"
// Handles duplicates by appending code: "mri-lumbar-spine-without-contrast-72148"
// Stores in procedure_slugs table for build-time lookup
```

### Content Generation for Conditions

The 80+ condition pages need authored content (not just data). Strategy:
1. Generate initial content from structured data (ICD-10 descriptions, linked procedures, cost ranges)
2. Human review and enrichment
3. Store in `conditions` table `content_body` field as Markdown
4. Render at build time

---

## Appendix A: State Metadata

```typescript
export const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', neighbors: ['FL','GA','MS','TN'] },
  { code: 'AK', name: 'Alaska', slug: 'alaska', neighbors: [] },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', neighbors: ['CA','CO','NM','NV','UT'] },
  // ... all 50 states
] as const;
```

## Appendix B: Category Taxonomy

Based on existing `medical_procedures.category` values:

| Category Slug | Display Name | Estimated Procedures |
|---|---|---|
| `emergency-medicine` | Emergency Medicine | ~50 |
| `radiology` | Radiology & Imaging | ~2,000 |
| `surgery-orthopedic` | Orthopedic Surgery | ~800 |
| `surgery-general` | General Surgery | ~600 |
| `surgery-neuro` | Neurosurgery | ~200 |
| `surgery-cardio` | Cardiovascular Surgery | ~300 |
| `evaluation-management` | Office & Hospital Visits | ~100 |
| `physical-therapy` | Physical Therapy & Rehab | ~80 |
| `anesthesia` | Anesthesia | ~300 |
| `pathology-lab` | Lab Tests & Pathology | ~2,000 |
| `dme` | Medical Equipment & Supplies | ~1,700 |
| `injection-infusion` | Injections & Infusions | ~200 |
| `mental-health` | Mental Health Services | ~60 |
| `ophthalmology` | Eye Care | ~300 |
| `dermatology` | Dermatology | ~150 |
| `cardiology` | Cardiology (Diagnostic) | ~200 |
| `gastroenterology` | Gastroenterology | ~150 |
| `pulmonology` | Pulmonary Medicine | ~100 |
| `urology` | Urology | ~200 |
| `obstetrics` | Obstetrics & Gynecology | ~200 |
| `ent` | Ear, Nose & Throat | ~200 |
| `ambulance` | Ambulance Services | ~10 |
| `chiropractic` | Chiropractic | ~20 |
| `other` | Other Procedures | remainder |

## Appendix C: Estimated Traffic Targets

Based on keyword research patterns for medical cost queries:

| Query Pattern | Monthly Search Volume (est.) | Target Pages |
|---|---|---|
| "how much does [procedure] cost" | 500-50,000 per procedure | Procedure detail |
| "[procedure] cost in [state]" | 50-5,000 per combo | Procedure+state |
| "[condition] treatment cost" | 500-20,000 per condition | Condition detail |
| "medical costs in [state]" | 200-2,000 per state | State overview |
| "[drug] price without insurance" | 100-10,000 per drug | Drug detail |
| "hospital stay cost [DRG]" | 50-500 per DRG | DRG detail |

**Top 20 highest-volume target procedures:**
1. MRI (various body parts)
2. CT scan (various)
3. Colonoscopy
4. Knee replacement
5. Hip replacement
6. ACL surgery
7. Cataract surgery
8. Physical therapy
9. Emergency room visit
10. X-ray (various)
11. Blood work / lab tests
12. Epidural steroid injection
13. Carpal tunnel surgery
14. Hernia repair
15. Appendectomy
16. C-section
17. Shoulder surgery
18. Spinal fusion
19. Dental implant (future)
20. LASIK (future)
