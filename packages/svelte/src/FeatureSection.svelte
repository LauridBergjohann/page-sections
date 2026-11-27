<script lang="ts" generics="T extends FeatureItem">
  import type { Snippet } from 'svelte';
  import type { SectionDefinition, FeatureItem, CardSize, FeatureIconTone } from '@page-sections/core';
  import Section from './Section.svelte';
  import Feature from './Feature.svelte';
  let { section, list, featureSize = 'm', iconTone = 'muted', icon }: {
    section: SectionDefinition; list: T[]; featureSize?: CardSize; iconTone?: FeatureIconTone; icon?: Snippet<[T]>;
  } = $props();
</script>
<Section {section} inset>
  <ul class="ps-features" role="list" data-ps-card-size={featureSize}>
    {#each list as item (item.itemKey ?? item.id)}
      <li class="feature-slot"><Feature {item} {featureSize} {iconTone} {icon} /></li>
    {/each}
  </ul>
</Section>
<style>
  /* The same generated column span as cards; flex centers every incomplete row. */
  .ps-features { display: flex; flex-wrap: wrap; justify-content: center; gap: calc(2 * var(--ps-grid-gap)) var(--ps-grid-gap); margin: 0; padding: 0; list-style: none; }
  .feature-slot { flex: 0 0 calc((100% + var(--ps-grid-gap)) / var(--ps-grid-columns) * var(--ps-card-span) - var(--ps-grid-gap)); min-width: 0; }
</style>
