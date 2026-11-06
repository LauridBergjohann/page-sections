<script lang="ts">
  import type { Component } from 'svelte';
  import type { SectionData } from '@page-sections/core';
  import HeroSection from './HeroSection.svelte';
  import RichTextSection from './RichTextSection.svelte';
  import PanelSection from './PanelSection.svelte';
  import ImageSection from './ImageSection.svelte';
  import VideoSection from './VideoSection.svelte';
  import CardGridSection from './CardGridSection.svelte';
  import CarouselSection from './CarouselSection.svelte';
  import Section from './Section.svelte';
  import ContentGrid from './ContentGrid.svelte';
  import ContentBlock from './ContentBlock.svelte';
  import Sections from './Sections.svelte';
  function missing(section: { type: string }): never { throw new Error(`No renderer for section type: ${section.type}`); }
  // Renderer props are narrowed by the application; serialized models never contain components.
  let { sections, renderers = {} }: { sections: SectionData[]; renderers?: Record<string, Component<any>> } = $props();
</script>
{#each sections as section (section.id)}
  {@const Custom = renderers[section.type]}
  {#if Custom}<Custom {section} />
  {:else if section.type === 'hero'}<HeroSection {section} />
  {:else if section.type === 'richText'}<RichTextSection {section} />
  {:else if section.type === 'panel'}<PanelSection {section} />
  {:else if section.type === 'image'}<ImageSection {section} />
  {:else if section.type === 'video'}<VideoSection {section} />
  {:else if section.type === 'cardGrid'}<CardGridSection {section} list={section.list} cardSize={section.cardSize} cardVariant={section.cardVariant} itemSpan={section.itemSpan} textAlign={section.textAlign} />
  {:else if section.type === 'carousel'}<CarouselSection {section} list={section.list} cardSize={section.cardSize} cardVariant={section.cardVariant} textAlign={section.textAlign} controls={section.controls} initialItemKey={section.initialItemKey} />
  {:else if section.type === 'grid'}<Section {section} inset><ContentGrid>{#each section.blocks as block (block.id)}<ContentBlock span={block.span}><Sections sections={block.sections} {renderers} /></ContentBlock>{/each}</ContentGrid></Section>
  {:else}{missing(section)}{/if}
{/each}
