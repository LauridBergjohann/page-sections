export const documents = [
  {
    title: 'Code',
    href: '/docs/code/',
    description: 'CodeBlock, CodeSection, syntax highlighting and text beside code.',
    group: 'Guides',
    legacy: ''
  },
  {
    title: 'Documentation',
    href: '/docs/',
    description: 'Explore components, layouts and interactive examples.',
    group: 'Guides',
    legacy: 'Home'
  },
  {
    title: 'Installation',
    href: '/getting-started/installation/',
    description:
      'Choose @page-sections/svelte for a Svelte website, or @page-sections/core for framework-independent data and calculations.',
    group: 'Getting started',
    legacy: 'Installation'
  },
  {
    title: 'Your first page',
    href: '/getting-started/first-page/',
    description:
      'After installation, add a page with a text introduction and a collection of links:',
    group: 'Getting started',
    legacy: 'Quick-Start'
  },
  {
    title: 'Pages and sections',
    href: '/getting-started/pages-and-sections/',
    description:
      'Use a small set of composable containers rather than a separate page format for every layout.',
    group: 'Getting started',
    legacy: 'Pages-and-Sections'
  },
  {
    title: 'Page shell',
    href: '/docs/page-shell/',
    description:
      'ContentPage is the main content container. PageShell is an optional ancestor that shares a theme across the page and independent navigation.',
    group: 'Guides',
    legacy: 'ContentPage-and-PageShell'
  },
  {
    title: 'Sections and grids',
    href: '/docs/content-grid/',
    description:
      'Section gives ordinary content a semantic region, anchor, spacing and optional background. ContentGrid and ContentBlock arrange explicit content inside it. Use them when a page needs an article/aside pair, feature column',
    group: 'Guides',
    legacy: 'Section-and-ContentGrid'
  },
  {
    title: 'Responsive layout',
    href: '/docs/responsive-layout/',
    description:
      'Page Sections distinguishes viewport width from content-container width. A narrow article in a wide window should still use a narrow content grid. Dimensions are CSS pixels; physical screen size and device pixel ratio do',
    group: 'Guides',
    legacy: 'Responsive-Layout-and-Breakpoints'
  },
  {
    title: 'Backgrounds and groups',
    href: '/docs/backgrounds/',
    description:
      "Backgrounds separate a section's content layout from its visual surface. Use a standard background for a contained panel and a full background for a page-wide transition.",
    group: 'Guides',
    legacy: 'Section-Backgrounds-and-Surface-Groups'
  },
  {
    title: 'Hero',
    href: '/docs/hero/',
    description:
      'Use HeroSection for a prominent introduction or call to action. It combines an optional image with a readable copy area; omit the image for a text-led hero.',
    group: 'Guides',
    legacy: 'HeroSection'
  },
  {
    title: 'Rich text',
    href: '/docs/rich-text/',
    description: '﻿# RichTextSection',
    group: 'Guides',
    legacy: 'RichTextSection'
  },
  {
    title: 'Panels',
    href: '/docs/panels/',
    description: '﻿# PanelSection',
    group: 'Guides',
    legacy: 'PanelSection'
  },
  {
    title: 'Images',
    href: '/docs/images/',
    description:
      'Use ImageSection for an image on its own or paired with explanatory text. Children provide richer accompanying content without storing markup in the image data.',
    group: 'Guides',
    legacy: 'ImageSection'
  },
  {
    title: 'Video',
    href: '/docs/video/',
    description:
      'Use VideoSection for a native video player or YouTube embed, optionally paired with text.',
    group: 'Guides',
    legacy: 'VideoSection'
  },
  {
    title: 'Card grid',
    href: '/docs/card-grid/',
    description: '﻿# CardGridSection',
    group: 'Guides',
    legacy: 'CardGridSection'
  },
  {
    title: 'Carousel',
    href: '/docs/carousel/',
    description: '﻿# CarouselSection',
    group: 'Guides',
    legacy: 'CarouselSection'
  },
  {
    title: 'Card and Image',
    href: '/docs/card-and-image/',
    description:
      'These low-level building blocks are useful when composing a custom section. Card supplies the same article used by the two collection components; Image supplies shared responsive and theme-aware image rendering.',
    group: 'Guides',
    legacy: 'Card-and-Image'
  },
  {
    title: 'Navigation and satellites',
    href: '/docs/navigation/',
    description:
      'Navigation arranges a central menu and optional left/right controls. These controls are called satellites: they might select a language, change a theme or contain an application-specific action. Navigation works without ',
    group: 'Guides',
    legacy: 'Navigation-and-Satellites'
  },
  {
    title: 'Breadcrumbs and anchors',
    href: '/docs/breadcrumbs/',
    description:
      "Breadcrumbs show a page's location in the site hierarchy. SectionNavigation links to anchors on one page. Neither component owns routing or watches scroll position.",
    group: 'Guides',
    legacy: 'Breadcrumbs-and-Section-Navigation'
  },
  {
    title: 'Themes and styling',
    href: '/docs/themes/',
    description:
      'Page Sections provides CSS defaults without requiring a utility framework. Set shared variables on an ancestor, or use PageShell to scope a typed theme across navigation and page content.',
    group: 'Guides',
    legacy: 'Themes-and-Styling'
  },
  {
    title: 'Data and custom sections',
    href: '/docs/data-and-custom-sections/',
    description:
      'Keep content as JSON-compatible data and render it with components supplied by your application. This makes the same model usable for local files, a CMS or a future editing interface.',
    group: 'Guides',
    legacy: 'Data-Models-and-Custom-Sections'
  },
  {
    title: 'SSR and enhancement',
    href: '/docs/ssr/',
    description:
      'Page Sections components can render meaningful HTML on the server. The host application must enable SSR or prerendering; importing the library into a client-only application does not provide either automatically.',
    group: 'Guides',
    legacy: 'SSR-and-Progressive-Enhancement'
  },
  {
    title: 'CSS variables and tokens',
    href: '/docs/tokens/',
    description:
      'CSS variables customize presentation; layoutTokens supplies canonical numeric values for core calculations and generated grid CSS. Changing CSS does not mutate the token object. This page distinguishes public theme contr',
    group: 'Reference',
    legacy: 'CSS-Variables-and-Layout-Tokens'
  },
  {
    title: 'Svelte API',
    href: '/docs/svelte-api/',
    description:
      'Import components from @page-sections/svelte. The public components are listed below. Component props are documented on the linked pages; this index shows where to start, without duplicating the full reference.',
    group: 'Reference',
    legacy: 'Svelte-API'
  },
  {
    title: 'Core API',
    href: '/docs/core-api/',
    description:
      'All runtime functions, constants, classes and types below are exported from @page-sections/core. The package has no runtime dependencies, DOM requirement or rendering implementation. Svelte re-exports its types only.',
    group: 'Reference',
    legacy: 'Core-API'
  },
  {
    title: 'Migration from 0.1',
    href: '/docs/migration/',
    description: '﻿# Migrating to 0.2',
    group: 'Guides',
    legacy: 'Migrating-to-0.2'
  }
];
