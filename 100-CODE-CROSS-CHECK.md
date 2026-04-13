# 100-Code Cross-Check: Our API Rates vs Consumer Reality

**Date:** April 12, 2026
**API Endpoint:** https://medical-costs-api.david-568.workers.dev/api/procedures/{code}

## Executive Summary

Our API shows **Medicare Physician Fee Schedule (PFS) rates** -- the amount CMS pays the doctor/surgeon for their professional service. For office visits, labs, and outpatient therapy, this is reasonably close to what consumers actually pay. But for surgeries and hospital-based procedures, **our rate represents only 5-15% of the total cost of care**. A knee replacement shows as $1,159 on our site, but consumers will find $30,000-$50,000 when they Google it.

### The Core Problem

| Category | Our Rate Accuracy | Gap Severity |
|----------|------------------|--------------|
| Lab Tests | Reasonable (within 2-5x of cash price) | LOW |
| Office Visits | Reasonable (facility fee missing for hospital-based) | LOW-MEDIUM |
| Physical Therapy | Reasonable (per-unit, close to copay) | LOW |
| Mental Health | Reasonable (close to insurance-negotiated) | LOW-MEDIUM |
| Imaging (X-ray) | Low but in range of Medicare payment | MEDIUM |
| Imaging (MRI/CT) | Shows technical component only | MEDIUM-HIGH |
| Cardiac Diagnostics | Missing facility fees | MEDIUM-HIGH |
| Outpatient Procedures | Physician fee only, missing facility + anesthesia | HIGH |
| Inpatient Surgery | 3-8% of total cost shown | CRITICAL |
| Major Surgery (CABG, joints) | 1-5% of total cost shown | CRITICAL |

---

## Category 1: Emergency/Office Visits (10 codes)

### What Our API Shows vs Consumer Reality

| Code | Description | Our Facility Rate | Our Non-Fac Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|-------------------|-------------------|----------------|---------------------|-----|
| 99281 | ER Visit - Minor | $11.02 | $11.02 | $17-$28 | $500-$1,500 total ER bill | CRITICAL |
| 99282 | ER Visit - Low | $40.42 | $40.42 | $61-$101 | $800-$2,000 | CRITICAL |
| 99283 | ER Visit - Moderate | $69.47 | $69.47 | $104-$174 | $1,500-$3,000 | CRITICAL |
| 99284 | ER Visit - High | $118.24 | $118.24 | $177-$296 | $2,000-$5,000 | CRITICAL |
| 99285 | ER Visit - Critical | $171.35 | $171.35 | $257-$428 | $3,000-$20,000+ | CRITICAL |
| 99291 | Critical Care (30-74 min) | $199.07 | $308.96 | $299-$498 | $5,000-$20,000+ | CRITICAL |
| 99213 | Office Visit - Low | $57.45 | $95.19 | $86-$144 | $100-$250 | REASONABLE |
| 99214 | Office Visit - Moderate | $84.50 | $135.61 | $127-$211 | $150-$350 | REASONABLE |
| 99215 | Office Visit - High | $125.59 | $192.39 | $188-$314 | $200-$400 | REASONABLE |
| 99203 | New Patient - Low | $71.48 | $117.57 | $107-$179 | $150-$400 | REASONABLE |

**Analysis:**
- **Office visits (99213-99215, 99203)**: Our non-facility rates ($95-$192) are reasonably close to what consumers pay at a doctor's office ($100-$400). These are CORRECTLY represented.
- **ER visits (99281-99285)**: CRITICALLY MISLEADING. Our $11-$171 rates are the physician's professional fee only. The ER facility fee (charged separately by the hospital) ranges from $200 (Level 1) to $1,250+ (Level 5). Add labs, imaging, and other services and total ER bills average $2,715. Our rates show 2-7% of the total ER bill.
- **Critical Care (99291)**: $199 physician fee vs $5,000-$20,000+ total ICU/critical care bill.

---

