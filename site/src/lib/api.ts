/**
 * Medical Costs API Client
 * Fetches from the Cloudflare Workers D1 API
 */

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://medical-costs-api.david-568.workers.dev';

export interface Procedure {
  id: string;
  code: string;
  codeType: string;
  description: string;
  category: string | null;
  bodySystem: string | null;
  workRvu: number | null;
  totalRvu: number | null;
  nationalFacilityRate: number | null;
  nationalNonFacRate: number | null;
  hospitalOutpatientCost: number | null;
  ascCost: number | null;
  effectiveYear: number;
  sourceDataset: string;
}

export interface InjuryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bodyRegion: string | null;
  crashRelevance: string;
  mildCostLow: number | null;
  mildCostHigh: number | null;
  moderateCostLow: number | null;
  moderateCostHigh: number | null;
  severeCostLow: number | null;
  severeCostHigh: number | null;
  lifetimeCostLow: number | null;
  lifetimeCostHigh: number | null;
}

export interface GeoCost {
  stateCode: string;
  locality: string;
  facilityRate: number | null;
  nonFacilityRate: number | null;
  estimatedCommercialLow: number | null;
  estimatedCommercialHigh: number | null;
  workGpci: number | null;
  peGpci: number | null;
  malpracticeGpci: number | null;
}

