import type { PageData, CardItem } from '@page-sections/core';
import { coast, landscape } from './content';

export const portfolio: PageData = {
  title: 'Ideas, made tangible.',
  pageTitle: 'Portfolio example — Page Sections',
  header: {
    type: 'hero',
    id: 'welcome',
    title: 'Welcome',
    headline: 'Ideas, made tangible.',
    eyebrow: 'Design · Development · Making',
    composition: 'artwork',
    size: 'm',
    introduction: 'A personal website composed entirely from Page Sections data.',
    image: landscape,
    actions: [
      { label: 'Explore projects', href: '#projects', variant: 'primary' },
      { label: 'About me', href: '#about' }
    ]
  },
  sections: [
    {
      type: 'cardGrid',
      id: 'projects',
      title: 'Projects',
      headline: 'Selected work',
      cardVariant: 'editorial',
      cardTone: 'muted',
      itemSpan: { xs: 4, s: 3, m: 4, l: 4 },
      background: { color: 'standard' },
      list: [
        {
          id: 'spatial',
          title: 'Spatial experiences',
          eyebrow: 'Design & technology',
          image: landscape,
          description:
            'An exploration of digital objects, collections and interfaces that respond to the space available. Longer descriptions remain readable at every screen size.',
          footer: [
            { type: 'strong', text: 'Focus: ' },
            { type: 'text', text: 'Interaction design' }
          ],
          actions: [{ label: 'View collection', href: '/examples/cards/', variant: 'primary' }]
        },
        {
          id: 'writing',
          title: 'Notes from the coast',
          image: coast,
          description: 'A quieter place for observations and small discoveries.',
          footer: 'Updated regularly',
          actions: [{ label: 'Read the story', href: '#about', variant: 'text' }]
        },
        {
          id: 'contact',
          title: 'Let us build something',
          eyebrow: 'Collaboration',
          description:
            'From an early idea to a usable interface. This card intentionally has no image.',
          actions: [{ label: 'Get in touch', href: 'mailto:hello@example.com' }]
        }
      ]
    },
    {
      type: 'grid',
      id: 'about',
      title: 'About',
      headline: 'A little about me',
      spacing: 'loose',
      blocks: [
        {
          id: 'biography',
          span: { xs: 4, s: 6, m: 5, l: 8 },
          sections: [
            {
              type: 'richText',
              id: 'approach',
              title: 'Approach',
              headline: 'Curiosity meets craft',
              blocks: [
                {
                  type: 'paragraph',
                  variant: 'lead',
                  text: 'I combine design and development to turn ideas into useful things.'
                },
                {
                  type: 'paragraph',
                  text: 'The process starts with understanding people and their needs. Prototypes make ideas concrete; careful implementation makes them dependable.'
                },
                {
                  type: 'list',
                  items: [
                    'Interface and interaction design',
                    'Accessible websites',
                    'Experiments with spatial content'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'facts',
          span: { xs: 4, s: 6, m: 3, l: 4 },
          sections: [
            {
              type: 'panel',
              id: 'profile',
              title: 'Profile',
              headline: 'At a glance',
              blocks: [
                {
                  type: 'paragraph',
                  text: [
                    { type: 'strong', text: 'Based in ' },
                    { type: 'text', text: 'Germany' }
                  ]
                },
                { type: 'paragraph', text: 'Available for thoughtful collaborations.' }
              ],
              actions: [{ label: 'Contact', href: 'mailto:hello@example.com' }]
            }
          ]
        }
      ]
    },
    {
      type: 'panel',
      id: 'continue',
      title: 'More examples',
      headline: 'The same system, different pages',
      tone: 'standard',
      blocks: [
        {
          type: 'paragraph',
          text: 'Explore a narrow legal document and the catalog card sizes used by the layout system.'
        }
      ],
      actions: [
        { label: 'Legal example', href: '/examples/legal/' },
        { label: 'Catalog cards', href: '/examples/cards/' }
      ]
    }
  ]
};

// Representative website content structures, with fictional contact information.
export const legal: PageData = {
  title: 'Legal information',
  pageTitle: 'Legal example — Page Sections',
  bodyLayout: 'narrow',
  bodySpacing: 'loose',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Examples', href: '/examples/' },
    { label: 'Legal' }
  ],
  intro: 'An example of addresses, contact links, paragraphs and notes in a readable document.',
  sections: [
    {
      type: 'richText',
      id: 'publisher',
      title: 'Publisher',
      headline: 'Publisher',
      variant: 'content',
      blocks: [
        {
          type: 'address',
          name: 'Example Studio',
          lines: ['Sample Street 12', '12345 Example City', 'Germany']
        },
        {
          type: 'paragraph',
          text: [
            { type: 'strong', text: 'Email: ' },
            { type: 'link', text: 'hello@example.com', href: 'mailto:hello@example.com' }
          ]
        }
      ]
    },
    {
      type: 'richText',
      id: 'privacy',
      title: 'Privacy',
      headline: 'Information and contact',
      variant: 'content',
      blocks: [
        {
          type: 'paragraph',
          text: 'A document may need several paragraphs, emphasized phrases, ordinary links and a contact address. These remain structured data and render without application-specific section components.'
        },
        {
          type: 'paragraph',
          text: [
            { type: 'text', text: 'For questions about this example, use the ' },
            { type: 'link', text: 'contact address', href: 'mailto:hello@example.com' },
            { type: 'text', text: ' above.' }
          ]
        },
        {
          type: 'panel',
          title: 'Document note',
          tone: 'muted',
          blocks: [
            {
              type: 'paragraph',
              text: 'This page demonstrates content structure with fictional information.'
            }
          ]
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Identify the relevant document.',
            'Describe your question.',
            'Provide a way to reply.'
          ]
        }
      ]
    },
    {
      type: 'panel',
      id: 'related',
      title: 'Related pages',
      headline: 'Continue exploring',
      tone: 'standard',
      blocks: [
        {
          type: 'paragraph',
          text: 'Panels share the same typography, spacing and heading hierarchy as other sections.'
        }
      ],
      actions: [{ label: 'Back to the portfolio', href: '/examples/', variant: 'text' }]
    }
  ]
};

export const catalogItems: CardItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `object-${index % 6}`,
  itemKey: `occurrence-${index}`,
  title:
    index % 3 ? `Object ${index + 1}: a deliberately long collection title` : `Object ${index + 1}`,
  eyebrow: index % 2 ? undefined : 'Collection',
  href: '#catalog-m',
  image: index % 2 ? coast : landscape
}));

