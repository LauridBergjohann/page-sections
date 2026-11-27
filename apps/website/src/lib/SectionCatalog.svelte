<script lang="ts">
  import { CardGridSection } from '@page-sections/svelte';
  import { sectionCards } from './sectionCatalog';
  let { heading = false }: { heading?: boolean } = $props();
</script>

<CardGridSection
  section={{
    id: 'section-catalog',
    title: 'All sections',
    headline: heading ? 'Ready-made sections' : undefined,
    introduction: heading
      ? 'Start with one of these complete sections, or use the base Section below to compose your own.'
      : undefined,
    background: { color: 'transparent', size: 'standard' }
  }}
  list={sectionCards}
  cardSize="m"
  cardTone="standard"
  cardShadow={true}
  mediaFit="contain"
  mediaHoverZoom={false}
/>