export interface CrashEstimate {
  crashSeverity: string;
  state: string;
  weightedCostEstimate: { low: number; high: number };
  likelyInjuries: Array<{
    name: string;
    slug: string;
    bodyRegion: string;
    likelihood: number;
    costRange: Record<string, number>;
  }>;
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/api${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function getProcedures(params: {
  search?: string;
  category?: string;
  bodySystem?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: Procedure[]; pagination: { total: number; limit: number; offset: number } }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.category) qs.set('category', params.category);
  if (params.bodySystem) qs.set('bodySystem', params.bodySystem);
  qs.set('limit', String(params.limit || 50));
  qs.set('offset', String(params.offset || 0));

  const res = await fetch(`${API_BASE}/api/procedures?${qs}`);
  const json = await res.json();
  return { data: json.data || [], pagination: json.pagination || { total: 0, limit: 50, offset: 0 } };
}

export async function getProcedure(code: string): Promise<Procedure | null> {
  return fetchApi<Procedure>(`/procedures/${code}`);
}

export async function getProcedureBySlug(slug: string): Promise<Procedure | null> {
  return fetchApi<Procedure>(`/procedures/by-slug/${slug}`);
}

export interface ConsumerDescription {
  code: string;
  consumerName: string | null;
  cmsDescription: string | null;
  plainDescription: string | null;
  whatToExpect: string | null;
  typicalDuration: string | null;
  commonReasons: string | null;
  preparationTips: string | null;
  source: 'consumer' | 'cms';
}

export async function getConsumerDescription(code: string): Promise<ConsumerDescription | null> {
  return fetchApi<ConsumerDescription>(`/procedures/${code}/consumer`);
}

export async function getRelatedProcedures(code: string): Promise<Array<{
  code: string;
  description: string;
  category: string;
  bodySystem: string;
  nationalFacilityRate: number | null;
  slug: string | null;
  relevance: number;
}>> {
  const data = await fetchApi<any[]>(`/related/${code}`);
  return data || [];
}

export async function getMetricsFacts(): Promise<Array<{
  key: string;
  value: number;
  label: string;
  detail: string;
}>> {
  const data = await fetchApi<any[]>('/metrics/facts');
  return data || [];
}

export async function getCategories(): Promise<{ categories: Array<[string, number]>; bodySystems: Array<[string, number]> }> {
  const data = await fetchApi<any>('/categories');
  return data || { categories: [], bodySystems: [] };
}

export async function getInjuries(relevance?: string): Promise<InjuryCategory[]> {
  const params = relevance ? `?relevance=${relevance}` : '';
  const data = await fetchApi<InjuryCategory[]>(`/injuries${params}`);
  return data || [];
}

export async function getInjury(slug: string) {
  return fetchApi<any>(`/injuries/${slug}`);
}

export async function getCompare(code: string, states: string[]) {
  return fetchApi<any>(`/compare?code=${code}&states=${states.join(',')}`);
}

export async function getStatistics() {
  return fetchApi<any>('/statistics');
}

export async function getCrashEstimate(severity: string, state = 'CO') {
  return fetchApi<CrashEstimate>(`/crash-estimate?severity=${severity}&state=${state}`);
}

// Settlement estimate
export interface SettlementEstimate {
  injury: { name: string; slug: string; bodyRegion: string; crashRelevance: string; description: string };
  severity: string;
  state: string;
  medicalCosts: { low: number; high: number; byPhase: Record<string, number>; source: string; note: string };
  lostWages: { recoveryWeeks: number; weeklyWage: number; workImpactFactor: string; low: number; high: number };
  settlement: {
    economicDamagesLow: number; economicDamagesHigh: number;
    multiplierLow: number; multiplierHigh: number;
    painAndSufferingLow: number; painAndSufferingHigh: number;
    totalEstimateLow: number; totalEstimateHigh: number;
  };
  methodology: { formula: string; multiplierMethod: string; medicalCostBasis: string; lostWageBasis: string; sources: string[] };
  attorneyImpact: { withoutAttorney: number; withAttorney: number; multiplier: number; source: string };
  disclaimer: string;
}

export async function getSettlementEstimate(injury: string, severity: string, state = 'CO'): Promise<SettlementEstimate | null> {
  return fetchApi<SettlementEstimate>(`/settlement-estimate?injury=${encodeURIComponent(injury)}&severity=${encodeURIComponent(severity)}&state=${encodeURIComponent(state)}`);
}

// Formatting utilities
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return 'N/A';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `$${(amount / 1_000).toFixed(0)}K`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatCurrencyFull(amount: number | null | undefined): string {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Drug-specific helpers
export async function getDrugs(params: {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: Procedure[]; pagination: { total: number; limit: number; offset: number } }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  qs.set('category', params.category || 'Prescription Drug');
  qs.set('limit', String(params.limit || 50));
  qs.set('offset', String(params.offset || 0));

  // Category with space means "starts with" — use the exact category names
  // For "all drugs" we search both brand and generic by using a search with category filter
  const res = await fetch(`${API_BASE}/api/procedures?${qs}`);
  const json = await res.json();
  return { data: json.data || [], pagination: json.pagination || { total: 0, limit: 50, offset: 0 } };
}

export async function getBrandDrugs(params: { limit?: number; offset?: number } = {}) {
  return getDrugs({ ...params, category: 'Prescription Drug - Brand' });
}

export async function getGenericDrugs(params: { limit?: number; offset?: number } = {}) {
  return getDrugs({ ...params, category: 'Prescription Drug - Generic' });
}

export async function getDrug(code: string): Promise<Procedure | null> {
  return fetchApi<Procedure>(`/procedures/${code}`);
}

// DRG helpers
export interface DrgSummary {
  drgCode: string;
  description: string;
  type: string;
  avgLengthOfStay: number | null;
  avgMedicarePayment: number | null;
  avgTotalCharges: number | null;
  avgTotalCosts: number | null;
  totalDischarges: number | null;
  year: number;
  source: string;
}

export interface DrgDetail extends DrgSummary {
  cmsInpatient: {
    totalDischarges: number | null;
    avgTotalCharges: number | null;
    avgTotalCosts: number | null;
    avgMedicarePayment: number | null;
    year: number;
  } | null;
  nySparcs: Array<{
    severity: string;
    totalDischarges: number | null;
    avgLengthOfStay: number | null;
    avgTotalCharges: number | null;
    avgTotalCosts: number | null;
    medianCharges: number | null;
    medianCosts: number | null;
    year: number;
  }>;
}

export async function getDrgList(params: {
  search?: string;
  type?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: DrgSummary[]; pagination: { total: number; limit: number; offset: number } }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.type) qs.set('type', params.type);
  qs.set('limit', String(params.limit || 100));
  qs.set('offset', String(params.offset || 0));

  const res = await fetch(`${API_BASE}/api/drg?${qs}`);
  const json = await res.json();
  return { data: json.data || [], pagination: json.pagination || { total: 0, limit: 100, offset: 0 } };
}

export async function getDrg(code: string): Promise<DrgDetail | null> {
  return fetchApi<DrgDetail>(`/drg/${code}`);
}

// Knowledge graph
export interface GraphRelationship {
  type: string;
  id: string;
  weight: number;
  direction: 'incoming' | 'outgoing';
}

export interface GraphResult {
  entity: { type: string; id: string };
  relationships: Record<string, GraphRelationship[]>;
  totalOutgoing: number;
  totalIncoming: number;
}

export async function getGraphRelationships(entityType: string, entityId: string): Promise<GraphResult | null> {
  return fetchApi<GraphResult>(`/graph/${entityType}/${entityId}`);
}

// Body Systems
export interface BodySystemSummary {
  bodySystem: string;
  procedureCount: number;
  avgCost: number;
  maxCost: number;
  minCost: number;
}

export async function getBodySystems(): Promise<BodySystemSummary[]> {
  const data = await fetchApi<BodySystemSummary[]>('/body-systems');
  return data || [];
}

export async function getBodySystemDetail(slug: string) {
  return fetchApi<any>(`/body-systems/${slug}`);
}

// Alternatives
export async function getAlternatives(code: string) {
  return fetchApi<any>(`/alternatives/${code}`);
}

// Medications for condition
export async function getMedications(conditionSlug: string) {
  return fetchApi<any>(`/medications/${conditionSlug}`);
}

// Hospital DRG costs
export interface HospitalDrgCost {
  providerCcn: string;
  providerName: string;
  providerCity: string;
  providerState: string;
  providerZip: string;
  drgCode: string;
  drgDescription: string;
  totalDischarges: number;
  avgCoveredCharges: number;
  avgTotalPayments: number;
  avgMedicarePayments: number;
  chargeToPaymentRatio: number | null;
  year: number;
}

export async function getHospitals(params: {
  state?: string;
  drg?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: HospitalDrgCost[]; pagination: { total: number; limit: number; offset: number }; summary?: Record<string, number> }> {
  const qs = new URLSearchParams();
  if (params.state) qs.set('state', params.state);
  if (params.drg) qs.set('drg', params.drg);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  qs.set('limit', String(params.limit || 50));
  qs.set('offset', String(params.offset || 0));

  const res = await fetch(`${API_BASE}/api/hospitals?${qs}`);
  const json = await res.json();
  return { data: json.data || [], pagination: json.pagination || { total: 0, limit: 50, offset: 0 }, summary: json.summary };
}

// Aggregate metrics (computed)
export async function getMetrics(): Promise<Record<string, any[]>> {
  const data = await fetchApi<any>('/metrics');
  return data?.metrics || {};
}

export const STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
];
