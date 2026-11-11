<script lang="ts">
  import { safeHref, type ButtonGroupItem } from '@page-sections/core';
  let {
    items,
    label,
    onselect
  }: { items: ButtonGroupItem[]; label: string; onselect?: (item: ButtonGroupItem) => void } =
    $props();
</script>

<div role="group" aria-label={label}>
  {#each items as item (item.id)}{#if item.href && !item.disabled}<a
        href={safeHref(item.href)}
        aria-current={item.selected ? 'true' : undefined}>{item.label}</a
      >{:else}<button
        type="button"
        disabled={item.disabled}
        aria-pressed={item.selected}
        onclick={() => onselect?.(item)}>{item.label}</button
      >{/if}{/each}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  a,
  button {
    border: 0;
    padding: 0.65rem;
    border-radius: calc(var(--ps-radius) / 2);
    font: inherit;
    color: inherit;
    background: transparent;
    cursor: pointer;
    text-decoration: none;
  }
  [aria-pressed='true'],
  [aria-current] {
    color: var(--ps-accent);
    background: var(--ps-section-muted);
    font-weight: 700;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
