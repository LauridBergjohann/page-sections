<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="48" height="48" />

# @page-sections/core

Framework-independent content models, responsive layout calculations, tokens, section registries and theme/URL helpers. No runtime dependencies or DOM requirement.

```sh
npm install @page-sections/core
```

The [documentation website source and local preview instructions](https://github.com/LauridBergjohann/page-sections/tree/main/apps/website) contain the full core API, token reference and serializable data models. For rendering in Svelte, use [@page-sections/svelte](https://www.npmjs.com/package/@page-sections/svelte), which installs core and re-exports its types.

`resolveNavigation` derives active menu entries, the sidebar branch and breadcrumbs from one site tree. `resolveContentPageLayout` calculates the sidebar frame independently of the main menu; `resolveActiveContentSection` shares reading-position logic across renderers.

CodeData and CodeSectionData store plain source plus presentation options. HighlightedCode and CodeToken describe optional derived syntax output; no highlighting engine is part of core.

Requires Node `>=22.12.0`. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
