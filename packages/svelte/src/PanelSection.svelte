<script lang="ts">
  import { getContext } from 'svelte';
  import type { PanelSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import ContentPanel from './ContentPanel.svelte';
  import RichTextContent from './RichTextContent.svelte';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  let { section }: { section: Omit<PanelSectionData, 'type'> } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(section.headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
</script>
<Section {section} renderHeader={false}>
  <ContentPanel title={section.headline} titleId={`${section.id}-title`} headingLevel={level} tone={section.tone} actions={section.actions}>
    {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
    {#if section.introduction}<p>{section.introduction}</p>{/if}
    <RichTextContent content={{ blocks: section.blocks }} />
  </ContentPanel>
</Section>
