# Medical Costs MCP Server

An MCP (Model Context Protocol) server that gives AI assistants access to medical procedure costs, drug prices, condition treatment costs, and crash injury estimates from [MedicalCosts.info](https://medicalcosts.info).

## Data Sources

All data comes from publicly available U.S. government datasets:

- **CMS Medicare Physician Fee Schedule** (CY 2026) -- 21,000+ procedures
- **CMS Hospital Outpatient Prospective Payment** -- facility-based rates
- **CMS Ambulatory Surgery Center Payment** -- outpatient surgery rates
- **CDC WISQARS Cost of Injury** -- injury treatment cost ranges
- **NHTSA Economic Impact of Motor Vehicle Crashes** -- crash severity estimates

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### Claude Desktop (stdio)

Add this to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "medical-costs": {
      "command": "node",
      "args": ["/path/to/medical-costs-api/mcp-server/dist/index.js"]
    }
  }
}
```

### HTTP/SSE Mode (for web clients)

```bash
npm run start:http
# Server runs on http://localhost:3100
# SSE endpoint: http://localhost:3100/sse
```

### Development

```bash
npm run dev        # stdio mode with tsx
npm run dev:http   # HTTP mode with tsx
```

## Available Tools

### `lookup_procedure_cost`

Look up the cost of a medical procedure by CPT/HCPCS code or search by name.

**Parameters:**
- `query` (required) -- CPT/HCPCS code (e.g., "99213") or search term (e.g., "knee replacement")
- `state` (optional) -- Two-letter state code for geographic pricing (e.g., "CA")

**Example:** "How much does a knee MRI cost in California?"

### `get_condition_treatment_cost`

Get treatment costs for a medical condition or injury, with cost ranges by severity.

**Parameters:**
- `condition` (required) -- Condition name (e.g., "whiplash", "concussion", "acl-tear")
- `severity` (optional) -- Filter to "mild", "moderate", or "severe"

**Example:** "What does it cost to treat a concussion?"

### `compare_costs_by_state`

Compare procedure costs across different U.S. states.

**Parameters:**
- `procedure_code` (required) -- CPT or HCPCS code (e.g., "27447")
- `states` (required) -- Array of state codes (e.g., ["CA", "NY", "TX"])

**Example:** "Compare knee replacement costs between California, New York, and Texas"

### `estimate_crash_injury_costs`

Estimate medical costs from a car crash by severity level.

**Parameters:**
- `severity` (required) -- "minor", "moderate", "serious", "severe", or "critical"
- `state` (optional) -- Two-letter state code (default: "CO")

**Example:** "How much does a serious car crash cost in medical bills?"

### `search_drug_price`

Look up prescription drug or injectable pricing from Medicare data.

**Parameters:**
- `drug_name` (required) -- Drug name (e.g., "adalimumab") or HCPCS J-code (e.g., "J0129")

**Example:** "What does a Botox injection cost under Medicare?"

### `get_medical_cost_statistics`

Get an overview of the database: procedure counts, geographic coverage, data sources, and cost ranges.

**Parameters:** None

**Example:** "What data does MedicalCosts.info have?"

## API

The MCP server queries the public API at:
```
https://medical-costs-api.david-568.workers.dev
```

No API key is required. All data is free and publicly available.

## License

MIT
