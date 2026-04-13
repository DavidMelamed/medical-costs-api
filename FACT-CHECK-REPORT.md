# MedicalCosts.info Fact-Check Report

**Date:** April 12, 2026
**API Endpoint:** https://medical-costs-api.david-568.workers.dev
**Methodology:** Compared our live API data against CMS official sources, FastRVU, GoodRx, CostHelper, Nolo/AllLaw, and Morgan & Morgan.

---

## CRITICAL FINDING: Conversion Factor Bug

**Status: BUG CONFIRMED -- HIGH SEVERITY**

The 2026 CMS Physician Fee Schedule has TWO conversion factors (new for 2026):
- **Non-Qualifying APM CF: $33.4009** (standard, applies to most providers)
- **Qualifying APM CF: $33.5675** (for APM participants)
- **2025 CF: $32.3465** (prior year)

### What happened:
1. The **seed.sql** file (original 80+ procedures) uses **$32.35** -- this is the **2025** conversion factor, NOT 2026.
2. The **bulk CMS loader** (`load-cms-bulk.ts`) correctly uses **$33.4009**.
3. The **admin seed endpoint** (`src/index.ts:2205`) hardcodes **`conversion_factor=32.35`**.
4. For procedures that exist in BOTH seed.sql and bulk-procedures.sql, the DB appears to have the **seed.sql values** (with wrong CF), meaning seed.sql was loaded after the bulk data or the bulk data was never loaded for those codes.

### Impact:
- All ~80 hand-seeded procedures show rates that are **~3.2% too low** due to wrong CF
- Additionally, many have **stale 2025 RVU values** (see per-procedure analysis below)
- Procedures ONLY in bulk-procedures.sql are correct (e.g., 27447)

### Affected procedures include:
99281-99285 (ER visits), 99213-99215 (office visits), 97110 (PT), 72148 (MRI lumbar), 70450 (CT head), 70551/70553 (brain MRI), and many more in seed.sql.

### Fix Required:
1. Re-run `load-cms-bulk.ts` output against production D1 (it uses INSERT OR REPLACE)
2. Change `src/index.ts:2205` from `conversion_factor=32.35` to `conversion_factor=33.40`
3. Update `CLAUDE.md` from "$32.35" to "$33.40"

---

## 1. ER Visit (CPT 99285)

| Field | Our Value | CMS 2026 (FastRVU) | Delta |
|-------|-----------|---------------------|-------|
| Work RVU | 3.80 | **4.00** | **WRONG (-5%)** |
| Facility PE RVU | 1.60 | **0.65** | **WRONG (146% too high)** |
| Non-Fac PE RVU | 4.75 | **0.65** | **WRONG (631% too high)** |
| Malpractice RVU | 0.52 | **0.48** | **WRONG** |
| CF | $32.35 | **$33.40** | **WRONG (2025 value)** |
| Facility Rate | $191.51 | **$171.35** | **WRONG (+$20.16)** |
| Non-Facility Rate | $293.41 | **$171.35** | **WRONG (+$122.06)** |

**Root cause:** Our seed.sql has 2025 RVU values AND the 2025 conversion factor. CMS significantly restructured 99285 RVUs for 2026 -- the PE RVU dropped from 1.60 to 0.65 in facility setting.

**Note on Facility vs Non-Facility:** In the CMS 2026 final rule, 99285 has IDENTICAL facility and non-facility rates ($171.35). Our data incorrectly shows a $101.90 gap.

**External context:**
- CostHelper: Average ER visit costs $1,500-$3,000 without insurance (this is the TOTAL bill, not just the physician fee)
- Mira Health: Average ER visit $2,700-$3,000 without insurance
- Our $171.35 (correct) or $191.51 (our wrong value) is the Medicare **physician professional fee only**, not the total ER bill. The total includes facility fees ($500-$1,500 under OPPS) plus ancillary charges.
- **Our presentation should make this clearer** -- users may confuse our Medicare physician rate with the total ER cost.

**Severity: HIGH -- Rates are materially wrong**

---

## 2. MRI Lumbar Spine (CPT 72148)

