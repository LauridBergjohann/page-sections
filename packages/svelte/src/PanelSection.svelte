<script lang="ts">
  import { getContext } from 'svelte';
  import type { PanelSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import ContentPanel from './ContentPanel.svelte';
  import RichTextContent from './RichTextContent.svelte';
  import Heading from './Heading.svelte';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  let { section }: { section: Omit<PanelSectionData, 'type'> } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(section.headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
</script>
<Section {section} renderHeader={false}>
  <!-- Section already supplies the next heading level for the panel's body. -->
  <ContentPanel tone={section.tone} actions={section.actions}>
    {#if section.headline || section.eyebrow || section.introduction}
      <div class="panel-heading">
        <Heading text={section.headline} id={`${section.id}-title`} level={level} size={section.headingSize ?? 'm'} align={section.headingAlign} eyebrow={section.eyebrow} introduction={section.introduction} />
      </div>
    {/if}
    <RichTextContent content={{ blocks: section.blocks }} />
  </ContentPanel>
</Section>
<style>
  .panel-heading { margin-bottom: 1rem; }
</style>
