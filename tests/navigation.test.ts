import { describe, expect, it } from 'vitest';
import {
  resolveNavigation,
  resolveActiveContentSection,
  resolveContentPageLayout,
  resolvePageLayout,
  type MenuItem
} from '../packages/core/src/index.js';
const tree: MenuItem[] = [
  {
    id: 'docs',
    label: 'Docs',
    href: '/base/docs/',
    children: [
      {
        id: 'sections',
        label: 'Sections',
        href: '/base/docs/sections/',
        children: [{ id: 'hero', label: 'Hero', href: '/base/docs/hero/' }]
      }
    ]
  }
];
it('derives actual ancestry even when URL segments differ, without mutating the tree', () => {
  const result = resolveNavigation(tree, { pathname: '/base/docs/hero/?mode=dark#intro' });
  expect(result.activeId).toBe('hero');
  expect(result.breadcrumbs.map((item) => item.label)).toEqual(['Docs', 'Sections', 'Hero']);
  expect(result.items[0].active).toBe(true);
  expect(result.items[0].current).toBe(false);
  expect(result.sidebarItems[0].children![0].current).toBe(true);
  expect(tree[0].active).toBeUndefined();
});
it('handles route boundaries, explicit IDs and unknown routes', () => {
  expect(resolveNavigation(tree, { pathname: '/base/docsmith/' }).breadcrumbs).toEqual([]);
  expect(resolveNavigation(tree, { pathname: '/' }).sidebarItems).toEqual([]);
  expect(resolveNavigation(tree, { pathname: '/base/docs/hero/detail' }).activeId).toBe('hero');
  expect(resolveNavigation(tree, { pathname: '/other', currentId: 'sections' }).activeId).toBe(
    'sections'
  );
  expect(() => resolveNavigation([...tree, tree[0]], {})).toThrow(/Duplicate/);
});
describe('sidebar geometry', () => {
  for (const width of [320, 1599, 1600, 1808, 1809, 2299, 2300, 3000]) {
    for (const leftSidebar of [false, true])
      for (const showContentMenu of [false, true]) {
        it(`${width}px, left ${leftSidebar}, right ${showContentMenu}`, () => {
          const input = { width, height: 900, leftSidebar, showContentMenu };
          const result = resolveContentPageLayout(input);
          expect(result.content.width).toBeLessThanOrEqual(1536);
          expect(result.menu).toEqual(resolvePageLayout(input).menu);
          expect(!!result.leftSidebar).toBe(width >= 1600 && leftSidebar);
          expect(!!result.contentMenu).toBe(width >= 1600 && showContentMenu);
          if (width < 1600 || width >= 2300 || leftSidebar === showContentMenu) {
            expect(result.content.x).toBe((width - result.content.width) / 2);
          }
          if (result.leftSidebar)
            expect(result.leftSidebar.x + result.leftSidebar.width + 24).toBe(result.content.x);
          if (result.contentMenu)
            expect(result.contentMenu.x).toBe(result.content.x + result.content.width);
        });
      }
  }
  it('matches the XL drawing and includes reserved scrollbar and safe-area widths', () => {
    expect(
      resolveContentPageLayout({ width: 1600, height: 900, leftSidebar: true }).content
    ).toEqual({ x: 272, width: 1192 });
    const result = resolveContentPageLayout({
      width: 1920,
      height: 900,
      scrollbarWidth: 15,
      safeArea: { left: 10, right: 20 },
      leftSidebar: true,
      showContentMenu: true
    });
    expect(result.leftSidebar!.x).toBe(38);
    expect(result.contentMenu!.x + result.contentMenu!.width).toBe(1920 - 15 - 20 - 28);
  });
});
it('tracks the reading line and selects a short final section at the real document end', () => {
  const sections = [
    { id: 'intro', top: -300, bottom: 150 },
    { id: 'body', top: 150, bottom: 1000 },
    { id: 'end', top: 850, bottom: 900 }
  ];
  expect(resolveActiveContentSection(sections, 16, 900, 500, 1000)).toBe('body');
  expect(resolveActiveContentSection(sections, 16, 900, 1000, 1000)).toBe('end');
  expect(resolveActiveContentSection([], 16, 900, 0, 0)).toBeUndefined();
});