| Field | Our Value | CMS 2026 (FastRVU) | Delta |
|-------|-----------|---------------------|-------|
| Work RVU | 1.13 | **1.44** | **WRONG (-22%)** |
| Facility PE RVU | 1.42 | **4.20** | **WRONG (-66%)** |
| Non-Fac PE RVU | 8.32 | **4.20** | **WRONG (+98%)** |
| Malpractice RVU | 0.09 | **0.10** | **WRONG** |
| CF | $32.35 | **$33.40** | **WRONG** |
| Facility Rate | $85.40 | **$191.72** | **WRONG (-$106.32, off by 55%)** |
| Non-Facility Rate | $308.61 | **$191.72** | **WRONG (+$116.89)** |

**Root cause:** Our seed.sql values for 72148 appear to be from a completely different year or possibly represent component billing (professional component only for facility). CMS 2026 shows facility and non-facility are identical at $191.72.

**Note:** The bulk-procedures.sql has the correct values: `191.72, 191.72, 33.40`. This data was not applied to the live database.

**External context:**
- MRI lumbar spine costs $400-$3,500 without insurance (total facility + professional)
- Medicare total (professional + technical) would be ~$192 physician + ~$300 facility OPPS = ~$492 total
- Our $85 facility rate is less than half the correct Medicare physician fee
- The user asked if we explain the gap between our $85 and the $400-$3,500 range. **We should**, and the correct comparison is our $192 physician fee vs total billed charges of $400-$3,500.

**Severity: HIGH -- Facility rate is 55% too low**

---

## 3. Knee Replacement (CPT 27447)

| Field | Our Value | CMS 2026 (FastRVU) | Delta |
|-------|-----------|---------------------|-------|
| Work RVU | 19.11 | 19.11 | MATCH |
| Facility PE RVU | 11.58 | 11.58 | MATCH |
| Non-Fac PE RVU | 11.58 | 11.58 | MATCH |
| Malpractice RVU | 4.02 | 4.02 | MATCH |
| CF | $33.40 | $33.40 | MATCH |
| Facility Rate | $1,159.35 | $1,159.35 | **EXACT MATCH** |

**This procedure is CORRECT** because it was only in the bulk loader (not in seed.sql).

**External context:**
- Total knee replacement costs $20K-$50K total (hospital + surgeon + anesthesia + implant)
- Our $1,159.35 is the **surgeon's Medicare professional fee** only
- DRG-based hospital payment (DRG 470) is typically $12K-$15K additional
- **We should make it very clear** that $1,159.35 is just the surgeon's portion

**DRG 470 Note:** DRG 470 (Major Joint Replacement without MCC) is NOT in our database. We only have 100 DRGs (codes 001-135). This is a significant gap since DRG 470 is one of the most common surgical DRGs.

**Severity: OK (data correct), but DRG gap is MEDIUM**

---

## 4. Office Visit (CPT 99213)

| Field | Our Value | CMS 2026 (FastRVU) | Delta |
|-------|-----------|---------------------|-------|
| Work RVU | 1.30 | 1.30 | MATCH |
| Facility PE RVU | 0.66 | **0.33** | **WRONG (100% too high)** |
| Non-Fac PE RVU | 1.78 | **1.46** | **WRONG (22% too high)** |
| Malpractice RVU | 0.11 | **0.09** | **WRONG** |
| CF | $32.35 | **$33.40** | **WRONG** |
| Facility Rate | $66.96 | **$57.45** | **WRONG (+$9.51, +17%)** |
| Non-Facility Rate | $103.20 | **$95.19** | **WRONG (+$8.01, +8%)** |

**Root cause:** 2025 RVU values + 2025 conversion factor. Work RVU is stable but PE and malpractice RVUs changed.

**Note:** The bulk-procedures.sql has the correct values ($57.45 / $95.19). Not loaded to production.

**Severity: MEDIUM -- Rates are ~8-17% too high**

---

## 5. Physical Therapy (CPT 97110)

| Field | Our Value | CMS 2026 (FastRVU) | Delta |
|-------|-----------|---------------------|-------|
| Work RVU | 0.45 | 0.45 | MATCH |
| Facility PE RVU | 0.18 | **0.41** | **WRONG (-56%)** |
| Non-Fac PE RVU | 0.52 | **0.41** | **WRONG (+27%)** |
| Malpractice RVU | 0.01 | 0.01 | MATCH |
| CF | $32.35 | **$33.40** | **WRONG** |
| Facility Rate | $20.70 | **$29.06** | **WRONG (-$8.36, -29%)** |
| Non-Facility Rate | $31.70 | **$29.06** | **WRONG (+$2.64, +9%)** |