## Category 2: Imaging (15 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|----------|----------------|---------------------|-----|
| 70450 | CT Head w/o contrast | $106.55 | $160-$266 | $300-$1,500 | MEDIUM |
| 70551 | MRI Brain w/o contrast | $195.40 | $293-$489 | $400-$3,500 | HIGH |
| 72148 | MRI Lumbar w/o contrast | $191.72 | $288-$479 | $400-$3,500 | HIGH |
| 72141 | MRI Cervical w/o contrast | $190.72 | $286-$477 | $400-$3,500 | HIGH |
| 73721 | MRI Knee w/o contrast | $204.41 | $307-$511 | $400-$3,500 | HIGH |
| 74178 | CT Abdomen w/ contrast | $338.02 | $507-$845 | $500-$3,500 | HIGH |
| 71260 | CT Chest w/ contrast | $166.67 | $250-$417 | $500-$3,000 | HIGH |
| 73560 | X-ray Knee | $34.40 | $52-$86 | $100-$400 | MEDIUM |
| 73030 | X-ray Shoulder | $35.74 | $54-$89 | $100-$400 | MEDIUM |
| 71045 | Chest X-ray | $25.38 | $38-$63 | $100-$400 | MEDIUM |
| 76856 | Ultrasound Pelvis | $105.21 | $158-$263 | $200-$600 | MEDIUM |
| 76700 | Ultrasound Abdomen | $114.23 | $171-$286 | $200-$600 | MEDIUM |
| 77067 | Mammogram Screening | $126.26 | $189-$316 | $150-$500 | MEDIUM |
| 70553 | MRI Brain w/wo contrast | $316.97 | $475-$792 | $500-$5,000 | HIGH |
| 72146 | MRI Thoracic w/o contrast | $190.39 | $286-$476 | $400-$3,500 | HIGH |

**Analysis:**
- Our imaging rates represent the **global professional + technical component** when performed in a non-facility (freestanding imaging center). At a hospital outpatient department, there would be an additional facility fee.
- **X-rays**: Our $25-$36 rates are the Medicare-allowed amount. Consumers pay $100-$400 commercially. Gap is moderate -- our rates are low but in the right order of magnitude.
- **MRIs**: Our $190-$317 rates are the Medicare-allowed amount. Consumer cash prices at imaging centers run $400-$1,200; hospital MRIs run $1,500-$3,500+. Our rates are 15-50% of typical consumer cost. MODERATELY MISLEADING.
- **CTs**: Our $107-$338 rates vs consumer $300-$3,500. Similar gap pattern to MRI.

---

## Category 3: Surgery (25 codes) -- THE CRITICAL GAP

