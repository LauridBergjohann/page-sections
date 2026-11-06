<img src="assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# Page Sections

Page Sections is a simple, extensible toolkit for building content-driven websites from reusable sections and layouts.

Compose a portfolio, publication, product page or company website from ordinary content. Start with ready-made sections, combine them with responsive grids, and add your own components where the content calls for them. Shared data models support hand-authored pages and content supplied by a CMS.

The components work with Svelte 5 and SvelteKit. SvelteKit, Tailwind and specialized rendering technologies are not required.

## Features

- Composable pages, sections and responsive content grids.
- Overlay/artwork heroes, structured text, panels, image and video sections.
- Canonical catalog cards, editorial card grids and native scroll-snap carousels.
- Independent navigation with optional left and right controls, called satellites.
- Breadcrumbs and automatically generated section navigation.
- CSS custom properties and shared themes.
- Serializable content models and custom section renderers.
- Server-renderable content, with optional interactions after hydration.

## Packages

| Package | Use it for |
| --- | --- |
| [@page-sections/core](https://www.npmjs.com/package/@page-sections/core) | Framework-independent content models, layout calculations, tokens, registries and utilities. |
| [@page-sections/svelte](https://www.npmjs.com/package/@page-sections/svelte) | Svelte 5 components for pages, sections, grids and navigation. Installs core as a dependency. |

For a Svelte website, start with the Svelte package. Install core directly when importing its runtime functions or using the models without Svelte. The Svelte package also re-exports core's TypeScript types.

## Quick start

In an existing Svelte 5 or SvelteKit application:

```bash
npm install @page-sections/svelte
```

Place this in `App.svelte`, or a SvelteKit `+page.svelte`:

```svelte
<script lang="ts">
  import { ContentPage, RichTextSection, CardGridSection } from '@page-sections/svelte';
</script>
<ContentPage page={{ title: 'Field notes', intro: 'Ideas, projects and things worth sharing.' }} sectionNavigation>
  <RichTextSection section={{ id: 'about', title: 'About', headline: 'A place to begin',
    body: 'Welcome to my **collection of work**.' }} />
  <CardGridSection section={{ id: 'projects', title: 'Projects', headline: 'Selected projects' }}
    list={[
      { id: 'garden', title: 'A community garden', href: '/projects/garden' },
      { id: 'journal', title: 'A walking journal', href: '/projects/journal' }
    ]} />
</ContentPage>
```

The components load their styles. For content to remain available without JavaScript, enable SSR or prerendering in the host application; the library does not turn a client-only app into an SSR app.

## Components

| Area | Components |
| --- | --- |
| Page composition | `PageShell`, `ContentPage`, `Section`, `SectionSurfaceGroup` |
| Content primitives | `RichTextContent`, `InlineTextContent`, `ContentPanel`, `Actions` |
| Content layout | `ContentGrid`, `ContentBlock` |
| Content sections | `HeroSection`, `RichTextSection`, `PanelSection`, `ImageSection`, `VideoSection` |
| Collections | `CardGridSection`, `CarouselSection`, `Card`, `Image` |
| Navigation | `Navigation`, `MainMenu`, `ButtonGroup`, `Breadcrumbs`, `SectionNavigation` |
| Data-driven rendering | `Sections` |

See the [Svelte package guide](packages/svelte/README.md) for practical examples and the [Svelte API](https://github.com/LauridBergjohann/page-sections/wiki/Svelte-API) for the complete index.

## Demo

The [demo source](apps/demo) contains a complete Svelte 5 application with sections, responsive blocks, navigation, themes and data-driven content. From this repository, using Node 24 and npm 11:

```bash
npm ci
npm run demo
```

This builds both packages and the SvelteKit demo, prerenders its routes with adapter-static, and starts a preview server at **http://127.0.0.1:4173**. Explore `/components/`, `/backgrounds/` and the data-only portfolio, legal and catalog examples under `/examples/`. Disable JavaScript to inspect their initial HTML. For development with hot reload, use `npm run dev:demo` at **http://127.0.0.1:5173**; see the [demo guide](docs/development/demo.md).

## Upgrading to 0.2

See the [migration guide](https://github.com/LauridBergjohann/page-sections/wiki/Migrating-to-0.2) for catalog/editorial cards and canonical geometry. Maintainers can review the [release preparation](docs/development/release-0.2.md).

## Documentation

The [GitHub Wiki](https://github.com/LauridBergjohann/page-sections/wiki) is the full user guide and API reference.

- [Installation](https://github.com/LauridBergjohann/page-sections/wiki/Installation) and [Quick Start](https://github.com/LauridBergjohann/page-sections/wiki/Quick-Start)
- [Svelte package guide](packages/svelte/README.md)
- [Core package guide](packages/core/README.md)
- [Themes and Styling](https://github.com/LauridBergjohann/page-sections/wiki/Themes-and-Styling)
- [Data Models and Custom Sections](https://github.com/LauridBergjohann/page-sections/wiki/Data-Models-and-Custom-Sections)

## Development

Interested in contributing or working on the project? See the [development guide](docs/development/README.md).

## License

[Mozilla Public License 2.0](LICENSE). Attribution information is retained in [NOTICE](NOTICE).
