// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública. En la preview de Vercel se sobrescribe con SITE_URL.
const site = process.env.SITE_URL ?? 'https://amm-reformas.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
