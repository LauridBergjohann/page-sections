# Demo development

The reference application in `apps/demo` uses SvelteKit 2, Svelte 5 and adapter-static. It shows how to use the public workspace packages in a conventional routed application. SvelteKit belongs only to this private demo workspace; neither published package depends on it.

## Start locally

From the repository root with Node 24 and npm 11:

```bash
npm ci
npm run dev:demo
```

This builds the workspace packages and starts the SvelteKit development server at **http://127.0.0.1:5173** with hot reload for demo edits. Package source changes require a separate `npm run build` before reloading the demo.

For the production preview:

```bash
npm run demo
```

This builds both packages, builds and prerenders the SvelteKit application, then starts the preview at **http://127.0.0.1:4173**. Both servers bind to 127.0.0.1 and use strict ports. Stop a server with Ctrl+C before starting another on its port.

To build without serving, or preview an existing build:

```bash
npm run build:demo
npm run preview -w @page-sections/demo
```

## Routes and shared layout

| File | Responsibility |
| --- | --- |
| `src/routes/+layout.svelte` | PageShell, Navigation, MainMenu, integrated logo, compact Settings disclosure, resource links and Light/Dark icon controls |
| `src/routes/+layout.ts` | Prerender all routes and use trailing slashes |
| `src/routes/+page.svelte` | Landing page with hero and links to both showcases |
| `src/routes/components/+page.svelte` | Content sections, responsive grids, standalone Card/Image and data-driven Sections |
| `src/routes/backgrounds/+page.svelte` | All solid/gradient backgrounds, both background widths and explicit surface grouping |
| `src/lib/content.ts` | Shared images, cards and serializable PageData |
| `src/app.css` | Small demo-specific additions for masthead, footer and example labels |

Lucide icons come from `@lucide/svelte`, declared only by the demo. At XS-L the Settings gear opens the resource/theme controls; XL and above show these as external satellites. The logo and focus-only skip link belong to the navigation header.

The shared layout derives active menu items from SvelteKit's `$app/state`. SvelteKit retains the layout across client-side route changes, so its local theme state survives navigation and browser history. A full reload starts in Light mode; there is no persistent account or browser-storage preference. Theme buttons are disabled until hydration, while the resource links remain usable without JavaScript.

ContentPage supplies titles, breadcrumbs on subpages and generated section navigation. The backgrounds page uses the library's own Section and SectionSurfaceGroup; it does not recreate background or corner logic in demo CSS.

## SSR and static output

`src/app.html` is SvelteKit's HTML template. `svelte.config.js` selects adapter-static; `+layout.ts` sets `prerender = true`. SvelteKit renders each route at build time and writes deployable HTML/assets to `apps/demo/build`. There is no SPA fallback or custom HTML injection script. SSR stays enabled, and SvelteKit hydrates the existing HTML in the browser.

The static output includes `index.html`, `components/index.html` and `backgrounds/index.html`. A static host must serve directory indexes. Native links, breadcrumbs, section anchors and carousel keyboard scrolling work without JavaScript. Theme switching and carousel buttons enhance the page after hydration.

The two local SVG illustrations live in `static/`. The silent video clip is hosted by MDN and requires network access for playback; the poster and surrounding content remain local.

## Verification

```bash
npm run check
npm test
npm run verify
npm run test:e2e
```

`npm run verify` includes the static demo build and independent packed-package consumers. The plain Svelte consumer fixture lives in `tests/fixtures/plain-svelte`; it deliberately has no SvelteKit dependency. Browser tests visit all three routes without JavaScript at 375, 840 and 1600px, and check routing, breadcrumbs, themes, responsive columns, carousel scrolling, keyboard navigation, hydration and surface corners. See [testing](testing.md).