**External context:**
- Typical PT session costs $75-$200 (multiple 15-min units, commercial rates)
- Our correct Medicare rate of $29.06/15min is reasonable -- a typical 45-min session = 3 units = $87.18 at Medicare rates
- Commercial rates are 1.5-2.5x Medicare, so $131-$218/session -- consistent with market data

**Note:** CMS 2026 made facility and non-facility rates IDENTICAL for 97110 ($29.06). Our data incorrectly shows a $11 gap.

**Severity: MEDIUM -- Facility rate is 29% too low**

---

## 6. GLP-1 Drugs (NADAC Pricing)

### Ozempic
| Metric | Our Value | External Source | Status |
|--------|-----------|-----------------|--------|
| NADAC per unit range | $272-$639 | $235-$285 (NDCList 2025) | **PARTIALLY WRONG** |
| Avg NADAC/unit | $391.06 | ~$260-$285 | **HIGH** |
| Monthly estimate | $1,564.24 | ~$1,000-$1,200 retail | **Plausible for some formulations** |
| Typical monthly units | 4 | 1-4 (varies by dose) | OK |

**Analysis:** Our NADAC data includes multiple formulations with widely varying per-unit prices ($272 to $639). The $639/unit variant appears to be a multi-dose pen where the "unit" is the entire pen, not per-dose. The averaging across all formulations inflates our estimate.

**GoodRx (2026):** Ozempic without insurance is $850-$1,050/month with coupons; retail is $1,000-$1,200. GoodRx introductory price is $199/month for first 2 fills, then $349/month ongoing.

**Recommendation:** Our NADAC data represents pharmacy acquisition cost, which is correct but needs clear labeling. We should show per-formulation pricing rather than averaging all variants together, as the average is misleading.

### Wegovy
| Metric | Our Value | External Source | Status |
|--------|-----------|-----------------|--------|
| NADAC per unit range | $435-$653 | List price ~$1,350/mo | **NADAC is acquisition cost, much lower than list** |
| Avg NADAC/unit | ~$546 | N/A | See note |
| Monthly estimate | $2,184.45 (est 4 units) | $349/mo (manufacturer), $1,350 list | **Unclear** |

**Analysis:** Wegovy list price is ~$1,350/month. Manufacturer direct-to-patient programs offer $249-$349/month. Our NADAC data shows pharmacy acquisition cost, which correctly represents what pharmacies pay wholesalers. However, our monthly estimate appears inflated by assuming 4 units/month -- Wegovy is typically 1 pen per month (weekly injection, 4 doses per pen).

**Severity: MEDIUM -- Data source (NADAC) is valid but presentation needs work**

---

## 7. DRG Costs

**Gap identified:** Our database only contains **100 DRGs** (codes 001-135), missing major categories:

| Missing DRG | Description | Importance |
|-------------|-------------|------------|
| **DRG 470** | Major Joint Replacement without MCC | One of top 10 surgical DRGs |
| **DRG 871** | Septicemia without MV >96hrs with MCC | **#1 most common Medicare DRG** |
| DRGs 136-999 | Everything above code 135 | ~770 missing DRGs |

### DRG data quality for existing entries:
The DRGs we DO have appear reasonable. Sample checks:
- DRG 001 (Heart Transplant with MCC): $182,155 avg payment, 25.8 days LOS -- plausible
- DRG 003 (ECMO/Trach): $137,964 -- plausible

### External benchmarks:
- **DRG 470:** National average Medicare payment is typically $12,000-$15,000. We don't have this DRG at all.
- **DRG 871:** National average Medicare reimbursement is $22,369-$31,516 (PayerPrice, relative weight 1.9425). We don't have this DRG at all.

**Severity: HIGH -- Missing the most important DRGs (470, 871 not in database)**

---

## 8. Hospital Negotiated Rates

### ER Visit (99285) Negotiated Rates
| Payer | Our Data | Plausibility |
|-------|----------|-------------|
| BCBS (aggregated) | $293 - $7,960, avg $5,067 | **PLAUSIBLE** -- wide variation typical |
| BCBS-TX | $737 - $1,604, avg $1,200 | **PLAUSIBLE** |
| BCBS-GA | $565 - $1,342, avg $1,047 | **PLAUSIBLE** |
| Aetna | $280 - $15,317, avg $4,286 | **PLAUSIBLE but extreme max** |
| Anthem | $4,476 - $10,189, avg $7,672 | **PLAUSIBLE for large systems** |

