<script lang="ts">
  import { safeHref, type Breadcrumb } from '@page-sections/core';
  import './styles.css';
  let { items, label = 'Breadcrumb' }: { items: Breadcrumb[]; label?: string } = $props();
</script>
{#if items.length > 1}<nav aria-label={label}><ol>{#each items as item, i}<li>{#if item.href && i < items.length - 1}<a href={safeHref(item.href)}>{item.label}</a>{:else}<span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>{/if}</li>{/each}</ol></nav>{/if}
<style>
  nav { min-width: 0; max-width: 100%; }
  ol { display: flex; flex-wrap: nowrap; align-items: center; min-height: var(--ps-breadcrumb-height); gap: .5rem; margin: 0; padding: 0; list-style: none; font-size: var(--ps-breadcrumb-font-size); }
  li { display: flex; align-items: center; min-width: 0; }
  li + li::before { content: '/'; flex: none; margin-right: .5rem; opacity: .5; }
  a, span { display: block; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
