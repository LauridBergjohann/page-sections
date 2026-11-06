<script lang="ts">
  import { safeHref, type Breadcrumb } from '@page-sections/core';
  let { items, label = 'Breadcrumb' }: { items: Breadcrumb[]; label?: string } = $props();
</script>
<nav aria-label={label}><ol>{#each items as item, i}<li>{#if item.href && i < items.length - 1}<a href={safeHref(item.href)}>{item.label}</a>{:else}<span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>{/if}</li>{/each}</ol></nav>
<style>ol { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; list-style: none; font-size: .875rem; } li { overflow-wrap: anywhere; } li + li::before { content: '/'; margin-right: .5rem; opacity: .5; }</style>
