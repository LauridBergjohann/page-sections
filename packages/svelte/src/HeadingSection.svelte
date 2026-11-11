<script lang="ts">
  import type { HeadingSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  let { section }: { section: Omit<HeadingSectionData, 'type'> } = $props();
</script>

<Section section={{ ...section, headline: section.headline ?? section.title }} />
