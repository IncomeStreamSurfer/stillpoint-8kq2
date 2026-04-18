# Stillpoint

A quieter meditation app. This is the marketing + waitlist site.

## What was built

- **Hero + features + how-it-works + waitlist + FAQ + footer** — a single-page landing built with Astro 6 and Tailwind v4.
- **Waitlist capture** — `POST /api/waitlist` validates the email, inserts into the Supabase `stillpoint_waitlist` table, and fires a Resend confirmation email (`onboarding@resend.dev`).
- **Content table** — `stillpoint_content` table pre-provisioned in Supabase for future articles / SEO posts.
- **Programmatic SEO** — `/sitemap.xml`, `/robots.txt`, JSON-LD (`Organization` + `WebSite` + `MobileApplication`) on every page.
- **Palette** — purple (`#6B46C1`) + cream (`#FAF7F2`), soft blurred blooms, Cormorant Garamond for display, Inter for body.

## Stack

- Astro 6 (server output via `@astrojs/vercel`)
- Tailwind v4 via `@tailwindcss/vite`
- Supabase JS (waitlist + content)
- Resend REST API (confirmation email)

## Local dev

```bash
cp .env.example .env
# Fill in PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, RESEND_API_KEY
npm install
npm run dev
```

## Production

Deployed on Vercel. Env vars set via dashboard or the Vercel REST API:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `PUBLIC_SITE_URL`

## Schema

```sql
-- Waitlist emails (insert-only, RLS allows anon inserts; reads are service-role only)
create table stillpoint_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz default now()
);

-- Future blog / SEO articles (Harbor writes here)
create table stillpoint_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text,
  published_at timestamptz,
  seo_description text,
  created_at timestamptz default now()
);
```

## TODO

- Verify a custom Resend domain and update `FROM` in `src/lib/email.ts`.
- Connect a custom domain in Vercel.
- Wire `/blog` to `stillpoint_content` when Harbor starts writing articles.
