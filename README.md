# Page Sections

SSR-first Svelte 5 pages, responsive content grids, sections and standalone navigation. Extracted from the general layout system of Spatial Elements Beta.8. No Three.js, WebGPU, Tailwind or SvelteKit runtime dependency.

**Release status:** implementation and local verification are tracked in [Phase 1 status](docs/phase-1-status.md). A package tarball is not proof of an npm publication. Phase 2 remains gated on verified registry installation.

```sh
npm install @page-sections/svelte svelte
```

```svelte
<script lang="ts">
  import { ContentPage, CardGridSection } from '@page-sections/svelte';
  const page = { title: 'Projects', breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Projects' }] };
  const section = { id: 'projects', title: 'Projects', headline: 'Selected work' };
  const list = [{ id: 'one', title: 'My project', href: '/projects/one' }];
</script>

<ContentPage {page} sectionNavigation>
  <CardGridSection {section} {list} />
</ContentPage>
```

Components include their CSS. Import `@page-sections/svelte/styles.css` explicitly when using only low-level components. Use Svelte-aware tooling such as Vite's Svelte plugin; SvelteKit also supports the package exports directly.

## Development

Node 24 and npm 11 are used in CI.

```sh
npm ci
npm run verify
npx playwright install chromium
npm run test:e2e
npm run demo
```

`demo` builds and serves a prerendered plain Svelte/Vite application at http://127.0.0.1:4173. Disable JavaScript to inspect the same HTML. The demo is a static build, not a development server requiring client rendering.

## Documentation

- [Architecture and extraction provenance](docs/architecture.md)
- [Pages, grids, sections and backgrounds](docs/layout.md)
- [Components, navigation and themes](docs/components.md)
- [Serializable models and custom renderers](docs/data-models.md)
- [Progressive enhancement contract](docs/progressive-enhancement.md)
- [bergjohann.com migration assessment](docs/bergjohann-migration.md)
- [Release and npm setup](docs/releasing.md)

Licensed under MPL-2.0. See [NOTICE](NOTICE) for upstream attribution.
