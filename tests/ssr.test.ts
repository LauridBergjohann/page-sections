import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import App from './fixtures/plain-svelte/src/App.svelte';
import { Card, CarouselSection, RichTextSection, Navigation, Sections, ContentPage, HeroSection, Breadcrumbs, SidebarNavigation, Heading } from '../packages/svelte/src/index.js';
import PageHeaders from './PageHeaders.svelte';
import type { SectionData } from '@page-sections/core';
import CustomSection from './CustomSection.svelte';
import NestedSurfaces from './NestedSurfaces.svelte';
import ImplicitNestedSurfaces from './ImplicitNestedSurfaces.svelte';
import StructuredPage from './StructuredPage.svelte';
it('preserves heading alignment through every serialized section renderer except Hero', () => {
  const shared = { id: 'aligned', title: 'Section', headline: 'Aligned heading', introduction: 'Introduction', headingAlign: 'right' as const };
  const sections: SectionData[] = [
    { ...shared, type: 'heading' }, { ...shared, type: 'richText', body: 'Body' },
    { ...shared, type: 'panel', blocks: [] }, { ...shared, type: 'code', code: 'const x = 1;' },
    { ...shared, type: 'image', image: { src: '/image.svg', alt: 'Image' } },
    { ...shared, type: 'video', video: { provider: 'html5', src: '/video.webm' } },
    { ...shared, type: 'features', list: [] }, { ...shared, type: 'cardGrid', list: [] },
    { ...shared, type: 'carousel', list: [] }, { ...shared, type: 'grid', blocks: [] },
    { ...shared, type: 'timeline', categories: [], referenceDate: '2026-01-01' },
    { ...shared, type: 'hero' }
  ];
  for (const section of sections) {
    const { body } = render(Sections, { props: { sections: JSON.parse(JSON.stringify([section])) } });
    expect(body).toContain(`data-align="${section.type === 'hero' ? 'left' : 'right'}"`);
    expect(body).toContain('Aligned heading');
    expect(body).toContain('Introduction');
  }
});
it.each(['cardGrid', 'carousel'] as const)('forwards optional shadows and descriptions through %s data', (type) => {
  for (const cardShadow of [undefined, false, true]) {
    const sections: SectionData[] = [{ type, id: 'cards', title: 'Cards', cardShadow, list: [{ id: 'one', title: 'One', description: 'Optional copy' }] }];
    const { body } = render(Sections, { props: { sections } });
    expect(body).toContain(`data-shadow="${cardShadow ?? false}"`);
    expect(body).toContain('Optional copy');
  }
});
it('renders a native primary card link alongside independent actions and footer links', () => {
  const { body } = render(Card, { props: { item: { id: 'one', title: 'One', href: '/story/', description: 'The story', actions: [{ label: 'Contact', href: '/contact/' }], footer: [{ type: 'link', text: 'Author', href: '/author/' }] } } });
  expect(body).toContain('<article');
  expect(body).toMatch(/class="primary-link[^>]*href="\/story\/"/);
  for (const href of ['/story/', '/contact/', '/author/']) expect(body).toContain(`href="${href}"`);
  expect(body).not.toMatch(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/);
  const { body: unsafe } = render(Card, { props: { item: { id: 'two', title: 'Two', href: 'javascript:alert(1)' } } });
  expect(unsafe).not.toContain('<a ');
  expect(unsafe).not.toContain('class="description');
});
it.each(['cardGrid', 'carousel'] as const)('forwards %s surface tone from serialized data', (type) => {
  for (const tone of [undefined, 'standard', 'muted'] as const) {
    const sections: SectionData[] = JSON.parse(JSON.stringify([{ type, id: 'cards', title: 'Cards', cardTone: tone, list: [{ id: 'one', title: 'One' }] }]));
    expect(render(Sections, { props: { sections } }).body).toContain(`data-tone="${tone ?? 'standard'}"`);
  }
});
it.each([undefined, 'standard', 'muted'] as const)('preserves panel surface tone %s', (tone) => {
  const sections: SectionData[] = [{ type: 'panel', id: 'panel', title: 'Panel', tone, blocks: [{ type: 'panel', tone, blocks: [] }] }];
  const { body } = render(Sections, { props: { sections } });
  expect(body.match(new RegExp(`data-tone="${tone ?? 'muted'}"`, 'g'))).toHaveLength(2);
});
it('keeps page metadata separate from visible content', () => {
  const { body, head } = render(ContentPage, { props: { page: { title: 'Page heading', pageTitle: 'Browser title' } } });
  expect(body).not.toContain('<h1');
  expect(body).toContain('aria-label="Page heading"');
  expect(head).toContain('<title>Browser title</title>');
});
it('omits empty content menus and Home-only breadcrumbs on the server', () => {
  expect(render(ContentPage, { props: { page: { title: 'Empty' }, showContentMenu: true } }).body).not.toContain('class="ps-content-menu-slot');
  for (const items of [[], [{ label: 'Home', href: '/' }]]) {
    expect(render(Breadcrumbs, { props: { items } }).body).not.toContain('<nav');
  }
});
it('adds an icon-only Home link to even a single-page breadcrumb', () => {
  const { body } = render(Breadcrumbs, { props: { items: [{ label: 'Docs', href: '/docs/' }] } });
  expect(body).toContain('href="/" aria-label="Home"');
  expect(body).toContain('<svg');
  expect(body).not.toContain('>Home<');
  expect(body).toMatch(/aria-current="page"[^>]*>Docs<\/span>/);
  expect(body).not.toContain('href="/docs/"');
});
it('reuses an existing Home entry and supports a localized site root through ContentPage', () => {
  const { body } = render(ContentPage, { props: {
    page: { title: 'Docs', breadcrumbs: [{ label: 'Start', href: '/app' }, { label: 'Docs' }] },
    breadcrumbHomeHref: '/app/', breadcrumbHomeLabel: 'Startseite'
  } });
  expect(body.match(/<li\b/g)).toHaveLength(2);
  expect(body).toContain('href="/app/" aria-label="Startseite"');
  expect(body).not.toContain('>Start<');
  expect(render(Breadcrumbs, { props: { items: [{ label: 'Docs' }], homeHref: 'javascript:alert(1)' } }).body).not.toContain('javascript:');
});
it('decouples heading size from semantics and renders heading sections from JSON', () => {
  for (const level of [1, 2, 3] as const) for (const size of ['m', 'l', 'xl'] as const) {
    const { body } = render(Heading, { props: { text: 'A heading', level, size } });
    expect(body).toContain(`<h${level}`);
    expect(body).toContain(`data-size="${size}"`);
  }
  const sections: SectionData[] = JSON.parse(JSON.stringify([{ type: 'heading', id: 'chapter', title: 'Chapter', headingSize: 'xl', headingLevel: 3, background: { color: 'muted', size: 'standard' } }]));
  const { body } = render(Sections, { props: { sections } });
  expect(body).toMatch(/<h3[^>]*id="chapter-title"/);
  expect(body).toContain('data-background-color="muted"');
});
it('composes a heading section directly in the page body without adding it to the content menu', () => {
  const { body } = render(PageHeaders, { props: { custom: true } });
  expect(body.match(/<h1\b/g)).toHaveLength(1);
  expect(body).toContain('data-background-size="full"');
  expect(body).toContain('data-size="m"');
  expect(body).not.toContain('href="#custom"');
  expect(body).not.toContain('href="#deep"');
  expect(body).not.toContain('href="#unheaded"');
  expect(body).toContain('href="#nested"');
  expect(body).toContain('data-heading-level="3"');
  expect(body).toContain('href="#details"');
});
it('renders breadcrumbs without creating visible title content', () => {
  const { body } = render(ContentPage, { props: { page: { title: 'Hero page',
    breadcrumbs: [{ label: 'Docs', href: '/docs/' }, { label: 'Hero page' }]
  } } });
  expect(body.match(/aria-label="Breadcrumb"/g)).toHaveLength(1);
  expect(body).not.toContain('<h1');
});
it('opens the active sidebar branch during SSR and retains real parent links', () => {
  const { body } = render(SidebarNavigation, { props: { activeId: 'hero', items: [
    { id: 'sections', label: 'Sections', href: '/sections/', children: [
      { id: 'hero', label: 'Hero', href: '/hero/' }
    ] }
  ] } });
  expect(body).toMatch(/<details[^>]*open/);
  expect(body).toContain('href="/sections/"');
  expect(body).toMatch(/href="\/hero\/"[^>]*aria-current="page"/);
});
it('lets the hero own the h1 while the host owns SEO and main attributes', () => {
  const { body, head } = render(PageHeaders);
  expect(body.match(/<h1\b/g)).toHaveLength(1);
  expect(body.replace(/<!--.*?-->/g, '')).toMatch(/<h1[^>]*id="welcome-title"[^>]*>Hello from the hero<\/h1>/);
  expect(body).toContain('aria-labelledby="welcome-title"');
  expect(body).toContain('id="content" lang="de"');
  expect(body).toContain('href="#details"');
  expect(head.match(/<title>/g)).toHaveLength(1);
  expect(head).toContain('Host SEO title');
});
it('connects a custom page header to the main landmark', () => {
  const { body } = render(PageHeaders, { props: { custom: true } });
  const label = body.match(/<main[^>]*aria-labelledby="([^"]+)"/)?.[1];
  expect(label).toBeTruthy();
  expect(body.replace(/<!--.*?-->/g, '')).toMatch(new RegExp(`<h1[^>]*id="${label}"[^>]*>Custom page header</h1>`));
  expect(body.match(/<h1\b/g)).toHaveLength(1);
  expect(body).toContain('href="#details"');
});
it('labels a headerless main without a dangling heading reference', () => {
  const { body } = render(ContentPage, { props: { page: { title: 'Accessible page' } } });
  expect(body).toContain('aria-label="Accessible page"');
  expect(body).not.toContain('aria-labelledby=');
  expect(body).not.toContain('<h1');
});
it.each([undefined, 1, 2, 3] as const)('renders hero heading level %s', (headingLevel) => {
  const { body } = render(HeroSection, { props: { section: { id: 'hero', title: 'Hero', headingLevel } } });
  expect(body).toMatch(new RegExp(`<h${headingLevel ?? 2}[^>]*id="hero-title"`));
});
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
it('does not require a page or stage to render the compatibility header', () => { expect(render(Navigation).body).toContain('<header'); });
it('supports custom renderers without serializing component functions', () => {
  const section = JSON.parse(JSON.stringify({ type: 'quote', id: 'quote', title: 'Quote', quote: 'A custom section.' })) as SectionData;
  const { body } = render(Sections, { props: { sections: [section], renderers: { quote: CustomSection } } });
  expect(body).toContain('<blockquote>A custom section.</blockquote>');
  expect(() => render(Sections, { props: { sections: [section] } }).body).toThrow(/No renderer/);
});
it('isolates nested surface groups even when their local numeric ids match', () => {
  const { body } = render(NestedSurfaces);
  const scopes = [...new Set([...body.matchAll(/data-ps-surface-owner="([^"]+)"/g)].map(match => match[1]))];
  expect(scopes).toHaveLength(2);
  for (const scope of scopes) expect(body).toContain(`[data-ps-surface-owner="${scope}"][data-ps-section-surface="0"]`);
});
it('keeps nested transparent examples from splitting their parent surface run during SSR', () => {
  const { body } = render(ImplicitNestedSurfaces);
  const surface = (id: string) => {
    const tag = body.match(new RegExp(`<section[^>]*id="${id}"[^>]*>`))![0];
    const owner = tag.match(/data-ps-surface-owner="([^"]+)"/)![1];
    const surfaceId = tag.match(/data-ps-section-surface="([^"]+)"/)![1];
    const selector = `[data-ps-surface-owner="${owner}"][data-ps-section-surface="${surfaceId}"]`;
    return { owner, rules: body.slice(body.indexOf('@media (min-width:1600px)')).split(selector).pop()!.split('}')[0] };
  };
  const heading = surface('heading');
  expect(heading.rules).toContain('--ps-section-top-radius:var(--ps-radius)');
  expect(heading.rules).toContain('--ps-section-bottom-radius:0px');
  for (const id of ['first', 'middle', 'last']) {
    const parent = surface(id);
    expect(parent.owner).toBe(heading.owner);
    expect(surface(`${id}-example`).owner).not.toBe(parent.owner);
    expect(parent.rules).toContain('--ps-section-top-radius:0px');
    expect(parent.rules).toContain(`--ps-section-bottom-radius:${id === 'last' ? 'var(--ps-radius)' : '0px'}`);
  }
});
it('renders a complete portfolio from data, with one hero h1 and nested heading levels', () => {
  const { body } = render(StructuredPage);
  expect(body.match(/<h1\b/g)).toHaveLength(1);
  expect(body).toContain('aria-labelledby="welcome-title"');
  expect(body).toMatch(/<h2[^>]*id="about-title"/);
  expect(body).toMatch(/<h3[^>]*id="approach-title"/);
  expect(body).toMatch(/<h3[^>]*id="profile-title"/);
  expect(body).toContain('Interaction design');
  expect(body).toContain('mailto:hello@example.com');
  expect(body).toContain('class="description');
});
it('renders legal document structures without a custom renderer', () => {
  const { body } = render(StructuredPage, { props: { kind: 'legal' } });
  expect(body).toContain('data-body-layout="narrow"');
  expect(body).toContain('<address');
  expect(body).toContain('Sample Street 12');
  expect(body).toMatch(/<h3[^>]*>Document note/);
  expect(body).toContain('<ol');
});
it('passes detail context through normalization and surface corner rules', () => {
  const { body } = render(StructuredPage, { props: { kind: 'detail' } });
  expect(body).toContain('data-background-size="standard"');
  expect(body).not.toContain('linear-gradient');
  expect(body).toContain('@media (min-width:2300px)');
});
it('escapes structured inline content and rejects unsafe action and inline links', () => {
  const { body } = render(Sections, { props: { sections: [{ type: 'panel', id: 'safe', title: 'Safe', blocks: [
    { type: 'paragraph', text: [{ type: 'strong', text: '<script>bad()</script>' }, { type: 'link', text: 'Unsafe', href: 'javascript:alert(1)' }] }
  ], actions: [{ label: 'Unsafe action', href: 'javascript:alert(1)' }] }] } });
  expect(body).not.toContain('<script>');
  expect(body).not.toContain('href="javascript:');
  expect(body).toContain('&lt;script');
});

it('renders feature data with native links and inherited headings before hydration', () => {
  const sections: SectionData[] = [{ type: 'features', id: 'benefits', title: 'Benefits', headline: 'Benefits', featureSize: 'l', iconTone: 'primary', list: [
    { id: 'linked', icon: 'laptop', title: 'Linked feature', description: 'Selectable copy', href: '/guide/' },
    { id: 'unsafe', icon: 'unknown', title: 'Plain feature', description: 'Still readable', href: 'javascript:alert(1)' }
  ] }];
  const { body } = render(Sections, { props: { sections } });
  expect(body).toContain('href="/guide/"');
  expect(body).not.toContain('javascript:');
  expect(body).toContain('data-icon-tone="primary"');
  expect(body).toContain('data-ps-card-size="l"');
  expect(body).toMatch(/<h3[^>]*>Linked feature/);
  expect(body.match(/<svg /g)).toHaveLength(2);
});
