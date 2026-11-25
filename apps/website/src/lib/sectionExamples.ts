import { timelineExampleFor } from './timelineExample.js';
import { base } from '#lib/paths.js';
import type { SectionData } from '@page-sections/core';
import { sectionCards } from './sectionCatalog';

export function sectionExample(slug: string): SectionData {
  const shared = {
    id: `${slug}-example`,
    title: 'A new perspective',
    headingLevel: 3 as const,
    background: { color: 'transparent' as const },
    spacing: 'tight' as const
  };
  const image = {
    src: base + '/landscape.svg',
    alt: 'Layers of green hills beneath a pale sky',
    aspect: '16/9' as const
  };
  const actions = [
    { label: 'Explore the details', href: base + `/sections/${slug}/`, variant: 'primary' as const }
  ];
  switch (slug) {
    case 'timeline':
      return {
        ...timelineExampleFor(base, shared.id, true),
        ...shared,
        title: 'Timeline',
        headline: undefined
      };
    case 'card-grid':
      return {
        ...shared,
        type: 'cardGrid',
        list: sectionCards.slice(0, 3),
        cardSize: 'm',
        cardTone: 'muted'
      };
    case 'carousel':
      return {
        ...shared,
        type: 'carousel',
        list: sectionCards.slice(3, 8),
        cardSize: 'm',
        cardTone: 'muted',
        controls: true
      };
    case 'code':
      return {
        ...shared,
        type: 'code',
        language: 'svelte',
        code: '<HeadingSection section={{\n  id: "hello", title: "Hello, Page Sections",\n  headingLevel: 1\n}} />',
        filename: '+page.svelte',
        lineNumbers: true
      };
    case 'headings':
      return {
        ...shared,
        type: 'heading',
        eyebrow: 'A chapter begins',
        introduction:
          'Give your story a clear hierarchy, with an optional eyebrow and introduction.',
        headingSize: 'l'
      };
    case 'hero':
      return {
        ...shared,
        type: 'hero',
        introduction: 'An opening that brings your image, story and next step together.',
        image,
        composition: 'artwork',
        size: 's',
        actions
      };
    case 'image':
      return {
        ...shared,
        type: 'image',
        image,
        description: 'A responsive image with space for a caption or a longer explanation.'
      };
    case 'panel':
      return {
        ...shared,
        type: 'panel',
        tone: 'muted',
        blocks: [
          {
            type: 'paragraph',
            text: 'Group related information on a distinct surface. Add an action when the reader needs a next step.'
          }
        ],
        actions
      };
    case 'rich-text':
      return {
        ...shared,
        type: 'richText',
        format: 'markdown',
        body:
          '### Give your ideas room\n\nCombine **emphasis**, [useful links](' +
          base +
          '/sections/rich-text/) and a clear reading flow.\n\n- Write Markdown or plain text\n- Compose structured blocks\n- Keep the content responsive'
      };
    case 'video':
      return {
        ...shared,
        type: 'video',
        video: {
          src: base + '/media/sections-demo.webm',
          provider: 'html5',
          poster: base + '/illustrations/video.svg',
          captions: [
            {
              src: base + '/media/sections-demo.vtt',
              language: 'en',
              label: 'English descriptions'
            }
          ]
        },
        description: 'A silent local animation with native playback controls and optional captions.'
      };
    default:
      throw new Error(`Unknown section: ${slug}`);
  }
}
