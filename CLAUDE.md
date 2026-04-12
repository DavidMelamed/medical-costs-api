# Medical Costs API

Standalone Cloudflare Workers + D1 API for medical cost estimation.

## Architecture
- **Runtime:** Cloudflare Workers (single `src/index.ts`)
- **Database:** Cloudflare D1 (SQLite) — `medical-costs-db` (ID: `f3c4c390-86ac-4ffc-a887-0198c35abdc2`)
- **Schema:** `schema.sql` (includes hospital_quality table with 5,426 CMS Hospital Compare records)
- **Seed data:** `seed.sql` (22 injury categories, 80+ procedures, geographic costs, WISQARS/NHTSA aggregates)

## Key Commands
```bash
npm run dev          # Local dev server (wrangler dev)
npm run deploy       # Deploy to Cloudflare
npm run db:init      # Create tables + seed locally
npm run db:init:remote  # Create tables + seed on remote D1
```

## Integration
This API is consumed by crashstory.com. The CrashStory web app at `/mnt/c/repos/crashstory-platform/web/lib/medical-costs-api.ts` should point its `API_BASE` at this Worker's URL.

## Data Sources
All public/free:
- CMS Medicare Physician Fee Schedule (CY 2026, conversion factor $32.35)
- CMS Geographic Practice Cost Indices (20 metro areas)
- CDC WISQARS Cost of Injury (2021 data)
- NHTSA Economic Impact of Motor Vehicle Crashes (2019 data)
- ICD-10-CM injury codes (S00-T88, V00-Y99)
- CPT procedure codes for common injury treatments
- CMS Hospital Compare (5,426 hospitals, 2,866 with star ratings 1-5, mortality/safety/readmission measures)

## Database Column Convention
- DB uses snake_case (SQLite)
- API responses use camelCase (JSON transformation in queries)
