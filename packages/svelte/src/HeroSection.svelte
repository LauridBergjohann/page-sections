<script lang="ts">
  import type { Snippet } from 'svelte';
  import { safeHref, type HeroSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import Image from './Image.svelte';
  let { section, children }: { section: Omit<HeroSectionData, 'type'>; children?: Snippet } = $props();
</script>
<Section section={{ ...section, headline: undefined, eyebrow: undefined, introduction: undefined }}>
  <div class="hero" data-size={section.size ?? 'm'}>
    {#if section.image}<div class="image"><Image image={section.image} eager /></div>{/if}
    <div class="copy" class:panel={section.textBackground !== false}>
      {#if section.eyebrow}<p>{section.eyebrow}</p>{/if}
      <h2>{section.headline ?? section.title}</h2>
      {#if section.introduction}<p>{section.introduction}</p>{/if}
      {#if section.actions?.length}<div class="actions">{#each section.actions as action}<a href={safeHref(action.href)}>{action.label} →</a>{/each}</div>{/if}
      {@render children?.()}
    </div>
  </div>
</Section>
<style>.hero { position: relative; display: grid; align-items: center; min-height: 28rem; border-radius: var(--ps-radius); overflow: clip; } .image { position: absolute; inset: 0; } .image :global(picture), .image :global(img) { height: 100%; } .copy { min-width: 0; position: relative; margin: clamp(1rem, 4vw, 4rem); padding: clamp(1rem, 3vw, 3rem); max-width: 44rem; border-radius: var(--ps-radius); } .panel { background: color-mix(in srgb, var(--ps-section-standard) 92%, transparent); } h2 { font-size: clamp(2rem, 5vw, 4.5rem); line-height: 1.05; letter-spacing: -.04em; margin: 0; } p { line-height: 1.7; } .actions { display: flex; flex-wrap: wrap; gap: 1rem; } [data-size='s'] { min-height: 18rem; } [data-size='l'] { min-height: 36rem; }</style>
