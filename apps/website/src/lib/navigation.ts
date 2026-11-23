import { base } from '#lib/paths.js';
import type { MenuItem } from '@page-sections/core';
import { documents } from './catalog';
import { sectionCatalog } from './sectionCatalog';

const entry = (href: string, icon?: string): MenuItem => {
  const document = documents.find((item) => item.href === href)!;
  return { id: href, label: document.title, href: base + href, icon };
};
const groups = [
  ['Foundations', 'foundations', 'layers'],
  ['Page layout', 'page-layout', 'panels-top-left'],
  ['Design system', 'design-system', 'settings'],
  ['Components', 'components', 'blocks'],
  ['Advanced', 'advanced', 'settings'],
  ['Reference', 'reference', 'book']
];
export const navigationTree: MenuItem[] = [
  {
    id: 'start',
    icon: 'rocket',
    label: 'Getting Started',
    href: base + '/getting-started/'
  },
  {
    id: 'sections',
    icon: 'layout-template',
    label: 'Sections',
    href: base + '/sections/',
    children: sectionCatalog.map((item) => ({
      id: item.href,
      label: item.title,
      href: base + item.href,
      icon: item.icon
    }))
  },
  {
    id: 'docs',
    icon: 'book-text',
    label: 'Documentation',
    href: base + '/docs/',
    children: groups.map(([group, slug, icon]) => ({
      ...entry(`/docs/${slug}/`, icon),
      children: documents.filter((item) => item.group === group).map((item) => entry(item.href))
    }))
  },
  { id: 'about', label: 'About', href: base + '/about/', icon: 'info' }
];

const flatten = (items: MenuItem[]): MenuItem[] =>
  items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
// Learn the concepts before browsing the gallery, independently of header placement.
export const readingOrder = ['start', 'docs', 'sections'].flatMap((id) =>
  flatten(navigationTree.filter((item) => item.id === id))
);
export function readingNeighbors(pathname: string) {
  const index = readingOrder.findIndex((item) => item.href === pathname);
  return index < 0 ? {} : { previous: readingOrder[index - 1], next: readingOrder[index + 1] };
}
