<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import type { RichTextContentData } from '@page-sections/core';
  import InlineText from './InlineText.svelte';
  import ContentPanel from './ContentPanel.svelte';
  import RichTextContent from './RichTextContent.svelte';
  let { content }: { content: RichTextContentData } = $props();
  const markdown = new MarkdownIt({ html: false, linkify: true, typographer: false });
  const html = $derived(content.body !== undefined && content.format !== 'text' ? markdown.render(content.body) : '');
</script>
<div class="ps-prose">
  {#if content.blocks}
    {#each content.blocks as block}
      {#if block.type === 'paragraph'}<p data-text-variant={block.variant ?? 'default'}><InlineText text={block.text} /></p>
      {:else if block.type === 'address'}<address><strong>{block.name}</strong>{#each block.lines as line}<br /><InlineText text={line} />{/each}</address>
      {:else if block.type === 'list'}<svelte:element this={block.ordered ? 'ol' : 'ul'}>{#each block.items as item}<li><InlineText text={item} /></li>{/each}</svelte:element>
      {:else if block.type === 'panel'}<ContentPanel title={block.title} tone={block.tone} actions={block.actions}><RichTextContent content={{ blocks: block.blocks }} /></ContentPanel>
      {/if}
    {/each}
  {:else if content.format === 'text'}<p>{content.body}</p>
  {:else}{@html html}{/if}
</div>
<style>
  p { white-space: pre-line; }
  address { font-style: normal; }
  [data-text-variant='lead'] { font-size: 1.125rem; }
  [data-text-variant='muted'] { font-size: .875rem; color: var(--ps-body); }
</style>
