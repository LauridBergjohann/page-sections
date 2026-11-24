<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="48" height="48" />

# @page-sections/svelte

Composable Svelte 5 components for content-driven websites, from portfolios and product pages to documentation. Works with plain Svelte and SvelteKit.

- **Consistent layouts:** pages, sections, grids and cards share responsive sizing and spacing.
- **Reusable sections:** compose heroes, text, panels, media, card grids, carousels, timelines and code examples.
- **Flexible content:** use Svelte snippets and HTML, or render serializable content from JSON or a CMS.
- **Connected navigation:** menus, sidebars, breadcrumbs and automatic page contents work together.
- **Adaptable styling:** light and dark themes, surface options and CSS variables support your visual identity.
- **HTML first:** supports SSR and prerendering, with optional syntax highlighting through a separate entry point.

## Installation

```sh
npm install @page-sections/svelte
```

Requires Svelte `^5.56.4` and Node `>=22.12.0`. No SvelteKit, CSS framework, icon library or rendering engine is required. The core package is installed automatically and its types are re-exported.

## Documentation and examples

**[Visit the Page Sections website — documentation, interactive examples and showcase](https://page-sections.bergjohann.com/)**

Start with [Getting started](https://page-sections.bergjohann.com/getting-started/), explore the [documentation](https://page-sections.bergjohann.com/docs/), or look up components in the [Svelte API reference](https://page-sections.bergjohann.com/docs/reference/svelte-api/).

## Components and atomic design

Use atoms (PrimaryButton, SecondaryButton, IconButton, Chip, Tooltip, Heading, Image), molecules (ButtonGroup, Card, Popup), and organisms (Header, Footer, TimelineSection, Sections) independently or compose them. PageShell, ContentPage and the grid helpers provide page composition. All existing root imports remain available; optional `/atoms`, `/molecules`, `/organisms` and `/layouts` subpaths group the same components.

See the [atomic design guide](https://page-sections.bergjohann.com/docs/design-system/atomic-design/) and [complete component catalog](https://page-sections.bergjohann.com/docs/components/) for live examples, data types and customization.

TimelineSection renders parallel calendar categories with automatic overlap lanes, filters and anchored event details. Use the `timeline` discriminator in Sections, or pass `TimelineSectionData` directly. Set `referenceDate` for reproducible ongoing intervals. Native disclosures keep optional content available without JavaScript. See the [Timeline guide](https://page-sections.bergjohann.com/sections/timeline/).

## License

[Mozilla Public License 2.0](LICENSE). Attribution is retained in [NOTICE](NOTICE).
