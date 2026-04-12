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
      if (path === "/api/hospitals/rankings") return handleHospitalRankings(url, env, cors);
      if (path === "/api/hospitals/states") return handleHospitalStates(env, cors);
      if (path === "/api/hospitals/best") return handleBestHospitals(url, env, cors);
      if (path === "/api/insurers") return handleInsurers(url, env, cors);
      if (path === "/api/trends") return handleTrends(env, cors);
      if (path === "/api/negotiated-rates") return handleNegotiatedRates(url, env, cors);
      if (path === "/api/bill-check") return handleBillCheck(url, env, cors);
      if (path === "/api/drugs/compare") return handleDrugCompare(url, env, cors);
      if (path === "/api/drugs/categories") return handleDrugCategories(env, cors);
      if (path === "/api/drugs/glp1") return handleGlp1Drugs(env, cors);
      if (path === "/api/insurance-plans") return handleInsurancePlans(url, env, cors);
      if (path === "/api/oop-calculator") return handleOopCalculator(url, env, cors);
      if (path === "/api/og") return handleOgImage(url, cors);

      // Embed HTML snippet
      const embedMatch = path.match(/^\/api\/embed\/([^/]+)$/);
      if (embedMatch) return handleEmbed(decodeURIComponent(embedMatch[1]), env, cors);

      // Auto insurance by state
      const autoInsMatch = path.match(/^\/api\/auto-insurance\/([a-zA-Z]{2})$/);
      if (autoInsMatch) return handleAutoInsurance(autoInsMatch[1].toUpperCase(), env, cors);

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

      const paaMatch = path.match(/^\/api\/paa\/([^/]+)$/);
      if (paaMatch) return handlePaa(decodeURIComponent(paaMatch[1]), env, cors);

      const consumerMatch = path.match(/^\/api\/procedures\/([^/]+)\/consumer$/);
      if (consumerMatch) return handleConsumerDescription(decodeURIComponent(consumerMatch[1]), env, cors);

      const procMatch = path.match(/^\/api\/procedures\/([^/]+)$/);
      if (procMatch) return handleProcedureDetail(decodeURIComponent(procMatch[1]), env, cors);

      const injuryEstMatch = path.match(/^\/api\/injuries\/([^/]+)\/estimate$/);
      if (injuryEstMatch) return handleInjuryEstimate(decodeURIComponent(injuryEstMatch[1]), url, env, cors);

      const injuryMatch = path.match(/^\/api\/injuries\/([^/]+)$/);
      if (injuryMatch) return handleInjuryDetail(decodeURIComponent(injuryMatch[1]), env, cors);

      // Hospital quality by provider ID
      const hospitalQualityMatch = path.match(/^\/api\/hospitals\/([^/]+)\/quality$/);
      if (hospitalQualityMatch) return handleHospitalQuality(decodeURIComponent(hospitalQualityMatch[1]), env, cors);

      // Hospital profile by CCN
      const hospitalProfileMatch = path.match(/^\/api\/hospitals\/profile\/([^/]+)$/);
      if (hospitalProfileMatch) return handleHospitalProfile(decodeURIComponent(hospitalProfileMatch[1]), env, cors);

      // Insurer detail by payer name
      const insurerDetailMatch = path.match(/^\/api\/insurers\/([^/]+)$/);
      if (insurerDetailMatch) return handleInsurerDetail(decodeURIComponent(insurerDetailMatch[1]), env, cors);

      // Hospital state DRGs
      const hospitalStateDrgsMatch = path.match(/^\/api\/hospitals\/([A-Z]{2})\/drgs$/);
      if (hospitalStateDrgsMatch) return handleHospitalStateDrgs(hospitalStateDrgsMatch[1], url, env, cors);

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
        "GET /api/hospitals/rankings?metric=charges&limit=10",
        "GET /api/hospitals/states",
        "GET /api/hospitals/:state/drgs",
        "GET /api/hospitals/profile/:ccn",
        "GET /api/insurers",
        "GET /api/insurers/:payerName",
        "GET /api/trends",
        "GET /api/negotiated-rates?code=99285",
        "GET /api/bill-check?code=99285&amount=2500&state=CO",
        "GET /api/drugs/compare?brand=ozempic",
        "GET /api/drugs/categories",
        "GET /api/drugs/glp1",
        "GET /api/og?title=MRI+Cost&price=$85&type=procedure",
        "GET /api/embed/:code",
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

