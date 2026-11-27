<script lang="ts">
  import { safeHref, type Breadcrumb } from '@page-sections/core';
  import LucideIcon from './LucideIcon.svelte';
  import './styles.css';
  let { items, label = 'Breadcrumb', homeHref = '/', homeLabel = 'Home' }: {
    items: Breadcrumb[];
    label?: string;
    homeHref?: string;
    homeLabel?: string;
  } = $props();
  // Accept existing trails that already include Home without duplicating it.
  const trail = $derived(items[0]?.href?.replace(/\/+$/, '') === homeHref.replace(/\/+$/, '')
    ? items.slice(1) : items);
</script>
{#if trail.length}
  <nav aria-label={label}>
    <ol>
      <li class="home"><a href={safeHref(homeHref)} aria-label={homeLabel} title={homeLabel}><LucideIcon name="house" size={18} /></a></li>
      {#each trail as item, i}
        <li>{#if item.href && i < trail.length - 1}<a href={safeHref(item.href)}>{item.label}</a>{:else}<span aria-current={i === trail.length - 1 ? 'page' : undefined}>{item.label}</span>{/if}</li>
      {/each}
    </ol>
  </nav>
{/if}
<style>
  nav { min-width: 0; max-width: 100%; color: var(--ps-body); }
  ol { display: flex; flex-wrap: nowrap; align-items: center; min-height: var(--ps-breadcrumb-height); gap: .5rem; margin: 0; padding: 0; list-style: none; font-size: var(--ps-breadcrumb-font-size); }
  li { display: flex; align-items: center; min-width: 0; min-height: 24px; }
  .home { flex: none; }
  .home a { display: flex; align-items: center; justify-content: center; min-width: 24px; min-height: 24px; overflow: visible; }
  .home :global(svg) { width: 1.1em; height: 1.1em; }
  li + li::before { content: '/'; flex: none; margin-right: .5rem; opacity: .5; }
  a, span { display: block; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  nav a { color: inherit; text-decoration: none; }
  nav a:hover, nav a:focus-visible { color: var(--ps-accent); text-decoration: none; }
  span { opacity: .65; }
</style>
