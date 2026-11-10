// Reading order is shared by chapter navigation and local search.
export const chapterGroups = [
  'Start here',
  'Foundations',
  'Sections',
  'Building blocks',
  'Advanced',
  'Reference'
];

export const documents = [
  {
    title: 'Overview',
    href: '/docs/',
    description: 'A guided map of the components, layouts and interactive examples.',
    group: 'Start here',
    legacy: 'Home',
    category: ''
  },
  {
    title: 'Installation',
    href: '/getting-started/installation/',
    description:
      'Choose @page-sections/svelte for a Svelte website, or @page-sections/core for framework-independent data and calculations.',
    group: 'Start here',
    legacy: 'Installation',
    category: ''
  },
  {
    title: 'Your first page',
    href: '/getting-started/first-page/',
    description:
      'After installation, add a page with a text introduction and a collection of links:',
    group: 'Start here',
    legacy: 'Quick-Start',
    category: ''
  },
  {
    title: 'Pages and sections',
    href: '/getting-started/pages-and-sections/',
    description:
      'Use a small set of composable containers rather than a separate page format for every layout.',
    group: 'Start here',
    legacy: 'Pages-and-Sections',
    category: ''
  },
  {
    title: 'Page shell',
    href: '/docs/page-shell/',
    description:
      'ContentPage is the main content container. PageShell is an optional ancestor that shares a theme across the page and independent navigation.',
    group: 'Foundations',
    legacy: 'ContentPage-and-PageShell',
    category: ''
  },
  {
    title: 'Sections and grids',
    href: '/docs/content-grid/',
    description:
      'Section, ContentGrid and ContentBlock: arrange content in columns and reading layouts.',
    group: 'Foundations',
    legacy: 'Section-and-ContentGrid',
    category: ''
  },
  {
    title: 'Responsive layout',
    href: '/docs/responsive-layout/',
    description:
      'Viewport breakpoints, container widths, card sizes and responsive layout calculations.',
    group: 'Foundations',
    legacy: 'Responsive-Layout-and-Breakpoints',
    category: ''
  },
  {
    title: 'Themes and styling',
    href: '/docs/themes/',
    description:
      'Page Sections provides CSS defaults without requiring a utility framework. Set shared variables on an ancestor, or use PageShell to scope a typed theme across navigation and page content.',
    group: 'Foundations',
    legacy: 'Themes-and-Styling',
    category: ''
  },
  {
    title: 'Backgrounds and groups',
    href: '/docs/backgrounds/',
    description:
      "Backgrounds separate a section's content layout from its visual surface. Use a standard background for a contained panel and a full background for a page-wide transition.",
    group: 'Foundations',
    legacy: 'Section-Backgrounds-and-Surface-Groups',
    category: ''
  },
  {
    title: 'Hero',
    href: '/docs/hero/',
    description:
      'Use HeroSection for a prominent introduction or call to action. It combines an optional image with a readable copy area; omit the image for a text-led hero.',
    group: 'Sections',
    legacy: 'HeroSection',
    category: 'Introduction'
  },
  {
    title: 'Rich text',
    href: '/docs/rich-text/',
    description: 'RichTextSection: readable paragraphs, headings, lists and structured content.',
    group: 'Sections',
    legacy: 'RichTextSection',
    category: 'Text and code'
  },
  {
    title: 'Panels',
    href: '/docs/panels/',
    description: 'PanelSection: group related content on standard or muted surfaces.',
    group: 'Sections',
    legacy: 'PanelSection',
    category: 'Text and code'
  },
  {
    title: 'Code',
    href: '/docs/code/',
    description: 'CodeBlock, CodeSection, syntax highlighting and text beside code.',
    group: 'Sections',
    legacy: '',
    category: 'Text and code'
  },
  {
    title: 'Images',
    href: '/docs/images/',
    description:
      'Use ImageSection for an image on its own or paired with explanatory text. Children provide richer accompanying content without storing markup in the image data.',
    group: 'Sections',
    legacy: 'ImageSection',
    category: 'Media'
  },
  {
    title: 'Video',
    href: '/docs/video/',
    description:
      'Use VideoSection for a native video player or YouTube embed, optionally paired with text.',
    group: 'Sections',
    legacy: 'VideoSection',
    category: 'Media'
  },
  {
    title: 'Card grid',
    href: '/docs/card-grid/',
    description:
      'CardGridSection: card sizes, tones, variants, image ratios and responsive collections.',
    group: 'Sections',
    legacy: 'CardGridSection',
    category: 'Collections'
  },
  {
    title: 'Carousel',
    href: '/docs/carousel/',
    description:
      'CarouselSection: horizontal collections with native scrolling and shared card options.',
    group: 'Sections',
    legacy: 'CarouselSection',
    category: 'Collections'
  },
  {
    title: 'Card and Image',
    href: '/docs/card-and-image/',
    description:
      'These low-level building blocks are useful when composing a custom section. Card supplies the same article used by the two collection components; Image supplies shared responsive and theme-aware image rendering.',
    group: 'Building blocks',
    legacy: 'Card-and-Image',
    category: ''
  },
  {
    title: 'Navigation and satellites',
    href: '/docs/navigation/',
    description: 'MainMenu, Navigation and satellites: menus, tools and responsive settings.',
    group: 'Building blocks',
    legacy: 'Navigation-and-Satellites',
    category: ''
  },
  {
    title: 'Breadcrumbs and anchors',
    href: '/docs/breadcrumbs/',
    description:
      "Breadcrumbs show a page's location in the site hierarchy. SectionNavigation links to anchors on one page. Neither component owns routing or watches scroll position.",
    group: 'Building blocks',
    legacy: 'Breadcrumbs-and-Section-Navigation',
    category: ''
  },
  {
    title: 'Data and custom sections',
    href: '/docs/data-and-custom-sections/',
    description:
      'Keep content as JSON-compatible data and render it with components supplied by your application. This makes the same model usable for local files, a CMS or a future editing interface.',
    group: 'Advanced',
    legacy: 'Data-Models-and-Custom-Sections',
    category: ''
  },
  {
    title: 'SSR and enhancement',
    href: '/docs/ssr/',
    description:
      'Page Sections components can render meaningful HTML on the server. The host application must enable SSR or prerendering; importing the library into a client-only application does not provide either automatically.',
    group: 'Advanced',
    legacy: 'SSR-and-Progressive-Enhancement',
    category: ''
  },
  {
    title: 'Migration from 0.1',
    href: '/docs/migration/',
    description: 'Move from the original 0.1 API to the current layout and content models.',
    group: 'Advanced',
    legacy: 'Migrating-to-0.2',
    category: ''
  },
  {
    title: 'CSS variables and tokens',
    href: '/docs/tokens/',
    description: 'Customize theme variables and understand the shared layout tokens.',
    group: 'Reference',
    legacy: 'CSS-Variables-and-Layout-Tokens',
    category: ''
  },
  {
    title: 'Svelte API',
    href: '/docs/svelte-api/',
    description:
      'Import components from @page-sections/svelte. The public components are listed below. Component props are documented on the linked pages; this index shows where to start, without duplicating the full reference.',
    group: 'Reference',
    legacy: 'Svelte-API',
    category: ''
  },
  {
    title: 'Core API',
    href: '/docs/core-api/',
    description:
      'All runtime functions, constants, classes and types below are exported from @page-sections/core. The package has no runtime dependencies, DOM requirement or rendering implementation. Svelte re-exports its types only.',
    group: 'Reference',
    legacy: 'Core-API',
    category: ''
  }
];
