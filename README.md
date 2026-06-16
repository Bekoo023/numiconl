# Numico — Next.js

A Next.js (App Router) port of the original Vite + React Router version of the
Numico landing site. Same look, same Three.js background.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Three.js animated background

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Before running, copy your two logo images into `public/`:

- `public/logo.png` — header & footer logo
- `public/logo-trans.png` — favicon

(They're the same files from your original repo's `public/` folder.)

## Routes

- `/` — Home (`app/page.tsx`)
- `/pricing` — Pricing (`app/pricing/page.tsx`)

File-based routing replaces React Router. To add a page like `/contact`, create
`app/contact/page.tsx`. The header, footer, and CTA links already point to
several routes (`/login`, `/register`, `/app`, `/demo`, `/contact`, etc.) that
don't exist yet — add a `page.tsx` for each one as you build it.

## What changed from the Vite version

1. **Routing** — React Router (`<Router>/<Routes>/<Route>`) became Next.js
   file-based routing. `<Link to=...>` became `next/link`'s `<Link href=...>`.
2. **The 3D background renders once.** In the original, both the layout and the
   pricing page mounted their own `ThreeScene`, so `/pricing` ran two WebGL
   contexts at once. Here it lives only in `app/layout.tsx`.
3. **Animation loop is cleaned up.** The original never cancelled its
   `requestAnimationFrame`, so the loop kept running after unmount (a leak).
   `ThreeScene.tsx` now stores the frame id and calls `cancelAnimationFrame`
   on cleanup.
4. **Reduced motion respected.** If the visitor has
   `prefers-reduced-motion: reduce`, the scene renders one static frame instead
   of animating.
5. `ThreeScene` and `Header` are client components (`"use client"`) because they
   use the DOM / hooks; everything else renders on the server.

## Performance note

The background draws 1,500 animated particles, updated on the CPU each frame.
It's faithful to the original but heavy on low-end phones. To lighten it, lower
`particleCount` near the top of `components/ThreeScene.tsx`.

## Deploying

Works on Vercel out of the box — push to a repo and import it, no extra config.
