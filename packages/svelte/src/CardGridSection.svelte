<script lang="ts" generics="T extends CardItem">
  import type { Snippet } from 'svelte';
  import type { SectionDefinition, CardItem, CardSize } from '@page-sections/core';
  import Section from './Section.svelte';
  import Card from './Card.svelte';
  let { section, list, cardSize = 'm', itemContent, media }: { section: SectionDefinition; list: T[]; cardSize?: CardSize; itemContent?: Snippet<[T]>; media?: Snippet<[T]> } = $props();
</script>
<Section {section}><div class="cards" data-size={cardSize}>{#each list as item (item.itemKey ?? item.id)}<div class:large={item.size === 'l'}><Card {item} {media} children={itemContent} /></div>{/each}</div></Section>
<style>.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--ps-card-min, 250px)), 1fr)); gap: var(--ps-grid-gap); } .cards > div { min-width: 0; } [data-size='s'] { --ps-card-min: 180px; } [data-size='l'] { --ps-card-min: 340px; } @container ps-content (min-width: 840px) { .large { grid-column: span 2; } }</style>
