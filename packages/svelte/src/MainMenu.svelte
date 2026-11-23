<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import { safeHref, type MenuItem } from '@page-sections/core';
  import SidebarNavigation from './SidebarNavigation.svelte';
  import { selectionIndicator } from './selectionIndicator.js';
  import './selectionIndicator.css';
  let {
    items,
    variant = 'desktop',
    icon,
    closeKey,
    onOpenChange
  }: {
    items: MenuItem[];
    variant?: 'desktop' | 'mobile';
    icon?: Snippet<[MenuItem]>;
    closeKey?: unknown;
    onOpenChange?: (open: boolean) => void;
  } = $props();
  let open = $state<string>();
  let host = $state<HTMLUListElement>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const active = (item: MenuItem): boolean =>
    !!(item.current || item.active || item.children?.some(active));
  function cancel() {
    clearTimeout(timer);
  }
  function show(item: MenuItem) {
    cancel();
    open = item.children?.length ? item.id : undefined;
  }
  function close() {
    cancel();
    open = undefined;
  }
  function leave() {
    cancel();
    timer = setTimeout(close, 180);
  }
  $effect(() => {
    void closeKey;
    close();
  });
  $effect(() => {
    onOpenChange?.(!!open);
  });
  onDestroy(cancel);
  function escape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !open) return;
    const link = host?.querySelector<HTMLAnchorElement>(`[data-menu-id="${CSS.escape(open)}"]`);
    if (host?.contains(document.activeElement)) link?.focus();
    close();
    event.preventDefault();
  }
</script>

<svelte:window
  onkeydown={escape}
  onclick={(event) => {
    if (event.target instanceof Node && !host?.contains(event.target)) close();
  }}
/>
{#if variant === 'mobile'}
  <SidebarNavigation {items} {icon} label="Mobile pages" />
{:else}
  <ul bind:this={host} class="ps-main-menu ps-selection-track"
    use:selectionIndicator={{ items: ':scope > li > a', selected: '.active' }}>
    {#each items as item (item.id)}
      <li
        onpointerenter={(event) => {
          if (event.pointerType !== 'touch') show(item);
        }}
        onpointerleave={leave}
        onfocusin={() => show(item)}
        onfocusout={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) leave();
        }}
      >
        <a
          href={safeHref(item.href)}
          data-menu-id={item.id}
          class:active={active(item)}
          aria-current={item.current ? 'page' : undefined}
          aria-expanded={item.children?.length ? open === item.id : undefined}
          onclick={close}
          >{#if icon && item.icon}<span class="icon" aria-hidden="true">{@render icon(item)}</span
            >{/if}{item.label}</a
        >
        {#if item.children?.length}
          <div class="ps-submenu" hidden={open !== item.id}>
            <ul>
              {#each item.children as child (child.id)}
                <li>
                  <a
                    href={safeHref(child.href)}
                    class:active={active(child)}
                    aria-current={child.current ? 'page' : undefined}
                    onclick={close}
                  >
                    {#if icon && child.icon}<span class="icon" aria-hidden="true"
                        >{@render icon(child)}</span
                      >{/if}
                    {child.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    min-width: 0;
  }
  .ps-main-menu > li {
    position: relative;
    flex: none;
  }
  .ps-main-menu { flex-wrap: nowrap; }
  .ps-main-menu > li > a {
    white-space: nowrap;
    min-height: var(--ps-menu-height);
    border-radius: 0;
  }
  a[aria-current='page'] {
    font-weight: 650;
  }
  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1rem;
    color: var(--ps-ink);
    text-decoration: none;
    position: relative;
    border-radius: 0.5rem;
  }
  a:hover { text-decoration: none; }
  a:hover,
  a[aria-expanded='true'],
  a.active,
  a:focus-visible {
    background: var(--ps-selection, var(--ps-section-muted));
  }
  .ps-main-menu > li > a.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(50% - 20px);
    width: 40px;
    height: 3px;
    border-radius: 2px;
    background: var(--ps-accent);
  }
  .ps-submenu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: calc(100vw - 32px);
    padding: 1rem;
    background: var(--ps-section-standard);
    border: 1px solid var(--ps-panel-border);
    border-radius: var(--ps-radius);
    box-shadow: var(--ps-navigation-shadow);
    z-index: 2;
  }
  .ps-submenu ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
  .ps-submenu a {
    height: 100%;
    min-height: 48px;
  }
  .icon {
    display: flex;
    flex: none;
  }
  .ps-main-menu:global([data-ps-selection-ready]) > li > a.active { background: transparent; }
  .ps-main-menu:global([data-ps-selection-ready]) > li > a.active::after { content: none; }
  .ps-main-menu:global([data-ps-selection-ready])::after {
    content: ''; position: absolute; top: 0; left: 0; width: 40px; height: 3px;
    border-radius: 2px; background: var(--ps-accent); pointer-events: none;
    transform: translate3d(calc(var(--ps-selection-x) + (var(--ps-selection-width) - 40px) / 2), calc(var(--ps-selection-y) + var(--ps-selection-height) - 3px), 0);
  }
  .ps-main-menu:global([data-ps-selection-animated])::after { transition: transform 180ms ease; }
  @media (prefers-reduced-motion: reduce) {
    .ps-main-menu:global([data-ps-selection-animated])::after { transition: none; }
  }
</style>
