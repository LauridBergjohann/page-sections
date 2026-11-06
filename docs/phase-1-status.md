# Phase 1 status — 2026-11-06

**Implemented locally; npm publication blocked. Phase 1 is not yet complete under the acceptance criteria. Phase 2 has not started.**

## Implemented

- npm workspace monorepo with `@page-sections/core` and `@page-sections/svelte`, version 0.1.0.
- Beta.8 content-grid tokens and calculations, section backgrounds and surface grouping, registry lifecycle, ContentPage, Section, ContentGrid and ContentBlock.
- Hero, Markdown/text, image, video, card-grid and native scroll-snap carousel sections sharing serializable content models.
- Standalone main navigation, optional satellites, ButtonGroup, breadcrumbs, generated section navigation, CSS themes and extension renderers.
- Plain Svelte 5/Vite demo with prerendered HTML and hydration, no required SvelteKit runtime.
- CI, Changesets version PR workflow, OIDC publication workflow, packed/published consumer verification scripts.
- Extraction provenance/license attribution, general component documentation and a source-based bergjohann.com migration assessment.

## Decisions and reuse

The supplied Spatial Elements checkout predates Beta.8. Its working tree was left unchanged; extraction used upstream reference commit `c20fcd9a82daa8cce7a87de4cd0815f5a9985233` in an ignored local reference directory. See [the extraction map](architecture.md) for retained and excluded code.

Core contains data and pure layout/registry logic. Svelte owns DOM, snippets, native input and rendering. Every Section measures its own unpadded container, keeping narrow and embedded content grids correct. Surface scopes isolate nested groups. No 3D/GPU/SvelteKit runtime dependency was introduced. The new cards are the shared 2D foundation intended for Phase 2; no existing Spatial fallback was removed yet.

## Verification

Final local results:

| Check | Result |
| --- | --- |
| Generated layout CSS parity | Passed |
| TypeScript builds and Svelte diagnostics | Passed; 0 errors, 0 warnings |
| Core and SSR regression tests | 19 passed |
| Chromium browser tests | 4 passed, including no-JavaScript at 375/840/1600px, embedded container grids and unavailable WebGPU |
| Packed plain-Svelte consumer | Installed, type-checked, client-built, SSR-built and prerendered successfully |
| Packed SvelteKit consumer | Production build and prerender passed |
| Lockfile / npm ci dry run | Passed |
| Whitespace diff check | Passed |

The aggregate verification initially exposed a lazy-SSR assertion issue and a missing route in the new SvelteKit test fixture. Both fixtures were corrected; the affected tests and complete packed-consumer verifier were rerun successfully. The browser screenshots were visually reviewed after the final layout fixes.

Reproduce with:

```sh
npm run verify
npm run test:e2e
```

Consumer verification creates actual npm tarballs and installs them outside all workspaces. It checks a plain Svelte/Vite application and a separate SvelteKit production/prerender build. `.artifacts/packed-consumer.json` records the executed steps and temporary consumer path. Browser screenshots are `.artifacts/demo-no-js-{375,840,1600}.png`.

## Publication blocker and next step

The npm identity check returned **401 Unauthorized**; public queries for both package names returned **404**. Neither package is verified as published. No registry consumer success is claimed, and no change was pushed or published from this session.

Complete the account and trusted-publisher setup in [releasing.md](releasing.md), publish both packages, and run `npm run verify:published`. Only a successful installation/build/SSR check using the actual registry versions permits Phase 2.

The supplied Spatial Elements and bergjohann.com repositories remain unchanged. The website's content/layout needs are representable; its domain content, locale/routing, search and branded header behavior need the documented application adapters. This assessment does not claim an executed website migration.
