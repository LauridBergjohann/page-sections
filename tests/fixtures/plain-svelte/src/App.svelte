<script lang="ts">
  import { ContentPage, CardGridSection, CarouselSection, Sections, type InlineText } from '@page-sections/svelte';
  import type { CardItem } from '@page-sections/core';
  const cards: CardItem[] = [{ id: 'one', title: 'Independent consumer', href: '#collection' }];
  const footer: InlineText = 'Footer';
</script>
<ContentPage page={{ title: 'Plain Svelte consumer' }} sectionNavigation>
  {#snippet header(page, titleId)}<header><h1 id={titleId}>{page.title}</h1></header>{/snippet}
  <CardGridSection section={{ id: 'collection', title: 'Collection' }} list={cards} />
  <CarouselSection section={{ id: 'browse', title: 'Browse' }} list={cards} />
  <Sections sections={[{ type: 'panel', id: 'contact', title: 'Contact', headline: 'Contact', blocks: [
    { type: 'address', name: 'Independent studio', lines: ['Example City'] },
    { type: 'paragraph', text: [{ type: 'link', text: 'Email', href: 'mailto:hello@example.com' }] }
  ] }]} />
  <CardGridSection section={{ id: 'editorial', title: 'Editorial' }} cardVariant="editorial" list={[{ id: 'story', title: 'A full story', description: 'Readable copy', footer, actions: [{ label: 'Read more', href: '#collection' }] }]} />
</ContentPage>
