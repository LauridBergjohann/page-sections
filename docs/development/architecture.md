# Architecture and package boundaries

Core owns serializable content types, pure numeric layout calculations, background normalization, registry lifecycles and theme/URL helpers. Its TypeScript build excludes DOM libraries and it has no runtime dependencies.

Svelte owns DOM rendering, context, snippets, CSS, hydration-time observation and input behavior. It depends on core and markdown-it, with Svelte as a peer. SvelteKit is tested as a consumer but is not a runtime dependency. Do not introduce router or application-content concerns into core.

## Composition and state

ContentPage establishes a request-local SectionRegistry. Section registers semantic id/title metadata during initialization, updates it reactively and unregisters on destruction. SectionSurfaceGroup maintains a separate presentation registry and scope so nested surface groups cannot override each other's corner rules. Server rules are emitted after children register.

Generated section navigation also renders after registrations, then CSS places it above/beside the content. DOM reading order remains after the sections. Preserve this behavior in documentation unless a separately tested implementation change replaces it.

Specialized content sections delegate ordinary section metadata to Section. CardGridSection and CarouselSection share CardItem and Card. Catalog geometry matches core media-plus-text calculations; editorial cards intentionally grow with copy. Data-driven Sections dispatches the discriminated models and accepts a renderer map; it does not fetch or validate content.

## Layout source of truth

`packages/core/src/layoutTokens.json` feeds pure calculations and `scripts/generate-layout-css.mjs`. The generated CSS implements shared container-grid rules and page width defaults. Geometry is canonical; theme overrides apply to palette, typography family, radius and reading width.

For token changes:

```bash
npm run layout:generate
npm run check:layout
npm run check
npm test
npm run test:e2e
```

Update the website's token tables and breakpoint explanations in the same review. Catalog cards, Navigation and Breadcrumbs consume generated token metrics. Do not promise runtime breakpoint configuration through CSS.

## Package output

Core uses tsc to emit JavaScript/declarations. Svelte uses svelte-package to preserve Svelte components and emit package declarations. Both export through dist and include LICENSE/NOTICE. Consumer verification packs real artifacts and installs them outside the workspaces; source aliases are not a substitute.

Some foundational layout code carries upstream attribution. The legal and provenance record remains in [NOTICE](../../NOTICE) and [LICENSE](../../LICENSE); user documentation does not require that history to explain the product.

Structured blocks and panels share RichTextContent/InlineText/Actions. A private section context carries heading level, nesting and page kind; it is request-local and not a public deep import. CardElements callbacks provide external attachment boundaries without a GPU or application dependency.

The optional @page-sections/svelte/highlight entry uses the Shiki peer. It is not imported by the main component entry. CodeBlock accepts derived tokens and always renders source as escaped text; CodeSection and JSON code records use the same implementation.