**Analysis:** The wide variation is consistent with published research on price transparency data. A PMC/NIH study found that ER visit prices vary dramatically by payer type, with commercial insurance often 3-10x Medicare rates. Our range of $255-$15,317 is consistent with this.

The user mentioned "BCBS $1,070, Aetna $7,146" -- these specific values aren't in our data but fall within our observed ranges. The $15,317 max for Aetna is extreme but plausible for a major hospital system billing total ER encounter charges.

### ACL Surgery (27427) Negotiated Rates
Our data shows $167 - $27,033, avg $6,714. This range is plausible given that:
- Medicare professional fee is ~$850
- Commercial rates are typically 2-5x Medicare
- Total facility + professional can reach $20K+

**Severity: LOW -- Negotiated rate data appears reasonable. Wide variation is expected and well-documented.**

---

## 9. Settlement Multipliers

### Our multipliers:

| Injury Type | Mild | Moderate | Severe | Catastrophic |
|-------------|------|----------|--------|--------------|
| Whiplash | 1.5-2.0x | 2.5-3.5x | 3.5-5.0x | 5.0-7.0x |
| TBI | 2.0-3.0x | 3.5-5.0x | 5.0-7.0x | 6.0-8.0x |
| Spinal Cord | 3.0-4.0x | 4.0-5.5x | 5.0-7.0x | 6.0-8.0x |
| Soft Tissue | 1.5-2.0x | 2.0-2.5x | 2.5-3.5x | 3.5-5.0x |
| Default | 1.5-2.0x | 2.0-3.0x | 3.0-5.0x | 5.0-7.0x |

### External sources:

| Source | Multiplier Range | Notes |
|--------|-----------------|-------|
| **Nolo/AllLaw** | 1.5-5x | "Pretty common for adjusters to use 1.5, 2, or even 3" |
| **Morgan & Morgan** | 1.5-5x | "Higher end for severe cases" |
| **AllLaw (detailed)** | 1.5-5x standard, up to 10x rare | Need serious injury + clear fault for >5x |
| **Howard Injury Law** | 1.5-5x | Standard industry practice |
| **Callahan & Blaine** | 1.5-5x | Confirmed as adjuster practice |

### Assessment:

Our **default range of 1.5-7x** is mostly consistent with industry standards of 1.5-5x. However:

- Our **catastrophic multipliers of 5-8x** are on the aggressive side. External sources say >5x requires "serious injury with clear fault, surgical treatment, permanent consequences, and physician testimony." AllLaw says only rare cases justify 6-7x and extremely rare cases reach 10x.
- Our **severe multipliers of 3-7x** are within the acceptable range.
- Our **mild multipliers of 1.5-2x** are consistent with external sources.

**One concern:** Our formula uses `Total Settlement = Economic Damages x Multiplier` where economic damages include BOTH medical bills AND lost wages. The traditional multiplier method typically applies the multiplier to **medical bills only**, then adds lost wages separately:
```
Traditional: (Medical Bills x Multiplier) + Lost Wages = Settlement
Our formula: (Medical Bills + Lost Wages) x Multiplier = Settlement
```

This inflates our estimates. For whiplash moderate: our method gives (Medical + $11,520-$16,320 wages) x 2.5-3.5x, while the traditional method would give (Medical x 2.5-3.5x) + $11,520-$16,320.

**Severity: MEDIUM -- Multipliers are slightly aggressive for severe/catastrophic; formula applies multiplier to lost wages (non-standard)**

---

## 10. Conversion Factor Summary

| Source | CF Value | Status |
|--------|----------|--------|
| CMS 2025 Final Rule | $32.3465 | Prior year |
| CMS 2026 Proposed Rule | $32.35 (approx) | Proposed, not final |
| CMS 2026 Final Rule (non-QP) | **$33.4009** | **CORRECT for 2026** |
| CMS 2026 Final Rule (QP) | $33.5675 | APM participants only |
| Our seed.sql | $32.35 | **WRONG -- uses 2025 CF** |
| Our bulk loader (load-cms-bulk.ts) | $33.4009 | CORRECT |
| Our admin seed endpoint (index.ts:2205) | $32.35 | **WRONG -- hardcoded** |
| Our site static pages | $33.40 | CORRECT |
| Our API-docs page | $33.40 | CORRECT |
| Our methodology page | $33.40 | CORRECT |

