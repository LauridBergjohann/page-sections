<script lang="ts">
  import type { CodeSectionData, HighlightedCode } from '@page-sections/core';
  import CodeBlock from './CodeBlock.svelte';
  import Section from './Section.svelte';
  let { section, highlighted }: { section: Omit<CodeSectionData, 'type'>; highlighted?: HighlightedCode } = $props();
</script>

<Section {section}>
  <CodeBlock code={section.code} language={section.language} filename={section.filename}
    lineNumbers={section.lineNumbers} highlightLines={section.highlightLines}
    wrap={section.wrap} tone={section.tone} {highlighted} />
</Section>
