import type { Breadcrumb, MenuItem } from './types.js';

/** A site tree starts at the main-menu entries. Home belongs to the brand link. */
export interface NavigationLocation {
  pathname?: string;
  currentId?: string;
}
const path = (href: string) => href.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

/** Router-independent selection; explicit IDs also support detail routes outside the tree. */
export function resolveNavigation(tree: readonly MenuItem[], location: NavigationLocation) {
  let trail: MenuItem[] = [];
  let bestLength = -1;
  const ids = new Set<string>();
  const currentPath = path(location.pathname ?? '');
  function visit(items: readonly MenuItem[], ancestors: MenuItem[]) {
    for (const item of items) {
      if (!item.id || ids.has(item.id))
        throw new Error(`Duplicate or empty navigation id: ${item.id}`);
      if (!item.href) throw new Error(`Navigation entry ${item.id} requires a page URL.`);
      ids.add(item.id);
      const next = [...ancestors, item];
      const href = path(item.href);
      const matches = location.currentId
        ? item.id === location.currentId
        : Boolean(
            location.pathname &&
            !/^[a-z]+:/i.test(item.href) &&
            (currentPath === href || (href !== '/' && currentPath.startsWith(href + '/')))
          );
      if (matches && (location.currentId || href.length > bestLength)) {
        trail = next;
        bestLength = href.length;
      }
      visit(item.children ?? [], next);
    }
  }
  visit(tree, []);
  const activeId = trail.at(-1)?.id;
  const ancestors = new Set(trail.map((item) => item.id));
  const mark = (items: readonly MenuItem[]): MenuItem[] =>
    items.map((item) => ({
      ...item,
      current: item.id === activeId,
      active: ancestors.has(item.id),
      ...(item.children ? { children: mark(item.children) } : {})
    }));
  const items = mark(tree);
  const root = items.find((item) => item.id === trail[0]?.id);
  const breadcrumbs: Breadcrumb[] = trail.map((item) => ({ label: item.label, href: item.href }));
  return { items, activeId, root, sidebarItems: root?.children ?? [], breadcrumbs };
}

export interface ContentSectionBounds {
  id: string;
  top: number;
  bottom: number;
}
/** Shared reading-position calculation, usable with window or a Spatial viewport. */
export function resolveActiveContentSection(
  sections: readonly ContentSectionBounds[],
  readingTop: number,
  readingBottom: number,
  scrollY: number,
  maxScrollY: number
): string | undefined {
  let active = sections[0]?.id;
  const activationLine = readingTop + Math.max(0, readingBottom - readingTop) * 0.25;
  for (const section of sections) if (section.top <= activationLine + 1) active = section.id;
  const last = sections.at(-1);
  if (
    last &&
    maxScrollY > 1 &&
    scrollY >= maxScrollY - 1 &&
    last.top < readingBottom &&
    last.bottom > readingTop
  )
    active = last.id;
  return active;
}
