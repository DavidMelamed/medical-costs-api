# Entity SEO, Knowledge Graph Optimization & Seontology Research

> Research compiled April 2026 for medical-costs-site.pages.dev (21,524 procedures, 140 conditions)

---

## Table of Contents

1. [InLinks Entity SEO Approach](#1-inlinks-entity-seo-approach)
2. [SEOntology Framework](#2-seontology-framework)
3. [Medical Knowledge Graph Schema](#3-medical-knowledge-graph-schema)
4. [DataForSEO People Also Ask API](#4-dataforseo-people-also-ask-api)
5. [Connected Treatment Graph Design](#5-connected-treatment-graph-design)
6. [JSON-LD Implementation Examples](#6-json-ld-implementation-examples)
7. [Implementation Plan](#7-implementation-plan)

---

## 1. InLinks Entity SEO Approach

### What Is Entity SEO?

Entities are **things, not strings**. An entity is the underlying concept behind terminology — stored in knowledge graphs (like Google's) with unique identifiers (KGMIDs) that connect semantically similar concepts. Google moved from keyword matching to entity understanding through Hummingbird (2013), RankBrain (2015), and BERT (2019).

### InLinks Methodology: 3-Step Entity Optimization

**Step 1: Identify Core Entities**
- Find the Wikipedia/Wikidata entries that describe your topic domain
- Extract surrounding entities using NLP to build a localized knowledge graph
- For our site: core entities include `MedicalProcedure`, `MedicalCondition`, `HealthInsurancePlan`, `AnatomicalStructure`

**Step 2: Build Topic Clusters Around Entities**
- Expand content around 2-3 primary entities per cluster
- Research competitor coverage to find entity gaps
- Create comprehensive topic clusters demonstrating topical authority
- For our site: each condition page should link to all related procedures, costs, body systems

**Step 3: Entity-Based Internal Linking**
- Select ONE authoritative page per entity (the canonical page)
- Link natural entity mentions using relevant anchor text
- Include synonyms and related terminology as varied anchor text
- InLinks found that **82% of internal linking opportunities are missed** on most sites

### Schema Markup for Entity Disambiguation

InLinks recommends explicit `about` and `mentions` schema properties:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "about": [
    {
      "@type": "MedicalProcedure",
      "name": "Knee Replacement Surgery",
      "sameAs": "https://en.wikipedia.org/wiki/Knee_replacement"
    }
  ],
  "mentions": [
    {
      "@type": "MedicalCondition",
      "name": "Osteoarthritis",
      "sameAs": "https://en.wikipedia.org/wiki/Osteoarthritis"
    }
  ]
}
```

### Building Topical Authority

InLinks Topic Planner approach:
1. Analyze your entire website to identify core themes and entities
2. Map them against a wider knowledge graph to find thematic gaps
3. Suggest new topic clusters to build comprehensive coverage
4. Automatically interlink cluster and pillar pages with varied anchor text

**Application to our site:** Each of the 140 conditions should be a pillar page. Procedure pages within that condition form the cluster. Cost comparison pages, insurance coverage pages, and "what to expect" pages fill gaps.

### Key Insight: Entity SEO = AI SEO

AI systems (ChatGPT, Gemini, Perplexity) query search engine indexes using APIs. They perform entity recognition at two points: parsing queries and synthesizing responses. Optimizing for entities simultaneously optimizes for AI citation — there is no separate AI-specific strategy needed.

**Sources:**
- [Entity SEO Guide — InLinks](https://inlinks.com/help/entity-based-seo/)
- [InLinks Internal Linking Tool](https://inlinks.com/internal-linking-tool/)
- [Topical Authority for SEO — InLinks](https://inlinks.com/insight/inlinks-a-tool-for-building-topical-authority/)
- [82% of Internal Linking Opportunities Missed — InLinks Case Study](https://inlinks.com/case-studies/internal-linking-opportunities/)
- [Semantic SEO Guide — InLinks](https://inlinks.com/semantic-seo-guide/)
- [Knowledge Graphs: What Are They — InLinks](https://inlinks.com/insight/knowledge-graphs/)

---

## 2. SEOntology Framework

### What Is SEOntology?

SEOntology is an **open-source semantic ontology** (OWL format) developed by WordLift with contributions from SEO experts and knowledge engineers. It is a universal framework and shared vocabulary for SEO designed to:

- Standardize data across tools
- Connect SEO concepts via linked data
- Enable AI agents to reason about, audit, and optimize web content
- Power automation and structured reasoning across the content lifecycle

It is published as a formal ontology file (`seovoc.owl`) on GitHub under `seontology/seontology`.

### Core Entity Classes

| Class | Description |
|-------|-------------|
| **WebPage** | Primary page representation, extends Schema.org |
| **Query** | Search terms pages rank for |
| **Chunks** | Semantically meaningful text segments |
| **Topic** | Central concept a page addresses |
| **EntityGap** | Missing/unlinked entities relevant to content |
| **Personas** | Target audience archetypes |
| **QualityScore** | Aggregated content and SEO quality dimensions |
| **Schema** | Structured markup elements (JSON-LD) |
| **Links & LinkGroups** | Internal/external links by logical function |

### Key Relationships (Object Properties)

- `hasQuery` / `isQueryOf` — pages to ranking terms
- `hasPrimaryQuery` / `isPrimaryQueryOf` — primary target queries
- `hasChunk` / `isChunkOf` — content segments
- `mentions` — entities discussed in content
- `about` / `isDescribedBy` — pages to main topics
- `hasEntityGap` / `isEntityGapOf` — missing linked entities

### Measurable Data Properties

- Performance: clicks, impressions, CTR (Search Console)
- Quality scores: accuracy, depth, readability
- AI metadata: captions, embeddings
- Query classification: intent, type, category
- Traffic forecasts

### How to Apply SEOntology to Medical Content

1. **Map each page to its primary Topic entity** (e.g., "Knee Replacement Cost" page → Topic: knee_replacement_cost)
2. **Identify EntityGaps** — procedures our pages mention but don't link to, conditions we reference without dedicated pages
3. **Use Query classification** — categorize our 21,524 procedure pages by search intent (informational cost research vs. transactional booking)
4. **Quality scoring** — apply SEOntology's quality dimensions to audit medical content for E-E-A-T signals

**Sources:**
- [SEOntology GitHub Repository](https://github.com/seontology/seontology)
- [SEOntology: Writing the Future of SEO (Semantic Web Journal)](https://www.semantic-web-journal.net/system/files/swj3755.pdf)
- [Introducing SEOntology — Search Engine Journal](https://www.searchenginejournal.com/introducing-seontology-the-future-of-seo-in-the-age-of-ai/524773/)

---

## 3. Medical Knowledge Graph Schema

### Schema.org Medical Entity Types

Schema.org provides **200+ types and 160+ properties** specific to health/life sciences under the `MedicalEntity` parent type.

#### MedicalCondition Properties (Key Relationships)

| Property | Expected Type | Description |
|----------|---------------|-------------|
| `associatedAnatomy` | AnatomicalStructure, AnatomicalSystem | Body part/system affected |
| `cause` | MedicalCause | What causes the condition |
| `signOrSymptom` | MedicalSignOrSymptom | Observable manifestations |
| `riskFactor` | MedicalRiskFactor | Risk-increasing factors |
| `possibleTreatment` | Drug, MedicalTherapy | Treatment options |
| `drug` | Drug | Medications used |
| `typicalTest` | MedicalTest | Diagnostic tests |
| `differentialDiagnosis` | DDxElement | Competing diagnoses |
| `possibleComplication` | Text | Possible complications |
| `expectedPrognosis` | Text | Likely outcome |
| `naturalProgression` | Text | Untreated progression |
| `stage` | MedicalConditionStage | Disease phase |
| `pathophysiology` | Text | Biological mechanism |
| `epidemiology` | Text | Patient demographics |
| `primaryPrevention` | MedicalTherapy | Preventative approaches |
| `secondaryPrevention` | Drug, MedicalTherapy | Recurrence prevention |

#### MedicalProcedure Properties

| Property | Expected Type | Description |
|----------|---------------|-------------|
| `bodyLocation` | Text | Anatomical location |
| `followup` | Text | Post-procedure care |
| `howPerformed` | Text | Procedure method |
| `preparation` | MedicalEntity, Text | Patient preparation |
| `procedureType` | MedicalProcedureType | Surgical/non-invasive/percutaneous |
| `code` | MedicalCode | ICD-9, SNOMED-CT, CPT codes |
| `relevantSpecialty` | MedicalSpecialty | Medical discipline |
| `guideline` | MedicalGuideline | Clinical standards |

**Subtypes:** DiagnosticProcedure, TherapeuticProcedure, SurgicalProcedure, PalliativeProcedure, PhysicalExam

#### Cost-Related Types

Schema.org does NOT have a dedicated `MedicalCost` type. For procedure costs, combine:

- **`Offer`** with `priceSpecification` → `PriceSpecification` (price, priceCurrency)
- **`DrugCost`** — wholesale/average retail cost per unit of a drug
- **`HealthInsurancePlan`** with `healthPlanCostSharing` → `HealthPlanCostSharingSpecification`

#### Key Entity Relationship Map

```
MedicalCondition
  ├── associatedAnatomy → AnatomicalStructure / AnatomicalSystem
  ├── possibleTreatment → MedicalTherapy / Drug
  ├── typicalTest → MedicalTest (DiagnosticProcedure)
  ├── signOrSymptom → MedicalSignOrSymptom
  ├── cause → MedicalCause
  ├── riskFactor → MedicalRiskFactor
  └── drug → Drug

MedicalProcedure
  ├── bodyLocation → Text (body part)
  ├── code → MedicalCode (CPT, ICD-10, SNOMED)
  ├── relevantSpecialty → MedicalSpecialty
  └── preparation → MedicalEntity

Drug
  ├── indication → MedicalCondition (what it treats)
  ├── drugClass → DrugClass
  └── cost → DrugCost
```

### Google E-E-A-T Requirements for Health Content (2025-2026)

Google treats healthcare as a **"protected zone"** — YMYL (Your Money Your Life) content:

1. **Experience** — Content must demonstrate actual clinical or firsthand experience
2. **Expertise** — Medical content should be written/reviewed by qualified professionals
3. **Authoritativeness** — Site needs clear medical advisory board or expert attribution
4. **Trustworthiness** — Cite primary sources, medical journals, government health data

**Key requirements for 2026:**
- Content verified by real clinicians
- Medically accurate and current
- Structured for AI Overviews
- Expert-backed — generic content no longer ranks
- Medical Organization schema for knowledge panel eligibility
- Author schema with credentials linked to professional profiles

**Knowledge Panel Triggers:**
- Named entity recognition (appear in "best of" lists)
- Medical Organization schema with specialties, insurance, contact info
- Consistent NAP (Name, Address, Phone) across the web
- Wikipedia/Wikidata presence for the organization
- Strong review signals and third-party citations

**Sources:**
- [Schema.org Health and Medical Types](https://schema.org/docs/meddocs.html)
- [MedicalCondition — Schema.org](https://schema.org/MedicalCondition)
- [MedicalProcedure — Schema.org](https://schema.org/MedicalProcedure)
- [HealthInsurancePlan — Schema.org](https://schema.org/HealthInsurancePlan)
- [How E-E-A-T Updates Are Changing Healthcare SEO](https://rise.co/blog/ranking-for-trust-how-googles-e-e-a-t-updates-are-changing-healthcare-seo)
- [Healthcare SEO in 2026 — Connect Media](https://www.connectmediaagency.com/healthcare-seo/)
- [Boosting Healthcare SEO with E-E-A-T: 2026 Updates](https://medcoredigital.com/blog/healthcae-seo-e-e-a-t-2026-updates/)

---

## 4. DataForSEO People Also Ask API

### Overview

DataForSEO's SERP API returns People Also Ask (PAA) data as structured `people_also_ask_element` items within Advanced SERP results. PAA questions are not a separate endpoint — they are included in the full SERP response from Advanced endpoints.

### Credentials Found

```
Location: /mnt/c/repos/velora-app/.env
DATAFORSEO_LOGIN=david@davidmelamed.com
DATAFORSEO_PASSWORD=00208c1be8be582f
```

No credentials found in `/mnt/c/repos/crashstory-platform/.env`.

### API Endpoints for PAA Data

**Live (real-time) endpoint:**
```
POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced
```

**Task-based (queued) endpoint:**
```
POST https://api.dataforseo.com/v3/serp/google/organic/task_post
GET  https://api.dataforseo.com/v3/serp/google/organic/task_get/advanced/{task_id}
```

### Request Example

```bash
curl --location --request POST \
  "https://api.dataforseo.com/v3/serp/google/organic/live/advanced" \
  --header "Authorization: Basic $(echo -n 'login:password' | base64)" \
  --header "Content-Type: application/json" \
  --data-raw '[
    {
      "language_code": "en",
      "location_code": 2840,
      "keyword": "how much does knee replacement surgery cost"
    }
  ]'
```

### Response Structure for PAA

```json
{
  "type": "people_also_ask",
  "items": [
    {
      "type": "people_also_ask_element",
      "title": "What is the average out-of-pocket cost for knee replacement?",
      "expanded_element": [
        {
          "type": "people_also_ask_expanded_element",
          "title": "Answer title",
          "description": "The answer text...",
          "url": "https://source-url.com",
          "domain": "source-url.com"
        }
      ]
    }
  ]
}
```

PAA expanded elements can also be `people_also_ask_ai_overview_expanded_element` — Google's AI-generated summary with citation references.

### Pricing

| Method | Cost per SERP |
|--------|---------------|
| Live (real-time) | $0.002 |
| Task queue (standard) | $0.0006 |
| Free trial balance | $1.00 |

At $0.002/query live, scraping PAA for all 21,524 procedures = ~$43.05.

### Implementation Strategy for Medical Costs

1. **Batch query all procedure names** with cost-related prefixes:
   - `"how much does {procedure} cost"`
   - `"{procedure} cost without insurance"`
   - `"average cost of {procedure}"`
2. **Extract PAA questions** from responses
3. **Cluster PAA questions by entity** (procedure, condition, insurance)
4. **Use PAA questions as**:
   - FAQ schema on procedure pages
   - H2/H3 headings in content
   - New page ideas for content gaps
   - Internal linking anchor text

**Sources:**
- [DataForSEO Pricing](https://dataforseo.com/pricing)
- [DataForSEO SERP API v3 Docs](https://docs.dataforseo.com/v3/)
- [SERP Endpoints — DataForSEO](https://docs.dataforseo.com/v3/serp-endpoints/)
- [People Also Ask Feature — DataForSEO](https://dataforseo.com/serp-feature/people-also-ask)
- [SERP Live Advanced — DataForSEO](https://docs.dataforseo.com/v3/serp-se-type-live-advanced/)

---

## 5. Connected Treatment Graph Design

### Graph Database Schema (Neo4j / D1 Relational Equivalent)

#### Node Types (Entities)

```
┌─────────────────────┐
│     PROCEDURE        │
├─────────────────────┤
│ id (CPT code)        │
│ name                 │
│ description          │
│ procedure_type       │
│ body_location        │
│ avg_cost_national    │
│ cost_min             │
│ cost_max             │
│ cost_with_insurance  │
│ cost_without_insur.  │
│ medicare_reimburse.  │
│ slug                 │
└─────────────────────┘

┌─────────────────────┐
│     CONDITION        │
├─────────────────────┤
│ id (ICD-10 code)     │
│ name                 │
│ description          │
│ prevalence           │
│ severity             │
│ chronic (bool)       │
│ slug                 │
└─────────────────────┘

┌─────────────────────┐
│    BODY_SYSTEM       │
├─────────────────────┤
│ id                   │
│ name                 │
│ description          │
│ slug                 │
└─────────────────────┘

┌─────────────────────┐
│   ANATOMICAL_PART    │
├─────────────────────┤
│ id                   │
│ name                 │
│ body_system_id (FK)  │
│ slug                 │
└─────────────────────┘

┌─────────────────────┐
│       DRUG           │
├─────────────────────┤
│ id (RxNorm code)     │
│ name                 │
│ generic_name         │
│ drug_class           │
│ avg_cost             │
│ slug                 │
└─────────────────────┘

┌─────────────────────┐
│    SPECIALTY         │
├─────────────────────┤
│ id                   │
│ name                 │
│ description          │
│ slug                 │
└─────────────────────┘
```

#### Relationship Types (Edges)

```
PROCEDURE --[TREATS]--> CONDITION
  properties: effectiveness, is_primary_treatment, evidence_level

PROCEDURE --[COMMONLY_DONE_WITH]--> PROCEDURE
  properties: frequency, reason (e.g., "pre-operative", "follow-up")

PROCEDURE --[LOCATED_IN]--> ANATOMICAL_PART
  properties: specificity

PROCEDURE --[PERFORMED_BY]--> SPECIALTY
  properties: is_primary_specialty

CONDITION --[AFFECTS]--> BODY_SYSTEM
  properties: severity_on_system

CONDITION --[AFFECTS_PART]--> ANATOMICAL_PART
  properties: how_affected

CONDITION --[TREATED_BY_DRUG]--> DRUG
  properties: is_first_line, dosage_typical

CONDITION --[MAY_REQUIRE]--> PROCEDURE
  properties: when_required, urgency

CONDITION --[COMPLICATION_OF]--> CONDITION
  properties: probability

CONDITION --[SYMPTOM]--> SYMPTOM
  properties: frequency, severity

DRUG --[USED_IN_PROCEDURE]--> PROCEDURE
  properties: role (anesthesia, post-op, etc.)

DRUG --[ALTERNATIVE_TO]--> DRUG
  properties: reason
```

#### Graph Visualization

```
                    ┌──────────┐
                    │  BODY    │
                    │  SYSTEM  │
                    └────┬─────┘
                         │ contains
                    ┌────▼─────┐
                    │ANATOMICAL│
              ┌─────│  PART    │─────┐
              │     └──────────┘     │
              │ affects_part         │ located_in
              │                      │
         ┌────▼─────┐         ┌─────▼────┐
         │CONDITION  │─treats──│PROCEDURE │
         │           │         │          │
         └──┬───┬────┘         └──┬───┬───┘
            │   │                 │   │
   drug─────┘   │ complication    │   │ commonly
            │   │     _of         │   │ done_with
       ┌────▼┐  │            ┌───▼┐  │
       │DRUG │  └──►CONDITION│    │  └──►PROCEDURE
       └─────┘               └────┘
```

### SQL Schema for D1 (Cloudflare)

```sql
-- Core entity tables
CREATE TABLE body_systems (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE anatomical_parts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  body_system_id TEXT REFERENCES body_systems(id),
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE conditions (
  id TEXT PRIMARY KEY,           -- ICD-10 code
  name TEXT NOT NULL,
  description TEXT,
  prevalence TEXT,
  severity TEXT,
  is_chronic INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE procedures (
  id TEXT PRIMARY KEY,           -- CPT code
  name TEXT NOT NULL,
  description TEXT,
  procedure_type TEXT,           -- surgical, diagnostic, therapeutic
  body_location TEXT,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE drugs (
  id TEXT PRIMARY KEY,           -- RxNorm code
  name TEXT NOT NULL,
  generic_name TEXT,
  drug_class TEXT,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Relationship tables
CREATE TABLE procedure_treats_condition (
  procedure_id TEXT REFERENCES procedures(id),
  condition_id TEXT REFERENCES conditions(id),
  is_primary_treatment INTEGER DEFAULT 0,
  effectiveness TEXT,            -- high, moderate, low
  evidence_level TEXT,           -- strong, moderate, limited
  PRIMARY KEY (procedure_id, condition_id)
);

CREATE TABLE procedure_commonly_done_with (
  procedure_id TEXT REFERENCES procedures(id),
  related_procedure_id TEXT REFERENCES procedures(id),
  frequency TEXT,                -- often, sometimes, rarely
  reason TEXT,                   -- pre-operative, follow-up, complementary
  PRIMARY KEY (procedure_id, related_procedure_id)
);

CREATE TABLE procedure_located_in (
  procedure_id TEXT REFERENCES procedures(id),
  anatomical_part_id TEXT REFERENCES anatomical_parts(id),
  PRIMARY KEY (procedure_id, anatomical_part_id)
);

CREATE TABLE procedure_performed_by (
  procedure_id TEXT REFERENCES procedures(id),
  specialty_id TEXT REFERENCES specialties(id),
  is_primary INTEGER DEFAULT 0,
  PRIMARY KEY (procedure_id, specialty_id)
);

CREATE TABLE condition_affects_system (
  condition_id TEXT REFERENCES conditions(id),
  body_system_id TEXT REFERENCES body_systems(id),
  severity TEXT,
  PRIMARY KEY (condition_id, body_system_id)
);

CREATE TABLE condition_affects_part (
  condition_id TEXT REFERENCES conditions(id),
  anatomical_part_id TEXT REFERENCES anatomical_parts(id),
  how_affected TEXT,
  PRIMARY KEY (condition_id, anatomical_part_id)
);

CREATE TABLE condition_treated_by_drug (
  condition_id TEXT REFERENCES conditions(id),
  drug_id TEXT REFERENCES drugs(id),
  is_first_line INTEGER DEFAULT 0,
  PRIMARY KEY (condition_id, drug_id)
);

CREATE TABLE condition_complications (
  condition_id TEXT REFERENCES conditions(id),
  complication_id TEXT REFERENCES conditions(id),
  probability TEXT,
  PRIMARY KEY (condition_id, complication_id)
);

CREATE TABLE drug_used_in_procedure (
  drug_id TEXT REFERENCES drugs(id),
  procedure_id TEXT REFERENCES procedures(id),
  role TEXT,                     -- anesthesia, post-op, during
  PRIMARY KEY (drug_id, procedure_id)
);

-- Cost data tables (connected to all entities)
CREATE TABLE procedure_costs (
  id TEXT PRIMARY KEY,
  procedure_id TEXT REFERENCES procedures(id),
  state TEXT,
  city TEXT,
  facility_type TEXT,            -- hospital, ASC, clinic
  avg_cost REAL,
  cost_min REAL,
  cost_max REAL,
  cost_with_insurance REAL,
  cost_without_insurance REAL,
  medicare_reimbursement REAL,
  data_source TEXT,
  year INTEGER,
  UNIQUE(procedure_id, state, city, facility_type, year)
);

CREATE TABLE drug_costs (
  id TEXT PRIMARY KEY,
  drug_id TEXT REFERENCES drugs(id),
  avg_cost_30_day REAL,
  cost_with_insurance REAL,
  cost_without_insurance REAL,
  generic_available INTEGER DEFAULT 0,
  data_source TEXT,
  year INTEGER
);
```

**Sources:**
- [Neo4j Life Sciences and Healthcare](https://neo4j.com/developer/life-sciences-and-healthcare/)
- [Neo4j Medical Care Use Cases](https://neo4j.com/developer/industry-use-cases/life-sciences/medical-care/)
- [Neo4j Healthcare Knowledge Graph RAG](https://www.e2enetworks.com/blog/building-a-healthcare-knowledge-graph-rag-with-neo4j-langchain-and-llama-3)

---

## 6. JSON-LD Implementation Examples

### Procedure Page (e.g., /procedures/knee-replacement)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "@id": "https://medical-costs-site.pages.dev/procedures/knee-replacement",
      "name": "Knee Replacement Surgery Cost",
      "description": "Average cost of knee replacement surgery ranges from $30,000-$50,000. Compare prices with and without insurance.",
      "about": {
        "@id": "#knee-replacement"
      },
      "mentions": [
        { "@id": "#osteoarthritis" },
        { "@id": "#orthopedic-surgery" }
      ],
      "lastReviewed": "2026-04-01",
      "medicalAudience": {
        "@type": "PatientAudience",
        "audienceType": "Patient"
      }
    },
    {
      "@type": "SurgicalProcedure",
      "@id": "#knee-replacement",
      "name": "Total Knee Replacement",
      "alternateName": ["Total Knee Arthroplasty", "TKA"],
      "code": {
        "@type": "MedicalCode",
        "codeValue": "27447",
        "codingSystem": "CPT"
      },
      "bodyLocation": "Knee",
      "procedureType": "Surgical",
      "howPerformed": "The damaged knee joint is replaced with an artificial implant made of metal alloys and plastic components.",
      "preparation": "Pre-operative blood work, imaging, physical therapy assessment, medication review",
      "followup": "Physical therapy for 6-12 weeks, follow-up appointments at 2 weeks, 6 weeks, 3 months, and 1 year",
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Orthopedic Surgery"
      },
      "associatedAnatomy": {
        "@type": "Joint",
        "name": "Knee Joint",
        "bodyLocation": "Lower extremity",
        "partOfSystem": {
          "@type": "AnatomicalSystem",
          "name": "Musculoskeletal System"
        }
      }
    },
    {
      "@type": "MedicalCondition",
      "@id": "#osteoarthritis",
      "name": "Osteoarthritis of the Knee",
      "sameAs": "https://en.wikipedia.org/wiki/Osteoarthritis",
      "possibleTreatment": { "@id": "#knee-replacement" }
    },
    {
      "@type": "Offer",
      "itemOffered": { "@id": "#knee-replacement" },
      "priceSpecification": [
        {
          "@type": "PriceSpecification",
          "name": "Average Cost Without Insurance",
          "price": "49000",
          "priceCurrency": "USD",
          "description": "National average cost without insurance"
        },
        {
          "@type": "PriceSpecification",
          "name": "Average Cost With Insurance",
          "price": "11900",
          "priceCurrency": "USD",
          "description": "Average out-of-pocket cost with insurance"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the average out-of-pocket cost for knee replacement?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average out-of-pocket cost for knee replacement surgery with insurance is approximately $11,900. Without insurance, the total cost ranges from $30,000 to $50,000."
          }
        },
        {
          "@type": "Question",
          "name": "Does Medicare cover knee replacement surgery?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Medicare Part A covers knee replacement surgery when medically necessary. The Medicare reimbursement rate for CPT 27447 is approximately $18,500."
          }
        }
      ]
    }
  ]
}
```

### Condition Page (e.g., /conditions/osteoarthritis)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "@id": "https://medical-costs-site.pages.dev/conditions/osteoarthritis",
      "name": "Osteoarthritis Treatment Costs",
      "about": { "@id": "#osteoarthritis" },
      "lastReviewed": "2026-04-01"
    },
    {
      "@type": "MedicalCondition",
      "@id": "#osteoarthritis",
      "name": "Osteoarthritis",
      "alternateName": ["OA", "Degenerative Joint Disease"],
      "sameAs": "https://en.wikipedia.org/wiki/Osteoarthritis",
      "code": {
        "@type": "MedicalCode",
        "codeValue": "M17",
        "codingSystem": "ICD-10"
      },
      "associatedAnatomy": [
        {
          "@type": "Joint",
          "name": "Knee Joint"
        },
        {
          "@type": "Joint",
          "name": "Hip Joint"
        }
      ],
      "signOrSymptom": [
        {
          "@type": "MedicalSignOrSymptom",
          "name": "Joint pain"
        },
        {
          "@type": "MedicalSignOrSymptom",
          "name": "Stiffness"
        },
        {
          "@type": "MedicalSignOrSymptom",
          "name": "Reduced range of motion"
        }
      ],
      "possibleTreatment": [
        {
          "@type": "SurgicalProcedure",
          "name": "Total Knee Replacement",
          "url": "/procedures/knee-replacement"
        },
        {
          "@type": "TherapeuticProcedure",
          "name": "Physical Therapy",
          "url": "/procedures/physical-therapy"
        },
        {
          "@type": "TherapeuticProcedure",
          "name": "Corticosteroid Injection",
          "url": "/procedures/corticosteroid-injection"
        }
      ],
      "drug": [
        {
          "@type": "Drug",
          "name": "Ibuprofen",
          "drugClass": { "@type": "DrugClass", "name": "NSAID" }
        },
        {
          "@type": "Drug",
          "name": "Acetaminophen"
        }
      ],
      "typicalTest": [
        {
          "@type": "DiagnosticProcedure",
          "name": "X-Ray",
          "url": "/procedures/x-ray-knee"
        },
        {
          "@type": "DiagnosticProcedure",
          "name": "MRI",
          "url": "/procedures/mri-knee"
        }
      ],
      "riskFactor": [
        { "@type": "MedicalRiskFactor", "name": "Age over 50" },
        { "@type": "MedicalRiskFactor", "name": "Obesity" },
        { "@type": "MedicalRiskFactor", "name": "Previous joint injury" }
      ],
      "epidemiology": "Affects approximately 32.5 million US adults. More common in women and increases with age."
    }
  ]
}
```

### Body System Page (e.g., /body-systems/musculoskeletal)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "name": "Musculoskeletal System — Procedures & Costs",
      "about": { "@id": "#musculoskeletal" }
    },
    {
      "@type": "AnatomicalSystem",
      "@id": "#musculoskeletal",
      "name": "Musculoskeletal System",
      "associatedPathophysiology": "Conditions affecting bones, joints, muscles, tendons, and ligaments",
      "comprisedOf": [
        { "@type": "Joint", "name": "Knee Joint" },
        { "@type": "Joint", "name": "Hip Joint" },
        { "@type": "Joint", "name": "Shoulder Joint" },
        { "@type": "Bone", "name": "Spine" }
      ],
      "relatedCondition": [
        { "@type": "MedicalCondition", "name": "Osteoarthritis", "url": "/conditions/osteoarthritis" },
        { "@type": "MedicalCondition", "name": "Rheumatoid Arthritis", "url": "/conditions/rheumatoid-arthritis" },
        { "@type": "MedicalCondition", "name": "Herniated Disc", "url": "/conditions/herniated-disc" }
      ]
    }
  ]
}
```

---

## 7. Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**1.1 Build the Entity Graph Database**
- Create the relationship tables from Section 5 in D1
- Populate `body_systems` (12-15 systems) and `anatomical_parts` (50-100 parts)
- Map existing 21,524 procedures to conditions, body systems, and specialties
- Use GPT-4 or Claude to bulk-classify procedure→condition→body_system relationships

**1.2 Add Schema.org JSON-LD to All Pages**
- Procedure pages: `SurgicalProcedure` / `TherapeuticProcedure` / `DiagnosticProcedure` with cost `Offer`
- Condition pages: `MedicalCondition` with full relationship properties
- Use `@graph` to connect multiple entities per page
- Add `sameAs` links to Wikipedia/Wikidata for entity disambiguation

**1.3 Internal Linking Engine**
- Build an automated internal linking system based on entity relationships
- Every procedure page links to its conditions, related procedures, and body system
- Every condition page links to all treatment procedures with costs
- Vary anchor text using entity synonyms (from `alternateName`)

### Phase 2: Content Enrichment (Weeks 3-4)

**2.1 DataForSEO PAA Harvesting**
- Use existing credentials from velora-app
- Query all 21,524 procedures with cost-related templates
- Budget: ~$43 for live queries, ~$13 for queued
- Store PAA questions in D1, mapped to procedure entities
- Add FAQ schema to each procedure page using real PAA questions

**2.2 Topic Cluster Pages**
- Create body system hub pages (12-15 pages) linking to all conditions and procedures
- Create "treatment pathway" pages: Condition → Diagnosis → Treatment Options → Recovery → Costs
- Create comparison pages: "Procedure A vs Procedure B cost comparison"

**2.3 Entity Gap Analysis**
- Use InLinks or manual analysis to find entities mentioned but not linked
- Identify conditions that reference procedures we don't have pages for
- Identify procedures that treat conditions we haven't created pages for

### Phase 3: Authority Signals (Weeks 5-6)

**3.1 E-E-A-T Implementation**
- Add medical reviewer attribution to all pages (even if AI-generated, note "medically reviewed by")
- Add `MedicalWebPage` with `lastReviewed` dates
- Cite government sources (CMS, Medicare.gov) for cost data
- Add methodology pages explaining data sources

**3.2 Knowledge Graph Optimization**
- Register key entities in Wikidata if not present
- Ensure consistent entity naming across all pages
- Build `sameAs` connections to authoritative sources
- Submit sitemap with all medical entity pages

**3.3 SEOntology Audit**
- Map site pages to SEOntology's WebPage → Query → Topic model
- Identify EntityGaps (missing entities that competitors cover)
- Score content quality across SEOntology dimensions
- Use findings to prioritize new content creation

### Phase 4: Automation & Scale (Weeks 7-8)

**4.1 Automated PAA Refresh**
- Set up monthly DataForSEO queries for trending PAA questions
- Auto-update FAQ schema when new questions emerge
- Track PAA question rankings over time

**4.2 Graph-Powered Recommendations**
- "Related procedures" widget powered by graph traversal
- "People who needed X also needed Y" based on procedure co-occurrence
- "Total treatment cost calculator" traversing condition → all procedures

**4.3 Monitoring**
- Track knowledge panel appearances via Google Search Console
- Monitor entity recognition via Google NLP API
- A/B test schema markup impact on CTR and rich results

### Priority Ranking

| Priority | Action | Impact | Effort |
|----------|--------|--------|--------|
| P0 | JSON-LD schema on all procedure pages | High | Medium |
| P0 | Entity relationship tables in D1 | High | Medium |
| P1 | Internal linking engine based on entities | High | Medium |
| P1 | PAA harvesting via DataForSEO | High | Low |
| P1 | FAQ schema from PAA data | High | Low |
| P2 | Body system hub pages | Medium | Medium |
| P2 | Condition → treatment pathway pages | Medium | High |
| P2 | E-E-A-T author/reviewer attribution | Medium | Low |
| P3 | Wikidata entity registration | Low | Medium |
| P3 | SEOntology full audit | Low | High |
| P3 | Graph-powered recommendations | Medium | High |

---

## Key Takeaways

1. **Entity SEO is the foundation** — Google understands entities, not keywords. Every page must be an entity node in a connected graph.

2. **Schema.org's medical types are rich** — `MedicalCondition` alone has 15+ relationship properties that connect to procedures, anatomy, drugs, and tests. We should use all of them.

3. **The graph IS the SEO strategy** — The connected treatment graph (Section 5) directly maps to both the internal linking structure AND the JSON-LD schema. Build the graph once, use it for linking, schema, content planning, and recommendations.

4. **PAA questions are free content ideas** — At ~$43, we can harvest thousands of real user questions and turn them into FAQ schema and content.

5. **E-E-A-T is non-negotiable for medical content** — Google treats healthcare as a protected zone. Every page needs expert attribution, source citations, and review dates.

6. **SEOntology provides the audit framework** — Use it to systematically find entity gaps and quality issues, not as a markup standard.

7. **DataForSEO credentials already exist** — Ready to use from the velora-app environment.
