<script lang="ts">
  import { PrimaryButton, SecondaryButton, IconButton, Chip } from '@page-sections/svelte/atoms';
  import { Popup } from '@page-sections/svelte/molecules';
  import { Header, FeatureSection, TimelineSection } from '@page-sections/svelte/organisms';
  import { PageShell } from '@page-sections/svelte/layouts';
  import { ContentPage, HeadingSection, CardGridSection, CarouselSection, CodeSection, Sections, type InlineText } from '@page-sections/svelte';
  import { resolveCardLayout, type CardItem, type CardMediaAspect, type CardContentPlacement, type CardTextTone, type SurfaceTone } from '@page-sections/core';
  const cards: CardItem[] = [{ id: 'one', title: 'Independent consumer', href: '#collection' }];
  const footer: InlineText = 'Footer';
  const mediaAspect: CardMediaAspect = '1/1';
  const contentPlacement: CardContentPlacement = 'overlay';
  const textTone: CardTextTone = 'light';
  const cardTone: SurfaceTone = 'muted';
  const layout = resolveCardLayout(320, 'm', { mediaAspect, contentPlacement, reserveEyebrow: true });
</script>
<ContentPage page={{ title: 'Plain Svelte consumer' }} showContentMenu>
  <HeadingSection section={{ id: 'page-title', title: 'Plain Svelte consumer', headingLevel: 1 }} />
  <CardGridSection section={{ id: 'collection', title: 'Collection' }} list={cards} {mediaAspect} {cardTone} {contentPlacement} {textTone} mediaFit="contain" />
  <CarouselSection section={{ id: 'browse', title: 'Browse', headline: 'Browse' }} list={cards} mediaAspect="4/3" mediaFit="cover" {contentPlacement} textTone="dark" />
  <FeatureSection section={{ id: 'features', title: 'Features' }} featureSize="l" iconTone="primary" list={[{ id: 'independent-feature', icon: 'layers', title: 'Independent feature', description: 'Centered without browser scripts.', href: '#collection' }]} />
  <output aria-label="Catalog card height">{layout.height}</output>
  <CodeSection section={{ id: 'source', title: 'Source', code: 'const independent = true;', language: 'typescript', lineNumbers: true }} />
  <TimelineSection section={{ id: 'history', title: 'History', headline: 'History', referenceDate: '2026', categories: [
    { id: 'project', title: 'Project', color: '#168d91', events: [
      { id: 'launch', title: 'Independent timeline', type: 'point', date: '2024-06', action: { label: 'Collection', href: '#collection' } },
      { id: 'maintenance', title: 'Maintenance', type: 'period', start: '2024-06' }
    ] }
  ] }} />
  <Sections sections={[{ type: 'panel', id: 'contact', title: 'Contact', headline: 'Contact', blocks: [
    { type: 'address', name: 'Independent studio', lines: ['Example City'] },
    { type: 'paragraph', text: [{ type: 'link', text: 'Email', href: 'mailto:hello@example.com' }] }
  ] }]} />
  <CardGridSection section={{ id: 'editorial', title: 'Editorial' }} itemSpan={{ xs: 4, s: 3, m: 4, l: 4 }} list={[{ id: 'story', title: 'A full story', description: 'Readable copy', footer, actions: [{ label: 'Read more', href: '#collection' }] }]} />
</ContentPage>

<PageShell><Header>{#snippet brand()}Atomic consumer{/snippet}</Header>
<Chip label="Example filter" selected />
  <PrimaryButton href="#collection">Primary</PrimaryButton><SecondaryButton>Secondary</SecondaryButton>
<IconButton label="Settings">?</IconButton><Popup inline title="Shared popup">Popup content</Popup></PageShell>
