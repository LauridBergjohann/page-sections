<script lang="ts" generics="T extends CardItem">
  import type { Snippet } from 'svelte';
  import { safeHref, type CardItem } from '@page-sections/core';
  import Image from './Image.svelte';
  let { item, children, media }: { item: T; children?: Snippet<[T]>; media?: Snippet<[T]> } = $props();
</script>
<article class="ps-card" data-card-id={item.itemKey ?? item.id}>
  {#if media}{@render media(item)}{:else if item.image}<Image image={item.image} />{/if}
  <div class="text">{#if item.eyebrow}<p class="eyebrow">{item.eyebrow}</p>{/if}
    <h3>{#if item.href}<a href={safeHref(item.href)}>{item.title}</a>{:else}{item.title}{/if}</h3>
    {#if item.description ?? item.subtitle}<p>{item.description ?? item.subtitle}</p>{/if}
    {@render children?.(item)}
  </div>
</article>
<style>article { border: 1px solid var(--ps-border); border-radius: var(--ps-radius); background: var(--ps-section-standard); height: 100%; overflow: clip; } .text { padding: 1rem; } h3 { margin: 0; font-size: 1.1rem; line-height: 1.4; } p { color: var(--ps-body); line-height: 1.6; } .eyebrow { color: var(--ps-accent); font-size: .75rem; text-transform: uppercase; }</style>
