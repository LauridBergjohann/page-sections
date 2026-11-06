<script lang="ts">
  import type { RichTextSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import RichTextContent from './RichTextContent.svelte';
  type WithoutType<T> = T extends unknown ? Omit<T, 'type'> : never;
  let { section }: { section: WithoutType<RichTextSectionData> } = $props();
</script>
<Section {section}><RichTextContent content={section} /></Section>
