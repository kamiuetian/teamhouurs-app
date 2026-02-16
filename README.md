# TeamHouurs.app — Production-ready Next.js app (Vercel)

This repository contains a **programmatic SEO** + **interactive tool** app for finding the best meeting times between cities.

## What you get

- ✅ Interactive **time-zone overlap grid** (click any hour to sync across cities)
- ✅ Built-in searchable list of major global cities (IANA time zones)
- ✅ Programmatic SEO pages:
  - `/meeting/london-to-new-york`
  - `/meeting/tokyo-to-singapore`
  - …generated for every city pair in `src/data/cities.ts`
- ✅ Dynamic metadata (title/description/canonical/Open Graph/Twitter)
- ✅ Dynamic OG images (per city pair) using `next/og` (Edge runtime)
- ✅ `sitemap.xml` and `robots.txt`
- ✅ Tailwind styling + responsive UI

## Local dev

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import**.
3. Framework: Next.js (auto-detected).
4. Optional env vars:
   - `NEXT_PUBLIC_SITE_URL=https://teamhouurs.app`
   - `NEXT_PUBLIC_SITE_NAME=TeamHouurs`
5. Add your domain in **Project Settings → Domains**.

## Expanding cities (and SEO pages)

Edit `src/data/cities.ts` and add more entries:

```ts
{ slug: 'zurich', name: 'Zurich', country: 'Switzerland', timeZone: 'Europe/Zurich' }
```

The app automatically updates:
- homepage search suggestions
- `/meeting/*` pages (via `generateStaticParams`)
- `sitemap.xml`

> Note: every new city increases the number of pages roughly by `N*(N-1)`.

## Work hours logic

Default work windows:
- Work: 09:00–17:00
- Shoulder: 07:00–09:00 and 17:00–21:00
- Sleep: 21:00–07:00

You can change these constants in `src/lib/time.ts`.

## Monetization

There is a safe placeholder component at `src/components/AdPlaceholder.tsx`.
Swap it with AdSense (or another network) once you’re approved.

---

If you want a bigger city list (500+), optional holiday/weather data, or CSV import for cities, you can add that on top of this base.