| Code | Description | Our Rate | Commercial Est | Consumer Total Cost | Our Rate as % of Total | Severity |
|------|-------------|----------|----------------|--------------------|-----------------------|----------|
| 27447 | Knee Replacement | $1,159 | $1,739-$2,898 | $30,000-$50,000 | **2.3-3.9%** | CRITICAL |
| 27130 | Hip Replacement | $1,162 | $1,743-$2,905 | $30,000-$50,000 | **2.3-3.9%** | CRITICAL |
| 22612 | Lumbar Fusion | $1,468 | $2,201-$3,669 | $50,000-$150,000 | **1.0-2.9%** | CRITICAL |
| 27427 | ACL Reconstruction | $663 | $994-$1,657 | $15,000-$50,000 | **1.3-4.4%** | CRITICAL |
| 23412 | Rotator Cuff Repair | $792 | $1,187-$1,979 | $6,000-$25,000 | **3.2-13.2%** | CRITICAL |
| 63030 | Discectomy | $898 | $1,347-$2,245 | $15,000-$50,000 | **1.8-6.0%** | CRITICAL |
| 66984 | Cataract Surgery | $463 | $694-$1,157 | $3,500-$7,000/eye | **6.6-13.2%** | HIGH |
| 47562 | Lap Cholecystectomy | $632 | $948-$1,580 | $7,000-$25,000 | **2.5-9.0%** | CRITICAL |
| 44970 | Lap Appendectomy | $578 | $867-$1,445 | $7,000-$30,000 | **1.9-8.3%** | CRITICAL |
| 49505 | Hernia Repair | $508 | $762-$1,270 | $3,000-$15,000 | **3.4-16.9%** | HIGH |
| 33533 | CABG (Single) | $1,758 | $2,637-$4,395 | $70,000-$200,000 | **0.9-2.5%** | CRITICAL |
| 58661 | Lap Hysterectomy | $586 | $879-$1,465 | $12,000-$35,000 | **1.7-4.9%** | CRITICAL |
| 62322 | Epidural Injection | $74-$146 | $111-$185 | $1,000-$2,000 | **3.7-14.6%** | HIGH |
| 43239 | EGD with Biopsy | $124-$419 | $185-$309 | $1,500-$4,000 | **3.1-27.9%** | HIGH |
| 45378 | Colonoscopy Diagnostic | $165-$378 | $247-$412 | $1,250-$6,200 | **2.7-30.2%** | HIGH |
| 45380 | Colonoscopy w/ Biopsy | $178-$480 | $267-$444 | $1,500-$6,500 | **2.7-32.0%** | HIGH |
| 29881 | Knee Arthroscopy | $516 | $774-$1,289 | $5,000-$15,000 | **3.4-10.3%** | HIGH |
| 64721 | Carpal Tunnel Release | $423-$483 | $635-$1,058 | $2,000-$10,000 | **4.2-24.2%** | HIGH |
| 19301 | Partial Mastectomy | $633 | $949-$1,582 | $5,000-$20,000 | **3.2-12.7%** | CRITICAL |
| 47600 | Open Cholecystectomy | $1,010 | $1,516-$2,526 | $10,000-$30,000 | **3.4-10.1%** | CRITICAL |
| 55840 | Prostatectomy | $1,045 | $1,568-$2,613 | $15,000-$40,000 | **2.6-7.0%** | CRITICAL |
| 43280 | Lap Fundoplication | $1,012 | $1,518-$2,530 | $20,000-$55,000 | **1.8-5.1%** | CRITICAL |
| 27236 | Hip Fracture ORIF | $1,090 | $1,635-$2,725 | $15,000-$40,000 | **2.7-7.3%** | CRITICAL |
| 27814 | Ankle Fracture ORIF | $714 | $1,072-$1,786 | $10,000-$30,000 | **2.4-7.1%** | CRITICAL |
| 25605 | Wrist Fracture | $549-$635 | $824-$1,374 | $5,000-$15,000 | **3.7-12.7%** | HIGH |

**Analysis:**
This is the most critical category. Every single surgical code is severely underrepresented:

- **CABG ($1,758 shown vs $70K-$200K actual)**: Our rate is 0.9-2.5% of total cost. A consumer seeing "$1,758" for heart bypass surgery would be catastrophically misled.
- **Joint replacements ($1,159-$1,162 shown vs $30K-$50K actual)**: Our rate is ~3% of the total.
- **Spinal fusion ($1,468 shown vs $50K-$150K actual)**: Our rate is 1-3% of total.
- **Even "minor" surgeries like carpal tunnel ($423-$483 shown vs $2K-$10K actual)**: Our rate is 4-24% of total.

**What is missing from our rates:**
1. **Hospital/facility fee** (40-60% of total cost)
2. **Anesthesia fee** (5-15% of total cost)
3. **Implant/device costs** (10-30% for orthopedic procedures)
4. **Post-operative care, hospital stay**
5. **Pre-op testing, pathology**

---

## Category 4: Physical Therapy/Rehab (5 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|----------|----------------|---------------------|-----|
| 97110 | Therapeutic Exercise | $29.06 | $44-$73 | $50-$150/session | LOW |
| 97140 | Manual Therapy | $27.72 | $42-$69 | $50-$150/session | LOW |
| 97112 | Neuromuscular Re-ed | $32.73 | $49-$82 | $50-$150/session | LOW |
| 97530 | Therapeutic Activities | $35.07 | $53-$88 | $50-$150/session | LOW |
| 97161 | PT Evaluation - Low | $97.86 | $147-$245 | $100-$250 | LOW |

