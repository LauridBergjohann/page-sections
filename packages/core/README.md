<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# @page-sections/core

Framework-independent models and utilities for content-driven websites. Describe pages as data, calculate responsive layouts or maintain a section index without coupling those tasks to a UI framework.

Core has no Svelte, DOM or browser-rendering dependency. It does not render HTML. For ready-made components, use [@page-sections/svelte](https://www.npmjs.com/package/@page-sections/svelte), which already installs core and re-exports its types. A component-only Svelte application needs only the Svelte package. Declare core as a direct dependency when importing its runtime functions yourself.

## Installation

```bash
npm install @page-sections/core
```

The package is ESM and declares Node `>=22.12.0`. All public exports are available from `@page-sections/core`; there are no public deep-import paths.

## Included APIs

| Area | Main APIs |
| --- | --- |
| Content data | `ContentPageData`, `PageData`, `SectionDefinition`, `SectionData` and section-specific models |
| Shared collections | `CardItem`, `CardSize`, `CardGridSectionData`, `CarouselSectionData` |
| Responsive layout | `resolveContentGrid`, `resolveContentSpan`, `contentSpanWidth`, `resolveViewportLayout`, `resolvePageLayout`, `resolveMenuOffset`, `resolveCardLayout` |
| Layout constants | `layoutTokens`, `contentGridSizes`, `viewportLayoutSizes` |
| Section indexing | `SectionRegistry`, `SECTION_REGISTRY` |
| Backgrounds and surfaces | `normalizeSectionBackground`, `createSectionBackgroundNormalizer`, `SectionSurfaceRegistry`, `SECTION_SURFACES` |
| Themes and links | `PageTheme`, `themeStyle`, `safeHref` |

## Calculate a content grid

Grid selection follows the container width before its outer gutters, in CSS pixels.

```ts
import { resolveContentGrid, resolveContentSpan, contentSpanWidth } from '@page-sections/core';
const grid = resolveContentGrid(840); // m: eight columns, 16px gap
const span = resolveContentSpan({ xs: 4, m: 3 }, grid.size);
const width = contentSpanWidth(840, span); // 293 CSS pixels
console.log({ columns: grid.columns, span, width });
```

Spans inherit from smaller grid sizes; invalid spans fill the row and oversized spans clamp. Svelte ContentGrid and ContentBlock use the same default tokens in generated CSS. Canonical geometry is shared with the components; colors and reading widths remain customizable. See [Responsive Layout and Breakpoints](https://github.com/LauridBergjohann/page-sections/wiki/Responsive-Layout-and-Breakpoints).

`resolveCardLayout` returns a media-plus-text layout calculation with separate frame and fitting rectangles. Svelte catalog cards consume the same tokens and match those dimensions; editorial cards grow with content.

## Describe a page and index its sections

Models contain data, not components or event handlers. The same CardItem array works in card-grid and carousel sections.

```ts
import { SectionRegistry, type PageData, type CardItem } from '@page-sections/core';
const list: CardItem[] = [
  { id: 'guide', title: 'The garden guide', href: '/guide', description: 'A practical introduction.' },
  { id: 'notes', title: 'Seasonal notes', href: '/notes' }
];
const page: PageData = {
  title: 'Growing things',
  sections: [
    { type: 'richText', id: 'intro', title: 'Introduction', body: 'Start with **one small plot**.' },
    { type: 'cardGrid', id: 'reading', title: 'Reading', headline: 'Keep reading', cardVariant: 'editorial', list }
  ]
};
const registry = new SectionRegistry();
const registrations = page.sections.map(section => registry.register(section));
console.log(JSON.stringify(page), registry.sections);
registrations.forEach(registration => registration.unregister());
```

Use one registry per page/request. Svelte ContentPage and Section manage registration automatically; component consumers usually do not instantiate registries.

## Extend the models

```ts
import type { CardItem } from '@page-sections/core';
interface ArticleCard extends CardItem { publishedAt: string }
const article: ArticleCard = {
  id: 'spring', title: 'Spring notes', href: '/notes/spring', publishedAt: '2026-03-20'
};
console.log(article.title, article.publishedAt);
```

For a new section discriminator, augment `SectionTypeMap` and provide a separate UI renderer. [Data Models and Custom Sections](https://github.com/LauridBergjohann/page-sections/wiki/Data-Models-and-Custom-Sections) includes a complete example. Validate CMS data at the application boundary; TypeScript models are not runtime validators.

## Backgrounds and themes

```ts
import { normalizeSectionBackground, themeStyle, type PageTheme } from '@page-sections/core';
const background = normalizeSectionBackground({ color: 'standardToMuted', size: 'full' });
const theme: PageTheme = { accent: '#8b4135', radius: '12px', narrowMax: '720px' };
console.log(background.cssBackground, themeStyle(theme));
```

Background normalization returns CSS and, where applicable, a diagnostic. Surface grouping determines which adjacent sections receive outer corners. Core describes this presentation but does not apply it to DOM elements.

## Documentation

`resolveCardLayout(containerWidth, cardSize, { mediaAspect, mediaFit, reserveEyebrow })` describes catalog cards with independent media/text areas. Supported media ratios are `3/2`, `4/3` and `1/1`; derive eyebrow reservation from the entire collection. The result includes the complete card height, outer `mediaFrame` and inner `media` fitting rectangle for posters or host geometry.

- [Core API](https://github.com/LauridBergjohann/page-sections/wiki/Core-API)
- [CSS Variables and Layout Tokens](https://github.com/LauridBergjohann/page-sections/wiki/CSS-Variables-and-Layout-Tokens)
- [Section Backgrounds and Surface Groups](https://github.com/LauridBergjohann/page-sections/wiki/Section-Backgrounds-and-Surface-Groups)
- [Demo source](https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo)

Licensed under MPL-2.0. See the package's LICENSE and NOTICE files.

Structured content models include RichTextBlock, InlineText, ContentAction and PanelSectionData. See the [0.2 migration guide](https://github.com/LauridBergjohann/page-sections/wiki/Migrating-to-0.2).
