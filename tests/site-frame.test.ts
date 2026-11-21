import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Header, Navigation } from '../packages/svelte/src/index.js';
import SiteFrame from './SiteFrame.svelte';

it('keeps Navigation as the same component export as Header', () => {
  expect(Navigation).toBe(Header);
});

it('owns header/main/footer landmarks and keeps ancillary header content outside navigation', () => {
  const { body } = render(SiteFrame);
  expect(body.match(/<header\b/g)).toHaveLength(1);
  expect(body.match(/<main\b/g)).toHaveLength(1);
  expect(body.match(/<footer\b/g)).toHaveLength(1);
  expect(body).toMatch(/<header[^>]*id="site-header"[^>]*aria-label="Site header"[^>]*class="[^"]*custom-header/);
  const navigation = [...body.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)].filter(match => match[0].includes('Main navigation'));
  expect(navigation).toHaveLength(2); // CSS exposes only the viewport's menu.
  for (const [markup] of navigation) {
    expect(markup).toContain('href="/docs/"');
    expect(markup).not.toContain('Site brand');
    expect(markup).not.toContain('Search site');
    expect(markup).not.toContain('Appearance');
  }
  expect(body.indexOf('</header>')).toBeLessThan(body.indexOf('<main'));
  expect(body.indexOf('</main>')).toBeLessThan(body.indexOf('<footer'));
  const main = body.match(/<main\b[\s\S]*?<\/main>/)![0];
  expect(main).toContain('Next chapter');
  expect(main).toContain('<aside');
  expect(main).not.toContain('Legacy page ending');
  expect(main).not.toContain('Site copyright');
});

it('renders the legacy page ending only when pageEnd is absent', () => {
  const { body } = render(SiteFrame, { props: { legacy: true } });
  expect(body).toContain('Legacy page ending');
  expect(body).not.toContain('Next chapter');
});
