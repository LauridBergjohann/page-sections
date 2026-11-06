import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import App from './fixtures/plain-svelte/src/App.svelte';
import { CarouselSection, RichTextSection, Navigation, Sections } from '../packages/svelte/src/index.js';
import type { SectionData } from '@page-sections/core';
import CustomSection from './CustomSection.svelte';
import NestedSurfaces from './NestedSurfaces.svelte';
it('renders native links and generated navigation without a SvelteKit host', () => {
  const { body, head } = render(App);
  expect(head).toContain('Plain Svelte consumer');
  expect(body).toContain('aria-label="On this page"');
  expect(body).toContain('href="#browse"');
  expect(body).toContain('data-ps-section="collection"');
  expect(body).toContain('Independent consumer');
  expect(body).not.toContain('<canvas');
});
it('renders a standalone carousel once without JavaScript-only controls', () => {
  const { body } = render(CarouselSection, { props: { section: { id: 'cards', title: 'Cards' }, list: [{ id: 'one', title: 'One', href: '/one' }] } });
  expect(body.match(/href="\/one"/g)).toHaveLength(1);
  expect(body).toContain('tabindex="0"');
  expect(body).not.toContain('<button');
});
it('escapes raw HTML and unsafe markdown links', () => {
  const { body } = render(RichTextSection, { props: { section: { id: 'text', title: 'Text', body: '<script>alert(1)</script>\n\n[x](javascript:alert(1))' } } });
  expect(body).not.toContain('<script>'); expect(body).not.toContain('href="javascript:');
});
it('does not require a page or stage to render navigation', () => { expect(render(Navigation).body).toContain('Main navigation'); });
it('supports custom renderers without serializing component functions', () => {
  const section = JSON.parse(JSON.stringify({ type: 'quote', id: 'quote', title: 'Quote', quote: 'A custom section.' })) as SectionData;
  const { body } = render(Sections, { props: { sections: [section], renderers: { quote: CustomSection } } });
  expect(body).toContain('<blockquote>A custom section.</blockquote>');
  expect(() => render(Sections, { props: { sections: [section] } }).body).toThrow(/No renderer/);
});
it('isolates nested surface groups even when their local numeric ids match', () => {
  const { body } = render(NestedSurfaces);
  const scopes = [...body.matchAll(/data-ps-section-group="([^"]+)"/g)].map(match => match[1]);
  expect(new Set(scopes).size).toBe(2);
  for (const scope of scopes) expect(body).toContain(`[data-ps-surface-owner="${scope}"][data-ps-section-surface="0"]`);
});
