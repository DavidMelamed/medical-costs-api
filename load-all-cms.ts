/**
 * Comprehensive CMS Data Loader
 * Loads RVU file (full descriptions), CLFS lab fees, OPPS outpatient rates,
 * and ASC rates into bulk SQL for D1.
 *
 * Run: npx tsx load-all-cms.ts 2>/dev/null > data/cms/all-cms.sql
 */

import { readFileSync } from 'fs';

const CF = 33.4009;

function esc(s: string | null | undefined): string {
  if (s == null || s.trim() === '') return 'NULL';
  return "'" + s.trim().replace(/'/g, "''") + "'";
}

const lines: string[] = [];
const p = (s: string) => lines.push(s);

p('-- Comprehensive CMS 2026 Data Load');
p('-- Sources: PFS RVU, CLFS Lab, OPPS Outpatient');
p('-- Generated: ' + new Date().toISOString());
p('');

// ============================================================================
// 1. RVU File — Better descriptions for existing procedures
// ============================================================================

const rvuRaw = readFileSync('data/cms/rvu26b/PPRRVU2026_Apr_nonQPP.csv', 'utf-8');
const rvuLines = rvuRaw.split('\n');

// Header is at line 9 (0-indexed), data starts at line 10
let rvuCount = 0;
const seenRvu = new Set<string>();

for (let i = 10; i < rvuLines.length; i++) {
  const parts = rvuLines[i].split(',');
  if (parts.length < 12) continue;

  const code = parts[0]?.trim();
  const mod = parts[1]?.trim();
  const desc = parts[2]?.trim();
  const status = parts[3]?.trim();

  if (!code || code.length < 4) continue;
  if (!['A', 'R', 'T'].includes(status)) continue;
  // Skip modifier variants — take base code only
  if (mod && mod !== '' && seenRvu.has(code)) continue;
  if (seenRvu.has(code)) continue;

  const workRvu = parseFloat(parts[5] || '0');
  const nfacPeRvu = parseFloat(parts[6] || '0');
  const facPeRvu = parseFloat(parts[8] || '0');
  const mpRvu = parseFloat(parts[10] || '0');
  const nfacTotal = parseFloat(parts[11] || '0');
  const facTotal = parseFloat(parts[12] || '0');

  if (nfacTotal <= 0 && facTotal <= 0 && workRvu <= 0) continue;

  const nfacRate = nfacTotal > 0 ? (nfacTotal * CF).toFixed(2) : 'NULL';
  const facRate = facTotal > 0 ? (facTotal * CF).toFixed(2) : 'NULL';
  const codeType = /^[A-VX-Z]/.test(code) ? 'HCPCS' : 'CPT';

  // Only update description if we have a better one (RVU file has longer descriptions)
  if (desc && desc.length > 3) {
    p(`UPDATE medical_procedures SET description=${esc(desc)} WHERE code=${esc(code)} AND effective_year=2026 AND length(description) < ${desc.length + 5};`);
  }

  seenRvu.add(code);
  rvuCount++;
}

p('');
p(`-- Updated descriptions for ${rvuCount} procedures from RVU file`);

// ============================================================================
// 2. CLFS — Clinical Laboratory Fee Schedule (~2,179 codes)
// ============================================================================

p('');
p('-- Clinical Laboratory Fee Schedule (CLFS) 2026 Q2');

const clfsRaw = readFileSync('data/cms/26clabq2/PUF_CLFS_CY2026_Q2V1.csv', 'utf-8');
const clfsLines = clfsRaw.split('\n');
let clfsCount = 0;

// Header at line 4: YEAR,HCPCS,MOD,EFF_DATE,INDICATOR,RATE,SHORTDESC,LONGDESC,EXTENDEDLONGDESC
for (let i = 5; i < clfsLines.length; i++) {
  // Parse carefully — fields may contain commas inside quotes
  const line = clfsLines[i];
  if (!line || !line.startsWith('2026')) continue;

  // Simple split won't work due to quoted fields. Parse manually.
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '"') { inQuotes = !inQuotes; continue; }
    if (c === ',' && !inQuotes) { fields.push(field); field = ''; continue; }
    field += c;
  }
  fields.push(field);

  const code = fields[1]?.trim();
  const mod = fields[2]?.trim();
  const rate = parseFloat(fields[5]?.trim() || '0');
  const shortDesc = fields[6]?.trim();
  const longDesc = fields[7]?.trim();

  if (!code || rate <= 0) continue;
  if (mod && mod !== '') continue; // Skip modifier variants

  const desc = longDesc && longDesc.length > 5 ? longDesc : shortDesc || `Lab test ${code}`;
  const codeType = /^[A-VX-Z]/.test(code) ? 'HCPCS' : 'CPT';

  p(`INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, national_facility_rate, national_non_fac_rate, effective_year, source_dataset, conversion_factor) VALUES ('proc_${code}', ${esc(code)}, '${codeType}', ${esc(desc.substring(0, 500))}, 'Pathology/Laboratory', 'General', ${rate.toFixed(2)}, ${rate.toFixed(2)}, 2026, 'CMS_CLFS', NULL);`);
  clfsCount++;
}

p(`-- Loaded ${clfsCount} CLFS lab codes`);

// ============================================================================
// 3. OPPS Addendum B — Hospital Outpatient Rates
// ============================================================================

p('');
p('-- OPPS Addendum B (Hospital Outpatient) April 2026');

