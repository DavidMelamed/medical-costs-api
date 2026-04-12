/**
 * Load CMS Inpatient by Provider data into D1.
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

function esc(val: string): string {
  return val.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

async function main() {
  console.log('Reading CSV (latin-1)...');
  const raw = readFileSync(CSV_PATH, 'latin1');
  const lines = raw.split('\n').filter(l => l.trim().length > 0);

  const header = parseCSVLine(lines[0]);
  console.log('Columns:', header.length);

  // Map columns
  const colMap: Record<string, number> = {};
  header.forEach((h, i) => colMap[h.trim()] = i);

  const ccnIdx = colMap['Rndrng_Prvdr_CCN'];
  const nameIdx = colMap['Rndrng_Prvdr_Org_Name'];
  const cityIdx = colMap['Rndrng_Prvdr_City'];
  const stateAbrvIdx = colMap['Rndrng_Prvdr_State_Abrvtn'];
  const zipIdx = colMap['Rndrng_Prvdr_Zip5'];
  const drgCdIdx = colMap['DRG_Cd'];
  const drgDescIdx = colMap['DRG_Desc'];
  const dischIdx = colMap['Tot_Dschrgs'];
  const chargesIdx = colMap['Avg_Submtd_Cvrd_Chrg'];
  const paymentsIdx = colMap['Avg_Tot_Pymt_Amt'];
  const medicareIdx = colMap['Avg_Mdcr_Pymt_Amt'];

  // First clear any existing data
  console.log('Clearing existing data...');
  const clearSql = 'DELETE FROM hospital_drg_costs;';
  writeFileSync('/tmp/hdc_clear.sql', clearSql);
  try {
    execSync(`cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute ${DB_NAME} --remote --file=/tmp/hdc_clear.sql`, {
      stdio: 'pipe', timeout: 30000,
    });
  } catch (e) {
    console.log('Clear may have failed, continuing...');
  }

  const dataRows = lines.slice(1);
  console.log(`Processing ${dataRows.length} rows in batches of ${BATCH_SIZE}...`);

  let totalLoaded = 0;
  let batchNum = 0;
  let errors = 0;

  for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
    const batch = dataRows.slice(i, i + BATCH_SIZE);
    const values: string[] = [];

    for (let j = 0; j < batch.length; j++) {
      const fields = parseCSVLine(batch[j]);
      if (fields.length < 11) continue;

      const ccn = esc(fields[ccnIdx] || '');
      const name = esc(fields[nameIdx] || '');
      const city = esc(fields[cityIdx] || '');
      const state = esc(fields[stateAbrvIdx] || '');
      const zip = esc(fields[zipIdx] || '');
      const drgCd = esc(fields[drgCdIdx] || '');
      const drgDesc = esc(fields[drgDescIdx] || '');
      const discharges = parseInt(fields[dischIdx]) || 0;
      const charges = parseFloat(fields[chargesIdx]) || 0;
      const payments = parseFloat(fields[paymentsIdx]) || 0;
      const medicare = parseFloat(fields[medicareIdx]) || 0;

      // Use unique combination of index position as ID
      const rowId = `hdc_${i + j}`;

      values.push(
        `('${rowId}','${ccn}','${name}','${city}','${state}','${zip}','${drgCd}','${drgDesc}',${discharges},${charges},${payments},${medicare},2023)`
      );
    }

    if (values.length === 0) continue;

    const sql = `INSERT OR REPLACE INTO hospital_drg_costs (id,provider_ccn,provider_name,provider_city,provider_state,provider_zip,drg_code,drg_description,total_discharges,avg_covered_charges,avg_total_payments,avg_medicare_payments,year) VALUES\n${values.join(',\n')};`;

    const tmpFile = `/tmp/hdc_batch_${batchNum}.sql`;
    writeFileSync(tmpFile, sql);

    try {
      execSync(`cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute ${DB_NAME} --remote --file=${tmpFile}`, {
        stdio: 'pipe',
        timeout: 60000,
      });
      totalLoaded += values.length;
    } catch (err: any) {
      errors++;
      const errMsg = err.stderr?.toString().slice(0, 300) || err.message?.slice(0, 300);
      console.error(`  Batch ${batchNum} FAILED (rows ${i}-${i + BATCH_SIZE}): ${errMsg}`);
    }

    batchNum++;
    if (batchNum % 20 === 0) {
      console.log(`  Batch ${batchNum}/${Math.ceil(dataRows.length / BATCH_SIZE)}: ${totalLoaded} rows loaded (${errors} errors)`);
    }
  }

  console.log(`\nDone! Loaded ${totalLoaded}/${dataRows.length} rows in ${batchNum} batches (${errors} errors).`);
}

main().catch(console.error);
