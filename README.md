<img src="assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# Page Sections

Page Sections is a component library for content-driven websites built with Svelte 5 and SvelteKit. This repository contains the framework-independent core, Svelte components, documentation website and example applications.

- **One layout system:** pages, sections, grids and cards share responsive sizing, spacing and content widths.
- **Composable content:** combine heroes, text, panels, images, video, card grids, carousels and code examples.
- **Your content source:** write Svelte and HTML directly, or render serializable models from JSON or your own CMS.
- **Connected navigation:** build menus, sidebars and breadcrumbs from one page tree, with an automatic page contents menu.
- **Your visual identity:** adapt light and dark themes, surfaces and shared CSS variables without requiring a CSS framework.
- **HTML first:** SSR and prerendering deliver readable content and links before client-side interactions load.

**[Visit the Page Sections website — documentation, interactive examples and showcase](https://page-sections.bergjohann.com/)**

## Installation

In a Svelte 5 application:

```sh
npm install @page-sections/svelte
```

Follow [Getting started](https://page-sections.bergjohann.com/getting-started/) to build your first page. Components work in plain Svelte as well as SvelteKit; no Tailwind, router or rendering engine is required.

| Package | Responsibility |
| --- | --- |
| [@page-sections/core](packages/core) | Framework-independent models, layout calculations, tokens and registries |
| [@page-sections/svelte](packages/svelte) | Pages, sections, grids, cards, code presentation and navigation |

Code highlighting is optional: install Shiki and use the separate `@page-sections/svelte/highlight` entry at build/server time. Ordinary pages and plain CodeBlock do not load the engine.

## Documentation and examples

The [documentation](https://page-sections.bergjohann.com/docs/) covers page composition, responsive layouts, navigation, themes and the full API. Interactive examples let you change options and see the result alongside the source. Explore the [showcase](https://page-sections.bergjohann.com/showcase/) for complete examples.

For a small starting point, see the [minimal application](apps/demo/src/routes/+page.svelte). The [documentation website source](apps/website) lives alongside the packages and uses Page Sections itself.

## Development

Use Node 24 and npm 11. [Application commands](apps/README.md) cover the public website, minimal demo and test application. Contributor instructions live in [docs/development](docs/development/README.md).

Run the documentation website locally:

```sh
npm ci
npm run dev:website
```

Open http://127.0.0.1:5174. To validate changes:

```sh
npm run verify
npm run test:e2e
npm run test:website
```

## License

[Mozilla Public License 2.0](LICENSE). Attribution is retained in [NOTICE](NOTICE).
