# Preparing 0.2.0

This release covers the shared layout and website-content work before upgrading bergjohann-com. Spatial Elements integration follows that website migration.

## Changes to review

- Canonical 1536px wide navigation at 2XL, generated header/satellite/breadcrumb metrics, responsive item menus, delayed/fixed navigation and detail-context surfaces.
- Equal-height catalog cards with independent media/text areas, selectable 3:2, 4:3 or 1:1 media frames, contain/cover fitting and separately reserved title/eyebrow lines. S uses wider slots and 12px titles. Editorial cards retain full copy/footer/actions; adapters have stable attachment/cleanup boundaries.
- Data-only artwork heroes, narrow documents, address/link/list blocks, panels and nested grids with inherited headings.
- Demo examples at `/examples/`, `/examples/legal/`, `/examples/cards/` and `/examples/integration/`.

The minor changeset advances both public packages from 0.1.1 to 0.2.0. Package versions and the lockfile deliberately stay at 0.1.1 on this feature branch: the existing Changesets workflow creates the reviewed version PR after merge. No release or registry publication is performed by this preparation.

## Migration contract

Use editorial cards for descriptions, itemContent, footers and independent actions. The default catalog is a native link with a 3:2 media frame plus independent text space. Set mediaAspect and mediaFit on the collection; these take precedence over per-image aspect/fit inside a card. Replace per-item size with collection cardSize; editorial columns use itemSpan. Remove PageTheme.contentMax and old per-size grid/card-width overrides. Use narrowMax and bodyLayout for reading widths. Review inherited heading levels and spacing/corners at each breakpoint.

For later Spatial Elements adoption, start with square media (1/1) and contain fitting, while keeping the complete card's height free of a fixed ratio. The [adoption contract](spatial-elements-adoption.md) records the required virtual-row, camera-fit and transition changes. This deliberately supersedes the Beta.8 square-card specification.

Detailed API and migration documentation is prepared in the sibling Wiki checkout, on `docs/layout-and-content-0.2`. Its internal links remain relative. Publish that documentation with the release; the normal repository PR does not publish the separate Wiki.

## Validation and publication

Run `npm run verify`, `npm run check:docs` (requires the sibling Wiki), and `npm run test:e2e`. Browser checks compare DOM card rectangles against core calculations, exercise compact/wide navigation, no-JavaScript content, themes, adapters and nested surfaces. Packed artifacts are installed in independent plain Svelte and SvelteKit consumers; reports and screenshots are under `.artifacts/`.

After reviewing and merging the feature PR, review the generated release PR, then let the existing release workflow publish and run `verify:published`. See [releasing](releasing.md). Only after publication should bergjohann-com upgrade to the exact new versions and replace its remaining content adapters. Spatial Elements' virtual scrolling, GPU surfaces and camera interactions remain application-owned in the later migration.

Validated locally on 2026-11-06 after the final card revision:

- `npm run verify`: passed; 48 core/SSR tests, clean type checks, static demo build and independent packed Svelte/SvelteKit consumers.
- `npm run check:docs`: passed; 40 documents, 25 Wiki pages, 220 links and 47 executable examples.
- `PAGE_SECTIONS_TEST_PORT=4188 npm run test:e2e -- --workers=1`: 34 Chromium tests passed against a fresh build, including all media formats, equal heights, missing labels, no-JavaScript rendering and enlarged typography.
- Desktop/mobile format comparisons and the enlarged-type screenshot were visually inspected. Screenshots are in `.artifacts/`.
- Changesets status confirms 0.2.0 for both public packages. Package manifests remain at 0.1.1 until the generated version PR, as described above.
