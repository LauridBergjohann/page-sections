<script lang="ts">
  import { ContentPage, CardGridSection, CarouselSection } from '@page-sections/svelte';
  import type { CardItem } from '@page-sections/core';
  const cards: CardItem[] = [{ id: 'one', title: 'Independent consumer', href: '#collection' }];
</script>
<ContentPage page={{ title: 'Plain Svelte consumer' }} sectionNavigation>
  <CardGridSection section={{ id: 'collection', title: 'Collection' }} list={cards} />
  <CarouselSection section={{ id: 'browse', title: 'Browse' }} list={cards} />
</ContentPage>
