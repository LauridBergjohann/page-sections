<script lang="ts">
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { ContentAction, HeadingLevel } from '@page-sections/core';
  import { SECTION_CONTEXT, defaultSectionContext, nextHeading, type ReadSectionContext } from './sectionContext.js';
  import Actions from './Actions.svelte';
  let { title, titleId, headingLevel, tone = 'muted', actions, children }: {
    title?: string; titleId?: string; headingLevel?: HeadingLevel; tone?: 'standard' | 'muted'; actions?: ContentAction[]; children?: Snippet;
  } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
  setContext<ReadSectionContext>(SECTION_CONTEXT, () => ({ ...(readContext?.() ?? defaultSectionContext), headingLevel: title ? nextHeading(level) : level }));
</script>
<div class="ps-panel" data-tone={tone}>
  {#if title}<svelte:element this={`h${level}`} id={titleId}>{title}</svelte:element>{/if}
  {@render children?.()}
  <Actions {actions} />
</div>
<style>
  .ps-panel { padding: var(--ps-grid-gap, 16px); border: 1px solid var(--ps-border); border-radius: var(--ps-radius); background: var(--ps-section-muted); overflow-wrap: anywhere; }
  [data-tone='standard'] { background: var(--ps-section-standard); }
  h1, h2, h3, h4, h5, h6 { margin: 0 0 1rem; font-size: 1.125rem; line-height: 1.4; }
  .ps-panel > :global(.ps-actions) { margin-top: 1.25rem; }
</style>
