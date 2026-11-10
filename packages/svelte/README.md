<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="48" height="48" />

# @page-sections/svelte

SSR-first Svelte 5 components for pages, responsive grids, sections and navigation. Works with plain Svelte and SvelteKit.

```sh
npm install @page-sections/svelte
```

Import components from `@page-sections/svelte`. PageShell, ContentPage, Navigation, Section and CodeBlock load shared CSS. For standalone primitives, import `@page-sections/svelte/styles.css` once. Core types are re-exported; runtime core helpers are imported from `@page-sections/core`.

The [documentation website source and local preview instructions](https://github.com/LauridBergjohann/page-sections/tree/main/apps/website) include installation, interactive examples and full API references. See the [minimal application](https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo) for a copyable starting point.

## Code presentation

CodeBlock presents escaped source with optional filename, line numbers, line markers, wrapping and copy feedback. CodeSection adds section metadata; Sections also renders JSON records with `type: 'code'`.

Syntax highlighting is optional. Install `shiki` and call `highlightCode` from `@page-sections/svelte/highlight`, preferably in server/build code. Pass its result as `highlighted`; data-driven Sections accepts `codeHighlights` keyed by section ID. This entry is separate so the engine is not imported by ordinary components. Plain source needs no Shiki dependency.

Requires Svelte `^5.56.4` and Node `>=22.12.0`. No SvelteKit, icon library or rendering engine is installed as a runtime dependency. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