export const catalog: PageData = {
  title: 'Catalog geometry',
  pageTitle: 'Catalog example — Page Sections',
  intro:
    'Choose a media format without sacrificing text space. Cards within each collection share a height, including short titles and missing labels.',
  sections: [
    {
      type: 'grid',
      id: 'media-comparison',
      title: 'Media formats',
      headline: 'The same cards, two media formats',
      blocks: [
        ...(['3/2', '1/1'] as const).map((mediaAspect, index) => ({
          id: `format-${index}`,
          span: { xs: 4, s: 6, m: 4, l: 6 },
          sections: [
            {
              type: 'cardGrid' as const,
              id: index ? 'media-square' : 'media-landscape',
              title: index ? '1:1 media' : '3:2 media',
              headline: index ? '1:1 - more room for objects' : '3:2 - a compact overview',
              cardSize: 'm' as const,
              mediaAspect,
              list: catalogItems.slice(0, 6)
            }
          ]
        }))
      ]
    },
    ...(['s', 'm', 'l'] as const).map((cardSize) => ({
      type: 'cardGrid' as const,
      id: `catalog-${cardSize}`,
      title: `Size ${cardSize.toUpperCase()}`,
      headline: `Size ${cardSize.toUpperCase()}`,
      cardSize,
      list: catalogItems,
      background: { color: 'standard' as const }
    })),
    {
      type: 'carousel',
      id: 'catalog-carousel',
      title: 'Carousel',
      headline: 'The same card geometry in a carousel',
      cardSize: 'm',
      cardTone: 'muted',
      mediaAspect: '1/1',
      list: catalogItems,
      initialItemKey: 'occurrence-2'
    },
    {
      type: 'cardGrid',
      id: 'catalog-cover',
      title: 'Photo crop',
      headline: '4:3 photos with an edge-to-edge crop',
      cardSize: 'l',
      mediaAspect: '4/3',
      mediaFit: 'cover',
      list: catalogItems.slice(0, 6)
    },
    {
      type: 'grid',
      id: 'nested-catalog',
      title: 'Nested catalog',
      headline: 'A smaller container',
      blocks: [
        {
          id: 'small-container',
          span: { xs: 4, s: 6, m: 4, l: 6 },
          sections: [
            {
              type: 'cardGrid',
              id: 'nested-cards',
              title: 'Nested cards',
              cardSize: 'm',
              list: catalogItems.slice(0, 4)
            }
          ]
        }
      ]
    }
  ]
};
