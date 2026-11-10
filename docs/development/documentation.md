# Documentation authoring and hosting

Public explanations live directly in Svelte/HTML under apps/website/src/routes. They use Page Sections, with interactive Svelte examples where useful. Do not add a parallel Markdown or JSON content copy. Markdown here is only for contributor workflows and internal contracts.

## Add or change a page

1. Edit its +page.svelte and add its route/title/description to src/lib/catalog.ts.
2. Compose content with ContentPage and Section. Keep paragraphs near 68 characters per line visually; wrap wide reference tables in a keyboard-scrollable region.
3. Own static code snippets in that page's exported literal examples array. Use language, code and optional filename/group fields. The companion +page.server.ts highlights them during prerendering; CodeBlock displays the same source. These snippets are checked by npm run check:docs.
4. Interactive examples use one reactive configuration for both preview and source output. The client highlighter loads lazily and includes only the five languages used by playgrounds. Static references use the optional server highlighting entry, whose engine is not shipped to browsers.
5. Use base-aware application links and asset URLs. Run check:docs, check and relevant browser checks. Prettier formats source through npm run format:apps.

The footer imports the package version. Production documentation must be built from the release commit, not an unrelated development branch. Preview deployments can demonstrate unreleased changes.

## Hosting

The site prerenders all routes with directory indexes. It has no server, account or database requirement. The repository's [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json) builds only the website and deploys apps/website/build; use the repository root as the project root and Node 24. Git integration supplies preview deployments. Set the production branch to main. Once the actual production URL is assigned, add it to the root and package READMEs and the legacy Wiki's Home page. Do not advertise an unverified domain.

For another static host, deploy the same build directory. A GitHub Pages project site needs BASE_PATH=/page-sections during the build and a .nojekyll file in the published directory. The source uses base-aware links; check the nested-path build before switching hosts.

## Migration record

All 25 user chapters were imported from sibling page-sections.wiki at commit 85427f8447f5136a13966fef22d7bd121aec020b. Its existing local commit was preserved; no Wiki branch was rewritten or pushed. The old sidebar/footer became website navigation and footer. The existing logo asset was already identical in purpose and remains in the main repository. No Wiki synchronization step remains in builds or CI.

| Former Wiki chapter | Owning website page |
| --- | --- |
| Home | [/docs/](../../apps/website/src/routes/docs/+page.svelte) |
| Installation | [/getting-started/installation/](../../apps/website/src/routes/getting-started/installation/+page.svelte) |
| Quick-Start | [/getting-started/first-page/](../../apps/website/src/routes/getting-started/first-page/+page.svelte) |
| Pages-and-Sections | [/getting-started/pages-and-sections/](../../apps/website/src/routes/getting-started/pages-and-sections/+page.svelte) |
| ContentPage-and-PageShell | [/docs/page-shell/](../../apps/website/src/routes/docs/page-shell/+page.svelte) |
| Section-and-ContentGrid | [/docs/content-grid/](../../apps/website/src/routes/docs/content-grid/+page.svelte) |
| Responsive-Layout-and-Breakpoints | [/docs/responsive-layout/](../../apps/website/src/routes/docs/responsive-layout/+page.svelte) |
| Section-Backgrounds-and-Surface-Groups | [/docs/backgrounds/](../../apps/website/src/routes/docs/backgrounds/+page.svelte) |
| HeroSection | [/docs/hero/](../../apps/website/src/routes/docs/hero/+page.svelte) |
| RichTextSection | [/docs/rich-text/](../../apps/website/src/routes/docs/rich-text/+page.svelte) |
| PanelSection | [/docs/panels/](../../apps/website/src/routes/docs/panels/+page.svelte) |
| ImageSection | [/docs/images/](../../apps/website/src/routes/docs/images/+page.svelte) |
| VideoSection | [/docs/video/](../../apps/website/src/routes/docs/video/+page.svelte) |
| CardGridSection | [/docs/card-grid/](../../apps/website/src/routes/docs/card-grid/+page.svelte) |
| CarouselSection | [/docs/carousel/](../../apps/website/src/routes/docs/carousel/+page.svelte) |
| Card-and-Image | [/docs/card-and-image/](../../apps/website/src/routes/docs/card-and-image/+page.svelte) |
| Navigation-and-Satellites | [/docs/navigation/](../../apps/website/src/routes/docs/navigation/+page.svelte) |
| Breadcrumbs-and-Section-Navigation | [/docs/breadcrumbs/](../../apps/website/src/routes/docs/breadcrumbs/+page.svelte) |
| Themes-and-Styling | [/docs/themes/](../../apps/website/src/routes/docs/themes/+page.svelte) |
| Data-Models-and-Custom-Sections | [/docs/data-and-custom-sections/](../../apps/website/src/routes/docs/data-and-custom-sections/+page.svelte) |
| SSR-and-Progressive-Enhancement | [/docs/ssr/](../../apps/website/src/routes/docs/ssr/+page.svelte) |
| CSS-Variables-and-Layout-Tokens | [/docs/tokens/](../../apps/website/src/routes/docs/tokens/+page.svelte) |
| Svelte-API | [/docs/svelte-api/](../../apps/website/src/routes/docs/svelte-api/+page.svelte) |
| Core-API | [/docs/core-api/](../../apps/website/src/routes/docs/core-api/+page.svelte) |
| Migrating-to-0.2 | [/docs/migration/](../../apps/website/src/routes/docs/migration/+page.svelte) |

New code documentation lives at /docs/code/. The README and package READMEs now provide short entry points rather than duplicate API manuals. Completed 0.2/0.3 release handoffs and the already-applied bergjohann patch were removed from docs. Architecture, release mechanics, current API caveats and the Spatial Elements integration contract remain maintainer documentation.

After the website is publicly reachable, replace the legacy Wiki Home with a move notice and stop editing its chapters. Keep historical Wiki pages as an archive until existing inbound links have an adequate migration notice. There is no automatic redirect control for the old GitHub Wiki pages from this repository.
