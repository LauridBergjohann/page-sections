<script lang="ts">
  import type { SectionNavigationItem } from '@page-sections/core';
  let { items, label = 'On this page', variant = 'horizontal' }: { items: SectionNavigationItem[]; label?: string; variant?: 'horizontal' | 'sidebar' } = $props();
</script>
{#if items.length}<nav aria-label={label} class:sidebar={variant === 'sidebar'}><ul>{#each items as item (item.id)}<li><a href={`#${item.id}`}>{item.title}</a></li>{/each}</ul></nav>{/if}
<style>nav { padding: 1rem; } ul { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; padding: 0; margin: 0; list-style: none; } a { display: inline-block; padding-block: .5rem; } .sidebar ul { flex-direction: column; }</style>
