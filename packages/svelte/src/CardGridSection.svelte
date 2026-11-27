<script lang="ts" generics="T extends CardItem">
  import type { Snippet } from 'svelte';
  import type { SectionDefinition, CardItem, CardSize, SurfaceTone, CardMediaAspect, CardMediaFit, CardContentPlacement, CardTextTone, ContentSpan } from '@page-sections/core';
  import type { CardElements } from './card.js';
  import Section from './Section.svelte';
  import Card from './Card.svelte';
  import ContentGrid from './ContentGrid.svelte';
  import ContentBlock from './ContentBlock.svelte';
  let { section, list, cardSize = 'm', cardShadow = false, cardTone = 'standard', mediaAspect = '3/2', mediaFit = 'contain', contentPlacement = 'below', textTone = 'light', itemSpan, textAlign = 'start', itemContent, media, surface, card, oncardready }: {
    section: SectionDefinition; list: T[]; cardSize?: CardSize; cardShadow?: boolean; cardTone?: SurfaceTone; itemSpan?: ContentSpan; textAlign?: 'start' | 'center';
    mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; contentPlacement?: CardContentPlacement; textTone?: CardTextTone;
    itemContent?: Snippet<[T]>; media?: Snippet<[T]>; surface?: Snippet<[T]>;
    card?: Snippet<[T, { cardSize: CardSize; shadow: boolean; tone: SurfaceTone; textAlign: 'start' | 'center'; mediaAspect: CardMediaAspect; mediaFit: CardMediaFit; contentPlacement: CardContentPlacement; textTone: CardTextTone; reserveEyebrow: boolean }]>;
    oncardready?: (parts: CardElements<T>) => void | (() => void);
  } = $props();
  const reserveEyebrow = $derived(cardSize !== 's' && list.some(item => Boolean(item.eyebrow?.trim())));
</script>
{#snippet entry(item: T)}
  {#if card}{@render card(item, { cardSize, shadow: cardShadow, tone: cardTone, textAlign, mediaAspect, mediaFit: contentPlacement === 'overlay' ? 'cover' : mediaFit, contentPlacement, textTone, reserveEyebrow })}
  {:else}<Card {item} {cardSize} shadow={cardShadow} tone={cardTone} {mediaAspect} {mediaFit} {contentPlacement} {textTone} {reserveEyebrow} {textAlign} {media} {surface} children={itemContent} onready={oncardready} />{/if}
{/snippet}
<Section {section} inset>
  <ContentGrid class="ps-card-grid">
    {#each list as item (item.itemKey ?? item.id)}
      {#if itemSpan !== undefined}<ContentBlock span={itemSpan}>{@render entry(item)}</ContentBlock>
      {:else}<div class="card-item" data-ps-card-size={cardSize}>{@render entry(item)}</div>{/if}
    {/each}
  </ContentGrid>
</Section>
<style>
  /* ContentGrid aligns items to the start; each card slot must explicitly fill its row. */
  .card-item { grid-column: span var(--ps-card-span); min-width: 0; align-self: stretch; display: grid; }
  :global(.ps-card-grid) { grid-auto-rows: 1fr; }
  :global(.ps-card-grid > .ps-content-block) { align-self: stretch; display: grid; }
</style>
