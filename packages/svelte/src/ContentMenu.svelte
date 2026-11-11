<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveActiveContentSection, type SectionNavigationItem } from '@page-sections/core';
  let {
    items,
    host,
    label = 'On this page'
  }: {
    items: SectionNavigationItem[];
    host?: HTMLElement;
    label?: string;
  } = $props();
  let activeId = $state<string>();
  let popup: HTMLDetailsElement;
  let ready = $state(false);
  let schedule = () => {};
  $effect(() => {
    void items;
    schedule();
  });
  function close(focus = false) {
    if (!popup?.open) return;
    popup.open = false;
    if (focus) popup.querySelector('summary')?.focus();
  }
  onMount(() => {
    ready = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = items.flatMap((item) => {
        const element = host?.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        return [{ id: item.id, top: rect.top, bottom: rect.bottom }];
      });
      activeId = resolveActiveContentSection(
        bounds,
        16,
        innerHeight,
        scrollY,
        Math.max(0, document.documentElement.scrollHeight - innerHeight)
      );
    };
    schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    if (host) resize.observe(host);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      schedule = () => {};
    };
  });
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape' && popup?.open) {
      close(true);
      event.preventDefault();
    }
  }}
  onclick={(event) => {
    if (event.target instanceof Node && !popup?.contains(event.target)) close();
  }}
  onresize={() => {
    if (innerWidth >= 1600) close();
  }}
/>

{#snippet links()}
  <nav aria-label={label}>
    <p>{label}</p>
    <ul>
      {#each items as item (item.id)}
        <li>
          <a
            href={`#${item.id}`}
            aria-current={activeId === item.id ? 'location' : undefined}
            onclick={() => {
              activeId = item.id;
              close(true);
            }}>{item.title}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
{/snippet}

<div class="desktop">{@render links()}</div>
<details bind:this={popup} class="mobile" data-enhanced={ready}>
  <!-- svelte-ignore a11y_no_redundant_roles (Keep styled disclosures exposed as buttons in browser accessibility trees.) -->
  <summary role="button" aria-label={label} title={label}
    ><svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"><path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" /></svg
    ></summary
  >
  <div class="popup">
    {#if ready}<button
        class="close"
        type="button"
        aria-label="Close content menu"
        onclick={() => close(true)}>×</button
      >{/if}
    {@render links()}
  </div>
</details>

<style>
  .desktop {
    display: none;
  }
  nav {
    padding: 1rem;
    font-size: 0.875rem;
  }
  p {
    margin: 0 1.25rem 0.75rem 0;
    font-weight: 650;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  nav a {
    display: flex;
    gap: 0.65rem;
    align-items: baseline;
    color: var(--ps-body);
    text-decoration: none;
    padding: 0.5rem 0;
    overflow-wrap: anywhere;
  }
  a::before {
    content: '';
    display: block;
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
  }
  a[aria-current='location'] {
    color: var(--ps-accent);
    font-weight: 650;
  }
  a[aria-current='location']::before {
    opacity: 1;
  }
  a:hover {
    text-decoration: underline;
  }
  .mobile {
    position: relative;
    margin-inline-end: 12px;
  }
  summary {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    list-style: none;
    border: 1px solid var(--ps-border);
    border-radius: 0.5rem;
    background: var(--ps-section-standard);
    box-shadow: var(--ps-surface-shadow);
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .popup {
    position: absolute;
    top: 48px;
    right: 0;
    width: min(280px, calc(100vw - 24px));
    max-height: calc(100dvh - 96px);
    overflow: auto;
    overscroll-behavior: contain;
    background: var(--ps-section-standard);
    border-radius: var(--ps-radius);
    box-shadow: var(--ps-surface-shadow);
  }
  .close {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 1.5rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
  }
  @media (min-width: 1600px) {
    .mobile {
      display: none;
    }
    .desktop {
      display: block;
      position: sticky;
      top: var(--ps-sidebar-sticky-top);
      max-height: calc(100dvh - 2 * var(--ps-sidebar-sticky-top));
      overflow: auto;
      overscroll-behavior: contain;
      background: var(--ps-section-standard);
      border-radius: var(--ps-content-menu-radius, 0 var(--ps-radius) var(--ps-radius) 0);
      box-shadow: var(--ps-content-menu-shadow, none);
    }
  }
</style>
