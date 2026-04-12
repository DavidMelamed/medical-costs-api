import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Note: We use a custom sitemap generator (scripts/generate-sitemaps.ts) that
// fetches all 21,500+ procedure codes, 140 conditions, 770 DRGs, and 51 states
// from the live API. The built-in @astrojs/sitemap plugin only knows about
// prerendered routes, so we disable it in favor of our custom sitemaps in public/.

export default defineConfig({
  site: 'https://medical-costs-site.pages.dev',
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind()],
  trailingSlash: 'always',
});
