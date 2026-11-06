<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import type { MenuItem } from '@page-sections/core';
  import MainMenu from './MainMenu.svelte';
  import './styles.css';
  let { menu, items, brand, left, right, tools, settingsIcon, menuIcon, label = 'Main navigation', settingsLabel = 'Settings', menuLabel = 'Open navigation', closeKey, scrollBehavior = 'static' }: {
    menu?: Snippet; items?: MenuItem[]; brand?: Snippet; left?: Snippet; right?: Snippet; tools?: Snippet;
    settingsIcon?: Snippet; menuIcon?: Snippet; label?: string; settingsLabel?: string; menuLabel?: string;
    closeKey?: unknown; scrollBehavior?: 'static' | 'delayed' | 'fixed';
  } = $props();
  let root = $state<HTMLElement>();
  let settings = $state<HTMLDetailsElement>();
  let mobile = $state<HTMLDetailsElement>();
  function close(details: HTMLDetailsElement | undefined, focus = false) {
    if (!details?.open) return;
    details.open = false;
    if (focus) details.querySelector('summary')?.focus();
  }
  function closeAll() {
    root?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => { details.open = false; });
  }
  $effect(() => { void closeKey; closeAll(); });
  async function click(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    if (!root?.contains(event.target)) { closeAll(); return; }
    if (!settings?.contains(event.target)) close(settings);
    if (!mobile?.contains(event.target)) close(mobile);
    if (event.target.closest('a') && root?.contains(event.target)) { await tick(); closeAll(); }
  }
  function keydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    const focused = document.activeElement?.closest('details[open]') as HTMLDetailsElement | null;
    if (focused && root?.contains(focused)) { event.preventDefault(); close(focused, true); }
    else if (settings?.open) { event.preventDefault(); close(settings, true); }
    else if (mobile?.open) { event.preventDefault(); close(mobile, true); }
  }
</script>

<svelte:window onkeydown={keydown} onclick={click} onresize={() => {
  if (window.innerWidth >= 1200) close(mobile);
  if (window.innerWidth >= 1600) close(settings);
}} />
<div class="ps-navigation-track" data-scroll={scrollBehavior}>
 <div class="ps-navigation-rack">
  <nav bind:this={root} class="ps-navigation" aria-label={label}>
    {#if left}<div class="satellite left">{@render left()}</div>{/if}
    <div class="header ps-content-width">
      {#if brand}<div class="brand">{@render brand()}</div>{/if}
      {#if items}
        <details bind:this={mobile} class="mobile-menu">
          <summary aria-label={menuLabel}>{#if menuIcon}{@render menuIcon()}{:else}<span aria-hidden="true">&#9776;</span>{/if}</summary>
          <div class="mobile-panel"><MainMenu {items} /></div>
        </details>
      {/if}
      <div class="menu">{#if menu}{@render menu()}{:else if items}<div class="desktop-menu"><MainMenu {items} /></div>{/if}</div>
      {#if tools}<div class="tools">{@render tools()}</div>{/if}
      {#if left || right}
        <details bind:this={settings} class="settings">
          <summary aria-label={settingsLabel} title={settingsLabel}>
            {#if settingsIcon}{@render settingsIcon()}{:else}<span aria-hidden="true">&#9881;</span>{/if}
          </summary>
          <div class="settings-panel">
            <strong>{settingsLabel}</strong>
            {#if left}<div>{@render left()}</div>{/if}
            {#if right}<div>{@render right()}</div>{/if}
          </div>
        </details>
      {/if}
    </div>
    {#if right}<div class="satellite right">{@render right()}</div>{/if}
  </nav>
 </div>
</div>
<style>
  .ps-navigation-track { position: relative; z-index: 20; }
  [data-scroll='delayed'] { height: calc(var(--ps-nav-height) + var(--ps-sticky-range)); margin-bottom: calc(-1 * var(--ps-sticky-range)); pointer-events: none; }
  [data-scroll='delayed'] .ps-navigation-rack { position: sticky; top: 0; height: var(--ps-nav-height); pointer-events: auto; }
  [data-scroll='fixed'] { height: var(--ps-nav-height); }
  [data-scroll='fixed'] .ps-navigation-rack { position: fixed; inset: 0 0 auto; }
  nav { position: relative; padding-top: var(--ps-menu-top); min-height: var(--ps-nav-height); }
  .header { position: relative; display: flex; align-items: center; gap: .5rem; min-height: var(--ps-menu-height); padding: 0 12px; background: var(--ps-section-standard); border-bottom: 1px solid var(--ps-border); }
  .brand, .tools { flex-shrink: 0; }
  .brand { min-width: 0; }
  .menu { flex: 1; min-width: 0; }
  .satellite { display: none; }
  .settings, .mobile-menu { flex-shrink: 0; }
  summary { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary:hover, details[open] > summary { background: var(--ps-section-muted); }
  .settings-panel { position: absolute; top: calc(100% + 8px); right: 12px; width: min(280px, calc(100vw - 24px)); display: grid; gap: 16px; padding: 20px; background: var(--ps-section-standard); border: 1px solid var(--ps-border); border-radius: var(--ps-radius); box-shadow: 0 12px 32px #0002; z-index: 2; }
  .mobile-panel { position: absolute; top: 100%; inset-inline: 0; max-height: calc(100dvh - var(--ps-nav-height)); overflow: auto; background: var(--ps-section-standard); border: 1px solid var(--ps-border); padding: 12px; z-index: 2; }
  .mobile-panel :global(ul) { flex-direction: column; align-items: stretch; }
  .desktop-menu { display: none; }
  .desktop-menu :global(.ps-submenu) { position: absolute; top: 100%; left: 0; min-width: 12rem; max-width: min(24rem, 80vw); padding: .5rem; background: var(--ps-section-standard); border: 1px solid var(--ps-border); border-radius: var(--ps-radius); box-shadow: 0 12px 32px #0002; z-index: 2; }
  .desktop-menu :global(.ps-submenu .ps-submenu) { position: static; box-shadow: none; border: 0; }
  @media (max-width: 1599.98px) { .header { width: 100%; } }
  @media (min-width: 1200px) { .mobile-menu { display: none; } .desktop-menu { display: block; } }
  @media (min-width: 1600px) {
    .header { border: 1px solid var(--ps-border); border-radius: var(--ps-radius); }
    .satellite { display: flex; align-items: center; justify-content: center; position: absolute; top: var(--ps-satellite-top); width: var(--ps-satellite-width); height: var(--ps-satellite-height); background: var(--ps-section-standard); border-radius: 12px; box-shadow: 0 0 0 1px var(--ps-border); }
    .left { left: var(--ps-satellite-inset); } .right { right: var(--ps-satellite-inset); }
    .settings { display: none; }
  }
</style>
