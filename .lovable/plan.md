## Goal
Ship Cloudflare Pages-compatible fixes and the new homepage/sections without touching existing animations, particles, loader timing, or Contact page design.

## Cloudflare Compatibility Fixes
1. **Navbar links** (`src/components/site/Header.tsx`): replace items with `Work | Services | Pricing | About | [Get Started]`. The first four use smooth-scroll to homepage section IDs (`#work`, `#services`, `#pricing`, `#about`); if not on `/`, navigate to `/#section`. `Get Started` → `/contact` via `<Link>`.
2. **Logo asset path**: stop relying on absolute `/assets/...`. Keep the existing `.asset.json` CDN URL (works on Cloudflare — it's an absolute CDN URL, not a build-relative path). The bug described typically comes from `/src/assets/...` or `import.meta.env.BASE_URL`. I'll verify the current import is the JSON pointer (`import logo from "@/assets/jepy-logo.png.asset.json"; <img src={logo.url} />`) in both `Header.tsx` and `Loader.tsx`. If anything still uses a string path, swap to the JSON import.
3. **Custom cursor**: rewrite `src/components/site/Cursor.tsx` as a single `useEffect` with `mousemove` → `el.style.transform = translate(...)`. Preserve existing hover-scale/glow classes by toggling a `data-hover` attribute (no eval, no Function, CSP-safe). Mount once via `App`/`__root`.

## New Features
4. **Scroll progress bar**: confirm `ScrollProgress.tsx` is mounted in `__root.tsx`; ensure it's 3px, `#00FF00`, `position: fixed; top: 0; z-50`.
5. **Double marquee** (`src/components/sections/Marquee.tsx`): two rows, CSS keyframes (`@keyframes marquee-left/right`), duplicated content, `:hover { animation-play-state: paused }` on the group. Uppercase, tracking-wider, white/40 text, `✦` in neon green.
6. **Showreel** (`src/components/sections/Showreel.tsx`): 100vh sticky/scroll-scaled `<video>` with placeholder `mov_bbb.mp4`, autoplay/muted/loop/playsinline. Use GSAP ScrollTrigger (already in project) to animate `scale` (1 → 0.8) and `borderRadius` (0 → 16). Single `VIDEO_SRC` constant at top.

## Homepage Composition (`src/routes/index.tsx`)
Order: Hero → Marquee → Showreel → WhatGoesIn → WorkPreview(#work) → Services(#services) → Pricing(#pricing) → Reviews(#reviews) → FAQ(#faq) → CTA → Footer(#about). Each new section wrapped in existing `<Reveal>` for scroll-in fade/slide.

New section components under `src/components/sections/`:
- `WhatGoesIn.tsx` — three alternating media/text rows (Hook/Story/Conversion), green-tinted 16:9 placeholders.
- `WorkPreview.tsx` — 3 cards, click opens YouTube modal (`<dialog>` or existing modal pattern). Single `WORK_ITEMS` array with `youtubeId` placeholders.
- `ServicesPreview.tsx` — 6 lucide-icon cards.
- `Pricing.tsx` — 3 tiers, middle highlighted with neon border + "Most Popular" badge.
- `Reviews.tsx` — single CSS marquee left, 6 cards duplicated.
- `FAQ.tsx` — Radix Accordion (already in shadcn), single-open.
- `CTA.tsx` — green-glow band.
- Footer updated with `id="about"` and social icons.

## Dedicated Pages
- `src/routes/work.tsx`: heading + 6-card grid with YouTube modal (reuse modal from WorkPreview).
- `src/routes/services.tsx`: 6 detailed service blocks + bottom CTA.
- `src/routes/contact.tsx`: untouched except inheriting the fixed Header.

## Technical Notes
- All new CSS keyframes added to `src/styles.css` under existing `@theme`/utility layer.
- No new deps (GSAP, lucide-react, shadcn Accordion already installed — will verify).
- Smooth-scroll handler: small util `scrollToId(id)` with `behavior:'smooth'`; if `location.pathname !== '/'`, `router.navigate({ to: '/', hash: id })` then scroll after mount.
- YouTube modal uses plain `<iframe>` (no extra package).
- All animations preserved: Loader, Cursor effects, Particles, Aurora, Reveal, Magnetic, Counter remain.

## Out of Scope
Real video URLs, real review copy beyond placeholders, real pricing numbers (use `$X / $XX / $XXX` as requested).
