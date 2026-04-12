import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://medicalcosts.info',
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind(), sitemap()],
  trailingSlash: 'always',
});
