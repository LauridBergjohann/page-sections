<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ImageSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import Image from './Image.svelte';
  let { section, children }: { section: Omit<ImageSectionData, 'type'>; children?: Snippet } = $props();
</script>
<Section {section}>{#if section.description || children}<div class="ps-media-pair" data-side={section.imageSide}><Image image={section.image} /><div>{#if section.description}<p>{section.description}</p>{/if}{@render children?.()}</div></div>{:else}<Image image={section.image} />{/if}</Section>
