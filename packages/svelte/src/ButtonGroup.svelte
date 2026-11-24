<script lang="ts">
  import { tooltip } from './tooltip.js';
  import type { Snippet } from 'svelte';
  import { safeHref, type ButtonGroupItem } from '@page-sections/core';
  import { selectionIndicator } from './selectionIndicator.js';
  import './selectionIndicator.css';
  import './styles.css';
  let {
    items,
    label,
    onselect,
    icon,
    iconOnly = false
  }: {
    items: ButtonGroupItem[];
    label: string;
    onselect?: (item: ButtonGroupItem) => void;
    icon?: Snippet<[ButtonGroupItem]>;
    iconOnly?: boolean;
  } = $props();
</script>

{#snippet content(item: ButtonGroupItem)}
  {#if icon}<span class="icon" aria-hidden="true">{@render icon(item)}</span>{/if}
  {#if !iconOnly || !icon}<span>{item.label}</span>{/if}
{/snippet}
<div
  class="ps-button-group ps-selection-track"
  role="group"
  aria-label={label}
  use:selectionIndicator={{
    items: ':scope > a, :scope > button',
    selected: '[aria-pressed="true"], [aria-current]'
  }}
>
  {#each items as item, index (item.id)}
    {#if item.href && !item.disabled}
      <a
        href={safeHref(item.href)}
        aria-current={item.selected ? 'true' : undefined}
        aria-label={iconOnly && icon ? item.label : undefined}
        use:tooltip={iconOnly && icon ? item.label : undefined}
        class:icon-only={iconOnly && !!icon}
        data-first={index === 0 || undefined}
        data-last={index === items.length - 1 || undefined}
      >
        {@render content(item)}
      </a>
    {:else}
      <button
        type="button"
        disabled={item.disabled}
        aria-pressed={item.selected}
        aria-label={iconOnly && icon ? item.label : undefined}
        use:tooltip={iconOnly && icon ? item.label : undefined}
        class:icon-only={iconOnly && !!icon}
        data-first={index === 0 || undefined}
        data-last={index === items.length - 1 || undefined}
        onclick={() => onselect?.(item)}>{@render content(item)}</button
      >
    {/if}
  {/each}
</div>

<style>
  .ps-button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    width: fit-content;
    max-width: 100%;
    outline: 1px solid var(--ps-border);
    outline-offset: -1px;
    border-radius: var(--ps-radius, 12px);
  }
  a,
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 0;
    padding: 0.65rem;
    border-radius: 0;
    font: inherit;
    color: inherit;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
    transition: color 300ms cubic-bezier(.2,.4,.3,1), background-color 300ms cubic-bezier(.2,.4,.3,1);
    position: relative;
  }
  :is(a, button):not([data-first])::after {
    content: ''; position: absolute; inset-inline-start: 0; inset-block: 0;
    border-inline-start: 1px solid var(--ps-button-group-divider, var(--ps-border)); pointer-events: none;
  }
  @media (hover: hover) {
    .ps-button-group > :is(a, button:not(:disabled)):hover { background: var(--ps-selection, var(--ps-section-muted)); }
  }
  [data-first] {
    border-start-start-radius: var(--ps-radius, 12px);
    border-end-start-radius: var(--ps-radius, 12px);
  }
  [data-last] {
    border-start-end-radius: var(--ps-radius, 12px);
    border-end-end-radius: var(--ps-radius, 12px);
  }
  .icon {
    display: flex;
  }
  .icon-only {
    width: 40px;
    height: 40px;
    padding: 0;
  }
  [aria-pressed='true'],
  [aria-current] {
    color: var(--ps-accent);
    background: var(--ps-selection, var(--ps-section-muted));
    font-weight: 700;
  }
  .ps-button-group:global([data-ps-selection-ready]) > :is([aria-pressed='true'], [aria-current]) {
    background: transparent;
  }
  a:hover {
    text-decoration: none;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--ps-accent);
    outline-offset: -2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  @media (prefers-reduced-motion: reduce) {
    a,
    button {
      transition: none;
    }
  }
</style>
