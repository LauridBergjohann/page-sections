<script lang="ts">
  import { safeHref, type MenuItem } from '@page-sections/core';
  let { items }: { items: MenuItem[] } = $props();
</script>
{#snippet entries(list: MenuItem[])}
  <ul>{#each list as item (item.id)}<li>{#if item.children?.length}<details><summary>{item.label}</summary><div class="ps-submenu">{#if item.href}<a href={safeHref(item.href)} aria-current={item.current ? 'page' : undefined}>{item.label}</a>{/if}{@render entries(item.children)}</div></details>{:else}<a href={safeHref(item.href)} aria-current={item.current ? 'page' : undefined}>{item.label}</a>{/if}</li>{/each}</ul>
{/snippet}
{@render entries(items)}
<style>
  ul { display: flex; flex-wrap: wrap; align-items: start; gap: .25rem; list-style: none; margin: 0; padding: 0; } li { min-width: 0; } a, summary { display: block; padding: .65rem .85rem; overflow-wrap: anywhere; } summary { cursor: pointer; } details { position: relative; } details ul { flex-direction: column; padding-inline: .5rem; } [aria-current] { font-weight: 700; text-decoration-thickness: 2px; }
</style>
