# Insurance Comparison & Healthcare Cost Tools: Competitive Research

**Date:** April 2026
**Purpose:** Evaluate the competitive landscape for insurance/healthcare cost tools and identify what we can build with our medical cost database (21,524 procedures, 39,756 negotiated payer rates from 144 insurers, 146K hospital-level costs, 10K+ drug prices).

---

## Table of Contents

1. [Search Ranking Analysis](#1-search-ranking-analysis)
2. [Existing Tools & Their Gaps](#2-existing-tools--their-gaps)
3. [Tool Ideas We Could Build](#3-tool-ideas-we-could-build)
4. [ACA Marketplace Data Integration](#4-aca-marketplace-data-integration)
5. [Missing Data We Would Need](#5-missing-data-we-would-need)
6. [Priority Roadmap](#6-priority-roadmap)

---

## 1. Search Ranking Analysis

### "compare health insurance plans"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | Healthcare.gov | Official marketplace, plan browse/enroll | CMS QHP data |
| 2 | eHealth | Licensed broker, MatchFinder tool with doctor/Rx input | Real plan data via API agreements |
| 3 | NerdWallet | Editorial reviews + ratings with 149 data points per plan | CMS QHP + claims denial data |

**Gap:** None of these show "given YOUR expected procedures, which plan is cheapest total cost." They compare premiums and deductibles abstractly, not against your actual healthcare usage.

### "best health insurance company"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | NerdWallet | Editorial ratings by state, 4 evaluation categories | CMS QHP, complaints, denial rates |
| 2 | Forbes Advisor | Editorial rankings with methodology score | CMS + proprietary survey |
| 3 | US News | Star ratings by state/plan type | NCQA, CMS star ratings |

**Gap:** Rankings are based on subjective editorial methodology. None use negotiated rate data to show which insurer actually pays more for your procedures (i.e., better coverage in practice).

### "health insurance cost calculator"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | KFF (Kaiser Family Foundation) | Subsidy calculator: income + age + zip = estimated premium after ACA credits | CMS premium data + FPL tables |
| 2 | Healthcare.gov | Plan browse with subsidy estimate | CMS enrollment engine |
| 3 | eHealth | Quote comparison with savings estimates | Broker plan feeds |

**Gap:** These calculate premium costs only. Nobody combines "your premium + your expected medical usage = your true annual cost." That requires procedure-level pricing data, which we have.

### "cheapest health insurance"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | eHealth | Quote tool, claims avg savings of $2,016/year | Licensed broker feeds |
| 2 | NerdWallet | State-by-state best plans editorial | QHP landscape files |
| 3 | Healthinsurance.org | Premium comparison tables by metal level and state | CMS PUFs |

**Gap:** "Cheapest" only considers premiums. A Bronze plan with $7,476 deductible is NOT cheapest if you need a $15K knee replacement. Total cost modeling is the missing piece.

### "health insurance marketplace"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | Healthcare.gov | Official marketplace | Government |
| 2 | eHealth | Private marketplace, licensed broker | Plan API feeds |
| 3 | State exchanges (Covered CA, MA Health Connector, etc.) | State-run marketplaces | State plan data |

**Gap:** We cannot compete with government exchanges for enrollment. But we CAN be the "what should I pick" decision tool people use BEFORE going to Healthcare.gov to enroll.

### "compare hospital costs near me"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | FAIR Health Consumer | Zip-based cost lookup, in/out network ranges | 52B+ insurance claims |
| 2 | Turquoise Health | Hospital-specific negotiated rates by procedure | Hospital MRF price transparency files |
| 3 | Medicare.gov Procedure Price Lookup | ASC vs hospital outpatient Medicare rates | CMS OPPS/ASC data |

**Gap:** FAIR Health is claims-based (backward-looking averages). Turquoise shows negotiated rates but is complex/enterprise-focused. Medicare.gov only shows Medicare rates. Nobody combines all three into a simple "Hospital A charges $X, Hospital B charges $Y, Medicare pays $Z, your insurer likely pays $W" view. We could.

### "which insurance covers [procedure]"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | Individual insurer sites | Plan-specific coverage lookup | Proprietary |
| 2 | Healthcare.gov | Plan details show covered benefits | QHP benefit data |
| 3 | GoodRx (for drugs) | Formulary lookup by insurance | PBM formulary data |

**Gap:** Massive gap. No independent tool shows "here's what 5 different insurers would pay for CPT 27447 (knee replacement) at Hospital X." Our negotiated rate data from 144 insurers could power exactly this.

### "out of pocket cost calculator"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | ProcedureRates.com | Deductible + copay + coinsurance calculator | User inputs only |
| 2 | Hospital-specific tools (Stanford, Mount Sinai, Northwell) | Tied to their facility only | Internal billing data |
| 3 | Insurance company portals (Anthem, UHC, etc.) | Tied to your specific plan | Claims processing engine |

**Gap:** ProcedureRates.com requires users to know their negotiated rate (they don't). Hospital tools only cover one facility. Insurer tools require login and only show their plans. Nobody offers a UNIVERSAL out-of-pocket calculator that works across insurers and hospitals. Our data enables this.

### "medical bill negotiation"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | CareRoute / Goodbill | AI-powered bill review, professional negotiation services | Proprietary + claims data |
| 2 | Dollar For | Nonprofit, helps with charity care applications | Hospital financial assistance policies |
| 3 | Resolve Medical Bills | Professional advocates negotiate on your behalf | Industry benchmarks |

**Gap:** These are services (you pay them or they take a cut). Nobody provides a FREE tool that says "your bill was $X, Medicare pays $Y, the fair commercial rate is $Z, here's a letter template to send your hospital." Our Medicare rates + commercial multipliers could power this.

### "healthcare cost comparison tool"
| Rank | Who | Approach | Data Source |
|------|-----|----------|-------------|
| 1 | FAIR Health Consumer | Zip-based, in/out network ranges for 10K+ services | 52B insurance claims |
| 2 | Healthcare Bluebook (now Valenz Bluebook) | "Fair Price" with green/yellow/red ratings | Nationwide claims database |
| 3 | Turquoise Health | Hospital-specific with payer-level detail | Hospital MRF data |

**Gap:** FAIR Health and Bluebook show ranges but not specific hospitals or payers. Turquoise is the most data-rich but enterprise-priced and complex. CostHelper (~97K monthly visits) ranks well with simple editorial content and user-reported prices. The market rewards SIMPLICITY and SPECIFICITY over data completeness.

---

## 2. Existing Tools & Their Gaps

### Healthcare.gov Plan Comparison
- **What it does well:** Official source, real enrollment, subsidy calculation, standardized plan display
- **What it's missing:**
  - No procedure-level cost modeling ("if I need X surgery, which plan is cheapest?")
  - Overwhelming: average enrollee faces 100+ plan options
  - No quality/denial rate data in comparison view
  - No "total annual cost" estimate based on expected healthcare usage
- **How our data helps:** We could build a "Healthcare.gov companion" that says "before you enroll, model your costs"

### KFF Health Insurance Marketplace Calculator
- **What it does well:** Clean UI, trusted brand, accurate subsidy estimates, uses real premium data by zip
- **What it's missing:**
  - Premium-only view (no procedure cost modeling)
  - No plan-level comparison (shows benchmark Silver, not specific plans)
  - No out-of-pocket modeling for specific conditions
- **How our data helps:** Layer procedure costs onto their subsidy framework: "A Silver plan in Denver costs $350/mo after subsidies. If you need knee replacement, your OOP would be ~$6,800"

### eHealth Insurance Comparison
- **What it does well:** MatchFinder tool with doctor/Rx input, quote comparison, real enrollment, claims $2,016/yr avg savings
- **What it's missing:**
  - No procedure cost integration
  - Doctor network search is basic
  - No claims denial rate data
  - Revenue model (broker commissions) means they push plans that pay higher commissions
- **How our data helps:** We're unbiased (no commission model). Could show true cost comparison including expected procedure costs

### GoodRx
- **What it does well:** Drug price comparison across 75K+ pharmacies, coupons saving up to 80%, clean UX, massive brand awareness
- **What it's missing:**
  - Drug prices only, not medical procedures
  - Does not compare insurance plan formularies
  - Doesn't show total cost of care (drugs + procedures + visits)
  - Revenue model: PBM referral fees create potential conflicts
  - 2026 expansion to employer market shows they're diversifying beyond consumer
- **How our data helps:** We have 10K+ drug prices (NADAC). Could build "GoodRx for medical procedures" with hospital-level price comparison

### Healthcare Bluebook (now Valenz Bluebook)
- **What it does well:** Simple "Fair Price" concept with color-coded ratings (green/yellow/red), mobile app, employer partnerships
- **What it's missing:**
  - Requires employer sponsorship for full access (not truly public)
  - Fair Price is an opaque benchmark (not transparent methodology)
  - Limited to ~hundreds of common procedures
  - No payer-specific rates
  - Acquired by Valenz Health, now enterprise-focused
- **How our data helps:** We can offer a FREE, OPEN alternative with transparent methodology (Medicare rate x multiplier, validated against actual negotiated rates). Our 21K procedures dwarfs their coverage.

### Turquoise Health
- **What it does well:** Best-in-class hospital price transparency data, 1T+ rate records, AI contract analysis (AskTQ), $40M Series C (March 2026), payer-provider negotiation tools
- **What it's missing:**
  - Enterprise-focused pricing (B2B, not consumer)
  - Patient tool exists but is secondary to B2B business
  - Consumer UX is functional but not optimized for SEO/search traffic
  - No insurance plan comparison layer
  - No bill review/negotiation feature
- **How our data helps:** Turquoise is the 800-lb gorilla in transparency data. We can't out-data them. But we CAN out-consumer them. They sell to hospitals/payers; we serve patients directly. Different market.

### MDsave
- **What it does well:** Actual purchase marketplace (buy procedures online at fixed prices), 320+ hospitals in 37 states, 1,680 procedures, bundled all-inclusive pricing
- **What it's missing:**
  - Self-pay only (can't use insurance)
  - Acquired by Tendo (now part of larger platform, less independent)
  - Limited geographic coverage
  - No cost comparison against insured rates
  - No "should I use insurance or self-pay?" decision tool
- **How our data helps:** We could build the "should I use insurance or self-pay?" tool. Compare insured OOP cost vs self-pay/MDsave price for any procedure.

### New Choice Health
- **What it does well:** 12K+ facilities, quote request system, procedure education content, care coordinator support
- **What it's missing:**
  - Pricing is quote-based (not instant transparent prices)
  - Dated UX
  - ~17K facility claims, but actual price transparency is limited
  - No insurance integration
- **How our data helps:** We have ACTUAL rates, not quote requests. Instant answers beat "request a quote."

### CostHelper Health
- **What it does well:** ~97K monthly visits with simple editorial content, user-reported cost ranges, covers ~200-400 procedures, strong SEO presence for "[procedure] cost" queries
- **What it's missing:**
  - User-reported data (small sample, self-selected, unreliable)
  - No geographic specificity beyond national ranges
  - No insurance/payer differentiation
  - No interactive tools (static editorial pages)
  - Dated design and functionality
- **How our data helps:** We can replace their user-reported ranges with ACTUAL CMS data, negotiated rates, and geographic specificity. Same SEO strategy but with real data backing every number.

### NerdWallet Health Insurance
- **What it does well:** Trusted brand, 149 data points per plan, state-by-state "best of" rankings, strong SEO authority, combines editorial + data
- **What it's missing:**
  - No procedure cost integration
  - Rankings are editorial (methodology-weighted, not personalized)
  - No interactive cost modeling
  - Health insurance is a small part of their massive personal finance site
- **How our data helps:** NerdWallet drives traffic but doesn't own procedure-level data. We could be the data source that powers a deeper "which plan is right for YOUR health needs" tool

---

## 3. Tool Ideas We Could Build

### Tool 1: "What Will I Actually Pay?" Calculator
**Priority: HIGHEST -- Unique, data-rich, answers the #1 consumer question**

**How it works:**
1. User selects a procedure (search by name or CPT code)
2. User enters their state/zip
3. User enters insurance details (or "uninsured"): deductible, deductible met so far, copay/coinsurance, OOP max
4. Tool shows: Medicare rate, average commercial rate, estimated OOP cost, and range across hospitals in their area

**Data we have:**
- 21,524 procedures with Medicare rates
- Geographic adjustments (GPCI) for every locality
- 39,756 negotiated payer rates from 144 insurers (hospital MRF data)
- 146K hospital-level DRG costs
- Commercial multiplier estimates (1.5x-2.5x Medicare)

**Data we need:**
- More negotiated rates (DoltHub has 400M+)
- Copay/coinsurance modeling logic (straightforward to build)

**SEO play:** Target "[procedure] cost with [insurance]" and "[procedure] cost with insurance vs without" queries. These are high-intent, underserved long-tail keywords.

**Competitive advantage:** Nobody else combines procedure-level pricing with insurance math in a single free tool. ProcedureRates.com has the calculator but no pricing data. FAIR Health has the data but no insurance math.

---

### Tool 2: Insurance Plan Cost Estimator
**Priority: HIGH -- Massive pain point during open enrollment season**

**How it works:**
1. User selects their state/county
2. User inputs their expected healthcare usage: annual checkups, any planned procedures, ongoing prescriptions, chronic conditions
3. Tool pulls ACA marketplace plans for their area
4. For each plan: calculates total annual cost = premiums + expected OOP based on their usage
5. Ranks plans by TRUE total cost, not just premium

**Data we have:**
- Procedure costs by state
- Drug pricing (NADAC)
- The math engine for deductible/copay/coinsurance

**Data we need:**
- ACA QHP landscape files (FREE from Healthcare.gov, 56.4 MB download)
- Plan benefit design details (deductibles, copays by service category) from CMS PUFs
- Formulary data for drug coverage

**SEO play:** Peak traffic Oct-Jan during open enrollment. Target "best health insurance plan for [condition]" and "cheapest health insurance in [state] 2027."

**Competitive advantage:** KFF calculates subsidies. Healthcare.gov shows plans. eHealth matches on doctors. NOBODY shows "if you need knee surgery next year, Plan A costs $14,200 total and Plan B costs $11,800 total." This is the killer feature.

---

### Tool 3: "Is This Bill Reasonable?" Bill Checker
**Priority: HIGH -- Massive emotional trigger, viral potential**

**How it works:**
1. User enters procedure code(s) or description from their bill
2. User enters the amount charged
3. User enters their state/zip
4. Tool shows:
   - Medicare rate for that procedure in their area
   - Average commercial rate (from negotiated rate data)
   - Hospital-specific rates if available
   - A verdict: "Your bill is X% above/below the typical rate"
   - If overcharged: specific talking points + letter template for negotiation

**Data we have:**
- Medicare rates (the gold standard baseline)
- Geographic adjustments
- 39,756 negotiated rates showing what insurers actually pay
- 146K hospital DRG costs showing what hospitals actually receive

**Data we need:**
- More negotiated rates for broader coverage
- Chargemaster data (CA is available free, NY SPARCS already downloaded)

**SEO play:** Target "is my medical bill too high," "how to negotiate medical bill," "fair price for [procedure]." These are high-emotion, high-share queries.

**Competitive advantage:** OrbDoc and MedBillChecker use AI but charge for the service. Goodbill takes a percentage of savings. We can offer this FREE with real government-sourced data. The "70% of people who negotiate succeed" stat means there's massive demand.

---

### Tool 4: Hospital Cost Comparison by Procedure
**Priority: HIGH -- Direct competition with CostHelper/NewChoiceHealth with better data**

**How it works:**
1. User selects a procedure
2. User enters zip code
3. Tool shows nearby hospitals ranked by cost, with:
   - What Medicare pays at that hospital
   - What commercial insurers pay (from MRF data)
   - What the hospital charges (chargemaster)
   - Quality indicators if available
   - Distance from user

**Data we have:**
- 146K hospital DRG costs (3,000+ hospitals)
- 39,756 negotiated payer rates
- Geographic cost indices

**Data we need:**
- Hospital geocoding (lat/lng from address)
- More MRF data (DoltHub 400M+ rows)
- Quality data (CMS Hospital Compare, free API)

**SEO play:** "[procedure] cost at [hospital name]" and "[procedure] cost near [city]" -- millions of potential long-tail pages.

**Competitive advantage:** NASHP's tool shows cost vs charges vs prices but at hospital aggregate level, not procedure-specific. Hospital Cost Compare covers 3K hospitals but with limited data. We can combine CMS inpatient data + negotiated rates + Medicare rates for the most complete view.

---

### Tool 5: Drug Price Comparison
**Priority: MEDIUM -- GoodRx dominates, but we have a different angle**

**How it works:**
1. User searches for a drug
2. Shows: brand vs generic price, NADAC (pharmacy acquisition cost), Medicare Part B cost, typical commercial copay
3. For injury-relevant drugs: shows how they connect to conditions and total treatment cost

**Data we have:**
- 10K+ NADAC drug prices
- CMS Part B drug spending data (loadable)
- Drug-to-condition mappings

**What makes us different from GoodRx:**
- GoodRx shows pharmacy retail prices (coupon-based). We show the ACTUAL acquisition costs (NADAC) plus what Medicare/insurers pay
- We contextualize drug costs within total treatment cost (e.g., "the opioids for your knee replacement recovery cost $X, but the surgery itself costs $Y")
- No PBM referral fee conflicts

**SEO play:** "[drug name] cost" and "[drug name] generic vs brand" queries. GoodRx dominates head terms but we can win long-tail like "[drug] cost after surgery" or "[drug] Medicare coverage."

---

### Tool 6: "Negotiate Your Medical Bill" Guide with Data
**Priority: MEDIUM-HIGH -- Content play with tool integration**

**How it works:**
- Long-form guide with interactive elements
- User enters their bill details
- Auto-generates a negotiation letter with:
  - Fair price benchmarks (Medicare rate, commercial average)
  - Hospital's actual cost (from cost-to-charge ratios if available)
  - Reference to hospital's charity care policy (many nonprofits required to offer financial assistance under 501(r))
  - Specific dollar amount to counter-offer

**Data we have:**
- Medicare rates as floor benchmark
- Commercial rate estimates
- Hospital-level cost data

**SEO play:** "how to negotiate medical bill" (high volume), "medical bill negotiation letter template" (high intent), "hospital charity care application."

**Competitive advantage:** Dollar For helps with charity care. CareRoute/Goodbill are paid services. We provide FREE data-backed negotiation tools. The combination of real pricing data + actionable letter template is unique.

---

### Tool 7: Insurance Company Report Card
**Priority: MEDIUM -- Novel, PR-worthy, uses our unique negotiated rate data**

**How it works:**
- Analyze negotiated rates from 144 insurers across procedures
- Rank insurers by: how much they pay (higher = better for patients at in-network facilities), rate consistency, breadth of coverage
- Show: "For knee replacement, Aetna's average negotiated rate is $28K while UHC's is $32K" -- meaning if you're in-network, UHC members may have lower OOP costs
- Publish annual "Insurance Company Value Report"

**Data we have:**
- 39,756 negotiated rates from 144 insurers
- Rates by procedure, hospital, and payer

**Data we need:**
- More negotiated rate data for statistical significance
- Claims denial rate data (CMS publishes this)
- Network adequacy data

**SEO play:** "best health insurance company for [procedure]" and "[insurer] vs [insurer] comparison." Also: massive PR potential for annual report release.

**Competitive advantage:** Nobody else publishes insurer report cards based on actual negotiated rates. NerdWallet and US News use claims denial and survey data. CBO published one commercial-vs-Medicare study. We could be the ONLY source showing "which insurer pays the most for your procedure."

---

### Tool 8: Annual Healthcare Cost Predictor
**Priority: MEDIUM -- Useful during open enrollment, unique positioning**

**How it works:**
1. User enters: age, gender, known conditions, planned procedures, current medications
2. Tool estimates annual healthcare spending based on:
   - MEPS data on average spending by age/condition
   - Procedure-specific costs from our database
   - Drug costs from NADAC
   - Preventive care costs (covered 100% under ACA)
3. Shows: "People like you typically spend $X-$Y annually on healthcare"
4. Breakdown by: hospital, outpatient, prescriptions, preventive

**Data we have:**
- Procedure costs by age-relevant conditions
- Drug prices
- WISQARS/NHTSA injury cost aggregates by age/gender
- Cost trends for inflation adjustment

**Data we need:**
- MEPS public use files (free from AHRQ) for utilization patterns
- Actuarial tables for condition-specific utilization

**SEO play:** "average healthcare cost by age" and "how much should I budget for healthcare."

---

### Tool 9: "Best Value" Hospital Rankings
**Priority: MEDIUM -- Programmatic SEO goldmine**

**How it works:**
- For each procedure, rank hospitals by value = (quality score / cost)
- Publish rankings for top procedures in every state
- Show: cheapest, highest quality, best value

**Data we have:**
- 146K hospital DRG costs
- Hospital negotiated rates

**Data we need:**
- CMS Hospital Compare quality metrics (free API)
- Patient satisfaction scores (HCAHPS, free)
- Complication/readmission rates (free from CMS)

**SEO play:** "best hospital for knee replacement in [state]" and "cheapest hospital for [procedure] in [city]." Tens of thousands of programmatic pages.

---

## 4. ACA Marketplace Data Integration

### Available Data (All Free)

**QHP Landscape Files** (healthcare.gov/plan-data)
- 56.4 MB ZIP file, updated annually (2026 data available)
- Contains: plan name, issuer, metal level, premium (by age), deductible, OOP max, HSA eligibility
- Coverage: all states using federal marketplace (31 states)

**Benefits & Cost Sharing PUF**
- Detail on copays, coinsurance, covered benefits by plan variant
- Updated February 2026
- Coverage: all HealthCare.gov plans

**Plan Attributes PUF**
- Deductible details, network type, formulary URL
- HSA eligibility, specialty drug cost-sharing

**State Exchange Data**
- States running own exchanges (CA, NY, MA, CO, etc.) publish similar data
- Colorado: connectforhealthco.com publishes plan data

### What We Could Show

**Scenario: "For knee replacement (CPT 27447) in Denver, CO on a Silver plan"**

| Component | Calculation |
|-----------|-------------|
| Medicare rate (Denver GPCI) | $1,487 (physician) + $12,500 (facility DRG 470) = ~$14,000 |
| Typical commercial rate | $14,000 x 1.8 = ~$25,200 |
| Silver plan deductible (avg) | $5,000 |
| Silver coinsurance after deductible | 20% of remaining $20,200 = $4,040 |
| Silver OOP max | $9,200 (2026 limit) |
| **Your estimated OOP** | **$9,040** (deductible + coinsurance, capped at OOP max) |
| Bronze plan deductible (avg) | $7,476 |
| Bronze coinsurance | 40% of remaining $17,724 = $7,090 |
| **Bronze OOP** | **$9,200** (hits OOP max) |
| Gold plan deductible (avg) | $1,500 |
| Gold coinsurance | 20% of remaining $23,700 = $4,740 |
| **Gold OOP** | **$6,240** |
| Gold premium premium over Silver | ~$150/mo x 12 = $1,800 |
| **Gold total annual cost for this procedure** | **$8,040** (cheapest!) |

This kind of analysis is IMPOSSIBLE on Healthcare.gov today. It requires combining our procedure pricing data with ACA plan benefit design data.

### Integration Effort

| Task | Effort | Priority |
|------|--------|----------|
| Download & parse QHP landscape files | 1-2 days | HIGH |
| Build plan benefit model (deductible/copay/coinsurance by service type) | 2-3 days | HIGH |
| Build OOP calculator engine | 2-3 days | HIGH |
| State exchange data for non-federal states | 3-5 days | MEDIUM |
| Annual update pipeline (new data each October) | 1 day | MEDIUM |

---

## 5. Missing Data We Would Need

### Critical (Required for Core Tools)

| Data | Source | Cost | Effort | Unlocks |
|------|--------|------|--------|---------|
| ACA QHP plan data (premiums, deductibles, benefits) | healthcare.gov/plan-data | Free | 2 days | Plan cost estimator, OOP calculator |
| More hospital negotiated rates | DoltHub (dolthub/transparency-in-pricing) | Free | 3-5 days | Hospital comparison, bill checker, insurer report card |
| Hospital geocoding (lat/lng) | CMS Provider of Services file or geocoding API | Free/cheap | 1-2 days | "Near me" hospital comparison |
| CMS Hospital Compare quality metrics | data.cms.gov Hospital Compare API | Free | 1-2 days | Hospital rankings, value scores |

### High Value (Significantly Improves Tools)

| Data | Source | Cost | Effort | Unlocks |
|------|--------|------|--------|---------|
| MEPS expenditure data by condition/age | AHRQ meps.ahrq.gov | Free | 2-3 days | Annual cost predictor, utilization modeling |
| Hospital chargemasters (CA, NY) | CA OSHPD, NY SPARCS (already downloaded) | Free | 2-3 days | Bill checker (compare charges to fair price) |
| Claims denial rates by insurer | CMS Transparency in Coverage data | Free | 1-2 days | Insurer report card |
| CMS cost-to-charge ratios (HCRIS) | data.cms.gov cost reports | Free | 2-3 days | Convert charges to actual costs |
| HCAHPS patient satisfaction scores | data.cms.gov | Free | 1 day | Hospital rankings |

### Nice to Have (Enhances Depth)

| Data | Source | Cost | Effort | Unlocks |
|------|--------|------|--------|---------|
| Drug formulary data by plan | Formulary APIs (required under ACA) | Free | 3-5 days | "Does my plan cover this drug?" |
| State Medicaid fee schedules | State-by-state, MACPAC comparison | Free | 5+ days | Low-end cost baseline |
| Colorado CIVHC all-payer claims | civhc.org (requires application) | Free/nominal | Application + 2 weeks | Colorado-specific gold standard |
| Workers' comp fee schedules | State labor departments | Free | 3-5 days | Injury-specific cost context |
| FairHealth benchmarks (percentiles) | fairhealth.org | $$$ (commercial) or scrape | N/A | Commercial cost percentiles |

---

## 6. Priority Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Launch the "What Will I Actually Pay?" calculator and bill checker

1. Download & load DoltHub negotiated rates (expand from 39K to millions)
2. Build OOP calculator engine (deductible + copay + coinsurance math)
3. Build bill checker tool (compare user's bill to Medicare/commercial rates)
4. Create 50 high-traffic procedure pages with calculator embedded

**SEO targets:** "[procedure] cost," "is my medical bill too high," "fair price for [procedure]"
**Expected traffic lift:** 5-10K monthly visits from procedure cost pages

### Phase 2: Plan Comparison (Weeks 3-5)
**Goal:** Launch insurance plan cost estimator for open enrollment

1. Download & parse ACA QHP landscape files + PUFs
2. Build plan benefit model
3. Create "which plan is cheapest for me" tool
4. Build procedure-aware plan comparison (input your expected procedures)

**SEO targets:** "best health insurance plan for [condition]," "cheapest health insurance in [state]"
**Expected traffic:** 10-20K during open enrollment season (Nov-Jan)

### Phase 3: Hospital Comparison (Weeks 6-8)
**Goal:** Launch hospital cost comparison with quality integration

1. Load DoltHub hospital rates at scale
2. Geocode hospitals
3. Integrate CMS Hospital Compare quality data
4. Build "compare hospitals for [procedure] near [zip]" tool
5. Generate programmatic pages for top 100 procedures x 50 states

**SEO targets:** "[procedure] cost at [hospital]," "best hospital for [procedure] in [state]"
**Expected traffic:** 20-50K monthly from programmatic pages

### Phase 4: Advanced Tools (Weeks 9-12)
**Goal:** Launch insurer report card, annual cost predictor, negotiation toolkit

1. Build insurer report card from negotiated rate analysis
2. Load MEPS data for utilization modeling
3. Build annual cost predictor
4. Create negotiation letter generator with data-backed fair prices
5. PR push around insurer report card findings

**SEO targets:** "[insurer] vs [insurer]," "negotiate medical bill," "average healthcare cost by age"
**Expected traffic:** 30-80K monthly steady state, spikes during open enrollment

---

## Key Strategic Insights

### 1. The Big Gap in the Market
Nobody combines **procedure-level pricing** with **insurance plan math**. Healthcare.gov shows plans. FAIR Health shows prices. GoodRx shows drug costs. Turquoise shows negotiated rates. But NOBODY answers: **"If I need knee replacement next year and I pick Plan A vs Plan B, what's my total cost?"** We can be the first.

### 2. CostHelper Proves the SEO Model Works
CostHelper Health gets ~97K monthly visits with user-reported cost ranges and simple editorial content. We have 21,524 procedures with REAL government data. If CostHelper can get 97K visits with sketchy user-reported data and ~300 procedure pages, we can get 500K+ with 12,000+ data-backed procedure pages.

### 3. Turquoise Is B2B; We Are B2C
Turquoise just raised $40M and has 1T+ rate records. We cannot compete on data volume. But they sell to hospitals and insurers. Their consumer tool is an afterthought. We build for consumers FIRST. Different market, different UX, different SEO strategy.

### 4. Open Enrollment Is Our Super Bowl
Health insurance decision-making concentrates in Nov-Jan. Our plan comparison tool needs to be live by October to capture open enrollment traffic. The annual cycle creates predictable traffic spikes we can plan content around.

### 5. Bill Negotiation Is the Viral Hook
"70% of people who negotiate succeed in reducing bills by 30-70%." A free tool that tells you "your bill is 3x the Medicare rate, here's a letter to send" has massive sharing potential. This is how we build backlinks and brand awareness.

### 6. All Our Key Data Sources Are Free
Every critical data source (CMS rates, QHP files, DoltHub, Hospital Compare, MEPS) is free and public. The competitive moat is not data access -- it's the combination, the UX, and the SEO execution.
