<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Settings from '@lucide/svelte/icons/settings';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Code from '@lucide/svelte/icons/code';
  import Menu from '@lucide/svelte/icons/menu';
  import { PageShell, Navigation } from '@page-sections/svelte';
  import '../app.css';

  let { children }: { children: Snippet } = $props();
  let mode = $state<'light' | 'dark'>('light');
  let ready = $state(false);
  onMount(() => { ready = true; });
  const menuItems = $derived([
    { id: 'home', label: 'Home', href: '/', current: page.route.id === '/' },
    { id: 'components', label: 'Components', href: '/components/', current: page.route.id === '/components' },
    { id: 'backgrounds', label: 'Backgrounds', href: '/backgrounds/', current: page.route.id === '/backgrounds' },
    { id: 'examples', label: 'Examples', href: '/examples/', current: page.url.pathname.startsWith('/examples') }
  ]);
</script>

<PageShell {mode}>
  <Navigation items={menuItems} closeKey={page.url.pathname} scrollBehavior="delayed">
    {#snippet brand()}
      <a class="skip-link" href="#main-content">Skip to content</a>
      <a class="demo-brand" href="/" aria-label="Page Sections home">
        <img class="brand-mark" src="/page-sections-logo.svg" width="28" height="28" alt="" />
        <span class="brand-name">Page Sections</span>
      </a>
    {/snippet}
    {#snippet menuIcon()}<Menu size={20} aria-hidden="true" />{/snippet}
    {#snippet settingsIcon()}<Settings size={20} aria-hidden="true" />{/snippet}
    {#snippet left()}
      <div class="demo-icon-group" role="group" aria-label="Project resources">
        <a href="https://github.com/LauridBergjohann/page-sections/wiki" aria-label="Documentation" title="Documentation"><BookOpen size={18} aria-hidden="true" /></a>
        <a href="https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo" aria-label="Source code" title="Source code"><Code size={18} aria-hidden="true" /></a>
      </div>
    {/snippet}
    {#snippet right()}
      <div class="demo-icon-group" role="group" aria-label="Theme">
        <button type="button" aria-label="Light" title="Light" aria-pressed={mode === 'light'} disabled={!ready} onclick={() => mode = 'light'}><Sun size={18} aria-hidden="true" /></button>
        <button type="button" aria-label="Dark" title="Dark" aria-pressed={mode === 'dark'} disabled={!ready} onclick={() => mode = 'dark'}><Moon size={18} aria-hidden="true" /></button>
      </div>
    {/snippet}
  </Navigation>
  <div id="main-content" tabindex="-1">{@render children()}</div>
  <footer class="demo-footer"><span class="footer-brand"><img src="/page-sections-logo.svg" width="24" height="24" alt="" />Page Sections · Built from ordinary content.</span><a href="https://github.com/LauridBergjohann/page-sections">Explore the project ↗</a></footer>
</PageShell>
