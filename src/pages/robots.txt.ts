import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  const base = (import.meta.env.PUBLIC_SITE_URL ?? 'https://stillpoint.vercel.app').replace(/\/$/, '');
  const body = `User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
