import type { CardItem, ImageData, PageData } from '@page-sections/core';

export const landscape: ImageData = { src: '/landscape.svg', alt: 'Layers of green mountains beneath a pale sky', width: 1200, height: 750, aspect: '16/9' };
export const coast: ImageData = { src: '/coast.svg', alt: 'Warm sandstone cliffs meeting a blue sea', width: 1200, height: 750, aspect: '4/3' };
export const cards: CardItem[] = [
  { id: 'compose', title: 'Compose a page', description: 'Give each story a place with reusable sections.', href: '#hero', image: landscape, size: 'l' },
  { id: 'rhythm', title: 'Find a rhythm', description: 'Let content respond to the space available.', href: '#layout', image: coast },
  { id: 'surface', title: 'Set the atmosphere', description: 'Connect sections through surfaces and gradients.', href: '/backgrounds/', image: landscape },
  { id: 'data', title: 'Let the data lead', description: 'Render serializable content with the same components.', href: '#data', image: coast },
  { id: 'native', title: 'Start with HTML', description: 'Keep content and links available before hydration.', href: '#carousel', image: landscape }
];

// Plain serializable data, independent of Svelte components and routing state.
export const editorial: PageData = {
  title: 'A field guide',
  sections: [
    { type: 'richText', id: 'data-story', title: 'A story from data', headline: 'A field guide to slower days', body: 'A small collection can start with **plain data**. These sections are rendered by `Sections`, using the same components as the examples above.', background: { color: 'standard' } },
    { type: 'image', id: 'data-image', title: 'An image from data', headline: 'Along the coastline', image: coast, imageSide: 'right', description: 'An image, a description and a layout preference. No component imports belong in this content model.', background: { color: 'standard' } }
  ]
};
