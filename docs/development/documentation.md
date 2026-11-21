# Documentation authoring and hosting

Public explanations live directly in Svelte/HTML under apps/website/src/routes. They use Page Sections, with interactive Svelte examples where useful. Do not add a parallel Markdown or JSON content copy. Markdown here is only for contributor workflows and internal contracts.

## Add or change a page

1. Edit its +page.svelte and add its route/title/description to src/lib/catalog.ts. Keep the learning path in this order: Foundations, Page layout, Components, Design system, Advanced, Reference. Introduce concepts before using them in examples. src/lib/navigation.ts derives the site tree and reading order from those chapters; the section gallery follows the documentation in the reading path. Every entry owns a real route; group pages explain their scope and link to their children. The same catalog powers the header's local topic search; showcase search entries live in SiteSearch.svelte. Search terms stay in browser memory. Getting Started uses a short learning path instead of the documentation sidebar.
2. Compose website pages with WebsitePage and Section. WebsitePage supplies ContentPage with the shared sidebar, breadcrumbs, child-page links and reading-order footer. Keep paragraphs near 68 characters per line visually; wrap wide reference tables in a keyboard-scrollable region.
3. Own static code snippets in that page's exported literal examples array. Use language, code and optional filename/group fields. The companion +page.server.ts highlights them during prerendering; CodeBlock displays the same source. These snippets are checked by npm run check:docs.
4. Interactive examples use one reactive configuration for both preview and source output. The client highlighter loads lazily and includes only the five languages used by playgrounds. Static references use the optional server highlighting entry, whose engine is not shipped to browsers.
5. Use base-aware application links and asset URLs. Run check:docs, check and relevant browser checks. Prettier formats source through npm run format:apps.

The footer imports the package version. Production documentation must be built from the release commit, not an unrelated development branch. Preview deployments can demonstrate unreleased changes.

## Property types and moved pages

Link named property types in both `/docs/` and `/sections/` to `/docs/reference/types/#type-name`, including types inside arrays, generics and nested objects. Readers must be able to inspect required fields and follow nested types without reading package source. Keep these links inside the inline `code` element; code examples themselves remain copyable source.

Run `npm run docs:types` after changing public type declarations. `scripts/generate-type-reference.mjs` reads the Core exports and the Svelte-only `FooterSocialLink` and `CardElements` interfaces. It generates the reference page and type search catalog; edit its explanations or the package declarations, not the generated output. `npm run check:docs` checks freshness, unlinked named types in property signatures, route/fragment links, executable examples and API/token coverage.

When relocating a guide, retain its previous route with a base-aware 308 redirect and add the equivalent permanent redirect to `vercel.json`. Static builds emit a meta refresh for other hosts. Update internal links, catalog entries and browser tests to the canonical URL. Preserve existing fragment IDs where their content moves with the guide.

## Hosting

The site prerenders all routes with directory indexes. It has no server, account or database requirement. The repository's [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json) builds only the website and deploys apps/website/build; use the repository root as the project root and Node 24. Git integration supplies preview deployments. Set the production branch to main. Once the actual production URL is assigned, add it to the root and package READMEs and the legacy Wiki's Home page. Do not advertise an unverified domain.

The website's adapter explicitly writes pages and assets to build, matching the repository-root outputDirectory. Keep these settings aligned: without explicit adapter options, Vercel detection changes the output to .vercel/output/static. Validate hosting changes with VERCEL=1 when running npm run build:website, then check apps/website/build for the generated pages and assets. The adapter's notice about disabling Vercel zero-config mode is expected with this repository-root static deployment.

For another static host, deploy the same build directory. A GitHub Pages project site needs BASE_PATH=/page-sections during the build and a .nojekyll file in the published directory. The source uses base-aware links; check the nested-path build before switching hosts.
