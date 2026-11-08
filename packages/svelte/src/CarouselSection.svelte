<script lang="ts" generics="T extends CardItem">
  import { onMount, type Snippet } from 'svelte';
  import type { SectionDefinition, CardItem, CardSize, CardVariant, SurfaceTone, CardMediaAspect, CardMediaFit } from '@page-sections/core';
  import type { CardElements } from './card.js';
  import Section from './Section.svelte';
  import Card from './Card.svelte';
  let { section, list, cardSize = 'm', cardVariant = 'catalog', cardTone = 'standard', mediaAspect = '3/2', mediaFit = cardVariant === 'catalog' ? 'contain' : 'cover', textAlign = 'start', controls = true, previousLabel = 'Previous cards', nextLabel = 'Next cards', initialItemKey, onselectionchange, itemContent, media, oncardready }: { section: SectionDefinition; list: T[]; cardSize?: CardSize; cardVariant?: CardVariant; cardTone?: SurfaceTone; mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; textAlign?: 'start' | 'center'; controls?: boolean; previousLabel?: string; nextLabel?: string; initialItemKey?: string; onselectionchange?: (key: string) => void; itemContent?: Snippet<[T]>; media?: Snippet<[T]>; oncardready?: (parts: CardElements<T>) => void | (() => void) } = $props();
  const reserveEyebrow = $derived((cardVariant !== 'catalog' || cardSize !== 's') && list.some(item => Boolean(item.eyebrow?.trim())));
  let track: HTMLDivElement;
  let mounted = $state(false);
  let selected: string | undefined;
  function selectVisible() {
    const edge = track.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === 'rtl';
    const slides = [...track.querySelectorAll<HTMLElement>('.slide')];
    const closest = slides.sort((a, b) => Math.abs((rtl ? a.getBoundingClientRect().right - edge.right : a.getBoundingClientRect().left - edge.left)) - Math.abs((rtl ? b.getBoundingClientRect().right - edge.right : b.getBoundingClientRect().left - edge.left)))[0];
    const key = closest?.dataset.itemKey;
    if (key && key !== selected) { selected = key; onselectionchange?.(key); }
  }
  onMount(() => {
    mounted = true;
    const slide = [...track.querySelectorAll<HTMLElement>('.slide')].find(el => el.dataset.itemKey === initialItemKey);
    if (slide) {
      const rtl = getComputedStyle(track).direction === 'rtl';
      const delta = rtl ? slide.getBoundingClientRect().right - track.getBoundingClientRect().right : slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
      track.scrollBy({ left: delta, behavior: 'instant' });
    }
    selectVisible();
  });
  function move(direction: number) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rtl = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollBy({ left: direction * rtl * track.clientWidth * .85, behavior: reduced ? 'instant' : 'smooth' });
  }
</script>
<Section {section} inset>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scroll containers need keyboard focus, including without JavaScript.) -->
  <div bind:this={track} id={`${section.id}-track`} class="track" data-ps-card-size={cardSize} tabindex="0" role="region" aria-label={section.title} onscrollend={selectVisible}>
    {#each list as item (item.itemKey ?? item.id)}<div class="slide" data-item-key={item.itemKey ?? item.id}><Card {item} {mediaAspect} {mediaFit} {reserveEyebrow} {media} {cardSize} {textAlign} variant={cardVariant} tone={cardTone} children={itemContent} onready={oncardready} /></div>{/each}
  </div>
  {#if controls && mounted && list.length > 1}<div class="controls"><button type="button" aria-controls={`${section.id}-track`} aria-label={previousLabel} onclick={() => move(-1)}>←</button><button type="button" aria-controls={`${section.id}-track`} aria-label={nextLabel} onclick={() => move(1)}>→</button></div>{/if}
</Section>
<style>.track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: var(--ps-grid-gap); padding-block: .25rem 1rem; overscroll-behavior-inline: contain; }
  .slide { flex: 0 0 calc((100% + var(--ps-grid-gap)) / var(--ps-grid-columns) * var(--ps-card-span) - var(--ps-grid-gap)); min-width: 0; scroll-snap-align: start; }
  .controls { display: flex; justify-content: end; gap: .5rem; margin-top: .5rem; } button { font: inherit; background: var(--ps-section-standard); color: var(--ps-ink); border: 1px solid var(--ps-border); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; }
</style>
