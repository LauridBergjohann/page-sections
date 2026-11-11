<script lang="ts">
  import { ContentPage, CardGridSection, CarouselSection, CodeSection, Sections, type InlineText } from '@page-sections/svelte';
  import { resolveCardLayout, type CardItem, type CardMediaAspect, type SurfaceTone } from '@page-sections/core';
  const cards: CardItem[] = [{ id: 'one', title: 'Independent consumer', href: '#collection' }];
  const footer: InlineText = 'Footer';
  const mediaAspect: CardMediaAspect = '1/1';
  const cardTone: SurfaceTone = 'muted';
  const layout = resolveCardLayout(320, 'm', { mediaAspect, reserveEyebrow: true });
</script>
<ContentPage page={{ title: 'Plain Svelte consumer' }} showContentMenu>
  {#snippet header(page, titleId)}<header><h1 id={titleId}>{page.title}</h1></header>{/snippet}
  <CardGridSection section={{ id: 'collection', title: 'Collection' }} list={cards} {mediaAspect} {cardTone} mediaFit="contain" />
  <CarouselSection section={{ id: 'browse', title: 'Browse' }} list={cards} mediaAspect="4/3" mediaFit="cover" />
  <output aria-label="Catalog card height">{layout.height}</output>
  <CodeSection section={{ id: 'source', title: 'Source', code: 'const independent = true;', language: 'typescript', lineNumbers: true }} />
  <Sections sections={[{ type: 'panel', id: 'contact', title: 'Contact', headline: 'Contact', blocks: [
    { type: 'address', name: 'Independent studio', lines: ['Example City'] },
    { type: 'paragraph', text: [{ type: 'link', text: 'Email', href: 'mailto:hello@example.com' }] }
  ] }]} />
  <CardGridSection section={{ id: 'editorial', title: 'Editorial' }} cardVariant="editorial" list={[{ id: 'story', title: 'A full story', description: 'Readable copy', footer, actions: [{ label: 'Read more', href: '#collection' }] }]} />
</ContentPage>
