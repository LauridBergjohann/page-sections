<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { tooltip } from './tooltip.js';
  let {
    label, selected = false, color, icon, trailingIcon, title,
    type = 'button', class: className = '', ...rest
  }: Omit<HTMLButtonAttributes, 'children'> & {
    label: string; selected?: boolean; color?: string;
    icon?: Snippet; trailingIcon?: Snippet;
  } = $props();
</script>

<button {...rest} {type} class={['ps-chip', className]} aria-pressed={selected}
  aria-label={rest['aria-label'] ?? label} style:--ps-chip-color={color} use:tooltip={title}>
  {#if icon}<span class="ps-chip-icon" aria-hidden="true">{@render icon()}</span>{/if}
  <span class="ps-chip-label">{label}</span>
  {#if trailingIcon}<span class="ps-chip-trailing-icon" aria-hidden="true">{@render trailingIcon()}</span>{/if}
</button>

<style>
  .ps-chip { display: inline-flex; align-items: center; gap: .5rem; box-sizing: border-box; height: 44px; min-width: 0; max-width: 100%; padding: .5rem .75rem; overflow: hidden; border: 1px solid var(--ps-border); border-radius: 999px; background: var(--ps-section-standard); color: var(--ps-ink); font: inherit; font-weight: 400; line-height: 1.25; cursor: pointer; transition: background-color 300ms cubic-bezier(.2,.4,.3,1), border-color 300ms cubic-bezier(.2,.4,.3,1); }
  .ps-chip[aria-pressed='true'] { border-color: transparent; background: color-mix(in srgb, var(--ps-chip-color, var(--ps-accent)) 17%, var(--ps-section-standard)); font-weight: 650; }
  .ps-chip-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ps-chip-icon, .ps-chip-trailing-icon { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 20px; height: 20px; }
  .ps-chip-trailing-icon { margin-inline-start: auto; }
  @media (hover: hover) { .ps-chip:not(:disabled):hover { background: color-mix(in srgb, var(--ps-chip-color, var(--ps-accent)) 28%, var(--ps-section-standard)); } }
  .ps-chip:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 2px; }
  .ps-chip:disabled { opacity: .5; cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) { .ps-chip { transition: none; } }
</style>
