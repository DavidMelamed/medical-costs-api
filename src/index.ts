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
      if (path === "/api/drg") return handleDrgList(url, env, cors);
      if (path === "/api/settlement-estimate") return handleSettlementEstimate(url, env, cors);
      if (path === "/api/metrics") return handleMetrics(env, cors);
      if (path === "/api/metrics/facts") return handleMetricsFacts(env, cors);
      if (path === "/api/search") return handleUnifiedSearch(url, env, cors);
      if (path === "/api/body-systems") return handleBodySystems(env, cors);
      if (path === "/api/hospitals") return handleHospitals(url, env, cors);

      // Body system detail
      const bodySystemMatch = path.match(/^\/api\/body-systems\/([^/]+)$/);
      if (bodySystemMatch) return handleBodySystemDetail(decodeURIComponent(bodySystemMatch[1]), url, env, cors);

      // Alternatives for a procedure
      const alternativesMatch = path.match(/^\/api\/alternatives\/([^/]+)$/);
      if (alternativesMatch) return handleAlternatives(decodeURIComponent(alternativesMatch[1]), env, cors);

      // Medications for a condition
      const medicationsMatch = path.match(/^\/api\/medications\/([^/]+)$/);
      if (medicationsMatch) return handleMedications(decodeURIComponent(medicationsMatch[1]), env, cors);

      // Parameterized routes
      const graphMatch = path.match(/^\/api\/graph\/([^/]+)\/(.+)$/);
      if (graphMatch) return handleGraph(decodeURIComponent(graphMatch[1]), decodeURIComponent(graphMatch[2]), url, env, cors);

      const drgMatch = path.match(/^\/api\/drg\/([^/]+)$/);
      if (drgMatch) return handleDrgDetail(decodeURIComponent(drgMatch[1]), env, cors);

      const procBySlugMatch = path.match(/^\/api\/procedures\/by-slug\/([^/]+)$/);
      if (procBySlugMatch) return handleProcedureBySlug(decodeURIComponent(procBySlugMatch[1]), env, cors);

      const relatedMatch = path.match(/^\/api\/related\/([^/]+)$/);
      if (relatedMatch) return handleRelatedProcedures(decodeURIComponent(relatedMatch[1]), env, cors);

      const consumerMatch = path.match(/^\/api\/procedures\/([^/]+)\/consumer$/);
      if (consumerMatch) return handleConsumerDescription(decodeURIComponent(consumerMatch[1]), env, cors);

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
        "GET /api/drg",
        "GET /api/drg/:code",
        "GET /api/graph/:type/:id",
        "GET /api/settlement-estimate",
        "GET /api/metrics",
        "GET /api/metrics/facts",
        "GET /api/procedures/by-slug/:slug",
        "GET /api/procedures/:code/consumer",
        "GET /api/related/:code",
        "GET /api/search?q=term",
        "GET /api/hospitals?state=CO&drg=470",
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

  // Consumer-friendly description
  const consumer = await env.DB.prepare(
    `SELECT consumer_name AS consumerName, plain_description AS plainDescription,
            what_to_expect AS whatToExpect, typical_duration AS typicalDuration,
            common_reasons AS commonReasons, preparation_tips AS preparationTips
     FROM consumer_descriptions WHERE code = ?1`,
  ).bind(code).first();

  // Compute commercial estimates from national rates
  const nationalRate = ((proc as Record<string, unknown>).nationalFacilityRate as number) || 0;
  const commercialEstimates = {
    low: Math.round(nationalRate * 1.5 * 100) / 100,
    high: Math.round(nationalRate * 2.5 * 100) / 100,
  };

  return success({ ...proc, commercialEstimates, geographicCosts: geoCosts, injuryMappings, consumerDescription: consumer || null }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/procedures/:code/consumer
// ---------------------------------------------------------------------------

async function handleConsumerDescription(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  // Try to get consumer description
  const consumer = await env.DB.prepare(
    `SELECT cd.code, cd.consumer_name AS consumerName, cd.plain_description AS plainDescription,
            cd.what_to_expect AS whatToExpect, cd.typical_duration AS typicalDuration,
            cd.common_reasons AS commonReasons, cd.preparation_tips AS preparationTips
     FROM consumer_descriptions cd WHERE cd.code = ?1`,
  ).bind(code).first();

  // Fall back to CMS description if no consumer entry
  if (!consumer) {
    const proc = await env.DB.prepare(
      `SELECT code, description, category, body_system AS bodySystem
       FROM medical_procedures WHERE code = ?1`,
    ).bind(code).first();

    if (!proc) return error("Procedure not found", 404, cors);

    return success({
      code: (proc as Record<string, unknown>).code,
      consumerName: null,
      cmsDescription: (proc as Record<string, unknown>).description,
      plainDescription: null,
      whatToExpect: null,
      typicalDuration: null,
      commonReasons: null,
      preparationTips: null,
      source: "cms",
    }, cors);
  }

  // Also get CMS description for reference
  const proc = await env.DB.prepare(
    `SELECT description FROM medical_procedures WHERE code = ?1`,
  ).bind(code).first();

  return success({
    ...consumer,
    cmsDescription: proc ? (proc as Record<string, unknown>).description : null,
    source: "consumer",
  }, cors);
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

  // Procedure mappings grouped by phase (with consumer-friendly names)
  const { results: mappings } = await env.DB.prepare(
    `SELECT
       ipm.phase, ipm.is_common AS isCommon, ipm.typical_qty AS typicalQty,
       ipm.frequency, ipm.notes,
       mp.code, mp.code_type AS codeType, mp.description,
       cd.consumer_name AS consumerName,
       mp.national_facility_rate AS medicareRate,
       mp.category, mp.body_system AS bodySystem
     FROM injury_procedure_mappings ipm
     JOIN medical_procedures mp ON mp.id = ipm.procedure_id
     LEFT JOIN consumer_descriptions cd ON cd.code = mp.code
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
// GET /api/drg — List all DRGs
// ---------------------------------------------------------------------------

async function handleDrgList(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const search = url.searchParams.get("search");
  const type = url.searchParams.get("type"); // SURG or MED
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 1), 500);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);

  // Get DRGs from CMS_MSDRG source (has best coverage with payment + LOS)
  const conditions: string[] = ["source = 'CMS_MSDRG'"];
  const params: unknown[] = [];

  if (search) {
    conditions.push(`(drg_code LIKE ?${params.length + 1} OR drg_description LIKE ?${params.length + 1})`);
    params.push(`%${search}%`);
  }
  if (type) {
    conditions.push(`severity = ?${params.length + 1}`);
    params.push(type);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countResult = await env.DB.prepare(
    `SELECT COUNT(*) as total FROM drg_cost_data ${where}`
  ).bind(...params).first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const { results } = await env.DB.prepare(
    `SELECT
       drg_code AS drgCode, drg_description AS description, severity AS type,
       avg_length_of_stay AS avgLengthOfStay,
       avg_medicare_payment AS avgMedicarePayment,
       avg_total_charges AS avgTotalCharges,
       avg_total_costs AS avgTotalCosts,
       total_discharges AS totalDischarges,
       year, source
     FROM drg_cost_data ${where}
     ORDER BY drg_code
     LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`
  ).bind(...params, limit, offset).all();

  return success(results, cors, { pagination: { total, limit, offset } });
}

// ---------------------------------------------------------------------------
// GET /api/drg/:code — DRG detail
// ---------------------------------------------------------------------------

async function handleDrgDetail(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  // Get CMS MS-DRG data (weights, LOS, payment)
  const msdrg = await env.DB.prepare(
    `SELECT
       drg_code AS drgCode, drg_description AS description, severity AS type,
       avg_length_of_stay AS avgLengthOfStay,
       avg_medicare_payment AS avgMedicarePayment,
       total_discharges AS totalDischarges,
       year, source
     FROM drg_cost_data
     WHERE drg_code = ?1 AND source = 'CMS_MSDRG'`
  ).bind(code).first();

  if (!msdrg) return error("DRG not found", 404, cors);

  // Get CMS Inpatient national data
  const cmsInpatient = await env.DB.prepare(
    `SELECT
       drg_code AS drgCode, drg_description AS description,
       total_discharges AS totalDischarges,
       avg_total_charges AS avgTotalCharges,
       avg_total_costs AS avgTotalCosts,
       avg_medicare_payment AS avgMedicarePayment,
       year, source
     FROM drg_cost_data
     WHERE drg_code = ?1 AND source = 'CMS_INPATIENT'`
  ).bind(code).first();

  // Get NY SPARCS data by severity
  const { results: sparcsData } = await env.DB.prepare(
    `SELECT
       severity,
       total_discharges AS totalDischarges,
       avg_length_of_stay AS avgLengthOfStay,
       avg_total_charges AS avgTotalCharges,
       avg_total_costs AS avgTotalCosts,
       median_charges AS medianCharges,
       median_costs AS medianCosts,
       year
     FROM drg_cost_data
     WHERE drg_code = ?1 AND source = 'NY_SPARCS'
     ORDER BY severity`
  ).bind(code).all();

  return success(
    {
      ...msdrg,
      cmsInpatient: cmsInpatient || null,
      nySparcs: sparcsData,
      disclaimer: DISCLAIMER,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// Settlement multiplier data (from insurance research)
// ---------------------------------------------------------------------------

const INJURY_MULTIPLIERS: Record<string, {
  mild: [number, number];
  moderate: [number, number];
  severe: [number, number];
  catastrophic: [number, number];
  recoveryWeeks: { mild: number; moderate: number; severe: number; catastrophic: number };
}> = {
  'whiplash-cervical-strain': {
    mild: [1.5, 2.0], moderate: [2.5, 3.5], severe: [3.5, 5.0], catastrophic: [5.0, 7.0],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 52, catastrophic: 104 }
  },
  'traumatic-brain-injury': {
    mild: [2.0, 3.0], moderate: [3.5, 5.0], severe: [5.0, 7.0], catastrophic: [6.0, 8.0],
    recoveryWeeks: { mild: 8, moderate: 26, severe: 104, catastrophic: 260 }
  },
  'lumbar-thoracic-spine-injury': {
    mild: [1.5, 2.5], moderate: [2.5, 4.0], severe: [3.5, 5.0], catastrophic: [5.0, 7.0],
    recoveryWeeks: { mild: 8, moderate: 24, severe: 52, catastrophic: 104 }
  },
  'spinal-cord-injury': {
    mild: [3.0, 4.0], moderate: [4.0, 5.5], severe: [5.0, 7.0], catastrophic: [6.0, 8.0],
    recoveryWeeks: { mild: 26, moderate: 52, severe: 260, catastrophic: 520 }
  },
  'extremity-fractures': {
    mild: [1.5, 2.5], moderate: [2.5, 3.5], severe: [3.5, 5.0], catastrophic: [5.0, 7.0],
    recoveryWeeks: { mild: 8, moderate: 16, severe: 40, catastrophic: 78 }
  },
  'rib-chest-fractures': {
    mild: [1.5, 2.0], moderate: [2.0, 3.0], severe: [3.0, 4.5], catastrophic: [4.5, 6.0],
    recoveryWeeks: { mild: 6, moderate: 12, severe: 26, catastrophic: 52 }
  },
  'internal-organ-injuries': {
    mild: [2.5, 3.5], moderate: [3.5, 5.0], severe: [4.5, 6.0], catastrophic: [5.5, 7.0],
    recoveryWeeks: { mild: 8, moderate: 20, severe: 52, catastrophic: 104 }
  },
  'soft-tissue-contusions': {
    mild: [1.5, 2.0], moderate: [2.0, 2.5], severe: [2.5, 3.5], catastrophic: [3.5, 5.0],
    recoveryWeeks: { mild: 2, moderate: 6, severe: 16, catastrophic: 30 }
  },
  'knee-ligament-tears': {
    mild: [2.0, 2.5], moderate: [2.5, 3.5], severe: [3.5, 5.0], catastrophic: [5.0, 7.0],
    recoveryWeeks: { mild: 8, moderate: 26, severe: 52, catastrophic: 78 }
  },
  'shoulder-injuries': {
    mild: [1.5, 2.5], moderate: [2.5, 3.5], severe: [3.0, 4.5], catastrophic: [4.5, 6.0],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 40, catastrophic: 60 }
  },
  'facial-jaw-fractures': {
    mild: [2.0, 3.0], moderate: [3.0, 4.0], severe: [4.0, 5.5], catastrophic: [5.5, 7.0],
    recoveryWeeks: { mild: 6, moderate: 16, severe: 40, catastrophic: 60 }
  },
  'burns': {
    mild: [2.0, 3.0], moderate: [3.0, 4.5], severe: [4.5, 7.0], catastrophic: [6.0, 8.0],
    recoveryWeeks: { mild: 4, moderate: 16, severe: 52, catastrophic: 104 }
  },
  'pedestrian-impact-injuries': {
    mild: [2.0, 3.0], moderate: [3.0, 4.5], severe: [4.5, 6.5], catastrophic: [6.0, 8.0],
    recoveryWeeks: { mild: 8, moderate: 24, severe: 52, catastrophic: 104 }
  },
  'bicycle-crash-injuries': {
    mild: [2.0, 3.0], moderate: [3.0, 4.0], severe: [4.0, 6.0], catastrophic: [5.5, 7.5],
    recoveryWeeks: { mild: 6, moderate: 20, severe: 52, catastrophic: 78 }
  },
};

// Default multipliers for injuries not in the map
const DEFAULT_MULTIPLIERS = {
  mild: [1.5, 2.0] as [number, number],
  moderate: [2.0, 3.0] as [number, number],
  severe: [3.0, 5.0] as [number, number],
  catastrophic: [5.0, 7.0] as [number, number],
  recoveryWeeks: { mild: 6, moderate: 16, severe: 40, catastrophic: 78 },
};

// US Bureau of Labor Statistics, Q1 2026
const MEDIAN_WEEKLY_WAGE = 1_200; // ~$62,400/year

// ---------------------------------------------------------------------------
// GET /api/settlement-estimate
// ---------------------------------------------------------------------------

async function handleSettlementEstimate(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const injurySlug = url.searchParams.get("injury");
  const severity = url.searchParams.get("severity") || "moderate";
  const state = url.searchParams.get("state") || "CO";

  if (!injurySlug) {
    return error("injury parameter is required (slug from injury_categories)", 400, cors);
  }

  const validSeverities = ["mild", "moderate", "severe", "catastrophic"];
  if (!validSeverities.includes(severity)) {
    return error(`Invalid severity. Must be one of: ${validSeverities.join(", ")}`, 400, cors);
  }

  // Look up injury category
  const injury = await env.DB.prepare(
    `SELECT
       id, name, slug, description, body_region AS bodyRegion,
       crash_relevance AS crashRelevance,
       mild_cost_low AS mildCostLow, mild_cost_high AS mildCostHigh,
       moderate_cost_low AS moderateCostLow, moderate_cost_high AS moderateCostHigh,
       severe_cost_low AS severeCostLow, severe_cost_high AS severeCostHigh,
       lifetime_cost_low AS lifetimeCostLow, lifetime_cost_high AS lifetimeCostHigh
     FROM injury_categories WHERE slug = ?1`,
  ).bind(injurySlug).first();

  if (!injury) return error("Injury category not found", 404, cors);

  const injuryRec = injury as Record<string, unknown>;

  // Get medical costs for this severity
  let medicalCostLow: number;
  let medicalCostHigh: number;
  if (severity === "mild") {
    medicalCostLow = (injuryRec.mildCostLow as number) || 0;
    medicalCostHigh = (injuryRec.mildCostHigh as number) || 0;
  } else if (severity === "moderate") {
    medicalCostLow = (injuryRec.moderateCostLow as number) || 0;
    medicalCostHigh = (injuryRec.moderateCostHigh as number) || 0;
  } else if (severity === "severe") {
    medicalCostLow = (injuryRec.severeCostLow as number) || 0;
    medicalCostHigh = (injuryRec.severeCostHigh as number) || 0;
  } else {
    // catastrophic = lifetime
    medicalCostLow = (injuryRec.lifetimeCostLow as number) || 0;
    medicalCostHigh = (injuryRec.lifetimeCostHigh as number) || 0;
  }

  // Get multipliers for this injury
  const slug = injuryRec.slug as string;
  const multipliers = INJURY_MULTIPLIERS[slug] || DEFAULT_MULTIPLIERS;
  const severityKey = severity as keyof typeof multipliers;
  const [multLow, multHigh] = (multipliers[severityKey] as [number, number]) || DEFAULT_MULTIPLIERS[severityKey as keyof typeof DEFAULT_MULTIPLIERS];
  const recoveryWeeks = multipliers.recoveryWeeks[severityKey as keyof typeof multipliers.recoveryWeeks] || DEFAULT_MULTIPLIERS.recoveryWeeks[severityKey as keyof typeof DEFAULT_MULTIPLIERS.recoveryWeeks];

  // Lost wages: recovery weeks x weekly wage x 60% work impact
  const lostWagesLow = Math.round(recoveryWeeks * MEDIAN_WEEKLY_WAGE * 0.6);
  const lostWagesHigh = Math.round(recoveryWeeks * MEDIAN_WEEKLY_WAGE * 0.85);

  // Average medical cost for settlement calculation
  const medicalMid = (medicalCostLow + medicalCostHigh) / 2;

  // Economic damages = medical + lost wages
  const economicLow = medicalCostLow + lostWagesLow;
  const economicHigh = medicalCostHigh + lostWagesHigh;

  // Pain and suffering = (economic damages) x (multiplier - 1)
  // Total settlement = economic damages x multiplier
  const painSufferingLow = Math.round(economicLow * (multLow - 1));
  const painSufferingHigh = Math.round(economicHigh * (multHigh - 1));

  const totalSettlementLow = Math.round(economicLow * multLow);
  const totalSettlementHigh = Math.round(economicHigh * multHigh);

  // Get procedure-level cost breakdown by phase
  const { results: procedures } = await env.DB.prepare(
    `SELECT
       mp.code, mp.description, mp.category,
       mp.national_facility_rate AS medicareRate,
       ipm.phase, ipm.typical_qty AS typicalQty, ipm.is_common AS isCommon,
       g.facility_rate AS geoFacilityRate
     FROM injury_procedure_mappings ipm
     JOIN medical_procedures mp ON mp.id = ipm.procedure_id
     LEFT JOIN medical_cost_geographic g ON g.procedure_id = mp.id AND g.state_code = ?2
     WHERE ipm.injury_id = ?1
     ORDER BY ipm.phase, mp.code`,
  ).bind(injuryRec.id, state).all();

  // Group costs by phase
  const phaseCosts: Record<string, number> = {};
  for (const p of procedures) {
    const rec = p as Record<string, unknown>;
    const phase = (rec.phase as string) || "ACUTE";
    const rate = (rec.geoFacilityRate as number) || (rec.medicareRate as number) || 0;
    const qty = (rec.typicalQty as number) || 1;
    const cost = rate * qty * 2.0; // Use 2x Medicare as typical commercial rate
    phaseCosts[phase] = (phaseCosts[phase] || 0) + cost;
  }

  return success(
    {
      injury: {
        name: injuryRec.name,
        slug: injuryRec.slug,
        bodyRegion: injuryRec.bodyRegion,
        crashRelevance: injuryRec.crashRelevance,
        description: injuryRec.description,
      },
      severity,
      state,
      medicalCosts: {
        low: medicalCostLow,
        high: medicalCostHigh,
        byPhase: phaseCosts,
        source: "MedicalCosts.info — CMS Medicare PFS 2026 rates",
        note: "Commercial insurance rates are typically 1.5-2.5x Medicare",
      },
      lostWages: {
        recoveryWeeks,
        weeklyWage: MEDIAN_WEEKLY_WAGE,
        workImpactFactor: "60-85%",
        low: lostWagesLow,
        high: lostWagesHigh,
      },
      settlement: {
        economicDamagesLow: economicLow,
        economicDamagesHigh: economicHigh,
        multiplierLow: multLow,
        multiplierHigh: multHigh,
        painAndSufferingLow: painSufferingLow,
        painAndSufferingHigh: painSufferingHigh,
        totalEstimateLow: totalSettlementLow,
        totalEstimateHigh: totalSettlementHigh,
      },
      methodology: {
        formula: "Total Settlement = (Medical Bills + Lost Wages) x Severity Multiplier",
        multiplierMethod: "Based on insurance industry standard multiplier method used by adjusters and attorneys",
        medicalCostBasis: "CMS Medicare Physician Fee Schedule 2026, adjusted to commercial rates (1.5-2.5x)",
        lostWageBasis: `US Bureau of Labor Statistics median weekly wage ($${MEDIAN_WEEKLY_WAGE}/week) x recovery period x work impact factor`,
        sources: [
          "CMS Medicare Physician Fee Schedule CY2026",
          "Insurance Research Council 2025",
          "US Bureau of Labor Statistics Q1 2026",
        ],
      },
      attorneyImpact: {
        withoutAttorney: 17600,
        withAttorney: 77600,
        multiplier: 4.4,
        source: "Insurance Research Council 2025",
      },
      disclaimer: "These are estimates only based on statistical averages and the multiplier method commonly used in the insurance industry. " +
        "Every case is unique. Actual settlement values depend on liability, insurance coverage, jurisdiction, " +
        "attorney representation, and many other factors. This is not legal advice. Consult a qualified attorney.",
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/graph/:type/:id — Knowledge graph relationships for an entity
// ---------------------------------------------------------------------------

async function handleGraph(entityType: string, entityId: string, url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const validTypes = ["procedure", "condition", "body_system", "drug", "category"];
  if (!validTypes.includes(entityType)) {
    return error(`Invalid entity type. Must be one of: ${validTypes.join(", ")}`, 400, cors);
  }

  const relationship = url.searchParams.get("relationship");
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);

  // Get outgoing relationships (this entity as source)
  const outConditions = ["source_type = ?1", "source_id = ?2"];
  const outParams: unknown[] = [entityType, entityId];
  if (relationship) {
    outConditions.push(`relationship = ?3`);
    outParams.push(relationship);
  }

  const { results: outgoing } = await env.DB.prepare(
    `SELECT id, relationship, target_type AS targetType, target_id AS targetId, weight
     FROM entity_relationships
     WHERE ${outConditions.join(" AND ")}
     ORDER BY weight DESC
     LIMIT ?${outParams.length + 1}`,
  ).bind(...outParams, limit).all();

  // Get incoming relationships (this entity as target)
  const inConditions = ["target_type = ?1", "target_id = ?2"];
  const inParams: unknown[] = [entityType, entityId];
  if (relationship) {
    inConditions.push(`relationship = ?3`);
    inParams.push(relationship);
  }

  const { results: incoming } = await env.DB.prepare(
    `SELECT id, relationship, source_type AS sourceType, source_id AS sourceId, weight
     FROM entity_relationships
     WHERE ${inConditions.join(" AND ")}
     ORDER BY weight DESC
     LIMIT ?${inParams.length + 1}`,
  ).bind(...inParams, limit).all();

  // Group by relationship type
  const grouped: Record<string, unknown[]> = {};
  for (const rel of outgoing) {
    const r = rel as Record<string, unknown>;
    const key = r.relationship as string;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ type: r.targetType, id: r.targetId, weight: r.weight, direction: "outgoing" });
  }
  for (const rel of incoming) {
    const r = rel as Record<string, unknown>;
    const key = r.relationship as string;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ type: r.sourceType, id: r.sourceId, weight: r.weight, direction: "incoming" });
  }

  return success(
    {
      entity: { type: entityType, id: entityId },
      relationships: grouped,
      totalOutgoing: outgoing.length,
      totalIncoming: incoming.length,
    },
    cors,
  );
}

// ---------------------------------------------------------------------------
// GET /api/metrics — Aggregate metrics and interesting facts
// ---------------------------------------------------------------------------

async function handleMetrics(env: Env, cors: Record<string, string>): Promise<Response> {
  const [allMetrics, facts] = await Promise.all([
    env.DB.prepare(
      `SELECT metric_type, metric_key, metric_value, label, detail
       FROM aggregate_metrics
       ORDER BY metric_type, metric_value DESC`,
    ).all(),
    env.DB.prepare(
      `SELECT metric_key, metric_value, label, detail
       FROM aggregate_metrics
       WHERE metric_type = 'interesting_fact'
       ORDER BY metric_key`,
    ).all(),
  ]);

  // Group metrics by type
  const grouped: Record<string, unknown[]> = {};
  for (const row of allMetrics.results) {
    const r = row as Record<string, unknown>;
    const type = r.metric_type as string;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push({
      key: r.metric_key,
      value: r.metric_value,
      label: r.label,
      detail: r.detail,
    });
  }

  return success({ metrics: grouped, facts: facts.results }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/metrics/facts — Just the interesting facts
// ---------------------------------------------------------------------------

async function handleMetricsFacts(env: Env, cors: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT metric_key AS key, metric_value AS value, label, detail
     FROM aggregate_metrics
     WHERE metric_type = 'interesting_fact'
     ORDER BY metric_key`,
  ).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/procedures/by-slug/:slug — Lookup by human-readable slug
// ---------------------------------------------------------------------------

async function handleProcedureBySlug(slug: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const slugRow = await env.DB.prepare(
    `SELECT code FROM procedure_slugs WHERE slug = ?1`,
  ).bind(slug).first<{ code: string }>();

  if (!slugRow) return error("Procedure slug not found", 404, cors);

  // Delegate to the existing detail handler
  return handleProcedureDetail(slugRow.code, env, cors);
}

// ---------------------------------------------------------------------------
// GET /api/related/:code — Related procedures (same category, body system, cost range)
// ---------------------------------------------------------------------------

async function handleRelatedProcedures(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const proc = await env.DB.prepare(
    `SELECT id, code, category, body_system, national_facility_rate
     FROM medical_procedures WHERE code = ?1`,
  ).bind(code).first();

  if (!proc) return error("Procedure not found", 404, cors);

  const p = proc as Record<string, unknown>;
  const rate = (p.national_facility_rate as number) || 0;
  const rateLow = rate * 0.5;
  const rateHigh = rate * 2.0;

  // Find related by same category OR same body system, within 0.5x-2x cost range, excluding self
  const { results } = await env.DB.prepare(
    `SELECT
       mp.code, mp.description, mp.category, mp.body_system AS bodySystem,
       mp.national_facility_rate AS nationalFacilityRate,
       ps.slug,
       CASE
         WHEN mp.category = ?2 AND mp.body_system = ?3 THEN 3
         WHEN mp.category = ?2 THEN 2
         WHEN mp.body_system = ?3 THEN 1
         ELSE 0
       END AS relevance
     FROM medical_procedures mp
     LEFT JOIN procedure_slugs ps ON ps.code = mp.code
     WHERE mp.code != ?1
       AND (mp.category = ?2 OR mp.body_system = ?3)
       AND mp.national_facility_rate BETWEEN ?4 AND ?5
       AND mp.national_facility_rate IS NOT NULL
     ORDER BY relevance DESC, ABS(mp.national_facility_rate - ?6) ASC
     LIMIT 10`,
  ).bind(code, p.category, p.body_system, rateLow, rateHigh, rate).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals?state=CO&drg=470 — Hospital-level DRG costs
// ---------------------------------------------------------------------------

async function handleHospitals(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const state = url.searchParams.get("state");
  const drg = url.searchParams.get("drg");
  const provider = url.searchParams.get("provider");
  const search = url.searchParams.get("search");
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);
  const sort = url.searchParams.get("sort") || "charges_desc";

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (state) {
    conditions.push(`provider_state = ?${paramIdx}`);
    params.push(state.toUpperCase());
    paramIdx++;
  }
  if (drg) {
    conditions.push(`drg_code = ?${paramIdx}`);
    params.push(drg);
    paramIdx++;
  }
  if (provider) {
    conditions.push(`provider_ccn = ?${paramIdx}`);
    params.push(provider);
    paramIdx++;
  }
  if (search) {
    conditions.push(`(provider_name LIKE ?${paramIdx} OR drg_description LIKE ?${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderMap: Record<string, string> = {
    charges_desc: "avg_covered_charges DESC",
    charges_asc: "avg_covered_charges ASC",
    payments_desc: "avg_total_payments DESC",
    payments_asc: "avg_total_payments ASC",
    markup_desc: "CASE WHEN avg_total_payments > 0 THEN avg_covered_charges / avg_total_payments ELSE 0 END DESC",
    discharges_desc: "total_discharges DESC",
    name_asc: "provider_name ASC",
  };
  const orderBy = orderMap[sort] || "avg_covered_charges DESC";

  const countStmt = env.DB.prepare(`SELECT COUNT(*) as total FROM hospital_drg_costs ${where}`).bind(...params);
  const countResult = await countStmt.first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const dataStmt = env.DB.prepare(
    `SELECT
       provider_ccn AS providerCcn,
       provider_name AS providerName,
       provider_city AS providerCity,
       provider_state AS providerState,
       provider_zip AS providerZip,
       drg_code AS drgCode,
       drg_description AS drgDescription,
       total_discharges AS totalDischarges,
       avg_covered_charges AS avgCoveredCharges,
       avg_total_payments AS avgTotalPayments,
       avg_medicare_payments AS avgMedicarePayments,
       CASE WHEN avg_total_payments > 0 THEN ROUND(avg_covered_charges / avg_total_payments, 2) ELSE NULL END AS chargeToPaymentRatio,
       year
     FROM hospital_drg_costs
     ${where}
     ORDER BY ${orderBy}
     LIMIT ?${paramIdx} OFFSET ?${paramIdx + 1}`,
  ).bind(...params, limit, offset);

  const { results } = await dataStmt.all();

  // Compute summary stats if filtering by DRG
  let summary = null;
  if (drg && state) {
    const summaryStmt = env.DB.prepare(
      `SELECT
         COUNT(*) AS hospitalCount,
         SUM(total_discharges) AS totalDischarges,
         ROUND(AVG(avg_covered_charges), 2) AS avgCharges,
         ROUND(MIN(avg_covered_charges), 2) AS minCharges,
         ROUND(MAX(avg_covered_charges), 2) AS maxCharges,
         ROUND(AVG(avg_total_payments), 2) AS avgPayments,
         ROUND(AVG(avg_medicare_payments), 2) AS avgMedicare,
         ROUND(AVG(CASE WHEN avg_total_payments > 0 THEN avg_covered_charges / avg_total_payments ELSE NULL END), 2) AS avgChargeToPaymentRatio
       FROM hospital_drg_costs
       ${where}`,
    ).bind(...params);
    summary = await summaryStmt.first();
  }

  return success(results, cors, {
    pagination: { total, limit, offset },
    ...(summary ? { summary } : {}),
    disclaimer: "Hospital charges reflect list prices before insurance negotiations. Actual patient costs depend on insurance, deductibles, and negotiated rates.",
  });
}

// ---------------------------------------------------------------------------
// GET /api/search?q=term — Unified search across procedures, conditions, drugs
// ---------------------------------------------------------------------------

async function handleUnifiedSearch(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const q = url.searchParams.get("q");
  if (!q || q.length < 2) return error("Query parameter 'q' is required (min 2 chars)", 400, cors);

  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "20", 10) || 20, 1), 50);
  const searchTerm = `%${q}%`;

  // Search procedures (non-drug) — also search consumer-friendly names
  const proceduresPromise = env.DB.prepare(
    `SELECT mp.code, mp.description, mp.category, mp.body_system AS bodySystem,
            mp.national_facility_rate AS nationalFacilityRate, ps.slug,
            cd.consumer_name AS consumerName,
            'procedure' AS resultType
     FROM medical_procedures mp
     LEFT JOIN procedure_slugs ps ON ps.code = mp.code
     LEFT JOIN consumer_descriptions cd ON cd.code = mp.code
     WHERE (mp.code LIKE ?1 OR mp.description LIKE ?1 OR cd.consumer_name LIKE ?1)
       AND mp.category NOT LIKE 'Prescription Drug%'
     ORDER BY mp.national_facility_rate DESC
     LIMIT ?2`,
  ).bind(searchTerm, limit).all();

  // Search drugs — also search consumer-friendly names
  const drugsPromise = env.DB.prepare(
    `SELECT mp.code, mp.description, mp.category, mp.body_system AS bodySystem,
            mp.national_facility_rate AS nationalFacilityRate, ps.slug,
            cd.consumer_name AS consumerName,
            'drug' AS resultType
     FROM medical_procedures mp
     LEFT JOIN procedure_slugs ps ON ps.code = mp.code
     LEFT JOIN consumer_descriptions cd ON cd.code = mp.code
     WHERE (mp.code LIKE ?1 OR mp.description LIKE ?1 OR cd.consumer_name LIKE ?1)
       AND mp.category LIKE 'Prescription Drug%'
     ORDER BY mp.national_facility_rate DESC
     LIMIT ?2`,
  ).bind(searchTerm, limit).all();

  // Search conditions (injury categories)
  const conditionsPromise = env.DB.prepare(
    `SELECT name, slug, description, body_region AS bodyRegion,
            crash_relevance AS crashRelevance,
            moderate_cost_low AS moderateCostLow, moderate_cost_high AS moderateCostHigh,
            'condition' AS resultType
     FROM injury_categories
     WHERE name LIKE ?1 OR description LIKE ?1
     ORDER BY name
     LIMIT ?2`,
  ).bind(searchTerm, limit).all();

  const [procedures, drugs, conditions] = await Promise.all([
    proceduresPromise,
    drugsPromise,
    conditionsPromise,
  ]);

  return success(
    {
      procedures: procedures.results,
      drugs: drugs.results,
      conditions: conditions.results,
      query: q,
    },
    cors,
  );
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

// ---------------------------------------------------------------------------
// GET /api/body-systems — list all body systems with aggregate stats
// ---------------------------------------------------------------------------

async function handleBodySystems(env: Env, cors: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare(`
    SELECT
      body_system AS bodySystem,
      COUNT(*) AS procedureCount,
      ROUND(AVG(national_facility_rate), 2) AS avgCost,
      MAX(national_facility_rate) AS maxCost,
      MIN(national_facility_rate) AS minCost
    FROM medical_procedures
    WHERE body_system IS NOT NULL AND national_facility_rate IS NOT NULL
    GROUP BY body_system
    ORDER BY body_system
  `).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/body-systems/:slug — body system detail with procedures, conditions, drugs
// ---------------------------------------------------------------------------

async function handleBodySystemDetail(slug: string, url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  // Convert slug to body_system name (e.g., "musculoskeletal" -> "Musculoskeletal")
  const bodySystemName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('/');
  // Also try simpler title case
  const simpleTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10), 500);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  // Get procedures for this body system
  const { results: procedures } = await env.DB.prepare(`
    SELECT
      p.id, p.code, p.code_type AS codeType, p.description, p.category,
      p.body_system AS bodySystem, p.national_facility_rate AS nationalFacilityRate,
      p.national_non_fac_rate AS nationalNonFacRate,
      p.hospital_outpatient_cost AS hospitalOutpatientCost,
      p.asc_cost AS ascCost,
      ps.slug
    FROM medical_procedures p
    LEFT JOIN procedure_slugs ps ON ps.code = p.code
    WHERE (p.body_system = ?1 OR p.body_system = ?2)
      AND p.category NOT LIKE 'Prescription Drug%'
    ORDER BY p.national_facility_rate DESC
    LIMIT ?3 OFFSET ?4
  `).bind(bodySystemName, simpleTitle, limit, offset).all();

  // Count total
  const { results: countResult } = await env.DB.prepare(`
    SELECT COUNT(*) AS total FROM medical_procedures
    WHERE (body_system = ?1 OR body_system = ?2)
      AND category NOT LIKE 'Prescription Drug%'
  `).bind(bodySystemName, simpleTitle).all();
  const total = (countResult[0] as any)?.total || 0;

  // Get conditions linked via injury_categories body_region
  const { results: conditions } = await env.DB.prepare(`
    SELECT id, name, slug, description, body_region AS bodyRegion,
           mild_cost_low AS mildCostLow, mild_cost_high AS mildCostHigh,
           moderate_cost_low AS moderateCostLow, moderate_cost_high AS moderateCostHigh,
           severe_cost_low AS severeCostLow, severe_cost_high AS severeCostHigh
    FROM injury_categories
    WHERE body_region LIKE '%' || ?1 || '%' OR body_region LIKE '%' || ?2 || '%'
    ORDER BY name
  `).bind(bodySystemName, simpleTitle).all();

  // Get related drugs (via treats_with_drug relationships to these conditions)
  const conditionSlugs = (conditions as any[]).map((c: any) => c.slug);
  let drugs: unknown[] = [];
  if (conditionSlugs.length > 0) {
    const placeholders = conditionSlugs.map((_, i) => `?${i + 1}`).join(',');
    const { results: drugResults } = await env.DB.prepare(`
      SELECT DISTINCT
        er.source_id AS drugCode,
        mp.description AS drugName,
        mp.national_facility_rate AS nadacPerUnit,
        mp.category AS drugCategory,
        er.target_id AS conditionSlug,
        er.weight
      FROM entity_relationships er
      JOIN medical_procedures mp ON mp.code = er.source_id
      WHERE er.relationship = 'treats_with_drug'
        AND er.target_id IN (${placeholders})
      ORDER BY er.weight DESC
      LIMIT 50
    `).bind(...conditionSlugs).all();
    drugs = drugResults;
  }

  // Aggregate stats
  const stats = {
    totalProcedures: total,
    totalConditions: conditions.length,
    totalDrugs: drugs.length,
    avgCost: procedures.length > 0 ? Math.round((procedures as any[]).reduce((sum: number, p: any) => sum + (p.nationalFacilityRate || 0), 0) / procedures.length) : 0,
    maxCostProcedure: procedures.length > 0 ? procedures[0] : null,
  };

  return success({
    bodySystem: bodySystemName === simpleTitle ? simpleTitle : bodySystemName,
    slug,
    procedures,
    conditions,
    drugs,
    stats,
    pagination: { total, limit, offset },
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/alternatives/:code — cheaper alternatives for a procedure
// ---------------------------------------------------------------------------

async function handleAlternatives(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  // Find alternatives where this procedure is the target (something is an alternative TO this)
  const { results: cheaperAlts } = await env.DB.prepare(`
    SELECT
      er.source_id AS altCode,
      er.weight,
      mp.description AS altDescription,
      mp.national_facility_rate AS altRate,
      mp.body_system AS altBodySystem,
      mp.category AS altCategory,
      ps.slug AS altSlug
    FROM entity_relationships er
    JOIN medical_procedures mp ON mp.code = er.source_id
    LEFT JOIN procedure_slugs ps ON ps.code = er.source_id
    WHERE er.relationship = 'alternative_to'
      AND er.target_id = ?1
      AND er.source_type = 'procedure'
    ORDER BY er.weight DESC
  `).bind(code).all();

  // Also find what this procedure is an alternative to (more expensive options)
  const { results: moreExpensive } = await env.DB.prepare(`
    SELECT
      er.target_id AS altCode,
      er.weight,
      mp.description AS altDescription,
      mp.national_facility_rate AS altRate,
      mp.body_system AS altBodySystem,
      mp.category AS altCategory,
      ps.slug AS altSlug
    FROM entity_relationships er
    JOIN medical_procedures mp ON mp.code = er.target_id
    LEFT JOIN procedure_slugs ps ON ps.code = er.target_id
    WHERE er.relationship = 'alternative_to'
      AND er.source_id = ?1
      AND er.source_type = 'procedure'
    ORDER BY er.weight DESC
  `).bind(code).all();

  // Get the current procedure's rate for comparison
  const { results: currentProc } = await env.DB.prepare(`
    SELECT national_facility_rate AS rate, description FROM medical_procedures WHERE code = ?1
  `).bind(code).all();
  const currentRate = (currentProc[0] as any)?.rate || 0;

  const alternatives = [
    ...(cheaperAlts as any[]).map((a: any) => ({
      ...a,
      direction: 'cheaper',
      savingsPercent: currentRate > 0 && a.altRate ? Math.round((1 - a.altRate / currentRate) * 100) : null,
    })),
    ...(moreExpensive as any[]).map((a: any) => ({
      ...a,
      direction: 'alternative_target',
      costDiffPercent: a.altRate && currentRate > 0 ? Math.round((a.altRate / currentRate - 1) * 100) : null,
    })),
  ];

  return success({
    code,
    currentRate,
    currentDescription: (currentProc[0] as any)?.description,
    alternatives,
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/medications/:conditionSlug — drugs that treat a condition
// ---------------------------------------------------------------------------

async function handleMedications(conditionSlug: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const { results: medications } = await env.DB.prepare(`
    SELECT
      er.source_id AS drugCode,
      mp.description AS drugName,
      mp.national_facility_rate AS nadacPerUnit,
      mp.national_non_fac_rate AS nationalNonFacRate,
      mp.category AS drugCategory,
      er.weight
    FROM entity_relationships er
    JOIN medical_procedures mp ON mp.code = er.source_id
    WHERE er.relationship = 'treats_with_drug'
      AND er.target_id = ?1
    ORDER BY er.weight DESC, mp.description
  `).bind(conditionSlug).all();

  return success({
    conditionSlug,
    medications,
    total: medications.length,
  }, cors);
}