**Analysis:**
- PT codes are billed **per 15-minute unit**. Our rates ($27-$35/unit) are the Medicare rate per unit, and a typical session involves 3-4 units.
- 3-4 units at our rate = $83-$140, which is reasonably close to the $75-$200 consumer cash price for a full session.
- The PT evaluation (97161) at $98 is close to consumer reality ($100-$250).
- **CORRECTLY REPRESENTED** -- these are among our most accurate codes, though we should note these are per-unit prices.

---

## Category 5: Mental Health (5 codes)

| Code | Description | Our Facility Rate | Our Non-Fac Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|-------------------|-------------------|----------------|---------------------|-----|
| 90837 | Therapy 53-60 min | $135.27 | $167.00 | $203-$338 | $150-$300/session | LOW |
| 90834 | Therapy 38-52 min | $91.85 | $113.90 | $138-$230 | $100-$250/session | LOW |
| 90847 | Family Therapy | $102.87 | $109.55 | $154-$257 | $150-$300/session | LOW |
| 96116 | Neuropsych Exam | $72.15 | $94.19 | $108-$180 | $150-$350/hour | LOW-MED |
| 90791 | Psych Eval | $137.28 | $173.35 | $206-$343 | $200-$400 | LOW |

**Analysis:**
- Mental health codes are **REASONABLY REPRESENTED**. Our non-facility rates ($109-$173) track closely with what therapists charge ($100-$300).
- These are standalone professional services -- no facility fee component for most outpatient therapy.
- The commercial estimates ($138-$343) are reasonably close to actual commercial insurance allowed amounts.

---

## Category 6: Lab Tests (10 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Cash Price | Gap |
|------|-------------|----------|----------------|--------------------|----|
| 85025 | CBC | $7.77 | $12-$19 | $10-$50 | LOW |
| 80053 | CMP | $10.56 | $16-$26 | $10-$50 | LOW |
| 80061 | Lipid Panel | $13.39 | $20-$33 | $15-$50 | LOW |
| 84443 | TSH | $16.80 | $25-$42 | $20-$80 | LOW |
| 81001 | Urinalysis | $3.17 | $5-$8 | $5-$30 | LOW |
| 87086 | Urine Culture | $8.07 | $12-$20 | $10-$50 | LOW |
| 83036 | HbA1c | $9.71 | $15-$24 | $15-$60 | LOW |
| 82947 | Glucose | $3.93 | $6-$10 | $5-$30 | LOW |
| 84153 | PSA | $18.39 | $28-$46 | $20-$80 | LOW |
| 36415 | Blood Draw | $9.34 | $14-$23 | $10-$50 | LOW |

**Analysis:**
- Lab tests are **CORRECTLY REPRESENTED**. Our Medicare rates ($3-$18) are close to direct-access lab cash prices ($5-$50 at Quest/LabCorp).
- Hospital-based lab tests can be 2-6x higher due to facility fees, but our rates match what consumers pay at independent labs.
- This is our most accurate category.

---

## Category 7: Cardiac (10 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|----------|----------------|---------------------|-----|
| 93000 | EKG | $15.36 | $23-$38 | $100-$350 | MEDIUM |
| 93306 | Echocardiogram | $196.73 | $295-$492 | $500-$3,000 | HIGH |
| 93015 | Stress Test | $73.48 | $110-$184 | $200-$5,000 | HIGH |
| 93458 | Cardiac Cath + Angio | $1,010.04 | $1,515-$2,525 | $8,000-$41,000 | CRITICAL |
| 93452 | Left Heart Cath | $876.11 | $1,314-$2,190 | $8,000-$30,000 | CRITICAL |
| 92928 | Coronary Stent | $463.94 | $696-$1,160 | $11,000-$41,000 | CRITICAL |
| 93350 | Stress Echo | $185.37 | $278-$463 | $600-$4,000 | HIGH |
| 93880 | Carotid Doppler | $189.05 | $284-$473 | $300-$1,000 | MEDIUM |
| 93922 | Arterial Duplex | $83.17 | $125-$208 | $200-$800 | MEDIUM |
| 93971 | Venous Duplex | $116.24 | $174-$291 | $200-$800 | MEDIUM |

