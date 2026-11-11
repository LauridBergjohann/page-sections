import { base } from '$app/paths';
import type { MenuItem } from '@page-sections/core';
import { documents } from './catalog';

const entry = (href: string, icon?: string): MenuItem => {
  const document = documents.find((item) => item.href === href)!;
  return { id: href, label: document.title, href: base + href, icon };
};
const groups = [
  ['Foundations', 'foundations', 'layers'],
  ['Sections', 'sections', 'panels'],
  ['Building blocks', 'building-blocks', 'blocks'],
  ['Advanced', 'advanced', 'settings'],
  ['Reference', 'reference', 'book']
];
export const navigationTree: MenuItem[] = [
  {
    id: 'showcase',
    label: 'Showcase',
    href: base + '/showcase/',
    children: [
      {
        id: 'portfolio',
        label: 'Personal portfolio',
        href: base + '/showcase/portfolio/',
        icon: 'briefcase'
      },
      { id: 'legal', label: 'Legal page', href: base + '/showcase/legal/', icon: 'file' },
      {
        id: 'components',
        label: 'Component collection',
        href: base + '/showcase/components/',
        icon: 'blocks'
      },
      {
        id: 'backgrounds',
        label: 'Section surfaces',
        href: base + '/showcase/backgrounds/',
        icon: 'palette'
      },
      {
        id: 'integration',
        label: 'Application integration',
        href: base + '/showcase/integration/',
        icon: 'code'
      }
    ]
  },
  {
    id: 'start',
    label: 'Getting started',
    href: base + '/getting-started/',
    children: [
      entry('/getting-started/installation/', 'download'),
      entry('/getting-started/first-page/', 'file'),
      entry('/getting-started/pages-and-sections/', 'layers')
    ]
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: base + '/docs/',
    children: groups.map(([group, slug, icon]) => ({
      ...entry(`/docs/${slug}/`, icon),
      children: documents.filter((item) => item.group === group).map((item) => entry(item.href))
    }))
  }
];

const flatten = (items: MenuItem[]): MenuItem[] =>
  items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
export const readingOrder = flatten(navigationTree.slice(1));
export function readingNeighbors(pathname: string) {
  const index = readingOrder.findIndex((item) => item.href === pathname);
  return index < 0 ? {} : { previous: readingOrder[index - 1], next: readingOrder[index + 1] };
}
