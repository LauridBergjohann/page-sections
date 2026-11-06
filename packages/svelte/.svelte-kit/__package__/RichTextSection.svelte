<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import type { RichTextSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  let { section }: { section: Omit<RichTextSectionData, 'type'> } = $props();
  // Raw HTML is deliberately disabled; markdown-it also rejects dangerous link protocols.
  const markdown = new MarkdownIt({ html: false, linkify: true, typographer: false });
  const html = $derived(section.format === 'text' ? '' : markdown.render(section.body));
</script>
<Section {section}><div class="ps-prose">{#if section.format === 'text'}<p style="white-space: pre-line">{section.body}</p>{:else}{@html html}{/if}</div></Section>
