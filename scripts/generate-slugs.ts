/**
 * Generate procedure_slugs from medical_procedures descriptions.
 * Outputs SQL INSERT statements to stdout.
 */

import { execSync } from 'child_process';

const DB_ID = 'f3c4c390-86ac-4ffc-a887-0198c35abdc2';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')           // remove apostrophes
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric to hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-');         // collapse double hyphens
}

// Shorten common patterns for cleaner slugs
function smartSlugify(desc: string, code: string): string {
  let text = desc;
  // Remove trailing qualifiers that are too long
  text = text.replace(/,?\s*each\s+additional\s+.*/i, '');
  text = text.replace(/,?\s*each\s+\d+\s+min(ute)?s?$/i, '');
  text = text.replace(/\s+w\/o\s+/gi, ' without ');
  text = text.replace(/\s+w\/\s+/gi, ' with ');
  text = text.replace(/\s+ea\s+addl$/i, '');
  text = text.replace(/\s+1st\s+les$/i, '');
  text = text.replace(/\s+addl\s+les$/i, '');

  let slug = slugify(text);

  // Truncate very long slugs (max ~80 chars)
  if (slug.length > 80) {
    slug = slug.substring(0, 80).replace(/-[^-]*$/, '');
  }

  return slug;
}

async function main() {
  // Fetch all procedures
  const result = execSync(
    `cd /mnt/c/repos/medical-costs-api && npx wrangler d1 execute medical-costs-db --remote --json --command "SELECT code, description FROM medical_procedures ORDER BY code"`,
    { maxBuffer: 50 * 1024 * 1024, encoding: 'utf-8' }
  );

  const parsed = JSON.parse(result);
  const rows = parsed[0]?.results || [];

  console.error(`Processing ${rows.length} procedures...`);

  const slugMap = new Map<string, { code: string; description: string }>();
  const codeMap = new Map<string, string>(); // code -> slug

  for (const row of rows) {
    const { code, description } = row;
    let slug = smartSlugify(description, code);

    // Handle duplicates by appending code
    if (slugMap.has(slug)) {
      slug = `${slug}-${code.toLowerCase()}`;
    }

    // If still duplicate (unlikely), add numeric suffix
    let finalSlug = slug;
    let counter = 2;
    while (slugMap.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    slugMap.set(finalSlug, { code, description });
    codeMap.set(code, finalSlug);
  }

  // Output SQL in batches of 500
  const entries = Array.from(slugMap.entries());
  const BATCH = 500;

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const values = batch.map(([slug, { code, description }]) => {
      const escSlug = slug.replace(/'/g, "''");
      const escCode = code.replace(/'/g, "''");
      const escDesc = description.replace(/'/g, "''");
      return `('${escSlug}','${escCode}','${escDesc}')`;
    }).join(',\n');

    console.log(`INSERT OR IGNORE INTO procedure_slugs (slug, code, description) VALUES\n${values};`);
  }

  console.error(`Generated ${entries.length} slugs`);
}

main().catch(e => { console.error(e); process.exit(1); });
