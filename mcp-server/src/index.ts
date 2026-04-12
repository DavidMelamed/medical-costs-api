#!/usr/bin/env node

/**
 * Medical Costs MCP Server
 *
 * Provides AI assistants with tools to query medical procedure costs,
 * drug prices, condition treatment costs, and crash injury estimates
 * from the MedicalCosts.info API.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE = "https://medical-costs-api.david-568.workers.dev";

const DISCLAIMER =
  "Estimates based on CMS Medicare reimbursement rates (2026 fee schedule), " +
  "CDC WISQARS, and NHTSA crash cost studies. Actual costs vary by provider, " +
  "insurance, and geography. Not medical or legal advice.";

const SOURCE_ATTRIBUTION =
  "Source: MedicalCosts.info | Data: CMS Medicare Physician Fee Schedule, " +
  "CMS Hospital Outpatient Prospective Payment, CDC WISQARS Cost of Injury, " +
  "NHTSA Economic Impact of Motor Vehicle Crashes";

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

async function apiGet<T = unknown>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  const json = (await res.json()) as { success: boolean; data?: T; error?: string };
  if (!json.success) {
    throw new Error(json.error || "API returned unsuccessful response");
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function fmt(amount: number | null | undefined): string {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtRange(low: number | null | undefined, high: number | null | undefined): string {
  if (low == null && high == null) return "N/A";
  if (low == null) return fmt(high);
  if (high == null) return fmt(low);
  if (low === high) return fmt(low);
  return `${fmt(low)} - ${fmt(high)}`;
}

function line(label: string, value: string): string {
  return `  ${label}: ${value}`;
}

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

async function lookupProcedureCost(args: {
  query: string;
  state?: string;
}): Promise<string> {
  const { query, state } = args;

  // Try direct code lookup first
  try {
    const proc = await apiGet<any>(`/api/procedures/${encodeURIComponent(query)}`);
    if (proc) {
      const lines = [
        `## ${proc.description}`,
        ``,
        `CPT/HCPCS Code: ${proc.code} (${proc.codeType})`,
        `Category: ${proc.category || "Uncategorized"}`,
        `Body System: ${proc.bodySystem || "N/A"}`,
        ``,
        `### Medicare Rates (2026)`,
        line("National Facility Rate", fmt(proc.nationalFacilityRate)),
        line("National Non-Facility Rate", fmt(proc.nationalNonFacRate)),
        line("Hospital Outpatient", fmt(proc.hospitalOutpatientCost)),
        line("Ambulatory Surgery Center", fmt(proc.ascCost)),
        ``,
        `### RVU Breakdown`,
        line("Work RVU", proc.workRvu?.toFixed(2) ?? "N/A"),
        line("Total RVU", proc.totalRvu?.toFixed(2) ?? "N/A"),
      ];

      // If state requested, fetch geographic comparison
      if (state) {
        try {
          const geo = await apiGet<any>(
            `/api/compare?code=${encodeURIComponent(proc.code)}&states=${encodeURIComponent(state)}`
          );
          if (geo?.geographicCosts?.length) {
            lines.push("", `### ${state} Geographic Rates`);
            for (const g of geo.geographicCosts) {
              lines.push(
                `  ${g.locality}:`,
                `    Facility: ${fmt(g.facilityRate)} | Non-Facility: ${fmt(g.nonFacilityRate)}`,
                `    Est. Commercial: ${fmtRange(g.estimatedCommercialLow, g.estimatedCommercialHigh)}`
              );
            }
          }
        } catch {
          // Geographic data not available — skip
        }
      }

      lines.push("", `---`, DISCLAIMER, SOURCE_ATTRIBUTION);
      return lines.join("\n");
    }
  } catch {
    // Not a direct code — fall through to search
  }

  // Search by name
  const results = await apiGet<any[]>(
    `/api/procedures?search=${encodeURIComponent(query)}&limit=10`
  );

  if (!results || (Array.isArray(results) && results.length === 0)) {
    return `No procedures found matching "${query}". Try a different search term or CPT code.`;
  }

  // The API wraps search results differently
  const procs = Array.isArray(results) ? results : (results as any);
  const lines = [`## Procedures matching "${query}"`, ""];

  const list = Array.isArray(procs) ? procs : [];
  for (const p of list) {
    const rates: string[] = [];
    if (p.nationalFacilityRate) rates.push(`Facility: ${fmt(p.nationalFacilityRate)}`);
    if (p.nationalNonFacRate) rates.push(`Non-Facility: ${fmt(p.nationalNonFacRate)}`);
    if (p.hospitalOutpatientCost) rates.push(`Hospital OP: ${fmt(p.hospitalOutpatientCost)}`);
    lines.push(
      `- **${p.code}** ${p.description}`,
      `  ${rates.join(" | ") || "Rate data not available"}`,
      ""
    );
  }

  lines.push("---", DISCLAIMER, SOURCE_ATTRIBUTION);
  return lines.join("\n");
}

async function getConditionTreatmentCost(args: {
  condition: string;
  severity?: string;
}): Promise<string> {
  const { condition, severity } = args;

  // Try direct slug lookup
  const slug = condition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let data: any;
  try {
    data = await apiGet<any>(`/api/injuries/${encodeURIComponent(slug)}`);
  } catch {
    // Try searching injuries list
    const all = await apiGet<any[]>("/api/injuries");
    const match = all?.find(
      (i: any) =>
        i.name?.toLowerCase().includes(condition.toLowerCase()) ||
        i.slug?.toLowerCase().includes(slug)
    );
    if (match) {
      data = await apiGet<any>(`/api/injuries/${match.slug}`);
    }
  }

  if (!data) {
    return `No condition found matching "${condition}". Try terms like "whiplash", "concussion", "broken-arm", "acl-tear".`;
  }

  const cat = data.category || data;
  const lines = [
    `## ${cat.name}`,
    "",
    cat.description || "",
    "",
    `Body Region: ${cat.bodyRegion || "N/A"}`,
    `Crash Relevance: ${cat.crashRelevance || "N/A"}`,
    "",
    "### Treatment Cost Ranges",
  ];

  if (!severity || severity === "mild") {
    lines.push(`  Mild: ${fmtRange(cat.mildCostLow, cat.mildCostHigh)}`);
  }
  if (!severity || severity === "moderate") {
    lines.push(`  Moderate: ${fmtRange(cat.moderateCostLow, cat.moderateCostHigh)}`);
  }
  if (!severity || severity === "severe") {
    lines.push(`  Severe: ${fmtRange(cat.severeCostLow, cat.severeCostHigh)}`);
  }
  if (cat.lifetimeCostLow || cat.lifetimeCostHigh) {
    lines.push(`  Lifetime (severe): ${fmtRange(cat.lifetimeCostLow, cat.lifetimeCostHigh)}`);
  }

  // Include treatment procedures if available
  if (data.procedures?.length) {
    lines.push("", "### Associated Treatment Procedures");
    for (const p of data.procedures) {
      lines.push(
        `- **${p.code}** ${p.description}`,
        `  Medicare Rate: ${fmt(p.nationalFacilityRate || p.nationalNonFacRate)}`,
        `  Phase: ${p.treatmentPhase || "N/A"} | Frequency: ${p.typicalFrequency || "N/A"}`
      );
    }
  }

  lines.push("", "---", DISCLAIMER, SOURCE_ATTRIBUTION);
  return lines.join("\n");
}

async function compareCostsByState(args: {
  procedure_code: string;
  states: string[];
}): Promise<string> {
  const { procedure_code, states } = args;
  const stateList = states.join(",");

  const data = await apiGet<any>(
    `/api/compare?code=${encodeURIComponent(procedure_code)}&states=${encodeURIComponent(stateList)}`
  );

  if (!data) {
    return `No comparison data found for code "${procedure_code}" in states ${stateList}.`;
  }

  const lines = [
    `## Cost Comparison: ${data.procedure?.description || procedure_code}`,
    `Code: ${data.procedure?.code || procedure_code}`,
    "",
    "### Geographic Rates",
  ];

  if (data.geographicCosts?.length) {
    // Group by state
    const byState: Record<string, any[]> = {};
    for (const g of data.geographicCosts) {
      const st = g.stateCode || "??";
      if (!byState[st]) byState[st] = [];
      byState[st].push(g);
    }

    for (const [st, costs] of Object.entries(byState)) {
      lines.push(``, `**${st}**`);
      for (const g of costs) {
        lines.push(
          `  ${g.locality}:`,
          `    Medicare Facility: ${fmt(g.facilityRate)}`,
          `    Medicare Non-Facility: ${fmt(g.nonFacilityRate)}`,
          `    Est. Commercial: ${fmtRange(g.estimatedCommercialLow, g.estimatedCommercialHigh)}`
        );
      }
    }
  } else {
    lines.push("No geographic cost data available for the requested states.");
  }

  if (data.nationalRate) {
    lines.push(
      "",
      "### National Baseline",
      line("Facility Rate", fmt(data.nationalRate.facilityRate)),
      line("Non-Facility Rate", fmt(data.nationalRate.nonFacilityRate))
    );
  }

  lines.push("", "---", DISCLAIMER, SOURCE_ATTRIBUTION);
  return lines.join("\n");
}

async function estimateCrashInjuryCosts(args: {
  severity: string;
  state?: string;
}): Promise<string> {
  const { severity, state = "CO" } = args;

  const data = await apiGet<any>(
    `/api/crash-estimate?severity=${encodeURIComponent(severity)}&state=${encodeURIComponent(state)}`
  );

  if (!data) {
    return `No crash cost estimate available for severity "${severity}" in ${state}. Valid severities: minor, moderate, serious, severe, critical.`;
  }

  const lines = [
    `## Crash Injury Cost Estimate`,
    `Severity: ${data.crashSeverity || severity}`,
    `State: ${data.state || state}`,
    "",
    `### Weighted Cost Estimate`,
    line("Low", fmt(data.weightedCostEstimate?.low)),
    line("High", fmt(data.weightedCostEstimate?.high)),
  ];

  if (data.likelyInjuries?.length) {
    lines.push("", "### Likely Injuries");
    for (const inj of data.likelyInjuries) {
      const likelihood = inj.likelihood
        ? `(${(inj.likelihood * 100).toFixed(0)}% likelihood)`
        : "";
      lines.push(
        ``,
        `**${inj.name}** ${likelihood}`,
        `  Body Region: ${inj.bodyRegion || "N/A"}`
      );
      if (inj.costRange) {
        const entries = Object.entries(inj.costRange);
        for (const [key, val] of entries) {
          lines.push(`  ${key}: ${fmt(val as number)}`);
        }
      }
    }
  }

  if (data.aggregateStatistics) {
    const agg = data.aggregateStatistics;
    lines.push(
      "",
      "### National Aggregate Statistics",
      line("Avg Medical Cost per Crash", fmt(agg.avgMedicalCost)),
      line("Avg Total Economic Cost", fmt(agg.avgTotalEconomicCost)),
      line("Annual Total (all crashes)", fmt(agg.annualTotalCost))
    );
  }

  lines.push("", "---", DISCLAIMER, SOURCE_ATTRIBUTION);
  return lines.join("\n");
}

async function searchDrugPrice(args: { drug_name: string }): Promise<string> {
  // Drugs are in the procedures table with code_type = 'HCPCS' and J-codes
  const results = await apiGet<any>(
    `/api/procedures?search=${encodeURIComponent(args.drug_name)}&limit=15`
  );

  const procs = Array.isArray(results) ? results : [];
  // Filter to drug-related results (J-codes, Q-codes, or drug keywords)
  const drugs = procs.filter(
    (p: any) =>
      p.code?.match(/^[JQ]\d/) ||
      p.description?.toLowerCase().includes("injection") ||
      p.description?.toLowerCase().includes("drug") ||
      p.description?.toLowerCase().includes("vaccine") ||
      p.description?.toLowerCase().includes("infusion")
  );

  const displayList = drugs.length > 0 ? drugs : procs;

  if (!displayList.length) {
    return `No drug pricing found for "${args.drug_name}". Try the generic drug name or a HCPCS J-code (e.g., "J0129" for abciximab).`;
  }

  const lines = [`## Drug/Injectable Pricing: "${args.drug_name}"`, ""];

  for (const p of displayList) {
    lines.push(
      `- **${p.code}** ${p.description}`,
      `  Medicare Payment: ${fmt(p.nationalFacilityRate || p.nationalNonFacRate || p.hospitalOutpatientCost)}`,
      ""
    );
  }

  if (drugs.length === 0 && procs.length > 0) {
    lines.push(
      "*No specific drug codes found. Showing general procedure results that may include drug administration.*",
      ""
    );
  }

  lines.push("---", DISCLAIMER, SOURCE_ATTRIBUTION);
  return lines.join("\n");
}

async function getMedicalCostStatistics(): Promise<string> {
  const data = await apiGet<any>("/api/statistics");

  if (!data) {
    return "Unable to retrieve statistics at this time.";
  }

  const lines = [
    "## MedicalCosts.info Database Overview",
    "",
    "### Coverage",
    line("Total Procedures", data.counts?.procedures?.toLocaleString() ?? "N/A"),
    line("Injury Categories", data.counts?.injuryCategories?.toLocaleString() ?? "N/A"),
    line("Geographic Regions", data.counts?.geographicCosts?.toLocaleString() ?? "N/A"),
    line("Procedure-Injury Mappings", data.counts?.procedureMappings?.toLocaleString() ?? "N/A"),
  ];

  if (data.costRanges) {
    lines.push("", "### Cost Ranges");
    if (data.costRanges.facilityRate) {
      lines.push(
        line(
          "Facility Rate",
          `${fmt(data.costRanges.facilityRate.min)} - ${fmt(data.costRanges.facilityRate.max)}`
        )
      );
    }
    if (data.costRanges.nonFacilityRate) {
      lines.push(
        line(
          "Non-Facility Rate",
          `${fmt(data.costRanges.nonFacilityRate.min)} - ${fmt(data.costRanges.nonFacilityRate.max)}`
        )
      );
    }
  }

  if (data.dataSources) {
    lines.push("", "### Data Sources");
    for (const src of data.dataSources) {
      lines.push(`  - ${src.name || src}`);
    }
  }

  lines.push(
    "",
    "### About",
    "All data comes from publicly available U.S. government datasets:",
    "  - CMS Medicare Physician Fee Schedule (CY 2026)",
    "  - CMS Hospital Outpatient Prospective Payment System",
    "  - CMS Ambulatory Surgery Center Payment System",
    "  - CDC WISQARS Cost of Injury Reports",
    "  - NHTSA Economic Impact of Motor Vehicle Crashes",
    "",
    `Website: https://medicalcosts.info`,
    `API: ${API_BASE}`,
    "",
    "---",
    SOURCE_ATTRIBUTION
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// MCP Server Setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "medical-costs",
  version: "1.0.0",
});

// Tool: lookup_procedure_cost
server.tool(
  "lookup_procedure_cost",
  "Look up the cost of a medical procedure by CPT/HCPCS code or search by name. Returns Medicare facility/non-facility rates, hospital outpatient costs, and RVU data. Optionally include state-specific geographic rates.",
  {
    query: z
      .string()
      .describe(
        "CPT/HCPCS code (e.g., '99213', '27447') or search term (e.g., 'knee replacement', 'MRI lumbar spine')"
      ),
    state: z
      .string()
      .optional()
      .describe(
        "Two-letter state code for geographic pricing (e.g., 'CA', 'NY', 'TX')"
      ),
  },
  async (args) => {
    try {
      const text = await lookupProcedureCost(args);
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: get_condition_treatment_cost
server.tool(
  "get_condition_treatment_cost",
  "Get treatment costs for a medical condition or injury. Returns cost ranges by severity (mild/moderate/severe), associated treatment procedures with Medicare rates, and lifetime cost estimates. Especially useful for crash-related injuries.",
  {
    condition: z
      .string()
      .describe(
        "Condition name or slug (e.g., 'whiplash', 'concussion', 'acl-tear', 'broken arm', 'spinal cord injury')"
      ),
    severity: z
      .enum(["mild", "moderate", "severe"])
      .optional()
      .describe("Filter to a specific severity level"),
  },
  async (args) => {
    try {
      const text = await getConditionTreatmentCost(args);
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: compare_costs_by_state
server.tool(
  "compare_costs_by_state",
  "Compare the cost of a medical procedure across different U.S. states. Shows Medicare facility/non-facility rates and estimated commercial insurance rates by geographic locality.",
  {
    procedure_code: z
      .string()
      .describe("CPT or HCPCS procedure code (e.g., '99213', '27447')"),
    states: z
      .array(z.string())
      .describe(
        "Array of two-letter state codes to compare (e.g., ['CA', 'NY', 'TX'])"
      ),
  },
  async (args) => {
    try {
      const text = await compareCostsByState(args);
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: estimate_crash_injury_costs
server.tool(
  "estimate_crash_injury_costs",
  "Estimate the medical costs from a car crash injury by severity level. Returns weighted cost estimates, likely injuries with probabilities, and national aggregate statistics from NHTSA data.",
  {
    severity: z
      .enum(["minor", "moderate", "serious", "severe", "critical"])
      .describe(
        "Crash severity level: minor (fender bender), moderate (airbag deployment), serious (hospitalization), severe (ICU), critical (life-threatening)"
      ),
    state: z
      .string()
      .optional()
      .describe(
        "Two-letter state code for state-adjusted estimates (default: 'CO')"
      ),
  },
  async (args) => {
    try {
      const text = await estimateCrashInjuryCosts(args);
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: search_drug_price
server.tool(
  "search_drug_price",
  "Look up prescription drug or injectable pricing from Medicare/CMS data. Search by drug name or HCPCS J-code. Returns Medicare payment rates for physician-administered drugs and biologics.",
  {
    drug_name: z
      .string()
      .describe(
        "Drug name (e.g., 'adalimumab', 'insulin', 'botox') or HCPCS J-code (e.g., 'J0129')"
      ),
  },
  async (args) => {
    try {
      const text = await searchDrugPrice(args);
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: get_medical_cost_statistics
server.tool(
  "get_medical_cost_statistics",
  "Get an overview of the MedicalCosts.info database including total procedure count, injury categories, geographic coverage, data sources, and cost ranges.",
  {},
  async () => {
    try {
      const text = await getMedicalCostStatistics();
      return { content: [{ type: "text" as const, text }] };
    } catch (e: any) {
      return {
        content: [{ type: "text" as const, text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Transport: stdio (default) or HTTP (--http flag)
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const useHttp = args.includes("--http");

  if (useHttp) {
    // HTTP/SSE transport for web-based MCP clients
    const { SSEServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/sse.js"
    );

    const http = await import("http");
    const PORT = parseInt(process.env.PORT || "3100", 10);

    let sseTransport: InstanceType<typeof SSEServerTransport> | null = null;

    const httpServer = http.createServer(async (req, res) => {
      // CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || "/", `http://localhost:${PORT}`);

      if (url.pathname === "/sse" && req.method === "GET") {
        sseTransport = new SSEServerTransport("/messages", res);
        await server.connect(sseTransport);
        return;
      }

      if (url.pathname === "/messages" && req.method === "POST") {
        if (!sseTransport) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "No SSE connection established" }));
          return;
        }
        const body = await new Promise<string>((resolve) => {
          let data = "";
          req.on("data", (chunk: Buffer) => (data += chunk.toString()));
          req.on("end", () => resolve(data));
        });

        // SSEServerTransport expects the request/response pair
        await sseTransport.handlePostMessage(req, res, body);
        return;
      }

      if (url.pathname === "/" || url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            name: "medical-costs-mcp-server",
            version: "1.0.0",
            status: "running",
            transport: "sse",
            endpoints: {
              sse: "/sse",
              messages: "/messages",
            },
          })
        );
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    });

    httpServer.listen(PORT, () => {
      console.error(`Medical Costs MCP Server (HTTP/SSE) running on http://localhost:${PORT}`);
      console.error(`SSE endpoint: http://localhost:${PORT}/sse`);
    });
  } else {
    // Stdio transport for Claude Desktop and CLI
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Medical Costs MCP Server running on stdio");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
