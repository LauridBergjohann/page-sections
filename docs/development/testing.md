# Tests and verification

Run the checks appropriate to the change. Keep examples executable and avoid claims based only on source inspection when runtime behavior matters.

| Command | Scope |
| --- | --- |
| `npm run build` | Core and Svelte package builds |
| `npm run check` | Builds plus Svelte/TypeScript diagnostics |
| `npm run check:layout` | Generated CSS matches layoutTokens.json |
| `npm test` | Vitest core and SSR regressions |
| `npm run test:e2e` | Playwright Chromium tests; configured server runs npm run demo |
| `npm run verify:packages` | Fresh build, tarballs, independent Svelte and SvelteKit consumers |
| `npm run verify` | Layout parity, check, tests, static demo build and packed-consumer verification |
| `npm run verify:published` | Exact registry versions installed and built in independent consumers |
| `npm run check:docs` | README/Wiki links, export coverage, CSS variables, token tables and extracted examples |

Set `PAGE_SECTIONS_TEST_PORT` to run browser tests on a dedicated port with a fresh build when another preview is already running. Without this override, local tests may reuse port 4173; CI always starts its own server.

Install the browser before running browser tests:

```bash
npx playwright install chromium
npm run test:e2e
```

Core/SSR tests cover grid thresholds, span inheritance, registry lifecycle, background grouping, initial HTML, custom renderers and unsafe text/links. Browser tests cover the original three SvelteKit routes without JavaScript at 375/840/1600px, native carousel scrolling, responsive and narrow grids, client routing and history, breadcrumbs, persistent layout themes, surface corners/gradients, keyboard access and unavailable WebGPU.

## Documentation examples

Check out the Wiki beside the main repository, then run:

```bash
npm run check:docs
```

For another location:

```bash
npm run check:docs -- --wiki /path/to/page-sections.wiki
```

The checker reads the actual Markdown fences from the three READMEs, developer guides and Wiki. It writes temporary examples under `.artifacts/docs-examples`, builds package declarations, and runs the existing svelte-check tool against those examples. `ts`, `typescript` and `svelte` fences are checked. CSS fences are syntax-checked through Svelte's compiler. Shell commands and prose are reviewed separately.

Each ordinary fence is isolated. Multi-file examples use fence metadata such as `file=Quote.svelte group=custom`; files in the same document/group compile together. Use complete imports and data rather than undeclared placeholders. A small ambient declaration permits CSS imports.

The checker validates relative links and GitHub links to known local repository/Wiki targets, sidebar coverage, and the public export indexes. It also checks CSS variable coverage and compares grid, card, breadcrumb and viewport token tables with layoutTokens.json. It does not claim that unpublished Wiki pages already exist remotely, or validate example image files and application routes. It does not execute arbitrary code from documentation. Review media/route conventions and SSR behavior separately.

## Artifacts and CI

The two consumer scripts report to `.artifacts/packed-consumer.json` or `.artifacts/published-consumer.json`. Browser screenshots live in `.artifacts/`; failed test output goes to test-results. The CI workflow runs verify and browser tests; it does not automatically clone or synchronize the independent Wiki. Documentation checking is an explicit review step when both checkouts are available.

The website examples also run with and without JavaScript at 320/840/1920px. Catalog tests compare DOM rectangles with core calculations from 320 to 1920px, including nested containers, all three media ratios and contain/cover fitting. They check equal heights across rows, aligned titles with missing eyebrows, separate title/label budgets, larger typography before hydration and format changes without adapter reattachment. Integration tests also cover occurrence cleanup, carousel selection, detail surfaces, compact dismissal and desktop submenus. Run build-producing commands sequentially: svelte-package replaces dist while building.
