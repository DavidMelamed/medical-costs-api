# Auto Insurance & Medical Payments After Car Accidents

> Research compiled for CrashStory (crashstory.com) integration with medical cost database.
> Last updated: April 2026

---

## Table of Contents

1. [Auto Insurance Medical Payment Types](#1-auto-insurance-medical-payment-types)
2. [State-by-State Auto Insurance Rules](#2-state-by-state-auto-insurance-rules)
3. [How Medical Bills Flow After a Car Accident](#3-how-medical-bills-flow-after-a-car-accident)
4. [Self-Pay vs Insured Costs](#4-self-pay-vs-insured-costs-after-car-crashes)
5. [Data Sources for Integration](#5-data-sources-for-integration)
6. [CrashStory Integration Implications](#6-crashstory-integration-implications)

---

## 1. Auto Insurance Medical Payment Types

### 1.1 MedPay (Medical Payments Coverage)

**How it works:** MedPay is an optional add-on to auto insurance that pays medical bills after a car accident regardless of fault. No liability investigation is required, so payment is fast. MedPay is considered the **primary payer** -- medical providers bill MedPay first. It has no deductible and no copay.

**Per-person limits:** The policy limit applies per injured person, not per accident. A $5,000 MedPay policy covering a family of four in one crash provides up to $20,000 total ($5K each).

**Typical limits:**
| Limit | Notes |
|-------|-------|
| $1,000 | Bare minimum, common on budget policies |
| $2,000 | Common default |
| $5,000 | Most popular selection |
| $10,000 | Recommended for most drivers |
| $25,000 | Higher-end standard option |
| $50,000-$100,000 | Available from some insurers |

**Cost:** Extremely affordable. Upgrading from $2K to $10K costs as little as $10/year. Typically under $10/month.

**State requirements:** Optional in most states. Required only in **Maine** (minimum $2,000/person). Maine passed LD 899 in 2025 updating MedPay assignment rules.

**What it covers:**
- Hospital/ER bills
- Doctor visits
- Surgery
- X-rays and diagnostics
- Ambulance transport
- Dental work from injury
- Funeral expenses (in some policies)

**What it does NOT cover:**
- Lost wages (unlike PIP)
- Household services
- Pain and suffering

**Subrogation:** MedPay insurers generally DO have subrogation rights -- they can seek reimbursement from the at-fault party's insurance after paying your bills.

---

### 1.2 PIP (Personal Injury Protection)

**How it works:** PIP is a broader no-fault coverage that pays medical expenses, lost wages, and other economic losses regardless of who caused the accident. Required in 12 states.

**States requiring PIP (with minimum limits):**

| State | Min PIP | Notes |
|-------|---------|-------|
| Delaware | $15,000/$30,000 | Per person/per accident |
| Florida | $10,000 | **Repealing July 1, 2026** -- shifting to fault-based BI system |
| Hawaii | $10,000 | |
| Kansas | $4,500 | |
| Kentucky | $10,000 | Choice state -- can opt out of no-fault |
| Massachusetts | $8,000 | |
| Michigan | Required (various) | Reformed in 2019; previously unlimited; now tiered options |
| Minnesota | $40,000 | Highest minimum PIP requirement |
| New Jersey | $15,000 | Choice state |
| New York | $50,000 | Highest dollar minimum; covers "basic economic loss" |
| North Dakota | $30,000 | |
| Oregon | $15,000 | |
| Utah | $3,000 | Lowest PIP minimum |

**What PIP covers (broader than MedPay):**
- Medical expenses (typically 80% of reasonable/necessary costs)
- Lost wages (typically 60% of lost income)
- Rehabilitation expenses
- In-home care and household services
- Funeral expenses
- Survivor/death benefits

**Subrogation:** PIP generally does NOT have subrogation rights -- the insurer cannot seek reimbursement from the at-fault party. This is a key difference from MedPay.

**Florida PIP repeal (2026):** Florida's mandatory $10K PIP is being repealed effective July 1, 2026. The state will shift to a fault-based system requiring minimum BI of $25,000/$50,000 plus $5,000 in MedPay.

---

### 1.3 Bodily Injury Liability (BI)

**How it works:** The at-fault driver's BI coverage pays for the other party's medical bills, lost wages, and pain/suffering. This is the primary way injured parties recover compensation in **at-fault/tort states** (the majority of US states).

**Average BI claim payouts (trending upward):**
| Year | Average BI Claim |
|------|-----------------|
| 2016 | $16,082 |
| 2019 | ~$20,000 |
| 2022 | $26,501 |
| 2024 | $28,278 |
| 2026 | ~$29,100-$30,416 |

BI claim severity has risen **81% since 2016** and **40% since 2019**, driven by faster driving speeds, increased medical costs, and attorney involvement in claims.

**How BI claims work:**
1. Injured party files claim against at-fault driver's insurance
2. Insurance adjuster investigates liability and damages
3. Medical bills, lost wages, and pain/suffering are calculated
4. Negotiation between adjuster and claimant (or their attorney)
5. Settlement or lawsuit
6. Payment from at-fault driver's BI policy up to policy limits

**Key limitation:** BI only pays up to the at-fault driver's policy limits. If medical bills exceed those limits, the injured party must pursue other sources (UM/UIM, health insurance, lawsuit against the driver personally).

---

### 1.4 Uninsured/Underinsured Motorist Coverage (UM/UIM)

**How it works:** UM/UIM protects you when the at-fault driver has no insurance (UM) or insufficient insurance (UIM) to cover your damages.

**Two types:**
- **UMBI (Uninsured Motorist Bodily Injury):** Covers medical bills for you and passengers
- **UMPD (Uninsured Motorist Property Damage):** Covers vehicle damage

**Claims process:**
- **No insurance on at-fault driver:** File directly under your UM coverage
- **Insufficient insurance:** File against their insurance first; once their limits are exhausted, file under your UIM for the remainder

**State requirements:** About half of all states require UM/UIM coverage. Common minimum is 25/50 (must match liability limits at many insurers).

**Average cost:** ~$199/year nationally.

**Uninsured motorist rates by state (critical data point):**
- **National average:** 15.4% of drivers are uninsured (2023 IRC data)
- **Highest:** Mississippi (28.2%), New Mexico (24.9%), Washington DC (25.2%), Tennessee (20.9%), Michigan (19.6%)
- **Lowest:** Maine (5.7%), Wyoming (5.9%), Idaho (6.2%)

This data is highly relevant for CrashStory -- in states with high uninsured rates, crash victims are more likely to face coverage gaps and higher out-of-pocket medical costs.

---

### 1.5 Health Insurance as Secondary Payer

**Payment priority:** Auto insurance (PIP/MedPay) pays first. Health insurance becomes the secondary payer once auto coverage limits are exhausted.

**Subrogation:** Health insurers typically have subrogation clauses allowing them to seek reimbursement from personal injury settlements. This means they may demand repayment from settlement proceeds, reducing the victim's net compensation.

**Coordination of benefits:** In no-fault states, PIP is primary. In at-fault states, the payment hierarchy is typically:
1. MedPay (if available)
2. Health insurance (subject to subrogation)
3. At-fault driver's BI coverage (through settlement)

---

### 1.6 Workers' Compensation (Work-Related Crashes)

**When it applies:** If the crash occurred while driving for work-related purposes (not commuting). Covers employees driving for deliveries, errands, business travel, rideshare, trucking, etc.

**Key features:**
- **No-fault system:** No need to prove the other driver caused it
- **Covers even if you were at fault** (unless under influence of drugs/alcohol)
- **Does not cover regular commuting**
- **Can file both:** Workers' comp AND a personal injury claim against the at-fault driver
- **Covers:** Medical bills, wage replacement, rehabilitation
- **Does not cover:** Pain and suffering (unlike BI claims)

---

### 1.7 Medical Liens and Letters of Protection (LOP)

**When used:** When the injured person has no insurance or insufficient coverage to pay for treatment upfront, and an attorney is involved.

**How medical liens work:**
1. Injured person retains a personal injury attorney
2. Attorney issues a **Letter of Protection (LOP)** to medical providers
3. LOP guarantees payment from the eventual settlement
4. Providers treat the patient on a deferred-payment basis
5. After settlement, medical liens are paid before the client receives remaining funds

**Key points:**
- Even if the case is lost, the patient may still owe the provider
- Attorneys can negotiate lien amounts down (common practice)
- Medical lien amounts are often based on chargemaster rates, which can be negotiated
- This is extremely common in personal injury practice -- it's how many uninsured crash victims access care

---

## 2. State-by-State Auto Insurance Rules

### 2.1 No-Fault vs At-Fault States

**No-Fault States (12):** Florida*, Hawaii, Kansas, Kentucky**, Massachusetts, Michigan, Minnesota, New Jersey**, New York, North Dakota, Pennsylvania**, Utah

*Florida repealing PIP July 2026
**Choice states (KY, NJ, PA) -- drivers can choose no-fault or tort

**At-Fault/Tort States (38 + DC):** All remaining states. The at-fault driver's insurance pays for the other party's injuries. Injured parties can sue for pain and suffering without restrictions.

**Choice States (3):** Kentucky, New Jersey, and Pennsylvania allow drivers to choose between no-fault and tort coverage. Choosing no-fault typically means lower premiums but restricted lawsuit rights.

**Impact on medical costs:**
- No-fault states have higher insurance premiums on average
- No-fault states see more insurance fraud (claims paid regardless of fault)
- At-fault states allow direct lawsuits for pain and suffering, leading to larger settlements

### 2.2 Minimum Bodily Injury Liability Limits by State (2026)

| State | BI Per Person | BI Per Accident | PD | PIP Required | UM/UIM Required |
|-------|--------------|----------------|-----|-------------|----------------|
| Alabama | $25,000 | $50,000 | $25,000 | No | No |
| Alaska | $50,000 | $100,000 | $25,000 | No | No |
| Arizona | $25,000 | $50,000 | $15,000 | No | No |
| Arkansas | $25,000 | $50,000 | $25,000 | No | No |
| California | $30,000 | $60,000 | $15,000 | No | Optional |
| Colorado | $25,000 | $50,000 | $15,000 | No | No |
| Connecticut | $25,000 | $50,000 | $25,000 | No | Yes |
| Delaware | $25,000 | $50,000 | $10,000 | $15K/$30K | No |
| Florida | None* | None* | $10,000 | $10,000* | No |
| Georgia | $25,000 | $50,000 | $25,000 | No | No |
| Hawaii | $40,000 | $80,000 | $20,000 | $10,000 | No |
| Idaho | $25,000 | $50,000 | $15,000 | No | No |
| Illinois | $25,000 | $50,000 | $20,000 | No | Yes |
| Indiana | $25,000 | $50,000 | $25,000 | No | Yes |
| Iowa | $20,000 | $40,000 | $15,000 | No | No |
| Kansas | $25,000 | $50,000 | $25,000 | $4,500 | Yes |
| Kentucky | $25,000 | $50,000 | $25,000 | $10,000 | No |
| Louisiana | $15,000 | $30,000 | $25,000 | No | No |
| Maine | $50,000 | $100,000 | $25,000 | No | Yes |
| Maryland | $30,000 | $60,000 | $15,000 | $2,500 | Yes |
| Massachusetts | $25,000 | $50,000 | $30,000 | $8,000 | Yes |
| Michigan | $50,000 | $100,000 | $10,000 | Required | No |
| Minnesota | $30,000 | $60,000 | $10,000 | $40,000 | Yes |
| Mississippi | $25,000 | $50,000 | $25,000 | No | No |
| Missouri | $25,000 | $50,000 | $25,000 | No | Yes |
| Montana | $25,000 | $50,000 | $20,000 | No | No |
| Nebraska | $25,000 | $50,000 | $25,000 | No | Yes |
| Nevada | $25,000 | $50,000 | $20,000 | No | No |
| New Hampshire | $25,000 | $50,000 | $25,000 | No | No |
| New Jersey | $35,000 | $70,000 | $25,000 | $15,000 | Yes |
| New Mexico | $25,000 | $50,000 | $10,000 | No | No |
| New York | $25,000 | $50,000 | $10,000 | $50,000 | Yes |
| North Carolina | $50,000 | $100,000 | $50,000 | No | Yes |
| North Dakota | $25,000 | $50,000 | $25,000 | $30,000 | Yes |
| Ohio | $25,000 | $50,000 | $25,000 | No | No |
| Oklahoma | $25,000 | $50,000 | $25,000 | No | No |
| Oregon | $25,000 | $50,000 | $20,000 | $15,000 | Yes |
| Pennsylvania | $15,000 | $30,000 | $5,000 | No | Optional |
| Rhode Island | $25,000 | $50,000 | $25,000 | No | No |
| South Carolina | $25,000 | $50,000 | $25,000 | No | Yes |
| South Dakota | $25,000 | $50,000 | $25,000 | No | Yes |
| Tennessee | $25,000 | $50,000 | $25,000 | No | No |
| Texas | $30,000 | $60,000 | $25,000 | No | No |
| Utah | $30,000 | $65,000 | $25,000 | $3,000 | Optional |
| Vermont | $25,000 | $50,000 | $10,000 | No | Yes |
| Virginia | $50,000 | $100,000 | $25,000 | No | Optional |
| Washington | $25,000 | $50,000 | $10,000 | No | No |
| Washington D.C. | $25,000 | $50,000 | $10,000 | No | Yes |
| West Virginia | $25,000 | $50,000 | $25,000 | No | Yes |
| Wisconsin | $25,000 | $50,000 | $10,000 | No | Yes |
| Wyoming | $25,000 | $50,000 | $20,000 | No | No |

*Florida PIP being repealed July 1, 2026; shifting to $25K/$50K BI + $5K MedPay.

**New Hampshire:** Only state where auto insurance is not required by law (but financial responsibility rules apply if you cause an accident).

### 2.3 Recent State Minimum Increases (2025-2026)

| State | Old BI Limits | New BI Limits | Effective |
|-------|--------------|--------------|-----------|
| California | 15/30/5 | 30/60/15 | Jan 1, 2025 |
| North Carolina | 30/60/25 | 50/100/50 | Jan 1, 2025 |
| Utah | 25/65/15 | 30/65/25 | Jan 1, 2025 |
| Virginia | 30/60/20 | 50/100/25 | Jan 1, 2025 |
| New Jersey | 25/50/25 | 35/70/25 | Jan 1, 2026 |
| Florida | PIP only | 25/50 BI + $5K MedPay | Jul 1, 2026 |

California's increase was the first since 1967 -- a signal that decades-old minimums are dangerously inadequate given modern medical costs.

### 2.4 Average Auto Insurance Premiums by State (2025-2026)

**National average:** $2,256/year (2026)

**Most expensive states:**
- Washington D.C.: $4,017/year
- Louisiana: $2,883/year
- Nevada, Florida, Connecticut, Delaware: >$300/month

**Least expensive states:**
- Vermont: ~$128/month (~$1,536/year)
- Maine: $1,175/year (lowest)

**Trend:** After falling 6% in 2025, premiums are stabilizing in 2026. 21 states + DC saw decreases in 2025; 29 states saw increases. Nevada and Louisiana saw rates double year-over-year.

---

## 3. How Medical Bills Flow After a Car Accident

### 3.1 Payment Timeline and Priority

```
ACCIDENT OCCURS
      |
      v
[IMMEDIATE: 0-30 days]
      |
      +--> MedPay pays first (if available) -- no fault determination needed
      +--> PIP pays first (in no-fault states) -- no fault determination needed
      +--> ER/hospital may bill health insurance
      +--> Workers' comp pays (if work-related crash)
      |
      v
[SHORT-TERM: 1-6 months]
      |
      +--> Health insurance pays as secondary (with subrogation rights)
      +--> Medical lien / Letter of Protection issued by attorney
      +--> Providers agree to defer payment pending settlement
      +--> MedPay/PIP limits may be exhausted
      |
      v
[MEDIUM-TERM: 3-18 months]
      |
      +--> Liability investigation completed
      +--> Demand letter sent to at-fault driver's BI insurer
      +--> Negotiation between attorney and insurance adjuster
      +--> Medical treatment may be ongoing
      |
      v
[SETTLEMENT/RESOLUTION: 6 months - 3+ years]
      |
      +--> Settlement reached OR lawsuit filed
      +--> At-fault driver's BI insurance pays settlement
      +--> If BI limits insufficient: UM/UIM claim filed
      +--> Settlement funds distributed:
      |     1. Attorney fees (typically 33-40%)
      |     2. Medical liens paid
      |     3. Health insurance subrogation paid
      |     4. Remaining to client
      |
      v
[POST-SETTLEMENT: 2-6 weeks]
      |
      +--> Insurance company issues payment (30-60 days by law in most states)
      +--> Attorney disburses funds per fee agreement
```

### 3.2 Payment Priority Stack

1. **MedPay / PIP** -- pays immediately, no fault needed
2. **Health insurance** -- secondary payer, subject to subrogation
3. **Workers' comp** -- if work-related, parallel to other coverage
4. **Medical liens / LOPs** -- providers defer payment for settlement
5. **At-fault driver's BI** -- pays through settlement/judgment
6. **UM/UIM** -- fills gaps when at-fault driver lacks sufficient coverage
7. **Personal assets of at-fault driver** -- last resort, rare

### 3.3 Medical Liens and Letters of Protection (Detail)

**Letter of Protection (LOP) process:**
1. Attorney sends LOP to medical provider
2. LOP guarantees payment from future settlement proceeds
3. Provider treats patient without upfront payment
4. Provider files a medical lien against the case
5. At settlement, liens are negotiated and paid before client receives funds

**Lien negotiation:** Attorneys commonly negotiate medical liens down by 30-50%. This is standard practice and an important way clients receive more net compensation.

**Risk:** If the case is lost or settles for less than expected, the patient may still owe the full billed amount to the provider.

### 3.4 Subrogation Rights

| Payer Type | Has Subrogation Rights? | Notes |
|-----------|------------------------|-------|
| MedPay | Yes (in most states) | Insurer can seek reimbursement from at-fault party |
| PIP | No (generally) | No right to seek reimbursement |
| Health Insurance | Yes | Can claim reimbursement from settlement |
| Workers' Comp | Yes | Can subrogate against at-fault party |
| Medicare/Medicaid | Yes (mandatory) | Federal super-lien; must be repaid from settlement |

---

## 4. Self-Pay vs Insured Costs After Car Crashes

### 4.1 Hospital Chargemaster Rates vs Negotiated Rates

**The pricing gap is enormous:**
- Hospital list prices (chargemaster) are on average **164% higher** than negotiated insurance rates
- Cash/self-pay prices are on average **60% higher** than negotiated rates
- Chargemaster rates are typically **2.5x what insurers pay** and **3x+ actual hospital costs**
- Almost no one actually pays full chargemaster rates

**Why this matters for car accident cases:**
- Uninsured crash victims may be billed at chargemaster rates
- Medical liens often reflect chargemaster or inflated billing
- The difference between billed and paid amounts becomes a negotiation point in settlements
- Attorneys routinely argue for reduction of medical bills in settlements

### 4.2 Balance Billing Protections (No Surprises Act)

The **No Surprises Act** (effective January 1, 2022) protects patients from:
- Balance bills for emergency care (regardless of network status)
- Out-of-network cost-sharing at in-network facilities
- Air ambulance balance bills from out-of-network providers

**For self-pay patients:** Providers must give a good-faith cost estimate. If the final bill exceeds the estimate by $400+, the patient can dispute it.

**Relevance to car accidents:** Many car accident ER visits involve out-of-network providers. The No Surprises Act limits what patients owe in these situations.

### 4.3 Medical Cost Reduction in Settlements

**Common practice:** Medical bills are routinely reduced during settlement negotiations.

Reduction methods:
1. **Lien negotiation:** Attorney negotiates down medical provider liens (30-50% reduction common)
2. **Insurance write-offs:** The difference between billed and paid amounts
3. **Medicare/Medicaid rates as benchmark:** Courts sometimes use government rates as "reasonable" amounts
4. **Bulk bill negotiation:** Attorneys with volume relationships get better reductions

### 4.4 Collateral Source Rule by State

The **collateral source rule** prevents defendants from reducing damages by pointing to payments the plaintiff received from other sources (health insurance, disability, etc.).

**State variations:**

| Approach | States | Effect |
|----------|--------|--------|
| **Traditional rule (plaintiff-friendly)** | Virginia, Colorado, and others | Full billed amounts recoverable regardless of what insurance actually paid |
| **Modified rule** | Missouri, Arizona (malpractice), others | Various exceptions allow collateral source evidence |
| **Post-verdict reduction** | New York, Florida, Minnesota | Court reduces verdict by collateral source payments; eliminates subrogation |
| **38 states** have some exceptions | Various | Gladden, lien-reduced, malingering, and malpractice exceptions |

**Colorado (CrashStory's primary state):** Health insurance payments may NOT be introduced as evidence to reduce damages. Even proof of reduced negotiated rates cannot be used to limit damages. This is plaintiff-friendly -- injured parties can claim the full billed amount.

---

## 5. Data Sources for Integration

### 5.1 NAIC Auto Insurance Database

- **Source:** [NAIC Auto Insurance Database Report](https://content.naic.org/sites/default/files/publication-aut-pb-auto-insurance-database.pdf)
- **Latest:** 2022/2023 report (adopted December 2025)
- **Format:** Zipped CSV files with record layouts (spreadsheet/database ready)
- **Contains:** State-level earned premiums, incurred losses, earned exposures, claim counts for voluntary and residual markets
- **Published:** Semiannually
- **Cost:** NAIC publications may require purchase

### 5.2 Insurance Research Council (IRC)

- **Source:** [insurance-research.org](https://insurance-research.org/research-publications)
- **Key studies:**
  - Countrywide Patterns in Auto Injury Claims
  - Uninsured and Underinsured Motorists (2017-2023)
  - Auto Insurance Affordability studies
- **Data:** Based on 35,000+ closed auto injury claims; covers injury types, medical treatment, losses, payments, attorney involvement, fraud
- **Finding:** Medical costs for auto injury claims outpace general medical inflation (10% annualized vs 3% medical CPI from 2012-2017)

### 5.3 Insurance Information Institute (III)

- **Source:** [iii.org/fact-statistic/facts-statistics-auto-insurance](https://www.iii.org/fact-statistic/facts-statistics-auto-insurance)
- **Data:** Average BI claim amounts, collision claim data, comprehensive claim data, auto insurance expenditures by state
- **Key stat:** Average BI claim was $26,501 (2022), trending to ~$29,100 (2025)

### 5.4 IIHS/HLDI (Insurance Institute for Highway Safety / Highway Loss Data Institute)

- **Source:** [iihs.org](https://www.iihs.org)
- **Data:** Insurance loss data by vehicle make/model, injury rates, crash test results
- **Integration potential:** Link crash severity data to expected medical costs by vehicle type

### 5.5 State Insurance Department Rate Filings

- Each state's Department of Insurance publishes rate filing data
- **California example:** [insurance.ca.gov auto studies](https://www.insurance.ca.gov/0400-news/0200-studies-reports/0600-research-studies/auto-policy-studies/)
- Contains insurer-specific premium data, loss ratios, claim frequencies

### 5.6 The Zebra State of Insurance Report

- **Source:** [thezebra.com/state-of-insurance/auto/2026/](https://www.thezebra.com/state-of-insurance/auto/2026/)
- **Data:** State-by-state premium data, trends, demographic breakdowns
- Updated annually with current year data

### 5.7 Insurify Auto Insurance Reports

- **Source:** [insurify.com/car-insurance/report/](https://insurify.com/car-insurance/report/)
- **Data:** Premium trends, state comparisons, affordability analysis
- **Key finding:** Premiums fell 6% in 2025; stabilizing in 2026

### 5.8 ValuePenguin / LendingTree

- **Source:** [valuepenguin.com/state-of-auto-insurance-2026](https://www.valuepenguin.com/state-of-auto-insurance-2026)
- **Data:** State-by-state rate comparisons, coverage analysis

---

## 6. CrashStory Integration Implications

### 6.1 Data Model Considerations

For the medical costs database integration, CrashStory should model:

```
CrashRecord
  ├── state_code (determines insurance regime)
  ├── fault_determination (at-fault vs no-fault state rules)
  ├── insurance_regime_type: "no_fault" | "tort" | "choice"
  │
  ├── ApplicableCoverage
  │   ├── pip_required: boolean
  │   ├── pip_minimum: dollar amount
  │   ├── bi_minimum_per_person: dollar amount
  │   ├── bi_minimum_per_accident: dollar amount
  │   ├── um_uim_required: boolean
  │   ├── medpay_required: boolean
  │   └── uninsured_rate: percentage (by state)
  │
  ├── MedicalCostEstimate
  │   ├── chargemaster_amount (full billed)
  │   ├── negotiated_insurance_amount
  │   ├── medicare_rate (benchmark)
  │   ├── expected_lien_reduction: percentage
  │   └── collateral_source_rule: "traditional" | "modified" | "post_verdict_reduction"
  │
  └── SettlementEstimate
      ├── average_bi_claim_state: dollar amount
      ├── typical_timeline_months: range
      ├── attorney_fee_percentage: 33-40%
      └── net_to_client_estimate: dollar amount
```

### 6.2 State-Specific Logic

The insurance payment flow depends heavily on state:

**No-fault states:** PIP pays first, regardless of fault. Limited ability to sue. Medical costs generally capped by PIP limits unless injury meets "serious injury threshold."

**At-fault/tort states:** At-fault driver's BI pays. Full ability to sue for all damages including pain and suffering. Medical costs can be fully recovered through settlement.

**Choice states (KY, NJ, PA):** Must know which option the driver elected. Affects available remedies.

### 6.3 Key Metrics to Surface Per Crash

For each crash in CrashStory, the medical costs integration could show:

1. **State insurance regime** (no-fault/tort/choice)
2. **Minimum coverage available** (BI limits, PIP limits for that state)
3. **Uninsured driver probability** (state uninsured rate)
4. **Average BI claim for that state** (if data available)
5. **Estimated medical cost range** based on injury severity + procedure codes
6. **Chargemaster vs negotiated rate comparison** for relevant procedures
7. **Typical settlement timeline** for that state
8. **Statute of limitations** (already tracked in CrashStory for CO: 3yr PI, 2yr wrongful death)

### 6.4 Colorado-Specific Notes (Primary Market)

- **Insurance type:** At-fault/tort state
- **BI minimums:** 25/50/15
- **PIP:** Not required
- **UM/UIM:** Not required
- **MedPay:** Optional
- **Collateral source rule:** Plaintiff-friendly -- full billed amounts recoverable
- **Statute of limitations:** 3 years PI, 2 years wrongful death
- **Uninsured rate:** ~11-12% (moderate)

---

## Sources

- [Progressive - Medical Payments Coverage](https://www.progressive.com/answers/medical-payments-coverage/)
- [Bankrate - MedPay in Car Insurance](https://www.bankrate.com/insurance/car/medpay-in-car-insurance/)
- [MoneyGeek - State Minimum Car Insurance Requirements](https://www.moneygeek.com/insurance/auto/state-minimum-car-insurance-requirements/)
- [WalletHub - PIP States 2026](https://wallethub.com/answers/ci/pip-states-2140692103/)
- [World Population Review - No-Fault States 2026](https://worldpopulationreview.com/state-rankings/no-fault-states)
- [NerdWallet - Minimum Car Insurance Requirements](https://www.nerdwallet.com/insurance/auto/learn/minimum-car-insurance-requirements)
- [CarInsurance.com - Minimum Liability by State](https://www.carinsurance.com/Articles/minimum-liability-car-insurance-requirements-by-state.aspx)
- [III - Facts & Statistics: Auto Insurance](https://www.iii.org/fact-statistic/facts-statistics-auto-insurance)
- [III - Uninsured Motorists](https://www.iii.org/fact-statistic/facts-statistics-uninsured-motorists)
- [IRC - Uninsured and Underinsured Motorists 2017-2023](https://insurance-research.org/node/130)
- [IRC - Research Publications](https://insurance-research.org/research-publications)
- [NAIC - Auto Insurance Database Report 2022/2023](https://content.naic.org/sites/default/files/publication-aut-pb-auto-insurance-database.pdf)
- [NAIC - Auto Insurance Topics](https://content.naic.org/insurance-topics/auto-insurance)
- [The Zebra - 2026 State of Insurance Auto Trend Report](https://www.thezebra.com/state-of-insurance/auto/2026/)
- [Insurify - Car Insurance Report 2026](https://insurify.com/car-insurance/report/)
- [ValuePenguin - State of Auto Insurance 2026](https://www.valuepenguin.com/state-of-auto-insurance-2026)
- [Bankrate - Car Insurance Rates by State 2026](https://www.bankrate.com/insurance/car/states/)
- [CFPB - No Surprises Act](https://www.consumerfinance.gov/ask-cfpb/what-is-a-surprise-medical-bill-and-what-should-i-know-about-the-no-surprises-act-en-2123/)
- [PMC - Hospital Price Transparency Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9464687/)
- [AllLaw - Collateral Source Rule](https://www.alllaw.com/articles/nolo/personal-injury/collateral-source-rule.html)
- [Colorado Law - Collateral Source Rule](https://www.coloradolaw.net/law-101/collateral-source-rule/)
- [Nolo - Workers' Comp and Car Accidents](https://www.nolo.com/legal-encyclopedia/workers-compensation-and-car-accidents.html)
- [Mighty - How Long Does a Car Accident Settlement Take](https://www.mighty.com/blog/how-long-does-a-car-accident-settlement-take)
- [MWL Law - Med Pay/PIP Subrogation in All 50 States](https://www.mwl-law.com/wp-content/uploads/2018/02/MED-PAY-PIP-SUBRO-CHART.pdf)
- [Insurance Journal - Auto Insurance Premiums Stabilizing 2026](https://www.insurancejournal.com/news/national/2026/02/03/856668.htm)
- [ConsumerShield - PIP Coverage 2026](https://www.consumershield.com/injuries-accidents/personal-injury/pip)
- [Harmonie Group - 50 State Collateral Source Rule Overview](https://www.harmonie.org/file/Litigation%20Best%20Practices/Collateral%20Source%20Rule%202016.pdf)