**Analysis:**
- **Simple diagnostics (EKG, vascular ultrasounds)**: Moderately underrepresented. Our $15-$189 vs consumer $100-$1,000.
- **Cardiac catheterization ($876-$1,010)**: CRITICALLY MISLEADING. Total cath lab + facility charges run $8,000-$41,000.
- **Coronary stent ($464)**: CRITICALLY MISLEADING. Total cost with hospitalization is $11,000-$41,000. Our rate is 1.1-4.2% of total.

---

## Category 8: Maternity (5 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|----------|----------------|---------------------|-----|
| 59400 | Vaginal Delivery Global | $2,214 | $3,322-$5,536 | $15,000-$25,000 | CRITICAL |
| 59510 | C-Section Global | $2,473 | $3,710-$6,183 | $20,000-$35,000 | CRITICAL |
| 76805 | OB Ultrasound | $135.94 | $204-$340 | $200-$600 | MEDIUM |
| 76815 | Limited OB Ultrasound | $81.50 | $122-$204 | $100-$400 | MEDIUM |
| 59025 | Fetal Non-Stress Test | $50.44 | $76-$126 | $100-$500 | MEDIUM |

**Analysis:**
- **Delivery codes (59400, 59510)**: These are "global" OB codes that include prenatal visits, delivery, and postpartum care for the **physician's professional services only**. Our $2,214 (vaginal) and $2,473 (C-section) represent only the OB-GYN's total professional fee.
- Missing: hospital facility charges ($8,000-$15,000), anesthesia ($1,000-$3,000), newborn care, labs, etc.
- Consumer expectation for total childbirth: $15,000-$25,000 (vaginal) and $20,000-$35,000 (C-section).
- Our rate represents **9-15%** of total vaginal delivery cost and **7-12%** of total C-section cost.

---

## Category 9: Preventive (5 codes)

| Code | Description | Our Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|----------|----------------|---------------------|-----|
| 99395 | Annual Physical (Est) | N/A | N/A | $150-$350 | NO DATA |
| 99396 | Annual Physical (Est 40-64) | N/A | N/A | $200-$400 | NO DATA |
| 90471 | Vaccine Admin | $22.04 | $33-$55 | $20-$50 admin fee | LOW |
| 96372 | Injection (IM/SC) | $15.36 | $23-$38 | $25-$100 | LOW |
| 99381 | New Patient Preventive | N/A | N/A | $200-$500 | NO DATA |

**Analysis:**
- **99395, 99396, 99381 returned no data** from our API. These are commonly used preventive visit codes -- this is a data gap we need to fill.
- Vaccine admin ($22) and injection ($15) are reasonably close to consumer costs.
- Many preventive visits are covered at 100% under ACA-compliant plans, so the consumer's actual cost is often $0.

---

## Category 10: GI/Endo (5 codes)

| Code | Description | Our Facility Rate | Our Non-Fac Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|-------------------|-------------------|----------------|---------------------|-----|
| 43235 | EGD Diagnostic | $110.56 | $322.65 | $166-$276 | $1,500-$5,000 | HIGH |
| 43253 | EGD Balloon Dilation | $230.13 | $230.13 | $345-$575 | $2,000-$6,000 | HIGH |
| 60500 | Parathyroidectomy | $891.47 | $891.47 | $1,337-$2,229 | $10,000-$25,000 | CRITICAL |
| 60240 | Total Thyroidectomy | $829.68 | $829.68 | $1,245-$2,074 | $5,500-$12,000 | HIGH |
| 76942 | US-Guided Biopsy | $64.13 | $64.13 | $96-$160 | $500-$2,000 | HIGH |

