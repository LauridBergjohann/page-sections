import { base } from '#lib/paths.js';
import { illustrationSizes } from './illustrationSizes.js';
export const sectionCatalog = [
  {
    slug: 'features',
    title: 'Features',
    icon: 'layers',
    description: 'Centered icons, titles and benefits with optional links and shared grid sizes.'
  },
  {
    slug: 'card-grid',
    title: 'CardGrid',
    icon: 'grid',
    description: 'Responsive collections with consistent images, text and actions.'
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    icon: 'carousel',
    description: 'A horizontal collection with native scrolling and optional controls.'
  },
  {
    slug: 'code',
    title: 'Code',
    icon: 'code',
    description: 'Readable source code with highlighting, line numbers and copy tools.'
  },
  {
    slug: 'headings',
    title: 'Heading',
    icon: 'heading',
    description: 'Introduce a page or chapter with a clear typographic hierarchy.'
  },
  {
    slug: 'hero',
    title: 'Hero',
    icon: 'hero',
    description: 'A prominent opening with imagery, a headline and a call to action.'
  },
  {
    slug: 'image',
    title: 'Image',
    icon: 'image',
    description: 'Responsive images on their own or alongside explanatory text.'
  },
  {
    slug: 'panel',
    title: 'Panel',
    icon: 'panel',
    description: 'Highlight related information on a distinct surface with actions.'
  },
  {
    slug: 'rich-text',
    title: 'RichText',
    icon: 'text',
    description: 'Markdown, plain text and structured blocks for longer stories.'
  },
  {
    slug: 'video',
    title: 'Video',
    icon: 'video',
    description: 'Native video or YouTube, with optional accompanying content.'
  },
  {
    slug: 'timeline',
    title: 'Timeline',
    icon: 'timeline',
    description:
      'Explore shared tracks, milestones and clustered releases on a horizontal calendar.'
  }
]
  .sort((a, b) => a.title.localeCompare(b.title, 'en'))
  .map((item) => ({
    ...item,
    id: item.slug,
    href: `/sections/${item.slug}/`,
    image: {
      src: base + `/illustrations/${item.slug}.svg`,
      alt: `${item.title} section layout`,
      ...illustrationSizes[item.slug]
    }
  }));
export const sectionCards = sectionCatalog.map((item) => ({ ...item, href: base + item.href }));
export const nextStepCards = [
  {
    id: 'add-sections',
    title: 'Add Sections',
    description: 'Choose from eleven composable section types.',
    href: '/sections/'
  },
  {
    id: 'page-layout',
    title: 'Configure your page layout',
    description: 'Bring navigation, content and sidebars together.',
    href: '/docs/page-layout/content-page/'
  },
  {
    id: 'adapt-theme',
    title: 'Adapt the theme',
    description: 'Make colors and surfaces feel like your own.',
    href: '/docs/foundations/themes/'
  },
  {
    id: 'minimal-demo',
    title: 'Explore the minimal demo',
    description: 'Start from a complete, small Svelte application.',
    href: 'https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo'
  }
].map((item) => ({
  ...item,
  href: item.href.startsWith('/') ? base + item.href : item.href,
  image: {
    src: base + `/illustrations/${item.id}.svg`,
    alt: item.title,
    ...illustrationSizes[item.id]
  }
}));
