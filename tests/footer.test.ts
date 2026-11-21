import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Footer } from '../packages/svelte/src/index.js';
import { themeStyle, type FooterMenuGroup } from '@page-sections/core';
import FooterExample from './FooterExample.svelte';

it('renders only the bottom bar when optional regions are missing or empty', () => {
  for (const optional of [{}, { social: [], menu: [] }]) {
    const { body } = render(Footer, { props: { ...optional, footnote: '© Example', links: [{ label: 'Privacy', href: '/privacy/' }] } });
    expect(body).toContain('<footer');
    expect(body).toContain('© Example');
    expect(body).toContain('href="/privacy/"');
    expect(body).not.toContain('class="ps-footer-main');
    expect(body).not.toContain('aria-label="Social media"');
  }
});

it('renders five regions, optional heading links, icon snippets and safe URLs on the server', () => {
  const { body } = render(FooterExample, { props: { groups: [
    { label: 'Product', href: '/product/', links: [{ label: 'Guide', href: '/guide/' }] },
    { label: 'Resources', links: [{ label: 'Docs', href: '/docs/' }] },
    { label: 'Unsafe group', href: 'javascript:alert(1)', links: [] }
  ] } });
  for (const href of ['/', '/community/', '/product/', '/guide/', '/docs/', '/privacy/', '/about/']) expect(body).toContain(`href="${href}"`);
  expect(body).toContain('<svg');
  expect(body).toContain('aria-hidden="true"');
  expect(body).toContain('Resources');
  expect(body).not.toContain('href="javascript:');
  expect(body).toContain('--ps-footer-shadow:none');
  expect(body).toMatch(/<a[^>]*href="\/community\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  expect(body).toMatch(/<a(?=[^>]*href="\/privacy\/")(?![^>]*target=)[^>]*>/);
});

it('accepts four groups and rejects a fifth instead of dropping content', () => {
  const groups: FooterMenuGroup[] = Array.from({ length: 4 }, (_, i) => ({ label: `Group ${i}`, links: [] }));
  expect(render(FooterExample, { props: { groups, identity: false } }).body).toContain('Group 3');
  expect(() => render(FooterExample, { props: { groups: [...groups, groups[0]] } }).body).toThrow('at most four');
});

it('maps and validates all six footer theme settings', () => {
  expect(themeStyle({ footerBackground: '#123', footerInk: '#fff', footerRadius: '12px', footerShadow: 'none', footerBarBackground: '#ddd', footerBarInk: '#333' })).toBe('--ps-footer-background:#123;--ps-footer-ink:#fff;--ps-footer-radius:12px;--ps-footer-shadow:none;--ps-footer-bar-background:#ddd;--ps-footer-bar-ink:#333');
  expect(() => themeStyle({ footerBackground: 'red;color:black' })).toThrow('Invalid theme property');
});
