# Footer, layout and documentation follow-up

## Branches and sequence

1. `page-sections`: `feat/footer-layout-docs` (from main at 0.4.1; local 0.5.0 release files prepared).
   - Implement Footer as a site-level sibling of Header and ContentPage; integrate it into the website.
   - Header owns the header landmark; menus alone use nav. Navigation remains a deprecated export.
     ContentPage.pageEnd replaces the ambiguously named footer snippet, retained as a fallback.
   - Document and verify the component, responsive layouts, optional regions, SSR and theme contract.
   - Animate desktop/mobile menu blur; align sidebar child labels with smaller text; use 12px breadcrumbs on XS–M.
   - Keep footer outer gutters at a minimum of 8px at every layout size and start L social links at the top right.
   - Promote Sections to the second main-menu entry, with a nine-card overview, real examples,
     dedicated sidebar, Lucide icons and interactive demos on every detail page.
   - Move section references from `/docs/sections/` to `/sections/`; keep SvelteKit redirects
     and matching permanent Vercel redirects, including the old plural images/panels routes.
   - Add the saved Svelte Playground link and four illustrated next-step cards to Getting Started.
   - The Footer changeset is consumed into 0.5.0 versions/changelogs/lockfile, as required by CI.
     Extend the release notes as the remaining work lands, then verify and publish after review.
2. `spatial-elements`: `feat/footer-layout-docs-adoption` (from main).
   - After the Page Sections API/layout changes settle, review the existing adoption contract in
     `spatial-elements-adoption.md` and port only the relevant host integration and documentation changes.
   - Consume the shared Header/Footer and theme tokens where appropriate; avoid copying their implementations.
     Remove external header wrappers and migrate content-end snippets to pageEnd.
   - Verify spatial page layouts, navigation and light/dark appearances against the new release.
3. `bergjohann-com`: `chore/update-page-sections` (from main; currently uses 0.3.0).
   - After the resulting Page Sections release is available, update both package versions together
     and regenerate the lockfile. Review all changes since 0.3.0, not just the footer.
   - Review the existing custom footer and migrate its content if desired; retain legal links.
   - Run content checks, Svelte checks and production build, then verify responsive navigation,
     footer and dark mode before deployment.

The Footer and semantic site-frame implementation are in scope now. The other two branches are prepared without
dependency changes; no package release or deployment is part of this step.

## Footer decisions

- Required `footnote` (text or snippet) and `links`; optional `brand` snippet, `social` and `menu`.
- Social entries require a label, href and icon snippet; the library adds no icon dependency.
- More than four menu groups are rejected. Group headings can optionally link to a page.
- Shared content width and container-grid tokens align the main box and bottom bar.
- Menu visibility follows viewport XL (1600px), independently of container width.
- A menu-only footer has no empty main box below XL. The bottom bar is at least 40px high.
- Typed PageTheme settings map to six dedicated CSS variables; separators use bottom-bar ink at 30% opacity.
- Footer grid padding is 24px vertically; footnote and important links have an 8px outer inset at all widths.
- Website light/dark colors live in app.css; browser tests resolve those tokens rather than duplicating palette values.
- Social items retain grid positions in a zero-column-gap grid; each cell includes the following gutter so labels remain on one line.
- Website social order: GitHub, NPM, Vercel, Bergjohann, LinkedIn, Svelte.

## Website assets and examples

- Twenty-two original SVG illustrations live in `apps/website/static/illustrations/` and are generated
  by `scripts/generate-website-illustrations.mjs`.
- The thirteen homepage and Getting Started illustrations have transparent outer backgrounds, outlined browser frames with soft drop shadows, brand-green accents and restrained companion colors. Catalog illustrations retain their existing treatment.
- The Video demo uses a four-second silent local WebM plus English descriptions. Regenerate with
  `node scripts/generate-demo-video.mjs` (local Chrome required).
- Hero, Image, Panel, RichText and Video share a live playground with reset and generated Svelte source.
  Heading also provides source and all six semantic levels. Existing collection/code playgrounds remain.
- Showcase pages remain reachable by their original URLs and search, but are no longer in the main menu.
- The homepage uses transparent light/dark WebP hero artwork, an image-and-text introduction, illustrated feature and next-step cards, and local technology icons (sources in `static/technology/NOTICE.txt`).
- Nested sections have independent surface groups. The section overview alternates muted/standard examples and highlights its code during SSR; every detail page starts with a short introduction.
- Package adoption in spatial-elements and bergjohann-com still follows the release step above.
