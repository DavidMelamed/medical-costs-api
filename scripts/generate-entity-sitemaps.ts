/**
 * Generate sitemaps for hospital profile pages and insurer detail pages.
 * Run: npx tsx scripts/generate-entity-sitemaps.ts
 */

const API_BASE = 'https://medical-costs-api.david-568.workers.dev';
const SITE_BASE = 'https://medical-costs-site.pages.dev';
const TODAY = new Date().toISOString().split('T')[0];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function generateHospitalSitemap(): Promise<string> {
  // Get all hospital CCNs by iterating through states
  const states = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
    'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
    'VA','WA','WV','WI','WY','DC'
  ];

  const ccnSet = new Set<string>();
  for (const state of states) {
    const res = await fetch(`${API_BASE}/api/hospitals?state=${state}&limit=500`);
    const json = await res.json();
    const rows: Array<{ providerCcn: string }> = json.data || [];
    for (const r of rows) {
      ccnSet.add(r.providerCcn);
    }
  }

  const hospitals = Array.from(ccnSet);
  console.log(`Found ${hospitals.length} hospitals for sitemap`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const ccn of hospitals) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_BASE}/hospitals/profile/${ccn}/</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';
  return xml;
}

async function generateInsurerSitemap(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/insurers?limit=200`);
  const json = await res.json();
  const payers: Array<{ payerName: string }> = json.data?.payers || [];

  console.log(`Found ${payers.length} insurers for sitemap`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Index page
  xml += `  <url>\n`;
  xml += `    <loc>${SITE_BASE}/insurers/</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;

  for (const p of payers) {
    const slug = slugify(p.payerName);
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_BASE}/insurers/${slug}/</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';
  return xml;
}

async function main() {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicDir = path.join(__dirname, '..', 'site', 'public');

  const [hospitalXml, insurerXml] = await Promise.all([
    generateHospitalSitemap(),
    generateInsurerSitemap(),
  ]);

  fs.writeFileSync(path.join(publicDir, 'sitemap-hospitals.xml'), hospitalXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-insurers.xml'), insurerXml);

  // Update sitemap index
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE}/sitemap-static.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-procedures-0.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-procedures-1.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-procedures-2.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-conditions.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-drgs.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-states.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-hospitals.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_BASE}/sitemap-insurers.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);

  console.log('Sitemaps generated successfully!');
}

main().catch(console.error);
