# חריש עורכי דין – Brochure Flipbook

A serverless React single-page app that presents the Harish Advocates brochure as an 8‑page, right‑to‑left (Hebrew) page‑flipping booklet, built with [react-pageflip](https://github.com/Nodlik/react-pageflip).

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- react-pageflip (StPageFlip engine)
- No backend — pure static build, deployable to GitHub Pages

## Pages

Cover · About (אודות) · Team (הצוות) · Practice areas (תחומי עיסוק) · Tips (חשוב לדעת) · Media (מהתקשורת) · Contact (צור קשר) · Back cover

## Content / string table

All user-facing copy, links and image references live in [`src/content/`](src/content/):

- `shared.ts` — firm name, header/footer text, nav labels, asset URL helper.
- `pages.ts` — structured per-page content (paragraphs, lists, cards, profiles, links).

Page components in `src/pages/` only handle layout; edit text in `src/content/` without touching JSX. Images live in `public/assets/` and are referenced via the `asset()` helper so they resolve correctly under the GitHub Pages base path.

## Shared layout

`src/components/Page.tsx` is a shared, `forwardRef` page wrapper. Header and footer are opt‑in via `showHeader` / `showFooter` props, so the cover and back‑cover render neither.

## RTL flip strategy (two modes + toggle)

react-pageflip has no native RTL mode, so two approaches are provided and switchable at runtime (top‑bar toggle, or `?rtl=mirror|native` in the URL):

- **mirror** (default): the book is CSS‑mirrored (`scaleX(-1)`) for a true Hebrew right‑to‑left look. The engine's own pointer handling is disabled (`useMouseEvents=false`) and every flip is driven programmatically (buttons, gutter click zones, keyboard arrows, swipe) — this avoids the mirrored hit‑area bug.
- **native**: no mirror; the engine handles clicks/drag natively for the smoothest interaction, with the page curl originating from the LTR edge.

Navigation: side gutter zones, footer buttons, keyboard ←/→ (left advances in RTL), swipe (mirror mode), and a thumbnail strip.

## Develop

```bash
npm install
npm run dev
```

Open the printed URL (note the `/harish-advocates/` base path).

## Build

```bash
npm run build      # outputs static files to dist/
npm run preview    # preview the production build
```

The base path defaults to `/harish-advocates/`. Override it for a different repo:

```bash
VITE_BASE=/my-repo/ npm run build
```

## Deploy to GitHub Pages

This repo includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and publishes `dist/` on every push to `main`/`master`.

1. In the GitHub repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push to `main`/`master`. The workflow builds with `VITE_BASE=/harish-advocates/` and deploys.
3. Site is served at `https://<user>.github.io/harish-advocates/`.

### Alternative: deploy from a branch (no Actions)

If you prefer the classic "Deploy from a branch" source, build locally and commit the contents of `dist/` to the served root (or a `docs/` folder configured as the Pages source).
