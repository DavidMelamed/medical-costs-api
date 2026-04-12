/**
 * Medical Costs API — Cloudflare Worker with D1
 *
 * Provides medical procedure costs, injury-to-procedure mappings,
 * crash severity cost estimates, and geographic cost comparisons.
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed.includes(origin) || allowed.includes("*")) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function success(data: unknown, cors: Record<string, string>, extra?: Record<string, unknown>): Response {
  return json({ success: true, data, ...extra }, 200, cors);
}

function error(message: string, status: number, cors: Record<string, string>): Response {
  return json({ success: false, error: message }, status, cors);
}

const DISCLAIMER =
  "These cost estimates are for informational purposes only and are based on publicly available Medicare reimbursement rates. " +
  "Actual costs vary significantly by provider, insurance, geography, and individual circumstances. " +
  "This is not medical or legal advice. Consult qualified professionals for case-specific guidance.";

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // POST /admin/seed — one-time seeder endpoint
    if (request.method === "POST" && path === "/admin/seed") {
      return handleSeed(request, env, cors);
    }

    if (request.method !== "GET") {
      return error("Method not allowed", 405, cors);
    }

    try {
      // Static routes
      if (path === "/") return handleRoot(cors);
      if (path === "/api/procedures") return handleProcedures(url, env, cors);
      if (path === "/api/injuries") return handleInjuries(url, env, cors);
      if (path === "/api/crash-estimate") return handleCrashEstimate(url, env, cors);
      if (path === "/api/compare") return handleCompare(url, env, cors);
      if (path === "/api/statistics") return handleStatistics(env, cors);
      if (path === "/api/categories") return handleCategories(env, cors);

      // Parameterized routes
      const procMatch = path.match(/^\/api\/procedures\/([^/]+)$/);
      if (procMatch) return handleProcedureDetail(decodeURIComponent(procMatch[1]), env, cors);

      const injuryEstMatch = path.match(/^\/api\/injuries\/([^/]+)\/estimate$/);
      if (injuryEstMatch) return handleInjuryEstimate(decodeURIComponent(injuryEstMatch[1]), url, env, cors);

      const injuryMatch = path.match(/^\/api\/injuries\/([^/]+)$/);
      if (injuryMatch) return handleInjuryDetail(decodeURIComponent(injuryMatch[1]), env, cors);

      return error("Not found", 404, cors);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Internal server error";
      console.error("Unhandled error:", e);
      return error(message, 500, cors);
    }
  },
} satisfies ExportedHandler<Env>;

// ---------------------------------------------------------------------------
// GET /
// ---------------------------------------------------------------------------

function handleRoot(cors: Record<string, string>): Response {
  return success(
    {
      name: "Medical Costs API",
      version: "1.0.0",
      description: "Medical procedure costs, injury mappings, and crash severity estimates powered by CMS Medicare PFS, CDC WISQARS, and NHTSA data.",
      endpoints: [
        "GET /api/procedures",
        "GET /api/procedures/:code",
        "GET /api/injuries",
        "GET /api/injuries/:slug",
        "GET /api/injuries/:slug/estimate",
        "GET /api/crash-estimate",
        "GET /api/compare",
        "GET /api/statistics",
        "GET /api/categories",
      ],
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/procedures
// ---------------------------------------------------------------------------

async function handleProcedures(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const bodySystem = url.searchParams.get("bodySystem");
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (search) {
    conditions.push("(code LIKE ?1 OR description LIKE ?1)");
    params.push(`%${search}%`);
  }
  if (category) {
    conditions.push(`category = ?${params.length + 1}`);
    params.push(category);
  }
  if (bodySystem) {
    conditions.push(`body_system = ?${params.length + 1}`);
    params.push(bodySystem);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const countStmt = env.DB.prepare(`SELECT COUNT(*) as total FROM medical_procedures ${where}`).bind(...params);
  const countResult = await countStmt.first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const dataStmt = env.DB.prepare(
    `SELECT
       id, code, code_type AS codeType, description, category, body_system AS bodySystem,
       work_rvu AS workRvu, total_rvu AS totalRvu,
       national_facility_rate AS nationalFacilityRate,
       national_non_fac_rate AS nationalNonFacRate,
       hospital_outpatient_cost AS hospitalOutpatientCost,
       asc_cost AS ascCost,
       effective_year AS effectiveYear,
       source_dataset AS sourceDataset
     FROM medical_procedures ${where}
     ORDER BY code
     LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`,
  ).bind(...params, limit, offset);

  const { results } = await dataStmt.all();

  return success(results, cors, { pagination: { total, limit, offset } });
}

// ---------------------------------------------------------------------------
// GET /api/procedures/:code
// ---------------------------------------------------------------------------

async function handleProcedureDetail(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const proc = await env.DB.prepare(
    `SELECT
       id, code, code_type AS codeType, description, category, body_system AS bodySystem,
       work_rvu AS workRvu, facility_pe_rvu AS facilityPeRvu, non_fac_pe_rvu AS nonFacPeRvu,
       malpractice_rvu AS malpracticeRvu, total_rvu AS totalRvu,
       national_facility_rate AS nationalFacilityRate,
       national_non_fac_rate AS nationalNonFacRate,
       conversion_factor AS conversionFactor,
       hospital_outpatient_cost AS hospitalOutpatientCost,
       hospital_outpatient_copay AS hospitalOutpatientCopay,
       asc_cost AS ascCost, asc_copay AS ascCopay,
       effective_year AS effectiveYear,
       source_dataset AS sourceDataset,
       last_updated AS lastUpdated
     FROM medical_procedures WHERE code = ?1`,
  ).bind(code).first();

  if (!proc) return error("Procedure not found", 404, cors);

  // Geographic costs
  const { results: geoCosts } = await env.DB.prepare(
    `SELECT
       g.state_code AS stateCode, g.locality, g.mac_number AS macNumber,
       g.work_gpci AS workGpci, g.pe_gpci AS peGpci, g.malpractice_gpci AS malpracticeGpci,
       g.facility_rate AS facilityRate, g.non_facility_rate AS nonFacilityRate,
       g.commercial_multiplier AS commercialMultiplier,
       g.estimated_commercial_low AS estimatedCommercialLow,
       g.estimated_commercial_high AS estimatedCommercialHigh,
       g.workers_comp_rate AS workersCompRate
     FROM medical_cost_geographic g
     WHERE g.procedure_id = ?1
     ORDER BY g.state_code`,
  ).bind((proc as Record<string, unknown>).id).all();

  // Injury mappings
  const { results: injuryMappings } = await env.DB.prepare(
    `SELECT
       ic.name AS injuryName, ic.slug AS injurySlug, ic.body_region AS bodyRegion,
       ipm.phase, ipm.is_common AS isCommon, ipm.typical_qty AS typicalQty,
       ipm.frequency, ipm.notes
     FROM injury_procedure_mappings ipm
     JOIN injury_categories ic ON ic.id = ipm.injury_id
     WHERE ipm.procedure_id = ?1
     ORDER BY ic.name, ipm.phase`,
  ).bind((proc as Record<string, unknown>).id).all();

  // Compute commercial estimates from national rates
  const nationalRate = ((proc as Record<string, unknown>).nationalFacilityRate as number) || 0;
  const commercialEstimates = {
    low: Math.round(nationalRate * 1.5 * 100) / 100,
    high: Math.round(nationalRate * 2.5 * 100) / 100,
  };

  return success({ ...proc, commercialEstimates, geographicCosts: geoCosts, injuryMappings }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/injuries
// ---------------------------------------------------------------------------

async function handleInjuries(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const relevance = url.searchParams.get("relevance");
  const bodyRegion = url.searchParams.get("bodyRegion");

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (relevance) {
    conditions.push(`ic.crash_relevance = ?${params.length + 1}`);
    params.push(relevance);
  }
  if (bodyRegion) {
    conditions.push(`ic.body_region = ?${params.length + 1}`);
    params.push(bodyRegion);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { results } = await env.DB.prepare(
    `SELECT
       ic.id, ic.name, ic.slug, ic.description, ic.body_region AS bodyRegion,
       ic.crash_relevance AS crashRelevance,
       ic.mild_cost_low AS mildCostLow, ic.mild_cost_high AS mildCostHigh,
       ic.moderate_cost_low AS moderateCostLow, ic.moderate_cost_high AS moderateCostHigh,
       ic.severe_cost_low AS severeCostLow, ic.severe_cost_high AS severeCostHigh,
       ic.lifetime_cost_low AS lifetimeCostLow, ic.lifetime_cost_high AS lifetimeCostHigh,
       COUNT(ipm.id) AS procedureMappingCount
     FROM injury_categories ic
     LEFT JOIN injury_procedure_mappings ipm ON ipm.injury_id = ic.id
     ${where}
     GROUP BY ic.id
     ORDER BY ic.name`,
  ).bind(...params).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/injuries/:slug
// ---------------------------------------------------------------------------

async function handleInjuryDetail(slug: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const injury = await env.DB.prepare(
    `SELECT
       id, name, slug, description, body_region AS bodyRegion,
       icd10_code_start AS icd10CodeStart, icd10_code_end AS icd10CodeEnd,
       icd10_codes AS icd10Codes, crash_relevance AS crashRelevance,
       common_causes AS commonCauses,
       mild_cost_low AS mildCostLow, mild_cost_high AS mildCostHigh,
       moderate_cost_low AS moderateCostLow, moderate_cost_high AS moderateCostHigh,
       severe_cost_low AS severeCostLow, severe_cost_high AS severeCostHigh,
       lifetime_cost_low AS lifetimeCostLow, lifetime_cost_high AS lifetimeCostHigh
     FROM injury_categories WHERE slug = ?1`,
  ).bind(slug).first();

  if (!injury) return error("Injury category not found", 404, cors);

  const injuryRec = injury as Record<string, unknown>;

  // Parse JSON fields
  if (typeof injuryRec.icd10Codes === "string") {
    try { injuryRec.icd10Codes = JSON.parse(injuryRec.icd10Codes as string); } catch { /* keep string */ }
  }
  if (typeof injuryRec.commonCauses === "string") {
    try { injuryRec.commonCauses = JSON.parse(injuryRec.commonCauses as string); } catch { /* keep string */ }
  }

  // Procedure mappings grouped by phase
  const { results: mappings } = await env.DB.prepare(
    `SELECT
       ipm.phase, ipm.is_common AS isCommon, ipm.typical_qty AS typicalQty,
       ipm.frequency, ipm.notes,
       mp.code, mp.code_type AS codeType, mp.description,
       mp.national_facility_rate AS medicareRate,
       mp.category, mp.body_system AS bodySystem
     FROM injury_procedure_mappings ipm
     JOIN medical_procedures mp ON mp.id = ipm.procedure_id
     WHERE ipm.injury_id = ?1
     ORDER BY ipm.phase, mp.code`,
  ).bind(injuryRec.id).all();

  // Group by phase and compute costs
  const phaseMap: Record<string, Array<Record<string, unknown>>> = {};
  let totalCostLow = 0;
  let totalCostHigh = 0;

  for (const m of mappings) {
    const rec = m as Record<string, unknown>;
    const phase = rec.phase as string;
    const rate = (rec.medicareRate as number) || 0;
    const qty = (rec.typicalQty as number) || 1;
    const estimatedCostLow = Math.round(rate * qty * 1.5 * 100) / 100;
    const estimatedCostHigh = Math.round(rate * qty * 2.5 * 100) / 100;

    const entry = { ...rec, estimatedCostLow, estimatedCostHigh };

    if (!phaseMap[phase]) phaseMap[phase] = [];
    phaseMap[phase].push(entry);

    totalCostLow += estimatedCostLow;
    totalCostHigh += estimatedCostHigh;
  }

  const treatmentBreakdown = Object.entries(phaseMap).map(([phase, procedures]) => {
    const subtotalLow = procedures.reduce((s: number, p: Record<string, unknown>) => s + (p.estimatedCostLow as number), 0);
    const subtotalHigh = procedures.reduce((s: number, p: Record<string, unknown>) => s + (p.estimatedCostHigh as number), 0);
    return {
      phase,
      procedures,
      subtotalLow: Math.round(subtotalLow * 100) / 100,
      subtotalHigh: Math.round(subtotalHigh * 100) / 100,
    };
  });

  // Crash severity map
  const { results: severityRows } = await env.DB.prepare(
    `SELECT crash_severity AS crashSeverity, likelihood
     FROM injury_crash_severity_map WHERE injury_id = ?1
     ORDER BY likelihood DESC`,
  ).bind(injuryRec.id).all();

  return success(
    {
      ...injuryRec,
      treatmentBreakdown,
      crashSeverityMap: severityRows,
      estimatedTotalCost: {
        low: Math.round(totalCostLow * 100) / 100,
        high: Math.round(totalCostHigh * 100) / 100,
      },
      disclaimer: DISCLAIMER,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/injuries/:slug/estimate
// ---------------------------------------------------------------------------

async function handleInjuryEstimate(slug: string, url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const severity = url.searchParams.get("severity") || "moderate";
  const state = url.searchParams.get("state") || "CO";

  const validSeverities = ["mild", "moderate", "severe", "catastrophic"];
  if (!validSeverities.includes(severity)) {
    return error(`Invalid severity. Must be one of: ${validSeverities.join(", ")}`, 400, cors);
  }

  const injury = await env.DB.prepare(
    `SELECT
       id, name, slug, body_region AS bodyRegion,
       mild_cost_low AS mildCostLow, mild_cost_high AS mildCostHigh,
       moderate_cost_low AS moderateCostLow, moderate_cost_high AS moderateCostHigh,
       severe_cost_low AS severeCostLow, severe_cost_high AS severeCostHigh,
       lifetime_cost_low AS lifetimeCostLow, lifetime_cost_high AS lifetimeCostHigh
     FROM injury_categories WHERE slug = ?1`,
  ).bind(slug).first();

  if (!injury) return error("Injury category not found", 404, cors);

  const injuryRec = injury as Record<string, unknown>;

  // Map severity to cost columns
  let costLow: number;
  let costHigh: number;
  if (severity === "mild") {
    costLow = (injuryRec.mildCostLow as number) || 0;
    costHigh = (injuryRec.mildCostHigh as number) || 0;
  } else if (severity === "moderate") {
    costLow = (injuryRec.moderateCostLow as number) || 0;
    costHigh = (injuryRec.moderateCostHigh as number) || 0;
  } else if (severity === "severe") {
    costLow = (injuryRec.severeCostLow as number) || 0;
    costHigh = (injuryRec.severeCostHigh as number) || 0;
  } else {
    // catastrophic = lifetime
    costLow = (injuryRec.lifetimeCostLow as number) || 0;
    costHigh = (injuryRec.lifetimeCostHigh as number) || 0;
  }

  // Procedure-level estimates with geographic adjustment
  const { results: procedures } = await env.DB.prepare(
    `SELECT
       mp.code, mp.description, mp.category,
       mp.national_facility_rate AS medicareRate,
       ipm.phase, ipm.typical_qty AS typicalQty, ipm.is_common AS isCommon,
       g.facility_rate AS geoFacilityRate, g.non_facility_rate AS geoNonFacilityRate,
       g.state_code AS stateCode
     FROM injury_procedure_mappings ipm
     JOIN medical_procedures mp ON mp.id = ipm.procedure_id
     LEFT JOIN medical_cost_geographic g ON g.procedure_id = mp.id AND g.state_code = ?2
     WHERE ipm.injury_id = ?1
     ORDER BY ipm.phase, mp.code`,
  ).bind(injuryRec.id, state).all();

  const procedureEstimates = procedures.map((p) => {
    const rec = p as Record<string, unknown>;
    const baseRate = (rec.geoFacilityRate as number) || (rec.medicareRate as number) || 0;
    const qty = (rec.typicalQty as number) || 1;
    return {
      code: rec.code,
      description: rec.description,
      category: rec.category,
      phase: rec.phase,
      typicalQty: qty,
      isCommon: rec.isCommon,
      medicareRate: baseRate,
      estimatedCostLow: Math.round(baseRate * qty * 1.5 * 100) / 100,
      estimatedCostHigh: Math.round(baseRate * qty * 2.5 * 100) / 100,
      state: (rec.stateCode as string) || state,
      geographicAdjusted: !!(rec.geoFacilityRate),
    };
  });

  return success(
    {
      injury: { name: injuryRec.name, slug: injuryRec.slug, bodyRegion: injuryRec.bodyRegion },
      severity,
      state,
      costRange: { low: costLow, high: costHigh },
      procedureEstimates,
      disclaimer: DISCLAIMER,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/crash-estimate
// ---------------------------------------------------------------------------

async function handleCrashEstimate(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const severity = url.searchParams.get("severity") || "MINOR_INJURY";
  const state = url.searchParams.get("state");

  const validSeverities = ["FATAL", "SERIOUS_INJURY", "MINOR_INJURY", "POSSIBLE_INJURY", "PROPERTY_DAMAGE_ONLY"];
  if (!validSeverities.includes(severity)) {
    return error(`Invalid severity. Must be one of: ${validSeverities.join(", ")}`, 400, cors);
  }

  // Get likely injuries for this crash severity
  const { results: likelyInjuries } = await env.DB.prepare(
    `SELECT
       icsm.likelihood,
       ic.id, ic.name, ic.slug, ic.body_region AS bodyRegion,
       ic.mild_cost_low AS mildCostLow, ic.mild_cost_high AS mildCostHigh,
       ic.moderate_cost_low AS moderateCostLow, ic.moderate_cost_high AS moderateCostHigh,
       ic.severe_cost_low AS severeCostLow, ic.severe_cost_high AS severeCostHigh
     FROM injury_crash_severity_map icsm
     JOIN injury_categories ic ON ic.id = icsm.injury_id
     WHERE icsm.crash_severity = ?1
     ORDER BY icsm.likelihood DESC`,
  ).bind(severity).all();

  // Compute weighted cost estimate
  let weightedCostLow = 0;
  let weightedCostHigh = 0;

  const injuries = likelyInjuries.map((row) => {
    const r = row as Record<string, unknown>;
    const likelihood = (r.likelihood as number) || 0;

    // Use moderate costs as the baseline for weighting
    const modLow = (r.moderateCostLow as number) || (r.mildCostLow as number) || 0;
    const modHigh = (r.moderateCostHigh as number) || (r.mildCostHigh as number) || 0;

    weightedCostLow += modLow * likelihood;
    weightedCostHigh += modHigh * likelihood;

    return {
      name: r.name,
      slug: r.slug,
      bodyRegion: r.bodyRegion,
      likelihood,
      costRange: {
        mildLow: r.mildCostLow,
        mildHigh: r.mildCostHigh,
        moderateLow: r.moderateCostLow,
        moderateHigh: r.moderateCostHigh,
        severeLow: r.severeCostLow,
        severeHigh: r.severeCostHigh,
      },
    };
  });

  // NHTSA economic cost data
  const nhtsaConditions = ["mechanism LIKE '%Motor Vehicle%'", `outcome LIKE '%${severity === "FATAL" ? "Death" : "Injur"}%'`];
  const nhtsaParams: unknown[] = [];

  if (state) {
    nhtsaConditions.push(`state_code = ?${nhtsaParams.length + 1}`);
    nhtsaParams.push(state);
  }

  const { results: nhtsaData } = await env.DB.prepare(
    `SELECT
       source, year, mechanism, outcome, age_group AS ageGroup,
       medical_cost_avg AS medicalCostAvg,
       work_loss_cost_avg AS workLossCostAvg,
       quality_life_cost AS qualityLifeCost,
       combined_cost_avg AS combinedCostAvg,
       number_of_cases AS numberOfCases
     FROM injury_cost_aggregates
     WHERE ${nhtsaConditions.join(" AND ")}
     ORDER BY year DESC
     LIMIT 20`,
  ).bind(...nhtsaParams).all();

  return success(
    {
      crashSeverity: severity,
      state: state || "national",
      weightedCostEstimate: {
        low: Math.round(weightedCostLow * 100) / 100,
        high: Math.round(weightedCostHigh * 100) / 100,
      },
      likelyInjuries: injuries,
      nhtsaEconomicData: nhtsaData,
      disclaimer: DISCLAIMER,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/compare
// ---------------------------------------------------------------------------

async function handleCompare(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const code = url.searchParams.get("code");
  if (!code) return error("code parameter is required", 400, cors);

  const statesParam = url.searchParams.get("states") || "CO,CA,TX,NY,FL";
  const states = statesParam.split(",").map((s) => s.trim()).filter(Boolean);

  if (states.length === 0) return error("At least one state is required", 400, cors);
  if (states.length > 10) return error("Maximum 10 states for comparison", 400, cors);

  // Get procedure
  const proc = await env.DB.prepare(
    `SELECT id, code, description, category, national_facility_rate AS nationalFacilityRate
     FROM medical_procedures WHERE code = ?1`,
  ).bind(code).first();

  if (!proc) return error("Procedure not found", 404, cors);

  const procRec = proc as Record<string, unknown>;

  // Build placeholders for IN clause
  const placeholders = states.map((_, i) => `?${i + 2}`).join(",");

  const { results: geoData } = await env.DB.prepare(
    `SELECT
       state_code AS stateCode, locality,
       facility_rate AS facilityRate, non_facility_rate AS nonFacilityRate,
       work_gpci AS workGpci, pe_gpci AS peGpci, malpractice_gpci AS malpracticeGpci,
       commercial_multiplier AS commercialMultiplier,
       estimated_commercial_low AS estimatedCommercialLow,
       estimated_commercial_high AS estimatedCommercialHigh,
       workers_comp_rate AS workersCompRate
     FROM medical_cost_geographic
     WHERE procedure_id = ?1 AND state_code IN (${placeholders})
     ORDER BY state_code, locality`,
  ).bind(procRec.id, ...states).all();

  // Group by state
  const byState: Record<string, unknown[]> = {};
  for (const row of geoData) {
    const st = (row as Record<string, unknown>).stateCode as string;
    if (!byState[st]) byState[st] = [];
    byState[st].push(row);
  }

  return success(
    {
      procedure: {
        code: procRec.code,
        description: procRec.description,
        category: procRec.category,
        nationalFacilityRate: procRec.nationalFacilityRate,
      },
      states: byState,
      statesRequested: states,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/statistics
// ---------------------------------------------------------------------------

async function handleStatistics(env: Env, cors: Record<string, string>): Promise<Response> {
  const [procCount, injuryCount, geoCount, aggCount, mappingCount, aggregateStats] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as count FROM medical_procedures").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) as count FROM injury_categories").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) as count FROM medical_cost_geographic").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) as count FROM injury_cost_aggregates").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) as count FROM injury_procedure_mappings").first<{ count: number }>(),
    env.DB.prepare(
      `SELECT
         source,
         COUNT(*) as records,
         AVG(medical_cost_avg) AS avgMedicalCost,
         AVG(work_loss_cost_avg) AS avgWorkLossCost,
         AVG(combined_cost_avg) AS avgCombinedCost,
         SUM(number_of_cases) AS totalCases
       FROM injury_cost_aggregates
       GROUP BY source`,
    ).all(),
  ]);

  return success(
    {
      counts: {
        procedures: procCount?.count ?? 0,
        injuryCategories: injuryCount?.count ?? 0,
        geographicRecords: geoCount?.count ?? 0,
        costAggregates: aggCount?.count ?? 0,
        procedureMappings: mappingCount?.count ?? 0,
      },
      aggregateCostData: aggregateStats.results,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/categories
// ---------------------------------------------------------------------------

async function handleCategories(env: Env, cors: Record<string, string>): Promise<Response> {
  const [categories, bodySystems] = await Promise.all([
    env.DB.prepare(
      `SELECT category, COUNT(*) as count
       FROM medical_procedures
       WHERE category IS NOT NULL
       GROUP BY category
       ORDER BY count DESC`,
    ).all(),
    env.DB.prepare(
      `SELECT body_system AS bodySystem, COUNT(*) as count
       FROM medical_procedures
       WHERE body_system IS NOT NULL
       GROUP BY body_system
       ORDER BY count DESC`,
    ).all(),
  ]);

  return success({ categories: categories.results, bodySystems: bodySystems.results }, cors);
}

// ---------------------------------------------------------------------------
// POST /admin/seed — Seeds the database from embedded JSON
// ---------------------------------------------------------------------------

import seedData from "./seed-data.json";

async function handleSeed(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== "Bearer seed-medical-costs-2026") {
    return error("Unauthorized", 401, cors);
  }

  const data = seedData as {
    procedures: Array<{ code: string; description: string; category: string; bodySystem: string }>;
    injuries: Array<Record<string, unknown>>;
    wisqars: Array<Record<string, unknown>>;
    nhtsa: Array<Record<string, unknown>>;
    rates: Array<Record<string, unknown>>;
  };

  let inserted = { procedures: 0, rates: 0, injuries: 0, mappings: 0, severity: 0, wisqars: 0, nhtsa: 0, skipped: 0 };

  // Disable FK checks during seed
  await env.DB.prepare("PRAGMA foreign_keys = OFF").run();

  // 1. Procedures
  for (const p of data.procedures) {
    const codeType = p.code.startsWith("E") || p.code.startsWith("L") ? "HCPCS" : "CPT";
    await env.DB.prepare(
      `INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
       VALUES (?, ?, ?, ?, ?, ?, 2026, 'SEED')`
    ).bind(`proc_${p.code}`, p.code, codeType, p.description, p.category, p.bodySystem).run();
    inserted.procedures++;
  }

  // 2. Medicare rates
  for (const r of data.rates) {
    await env.DB.prepare(
      `UPDATE medical_procedures SET work_rvu=?, facility_pe_rvu=?, non_fac_pe_rvu=?, malpractice_rvu=?,
       national_facility_rate=?, national_non_fac_rate=?, conversion_factor=32.35, source_dataset='CMS_PFS'
       WHERE code=? AND effective_year=2026`
    ).bind(r.workRvu, r.facPeRvu, r.nonFacPeRvu, r.mpRvu, r.facRate, r.nonFacRate, r.hcpcs).run();
    inserted.rates++;
  }

  // 3. Injury categories
  for (const inj of data.injuries) {
    const slug = inj.slug as string;
    await env.DB.prepare(
      `INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      `inj_${slug}`, inj.name, slug, inj.description, inj.bodyRegion,
      inj.icd10CodeStart ?? null, inj.icd10CodeEnd ?? null,
      JSON.stringify(inj.icd10Codes), inj.crashRelevance, JSON.stringify(inj.commonCauses),
      inj.mildCostLow ?? null, inj.mildCostHigh ?? null,
      inj.moderateCostLow ?? null, inj.moderateCostHigh ?? null,
      inj.severeCostLow ?? null, inj.severeCostHigh ?? null,
      inj.lifetimeCostLow ?? null, inj.lifetimeCostHigh ?? null
    ).run();
    inserted.injuries++;

    // Procedure mappings
    const procs = (inj.procedures as Array<Record<string, unknown>>) || [];
    for (const pm of procs) {
      try {
        await env.DB.prepare(
          `INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          `map_${slug}_${pm.code}_${pm.phase}`, `inj_${slug}`, `proc_${pm.code}`,
          pm.phase, pm.isCommon ? 1 : 0, pm.typicalQty, pm.frequency ?? null, pm.notes ?? null
        ).run();
        inserted.mappings++;
      } catch { inserted.skipped++; }
    }

    // Severity maps
    const sevs = (inj.severityMap as Array<Record<string, unknown>>) || [];
    for (const sv of sevs) {
      if ((sv.likelihood as number) > 0) {
        await env.DB.prepare(
          `INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood) VALUES (?, ?, ?, ?)`
        ).bind(`sev_${slug}_${sv.crashSeverity}`, `inj_${slug}`, sv.crashSeverity, sv.likelihood).run();
        inserted.severity++;
      }
    }
  }

  // 4. WISQARS
  for (let i = 0; i < data.wisqars.length; i++) {
    const w = data.wisqars[i];
    await env.DB.prepare(
      `INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
       VALUES (?, 'WISQARS', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      `wisqars_${i}`, w.year, w.mechanism, w.intent, w.outcome,
      w.medicalCostAvg, w.medicalCostTotal, w.workLossCostAvg, w.workLossCostTotal,
      w.qualityLifeCost, w.combinedCostAvg, w.combinedCostTotal, w.numberOfCases
    ).run();
    inserted.wisqars++;
  }

  // 5. NHTSA
  for (let i = 0; i < data.nhtsa.length; i++) {
    const n = data.nhtsa[i];
    const workLoss = (n.marketProductivity as number) + (n.householdProductivity as number);
    await env.DB.prepare(
      `INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
       VALUES (?, 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', ?, ?, ?, ?, ?)`
    ).bind(`nhtsa_${i}`, n.severity, n.medicalCost, workLoss, n.totalEconomicCost, n.qualityAdjustedLifeYear).run();
    inserted.nhtsa++;
  }

  // Re-enable FK checks
  await env.DB.prepare("PRAGMA foreign_keys = ON").run();

  return success({ message: "Seed complete", inserted }, cors);
}
