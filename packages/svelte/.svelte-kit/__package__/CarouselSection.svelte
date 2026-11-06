<script lang="ts" generics="T extends CardItem">
  import { onMount, type Snippet } from 'svelte';
  import type { SectionDefinition, CardItem, CardSize } from '@page-sections/core';
  import Section from './Section.svelte';
  import Card from './Card.svelte';
  let { section, list, cardSize = 'm', controls = true, previousLabel = 'Previous cards', nextLabel = 'Next cards', itemContent, media }: { section: SectionDefinition; list: T[]; cardSize?: CardSize; controls?: boolean; previousLabel?: string; nextLabel?: string; itemContent?: Snippet<[T]>; media?: Snippet<[T]> } = $props();
  let track: HTMLDivElement;
  let mounted = $state(false);
  onMount(() => { mounted = true; });
  function move(direction: number) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rtl = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollBy({ left: direction * rtl * track.clientWidth * .85, behavior: reduced ? 'instant' : 'smooth' });
  }
</script>
<Section {section}>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scroll containers need keyboard focus, including without JavaScript.) -->
  <div bind:this={track} id={`${section.id}-track`} class="track" data-size={cardSize} tabindex="0" role="region" aria-label={section.title}>
    {#each list as item (item.itemKey ?? item.id)}<div class="slide"><Card {item} {media} children={itemContent} /></div>{/each}
  </div>
  {#if controls && mounted && list.length > 1}<div class="controls"><button type="button" aria-controls={`${section.id}-track`} aria-label={previousLabel} onclick={() => move(-1)}>←</button><button type="button" aria-controls={`${section.id}-track`} aria-label={nextLabel} onclick={() => move(1)}>→</button></div>{/if}
</Section>
<style>.track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: var(--ps-grid-gap); padding: .25rem .25rem 1rem; scroll-padding-inline: .25rem; overscroll-behavior-inline: contain; } .slide { flex: 0 0 min(85%, var(--ps-carousel-card-width, 300px)); min-width: 0; scroll-snap-align: start; } [data-size='s'] { --ps-carousel-card-width: 220px; } [data-size='l'] { --ps-carousel-card-width: 400px; } .controls { display: flex; justify-content: end; gap: .5rem; margin-top: .5rem; } button { font: inherit; background: var(--ps-section-standard); color: var(--ps-ink); border: 1px solid var(--ps-border); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; }</style>