// ---------------------------------------------------------------------------
// People Also Ask (PAA) — harvested from Google SERP
// ---------------------------------------------------------------------------
async function handlePaa(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT id, procedure_code AS procedureCode, query, question,
            answer_snippet AS answerSnippet, source_url AS sourceUrl,
            source_domain AS sourceDomain, position
     FROM people_also_ask
     WHERE procedure_code = ?1
     ORDER BY position ASC
     LIMIT 20`,
  ).bind(code).all();

  if (!results || results.length === 0) {
    return success([], cors);
  }

  return success(results, cors);
}

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
// GET /api/trends — Cost trend data (Medicare CF, Medical CPI, YoY changes)
// ---------------------------------------------------------------------------

async function handleTrends(env: Env, cors: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT metric, year, value, source
     FROM cost_trends
     WHERE metric IN ('medicare_conversion_factor', 'medical_cpi_annual_avg', 'medical_cpi_yoy_pct_change', 'medicare_cf_yoy_pct_change')
     ORDER BY metric, year`,
  ).all();

  // Group by metric
  const grouped: Record<string, Array<{ year: number; value: number; source: string }>> = {};
  for (const row of results) {
    const r = row as Record<string, unknown>;
    const metric = r.metric as string;
    if (!grouped[metric]) grouped[metric] = [];
    grouped[metric].push({
      year: r.year as number,
      value: r.value as number,
      source: r.source as string,
    });
  }

  return success(grouped, cors);
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
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 500);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);
  const sort = url.searchParams.get("sort") || "charges_desc";

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (state) {
    conditions.push(`h.provider_state = ?${paramIdx}`);
    params.push(state.toUpperCase());
    paramIdx++;
  }
  if (drg) {
    conditions.push(`h.drg_code = ?${paramIdx}`);
    params.push(drg);
    paramIdx++;
  }
  if (provider) {
    conditions.push(`h.provider_ccn = ?${paramIdx}`);
    params.push(provider);
    paramIdx++;
  }
  if (search) {
    conditions.push(`(h.provider_name LIKE ?${paramIdx} OR h.drg_description LIKE ?${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderMap: Record<string, string> = {
    charges_desc: "h.avg_covered_charges DESC",
    charges_asc: "h.avg_covered_charges ASC",
    payments_desc: "h.avg_total_payments DESC",
    payments_asc: "h.avg_total_payments ASC",
    markup_desc: "CASE WHEN h.avg_total_payments > 0 THEN h.avg_covered_charges / h.avg_total_payments ELSE 0 END DESC",
    discharges_desc: "h.total_discharges DESC",
    name_asc: "h.provider_name ASC",
    rating_desc: "hq.overall_rating DESC",
  };
  const orderBy = orderMap[sort] || "h.avg_covered_charges DESC";

  const countStmt = env.DB.prepare(`SELECT COUNT(*) as total FROM hospital_drg_costs h ${where}`).bind(...params);
  const countResult = await countStmt.first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const dataStmt = env.DB.prepare(
    `SELECT
       h.provider_ccn AS providerCcn,
       h.provider_name AS providerName,
       h.provider_city AS providerCity,
       h.provider_state AS providerState,
       h.provider_zip AS providerZip,
       h.drg_code AS drgCode,
       h.drg_description AS drgDescription,
       h.total_discharges AS totalDischarges,
       h.avg_covered_charges AS avgCoveredCharges,
       h.avg_total_payments AS avgTotalPayments,
       h.avg_medicare_payments AS avgMedicarePayments,
       CASE WHEN h.avg_total_payments > 0 THEN ROUND(h.avg_covered_charges / h.avg_total_payments, 2) ELSE NULL END AS chargeToPaymentRatio,
       h.year,
       hq.overall_rating AS qualityRating
     FROM hospital_drg_costs h
     LEFT JOIN hospital_quality hq ON h.provider_ccn = hq.provider_id
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
// GET /api/hospitals/rankings — National hospital rankings
// ---------------------------------------------------------------------------

async function handleHospitalRankings(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const metric = url.searchParams.get("metric") || "charges";
  const direction = url.searchParams.get("direction") || "desc";
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "10", 10) || 10, 1), 100);

  const orderMap: Record<string, string> = {
    charges: "avgCharges",
    payments: "avgPayments",
    markup: "avgMarkup",
    discharges: "totalDischarges",
    value: "avgMarkup",
  };
  const orderCol = orderMap[metric] || "avgCharges";
  const dir = direction === "asc" ? "ASC" : "DESC";
  const actualDir = metric === "value" ? "ASC" : dir;

  const { results } = await env.DB.prepare(`
    SELECT
      provider_ccn AS providerCcn,
      provider_name AS providerName,
      provider_city AS providerCity,
      provider_state AS providerState,
      COUNT(DISTINCT drg_code) AS drgCount,
      SUM(total_discharges) AS totalDischarges,
      ROUND(AVG(avg_covered_charges), 2) AS avgCharges,
      ROUND(AVG(avg_total_payments), 2) AS avgPayments,
      ROUND(AVG(avg_medicare_payments), 2) AS avgMedicare,
      ROUND(AVG(CASE WHEN avg_total_payments > 0 THEN avg_covered_charges / avg_total_payments ELSE NULL END), 2) AS avgMarkup
    FROM hospital_drg_costs
    GROUP BY provider_ccn
    HAVING COUNT(*) >= 5
    ORDER BY ${orderCol} ${actualDir}
    LIMIT ?1
  `).bind(limit).all();

  const stats = await env.DB.prepare(`
    SELECT
      COUNT(DISTINCT provider_ccn) AS totalHospitals,
      COUNT(DISTINCT provider_state) AS totalStates,
      COUNT(DISTINCT drg_code) AS totalDrgs,
      COUNT(*) AS totalRecords,
      SUM(total_discharges) AS totalDischarges,
      ROUND(AVG(avg_covered_charges), 2) AS nationalAvgCharges,
      ROUND(AVG(avg_total_payments), 2) AS nationalAvgPayments,
      ROUND(AVG(avg_medicare_payments), 2) AS nationalAvgMedicare
    FROM hospital_drg_costs
  `).first();

  return success({ rankings: results, national: stats }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals/states — All states with hospital counts
// ---------------------------------------------------------------------------

async function handleHospitalStates(env: Env, cors: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare(`
    SELECT
      provider_state AS state,
      COUNT(DISTINCT provider_ccn) AS hospitalCount,
      COUNT(DISTINCT drg_code) AS drgCount,
      SUM(total_discharges) AS totalDischarges,
      ROUND(AVG(avg_covered_charges), 2) AS avgCharges,
      ROUND(AVG(avg_total_payments), 2) AS avgPayments,
      ROUND(AVG(CASE WHEN avg_total_payments > 0 THEN avg_covered_charges / avg_total_payments ELSE NULL END), 2) AS avgMarkup
    FROM hospital_drg_costs
    GROUP BY provider_state
    ORDER BY provider_state ASC
  `).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals/:state/drgs — DRGs available in a state
// ---------------------------------------------------------------------------

async function handleHospitalStateDrgs(state: string, url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 1), 534);

  const { results } = await env.DB.prepare(`
    SELECT
      drg_code AS drgCode,
      drg_description AS drgDescription,
      COUNT(DISTINCT provider_ccn) AS hospitalCount,
      SUM(total_discharges) AS totalDischarges,
      ROUND(AVG(avg_covered_charges), 2) AS avgCharges,
      ROUND(AVG(avg_total_payments), 2) AS avgPayments,
      ROUND(AVG(avg_medicare_payments), 2) AS avgMedicare,
      ROUND(MIN(avg_covered_charges), 2) AS minCharges,
      ROUND(MAX(avg_covered_charges), 2) AS maxCharges
    FROM hospital_drg_costs
    WHERE provider_state = ?1
    GROUP BY drg_code
    ORDER BY SUM(total_discharges) DESC
    LIMIT ?2
  `).bind(state.toUpperCase(), limit).all();

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/insurers — Insurance company report card
// ---------------------------------------------------------------------------

async function handleInsurers(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);

  const { results: payers } = await env.DB.prepare(`
    SELECT
      payer_name AS payerName,
      COUNT(*) AS totalRates,
      COUNT(DISTINCT code) AS proceduresCovered,
      COUNT(DISTINCT hospital_name) AS hospitalCount,
      COUNT(DISTINCT hospital_state) AS stateCount,
      ROUND(AVG(negotiated_rate), 2) AS avgRate,
      ROUND(MIN(negotiated_rate), 2) AS minRate,
      ROUND(MAX(negotiated_rate), 2) AS maxRate
    FROM hospital_negotiated_rates
    WHERE negotiated_rate > 0
    GROUP BY payer_name
    HAVING COUNT(*) >= 10
    ORDER BY COUNT(*) DESC
    LIMIT ?1
  `).bind(limit).all();

  const stats = await env.DB.prepare(`
    SELECT
      COUNT(*) AS totalRates,
      COUNT(DISTINCT payer_name) AS totalPayers,
      COUNT(DISTINCT hospital_name) AS totalHospitals,
      COUNT(DISTINCT hospital_state) AS totalStates,
      ROUND(AVG(negotiated_rate), 2) AS overallAvgRate,
      ROUND(MIN(negotiated_rate), 2) AS overallMinRate,
      ROUND(MAX(negotiated_rate), 2) AS overallMaxRate
    FROM hospital_negotiated_rates
    WHERE negotiated_rate > 0
  `).first();

  const medicareBaseline = await env.DB.prepare(`
    SELECT ROUND(AVG(avg_medicare_payments), 2) AS avgMedicarePayment
    FROM hospital_drg_costs
  `).first();

  return success({
    payers,
    summary: stats,
    medicareBaseline,
    disclaimer: "Insurance rates shown are from hospital Machine-Readable Files (MRFs). Rates vary by plan, network tier, and specific contract terms."
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals/profile/:ccn — Hospital profile with all DRGs + negotiated rates
// ---------------------------------------------------------------------------

async function handleHospitalProfile(ccn: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const { results: drgs } = await env.DB.prepare(`
    SELECT
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
    WHERE provider_ccn = ?1
    ORDER BY total_discharges DESC
  `).bind(ccn).all();

  if (!drgs || drgs.length === 0) {
    return error("Hospital not found", 404, cors);
  }

  const hospital = {
    ccn,
    name: (drgs[0] as any).providerName,
    city: (drgs[0] as any).providerCity,
    state: (drgs[0] as any).providerState,
    zip: (drgs[0] as any).providerZip,
  };

  const totalDrgs = drgs.length;
  const totalDischarges = drgs.reduce((s: number, d: any) => s + (d.totalDischarges || 0), 0);
  const avgCharges = Math.round(drgs.reduce((s: number, d: any) => s + (d.avgCoveredCharges || 0), 0) / totalDrgs);
  const avgPayments = Math.round(drgs.reduce((s: number, d: any) => s + (d.avgTotalPayments || 0), 0) / totalDrgs);
  const avgMedicare = Math.round(drgs.reduce((s: number, d: any) => s + (d.avgMedicarePayments || 0), 0) / totalDrgs);
  const chargeToPaymentRatio = avgPayments > 0 ? Math.round((avgCharges / avgPayments) * 100) / 100 : null;

  const stateAvg = await env.DB.prepare(`
    SELECT
      ROUND(AVG(avg_covered_charges), 2) AS avgCharges,
      ROUND(AVG(avg_total_payments), 2) AS avgPayments,
      ROUND(AVG(avg_medicare_payments), 2) AS avgMedicare,
      ROUND(AVG(CASE WHEN avg_total_payments > 0 THEN avg_covered_charges / avg_total_payments ELSE NULL END), 2) AS avgMarkup,
      COUNT(DISTINCT provider_ccn) AS totalHospitals
    FROM hospital_drg_costs
    WHERE provider_state = ?1
  `).bind(hospital.state).first();

  const { results: negotiatedRates } = await env.DB.prepare(`
    SELECT
      payer_name AS payerName,
      code,
      code_type AS codeType,
      description,
      plan_name AS planName,
      negotiated_rate AS negotiatedRate,
      methodology,
      setting
    FROM hospital_negotiated_rates
    WHERE hospital_name LIKE ?1
    ORDER BY payer_name, negotiated_rate ASC
    LIMIT 500
  `).bind(`%${hospital.name}%`).all();

  const payerMap = new Map<string, { rates: number; sum: number; min: number; max: number; procedures: Set<string> }>();
  for (const r of negotiatedRates as any[]) {
    const existing = payerMap.get(r.payerName);
    if (existing) {
      existing.rates++;
      existing.sum += r.negotiatedRate;
      existing.min = Math.min(existing.min, r.negotiatedRate);
      existing.max = Math.max(existing.max, r.negotiatedRate);
      existing.procedures.add(r.code);
    } else {
      payerMap.set(r.payerName, {
        rates: 1, sum: r.negotiatedRate, min: r.negotiatedRate, max: r.negotiatedRate,
        procedures: new Set([r.code]),
      });
    }
  }

  const payerSummary = Array.from(payerMap.entries()).map(([name, data]) => ({
    payerName: name,
    totalRates: data.rates,
    avgRate: Math.round(data.sum / data.rates),
    minRate: data.min,
    maxRate: data.max,
    proceduresCovered: data.procedures.size,
  })).sort((a, b) => b.totalRates - a.totalRates);

  // Fetch quality data from hospital_quality table
  const quality = await env.DB.prepare(`
    SELECT
      provider_id AS providerId,
      hospital_name AS hospitalName,
      overall_rating AS overallRating,
      patient_experience_rating AS patientExperienceRating,
      readmission_rating AS readmissionRating,
      mortality_rating AS mortalityRating,
      safety_rating AS safetyRating,
      timeliness_rating AS timelinessRating,
      effectiveness_rating AS effectivenessRating,
      hospital_type AS hospitalType,
      ownership,
      emergency_services AS emergencyServices
    FROM hospital_quality
    WHERE provider_id = ?1
  `).bind(ccn).first();

  // Get state quality averages
  const stateQualityAvg = await env.DB.prepare(`
    SELECT
      ROUND(AVG(overall_rating), 2) AS avgRating,
      COUNT(*) AS totalHospitals,
      SUM(CASE WHEN overall_rating = 5 THEN 1 ELSE 0 END) AS fiveStarCount,
      SUM(CASE WHEN overall_rating >= 4 THEN 1 ELSE 0 END) AS fourPlusCount
    FROM hospital_quality
    WHERE state = ?1 AND overall_rating IS NOT NULL
  `).bind(hospital.state).first();

  return success({
    hospital,
    summary: { totalDrgs, totalDischarges, avgCharges, avgPayments, avgMedicare, chargeToPaymentRatio },
    quality: quality || null,
    stateAverage: stateAvg,
    stateQualityAverage: stateQualityAvg || null,
    drgs,
    negotiatedRates: {
      totalRates: negotiatedRates.length,
      totalPayers: payerMap.size,
      byPayer: payerSummary,
      rates: negotiatedRates,
    },
    disclaimer: "Hospital charges reflect list prices. Actual patient costs depend on insurance, deductibles, and negotiated rates.",
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals/:providerId/quality — Quality metrics for a hospital
// ---------------------------------------------------------------------------

async function handleHospitalQuality(providerId: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const quality = await env.DB.prepare(`
    SELECT
      provider_id AS providerId,
      hospital_name AS hospitalName,
      city,
      state,
      zip,
      overall_rating AS overallRating,
      patient_experience_rating AS patientExperienceRating,
      readmission_rating AS readmissionRating,
      mortality_rating AS mortalityRating,
      safety_rating AS safetyRating,
      timeliness_rating AS timelinessRating,
      effectiveness_rating AS effectivenessRating,
      hospital_type AS hospitalType,
      ownership,
      emergency_services AS emergencyServices
    FROM hospital_quality
    WHERE provider_id = ?1
  `).bind(providerId).first();

  if (!quality) {
    return error("Hospital quality data not found", 404, cors);
  }

  const stateAvg = await env.DB.prepare(`
    SELECT
      ROUND(AVG(overall_rating), 2) AS avgRating,
      COUNT(*) AS totalRatedHospitals,
      SUM(CASE WHEN overall_rating = 5 THEN 1 ELSE 0 END) AS fiveStarCount,
      SUM(CASE WHEN overall_rating = 1 THEN 1 ELSE 0 END) AS oneStarCount
    FROM hospital_quality
    WHERE state = ?1 AND overall_rating IS NOT NULL
  `).bind((quality as any).state).first();

  const nationalAvg = await env.DB.prepare(`
    SELECT
      ROUND(AVG(overall_rating), 2) AS avgRating,
      COUNT(*) AS totalRatedHospitals,
      SUM(CASE WHEN overall_rating = 5 THEN 1 ELSE 0 END) AS fiveStarCount
    FROM hospital_quality
    WHERE overall_rating IS NOT NULL
  `).first();

  return success({
    quality,
    stateAverage: stateAvg,
    nationalAverage: nationalAvg,
    source: "CMS Hospital Compare",
    disclaimer: "Star ratings are based on CMS Hospital Compare data. Ratings reflect performance on measures of mortality, safety, readmission, patient experience, and timeliness.",
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/hospitals/best — Find top-rated hospitals by state
// ---------------------------------------------------------------------------

async function handleBestHospitals(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const state = url.searchParams.get("state")?.toUpperCase();
  const minRating = parseInt(url.searchParams.get("rating") || "4", 10);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);

  const conditions: string[] = ["overall_rating >= ?1"];
  const params: unknown[] = [minRating];
  let paramIdx = 2;

  if (state) {
    conditions.push(`state = ?${paramIdx}`);
    params.push(state);
    paramIdx++;
  }

  const where = conditions.join(" AND ");

  const { results } = await env.DB.prepare(`
    SELECT
      hq.provider_id AS providerId,
      hq.hospital_name AS hospitalName,
      hq.city,
      hq.state,
      hq.zip,
      hq.overall_rating AS overallRating,
      hq.mortality_rating AS mortalityRating,
      hq.safety_rating AS safetyRating,
      hq.readmission_rating AS readmissionRating,
      hq.patient_experience_rating AS patientExperienceRating,
      hq.hospital_type AS hospitalType,
      hq.ownership,
      hq.emergency_services AS emergencyServices
    FROM hospital_quality hq
    WHERE ${where}
    ORDER BY hq.overall_rating DESC, hq.hospital_name ASC
    LIMIT ?${paramIdx}
  `).bind(...params, limit).all();

  const distConditions: string[] = [];
  const distParams: unknown[] = [];
  if (state) {
    distConditions.push("state = ?1");
    distParams.push(state);
  }
  const distWhere = distConditions.length ? `WHERE ${distConditions.join(" AND ")} AND overall_rating IS NOT NULL` : "WHERE overall_rating IS NOT NULL";

  const { results: dist } = await env.DB.prepare(`
    SELECT overall_rating AS rating, COUNT(*) AS count
    FROM hospital_quality
    ${distWhere}
    GROUP BY overall_rating
    ORDER BY overall_rating DESC
  `).bind(...distParams).all();

  return success({
    hospitals: results,
    ratingDistribution: dist,
    filters: { state: state || "all", minRating, limit },
    source: "CMS Hospital Compare",
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/insurers/:payerName — Insurer detail with all rates across hospitals
// ---------------------------------------------------------------------------

async function handleInsurerDetail(payerName: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const searchName = payerName.replace(/-/g, '%');

  const { results: rates } = await env.DB.prepare(`
    SELECT
      hospital_name AS hospitalName,
      hospital_state AS hospitalState,
      code,
      code_type AS codeType,
      description,
      payer_name AS payerName,
      plan_name AS planName,
      negotiated_rate AS negotiatedRate,
      methodology,
      setting
    FROM hospital_negotiated_rates
    WHERE payer_name LIKE ?1 AND negotiated_rate > 0
    ORDER BY negotiated_rate ASC
    LIMIT 1000
  `).bind(`%${searchName}%`).all();

  if (!rates || rates.length === 0) {
    return error("Insurer not found", 404, cors);
  }

  const actualPayerName = (rates[0] as any).payerName;

  const totalRates = rates.length;
  const avgRate = Math.round(rates.reduce((s: number, r: any) => s + r.negotiatedRate, 0) / totalRates);
  const minRate = Math.min(...rates.map((r: any) => r.negotiatedRate));
  const maxRate = Math.max(...rates.map((r: any) => r.negotiatedRate));
  const hospitalsSet = new Set(rates.map((r: any) => r.hospitalName));
  const proceduresSet = new Set(rates.map((r: any) => r.code));
  const statesSet = new Set(rates.map((r: any) => r.hospitalState));

  const procMap = new Map<string, { desc: string; rates: number; sum: number; min: number; max: number }>();
  for (const r of rates as any[]) {
    const existing = procMap.get(r.code);
    if (existing) {
      existing.rates++;
      existing.sum += r.negotiatedRate;
      existing.min = Math.min(existing.min, r.negotiatedRate);
      existing.max = Math.max(existing.max, r.negotiatedRate);
    } else {
      procMap.set(r.code, { desc: r.description, rates: 1, sum: r.negotiatedRate, min: r.negotiatedRate, max: r.negotiatedRate });
    }
  }

  const byProcedure = Array.from(procMap.entries()).map(([code, data]) => ({
    code,
    description: data.desc,
    totalRates: data.rates,
    avgRate: Math.round(data.sum / data.rates),
    minRate: data.min,
    maxRate: data.max,
  })).sort((a, b) => b.totalRates - a.totalRates);

  const hospMap = new Map<string, { state: string; rates: number; sum: number; min: number; max: number; procs: Set<string> }>();
  for (const r of rates as any[]) {
    const existing = hospMap.get(r.hospitalName);
    if (existing) {
      existing.rates++;
      existing.sum += r.negotiatedRate;
      existing.min = Math.min(existing.min, r.negotiatedRate);
      existing.max = Math.max(existing.max, r.negotiatedRate);
      existing.procs.add(r.code);
    } else {
      hospMap.set(r.hospitalName, { state: r.hospitalState, rates: 1, sum: r.negotiatedRate, min: r.negotiatedRate, max: r.negotiatedRate, procs: new Set([r.code]) });
    }
  }

  const byHospital = Array.from(hospMap.entries()).map(([name, data]) => ({
    hospitalName: name,
    hospitalState: data.state,
    totalRates: data.rates,
    avgRate: Math.round(data.sum / data.rates),
    minRate: data.min,
    maxRate: data.max,
    proceduresCovered: data.procs.size,
  })).sort((a, b) => b.totalRates - a.totalRates);

  const medicareBaseline = await env.DB.prepare(`
    SELECT ROUND(AVG(avg_medicare_payments), 2) AS avgMedicarePayment
    FROM hospital_drg_costs
  `).first();

  const overallAvg = await env.DB.prepare(`
    SELECT ROUND(AVG(negotiated_rate), 2) AS overallAvgRate
    FROM hospital_negotiated_rates
    WHERE negotiated_rate > 0
  `).first();

  return success({
    payerName: actualPayerName,
    summary: {
      totalRates,
      avgRate,
      minRate,
      maxRate,
      hospitalCount: hospitalsSet.size,
      proceduresCovered: proceduresSet.size,
      stateCount: statesSet.size,
    },
    byProcedure,
    byHospital,
    medicareBaseline,
    overallAvgRate: (overallAvg as any)?.overallAvgRate || 0,
    disclaimer: "Insurance rates shown are from hospital Machine-Readable Files (MRFs). Rates vary by plan, network tier, and specific contract terms."
  }, cors);
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

// ---------------------------------------------------------------------------
// GET /api/negotiated-rates?code=99285&state=CO&payer=Cigna
// Returns real negotiated rates from hospital price transparency (MRF) data
// ---------------------------------------------------------------------------

async function handleNegotiatedRates(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const payer = url.searchParams.get("payer");
  const setting = url.searchParams.get("setting"); // inpatient or outpatient
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "500", 10) || 500, 1), 1000);

  if (!code) {
    return error("Required parameter: code (e.g. 99285, 72148, 470)", 400, cors);
  }

  // Build query with optional filters
  const conditions = ["code = ?1"];
  const params: string[] = [code];
  let paramIdx = 2;

  if (state) {
    conditions.push(`hospital_state = ?${paramIdx}`);
    params.push(state);
    paramIdx++;
  }
  if (payer) {
    conditions.push(`payer_name LIKE ?${paramIdx}`);
    params.push(`%${payer}%`);
    paramIdx++;
  }
  if (setting) {
    conditions.push(`setting = ?${paramIdx}`);
    params.push(setting);
    paramIdx++;
  }

  const where = conditions.join(" AND ");

  // Get all matching rates
  const stmt = env.DB.prepare(`
    SELECT
      hospital_name AS hospitalName,
      hospital_state AS hospitalState,
      code,
      code_type AS codeType,
      description,
      payer_name AS payerName,
      plan_name AS planName,
      negotiated_rate AS negotiatedRate,
      methodology,
      setting
    FROM hospital_negotiated_rates
    WHERE ${where}
    ORDER BY negotiated_rate ASC
    LIMIT ?${paramIdx}
  `);

  const { results: rates } = await stmt.bind(...params, limit).all();

  // Compute aggregates by payer
  const { results: payerAggs } = await env.DB.prepare(`
    SELECT
      payer_name AS payerName,
      COUNT(*) AS numRates,
      MIN(negotiated_rate) AS minRate,
      MAX(negotiated_rate) AS maxRate,
      AVG(negotiated_rate) AS avgRate,
      COUNT(DISTINCT hospital_name) AS numHospitals
    FROM hospital_negotiated_rates
    WHERE ${where}
    GROUP BY payer_name
    ORDER BY avgRate ASC
  `).bind(...params).all();

  // Compute overall stats
  const { results: overallStats } = await env.DB.prepare(`
    SELECT
      COUNT(*) AS totalRates,
      COUNT(DISTINCT hospital_name) AS totalHospitals,
      COUNT(DISTINCT payer_name) AS totalPayers,
      COUNT(DISTINCT hospital_state) AS totalStates,
      MIN(negotiated_rate) AS overallMin,
      MAX(negotiated_rate) AS overallMax,
      AVG(negotiated_rate) AS overallAvg,
      description
    FROM hospital_negotiated_rates
    WHERE ${where}
  `).bind(...params).all();

  const stats = overallStats?.[0] || {};

  // State breakdown
  const { results: stateBreakdown } = await env.DB.prepare(`
    SELECT
      hospital_state AS state,
      COUNT(*) AS numRates,
      AVG(negotiated_rate) AS avgRate,
      MIN(negotiated_rate) AS minRate,
      MAX(negotiated_rate) AS maxRate
    FROM hospital_negotiated_rates
    WHERE ${where}
    GROUP BY hospital_state
    ORDER BY avgRate ASC
  `).bind(...params).all();

  return success({
    code,
    codeType: (rates as Array<Record<string, unknown>>)[0]?.codeType || "CPT",
    description: (stats as Record<string, unknown>).description || "",
    filters: { state, payer, setting },
    summary: {
      totalRates: (stats as Record<string, unknown>).totalRates,
      totalHospitals: (stats as Record<string, unknown>).totalHospitals,
      totalPayers: (stats as Record<string, unknown>).totalPayers,
      totalStates: (stats as Record<string, unknown>).totalStates,
      overallMin: (stats as Record<string, unknown>).overallMin,
      overallMax: (stats as Record<string, unknown>).overallMax,
      overallAvg: Math.round(((stats as Record<string, unknown>).overallAvg as number || 0) * 100) / 100,
    },
    byPayer: payerAggs,
    byState: stateBreakdown,
    rates,
    disclaimer: "Negotiated rates are sourced from hospital Machine-Readable Files (MRFs) required by the Hospital Price Transparency Rule. " +
      "Rates reflect specific hospital-payer contracts and may not represent what you will pay. " +
      "Your actual cost depends on your specific insurance plan, deductible, and out-of-pocket maximum.",
  }, cors, { source: "Hospital Price Transparency MRFs (CMS mandate)" });
}

// ---------------------------------------------------------------------------
// GET /api/bill-check — Is This Bill Reasonable?
// ---------------------------------------------------------------------------

async function handleBillCheck(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const code = url.searchParams.get("code");
  const amountStr = url.searchParams.get("amount");
  const state = url.searchParams.get("state");

  if (!code || !amountStr) {
    return error("Required parameters: code (CPT/HCPCS), amount (billed amount in dollars)", 400, cors);
  }

  const billedAmount = parseFloat(amountStr);
  if (isNaN(billedAmount) || billedAmount <= 0) {
    return error("Invalid amount — must be a positive number", 400, cors);
  }

  // 1. Get procedure details (Medicare rates)
  const { results: procResults } = await env.DB.prepare(`
    SELECT
      code, description, category, body_system AS bodySystem,
      national_facility_rate AS nationalFacilityRate,
      national_non_fac_rate AS nationalNonFacRate,
      hospital_outpatient_cost AS hospitalOutpatientCost,
      asc_cost AS ascCost,
      total_rvu AS totalRvu,
      conversion_factor AS conversionFactor
    FROM medical_procedures
    WHERE code = ?1 AND code_type IN ('CPT', 'HCPCS')
    ORDER BY effective_year DESC
    LIMIT 1
  `).bind(code).all();

  if (!procResults || procResults.length === 0) {
    return error(`Procedure not found: ${code}`, 404, cors);
  }

  const proc = procResults[0] as Record<string, unknown>;
  const medicareRate = (proc.nationalFacilityRate as number) || (proc.nationalNonFacRate as number) || null;
  const oppsRate = (proc.hospitalOutpatientCost as number) || null;
  const nonFacRate = (proc.nationalNonFacRate as number) || null;

  // 2. Get geographic rate if state provided
  let stateRate: number | null = null;
  let stateCommercialLow: number | null = null;
  let stateCommercialHigh: number | null = null;
  if (state) {
    const { results: geoResults } = await env.DB.prepare(`
      SELECT
        facility_rate AS facilityRate,
        non_facility_rate AS nonFacilityRate,
        estimated_commercial_low AS commercialLow,
        estimated_commercial_high AS commercialHigh
      FROM medical_cost_geographic g
      JOIN medical_procedures p ON g.procedure_id = p.id
      WHERE p.code = ?1 AND g.state_code = ?2
      ORDER BY g.effective_year DESC
      LIMIT 1
    `).bind(code, state).all();

    if (geoResults && geoResults.length > 0) {
      const geo = geoResults[0] as Record<string, unknown>;
      stateRate = (geo.facilityRate as number) || (geo.nonFacilityRate as number) || null;
      stateCommercialLow = (geo.commercialLow as number) || null;
      stateCommercialHigh = (geo.commercialHigh as number) || null;
    }
  }

  // 3. Get negotiated rate stats
  let negotiatedMin: number | null = null;
  let negotiatedMax: number | null = null;
  let negotiatedAvg: number | null = null;
  let negotiatedCount = 0;

  const negQuery = state
    ? `SELECT COUNT(*) AS cnt, MIN(negotiated_rate) AS minR, MAX(negotiated_rate) AS maxR, AVG(negotiated_rate) AS avgR FROM hospital_negotiated_rates WHERE code = ?1 AND hospital_state = ?2`
    : `SELECT COUNT(*) AS cnt, MIN(negotiated_rate) AS minR, MAX(negotiated_rate) AS maxR, AVG(negotiated_rate) AS avgR FROM hospital_negotiated_rates WHERE code = ?1`;

  const negParams = state ? [code, state] : [code];
  const { results: negResults } = await env.DB.prepare(negQuery).bind(...negParams).all();

  if (negResults && negResults.length > 0) {
    const neg = negResults[0] as Record<string, unknown>;
    negotiatedCount = (neg.cnt as number) || 0;
    if (negotiatedCount > 0) {
      negotiatedMin = Math.round((neg.minR as number) * 100) / 100;
      negotiatedMax = Math.round((neg.maxR as number) * 100) / 100;
      negotiatedAvg = Math.round((neg.avgR as number) * 100) / 100;
    }
  }

  // 4. Compute percentile among negotiated rates
  let percentile: number | null = null;
  if (negotiatedCount > 0) {
    const { results: pctResults } = await env.DB.prepare(
      state
        ? `SELECT COUNT(*) AS below FROM hospital_negotiated_rates WHERE code = ?1 AND hospital_state = ?2 AND negotiated_rate <= ?3`
        : `SELECT COUNT(*) AS below FROM hospital_negotiated_rates WHERE code = ?1 AND negotiated_rate <= ?2`
    ).bind(...(state ? [code, state, billedAmount] : [code, billedAmount])).all();

    if (pctResults && pctResults.length > 0) {
      const below = (pctResults[0] as Record<string, unknown>).below as number;
      percentile = Math.round((below / negotiatedCount) * 100);
    }
  }

  // 5. Compute fair price range (150-250% of Medicare)
  const fairPriceLow = medicareRate ? Math.round(medicareRate * 1.5) : null;
  const fairPriceHigh = medicareRate ? Math.round(medicareRate * 2.5) : null;

  // 6. Compute commercial estimate (use state-specific or national 200% of Medicare)
  const commercialAvg = stateCommercialLow && stateCommercialHigh
    ? Math.round((stateCommercialLow + stateCommercialHigh) / 2)
    : negotiatedAvg
      ? Math.round(negotiatedAvg)
      : medicareRate
        ? Math.round(medicareRate * 2.0)
        : null;

  // 7. Verdict
  const referenceRate = commercialAvg || fairPriceHigh || medicareRate;
  let verdictText = "";
  let verdictLevel: "low" | "fair" | "high" | "very_high" = "fair";
  let percentAbove = 0;

  if (referenceRate && referenceRate > 0) {
    percentAbove = Math.round(((billedAmount - referenceRate) / referenceRate) * 100);

    if (billedAmount <= referenceRate * 0.8) {
      verdictText = `Your bill is ${Math.abs(percentAbove)}% below the average commercial rate. This is a good price.`;
      verdictLevel = "low";
    } else if (billedAmount <= referenceRate * 1.2) {
      verdictText = `Your bill is within the normal range (within 20% of the average commercial rate).`;
      verdictLevel = "fair";
    } else if (billedAmount <= referenceRate * 2.0) {
      verdictText = `Your bill is ${percentAbove}% above the average commercial rate. You may want to negotiate.`;
      verdictLevel = "high";
    } else {
      verdictText = `Your bill is ${percentAbove}% above the average commercial rate. This is significantly higher than typical. We strongly recommend negotiating.`;
      verdictLevel = "very_high";
    }
  }

  return success({
    code,
    description: proc.description,
    category: proc.category,
    billedAmount,
    state: state || null,
    medicareRate,
    nonFacilityRate: nonFacRate,
    hospitalOutpatientRate: oppsRate,
    ascRate: (proc.ascCost as number) || null,
    stateAdjustedRate: stateRate,
    commercialEstimate: {
      low: stateCommercialLow || fairPriceLow,
      high: stateCommercialHigh || fairPriceHigh,
      average: commercialAvg,
    },
    negotiatedRates: negotiatedCount > 0 ? {
      count: negotiatedCount,
      min: negotiatedMin,
      max: negotiatedMax,
      average: negotiatedAvg,
    } : null,
    fairPriceRange: fairPriceLow && fairPriceHigh ? {
      low: fairPriceLow,
      high: fairPriceHigh,
      basis: "150-250% of Medicare rate",
    } : null,
    percentile,
    verdict: {
      text: verdictText,
      level: verdictLevel,
      percentAboveAverage: percentAbove,
    },
    disclaimer: DISCLAIMER,
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/drugs/compare?brand=ozempic
// ---------------------------------------------------------------------------

async function handleDrugCompare(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const brand = url.searchParams.get("brand");
  if (!brand) return error("Missing 'brand' parameter", 400, cors);

  const { results: brandDrugs } = await env.DB.prepare(
    `SELECT code, description, category, national_non_fac_rate AS nadacPerUnit
     FROM medical_procedures
     WHERE category = 'Prescription Drug - Brand'
       AND description LIKE ?1
     ORDER BY national_non_fac_rate DESC
     LIMIT 10`
  ).bind(`%${brand.toUpperCase()}%`).all();

  if (!brandDrugs || brandDrugs.length === 0) {
    return error("Brand drug not found", 404, cors);
  }

  const brandDesc = (brandDrugs[0] as Record<string, unknown>).description as string;
  const parts = brandDesc.split(/\s+/);
  const dosageIdx = parts.findIndex(p => /^\d/.test(p));
  const dosageForm = dosageIdx >= 0 ? parts.slice(dosageIdx).join(' ') : '';

  let genericResults: unknown[] = [];
  if (dosageForm) {
    const { results } = await env.DB.prepare(
      `SELECT code, description, category, national_non_fac_rate AS nadacPerUnit
       FROM medical_procedures
       WHERE category = 'Prescription Drug - Generic'
         AND description LIKE ?1
       ORDER BY national_non_fac_rate ASC
       LIMIT 20`
    ).bind(`%${dosageForm}%`).all();
    genericResults = results || [];
  }

  const brandPrice = (brandDrugs[0] as Record<string, unknown>).nadacPerUnit as number;
  const genericsWithSavings = genericResults.map((g: any) => ({
    ...g,
    monthlySavings: Math.round((brandPrice - g.nadacPerUnit) * 30 * 100) / 100,
    annualSavings: Math.round((brandPrice - g.nadacPerUnit) * 365 * 100) / 100,
    percentCheaper: brandPrice > 0 ? Math.round((1 - g.nadacPerUnit / brandPrice) * 100) : 0,
  }));

  return success({
    brand: brandDrugs,
    generics: genericsWithSavings,
    brandAvgPerUnit: brandPrice,
    cheapestGenericPerUnit: genericResults.length > 0 ? (genericResults[0] as any).nadacPerUnit : null,
    potentialAnnualSavings: genericResults.length > 0
      ? Math.round((brandPrice - (genericResults[0] as any).nadacPerUnit) * 365 * 100) / 100
      : null,
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/drugs/categories
// ---------------------------------------------------------------------------

async function handleDrugCategories(env: Env, cors: Record<string, string>): Promise<Response> {
  const categories = [
    { slug: "pain-medications", name: "Pain Medications", description: "Analgesics, NSAIDs, and pain management drugs", keywords: ["IBUPROFEN","ACETAMINOPHEN","NAPROXEN","TRAMADOL","OXYCODONE","HYDROCODONE","MORPHINE","GABAPENTIN","PREGABALIN","MELOXICAM","DICLOFENAC","CELECOXIB","KETOROLAC","CODEINE","FENTANYL","HYDROMORPHONE","METHADONE","BUPRENORPHINE","LIDOCAINE"] },
    { slug: "antibiotics", name: "Antibiotics", description: "Anti-infective medications for bacterial infections", keywords: ["AMOXICILLIN","AZITHROMYCIN","CIPROFLOXACIN","DOXYCYCLINE","LEVOFLOXACIN","METRONIDAZOLE","CEPHALEXIN","CLINDAMYCIN","SULFAMETHOXAZOLE","NITROFURANTOIN","PENICILLIN","AUGMENTIN","CEFTRIAXONE","VANCOMYCIN","ERYTHROMYCIN","TETRACYCLINE"] },
    { slug: "heart-medications", name: "Heart & Cardiovascular", description: "Drugs for heart conditions, arrhythmias, and cardiovascular health", keywords: ["METOPROLOL","CARVEDILOL","DIGOXIN","AMIODARONE","WARFARIN","APIXABAN","RIVAROXABAN","CLOPIDOGREL","DILTIAZEM","VERAPAMIL","NITROGLYCERIN","ISOSORBIDE","ELIQUIS","XARELTO"] },
    { slug: "diabetes-drugs", name: "Diabetes Medications", description: "Insulin, oral hypoglycemics, and GLP-1 receptor agonists", keywords: ["METFORMIN","INSULIN","GLIPIZIDE","GLYBURIDE","PIOGLITAZONE","SITAGLIPTIN","JARDIANCE","FARXIGA","INVOKANA","OZEMPIC","MOUNJARO","TRULICITY","RYBELSUS","VICTOZA","SEMAGLUTIDE","TIRZEPATIDE","DULAGLUTIDE","LIRAGLUTIDE","EMPAGLIFLOZIN","DAPAGLIFLOZIN"] },
    { slug: "mental-health", name: "Mental Health Medications", description: "Antidepressants, anti-anxiety, antipsychotics, and mood stabilizers", keywords: ["SERTRALINE","FLUOXETINE","ESCITALOPRAM","CITALOPRAM","VENLAFAXINE","DULOXETINE","BUPROPION","TRAZODONE","AMITRIPTYLINE","QUETIAPINE","ARIPIPRAZOLE","RISPERIDONE","OLANZAPINE","LITHIUM","LAMOTRIGINE","ALPRAZOLAM","LORAZEPAM","CLONAZEPAM","BUSPIRONE","HYDROXYZINE"] },
    { slug: "blood-pressure", name: "Blood Pressure Medications", description: "ACE inhibitors, ARBs, calcium channel blockers, and diuretics", keywords: ["LISINOPRIL","AMLODIPINE","LOSARTAN","VALSARTAN","HYDROCHLOROTHIAZIDE","ENALAPRIL","RAMIPRIL","BENAZEPRIL","IRBESARTAN","OLMESARTAN","TELMISARTAN","NIFEDIPINE","FUROSEMIDE","SPIRONOLACTONE","CHLORTHALIDONE","CLONIDINE","HYDRALAZINE"] },
    { slug: "cholesterol", name: "Cholesterol Medications", description: "Statins, fibrates, and other lipid-lowering drugs", keywords: ["ATORVASTATIN","ROSUVASTATIN","SIMVASTATIN","PRAVASTATIN","LOVASTATIN","EZETIMIBE","FENOFIBRATE","GEMFIBROZIL","REPATHA","PRALUENT"] },
  ];

  const results = [];
  for (const cat of categories) {
    const likeClauses = cat.keywords.map((_, i) => `description LIKE ?${i + 1}`).join(" OR ");
    const params = cat.keywords.map(k => `%${k}%`);
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as total FROM medical_procedures WHERE category LIKE 'Prescription Drug%' AND (${likeClauses})`
    ).bind(...params).first<{ total: number }>();

    results.push({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      drugCount: countResult?.total || 0,
    });
  }

  return success(results, cors);
}

// ---------------------------------------------------------------------------
// GET /api/drugs/glp1
// ---------------------------------------------------------------------------

async function handleGlp1Drugs(env: Env, cors: Record<string, string>): Promise<Response> {
  const glp1Families = [
    { brand: "OZEMPIC", generic: "semaglutide", pattern: "OZEMPIC%", indication: "Type 2 diabetes", typicalMonthlyUnits: 4 },
    { brand: "WEGOVY", generic: "semaglutide", pattern: "WEGOVY%", indication: "Weight loss", typicalMonthlyUnits: 4 },
    { brand: "RYBELSUS", generic: "semaglutide (oral)", pattern: "RYBELSUS%", indication: "Type 2 diabetes", typicalMonthlyUnits: 30 },
    { brand: "MOUNJARO", generic: "tirzepatide", pattern: "MOUNJARO%", indication: "Type 2 diabetes", typicalMonthlyUnits: 4 },
    { brand: "ZEPBOUND", generic: "tirzepatide", pattern: "ZEPBOUND%", indication: "Weight loss", typicalMonthlyUnits: 4 },
    { brand: "TRULICITY", generic: "dulaglutide", pattern: "TRULICITY%", indication: "Type 2 diabetes", typicalMonthlyUnits: 4 },
    { brand: "VICTOZA", generic: "liraglutide", pattern: "VICTOZA%", indication: "Type 2 diabetes", typicalMonthlyUnits: 1 },
    { brand: "SAXENDA", generic: "liraglutide", pattern: "SAXENDA%", indication: "Weight loss", typicalMonthlyUnits: 5 },
    { brand: "BYETTA", generic: "exenatide", pattern: "BYETTA%", indication: "Type 2 diabetes", typicalMonthlyUnits: 1 },
    { brand: "BYDUREON", generic: "exenatide ER", pattern: "BYDUREON%", indication: "Type 2 diabetes", typicalMonthlyUnits: 4 },
  ];

  const results = [];
  for (const fam of glp1Families) {
    const { results: drugs } = await env.DB.prepare(
      `SELECT code, description, category, national_non_fac_rate AS nadacPerUnit
       FROM medical_procedures WHERE description LIKE ?1 ORDER BY national_non_fac_rate ASC`
    ).bind(fam.pattern).all();

    if (drugs && drugs.length > 0) {
      const prices = drugs.map((d: any) => d.nadacPerUnit).filter(Boolean);
      const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : 0;
      const estMonthly = avgPrice * fam.typicalMonthlyUnits;
      results.push({
        brand: fam.brand, genericName: fam.generic, indication: fam.indication,
        variants: drugs,
        avgNadacPerUnit: Math.round(avgPrice * 100) / 100,
        estimatedMonthlyCost: Math.round(estMonthly * 100) / 100,
        estimatedAnnualCost: Math.round(estMonthly * 12 * 100) / 100,
        typicalMonthlyUnits: fam.typicalMonthlyUnits,
      });
    }
  }

  const { results: genericGlp1 } = await env.DB.prepare(
    `SELECT code, description, category, national_non_fac_rate AS nadacPerUnit
     FROM medical_procedures
     WHERE category = 'Prescription Drug - Generic'
       AND (description LIKE '%LIRAGLUTIDE%' OR description LIKE '%EXENATIDE%' OR description LIKE '%SEMAGLUTIDE%' OR description LIKE '%TIRZEPATIDE%' OR description LIKE '%DULAGLUTIDE%')
     ORDER BY description`
  ).all();

  return success({
    drugs: results,
    genericAlternatives: genericGlp1 || [],
    summary: {
      totalVariants: results.reduce((acc, r) => acc + r.variants.length, 0),
      cheapestMonthly: results.length > 0 ? Math.min(...results.map(r => r.estimatedMonthlyCost)) : 0,
      mostExpensiveMonthly: results.length > 0 ? Math.max(...results.map(r => r.estimatedMonthlyCost)) : 0,
    }
  }, cors);
}

// ---------------------------------------------------------------------------
// Insurance Plans (ACA QHP 2026)
// ---------------------------------------------------------------------------
async function handleInsurancePlans(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  const state = url.searchParams.get("state");
  const metal = url.searchParams.get("metal");
  const search = url.searchParams.get("search");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let where = "WHERE 1=1";
  const params: string[] = [];
  if (state) { where += " AND state_code = ?"; params.push(state.toUpperCase()); }
  if (metal) { where += " AND metal_level = ?"; params.push(metal); }
  if (search) { where += " AND (plan_name LIKE ? OR issuer_name LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  const countQ = await env.DB.prepare(`SELECT COUNT(*) as total FROM insurance_plans ${where}`).bind(...params).first<{total: number}>();
  const total = countQ?.total || 0;

  const { results } = await env.DB.prepare(
    `SELECT id, plan_name AS planName, issuer_name AS issuerName, state_code AS stateCode,
            metal_level AS metalLevel, plan_type AS planType,
            premium_age30 AS premiumAge30, premium_age40 AS premiumAge40, premium_age50 AS premiumAge50,
            deductible_individual AS deductibleIndividual, deductible_family AS deductibleFamily,
            oop_max_individual AS oopMaxIndividual, oop_max_family AS oopMaxFamily,
            copay_primary_care AS copayPrimaryCare, copay_specialist AS copaySpecialist, copay_er AS copayEr,
            coinsurance_inpatient AS coinsuranceInpatient, coinsurance_outpatient AS coinsuranceOutpatient,
            coinsurance_imaging AS coinsuranceImaging, year
     FROM insurance_plans ${where}
     ORDER BY state_code, metal_level, premium_age30
     LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();

  return success(results, cors, { pagination: { total, limit, offset } });
}

// ---------------------------------------------------------------------------
// Out-of-Pocket Cost Calculator
// ---------------------------------------------------------------------------
async function handleOopCalculator(url: URL, env: Env, cors: Record<string, string>): Promise<Response> {
  // Accept procedure codes as comma-separated list
  const codes = (url.searchParams.get("codes") || "").split(",").filter(Boolean);
  if (codes.length === 0) return error("At least one procedure code is required", 400, cors);

  const deductible = parseFloat(url.searchParams.get("deductible") || "0");
  const deductibleMet = parseFloat(url.searchParams.get("deductible_met") || "0");
  const coinsurance = parseFloat(url.searchParams.get("coinsurance") || "0.2");
  const oopMax = parseFloat(url.searchParams.get("oop_max") || "9450");
  const copay = parseFloat(url.searchParams.get("copay") || "0");
  const setting = url.searchParams.get("setting") || "facility"; // facility, non_facility, asc, hospital_outpatient
  const state = url.searchParams.get("state");
  const planId = url.searchParams.get("plan_id");

  // If plan_id provided, load plan details for deductible/coinsurance
  let planDeductible = deductible;
  let planCoinsurance = coinsurance;
  let planOopMax = oopMax;
  let planCopay = copay;
  let planName = null as string | null;

  if (planId) {
    const plan = await env.DB.prepare(
      `SELECT * FROM insurance_plans WHERE id = ?`
    ).bind(planId).first<any>();
    if (plan) {
      planDeductible = plan.deductible_individual || deductible;
      planCoinsurance = plan.coinsurance_inpatient || coinsurance;
      planOopMax = plan.oop_max_individual || oopMax;
      planCopay = plan.copay_specialist || copay;
      planName = plan.plan_name;
    }
  }

  // Fetch procedures
  const placeholders = codes.map(() => "?").join(",");
  const { results: procedures } = await env.DB.prepare(
    `SELECT mp.code, mp.description, mp.category, mp.body_system,
            mp.national_facility_rate, mp.national_non_fac_rate,
            mp.hospital_outpatient_cost, mp.asc_cost,
            cd.consumer_name
     FROM medical_procedures mp
     LEFT JOIN consumer_descriptions cd ON mp.code = cd.code
     WHERE mp.code IN (${placeholders})`
  ).bind(...codes).all();

  // Get geographic rates if state specified
  let geoRates: Record<string, any> = {};
  if (state && procedures.length > 0) {
    const procIds = await env.DB.prepare(
      `SELECT id, code FROM medical_procedures WHERE code IN (${placeholders})`
    ).bind(...codes).all();

    for (const proc of procIds.results) {
      const geo = await env.DB.prepare(
        `SELECT facility_rate, non_facility_rate, estimated_commercial_low, estimated_commercial_high
         FROM medical_cost_geographic
         WHERE procedure_id = ? AND state_code = ?
         LIMIT 1`
      ).bind((proc as any).id, state.toUpperCase()).first<any>();
      if (geo) geoRates[(proc as any).code] = geo;
    }
  }

  // Calculate OOP for each procedure
  let totalProviderCharges = 0;
  let runningDeductibleRemaining = Math.max(0, planDeductible - deductibleMet);
  let runningOopTotal = 0;

  const procedureResults = (procedures as any[]).map((proc: any) => {
    let providerCharge = 0;
    const geo = geoRates[proc.code];

    if (setting === "asc" && proc.asc_cost) {
      providerCharge = proc.asc_cost;
    } else if (setting === "hospital_outpatient" && proc.hospital_outpatient_cost) {
      providerCharge = proc.hospital_outpatient_cost;
    } else if (setting === "non_facility" && proc.national_non_fac_rate) {
      providerCharge = proc.national_non_fac_rate;
    } else {
      providerCharge = proc.national_facility_rate || proc.national_non_fac_rate || 0;
    }

    // Use geographic rate if available
    if (geo) {
      if (setting === "non_facility" && geo.non_facility_rate) {
        providerCharge = geo.non_facility_rate;
      } else if (geo.facility_rate) {
        providerCharge = geo.facility_rate;
      }
    }

    // Estimate commercial rate (150-250% of Medicare)
    const commercialLow = geo?.estimated_commercial_low || providerCharge * 1.5;
    const commercialHigh = geo?.estimated_commercial_high || providerCharge * 2.5;
    const negotiatedRate = (commercialLow + commercialHigh) / 2;

    // Calculate patient responsibility
    let deductiblePortion = 0;
    let coinsurancePortion = 0;
    let copayPortion = planCopay;

    if (runningDeductibleRemaining > 0) {
      deductiblePortion = Math.min(negotiatedRate, runningDeductibleRemaining);
      runningDeductibleRemaining -= deductiblePortion;
    }

    const afterDeductible = negotiatedRate - deductiblePortion;
    if (afterDeductible > 0) {
      coinsurancePortion = afterDeductible * planCoinsurance;
    }

    let patientTotal = deductiblePortion + coinsurancePortion + copayPortion;

    // Apply OOP max
    if (runningOopTotal + patientTotal > planOopMax) {
      patientTotal = Math.max(0, planOopMax - runningOopTotal);
    }
    runningOopTotal += patientTotal;

    totalProviderCharges += providerCharge;

    return {
      code: proc.code,
      description: proc.consumer_name || proc.description,
      category: proc.category,
      medicareRate: providerCharge,
      estimatedNegotiatedRate: Math.round(negotiatedRate),
      commercialRange: { low: Math.round(commercialLow), high: Math.round(commercialHigh) },
      yourCost: {
        deductiblePortion: Math.round(deductiblePortion * 100) / 100,
        coinsurancePortion: Math.round(coinsurancePortion * 100) / 100,
        copay: copayPortion,
        total: Math.round(patientTotal * 100) / 100,
      },
      settings: {
        facility: proc.national_facility_rate,
        nonFacility: proc.national_non_fac_rate,
        hospitalOutpatient: proc.hospital_outpatient_cost,
        asc: proc.asc_cost,
      },
    };
  });

  const totalOop = procedureResults.reduce((sum: number, p: any) => sum + p.yourCost.total, 0);

  return success({
    procedures: procedureResults,
    insurance: {
      planName: planName,
      deductible: planDeductible,
      deductibleMet: deductibleMet,
      deductibleRemaining: Math.max(0, planDeductible - deductibleMet),
      coinsurance: planCoinsurance,
      oopMax: planOopMax,
      copay: planCopay,
    },
    summary: {
      totalMedicareCharges: Math.round(totalProviderCharges),
      totalEstimatedNegotiated: procedureResults.reduce((s: number, p: any) => s + p.estimatedNegotiatedRate, 0),
      totalOutOfPocket: Math.round(totalOop * 100) / 100,
      oopMaxReached: runningOopTotal >= planOopMax,
      setting: setting,
      state: state || "national",
    },
    disclaimer: DISCLAIMER,
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/auto-insurance/:state — State auto insurance rules
// ---------------------------------------------------------------------------
async function handleAutoInsurance(stateCode: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT state_code AS stateCode, state_name AS stateName, fault_system AS faultSystem,
            min_bi_per_person AS minBiPerPerson, min_bi_per_accident AS minBiPerAccident,
            min_pd AS minPd, pip_required AS pipRequired, pip_minimum AS pipMinimum,
            um_required AS umRequired, medpay_required AS medpayRequired,
            avg_annual_premium AS avgAnnualPremium, uninsured_rate AS uninsuredRate
     FROM state_auto_insurance WHERE state_code = ?`
  ).bind(stateCode).first();

  if (!row) return error(`No auto insurance data for state: ${stateCode}`, 404, cors);

  return success({
    ...row,
    pipRequired: !!(row as any).pipRequired,
    umRequired: !!(row as any).umRequired,
    medpayRequired: !!(row as any).medpayRequired,
    biLimitsFormatted: (row as any).minBiPerPerson > 0
      ? `$${((row as any).minBiPerPerson / 1000).toFixed(0)}K / $${((row as any).minBiPerAccident / 1000).toFixed(0)}K`
      : 'None required',
    faultSystemLabel: (row as any).faultSystem === 'tort' ? 'At-Fault (Tort)'
      : (row as any).faultSystem === 'no-fault' ? 'No-Fault'
      : 'Choice (No-Fault or Tort)',
  }, cors);
}

// ---------------------------------------------------------------------------
// GET /api/og — Dynamic OG Image (SVG)
// ---------------------------------------------------------------------------

function handleOgImage(url: URL, cors: Record<string, string>): Response {
  const title = url.searchParams.get("title") || "Medical Cost Data";
  const price = url.searchParams.get("price") || "";
  const type = url.searchParams.get("type") || "procedure";

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const typeLabel = type === "drug" ? "Drug Price" : type === "drg" ? "Hospital Stay" : type === "condition" ? "Condition" : "Procedure Cost";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="100%" style="stop-color:#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="rgba(255,255,255,0.08)"/>
  <circle cx="100" cy="100" r="28" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
  <text x="106" y="108" font-family="system-ui,sans-serif" font-size="28" fill="white" text-anchor="middle">$</text>
  <text x="150" y="108" font-family="system-ui,sans-serif" font-size="32" font-weight="bold" fill="white">MedicalCosts<tspan fill="#86efac">.info</tspan></text>
  <rect x="80" y="160" width="${typeLabel.length * 16 + 40}" height="40" rx="20" fill="rgba(255,255,255,0.15)"/>
  <text x="100" y="186" font-family="system-ui,sans-serif" font-size="18" fill="#93c5fd" font-weight="600" letter-spacing="1">${esc(typeLabel.toUpperCase())}</text>
  <text x="80" y="290" font-family="system-ui,sans-serif" font-size="52" font-weight="bold" fill="white">${esc(title.length > 40 ? title.substring(0, 37) + "..." : title)}</text>
  ${price ? `<text x="80" y="380" font-family="system-ui,sans-serif" font-size="72" font-weight="bold" fill="#86efac">${esc(price)}</text>
  <text x="80" y="420" font-family="system-ui,sans-serif" font-size="22" fill="#93c5fd">Medicare National Rate</text>` : ""}
  <text x="80" y="540" font-family="system-ui,sans-serif" font-size="22" fill="rgba(255,255,255,0.7)">Free Medical Cost Data &#x2022; CMS Medicare Fee Schedule 2026</text>
  <circle cx="1050" cy="480" r="120" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1100" cy="200" r="80" fill="rgba(255,255,255,0.03)"/>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      ...cors,
    },
  });
}

// ---------------------------------------------------------------------------
// GET /api/embed/:code — Embeddable HTML snippet for a procedure
// ---------------------------------------------------------------------------

async function handleEmbed(code: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT mp.code, mp.description, mp.category, mp.national_facility_rate,
            mp.national_non_fac_rate, cd.consumer_name, ps.slug
     FROM medical_procedures mp
     LEFT JOIN consumer_descriptions cd ON mp.code = cd.code
     LEFT JOIN procedure_slugs ps ON mp.code = ps.code
     WHERE mp.code = ?1 LIMIT 1`
  ).bind(code).first();

  if (!row) {
    return new Response(
      `<div style="padding:16px;font-family:system-ui;color:#666">Procedure not found</div>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", ...cors } }
    );
  }

  const r = row as any;
  const name = r.consumer_name || r.description;
  const facilityRate = r.national_facility_rate ? `$${Number(r.national_facility_rate).toFixed(0)}` : "N/A";
  const nonFacRate = r.national_non_fac_rate ? `$${Number(r.national_non_fac_rate).toFixed(0)}` : "N/A";
  const commercialLow = r.national_facility_rate ? `$${Math.round(r.national_facility_rate * 1.5)}` : "N/A";
  const commercialHigh = r.national_facility_rate ? `$${Math.round(r.national_facility_rate * 2.5)}` : "N/A";
  const slug = r.slug || r.code;
  const link = `https://medical-costs-site.pages.dev/procedures/${slug}/`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#fff;color:#1f2937}
.widget{max-width:400px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.header{background:linear-gradient(135deg,#1e40af,#3b82f6);padding:16px 20px;color:#fff}
.header h2{font-size:16px;font-weight:700;margin-bottom:2px}
.header .code{font-size:12px;opacity:0.8}
.body{padding:16px 20px}
.row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f3f4f6}
.row:last-child{border-bottom:none}
.label{font-size:13px;color:#6b7280}
.value{font-size:15px;font-weight:600;color:#059669}
.commercial{color:#d97706}
.footer{padding:10px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center}
.footer a{font-size:12px;color:#2563eb;text-decoration:none;font-weight:500}
.footer a:hover{text-decoration:underline}
.powered{font-size:11px;color:#9ca3af}
</style>
</head>
<body>
<div class="widget">
  <div class="header">
    <h2>${escHtml(name)}</h2>
    <span class="code">CPT ${escHtml(r.code)} &#x2022; ${escHtml(r.category || "Medical Procedure")}</span>
  </div>
  <div class="body">
    <div class="row"><span class="label">Medicare (Facility)</span><span class="value">${facilityRate}</span></div>
    <div class="row"><span class="label">Medicare (Office)</span><span class="value">${nonFacRate}</span></div>
    <div class="row"><span class="label">Est. Commercial Range</span><span class="value commercial">${commercialLow} &ndash; ${commercialHigh}</span></div>
  </div>
  <div class="footer">
    <a href="${link}" target="_blank" rel="noopener">View full details &rarr;</a>
    <span class="powered">Powered by <a href="https://medical-costs-site.pages.dev" target="_blank" rel="noopener">MedicalCosts.info</a></span>
  </div>
</div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...cors,
    },
  });
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
