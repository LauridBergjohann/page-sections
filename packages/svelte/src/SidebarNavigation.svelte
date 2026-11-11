<script lang="ts">
  import type { Snippet } from 'svelte';
  import { safeHref, type MenuItem } from '@page-sections/core';
  let {
    items,
    activeId,
    label = 'Page navigation',
    icon
  }: {
    items: MenuItem[];
    activeId?: string;
    label?: string;
    icon?: Snippet<[MenuItem]>;
  } = $props();
  const current = (item: MenuItem): boolean => (activeId ? item.id === activeId : !!item.current);
  const active = (item: MenuItem): boolean =>
    current(item) || (item.children?.some(active) ?? false);
  const currentKey = $derived(
    activeId ??
      JSON.stringify(
        items.flatMap(function selected(item): string[] {
          return [...(item.current ? [item.id] : []), ...(item.children?.flatMap(selected) ?? [])];
        })
      )
  );
</script>

{#snippet entries(list: MenuItem[])}
  <ul>
    {#each list as item (item.id)}
      <li class:branch={!!item.children?.length}>
        <a
          href={safeHref(item.href)}
          class:active={active(item)}
          aria-current={current(item) ? 'page' : undefined}
        >
          {#if icon && item.icon}<span class="icon" aria-hidden="true">{@render icon(item)}</span
            >{/if}
          <span>{item.label}</span>
        </a>
        {#if item.children?.length}
          <details open={active(item)}>
            <!-- svelte-ignore a11y_no_redundant_roles (Keep styled disclosures exposed as buttons in browser accessibility trees.) -->
            <summary role="button" aria-label={`Show pages in ${item.label}`}
              ><span aria-hidden="true">⌄</span></summary
            >
            {@render entries(item.children)}
          </details>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}
<nav aria-label={label} class="ps-sidebar-navigation">
  {#key currentKey}{@render entries(items)}{/key}
</nav>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    position: relative;
  }
  .ps-sidebar-navigation a {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-height: 44px;
    padding: 0.6rem 0.85rem;
    color: var(--ps-ink);
    text-decoration: none;
    overflow-wrap: anywhere;
    border-inline-start: 3px solid transparent;
  }
  .branch > a {
    padding-inline-end: 2.75rem;
  }
  a:hover {
    background: var(--ps-section-muted);
  }
  a.active {
    background: var(--ps-section-muted);
  }
  a[aria-current='page'] {
    border-inline-start-color: var(--ps-accent);
    font-weight: 650;
  }
  .icon {
    display: flex;
    flex: none;
  }
  details > ul {
    margin-inline-start: 1rem;
  }
  summary {
    position: absolute;
    inset-inline-end: 0;
    top: 0;
    display: grid;
    place-items: center;
    width: 40px;
    height: 44px;
    cursor: pointer;
    list-style: none;
    border-radius: 0.5rem;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary:hover {
    background: var(--ps-section-muted);
  }
  details[open] > summary span {
    transform: rotate(180deg);
  }
</style>
