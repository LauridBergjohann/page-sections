<img src="assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# Page Sections

Composable pages, responsive layouts and reusable content sections for Svelte 5 and SvelteKit. Build a portfolio, publication or product website using ordinary HTML or serializable content models.

## Documentation and examples

The [Page Sections website](apps/website) is the source of public documentation: getting started, interactive guides, API references and a showcase. Its pages live in this repository and are maintained together with the library. The former GitHub Wiki has been migrated; no separate checkout is required.

Run the website locally:

```sh
npm ci
npm run dev:website
```

Open http://127.0.0.1:5174. Try card sizes and tones, media ratios, responsive grids, surfaces, code presentation and the sidebar frame on `/docs/page-shell/`. Preview and source stay together.

## Installation

In a Svelte 5 application:

```sh
npm install @page-sections/svelte
```

Start with the [minimal application](apps/demo/src/routes/+page.svelte), or the website's [installation page](apps/website/src/routes/getting-started/installation/+page.svelte). Components work in plain Svelte as well as SvelteKit; no Tailwind, router or rendering engine is required.

| Package | Responsibility |
| --- | --- |
| [@page-sections/core](packages/core) | Framework-independent models, layout calculations, tokens and registries |
| [@page-sections/svelte](packages/svelte) | Pages, sections, grids, cards, code presentation and navigation |

Code highlighting is optional: install Shiki and use the separate `@page-sections/svelte/highlight` entry at build/server time. Ordinary pages and plain CodeBlock do not load the engine.

## Development

Use Node 24 and npm 11. [Application commands](apps/README.md) cover the public website, minimal demo and test application. Contributor instructions live in [docs/development](docs/development/README.md).

```sh
npm run verify
npm run test:e2e
npm run test:website
```

## License

[Mozilla Public License 2.0](LICENSE). Attribution is retained in [NOTICE](NOTICE).
