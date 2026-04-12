/**
 * Bulk CMS PFS Data Loader
 * Parses the full CMS indicators2026.csv (31K rows, 17K codes) and
 * localities2026.csv (111 localities) and generates SQL for D1.
 *
 * Run: npx tsx load-cms-bulk.ts > data/cms/bulk-procedures.sql
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const CF = 33.4009;

function esc(s: string | null | undefined): string {
  if (s == null || s.trim() === '') return 'NULL';
  return "'" + s.trim().replace(/'/g, "''") + "'";
}

function num(n: string | null | undefined): string {
  if (n == null) return 'NULL';
  const v = parseFloat(n);
  if (isNaN(v) || v === 0) return 'NULL';
  return String(Math.round(v * 100) / 100);
}

// Load indicators
const indicatorsRaw = readFileSync('data/cms/indicators2026.csv', 'utf-8');
const indicators = parse(indicatorsRaw, { columns: true, skip_empty_lines: true });

// Load localities
const localitiesRaw = readFileSync('data/cms/localities2026.csv', 'utf-8');
const localities = parse(localitiesRaw, { columns: true, skip_empty_lines: true });

// Deduplicate: prefer base modifier (empty), take first occurrence
const seen = new Map<string, any>();
for (const r of indicators) {
  const code = r.hcpc?.trim();
  const mod = r.modifier?.trim();
  if (!code) continue;
  if (!seen.has(code) || mod === '') {
    seen.set(code, r);
  }
}

// Filter to active status with rates
const active = new Map<string, any>();
for (const [code, r] of seen) {
  const status = r.proc_stat?.trim();
  if (!['A', 'R', 'T'].includes(status)) continue;

  const facRvu = parseFloat(r.trans_fac_total?.trim() || '0');
  const nfacRvu = parseFloat(r.trans_nfac_total?.trim() || '0');
  if (facRvu > 0 || nfacRvu > 0) {
    active.set(code, r);
  }
}

console.error(`Loaded ${indicators.length} rows, ${seen.size} unique codes, ${active.size} with rates`);

// Categorize by code prefix
function categorize(code: string, desc: string): { category: string; bodySystem: string } {
  const c = code.toUpperCase();
  // Evaluation & Management
  if (c >= '99201' && c <= '99499') return { category: 'Evaluation & Management', bodySystem: 'General' };
  // Anesthesia
  if (c >= '00100' && c <= '01999') return { category: 'Anesthesia', bodySystem: 'General' };
  // Surgery ranges
  if (c >= '10000' && c <= '19999') return { category: 'Surgery - Integumentary', bodySystem: 'Integumentary' };
  if (c >= '20000' && c <= '29999') return { category: 'Surgery - Musculoskeletal', bodySystem: 'Musculoskeletal' };
  if (c >= '30000' && c <= '32999') return { category: 'Surgery - Respiratory', bodySystem: 'Respiratory' };
  if (c >= '33000' && c <= '37799') return { category: 'Surgery - Cardiovascular', bodySystem: 'Cardiovascular' };
  if (c >= '38000' && c <= '38999') return { category: 'Surgery - Hemic/Lymphatic', bodySystem: 'Hemic/Lymphatic' };
  if (c >= '39000' && c <= '39599') return { category: 'Surgery - Mediastinum/Diaphragm', bodySystem: 'Respiratory' };
  if (c >= '40000' && c <= '49999') return { category: 'Surgery - Digestive', bodySystem: 'Digestive' };
  if (c >= '50000' && c <= '53899') return { category: 'Surgery - Urinary', bodySystem: 'Urinary' };
  if (c >= '54000' && c <= '55899') return { category: 'Surgery - Male Genital', bodySystem: 'Reproductive' };
  if (c >= '55920' && c <= '58999') return { category: 'Surgery - Female Genital', bodySystem: 'Reproductive' };
  if (c >= '59000' && c <= '59899') return { category: 'Surgery - Maternity', bodySystem: 'Reproductive' };
  if (c >= '60000' && c <= '60699') return { category: 'Surgery - Endocrine', bodySystem: 'Endocrine' };
  if (c >= '61000' && c <= '64999') return { category: 'Surgery - Nervous', bodySystem: 'Nervous' };
  if (c >= '65000' && c <= '68899') return { category: 'Surgery - Eye', bodySystem: 'Eye' };
  if (c >= '69000' && c <= '69979') return { category: 'Surgery - Auditory', bodySystem: 'Auditory' };
  // Radiology
  if (c >= '70000' && c <= '79999') return { category: 'Radiology', bodySystem: inferBodyFromDesc(desc) };
  // Pathology/Lab
  if (c >= '80000' && c <= '89999') return { category: 'Pathology/Laboratory', bodySystem: 'General' };
  // Medicine
  if (c >= '90000' && c <= '90749') return { category: 'Immunization/Injection', bodySystem: 'General' };
  if (c >= '90801' && c <= '90899') return { category: 'Psychiatry', bodySystem: 'Nervous' };
  if (c >= '90901' && c <= '90911') return { category: 'Biofeedback', bodySystem: 'General' };
  if (c >= '91000' && c <= '91299') return { category: 'Gastroenterology', bodySystem: 'Digestive' };
  if (c >= '92002' && c <= '92499') return { category: 'Ophthalmology', bodySystem: 'Eye' };
  if (c >= '92502' && c <= '92700') return { category: 'Audiologic', bodySystem: 'Auditory' };
  if (c >= '93000' && c <= '93799') return { category: 'Cardiovascular', bodySystem: 'Cardiovascular' };
  if (c >= '93880' && c <= '93998') return { category: 'Vascular Studies', bodySystem: 'Cardiovascular' };
  if (c >= '94002' && c <= '94799') return { category: 'Pulmonary', bodySystem: 'Respiratory' };
  if (c >= '95004' && c <= '95199') return { category: 'Allergy/Immunology', bodySystem: 'General' };
  if (c >= '95700' && c <= '96020') return { category: 'Neurology/EMG', bodySystem: 'Nervous' };
  if (c >= '96100' && c <= '96155') return { category: 'Neuropsychological Testing', bodySystem: 'Nervous' };
  if (c >= '96360' && c <= '96549') return { category: 'Chemotherapy/Infusion', bodySystem: 'General' };
  if (c >= '97001' && c <= '97799') return { category: 'Physical Therapy/Rehab', bodySystem: 'Musculoskeletal' };
  if (c >= '98925' && c <= '98929') return { category: 'Osteopathic Manipulation', bodySystem: 'Musculoskeletal' };
  if (c >= '98940' && c <= '98943') return { category: 'Chiropractic', bodySystem: 'Musculoskeletal' };
  // HCPCS Level II
  if (c.startsWith('A')) return { category: 'HCPCS - Transport/Supplies', bodySystem: 'General' };
  if (c.startsWith('E')) return { category: 'HCPCS - DME', bodySystem: 'General' };
  if (c.startsWith('G')) return { category: 'HCPCS - Temporary Procedures', bodySystem: 'General' };
  if (c.startsWith('J')) return { category: 'HCPCS - Drugs', bodySystem: 'General' };
  if (c.startsWith('L')) return { category: 'HCPCS - Orthotics/Prosthetics', bodySystem: 'Musculoskeletal' };
  if (c.startsWith('Q')) return { category: 'HCPCS - Temporary Codes', bodySystem: 'General' };
  if (c.startsWith('V')) return { category: 'HCPCS - Vision/Hearing', bodySystem: 'Eye' };
  return { category: 'Other', bodySystem: 'General' };
}

function inferBodyFromDesc(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes('brain') || d.includes('head') || d.includes('skull')) return 'Nervous';
  if (d.includes('spine') || d.includes('cerv') || d.includes('lumbar') || d.includes('thorac')) return 'Musculoskeletal';
  if (d.includes('chest') || d.includes('lung')) return 'Respiratory';
  if (d.includes('abdom') || d.includes('pelvi')) return 'Digestive';
  if (d.includes('heart') || d.includes('cardi') || d.includes('aort')) return 'Cardiovascular';
  if (d.includes('knee') || d.includes('hip') || d.includes('shoulder') || d.includes('ankle') || d.includes('wrist') || d.includes('bone') || d.includes('femur') || d.includes('tibia')) return 'Musculoskeletal';
  if (d.includes('eye') || d.includes('orbit')) return 'Eye';
  if (d.includes('kidney') || d.includes('renal') || d.includes('bladder')) return 'Urinary';
  return 'General';
}

// Generate SQL
const lines: string[] = [];
lines.push('-- CMS PFS 2026 Bulk Load: ' + active.size + ' procedures');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('');

for (const [code, r] of active) {
  const desc = r.sdesc?.trim() || `Procedure ${code}`;
  const { category, bodySystem } = categorize(code, desc);
  const codeType = /^[A-VX-Z]/.test(code) ? 'HCPCS' : 'CPT';

  const workRvu = num(r.rvu_work);
  const facPeRvu = num(r.trans_fac_pe);
  const nfacPeRvu = num(r.trans_nfac_pe);
  const mpRvu = num(r.rvu_mp);
  const facTotalRvu = parseFloat(r.trans_fac_total?.trim() || '0');
  const nfacTotalRvu = parseFloat(r.trans_nfac_total?.trim() || '0');

  const facRate = facTotalRvu > 0 ? (facTotalRvu * CF).toFixed(2) : 'NULL';
  const nfacRate = nfacTotalRvu > 0 ? (nfacTotalRvu * CF).toFixed(2) : 'NULL';
  const totalRvu = Math.max(facTotalRvu, nfacTotalRvu);

  lines.push(`INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, work_rvu, facility_pe_rvu, non_fac_pe_rvu, malpractice_rvu, total_rvu, national_facility_rate, national_non_fac_rate, conversion_factor, effective_year, source_dataset) VALUES ('proc_${code}', ${esc(code)}, '${codeType}', ${esc(desc)}, ${esc(category)}, ${esc(bodySystem)}, ${workRvu}, ${facPeRvu}, ${nfacPeRvu}, ${mpRvu}, ${totalRvu > 0 ? totalRvu.toFixed(2) : 'NULL'}, ${facRate}, ${nfacRate}, 33.40, 2026, 'CMS_PFS');`);
}

// Localities
lines.push('');
lines.push('-- CMS GPCI Localities: ' + localities.length);

for (const loc of localities) {
  const locality = loc.locality?.trim();
  const desc = loc.loc_description?.trim();
  const mac = loc.mac?.trim();
  const macDesc = loc.mac_description?.trim();
  const workGpci = loc.gpci_work?.trim();
  const peGpci = loc.gpci_pe?.trim();
  const mpGpci = loc.gpci_mp?.trim();

  if (!locality || locality === '0000000') continue; // skip national

  // We'll store localities as a reference but geo cost records need procedure cross-join
  // Just output as comment for reference
  lines.push(`-- Locality ${locality}: ${desc} (MAC ${mac} ${macDesc}) Work=${workGpci} PE=${peGpci} MP=${mpGpci}`);
}

process.stdout.write(lines.join('\n'));
console.error(`\nGenerated SQL for ${active.size} procedures`);
