<script lang="ts" generics="T extends CardItem">
  import type { Snippet } from 'svelte';
  import type { SectionDefinition, CardItem, CardSize, CardVariant, CardMediaAspect, CardMediaFit, ContentSpan } from '@page-sections/core';
  import type { CardElements } from './card.js';
  import Section from './Section.svelte';
  import Card from './Card.svelte';
  import ContentGrid from './ContentGrid.svelte';
  import ContentBlock from './ContentBlock.svelte';
  let { section, list, cardSize = 'm', cardVariant = 'catalog', mediaAspect = '3/2', mediaFit = cardVariant === 'catalog' ? 'contain' : 'cover', itemSpan = { xs: 4, s: 3, m: 4, l: 4 }, textAlign = 'start', itemContent, media, surface, card, oncardready }: {
    section: SectionDefinition; list: T[]; cardSize?: CardSize; cardVariant?: CardVariant; itemSpan?: ContentSpan; textAlign?: 'start' | 'center';
    mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit;
    itemContent?: Snippet<[T]>; media?: Snippet<[T]>; surface?: Snippet<[T]>;
    card?: Snippet<[T, { cardSize: CardSize; variant: CardVariant; textAlign: 'start' | 'center'; mediaAspect: CardMediaAspect; mediaFit: CardMediaFit; reserveEyebrow: boolean }]>;
    oncardready?: (parts: CardElements<T>) => void | (() => void);
  } = $props();
  const reserveEyebrow = $derived((cardVariant !== 'catalog' || cardSize !== 's') && list.some(item => Boolean(item.eyebrow?.trim())));
</script>
{#snippet entry(item: T)}
  {#if card}{@render card(item, { cardSize, variant: cardVariant, textAlign, mediaAspect, mediaFit, reserveEyebrow })}
  {:else}<Card {item} {cardSize} variant={cardVariant} {mediaAspect} {mediaFit} {reserveEyebrow} {textAlign} {media} {surface} children={itemContent} onready={oncardready} />{/if}
{/snippet}
<Section {section} inset>
  <ContentGrid class="ps-card-grid">
    {#each list as item (item.itemKey ?? item.id)}
      {#if cardVariant === 'editorial'}<ContentBlock span={itemSpan}>{@render entry(item)}</ContentBlock>
      {:else}<div class="catalog-item" data-ps-card-size={cardSize}>{@render entry(item)}</div>{/if}
    {/each}
  </ContentGrid>
</Section>
<style>
  .catalog-item { grid-column: span var(--ps-card-span); min-width: 0; }
  :global(.ps-card-grid) { align-items: stretch; grid-auto-rows: 1fr; }
  :global(.ps-card-grid > .ps-content-block) { align-self: stretch; display: grid; }
</style>
