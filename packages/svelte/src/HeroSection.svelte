<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import type { HeroSectionData } from '@page-sections/core';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  import Section from './Section.svelte';
  import Heading from './Heading.svelte';
  import Image from './Image.svelte';
  import Actions from './Actions.svelte';
  let { section, children }: { section: Omit<HeroSectionData, 'type'>; children?: Snippet } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(section.headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
</script>
<Section section={{ ...section, headline: section.headline ?? section.title, spacing: section.spacing ?? 'none' }} renderHeader={false} class="ps-hero-section">
  <div class="hero" data-size={section.size ?? 'm'} data-composition={section.composition ?? 'overlay'} data-image-side={section.imageSide ?? 'right'}>
    {#if section.image}<div class="image"><Image image={section.image} eager /></div>{/if}
    <div class="copy" class:panel={section.textBackground !== false}>
      <Heading text={section.headline ?? section.title} level={level} size={section.headingSize ?? 'xl'} id={section.id + '-title'} eyebrow={section.eyebrow} introduction={section.introduction} />
      <Actions actions={section.actions} />
      {@render children?.()}
    </div>
  </div>
</Section>
<style>
  .hero { position: relative; display: grid; align-items: center; min-height: 28rem; border-radius: var(--ps-radius); overflow: clip; }
  .image { position: absolute; inset: 0; } .image :global(picture), .image :global(img) { height: 100%; }
  .copy { min-width: 0; position: relative; margin: clamp(1rem, 4cqw, 4rem); padding: clamp(1rem, 3cqw, 3rem); max-width: 44rem; border-radius: var(--ps-radius); }
  .panel { background: color-mix(in srgb, var(--ps-section-standard) 92%, transparent); }
  .copy > :global(.ps-actions) { margin-top: 2rem; }
  [data-size='s'] { min-height: 18rem; } [data-size='l'] { min-height: 36rem; }
  [data-composition='artwork'] { padding: var(--ps-grid-gap); gap: var(--ps-grid-gap); }
  [data-composition='artwork'] .image { position: relative; grid-row: 2; min-width: 0; }
  [data-composition='artwork'] .image :global(img) { object-fit: contain; max-height: 28rem; }
  [data-composition='artwork'] .copy { grid-row: 1; margin: 0; padding: var(--ps-grid-gap); }
  @container ps-content (min-width: 840px) {
    [data-composition='artwork'] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    [data-composition='artwork'] .copy { grid-column: 1; } [data-composition='artwork'] .image { grid-column: 2; grid-row: 1; }
    [data-composition='artwork'][data-image-side='left'] .copy { grid-column: 2; } [data-composition='artwork'][data-image-side='left'] .image { grid-column: 1; }
  }
</style>
