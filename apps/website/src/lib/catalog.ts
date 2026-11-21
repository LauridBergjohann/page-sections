// Shared chapter metadata for navigation, search and reading order.
export const documents = [
  {
    title: 'Overview',
    href: '/docs/',
    description: 'A guided map of the components, layouts and interactive examples.',
    group: 'Start here',
    category: ''
  },
  {
    title: 'Foundations',
    href: '/docs/foundations/',
    description: 'Installation, What are sections?, Using sections, Theming.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Installation',
    href: '/docs/foundations/installation/',
    description: 'Install the package and styles in a Svelte application.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'What are sections?',
    href: '/docs/foundations/pages-and-sections/',
    description: 'Understand content regions, IDs, labels and visible headings.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Using sections',
    href: '/docs/foundations/first-page/',
    description: 'Build a small content page step by step.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Theming',
    href: '/docs/foundations/themes/',
    description: 'Set shared colors, typography and color mode.',
    group: 'Foundations',
    category: ''
  },
  {
    title: 'Page layout',
    href: '/docs/page-layout/',
    description:
      'Header and satellites, Breadcrumbs, ContentPage and sidebars, Heading levels and anchor links, Footer.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Header and satellites',
    href: '/docs/page-layout/header/',
    description: 'Site identity, primary navigation and secondary controls.',
    group: 'Page layout',
    category: ''
  },
  {
    title: 'Breadcrumbs',
    href: '/docs/page-layout/breadcrumbs/',
    description: 'Show the current page in its site hierarchy.',
    group: 'Page layout',
    category: ''
  },
  {
    title: 'ContentPage and sidebars',
    href: '/docs/page-layout/content-page/',
    description: 'Main content, site navigation and an on-page index.',
    group: 'Page layout',
    category: ''
  },
  {
    title: 'Heading levels and anchor links',
    href: '/docs/page-layout/headings-and-anchors/',
    description: 'Semantic headings, visual sizes and stable section destinations.',
    group: 'Page layout',
    category: ''
  },
  {
    title: 'Footer',
    href: '/docs/page-layout/footer/',
    description: 'Shared links, brand information and a bottom bar.',
    group: 'Page layout',
    category: ''
  },
  {
    title: 'Components',
    href: '/docs/building-blocks/',
    description: 'Section, Card, Image, ContentGrid and ContentBlock.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Section',
    href: '/docs/building-blocks/section/',
    description: 'The base section container and its shared properties.',
    group: 'Components',
    category: ''
  },
  {
    title: 'Card',
    href: '/docs/building-blocks/card/',
    description: 'Present an item with an image, title, optional description and links.',
    group: 'Components',
    category: ''
  },
  {
    title: 'Image',
    href: '/docs/building-blocks/image/',
    description: 'Responsive, accessible and theme-aware image rendering.',
    group: 'Components',
    category: ''
  },
  {
    title: 'ContentGrid and ContentBlock',
    href: '/docs/building-blocks/grids/',
    description: 'Arrange content with responsive column spans.',
    group: 'Components',
    category: ''
  },
  {
    title: 'Design system',
    href: '/docs/design-system/',
    description: 'Layout sizes and responsiveness, Backgrounds and groups.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Layout sizes and responsiveness',
    href: '/docs/design-system/responsive-layout/',
    description: 'Viewport breakpoints, container widths and card sizing.',
    group: 'Design system',
    category: ''
  },
  {
    title: 'Backgrounds and groups',
    href: '/docs/design-system/backgrounds/',
    description: 'Surface colors, widths, transitions and connected groups.',
    group: 'Design system',
    category: ''
  },
  {
    title: 'Advanced',
    href: '/docs/advanced/',
    description: 'Create your own section, Data and custom renderers, SSR and enhancement.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Create your own section',
    href: '/docs/advanced/create-your-own-section/',
    description: 'Build a reusable component around the base Section.',
    group: 'Advanced',
    category: ''
  },
  {
    title: 'Data and custom renderers',
    href: '/docs/advanced/data-and-custom-sections/',
    description: 'Render content data and extend the section type map.',
    group: 'Advanced',
    category: ''
  },
  {
    title: 'SSR and enhancement',
    href: '/docs/advanced/ssr/',
    description: 'Deliver useful HTML before browser enhancement.',
    group: 'Advanced',
    category: ''
  },
  {
    title: 'Reference',
    href: '/docs/reference/',
    description: 'Data types, Svelte API, Core API, CSS variables and tokens.',
    group: 'Overview',
    category: ''
  },
  {
    title: 'Data types',
    href: '/docs/reference/types/',
    description: 'Object fields, required values and linked nested types.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Svelte API',
    href: '/docs/reference/svelte-api/',
    description: 'Public components and their usage guides.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Core API',
    href: '/docs/reference/core-api/',
    description: 'Functions, registries and framework-independent exports.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'CSS variables and tokens',
    href: '/docs/reference/tokens/',
    description: 'Exact values for themes and responsive layout.',
    group: 'Reference',
    category: ''
  },
  {
    title: 'Heading',
    href: '/sections/headings/',
    description:
      'Compose page titles and section headings with independent size, semantics and surfaces.',
    group: 'Sections',
    category: 'Introduction'
  },
  {
    title: 'Hero',
    href: '/sections/hero/',
    description:
      'Use HeroSection for a prominent introduction or call to action. It combines an optional image with a readable copy area; omit the image for a text-led hero.',
    group: 'Sections',
    category: 'Introduction'
  },
  {
    title: 'RichText',
    href: '/sections/rich-text/',
    description: 'RichTextSection: readable paragraphs, headings, lists and structured content.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Panel',
    href: '/sections/panel/',
    description: 'PanelSection: group related content on standard or muted surfaces.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Code',
    href: '/sections/code/',
    description: 'CodeBlock, CodeSection, syntax highlighting and text beside code.',
    group: 'Sections',
    category: 'Text and code'
  },
  {
    title: 'Image',
    href: '/sections/image/',
    description:
      'Use ImageSection for an image on its own or paired with explanatory text. Children provide richer accompanying content without storing markup in the image data.',
    group: 'Sections',
    category: 'Media'
  },
  {
    title: 'Video',
    href: '/sections/video/',
    description:
      'Use VideoSection for a native video player or YouTube embed, optionally paired with text.',
    group: 'Sections',
    category: 'Media'
  },
  {
    title: 'CardGrid',
    href: '/sections/card-grid/',
    description:
      'CardGridSection: card sizes, tones, variants, image ratios and responsive collections.',
    group: 'Sections',
    category: 'Collections'
  },
  {
    title: 'Carousel',
    href: '/sections/carousel/',
    description:
      'CarouselSection: horizontal collections with native scrolling and shared card options.',
    group: 'Sections',
    category: 'Collections'
  },
  {
    title: 'Sections',
    href: '/sections/',
    description: 'Choose the right section for text, media, code and collections.',
    group: 'Overview',
    category: ''
  }
];
