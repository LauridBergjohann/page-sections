<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { Navigation, PageShell } from '@page-sections/svelte';
  import Menu from '@lucide/svelte/icons/menu';
  import Settings from '@lucide/svelte/icons/settings';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import Github from '$lib/GitHubMark.svelte';
  import SiteSearch from '$lib/SiteSearch.svelte';
  import NavigationIcon from '$lib/NavigationIcon.svelte';
  import { navigationTree } from '$lib/navigation';
  import { resolveNavigation } from '@page-sections/core';
  import { version } from '../../../../packages/svelte/package.json';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
  let mode = $state<'light' | 'dark'>('light');
  let ready = $state(false);
  onMount(() => {
    ready = true;
    try {
      const stored = localStorage.getItem('page-sections-theme');
      if (stored === 'light' || stored === 'dark') mode = stored;
    } catch {
      /* Storage is optional. */
    }
  });
  function setMode(value: string) {
    if (value !== 'light' && value !== 'dark') return;
    mode = value;
    try {
      localStorage.setItem('page-sections-theme', value);
    } catch {
      /* The choice still applies in memory. */
    }
  }
  const items = $derived(resolveNavigation(navigationTree, { pathname: page.url.pathname }).items);
</script>

<PageShell {mode}>
  <header class="website-header">
    <Navigation {items} closeKey={page.url.pathname}>
      {#snippet itemIcon(item)}<NavigationIcon name={item.icon} />{/snippet}
      {#snippet brand()}
        <a class="skip-link" href="#main-content">Skip to content</a>
        <a class="site-brand" href={base + '/'} aria-label="Page Sections home">
          <img src={base + '/page-sections-logo.svg'} width="32" height="32" alt="" />
          <span>Page Sections</span>
        </a>
      {/snippet}
      {#snippet menuIcon()}<Menu size={20} aria-hidden="true" />{/snippet}
      {#snippet settingsIcon()}<Settings size={20} aria-hidden="true" />{/snippet}
      {#snippet tools()}
        <div class="header-tools">
          <SiteSearch />
          <a
            class="github-link"
            href="https://github.com/LauridBergjohann/page-sections"
            aria-label="Page Sections on GitHub"
            title="Source on GitHub"><Github /></a
          >
        </div>
      {/snippet}
      {#snippet right()}
        <div class="appearance" role="group" aria-label="Appearance">
          <button
            type="button"
            aria-label="Light"
            title="Light"
            aria-pressed={mode === 'light'}
            disabled={!ready}
            onclick={() => setMode('light')}><Sun size={18} aria-hidden="true" /></button
          >
          <button
            type="button"
            aria-label="Dark"
            title="Dark"
            aria-pressed={mode === 'dark'}
            disabled={!ready}
            onclick={() => setMode('dark')}><Moon size={18} aria-hidden="true" /></button
          >
        </div>
      {/snippet}
    </Navigation>
  </header>
  <div id="main-content" tabindex="-1">{@render children()}</div>
  <footer class="site-footer">
    <a class="site-brand" href={base + '/'}
      ><img src={base + '/page-sections-logo.svg'} alt="" width="24" height="24" />Page Sections
      <span class="version">v{version}</span></a
    >
    <span>Made with Page Sections.</span>
    <a href="https://github.com/LauridBergjohann/page-sections">Source on GitHub ↗</a>
  </footer>
</PageShell>

<style>
  .header-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .github-link {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    color: var(--ps-ink);
  }
  .github-link:hover {
    background: var(--ps-section-muted);
  }
  @media (min-width: 1200px) {
    .website-header :global(.desktop-menu > ul) {
      justify-content: center;
    }
    .website-header :global(.brand) {
      margin-inline-end: clamp(1.5rem, 3vw, 4rem);
    }
    .website-header :global(.tools) {
      margin-inline-start: 1.5rem;
    }
  }
  .appearance {
    display: flex;
  }
  .appearance button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--ps-ink);
    cursor: pointer;
  }
  .appearance [aria-pressed='true'] {
    background: var(--ps-section-muted);
  }
  .appearance button:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
