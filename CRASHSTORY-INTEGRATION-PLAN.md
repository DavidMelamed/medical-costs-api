# CrashStory + MedicalCosts.info Integration Plan

**Date:** April 2026
**Status:** Planning
**Sites:** crashstory.com (car accident data) | medicalcosts.info (medical cost transparency)
**API:** https://medical-costs-api.david-568.workers.dev

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Settlement Multiplier Research](#2-settlement-multiplier-research)
3. [Settlement Impact Calculator Design](#3-settlement-impact-calculator-design)
4. [Programmatic SEO Pages for CrashStory](#4-programmatic-seo-pages-for-crashstory)
5. [Cross-Site Citation Strategy](#5-cross-site-citation-strategy)
6. [API Endpoints Required](#6-api-endpoints-required)
7. [Implementation Phases](#7-implementation-phases)

---

## 1. Executive Summary

CrashStory has ~594K crash records and an attorney directory. MedicalCosts.info has 12,000+ medical procedures with Medicare rates, 22 injury categories with cost ranges, and geographic cost data for 20+ metro areas. The integration creates a settlement estimation pipeline:

**Crash data (CrashStory)** --> **Injury type** --> **Medical costs (MedicalCosts.info API)** --> **Settlement multiplier** --> **Estimated settlement range**

This creates unique content neither site could produce alone, while building mutual link equity and establishing both sites as authoritative sources in the personal injury information space.

### Key Value Propositions

- **For CrashStory users:** "You were in a crash. Here's what your injuries likely cost to treat, and what a settlement might look like."
- **For MedicalCosts.info users:** "These are the actual treatment costs. If you were injured in a crash, here's how these costs translate to settlement value."
- **For SEO:** Targets high-CPC keywords like "whiplash settlement amount" ($15-30 CPC), "TBI settlement value" ($20-40 CPC), and "car accident settlement calculator" ($25-50 CPC).

---

## 2. Settlement Multiplier Research

### 2.1 The Multiplier Method

Insurance adjusters and personal injury attorneys use the "multiplier method" to estimate pain and suffering damages. The formula:

```
Total Settlement = (Medical Bills + Lost Wages) x Multiplier + Property Damage
```

Or more precisely:

```
Total Settlement = Economic Damages x Severity Multiplier
Where Economic Damages = Medical Bills + Future Medical + Lost Wages + Property Damage
```

### 2.2 Multiplier Ranges by Injury Severity

| Severity Level | Multiplier Range | Description | Example Injuries |
|---|---|---|---|
| Minor | 1.5x - 2.0x | Full recovery expected, conservative treatment only | Soft tissue bruises, minor whiplash, sprains |
| Moderate | 2.0x - 3.0x | Extended treatment, temporary disability | Moderate whiplash with PT, simple fractures, minor herniated disc |
| Serious | 3.0x - 4.0x | Surgery required, significant recovery time | Herniated disc with surgery, ACL tear, compound fractures |
| Severe | 4.0x - 5.0x | Permanent impairment, life-altering | Severe TBI, multiple fractures with hardware, internal organ damage |
| Catastrophic | 5.0x - 7.0x+ | Permanent disability, lifetime care needed | Spinal cord injury (paralysis), severe burns, amputation |

Sources: [AllLaw](https://www.alllaw.com/articles/nolo/personal-injury/calculator.html), [Ask Adam Skutner](https://www.askadamskutner.com/las-vegas-personal-injury-lawyers/deciding-multiplier-personal-injury-case/), [Norden Leacox](https://nordenleacox.com/personal-injury-resources/how-are-pain-and-suffering-damages-calculated/)

### 2.3 Pain and Suffering Per Diem Rates (2026)

An alternative calculation method uses daily rates:

| Severity | Daily Rate | Typical Recovery | Total P&S |
|---|---|---|---|
| Minor | $200-$400/day | 30-90 days | $6,000-$36,000 |
| Moderate | $400-$700/day | 90-180 days | $36,000-$126,000 |
| Severe | $700-$1,200/day | 180-365 days | $126,000-$438,000 |
| Catastrophic | $1,200+/day | 365+ days / permanent | $438,000+ |

Source: [CDCalculators](https://cdcalculators.com/car-accident-settlement-calculator/)

### 2.4 Settlement Ranges by Injury Type (from Research)

| Injury Type | Avg Settlement | Low Range | High Range | Typical Multiplier |
|---|---|---|---|---|
| **Whiplash (mild)** | $18,950 | $2,500 | $50,000 | 1.5x-2.5x |
| **Whiplash (severe/chronic)** | $75,000 | $50,000 | $200,000 | 2.5x-4.0x |
| **Concussion** | $25,000 | $10,000 | $75,000 | 2.0x-3.0x |
| **TBI (mild)** | $50,000 | $20,000 | $100,000 | 2.5x-3.5x |
| **TBI (moderate)** | $500,000 | $100,000 | $1,000,000 | 3.5x-5.0x |
| **TBI (severe)** | $1,200,000 | $500,000 | $5,000,000+ | 5.0x-7.0x |
| **Herniated disc (no surgery)** | $65,000 | $20,000 | $110,000 | 2.0x-3.0x |
| **Herniated disc (with surgery)** | $360,000 | $50,000 | $750,000 | 3.0x-5.0x |
| **Broken bone (simple)** | $50,000 | $15,000 | $100,000 | 2.0x-3.0x |
| **Broken bone (compound/surgical)** | $130,000 | $50,000 | $250,000 | 3.0x-4.5x |
| **Spinal cord injury** | $700,000 | $60,000 | $5,000,000 | 4.0x-7.0x |
| **Internal organ damage** | $250,000 | $50,000 | $1,000,000+ | 3.5x-5.0x |
| **Burns (severe)** | $500,000 | $40,000 | $10,000,000+ | 4.0x-7.0x |
| **Soft tissue / contusions** | $10,000 | $2,500 | $25,000 | 1.5x-2.0x |
| **ACL / knee ligament** | $75,000 | $25,000 | $200,000 | 2.5x-4.0x |
| **Shoulder injury** | $50,000 | $15,000 | $150,000 | 2.0x-3.5x |

Sources: [ConsumerShield](https://www.consumershield.com/articles/whiplash-settlement-averages), [Miller & Zois](https://www.millerandzois.com/car-accidents/broken-bone-settlement-amounts/), [Cordisco & Saile](https://www.cordiscosaile.com/blog/traumatic-brain-injury-settlements/), [CHG Lawyers](https://chglawyers.com/catastrophic-injury/injury-compensation-chart/)

### 2.5 Impact of Attorney Representation

Per Insurance Research Council (2025):
- **Without attorney:** Average settlement $17,600
- **With attorney:** Average settlement $77,600 (4.4x higher)

This is a key data point for CrashStory's attorney directory CTA.

### 2.6 Factors That Increase the Multiplier

1. **Clear liability** (other driver 100% at fault)
2. **Thorough medical documentation** (itemized bills, treatment records)
3. **Objective diagnostic evidence** (MRI/CT findings, not just subjective complaints)
4. **Permanent impairment** (documented by IME)
5. **Younger victim age** (more years of suffering)
6. **Consistent treatment** (no gaps in care)
7. **Pre-existing conditions** were aggravated (eggshell plaintiff doctrine)

---

## 3. Settlement Impact Calculator Design

### 3.1 User Flow

```
Step 1: Select injury type
  --> Dropdown with 22 injury categories from API
  --> Shows injury description and body region

Step 2: Select severity
  --> Mild / Moderate / Severe
  --> Shows what each means for this injury type

Step 3: Enter location (optional)
  --> State selector for geographic cost adjustment
  --> Defaults to national average

Step 4: Results page
  --> Medical cost breakdown (from API)
  --> Settlement estimate range
  --> Breakdown of damages
  --> CTA: Find an attorney | Get full cost report
```

### 3.2 Calculation Engine

```typescript
interface SettlementEstimate {
  // Input
  injurySlug: string;
  severity: 'mild' | 'moderate' | 'severe';
  state?: string;

  // Medical costs (from MedicalCosts.info API)
  medicalCosts: {
    emergency: number;      // ER visit, imaging
    acute: number;          // Follow-up visits, initial treatment
    surgical: number;       // If applicable
    rehabilitation: number; // PT, OT, cognitive therapy
    chronic: number;        // Ongoing pain management
    totalMedical: number;
  };

  // Economic damages
  lostWages: {
    estimatedWeeksOff: number;
    weeklyWageAssumption: number; // National median or user-entered
    totalLostWages: number;
  };

  // Settlement calculation
  settlement: {
    economicDamages: number;        // medical + lost wages
    multiplierLow: number;          // severity-based
    multiplierHigh: number;
    painSufferingLow: number;       // economic x (multiplier - 1)
    painSufferingHigh: number;
    totalEstimateLow: number;
    totalEstimateHigh: number;
  };
}
```

### 3.3 Multiplier Mapping to Injury Categories

Map each of the 22 injury categories in the API to specific multiplier ranges:

```typescript
const INJURY_MULTIPLIERS: Record<string, {
  mild: [number, number],
  moderate: [number, number],
  severe: [number, number],
  recoveryWeeks: { mild: number, moderate: number, severe: number }
}> = {
  'whiplash-cervical-strain': {
    mild: [1.5, 2.0],
    moderate: [2.5, 3.5],
    severe: [3.5, 5.0],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 52 }
  },
  'traumatic-brain-injury': {
    mild: [2.0, 3.0],
    moderate: [3.5, 5.0],
    severe: [5.0, 7.0],
    recoveryWeeks: { mild: 8, moderate: 26, severe: 104 }
  },
  'lumbar-thoracic-spine-injury': {
    mild: [1.5, 2.5],
    moderate: [2.5, 4.0],
    severe: [3.5, 5.0],
    recoveryWeeks: { mild: 8, moderate: 24, severe: 52 }
  },
  'spinal-cord-injury': {
    mild: [3.0, 4.0],
    moderate: [4.0, 5.5],
    severe: [5.0, 7.0],
    recoveryWeeks: { mild: 26, moderate: 52, severe: 260 }
  },
  'extremity-fractures': {
    mild: [1.5, 2.5],
    moderate: [2.5, 3.5],
    severe: [3.5, 5.0],
    recoveryWeeks: { mild: 8, moderate: 16, severe: 40 }
  },
  'rib-chest-fractures': {
    mild: [1.5, 2.0],
    moderate: [2.0, 3.0],
    severe: [3.0, 4.5],
    recoveryWeeks: { mild: 6, moderate: 12, severe: 26 }
  },
  'internal-organ-injuries': {
    mild: [2.5, 3.5],
    moderate: [3.5, 5.0],
    severe: [4.5, 6.0],
    recoveryWeeks: { mild: 8, moderate: 20, severe: 52 }
  },
  'soft-tissue-contusions': {
    mild: [1.5, 2.0],
    moderate: [2.0, 2.5],
    severe: [2.5, 3.5],
    recoveryWeeks: { mild: 2, moderate: 6, severe: 16 }
  },
  'knee-ligament-tears': {
    mild: [2.0, 2.5],
    moderate: [2.5, 3.5],
    severe: [3.5, 5.0],
    recoveryWeeks: { mild: 8, moderate: 26, severe: 52 }
  },
  'shoulder-injuries': {
    mild: [1.5, 2.5],
    moderate: [2.5, 3.5],
    severe: [3.0, 4.5],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 40 }
  },
  'facial-jaw-fractures': {
    mild: [2.0, 3.0],
    moderate: [3.0, 4.0],
    severe: [4.0, 5.5],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 40 }
  },
  'burns': {
    mild: [2.0, 3.0],
    moderate: [3.0, 4.5],
    severe: [4.5, 7.0],
    recoveryWeeks: { mild: 4, moderate: 16, severe: 52 }
  },
  'pedestrian-impact-injuries': {
    mild: [2.0, 3.0],
    moderate: [3.0, 4.5],
    severe: [4.5, 6.5],
    recoveryWeeks: { mild: 8, moderate: 24, severe: 52 }
  },
  'bicycle-crash-injuries': {
    mild: [2.0, 3.0],
    moderate: [3.0, 4.0],
    severe: [4.0, 6.0],
    recoveryWeeks: { mild: 6, moderate: 20, severe: 52 }
  }
};
```

### 3.4 Lost Wages Estimation

```typescript
// US Bureau of Labor Statistics, Q1 2026
const MEDIAN_WEEKLY_WAGE = 1_200; // ~$62,400/year

function estimateLostWages(
  recoveryWeeks: number,
  weeklyWage: number = MEDIAN_WEEKLY_WAGE
): number {
  // Assume 60% work-impact during recovery
  // (some people can do modified duty, remote work, etc.)
  return Math.round(recoveryWeeks * weeklyWage * 0.6);
}
```

### 3.5 Example Output: Whiplash (Moderate Severity)

```json
{
  "injury": "Whiplash / Cervical Strain",
  "severity": "moderate",
  "medicalCosts": {
    "emergency": 1850,
    "acute": 2400,
    "surgical": 0,
    "rehabilitation": 4800,
    "chronic": 1500,
    "totalMedical": 10550,
    "source": "MedicalCosts.info — CMS Medicare PFS 2026 rates",
    "note": "Commercial insurance rates are typically 1.5-2.5x Medicare"
  },
  "commercialCostEstimate": {
    "low": 15825,
    "high": 26375
  },
  "lostWages": {
    "weeksOff": 16,
    "weeklyWage": 1200,
    "totalLostWages": 11520
  },
  "settlement": {
    "economicDamages": 37895,
    "multiplierRange": [2.5, 3.5],
    "painAndSufferingLow": 56843,
    "painAndSufferingHigh": 94733,
    "estimatedSettlementLow": 94738,
    "estimatedSettlementHigh": 132628,
    "disclaimer": "Estimates only. Every case is unique. Consult an attorney."
  },
  "citedSources": [
    { "name": "CMS Medicare Physician Fee Schedule 2026", "url": "https://medicalcosts.info/methodology" },
    { "name": "Insurance Research Council 2025", "via": "Settlement multiplier ranges" }
  ]
}
```

---

## 4. Programmatic SEO Pages for CrashStory

### 4.1 URL Structure

Three page types per injury, plus cross-cutting pages:

```
/injury/{slug}/treatment-costs/     -- Medical cost breakdown
/injury/{slug}/settlement-value/    -- Settlement estimation
/injury/{slug}/medical-bills/       -- How bills affect claims
/settlement-calculator/             -- Interactive calculator
/injury/                            -- Index of all injury types
```

### 4.2 Page Templates

#### Template A: Treatment Costs Page

**URL:** `/injury/whiplash-cervical-strain/treatment-costs/`

**Title Tag:** `Whiplash Treatment Costs in 2026: ER, Imaging, PT & More | CrashStory`
(60 chars target, includes year for freshness)

**H1:** `How Much Does Whiplash Treatment Cost After a Car Accident?`

**Meta Description:** `Whiplash treatment costs $2,000-$50,000 depending on severity. See procedure-by-procedure breakdown with 2026 Medicare rates, commercial estimates, and what insurance covers.` (160 chars)

**Content Sections:**
1. **Key cost summary** (hero card with mild/moderate/severe ranges from API `injury_categories`)
2. **What is whiplash?** (from `injury_categories.description`)
3. **Treatment timeline by phase** (EMERGENCY -> ACUTE -> REHABILITATION -> CHRONIC)
   - For each phase: list procedures from `injury_procedure_mappings`, show CPT code, Medicare rate, commercial estimate
4. **Cost by severity table** (mild_cost_low through severe_cost_high from API)
5. **Geographic cost variation** (pull from `medical_cost_geographic` for top 5 states)
6. **How these costs affect your settlement** (link to settlement-value page)
7. **Common procedures table** (sortable, from API `/api/injuries/{slug}`)
8. **FAQ schema section** (3-5 FAQs)
9. **CTA:** "Were you injured in a crash? Find a personal injury attorney near you" --> crashstory.com/attorneys/

**Data from API:**
- `GET /api/injuries/whiplash-cervical-strain` (injury details + procedure mappings)
- `GET /api/injuries/whiplash-cervical-strain/estimate?severity=moderate` (cost estimate)
- `GET /api/compare?state=CO&state=CA&state=TX` (geographic comparison)

**Schema Markup:**
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "about": {
    "@type": "MedicalCondition",
    "name": "Whiplash",
    "alternateName": "Cervical Strain",
    "code": { "@type": "MedicalCode", "codeValue": "S13.4", "codingSystem": "ICD-10-CM" }
  },
  "mainEntity": {
    "@type": "Dataset",
    "name": "Whiplash Treatment Cost Data 2026",
    "creator": { "@type": "Organization", "name": "MedicalCosts.info" },
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": "https://medical-costs-api.david-568.workers.dev/api/injuries/whiplash-cervical-strain"
    }
  }
}
```

---

#### Template B: Settlement Value Page

**URL:** `/injury/whiplash-cervical-strain/settlement-value/`

**Title Tag:** `Whiplash Settlement Value: $2,500-$200,000 Range (2026 Data) | CrashStory`

**H1:** `How Much Is a Whiplash Injury Worth in a Car Accident Settlement?`

**Meta Description:** `Average whiplash settlement is $18,950. See how medical costs, severity multipliers (1.5x-5x), and lost wages determine your claim value. Free settlement calculator.` (160 chars)

**Content Sections:**
1. **Settlement range hero** (big numbers: low/average/high from research data)
2. **How settlements are calculated** (explain multiplier method with visual)
3. **Medical cost basis** (pull from MedicalCosts.info API, cite as source)
   - "According to MedicalCosts.info, the average whiplash treatment costs..."
4. **Settlement multiplier breakdown**
   - Mild (1.5x-2.0x): $X - $Y
   - Moderate (2.5x-3.5x): $X - $Y
   - Severe (3.5x-5.0x): $X - $Y
5. **Lost wages impact** (recovery weeks x median wage)
6. **Factors that increase your settlement** (bulleted list)
7. **With vs without an attorney** ($17,600 vs $77,600 stat)
8. **Settlement calculator embed** (iframe or component from /settlement-calculator/)
9. **Real settlement examples** (anonymized ranges by severity)
10. **FAQ schema section**
11. **CTA:** "Find a car accident attorney near you" --> crashstory.com/attorneys/{city}

**Data from API:**
- `GET /api/injuries/whiplash-cervical-strain/estimate?severity=mild`
- `GET /api/injuries/whiplash-cervical-strain/estimate?severity=moderate`
- `GET /api/injuries/whiplash-cervical-strain/estimate?severity=severe`

**Schema Markup:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the average whiplash settlement amount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The average whiplash settlement ranges from $2,500 to $200,000..."
      }
    }
  ]
}
```

---

#### Template C: Medical Bills Impact Page

**URL:** `/injury/whiplash-cervical-strain/medical-bills/`

**Title Tag:** `How Medical Bills Affect Your Whiplash Settlement (2026 Guide) | CrashStory`

**H1:** `How Your Medical Bills Determine Your Whiplash Settlement Value`

**Meta Description:** `Your medical bills are the foundation of your injury settlement. Learn how $5,000 vs $50,000 in whiplash treatment changes your claim value by 10x or more.`

**Content Sections:**
1. **The medical bills = settlement foundation concept** (visual: bills x multiplier)
2. **Typical whiplash medical bills by treatment path**
   - Conservative (PT only): $2,000-$5,000
   - Moderate (imaging + PT + injections): $5,000-$15,000
   - Surgical (discectomy/fusion): $15,000-$50,000+
   - Data pulled from API with specific CPT codes and rates
3. **How insurance adjusters use your bills** (multiplier method explanation)
4. **Documentation checklist** (what to keep, what to request)
5. **Gaps in treatment hurt your case** (practical advice)
6. **Procedure-by-procedure cost table** (from API, with commercial rate estimates)
7. **Geographic variation** (same whiplash treatment in Denver vs LA vs NYC)
8. **CTA:** Free settlement estimate --> /settlement-calculator/

**Data from API:**
- `GET /api/injuries/whiplash-cervical-strain` (full procedure list)
- `GET /api/procedures/{code}` (individual procedure costs)
- `GET /api/compare?procedure={code}&state=CO&state=CA&state=NY`

---

### 4.3 Full Page Matrix (All 14 Motor Vehicle Injury Types)

Each motor-vehicle-relevant injury gets all 3 templates = **42 pages** at launch:

| Injury Slug | Treatment Costs | Settlement Value | Medical Bills |
|---|---|---|---|
| whiplash-cervical-strain | /injury/whiplash-cervical-strain/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| traumatic-brain-injury | /injury/traumatic-brain-injury/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| lumbar-thoracic-spine-injury | /injury/lumbar-thoracic-spine-injury/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| spinal-cord-injury | /injury/spinal-cord-injury/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| extremity-fractures | /injury/extremity-fractures/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| rib-chest-fractures | /injury/rib-chest-fractures/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| internal-organ-injuries | /injury/internal-organ-injuries/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| soft-tissue-contusions | /injury/soft-tissue-contusions/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| knee-ligament-tears | /injury/knee-ligament-tears/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| shoulder-injuries | /injury/shoulder-injuries/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| facial-jaw-fractures | /injury/facial-jaw-fractures/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| burns | /injury/burns/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| pedestrian-impact-injuries | /injury/pedestrian-impact-injuries/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |
| bicycle-crash-injuries | /injury/bicycle-crash-injuries/treatment-costs/ | .../settlement-value/ | .../medical-bills/ |

Plus 1 settlement calculator page + 1 injury index = **44 total pages**.

### 4.4 Target Keywords per Page Type

**Treatment costs pages** target:
- "{injury} treatment cost" (e.g., "whiplash treatment cost" ~8K-15K monthly searches)
- "how much does {injury} treatment cost"
- "{injury} physical therapy cost"
- "{injury} MRI cost"
- "{injury} surgery cost"

**Settlement value pages** target:
- "{injury} settlement amount" (e.g., "whiplash settlement amount" ~20K-35K monthly searches)
- "average {injury} settlement"
- "{injury} car accident settlement"
- "how much is {injury} worth"
- "{injury} claim value"

**Medical bills pages** target:
- "{injury} medical bills"
- "how medical bills affect {injury} settlement"
- "{injury} documentation for settlement"
- "{injury} treatment records"

### 4.5 State-Specific Variants (Phase 2)

Expand to state variants for high-volume injuries:

```
/injury/whiplash-cervical-strain/settlement-value/colorado/
/injury/whiplash-cervical-strain/settlement-value/california/
/injury/whiplash-cervical-strain/treatment-costs/colorado/
```

This adds geographic cost adjustments from the API's `medical_cost_geographic` table and targets "[injury] settlement [state]" keywords. For 14 injuries x 3 templates x 50 states = **2,100 additional pages** (prioritize states with geographic cost data first).

---

## 5. Cross-Site Citation Strategy

### 5.1 CrashStory Citing MedicalCosts.info

Every treatment cost and settlement value page on CrashStory will include:

**In-content citation (every page):**
```html
<aside class="data-source-citation">
  <p>
    Medical cost data provided by
    <a href="https://medicalcosts.info/injury/whiplash-cervical-strain"
       rel="noopener" target="_blank">
      MedicalCosts.info
    </a>,
    based on CMS Medicare Physician Fee Schedule 2026 rates.
    Commercial insurance rates are typically 1.5-2.5x Medicare.
  </p>
</aside>
```

**Footer citation block (settlement pages):**
```html
<div class="methodology-sources">
  <h3>Data Sources & Methodology</h3>
  <ul>
    <li>
      Medical procedure costs:
      <a href="https://medicalcosts.info">MedicalCosts.info</a>
      — CMS Medicare PFS 2026 (conversion factor: $32.35)
    </li>
    <li>Settlement multiplier ranges: Insurance Research Council 2025</li>
    <li>Crash data: CrashStory.com Colorado crash database</li>
  </ul>
</div>
```

**Schema markup (on every CrashStory injury page):**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "isBasedOn": {
    "@type": "Dataset",
    "name": "Medical Procedure Cost Database 2026",
    "url": "https://medicalcosts.info",
    "creator": {
      "@type": "Organization",
      "name": "MedicalCosts.info",
      "url": "https://medicalcosts.info"
    },
    "license": "https://medicalcosts.info/terms",
    "temporalCoverage": "2026",
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": "https://medical-costs-api.david-568.workers.dev/api/injuries",
      "encodingFormat": "application/json"
    }
  },
  "citation": [
    {
      "@type": "CreativeWork",
      "name": "CMS Medicare Physician Fee Schedule CY 2026",
      "url": "https://www.cms.gov/medicare/payment/fee-schedules/physician"
    },
    {
      "@type": "CreativeWork",
      "name": "CDC WISQARS Cost of Injury Reports",
      "url": "https://wisqars.cdc.gov/cost/"
    }
  ]
}
```

### 5.2 MedicalCosts.info Linking to CrashStory

On every injury category page on MedicalCosts.info:

**"Injured in a crash?" CTA block:**
```html
<div class="crash-injury-cta" style="background: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 24px 0;">
  <h3>Were You Injured in a Car Accident?</h3>
  <p>
    If your whiplash was caused by a car accident, your medical costs
    are just the starting point. Settlement values are typically
    <strong>1.5x to 5x your total medical bills</strong>.
  </p>
  <p>
    <a href="https://crashstory.com/injury/whiplash-cervical-strain/settlement-value/"
       class="cta-button">
      Estimate Your Settlement Value
    </a>
    &nbsp;|&nbsp;
    <a href="https://crashstory.com/attorneys/">
      Find a Personal Injury Attorney
    </a>
  </p>
</div>
```

**Contextual internal link (within procedure pages):**

On procedure pages like `/procedure/97110-therapeutic-exercises`:
```html
<p>
  Therapeutic exercises are commonly prescribed after car accident injuries
  like <a href="https://crashstory.com/injury/whiplash-cervical-strain/treatment-costs/">whiplash</a>
  and <a href="https://crashstory.com/injury/knee-ligament-tears/treatment-costs/">knee ligament tears</a>.
  If you were injured in a crash, these costs factor into your
  <a href="https://crashstory.com/settlement-calculator/">settlement value</a>.
</p>
```

**Schema markup (MedicalCosts.info citing CrashStory):**
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "relatedLink": [
    {
      "@type": "WebPage",
      "name": "Whiplash Settlement Value Calculator",
      "url": "https://crashstory.com/injury/whiplash-cervical-strain/settlement-value/",
      "description": "Estimate the settlement value of a whiplash injury from a car accident"
    },
    {
      "@type": "WebPage",
      "name": "Find a Personal Injury Attorney",
      "url": "https://crashstory.com/attorneys/",
      "description": "Directory of personal injury attorneys in Colorado"
    }
  ]
}
```

### 5.3 Mutual Link Equity Strategy

**Link flow diagram:**

```
MedicalCosts.info                              CrashStory.com
-----------------                              ---------------
/injury/whiplash  ----CTA "settlement?"--->   /injury/whiplash/settlement-value/
                                                    |
                  <--"costs powered by"-----   (cites MedicalCosts.info as source)
                                                    |
/procedure/97110  ----"after crashes"--->     /injury/whiplash/treatment-costs/
                                                    |
                  <--"procedure rates"-----   (links to procedure detail pages)
                                                    |
/methodology      <--"data source"--------   /settlement-calculator/
                                                    |
                                              /attorneys/ (monetization)
```

**Key principles:**
1. MedicalCosts.info links OUT to CrashStory on injury/settlement pages (contextual, editorial)
2. CrashStory links OUT to MedicalCosts.info as a data source (citation authority)
3. Both sites link to their own deeper content first (keep most link equity internal)
4. Cross-links use descriptive anchor text, not "click here"
5. No reciprocal link patterns (A->B and B->A on same page pair) -- use triangle patterns instead

**Triangle pattern example:**
- MedicalCosts.info `/injury/whiplash` --> CrashStory `/injury/whiplash/settlement-value/`
- CrashStory `/injury/whiplash/settlement-value/` --> MedicalCosts.info `/procedure/97110` (different page)
- MedicalCosts.info `/procedure/97110` --> CrashStory `/injury/whiplash/treatment-costs/` (different page)

This avoids appearing as a link exchange to search engines.

---

## 6. API Endpoints Required

### 6.1 Existing Endpoints (Ready)

| Endpoint | Purpose | Used By |
|---|---|---|
| `GET /api/injuries` | List all injury categories | Injury index, calculator dropdown |
| `GET /api/injuries/{slug}` | Injury detail + procedure mappings | Treatment cost pages |
| `GET /api/injuries/{slug}/estimate` | Cost estimate by severity | Settlement calculator, all pages |
| `GET /api/procedures` | Search procedures | Procedure cost tables |
| `GET /api/procedures/{code}` | Procedure detail with rates | Inline cost citations |
| `GET /api/compare` | Geographic comparison | State-specific pages |
| `GET /api/crash-estimate` | Crash severity cost mapping | CrashStory crash detail pages |
| `GET /api/statistics` | Database stats | Footer/about pages |

### 6.2 New Endpoint Needed: Settlement Estimate

```
GET /api/injuries/{slug}/settlement-estimate?severity=moderate&state=CO&weekly_wage=1200
```

**Response:**
```json
{
  "success": true,
  "data": {
    "injury": { "name": "...", "slug": "..." },
    "severity": "moderate",
    "medicalCosts": {
      "medicareBased": 10550,
      "commercialLow": 15825,
      "commercialHigh": 26375,
      "byPhase": { "emergency": 1850, "acute": 2400, "rehabilitation": 4800, "chronic": 1500 }
    },
    "lostWages": {
      "recoveryWeeks": 16,
      "weeklyWage": 1200,
      "total": 11520
    },
    "settlement": {
      "economicDamagesLow": 27345,
      "economicDamagesHigh": 37895,
      "multiplierLow": 2.5,
      "multiplierHigh": 3.5,
      "painAndSufferingLow": 41018,
      "painAndSufferingHigh": 132633,
      "totalLow": 68363,
      "totalHigh": 170528
    },
    "attorneyImpact": {
      "withoutAttorney": "Average settlement $17,600 (IRC 2025)",
      "withAttorney": "Average settlement $77,600 (IRC 2025)"
    },
    "disclaimer": "..."
  },
  "sources": {
    "medicalCosts": "MedicalCosts.info — CMS Medicare PFS 2026",
    "multipliers": "Insurance industry standard ranges",
    "wages": "Bureau of Labor Statistics median weekly earnings 2026"
  }
}
```

### 6.3 New Endpoint Needed: Injury Summary for Embeds

```
GET /api/injuries/{slug}/summary
```

Lightweight endpoint returning just the cost ranges and key facts for embedding in CrashStory pages without a full API call. Cacheable at CDN edge for 24 hours.

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Add `settlement-estimate` endpoint to medical-costs-api Worker
- [ ] Add multiplier data as a new table or config in D1
- [ ] Add `injury/summary` endpoint for lightweight embeds
- [ ] Deploy and test API endpoints

### Phase 2: Settlement Calculator (Weeks 3-4)

- [ ] Build `/settlement-calculator/` page on CrashStory (React component)
- [ ] 3-step wizard: injury type -> severity -> results
- [ ] Mobile-first design (most crash victims search from phone)
- [ ] Add "Find an attorney" CTA at results step
- [ ] Schema markup: FAQPage + WebApplication

### Phase 3: Programmatic SEO Pages (Weeks 5-8)

- [ ] Build 3 page templates in CrashStory Next.js app
- [ ] Generate 42 initial pages (14 injuries x 3 templates)
- [ ] Add cross-site citation blocks
- [ ] Add schema markup (MedicalWebPage, FAQPage, Dataset)
- [ ] Build injury index page at `/injury/`
- [ ] Internal linking: every page links to its 2 sibling pages + parent + calculator

### Phase 4: MedicalCosts.info CTAs (Weeks 5-8, parallel)

- [ ] Add "Injured in a crash?" CTA to all MedicalCosts.info injury pages
- [ ] Add contextual CrashStory links on procedure pages
- [ ] Add settlement multiplier context to injury cost pages
- [ ] Add schema markup for relatedLink to CrashStory

### Phase 5: State-Specific Expansion (Weeks 9-12)

- [ ] Generate state-specific pages for top 10 states (where we have GPCI data)
- [ ] Add state selector to settlement calculator
- [ ] Create state-specific attorney CTAs (link to CrashStory attorneys filtered by state)
- [ ] Target: 140 additional pages (14 injuries x 10 states)

### Phase 6: Crash Detail Integration (Weeks 13-16)

- [ ] On CrashStory individual crash pages, add "Common injuries from this type of crash"
- [ ] Use crash severity + type to suggest likely injuries
- [ ] Show estimated medical costs and settlement ranges inline
- [ ] "This was a [severity] [type] crash. Common injuries include..."
- [ ] Each injury links to its treatment-costs page

---

## Appendix A: Competitor Analysis

### Sites That Do This Well

1. **AllLaw.com** — Personal injury calculator with multiplier explanation. Clean, authoritative content. Ranks for "personal injury settlement calculator."
2. **Miller & Zois** (millerandzois.com) — Extensive injury-specific settlement pages. Ranks for dozens of "{injury} settlement" keywords. Each page has verdict/settlement examples.
3. **ConsumerShield** (consumershield.com) — Data-driven settlement average pages. Monthly updates. Good use of data tables and ranges.
4. **Lawsuit Information Center** (lawsuit-information-center.com) — Settlement value pages with medical cost breakdowns. Similar concept to what we're building.

### Our Competitive Advantage

None of these sites have:
- **Actual medical procedure cost data** (they cite vague ranges, we have CPT-level Medicare rates)
- **Geographic cost variation** (we have GPCI data for 20+ metros)
- **Crash data integration** (we can connect crash types to likely injuries to costs)
- **Attorney directory** (we can close the loop: data -> insight -> action)

### Key Differentiator: Data Specificity

Competitor example (AllLaw):
> "Medical costs for whiplash typically range from a few hundred to tens of thousands of dollars."

Our version:
> "Whiplash treatment costs $2,000-$50,000 depending on severity. A moderate case typically includes 4 follow-up visits (CPT 99213, $78 Medicare / $117-$195 commercial), cervical spine MRI (CPT 72141, $267 Medicare / $400-$668 commercial), and 24 sessions of therapeutic exercise (CPT 97110, $33/session Medicare / $50-$83 commercial). Total: $5,000-$15,000 at commercial rates. [Source: MedicalCosts.info, CMS Medicare PFS 2026]"

This level of specificity is extremely difficult for competitors to replicate without building a similar data pipeline.

---

## Appendix B: Legal Disclaimers Required

Every page must include:

```html
<div class="legal-disclaimer">
  <p><strong>Disclaimer:</strong> The settlement estimates and medical cost data
  on this page are for informational purposes only. They are based on publicly
  available Medicare reimbursement rates and industry-standard settlement
  calculation methods. Actual costs, settlements, and case outcomes vary
  significantly based on individual circumstances, insurance coverage,
  provider, geography, liability, and many other factors. This is not medical
  or legal advice. Consult a qualified personal injury attorney and medical
  professionals for guidance specific to your situation.</p>
</div>
```

The API already includes a `DISCLAIMER` constant in every response. CrashStory pages should render this prominently.