**Analysis:**
- Endoscopy procedures (EGD): Our $111-$323 physician fee vs $1,500-$5,000 total cost. Missing facility fee.
- Thyroidectomy ($830): Represents physician fee only vs $5,500-$12,000 total.
- Parathyroidectomy ($891): Physician fee only vs $10,000-$25,000 total.

---

## Category 11: Pain/Injection (5 codes)

| Code | Description | Our Facility Rate | Our Non-Fac Rate | Commercial Est | Consumer Expectation | Gap |
|------|-------------|-------------------|-------------------|----------------|---------------------|-----|
| 20610 | Large Joint Injection | $39.75 | $68.81 | $60-$99 | $200-$500 | MEDIUM |
| 20552 | Trigger Point Injection | $35.74 | $51.77 | $54-$89 | $100-$300 | MEDIUM |
| 64483 | Lumbar Nerve Block | $99.53 | $264.87 | $149-$249 | $1,000-$2,000 | HIGH |
| 64493 | Facet Joint Injection | $81.50 | $190.39 | $122-$204 | $800-$2,000 | HIGH |
| 27096 | SI Joint Injection | $73.82 | $175.69 | $111-$185 | $800-$2,000 | HIGH |

**Analysis:**
- **Office-based injections (20610, 20552)**: Our non-facility rates ($52-$69) are low but in the ballpark for the physician component. Total cost with facility: $200-$500.
- **Fluoroscopy-guided injections (64483, 64493, 27096)**: These are typically done in hospital outpatient or ASC settings. Our $74-$100 facility rates miss the $800-$1,500 facility fee that dominates the total cost.

---

## Summary Scoreboard: All 100 Codes

### Accurately Represented (28 codes) -- LOW gap
- Office visits: 99213, 99214, 99215, 99203
- PT: 97110, 97140, 97112, 97530, 97161
- Mental health: 90837, 90834, 90847, 96116, 90791
- Labs: 85025, 80053, 80061, 84443, 81001, 87086, 83036, 82947, 84153, 36415
- Preventive: 90471, 96372
- Pain (office): 20610, 20552

### Moderately Misleading (19 codes) -- MEDIUM gap
- ER visits: (listed as medium but really critical -- see below)
- Imaging: 70450, 73560, 73030, 71045, 76856, 76700, 77067
- Cardiac diagnostics: 93000, 93880, 93922, 93971
- OB ultrasounds: 76805, 76815, 59025
- Pain (guided): referenced above

### Severely Misleading (22 codes) -- HIGH gap
- Imaging (MRI/CT): 70551, 72148, 72141, 73721, 74178, 71260, 70553, 72146
- Cardiac: 93306, 93015, 93350
- Endoscopy: 43235, 43239, 43253, 45378, 45380
- Minor surgery: 64721, 29881, 25605
- Other: 76942, 60240
- Pain (guided): 64483, 64493, 27096

### Critically Misleading (28 codes) -- CRITICAL gap (our rate < 10% of total)
- ER visits: 99281, 99282, 99283, 99284, 99285, 99291
- Major surgery: 27447, 27130, 22612, 27427, 23412, 63030, 33533, 55840, 43280, 27236, 27814, 47562, 44970, 47600, 58661, 19301, 49505, 66984, 62322, 60500
- Cardiac procedures: 93458, 93452, 92928
- Maternity: 59400, 59510

### Missing Data (3 codes)
- 99395, 99396, 99381 (preventive visit codes returned no data)

---

## How Competitor Sites Handle This

### Turquoise Health
- Shows **negotiated rates by payer and hospital** from price transparency filings
- Displays BOTH professional and facility components
- Groups into "bundles" showing total expected cost
- Allows filtering by insurance plan

### MDsave
- Shows **bundled all-inclusive cash prices** that patients actually pay
- Includes surgeon + facility + anesthesia in one price
- This is the gold standard for consumer-facing pricing

### GoodRx / Healthcare Bluebook
- Shows **"fair price" ranges** that represent total cost of care
- Breaks down into "low / fair / high" ranges
- Clearly labels what is included

