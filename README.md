# Medical Costs API

Standalone medical cost estimation API powered by Cloudflare Workers + D1 (SQLite).

Data sources:
- CMS Medicare Physician Fee Schedule (CY 2026)
- CMS Geographic Practice Cost Indices (GPCIs)
- CDC WISQARS Cost of Injury
- NHTSA Economic and Societal Impact of Motor Vehicle Crashes

## Setup

```bash
npm install

# Create the D1 database (first time only)
wrangler d1 create medical-costs-db
# Copy the database_id into wrangler.jsonc

# Initialize local database
npm run db:init

# Start dev server
npm run dev
```

## Deploy

```bash
# Initialize remote database
npm run db:init:remote

# Deploy worker
npm run deploy
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check + endpoint list |
| GET | `/api/procedures` | Search/list procedures |
| GET | `/api/procedures/:code` | Procedure detail with costs |
| GET | `/api/injuries` | List injury categories |
| GET | `/api/injuries/:slug` | Injury detail with treatment breakdown |
| GET | `/api/injuries/:slug/estimate` | Cost estimate by severity + state |
| GET | `/api/crash-estimate` | Crash severity-based cost estimation |
| GET | `/api/compare` | Multi-state cost comparison |
| GET | `/api/statistics` | Database overview + aggregate costs |
| GET | `/api/categories` | Procedure categories and body systems |

## Integration with CrashStory

The API is designed to be consumed by `crashstory.com`. Set `ALLOWED_ORIGINS` in wrangler.jsonc to include all allowed consumer domains.

In the CrashStory web app, point `web/lib/medical-costs-api.ts` at this Worker's URL:
```typescript
const API_BASE = 'https://medical-costs-api.<your-subdomain>.workers.dev';
```

## Data

- **22 injury categories** spanning motor vehicle, toxic exposure, workplace, pedestrian, and bicycle injuries
- **80+ medical procedures** with Medicare rates, RVUs, and descriptions
- **20 metropolitan areas** with geographic cost adjustments
- **WISQARS aggregate data** for motor vehicle, fall, and poisoning costs
- **NHTSA per-crash costs** by injury severity (KABCO scale)
