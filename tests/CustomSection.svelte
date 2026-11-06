<script lang="ts">
  import { Section } from '../packages/svelte/src/index.js';
  import type { SectionDefinition } from '@page-sections/core';
  let { section }: { section: SectionDefinition & { quote: string } } = $props();
</script>
<Section {section}><blockquote>{section.quote}</blockquote></Section>