try {
  const oppsPath = 'data/cms/opps-addendum-b-apr2026/508 Version April 2026 Web Addendum B/2026 April Web Addendum B.03.23.26.csv';
  const oppsRaw = readFileSync(oppsPath, 'utf-8');
  const oppsLines = oppsRaw.split('\n');
  let oppsCount = 0;

  // Find header
  let headerIdx = -1;
  for (let i = 0; i < Math.min(20, oppsLines.length); i++) {
    if (oppsLines[i].includes('HCPCS') && oppsLines[i].includes('Payment')) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx >= 0) {
    console.error(`OPPS header at line ${headerIdx}: ${oppsLines[headerIdx].substring(0, 200)}`);

    for (let i = headerIdx + 1; i < oppsLines.length; i++) {
      const line = oppsLines[i];
      if (!line || line.trim() === '') continue;

      // Parse quoted CSV
      const fields: string[] = [];
      let field = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') { inQuotes = !inQuotes; continue; }
        if (c === ',' && !inQuotes) { fields.push(field.trim()); field = ''; continue; }
        field += c;
      }
      fields.push(field.trim());

      // OPPS Addendum B typical columns: APC, Group Title, HCPCS, SI, Short Descriptor, Payment Rate, National Unadjusted Copayment, Minimum Unadjusted Copayment
      // Find HCPCS code (5 chars, starts with digit or letter)
      let code = '';
      let desc = '';
      let paymentRate = 0;
      let copay = 0;

      for (let k = 0; k < fields.length; k++) {
        const f = fields[k].replace(/['"]/g, '').trim();
        if (!code && /^[0-9A-Z][0-9]{3}[0-9A-Z]$/.test(f)) {
          code = f;
        }
        if (code && !desc && f.length > 5 && !/^[0-9.$]+$/.test(f) && !/^[A-Z]{1,2}$/.test(f)) {
          desc = f;
        }
        if (code && /^\$?[0-9,]+\.[0-9]{2}$/.test(f.replace(/[$,]/g, ''))) {
          const val = parseFloat(f.replace(/[$,]/g, ''));
          if (val > 0 && paymentRate === 0) paymentRate = val;
          else if (val > 0 && copay === 0) copay = val;
        }
      }

      if (code && paymentRate > 0) {
        // Update existing procedures with outpatient cost, or insert new
        p(`UPDATE medical_procedures SET hospital_outpatient_cost=${paymentRate.toFixed(2)}, hospital_outpatient_copay=${copay > 0 ? copay.toFixed(2) : 'NULL'} WHERE code=${esc(code)} AND effective_year=2026;`);
        oppsCount++;
      }
    }
  }

  p(`-- Updated ${oppsCount} procedures with OPPS outpatient rates`);
} catch (e) {
  console.error('OPPS file not found or error:', e);
}

// ============================================================================
// 4. Full GPCI Localities (109)
// ============================================================================

p('');
p('-- Full GPCI Localities (109 CMS localities)');

try {
  const gpciRaw = readFileSync('data/cms/rvu26b/GPCI2026.csv', 'utf-8');
  const gpciLines = gpciRaw.split('\n');

  // Find header
  let gpciHeader = -1;
  for (let i = 0; i < 10; i++) {
    if (gpciLines[i]?.includes('MAC') && gpciLines[i]?.includes('GPCI')) {
      gpciHeader = i;
      break;
    }
  }

  if (gpciHeader >= 0) {
    console.error(`GPCI header at line ${gpciHeader}`);
    let gpciCount = 0;

    // Generate geographic costs for top injury-related procedures across ALL localities
    const topCodes = "'99283','99284','99285','99213','99214','97110','97140','72141','72148','70450','70551','73721','74178','71260','27427','22612','63030','25605','99291','90837'";

    for (let i = gpciHeader + 1; i < gpciLines.length; i++) {
      const parts = gpciLines[i].split(',').map(s => s.replace(/"/g, '').trim());
      if (parts.length < 8) continue;

      const mac = parts[0];
      const state = parts[1];
      const localityNum = parts[2];
      const localityName = parts[3];
      const workGpciFloor = parseFloat(parts[5]) || 1.0; // Use with-floor value
      const peGpci = parseFloat(parts[6]) || 1.0;
      const mpGpci = parseFloat(parts[7]) || 1.0;

      if (!state || state.length !== 2) continue;

      const locKey = localityName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

      p(`INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)`);
      p(`SELECT 'geo_' || p.code || '_${state}_${locKey}', p.id, '${state}', ${esc(localityName)}, ${esc(mac)}, ${workGpciFloor}, ${peGpci}, ${mpGpci},`);
      p(`  ROUND((p.work_rvu*${workGpciFloor}+COALESCE(p.facility_pe_rvu,0)*${peGpci}+p.malpractice_rvu*${mpGpci})*33.40,2), 1.5,`);
      p(`  ROUND((p.work_rvu*${workGpciFloor}+COALESCE(p.facility_pe_rvu,0)*${peGpci}+p.malpractice_rvu*${mpGpci})*33.40*1.5,2),`);
      p(`  ROUND((p.work_rvu*${workGpciFloor}+COALESCE(p.facility_pe_rvu,0)*${peGpci}+p.malpractice_rvu*${mpGpci})*33.40*2.5,2), 2026`);
      p(`FROM medical_procedures p WHERE p.code IN (${topCodes}) AND p.work_rvu IS NOT NULL AND p.work_rvu > 0;`);
      gpciCount++;
    }

    p(`-- Generated geographic costs for ${gpciCount} localities x 20 procedures`);
  }
} catch (e) {
  console.error('GPCI file error:', e);
}

process.stdout.write(lines.join('\n'));
