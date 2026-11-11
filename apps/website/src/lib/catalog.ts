// Chapter metadata feeds the navigation tree, search and guided reading order.
export const documents = [
  {
    title: 'Overview',
    href: '/docs/',
    description: 'A guided map of the components, layouts and interactive examples.',
    group: 'Start here',
    category: ''
  },
  {
    title: 'Installation',
    href: '/docs/installation/',
    description:
      'Choose @page-sections/svelte for a Svelte website, or @page-sections/core for framework-independent data and calculations.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Your first page',
    href: '/docs/first-page/',
    description:
      'After installation, add a page with a text introduction and a collection of links:',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Pages and sections',
    href: '/docs/pages-and-sections/',
    description:
      'Use a small set of composable containers rather than a separate page format for every layout.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Page shell',
    href: '/docs/page-shell/',
    description:
      'ContentPage is the main content container. PageShell is an optional ancestor that shares a theme across the page and independent navigation.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Sections and grids',
    href: '/docs/content-grid/',
    description:
      'Section, ContentGrid and ContentBlock: arrange content in columns and reading layouts.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Responsive layout',
    href: '/docs/responsive-layout/',
    description:
      'Viewport breakpoints, container widths, card sizes and responsive layout calculations.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Themes and styling',
    href: '/docs/themes/',
    description:
      'Page Sections provides CSS defaults without requiring a utility framework. Set shared variables on an ancestor, or use PageShell to scope a typed theme across navigation and page content.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Backgrounds and groups',
    href: '/docs/backgrounds/',
    description:
      "Backgrounds separate a section's content layout from its visual surface. Use a standard background for a contained panel and a full background for a page-wide transition.",
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Hero',
    href: '/docs/hero/',
    description:
      'Use HeroSection for a prominent introduction or call to action. It combines an optional image with a readable copy area; omit the image for a text-led hero.',
    group: 'Sections',
    category: 'Introduction'
  },
  {
    title: 'Rich text',
    href: '/docs/rich-text/',
    description: 'RichTextSection: readable paragraphs, headings, lists and structured content.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Panels',
    href: '/docs/panels/',
    description: 'PanelSection: group related content on standard or muted surfaces.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Code',
    href: '/docs/code/',
    description: 'CodeBlock, CodeSection, syntax highlighting and text beside code.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Images',
    href: '/docs/images/',
    description:
      'Use ImageSection for an image on its own or paired with explanatory text. Children provide richer accompanying content without storing markup in the image data.',
    group: 'Sections',
    category: 'Media'
  },
  {
    title: 'Video',
    href: '/docs/video/',
    description:
      'Use VideoSection for a native video player or YouTube embed, optionally paired with text.',
    group: 'Sections',
    category: 'Media'
  },
  {
    title: 'Card grid',
    href: '/docs/card-grid/',
    description:
      'CardGridSection: card sizes, tones, variants, image ratios and responsive collections.',
    group: 'Sections',
    category: 'Collections'
  },
  {
    title: 'Carousel',
    href: '/docs/carousel/',
    description:
      'CarouselSection: horizontal collections with native scrolling and shared card options.',
    group: 'Sections',
    category: 'Collections'
  },
  {
    title: 'Card and Image',
    href: '/docs/card-and-image/',
    description:
      'These low-level building blocks are useful when composing a custom section. Card supplies the same article used by the two collection components; Image supplies shared responsive and theme-aware image rendering.',
    group: 'Building blocks',
    category: ''
  },
  {
    title: 'Navigation and satellites',
    href: '/docs/navigation/',
    description: 'MainMenu, Navigation and satellites: menus, tools and responsive settings.',
    group: 'Building blocks',
    category: ''
  },
  {
    title: 'Breadcrumbs and anchors',
    href: '/docs/breadcrumbs/',
    description:
      'Keep breadcrumbs in sync with the site tree and follow the active section with an automatic content menu.',
    group: 'Building blocks',
    category: ''
  },
  {
    title: 'Data and custom sections',
    href: '/docs/data-and-custom-sections/',
    description:
      'Keep content as JSON-compatible data and render it with components supplied by your application. This makes the same model usable for local files, a CMS or a future editing interface.',
    group: 'Advanced',
    category: ''
  },
  {
    title: 'SSR and enhancement',
    href: '/docs/ssr/',
    description:
      'Page Sections components can render meaningful HTML on the server. The host application must enable SSR or prerendering; importing the library into a client-only application does not provide either automatically.',
    group: 'Advanced',
    category: ''
  },
  {
    title: 'CSS variables and tokens',
    href: '/docs/tokens/',
    description: 'Customize theme variables and understand the shared layout tokens.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Svelte API',
    href: '/docs/svelte-api/',
    description:
      'Import components from @page-sections/svelte. The public components are listed below. Component props are documented on the linked pages; this index shows where to start, without duplicating the full reference.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Core API',
    href: '/docs/core-api/',
    description:
      'All runtime functions, constants, classes and types below are exported from @page-sections/core. The package has no runtime dependencies, DOM requirement or rendering implementation. Svelte re-exports its types only.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Foundations',
    href: '/docs/foundations/',
    description: 'Understand page composition, responsive layouts, themes and backgrounds.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Sections',
    href: '/docs/sections/',
    description: 'Choose the right section for text, media, code and collections.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Building blocks',
    href: '/docs/building-blocks/',
    description: 'Combine navigation and smaller components into your own layouts.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Advanced',
    href: '/docs/advanced/',
    description: 'Connect data sources, add custom sections and render on the server.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Reference',
    href: '/docs/reference/',
    description: 'Look up components, core functions and design tokens.',
    group: 'Overview',
    category: ''
  }
];
