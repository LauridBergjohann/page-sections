import { base } from '#lib/paths.js';
import type { FeatureItem } from '@page-sections/core';

export const featureExample: FeatureItem[] = [
  {
    id: 'responsive',
    icon: 'laptop',
    title: 'One responsive system',
    description: 'Shared widths, spacing and grids that adapt to their containers.',
    href: base + '/docs/design-system/responsive-layout/'
  },
  {
    id: 'sections',
    icon: 'layers',
    title: 'Composable sections',
    description: 'Combine content blocks into pages that feel consistent.',
    href: base + '/sections/'
  },
  {
    id: 'content',
    icon: 'database',
    title: 'Your content, your source',
    description: 'Use Svelte, HTML, structured data or your own CMS.',
    href: base + '/docs/advanced/data-and-custom-sections/'
  },
  {
    id: 'html',
    icon: 'file-code',
    title: 'Content before JavaScript',
    description: 'Deliver readable HTML with SSR or prerendering.',
    href: base + '/docs/foundations/first-page/'
  },
  {
    id: 'theme',
    icon: 'palette',
    title: 'Made for your brand',
    description: 'Shape colors, surfaces and typography with shared theme tokens.',
    href: base + '/docs/foundations/themes/'
  },
  {
    id: 'app',
    icon: 'puzzle',
    title: 'Bring your own app',
    description: 'Use Svelte or SvelteKit with your preferred tools.',
    href: base + '/docs/foundations/installation/'
  }
];
