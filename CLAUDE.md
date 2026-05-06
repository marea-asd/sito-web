# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Astro dev server at http://localhost:4321
- `npm run build` — production build to `./dist/` (CI runs this on Node 18/20/22)
- `npm run preview` — serve the built site locally
- `npm run check` — runs all three: `astro check` (types), `eslint .`, `prettier --check .`
  - Individual gates: `npm run check:astro`, `check:eslint`, `check:prettier`
- `npm run fix` — `eslint --fix` then `prettier -w .`

There is no test runner configured (`npm test` is commented out in CI).

## Architecture

This is the **AstroWind** template — Astro 5 + Tailwind, `output: 'static'`. Most pages compose pre-built section "widgets"; the site is largely configuration-driven rather than custom-coded.

### The `astrowind:config` virtual module (important)

`vendor/integration/index.ts` is a custom Astro integration that:

1. Reads `src/config.yaml` at config-setup time and parses it through `vendor/integration/utils/configBuilder.ts` into typed objects (`SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`).
2. Exposes those via a Vite virtual module: `import { SITE, APP_BLOG, ... } from 'astrowind:config';`
3. Drives Astro's `site`, `base`, and `trailingSlash` from the YAML — **don't set these in `astro.config.ts`**, edit `src/config.yaml`.
4. On `astro:build:done`, rewrites `dist/robots.txt` to point at `sitemap-index.xml`.

Anything that reads SITE/blog config (permalinks, layouts, blog utilities) imports from `astrowind:config`. If you add a new config key, thread it through `configBuilder` so it's exposed on the virtual module.

### Path alias

`~/*` → `src/*` (defined in both `tsconfig.json` and `astro.config.ts` Vite alias). Prefer `~/utils/...` over relative paths.

### Blog system

- Posts live in `src/data/post/` as `.md` / `.mdx`. Schema is enforced by `src/content/config.ts` (Zod) — Astro content collection name is `post`.
- All blog routing flows through `src/pages/[...blog]/` (paginated index, `[category]`, `[tag]`, single post). The base segment ("blog", "category", "tag") is configurable via `APP_BLOG.*.pathname`; disabling a sub-app in `config.yaml` should remove its routes.
- Permalink generation lives in `src/utils/permalinks.ts` and `src/utils/blog.ts`. Post permalinks use `APP_BLOG.post.permalink` with tokens `%slug% %id% %category% %year% %month% %day% %hour% %minute% %second%`. When changing routing, update both the `pages/[...blog]/` files and these utils together.
- Markdown pipeline injects three custom plugins from `src/utils/frontmatter.ts`: `readingTimeRemarkPlugin` (sets `frontmatter.readingTime`), `responsiveTablesRehypePlugin`, `lazyImagesRehypePlugin`.

### Component layering

- `src/components/ui/` — low-level primitives (Button, Headline, ItemGrid, WidgetWrapper).
- `src/components/widgets/` — full page sections (Hero, Features, Pricing, Footer, Header, …). Pages are composed by stacking widgets.
- `src/components/common/` — site-wide concerns (Metadata, Analytics, theme/menu toggles, BasicScripts).
- `src/components/blog/` — blog-specific UI (Grid, ListItem, Pagination, SinglePost, RelatedPosts).
- Layouts in `src/layouts/`: `Layout` (base shell) → `PageLayout` (Header+Footer wrapper) → `MarkdownLayout` / `LandingLayout` for variants.

### Pages

- `src/pages/index.astro` is the default home; `src/pages/homes/*.astro` and `src/pages/landing/*.astro` are alternate templates you can copy over `index.astro` or link to directly.
- Top-level `about.astro`, `contact.astro`, `pricing.astro`, `services.astro`, `404.astro`, plus markdown `privacy.md` / `terms.md` rendered via `MarkdownLayout`.

### Icons

`astro-icon` is configured in `astro.config.ts` to bundle the entire `tabler` set plus a curated subset of `flat-color-icons`. Reference as `<Icon name="tabler:..." />`. Adding a `flat-color-icons` icon requires editing the include list in `astro.config.ts`.

### Styling

Tailwind 3 with `applyBaseStyles: false` — base styles live in `src/assets/styles/tailwind.css`. Theme tokens (CSS variables for colors / fonts) and dark-mode behavior are in `src/components/CustomStyles.astro`. Theme mode (`system`/`light`/`dark`/`*:only`) is set by `ui.theme` in `config.yaml` and applied by `ApplyColorMode.astro` + `ToggleTheme.astro`.

### Build optimizations

`astro-compress` minifies CSS/HTML/JS in the build (Image/SVG compression disabled — Astro Assets + sharp handle images). The `partytown` integration is gated behind a `hasExternalScripts` flag in `astro.config.ts` — flip it to `true` if you add third-party scripts that should run in a worker.