### Sidecar Health
- Shows **total cost by state** including all components
- Based on actual claims data

### CMS Medicare.gov Procedure Price Lookup
- Shows **hospital outpatient total cost** (facility + professional combined)
- Includes both what Medicare pays and what patient pays
- Does NOT show only the physician fee

**Key insight**: No major consumer-facing site shows only the physician professional fee the way we do. Every competitor shows total cost of care or bundled pricing.

---

## Recommendations

### Option A: Add DRG/APC Total Cost Alongside Physician Fee
**Feasibility**: Medium | **Impact**: High

For inpatient surgeries, show the Medicare DRG payment (total hospital reimbursement) alongside the physician fee. For outpatient procedures, show the APC (Ambulatory Payment Classification) rate.

Example display:
> **Knee Replacement (27447)**
> - Surgeon's fee: $1,159 (what the doctor is paid)
> - Hospital facility payment (DRG 470): ~$12,000-$15,000
> - Estimated total Medicare cost: ~$14,000-$16,000
> - Estimated commercial/cash cost: $30,000-$50,000

### Option B: Prominent "Physician Fee Only" Disclaimer
**Feasibility**: Easy | **Impact**: Low-Medium

Add a banner/callout that explains:
> "These prices represent the Medicare physician/professional fee -- what the doctor or surgeon is paid. For procedures performed in a hospital or surgery center, additional facility fees, anesthesia, and supply costs apply. Total costs may be 5-20x higher for surgical procedures."

This is the **minimum** we should do immediately.

### Option C: "Total Cost of Care" Estimates (RECOMMENDED)
**Feasibility**: Medium-High | **Impact**: Very High

Build estimated total cost ranges by combining:
1. **Physician fee** (what we already have)
2. **Facility fee** (from CMS OPPS/IPPS data or hospital price transparency files)
3. **Anesthesia fee** (base units x conversion factor for applicable procedures)
4. **Typical add-ons** (implants, pathology, etc.)

Display as a range: "Estimated total cost: $28,000 - $52,000"

This is what every successful competitor does.

### Option D: Category-Specific Presentation (STRONGLY RECOMMENDED)
**Feasibility**: Medium | **Impact**: Very High

Different procedure categories need different presentation:

| Category | Presentation Strategy |
|----------|----------------------|
| **Labs** | Show our rate as-is. It is the Medicare rate and close to consumer cash price. |
| **Office visits** | Show non-facility rate. Add note about facility-based practices. |
| **PT/Mental Health** | Show our rate as-is with per-unit note for PT. |
| **Imaging** | Show our rate + add "facility range" from hospital transparency data. |
| **Outpatient procedures** | Show physician fee + facility fee estimate + total range. |
| **Inpatient surgery** | Show total estimated cost prominently, with physician fee as a sub-component. |
| **ER visits** | Show total average ER cost by level, not just physician fee. |

### Immediate Action Items

1. **TODAY**: Add a disclaimer banner on all procedure pages: "This is the Medicare physician fee. Total costs including facility, anesthesia, and supplies may be significantly higher for hospital and surgical procedures."

2. **THIS WEEK**: Add a visual indicator (color coding or icon) showing whether a code is:
   - A standalone service (labs, office visits) -- green checkmark "Price shown is close to total cost"
   - A facility-dependent service (imaging, endoscopy) -- yellow warning "Facility fees may apply"
   - A surgical/hospital procedure -- red alert "Total cost is typically 5-20x this amount"

3. **THIS MONTH**: Integrate CMS OPPS (Outpatient Prospective Payment System) data to show facility fees for outpatient procedures. The data is publicly available.

4. **THIS QUARTER**: Build "Total Cost of Care" estimates for the top 100 most-searched procedures using a combination of:
   - Our physician fee data (already have)
   - CMS OPPS/APC rates for facility component
   - CMS anesthesia base units + conversion factor
   - Hospital price transparency data (aggregated from Turquoise Health or direct hospital filings)

