/**
 * Sitemap Generator for MedicalCosts.info
 *
 * Fetches all procedure codes, condition slugs, DRG codes, and state codes
 * from the live API and generates XML sitemaps split into segments of 10,000 URLs.
 *
 * Run with: npx tsx scripts/generate-sitemaps.ts
 */

const API_BASE = 'https://medical-costs-api.david-568.workers.dev';
const SITE_URL = 'https://medical-costs-site.pages.dev';
const OUTPUT_DIR = new URL('../site/public/', import.meta.url).pathname;
const MAX_URLS_PER_SITEMAP = 10_000;

const today = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function xmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function urlEntry(loc: string, priority: number, changefreq: string = 'weekly'): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function wrapSitemap(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

function sitemapIndexEntry(loc: string): string {
  return `  <sitemap>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`;
}

function wrapSitemapIndex(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

async function writeFile(filename: string, content: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const filepath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filepath, content, 'utf-8');
  console.log(`  Wrote ${filename} (${(content.length / 1024).toFixed(1)} KB)`);
}

// ---------------------------------------------------------------------------
// API fetching with pagination
// ---------------------------------------------------------------------------

async function fetchAllProcedureCodes(): Promise<string[]> {
  const codes: string[] = [];
  const limit = 200;
  let offset = 0;
  let total = Infinity;

  console.log('Fetching procedure codes...');
  while (offset < total) {
    const res = await fetch(`${API_BASE}/api/procedures?limit=${limit}&offset=${offset}`);
    const json = await res.json() as any;
    const data: any[] = json.data || [];
    total = json.pagination?.total || 0;

    for (const proc of data) {
      if (proc.code) codes.push(proc.code);
    }

    offset += limit;
    if (data.length === 0) break;
    // Rate-limit politeness
    if (offset % 2000 === 0) {
      console.log(`  ... fetched ${codes.length} / ${total} procedures`);
    }
  }

  console.log(`  Total procedure codes: ${codes.length}`);
  return [...new Set(codes)];
}

async function fetchAllConditionSlugs(): Promise<string[]> {
  console.log('Fetching condition slugs...');
  const res = await fetch(`${API_BASE}/api/injuries`);
  const json = await res.json() as any;
  const data: any[] = json.data || [];
  const slugs = data.map((c: any) => c.slug).filter(Boolean);
  console.log(`  Total condition slugs: ${slugs.length}`);
  return slugs;
}

async function fetchAllDrgCodes(): Promise<string[]> {
  const codes: string[] = [];
  const limit = 500;
  let offset = 0;
  let total = Infinity;

  console.log('Fetching DRG codes...');
  while (offset < total) {
    const res = await fetch(`${API_BASE}/api/drg?limit=${limit}&offset=${offset}`);
    const json = await res.json() as any;
    const data: any[] = json.data || [];
    total = json.pagination?.total || 0;

    for (const drg of data) {
      if (drg.drgCode) codes.push(drg.drgCode);
    }

    offset += limit;
    if (data.length === 0) break;
    if (offset % 2000 === 0) {
      console.log(`  ... fetched ${codes.length} / ${total} DRGs`);
    }
  }

  console.log(`  Total DRG codes: ${codes.length}`);
  return [...new Set(codes)];
}

// ---------------------------------------------------------------------------
// State codes (hardcoded — same as site/src/lib/api.ts STATES)
// ---------------------------------------------------------------------------

const STATE_CODES = [
  'al','ak','az','ar','ca','co','ct','de','fl','ga',
  'hi','id','il','in','ia','ks','ky','la','me','md',
  'ma','mi','mn','ms','mo','mt','ne','nv','nh','nj',
  'nm','ny','nc','nd','oh','ok','or','pa','ri','sc',
  'sd','tn','tx','ut','vt','va','wa','wv','wi','wy','dc',
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const fs = await import('fs/promises');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`\nGenerating sitemaps for ${SITE_URL}\n`);

  // Fetch data from API
  const [procedureCodes, conditionSlugs, drgCodes] = await Promise.all([
    fetchAllProcedureCodes(),
    fetchAllConditionSlugs(),
    fetchAllDrgCodes(),
  ]);

  const sitemapFiles: string[] = [];

  // ---- Static pages ----
  const staticUrls = [
    urlEntry(`${SITE_URL}/`, 1.0, 'daily'),
    urlEntry(`${SITE_URL}/procedures/`, 0.9, 'weekly'),
    urlEntry(`${SITE_URL}/categories/`, 0.8, 'weekly'),
    urlEntry(`${SITE_URL}/conditions/`, 0.8, 'weekly'),
    urlEntry(`${SITE_URL}/drugs/`, 0.8, 'weekly'),
    urlEntry(`${SITE_URL}/drg/`, 0.8, 'weekly'),
    urlEntry(`${SITE_URL}/states/`, 0.8, 'weekly'),
    urlEntry(`${SITE_URL}/estimator/`, 0.7, 'weekly'),
    urlEntry(`${SITE_URL}/compare/`, 0.7, 'weekly'),
    urlEntry(`${SITE_URL}/mcp/`, 0.6, 'monthly'),
    urlEntry(`${SITE_URL}/about/`, 0.6, 'monthly'),
    urlEntry(`${SITE_URL}/methodology/`, 0.7, 'monthly'),
  ];
  await writeFile('sitemap-static.xml', wrapSitemap(staticUrls));
  sitemapFiles.push('sitemap-static.xml');

  // ---- Procedures (split into 10k segments) ----
  const procEntries = procedureCodes.map(code =>
    urlEntry(`${SITE_URL}/procedures/${encodeURIComponent(code)}/`, 0.8)
  );

  const procSegments = Math.ceil(procEntries.length / MAX_URLS_PER_SITEMAP);
  for (let i = 0; i < procSegments; i++) {
    const slice = procEntries.slice(i * MAX_URLS_PER_SITEMAP, (i + 1) * MAX_URLS_PER_SITEMAP);
    const filename = `sitemap-procedures-${i}.xml`;
    await writeFile(filename, wrapSitemap(slice));
    sitemapFiles.push(filename);
  }

  // ---- Conditions ----
  const condEntries = conditionSlugs.map(slug =>
    urlEntry(`${SITE_URL}/conditions/${encodeURIComponent(slug)}/`, 0.7)
  );
  await writeFile('sitemap-conditions.xml', wrapSitemap(condEntries));
  sitemapFiles.push('sitemap-conditions.xml');

  // ---- DRGs ----
  const drgEntries = drgCodes.map(code =>
    urlEntry(`${SITE_URL}/drg/${encodeURIComponent(code)}/`, 0.7)
  );
  await writeFile('sitemap-drgs.xml', wrapSitemap(drgEntries));
  sitemapFiles.push('sitemap-drgs.xml');

  // ---- States ----
  const stateEntries = STATE_CODES.map(code =>
    urlEntry(`${SITE_URL}/states/${code}/`, 0.6)
  );
  await writeFile('sitemap-states.xml', wrapSitemap(stateEntries));
  sitemapFiles.push('sitemap-states.xml');

  // ---- Sitemap Index ----
  const indexEntries = sitemapFiles.map(f =>
    sitemapIndexEntry(`${SITE_URL}/${f}`)
  );
  await writeFile('sitemap-index.xml', wrapSitemapIndex(indexEntries));

  // Summary
  const totalUrls = staticUrls.length + procEntries.length + condEntries.length + drgEntries.length + stateEntries.length;
  console.log(`\nDone! Generated ${sitemapFiles.length + 1} sitemap files with ${totalUrls.toLocaleString()} total URLs.`);
  console.log(`  Procedures: ${procEntries.length.toLocaleString()} (${procSegments} file${procSegments > 1 ? 's' : ''})`);
  console.log(`  Conditions: ${condEntries.length}`);
  console.log(`  DRGs: ${drgEntries.length.toLocaleString()}`);
  console.log(`  States: ${stateEntries.length}`);
  console.log(`  Static: ${staticUrls.length}`);
  console.log(`\nSitemap index: ${OUTPUT_DIR}sitemap-index.xml`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
