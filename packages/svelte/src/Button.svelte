<script lang="ts">
  import { safeHref } from '@page-sections/core';
  import type { ButtonProps } from './button.js';
  let {
    variant = 'primary', href, target, rel, children, active = false, borderless = false,
    disabled = false, type = 'button', class: className = '', element = $bindable(), ...rest
  }: ButtonProps & { variant?: 'primary' | 'secondary' | 'icon' } = $props();
</script>

{#if href !== undefined}
  <a {...rest} bind:this={element} class="ps-button {className}" data-variant={variant}
    data-active={active} data-borderless={borderless} href={disabled ? undefined : safeHref(href)}
    aria-disabled={disabled || undefined} tabindex={disabled ? -1 : rest.tabindex}
    {target} rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
    onclick={(event) => { if (disabled) { event.preventDefault(); return; } rest.onclick?.(event); }}>
    {@render children?.()}
  </a>
{:else}
  <button {...rest} bind:this={element} class="ps-button {className}" data-variant={variant}
    data-active={active} data-borderless={borderless} {type} {disabled}>
    {@render children?.()}
  </button>
{/if}

<style>
  .ps-button { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; box-sizing: border-box; min-height: 40px; padding: .75rem 1.25rem; border: 1px solid var(--ps-accent); border-radius: var(--ps-radius); font: inherit; font-weight: 600; line-height: 1.25; text-decoration: none; cursor: pointer; background: var(--ps-accent); color: var(--ps-on-accent); transition: background-color 180ms ease, color 180ms ease; }
  .ps-button[data-variant='secondary'] { color: var(--ps-accent); background: var(--ps-section-standard); }
  .ps-button[data-variant='icon'] { width: 40px; height: 40px; flex: none; padding: 0; color: var(--ps-ink); background: var(--ps-section-standard); border-color: var(--ps-border); border-radius: .5rem; }
  .ps-button:hover { filter: brightness(.95); }
  .ps-button[data-active='true'] { background: var(--ps-selection, var(--ps-section-muted)); color: var(--ps-accent); }
  .ps-button[data-borderless='true'] { border: 0; }
  .ps-button:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 2px; }
  .ps-button:disabled, .ps-button[aria-disabled='true'] { opacity: .5; cursor: not-allowed; filter: none; }
  @media (prefers-reduced-motion: reduce) { .ps-button { transition: none; } }
</style>
