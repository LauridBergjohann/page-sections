# Documentation authoring and hosting

Public explanations live directly in Svelte/HTML under apps/website/src/routes. They use Page Sections, with interactive Svelte examples where useful. Do not add a parallel Markdown or JSON content copy. Markdown here is only for contributor workflows and internal contracts.

## Add or change a page

1. Edit its +page.svelte and add its route/title/description to src/lib/catalog.ts. Keep the reading order from basics through sections and building blocks to advanced topics and references. src/lib/navigation.ts derives the site tree and reading order from those chapters. Every entry owns a real route; group pages link to their children. The same catalog powers the header's local topic search; showcase search entries live in SiteSearch.svelte. Search terms stay in browser memory. Getting Started uses a short learning path instead of the documentation sidebar.
2. Compose website pages with WebsitePage and Section. WebsitePage supplies ContentPage with the shared sidebar, breadcrumbs, child-page links and reading-order footer. Keep paragraphs near 68 characters per line visually; wrap wide reference tables in a keyboard-scrollable region.
3. Own static code snippets in that page's exported literal examples array. Use language, code and optional filename/group fields. The companion +page.server.ts highlights them during prerendering; CodeBlock displays the same source. These snippets are checked by npm run check:docs.
4. Interactive examples use one reactive configuration for both preview and source output. The client highlighter loads lazily and includes only the five languages used by playgrounds. Static references use the optional server highlighting entry, whose engine is not shipped to browsers.
5. Use base-aware application links and asset URLs. Run check:docs, check and relevant browser checks. Prettier formats source through npm run format:apps.

The footer imports the package version. Production documentation must be built from the release commit, not an unrelated development branch. Preview deployments can demonstrate unreleased changes.

## Hosting

The site prerenders all routes with directory indexes. It has no server, account or database requirement. The repository's [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json) builds only the website and deploys apps/website/build; use the repository root as the project root and Node 24. Git integration supplies preview deployments. Set the production branch to main. Once the actual production URL is assigned, add it to the root and package READMEs and the legacy Wiki's Home page. Do not advertise an unverified domain.

For another static host, deploy the same build directory. A GitHub Pages project site needs BASE_PATH=/page-sections during the build and a .nojekyll file in the published directory. The source uses base-aware links; check the nested-path build before switching hosts.
