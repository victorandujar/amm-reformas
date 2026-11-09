import type { APIRoute } from 'astro';
import { isDemo } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const body = isDemo
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
