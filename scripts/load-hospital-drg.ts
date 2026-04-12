/**
 * Load CMS Inpatient by Provider data (hospital_drg_costs) into D1 via wrangler.
 *
 * Usage: npx tsx scripts/load-hospital-drg.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

const CSV_PATH = 'data/cms/cms-inpatient-by-provider-2023.csv';
const DB_NAME = 'medical-costs-db';
const BATCH_SIZE = 500;

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function escapeSQL(val: string): string {
  return val.replace(/'/g, "''");
}

function makeId(ccn: string, drg: string): string {
  const hash = createHash('md5').update(`${ccn}-${drg}`).digest('hex');
  return hash.substring(0, 32);
}

async function main() {
  console.log('Reading CSV...');
  const raw = readFileSync(CSV_PATH, 'latin1');
  const lines = raw.split('\n').filter(l => l.trim().length > 0);

  // Parse header
  const header = parseCSVLine(lines[0]);
  console.log('Header columns:', header.join(', '));

  // Find column indices
  const colMap: Record<string, number> = {};
  header.forEach((h, i) => colMap[h.trim()] = i);

  const ccnIdx = colMap['Rndrng_Prvdr_CCN'];
  const nameIdx = colMap['Rndrng_Prvdr_Org_Name'];
  const cityIdx = colMap['Rndrng_Prvdr_City'];
  const stateIdx = colMap['Rndrng_Prvdr_St'];
  const zipIdx = colMap['Rndrng_Prvdr_Zip5'];
  const drgCdIdx = colMap['DRG_Cd'];
  const drgDescIdx = colMap['DRG_Desc'];
  const dischIdx = colMap['Tot_Dschrgs'];
  const chargesIdx = colMap['Avg_Submtd_Cvrd_Chrg'];
  const paymentsIdx = colMap['Avg_Tot_Pymt_Amt'];
  const medicareIdx = colMap['Avg_Mdcr_Pymt_Amt'];

  // Note: Rndrng_Prvdr_St in this file appears to be the city field based on our inspection
  // The actual state abbreviation is in Rndrng_Prvdr_State_Abrvtn
  const stateAbrvIdx = colMap['Rndrng_Prvdr_State_Abrvtn'];

  console.log(`Parsing ${lines.length - 1} data rows...`);

  const dataRows = lines.slice(1);
  let batchNum = 0;
  let totalLoaded = 0;

  for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
    const batch = dataRows.slice(i, i + BATCH_SIZE);
    const values: string[] = [];

    for (const line of batch) {
      const fields = parseCSVLine(line);
      if (fields.length < 11) continue;

      const ccn = fields[ccnIdx] || '';
      const name = escapeSQL(fields[nameIdx] || '');
      const city = escapeSQL(fields[cityIdx] || '');
      // Use abbreviation column for state, fall back to stateIdx
      const state = (stateAbrvIdx !== undefined ? fields[stateAbrvIdx] : fields[stateIdx]) || '';
      const zip = fields[zipIdx] || '';
      const drgCd = fields[drgCdIdx] || '';
      const drgDesc = escapeSQL(fields[drgDescIdx] || '');
      const discharges = parseInt(fields[dischIdx]) || 0;
      const charges = parseFloat(fields[chargesIdx]) || 0;
      const payments = parseFloat(fields[paymentsIdx]) || 0;
      const medicare = parseFloat(fields[medicareIdx]) || 0;

      const id = makeId(ccn, drgCd);

      values.push(
        `('${id}-${i + values.length}','${escapeSQL(ccn)}','${name}','${city}','${escapeSQL(state)}','${zip}','${escapeSQL(drgCd)}','${drgDesc}',${discharges},${charges},${payments},${medicare},2023)`
      );
    }

    if (values.length === 0) continue;

    const sql = `INSERT OR IGNORE INTO hospital_drg_costs (id,provider_ccn,provider_name,provider_city,provider_state,provider_zip,drg_code,drg_description,total_discharges,avg_covered_charges,avg_total_payments,avg_medicare_payments,year) VALUES ${values.join(',')};`;

    // Write SQL to temp file to avoid command line length limits
    const tmpFile = `/tmp/hdc_batch_${batchNum}.sql`;
    writeFileSync(tmpFile, sql);

    try {
      execSync(`cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute ${DB_NAME} --remote --file=${tmpFile}`, {
        stdio: 'pipe',
        timeout: 60000,
      });
      totalLoaded += values.length;
      batchNum++;
      if (batchNum % 10 === 0) {
        console.log(`  Batch ${batchNum}: ${totalLoaded} rows loaded so far...`);
      }
    } catch (err: any) {
      console.error(`  Error on batch ${batchNum}:`, err.stderr?.toString().slice(0, 200));
      // Try to continue
      batchNum++;
    }
  }

  console.log(`Done! Loaded ${totalLoaded} rows in ${batchNum} batches.`);
}

main().catch(console.error);
