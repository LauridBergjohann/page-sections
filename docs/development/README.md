<img src="../../assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# Development guide

This area is for contributors and maintainers. User guides and API references live in the [GitHub Wiki](https://github.com/LauridBergjohann/page-sections/wiki).

## Local environment

Use Node 24 and npm 11, matching CI. The root package declares Node >=22.12.0; the CI baseline also satisfies the publishing toolchain.

```bash
npm ci
npm run check
npm test
```

On Windows with PowerShell script restrictions, use `npm.cmd` instead of `npm`; no execution-policy change is necessary.

## Repository map

| Path | Responsibility |
| --- | --- |
| packages/core | Framework-independent models, numeric layouts, registries and utilities |
| packages/svelte | Svelte components and CSS |
| apps/demo | SvelteKit 2 reference application with three statically prerendered routes |
| scripts | Layout generation and artifact/release verification |
| tests | Core, SSR and browser regressions |
| .changeset | Versioning configuration and pending change notes |
| .github/workflows | CI and release jobs |
| docs/development | Contributor and maintainer documentation |

The Wiki is a separate repository, normally checked out as sibling `page-sections.wiki`. Do not maintain a second user-reference copy under docs. See [wiki editing and publication](wiki.md).

## Workflows

- [Architecture and package boundaries](architecture.md)
- [Tests and documentation checks](testing.md)
- [Running and developing the demo](demo.md)
- [Versioning and releases](releasing.md)
- [Editing and publishing the Wiki](wiki.md)
- [API observations](api-notes.md)

`npm run build` builds core before Svelte. `npm run check` rebuilds and checks Svelte/TypeScript. Package dist outputs are ignored; commit source, layout.generated.css and the lockfile when they change. Follow the existing package boundaries and preserve LICENSE/NOTICE attribution.