5. **Fill data gaps**: Add codes 99395, 99396, 99381 to the database.

---

## Data Sources for Consumer Cost Comparisons

- [Knee Replacement Cost - FindKneeSurgeons](https://findkneesurgeons.com/blog/knee-replacement-cost/)
- [Hip Replacement Cost - GoodRx](https://www.goodrx.com/health-topic/joints/how-much-does-a-hip-replacement-cost)
- [MRI Cost 2026 - Surgery Cost Guide](https://surgerycostguide.com/mri-cost/)
- [ER Visit Cost - BetterCare](https://bettercare.com/costs/er-visit-cost)
- [Colonoscopy Cost - CostInsightHub](https://costinsighthub.com/us/health/how-much-does-a-colonoscopy-cost)
- [Cataract Surgery Cost - GoodRx](https://www.goodrx.com/health-topic/eye/cataract-surgery-cost)
- [CABG Cost - CarecostIndex](https://carecostindex.com/procedure/heart-bypass)
- [Childbirth Cost - Peterson-KFF Tracker](https://www.healthsystemtracker.org/brief/health-costs-associated-with-pregnancy-childbirth-and-postpartum-care/)
- [Cardiac Catheterization Cost - Sidecar Health](https://cost.sidecarhealth.com/c/cardiac-catheterization-cost)
- [Spinal Fusion Cost - CarecastIndex](https://carecostindex.com/procedure/spinal-fusion)
- [ACL Surgery Cost - Sidecar Health](https://cost.sidecarhealth.com/ts/acl-knee-surgery-cost-by-state)
- [Rotator Cuff Cost - Surgery Cost Guide](https://surgerycostguide.com/rotator-cuff-surgery-cost/)
- [Cholecystectomy Cost - CarecastIndex](https://carecostindex.com/procedure/gallbladder-removal)
- [Appendectomy Cost - Surgery Cost Guide](https://surgerycostguide.com/appendectomy-cost/)
- [Hernia Repair Cost - Surgery Cost Guide](https://surgerycostguide.com/hernia-surgery-cost/)
- [Physical Therapy Cost - BetterCare](https://bettercare.com/costs/physical-therapy-costs)
- [Therapy Cost - SimplePractice](https://www.simplepractice.com/blog/average-therapy-session-rate-by-state/)
- [Blood Work Cost - BetterCare](https://bettercare.com/costs/blood-work-cost)
- [CT Scan Cost - ConsumerShield](https://www.consumershield.com/insurance/health-insurance/ct-scan-cost)
- [Echocardiogram Cost - BetterCare](https://bettercare.com/costs/echocardiogram-heart-ultrasound-cost)
- [EKG Cost - BetterCare](https://bettercare.com/costs/ekg-cost)
- [Stress Test Cost - BetterCare](https://bettercare.com/costs/stress-test-cost)
- [Epidural Injection Cost - Sidecar Health](https://cost.sidecarhealth.com/ts/epidural-steroid-injection-cost-by-state)
- [Carpal Tunnel Cost - Surgery Cost Guide](https://surgerycostguide.com/carpal-tunnel-surgery-cost/)
- [Office Visit Cost - Zocdoc](https://www.zocdoc.com/blog/guides/how-much-does-a-primary-care-visit-cost-without-insurance/)
- [Turquoise Health - Patient Search](https://turquoise.health/patients)
- [MDsave - Procedure Pricing](https://www.mdsave.com/)
- [Thyroidectomy Cost - CarecastIndex](https://carecostindex.com/procedure/thyroid-surgery)
- [Prostatectomy Cost - LatestCost](https://latestcost.com/average-cost-of-prostate-surgery/)
- [Knee Arthroscopy Cost - MDsave](https://www.mdsave.com/procedures/knee-arthroscopy-with-or-without-meniscectomy/d784fec5)
- [Discectomy/Meniscus Cost - GlobalOrthopedicSolutions](https://globalorthopedicsolutions.com/meniscus-surgery-costs-without-insurance/)