**The site SAYS $33.40 but the database STORES $32.35 for seed.sql procedures.** This is a credibility risk.

---

## Summary of Findings

### Data Accuracy Scorecard

| Check | Status | Severity | Fix Needed |
|-------|--------|----------|------------|
| Conversion Factor | WRONG ($32.35 vs $33.40) | **HIGH** | Re-load bulk SQL; fix hardcoded CF |
| 99285 ER Visit | WRONG (stale RVUs + wrong CF) | **HIGH** | Re-load bulk SQL |
| 72148 MRI Lumbar | WRONG (facility rate 55% too low) | **HIGH** | Re-load bulk SQL |
| 27447 Knee Replacement | CORRECT | OK | None |
| 99213 Office Visit | WRONG (+8-17%) | **MEDIUM** | Re-load bulk SQL |
| 97110 PT Exercises | WRONG (facility -29%) | **MEDIUM** | Re-load bulk SQL |
| GLP-1 Drug Pricing | NADAC correct but presentation unclear | **MEDIUM** | Better labeling; per-formulation display |
| DRG Coverage | Missing DRGs 136-999 (incl. 470, 871) | **HIGH** | Load full DRG table |
| Negotiated Rates | Plausible and well-sourced | **LOW** | None |
| Settlement Multipliers | Slightly aggressive; formula non-standard | **MEDIUM** | Clarify methodology; consider traditional formula |
| Site displays of CF | Correct ($33.40) | OK | None |

### Priority Fixes

1. **URGENT:** Apply `data/cms/bulk-procedures.sql` to production D1 database. This single action fixes all procedure-level rate errors for the ~17K bulk-loaded codes.
2. **URGENT:** Fix `src/index.ts:2205` -- change hardcoded `conversion_factor=32.35` to `conversion_factor=33.40`.
3. **URGENT:** Update `CLAUDE.md` to reference CF $33.40 instead of $32.35.
4. **HIGH:** Load complete DRG table (all ~770 MS-DRGs, especially 470 and 871).
5. **MEDIUM:** Improve GLP-1 drug pricing display -- show per-formulation pricing, clarify NADAC vs retail vs patient cost.
6. **MEDIUM:** Add clear disclaimers on procedure pages distinguishing Medicare physician fee from total episode cost.
7. **LOW:** Review settlement multiplier formula -- consider applying multiplier to medical costs only (traditional method).

### Sources Used
- [CMS CY 2026 PFS Final Rule Fact Sheet](https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f)
- [FastRVU CPT 99285](https://fastrvu.com/cpt/99285)
- [FastRVU CPT 72148](https://fastrvu.com/cpt/72148)
- [FastRVU CPT 99213](https://fastrvu.com/cpt/99213)
- [FastRVU CPT 97110](https://fastrvu.com/cpt/97110)
- [FastRVU CPT 27447](https://fastrvu.com/cpt/27447)
- [GoodRx Ozempic Pricing](https://www.goodrx.com/ozempic)
- [GoodRx Wegovy Pricing](https://www.goodrx.com/wegovy)
- [Nolo/AllLaw Multiplier Method](https://www.alllaw.com/articles/nolo/personal-injury/multiplier.html)
- [AllLaw Pain and Suffering Calculator](https://www.alllaw.com/articles/nolo/personal-injury/two-ways-calculate-pain-suffering-settlement.html)
- [Morgan & Morgan Pain and Suffering](https://www.forthepeople.com/practice-areas/personal-injury-lawsuits/average-pain-and-suffering-settlement-amount/)
- [CostHelper ER Visit Cost](https://health.costhelper.com/emergency-room.html)
- [Mira Health ER Cost](https://www.talktomira.com/post/how-much-does-an-er-visit-cost)
- [PMC NIH ER Price Variation Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10918506/)
- [CMS IPPS FY 2026 Final Rule](https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2026-ipps-final-rule-home-page)
- [NDCList Ozempic NADAC Pricing](https://ndclist.com/ndc/0169-4136/package/0169-4136-02/price)
