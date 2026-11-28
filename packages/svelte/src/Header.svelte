<script lang="ts">
  import Popup from './Popup.svelte';
  import { tooltip } from './tooltip.js';
  import { onMount, tick, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MenuItem } from '@page-sections/core';
  import MainMenu from './MainMenu.svelte';
  import { popupLayer } from './popupLayer.js';
  import './styles.css';
  let { menu, items, brand, left, right, tools, settingsIcon, menuIcon, itemIcon, label = 'Main navigation', settingsLabel = 'Settings', menuLabel = 'Open navigation', closeKey, scrollBehavior = 'delayed', class: className = '', ...rest }: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    menu?: Snippet; items?: MenuItem[]; brand?: Snippet; left?: Snippet; right?: Snippet; tools?: Snippet;
    settingsIcon?: Snippet; menuIcon?: Snippet; itemIcon?: Snippet<[MenuItem]>; label?: string; settingsLabel?: string; menuLabel?: string;
    closeKey?: unknown; scrollBehavior?: 'static' | 'delayed' | 'fixed';
  } = $props();
  let menuRevision = $state(0);
  let root = $state<HTMLElement>();
  let settings = $state<HTMLDetailsElement>();
  let mobile = $state<HTMLDetailsElement>();
  let viewportWidth = 0;
  onMount(() => { viewportWidth = window.innerWidth; });
  function close(details: HTMLDetailsElement | undefined, focus = false) {
    if (!details?.open) return;
    details.open = false;
    if (focus) details.querySelector('summary')?.focus();
  }
  function closeAll() {
    menuRevision += 1;
    root?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => { details.open = false; });
  }
  $effect(() => { void closeKey; untrack(closeAll); });
  async function click(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    if (!root?.contains(event.target)) { closeAll(); return; }
    if (!settings?.contains(event.target)) close(settings);
    else if (event.target.closest('button[aria-pressed]:not(:disabled), [role=radio]')) {
      await tick(); close(settings, true);
    }
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
  if (window.innerWidth === viewportWidth) return;
  viewportWidth = window.innerWidth;
  if (window.innerWidth >= 1200) close(mobile);
  else closeAll();
  if (window.innerWidth >= 1600) close(settings);
}} />
<header use:popupLayer {...rest} class={['ps-header', 'ps-navigation-track', className].filter(Boolean).join(' ')} data-scroll={scrollBehavior}>
 <div class="ps-navigation-rack">
  <div class="menu-backdrop" aria-hidden="true"></div>
  <div bind:this={root} class="ps-navigation">
    {#if left}<div class="satellite left ps-shadow-navigation">{@render left()}</div>{/if}
    <div class="header ps-content-width ps-shadow-navigation">
      {#if items}
        <nav class="mobile-navigation" aria-label={label}>
        <details bind:this={mobile} class="mobile-menu">
          <summary aria-label={menuLabel} use:tooltip={menuLabel}>{#if menuIcon}{@render menuIcon()}{:else}<span aria-hidden="true">&#9776;</span>{/if}</summary>
          <Popup class="mobile-panel" disclosure><MainMenu {items} variant="mobile" icon={itemIcon} /></Popup>
        </details>
        </nav>
      {/if}
      {#if brand}<div class="brand">{@render brand()}</div>{/if}
      <div class="menu">{#if menu}<nav aria-label={label}>{@render menu()}</nav>{:else if items}<nav class="desktop-menu" aria-label={label}><MainMenu {items} icon={itemIcon} closeKey={menuRevision} /></nav>{/if}</div>
      {#if tools}<div class="tools">{@render tools()}</div>{/if}
      {#if left || right}
        <details bind:this={settings} class="settings">
          <summary aria-label={settingsLabel} use:tooltip={settingsLabel}>
            {#if settingsIcon}{@render settingsIcon()}{:else}<span aria-hidden="true">&#9881;</span>{/if}
          </summary>
          <Popup class="settings-panel" disclosure closable title={settingsLabel}>
            <div class="settings-panel-content">
            {#if left}<div>{@render left()}</div>{/if}
            {#if right}<div>{@render right()}</div>{/if}
            </div>
          </Popup>
        </details>
      {/if}
    </div>
    {#if right}<div class="satellite right ps-shadow-navigation">{@render right()}</div>{/if}
  </div>
 </div>
</header>
<style>
  /* Native disclosures remain usable with a CSS-only backdrop before hydration. */
  .menu-backdrop { display: none; position: fixed; inset: 0; pointer-events: none; backdrop-filter: blur(3px); }
  .ps-header:not([data-ps-popups-enhanced]):has(.mobile-menu[open], .settings[open]) .menu-backdrop { display: block; }
  .ps-navigation-track { position: relative; z-index: 20; }
  [data-scroll='delayed'] { height: calc(var(--ps-nav-height) + var(--ps-sticky-range)); margin-bottom: calc(-1 * var(--ps-sticky-range)); pointer-events: none; }
  [data-scroll='delayed'] .ps-navigation-rack { position: sticky; top: 0; height: var(--ps-nav-height); pointer-events: auto; }
  [data-scroll='fixed'] { height: var(--ps-nav-height); }
  [data-scroll='fixed'] .ps-navigation-rack { position: fixed; inset: 0 0 auto; }
  .ps-navigation { position: relative; padding-top: var(--ps-menu-top); min-height: var(--ps-nav-height); }
  .header { position: relative; display: flex; align-items: center; gap: .5rem; min-height: var(--ps-menu-height); padding: 0 12px; --ps-panel-tint-fill: color-mix(in srgb, var(--ps-panel-background, var(--ps-section-standard)) calc(clamp(0, var(--ps-panel-tint-opacity), 1) * 100%), transparent); --ps-panel-filter: blur(clamp(0px, var(--ps-panel-backdrop-blur), 100px)); background: var(--ps-panel-tint-fill, var(--ps-panel-background, var(--ps-section-standard))); -webkit-backdrop-filter: var(--ps-panel-filter, none); backdrop-filter: var(--ps-panel-filter, none); box-shadow: var(--ps-navigation-shadow, var(--ps-default-navigation-shadow)); }
  .brand, .tools { flex-shrink: 0; }
  .brand { min-width: 0; display: flex; align-items: center; }
  .mobile-navigation { display: flex; align-items: center; }
  .mobile-menu, .settings { line-height: 1; }
  .menu { flex: 1; min-width: 0; }
  .satellite { display: none; }
  .header::after { content: ''; position: absolute; inset: 0; border: solid var(--ps-panel-border); border-width: 0 0 1px; border-radius: inherit; pointer-events: none; z-index: 3; }
  .settings, .mobile-navigation { flex-shrink: 0; }
  summary { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; list-style: none; }
  summary:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 2px; }
  summary::-webkit-details-marker { display: none; }
  summary { transition: color 300ms cubic-bezier(.2,.4,.3,1), background-color 300ms cubic-bezier(.2,.4,.3,1); }
  summary:hover { background: var(--ps-selection, var(--ps-section-muted)); }
  details[open] > summary { color: var(--ps-accent); background: var(--ps-selection, var(--ps-section-muted)); }
  @media (prefers-reduced-motion: reduce) { summary { transition: none; } }
  .header :global(.settings-panel) { top: 100%; right: 12px; padding: 20px; border-top-width: 0; z-index: 2; }
  .settings-panel-content { display: grid; gap: 20px; }
  .header :global(.mobile-panel) { top: 100%; inset-inline: 12px; width: auto; padding: 12px; border-top-width: 0; z-index: 2; }
  .header :global(.mobile-panel ul) { flex-direction: column; align-items: stretch; }
  .desktop-menu { display: none; }
  @media (max-width: 1599.98px) { .header { width: 100%; } }
  @media (max-width: 599.98px) { .header { gap: .25rem; } }
  @media (min-width: 1200px) { .mobile-navigation { display: none; } .desktop-menu { display: block; } }
  @media (min-width: 1600px) {
    /* The extra track lets the menu dock before the lower satellites. The negative
       margin preserves the normal page offset, and empty track space stays clickable. */
    [data-scroll='fixed'] {
      --ps-header-dock-extra: max(0px, calc(var(--ps-satellite-top) - var(--ps-menu-top)));
      position: sticky;
      top: calc(-1 * (var(--ps-menu-top) + var(--ps-header-dock-extra)));
      height: calc(var(--ps-nav-height) + var(--ps-header-dock-extra));
      margin-bottom: calc(-1 * var(--ps-header-dock-extra));
      pointer-events: none;
    }
    [data-scroll='fixed'] .ps-navigation-rack { position: static; }
    [data-scroll='fixed'] .ps-navigation {
      box-sizing: border-box;
      min-height: calc(var(--ps-nav-height) + var(--ps-header-dock-extra));
    }
    [data-scroll='fixed'] .header { position: sticky; top: 0; pointer-events: auto; }
    [data-scroll='fixed'] .satellite { pointer-events: auto; }
    .header::after { border-width: 1px; }
    .header { border-radius: var(--ps-radius); }
    .satellite { display: flex; align-items: center; justify-content: center; position: absolute; top: var(--ps-satellite-top); width: var(--ps-satellite-width); height: var(--ps-satellite-height); --ps-panel-tint-fill: color-mix(in srgb, var(--ps-panel-background, var(--ps-section-standard)) calc(clamp(0, var(--ps-panel-tint-opacity), 1) * 100%), transparent); --ps-panel-filter: blur(clamp(0px, var(--ps-panel-backdrop-blur), 100px)); background: var(--ps-panel-tint-fill, var(--ps-panel-background, var(--ps-section-standard))); -webkit-backdrop-filter: var(--ps-panel-filter, none); backdrop-filter: var(--ps-panel-filter, none); border-radius: 12px; box-shadow: var(--ps-navigation-shadow, var(--ps-default-navigation-shadow)); }
    /* A satellite's segmented controls share its contour, including their outline
       and selection surface. Keep the satellite itself open for arbitrary popups. */
    .satellite :global(.ps-button-group) { border-radius: 12px; overflow: clip; }
    .satellite :global(.ps-button-group > :is(a, button)),
    .satellite :global(.ps-button-group::before) { border-top-left-radius: 0; border-top-right-radius: 0; }
    .left { left: var(--ps-satellite-inset); } .right { right: var(--ps-satellite-inset); }
    .settings { display: none; }
    @supports (animation-timeline: scroll(root block)) and (animation-range: 0px 1px) {
      [data-scroll='fixed'] .header, [data-scroll='fixed'] .satellite,
      [data-scroll='fixed'] .satellite :global(.ps-button-group) {
        --ps-header-dock-start: var(--ps-menu-top);
        --ps-header-dock-radius: var(--ps-radius);
        animation: dock-corners auto linear both;
        animation-timeline: scroll(root block);
        animation-range: var(--ps-header-dock-start) calc(var(--ps-header-dock-start) + 64px);
      }
      [data-scroll='fixed'] .satellite,
      [data-scroll='fixed'] .satellite :global(.ps-button-group) {
        --ps-header-dock-start: var(--ps-satellite-top);
        --ps-header-dock-radius: 12px;
      }
    }
  }
  @keyframes dock-corners {
    from { border-top-left-radius: var(--ps-header-dock-radius); border-top-right-radius: var(--ps-header-dock-radius); }
    to { border-top-left-radius: 0px; border-top-right-radius: 0px; }
  }
</style>
