<script lang="ts">
  import type { Snippet } from 'svelte';
  import './styles.css';
  let { menu, brand, left, right, settingsIcon, label = 'Main navigation', settingsLabel = 'Settings' }: {
    menu?: Snippet; brand?: Snippet; left?: Snippet; right?: Snippet;
    settingsIcon?: Snippet; label?: string; settingsLabel?: string;
  } = $props();
  let settings = $state<HTMLDetailsElement>();
  function closeSettings(focus = false) {
    if (!settings?.open) return;
    settings.open = false;
    if (focus) settings.querySelector('summary')?.focus();
  }
</script>

<svelte:window
  onkeydown={event => { if (event.key === 'Escape' && settings?.open) { event.preventDefault(); closeSettings(true); } }}
  onclick={event => { if (event.target instanceof Node && !settings?.contains(event.target)) closeSettings(); }}
  onresize={() => { if (window.innerWidth >= 1600) closeSettings(); }}
/>
<nav class="ps-navigation" aria-label={label}>
  {#if left}<div class="satellite left">{@render left()}</div>{/if}
  <div class="header">
    {#if brand}<div class="brand">{@render brand()}</div>{/if}
    <div class="menu">{@render menu?.()}</div>
    {#if left || right}
      <details bind:this={settings} class="settings">
        <summary aria-label={settingsLabel} title={settingsLabel}>
          {#if settingsIcon}{@render settingsIcon()}{:else}<span aria-hidden="true">⚙</span>{/if}
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
<style>
  nav { position: relative; z-index: 20; padding: 0; background: var(--ps-background); }
  .header { position: relative; display: flex; align-items: center; gap: .5rem; min-height: 66px; padding: 0 12px; background: var(--ps-section-standard); border-bottom: 1px solid var(--ps-border); }
  .brand { flex-shrink: 0; }
  .menu { flex: 1; min-width: 0; }
  .satellite { display: none; }
  .settings { flex-shrink: 0; }
  summary { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary:hover, details[open] summary { background: var(--ps-section-muted); }
  .settings-panel { position: absolute; top: calc(100% + 8px); right: 12px; width: min(280px, calc(100vw - 24px)); display: grid; gap: 16px; padding: 20px; background: var(--ps-section-standard); border: 1px solid var(--ps-border); border-radius: var(--ps-radius); box-shadow: 0 12px 32px #0002; }
  @media (min-width: 1600px) {
    nav { padding-top: 16px; min-height: 80px; }
    .header { width: min(var(--ps-content-max), calc(100% - 272px)); margin-inline: auto; min-height: 64px; border: 1px solid var(--ps-border); border-radius: var(--ps-radius); }
    .satellite { display: flex; align-items: center; justify-content: center; position: absolute; top: 28px; min-width: 80px; min-height: 40px; background: var(--ps-section-standard); border: 1px solid var(--ps-border); border-radius: 12px; }
    .left { left: 28px; } .right { right: 28px; }
    .settings { display: none; }
  }
  @media (min-width: 1809px) { .header { width: min(var(--ps-content-max), 100%); } }
</style>
