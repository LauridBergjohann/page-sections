<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="48" height="48" />

# @page-sections/svelte

Composable Svelte 5 components for content-driven websites, from portfolios and product pages to documentation. Works with plain Svelte and SvelteKit.

- **Consistent layouts:** pages, sections, grids and cards share responsive sizing and spacing.
- **Reusable sections:** compose heroes, text, panels, media, card grids, feature lists, carousels, timelines and code examples.
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

TimelineSection renders a proportional horizontal calendar with one shared, priority-ordered track pool, anchored zoom, category filters and compact clusters that open accessible event lists. Optional event `label` values shorten overview text while details retain the full title. `axisPosition` defaults to bottom; `stageWidth` defaults to contained. Choosing full also sets `background.size` to full while preserving its color; full width is recommended only without side navigation. Use the `timeline` discriminator in Sections, or pass `TimelineSectionData` directly. Set `referenceDate` for reproducible ongoing intervals. Native disclosures keep optional content available without JavaScript. See the [Timeline guide](https://page-sections.bergjohann.com/sections/timeline/).

## License

[Mozilla Public License 2.0](LICENSE). Attribution is retained in [NOTICE](NOTICE).

FeatureSection presents centered icons, titles and descriptions using the CardGrid S/M/L spans. Every incomplete row is centered. Set iconTone to standard, muted (default) or primary using existing theme colors; optional href links the entire feature. Use type: features for JSON-driven Sections. See the [Features guide](https://page-sections.bergjohann.com/sections/features/).
