<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { ButtonGroup, Footer, Header, PageShell } from '@page-sections/svelte';
  import Menu from '@lucide/svelte/icons/menu';
  import Settings from '@lucide/svelte/icons/settings';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import Globe from '@lucide/svelte/icons/globe';
  import Github from '$lib/GitHubMark.svelte';
  import LinkedIn from '$lib/LinkedInMark.svelte';
  import BrandMark from '$lib/BrandMark.svelte';
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

{#snippet githubIcon()}<Github />{/snippet}
{#snippet linkedinIcon()}<LinkedIn />{/snippet}
{#snippet npmIcon()}<BrandMark kind="npm" />{/snippet}
{#snippet vercelIcon()}<BrandMark kind="vercel" />{/snippet}
{#snippet svelteIcon()}<BrandMark kind="svelte" />{/snippet}
{#snippet globeIcon()}<Globe aria-hidden="true" />{/snippet}

{#if page.url.pathname.startsWith(base + '/examples/page-layout/')}
  {@render children()}
{:else}
  <PageShell {mode}>
    <Header class="website-header" {items} closeKey={page.url.pathname} scrollBehavior="delayed">
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
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/LauridBergjohann/page-sections"
            aria-label="Page Sections on GitHub"
            title="Source on GitHub"><Github /></a
          >
          <a
            class="github-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.npmjs.com/package/@page-sections/svelte"
            aria-label="Page Sections on NPM"
            title="Package on NPM"><BrandMark kind="npm" /></a
          >
        </div>
      {/snippet}
      {#snippet right()}
        <ButtonGroup
          label="Appearance"
          iconOnly
          items={[
            { id: 'light', label: 'Light', selected: mode === 'light', disabled: !ready },
            { id: 'dark', label: 'Dark', selected: mode === 'dark', disabled: !ready }
          ]}
          onselect={(item) => setMode(item.id)}
        >
          {#snippet icon(item)}
            {#if item.id === 'light'}<Sun size={18} />{:else}<Moon size={18} />{/if}
          {/snippet}
        </ButtonGroup>
      {/snippet}
    </Header>
    <div id="main-content" tabindex="-1">{@render children()}</div>
    <Footer
      class="site-footer"
      footnote="© 2026 Page Sections."
      links={[
        { label: 'Imprint', href: base + '/about/#impressum' },
        { label: 'Privacy', href: base + '/about/#datenschutz' },
        {
          label: 'Licence',
          href: 'https://github.com/LauridBergjohann/page-sections/blob/main/LICENSE'
        }
      ]}
      social={[
        {
          label: 'GitHub',
          href: 'https://github.com/LauridBergjohann/page-sections',
          icon: githubIcon
        },
        {
          label: 'NPM',
          href: 'https://www.npmjs.com/package/@page-sections/svelte',
          icon: npmIcon
        },
        { label: 'Vercel', href: 'https://vercel.com/', icon: vercelIcon },
        { label: 'Bergjohann', href: 'https://bergjohann.com/', icon: globeIcon },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/laurid-bergjohann',
          icon: linkedinIcon
        },
        { label: 'Svelte', href: 'https://svelte.dev/', icon: svelteIcon }
      ]}
      menu={[
        {
          label: 'Product',
          href: base + '/',
          links: [
            { label: 'Getting started', href: base + '/getting-started/' },
            { label: 'Sections', href: base + '/sections/' },
            { label: 'About', href: base + '/about/' }
          ]
        },
        {
          label: 'Documentation',
          href: base + '/docs/',
          links: [
            { label: 'Foundations', href: base + '/docs/foundations/' },
            { label: 'Page layout', href: base + '/docs/page-layout/' },
            { label: 'Components', href: base + '/docs/building-blocks/' },
            { label: 'Design system', href: base + '/docs/design-system/' },
            { label: 'Advanced', href: base + '/docs/advanced/' },
            { label: 'Reference', href: base + '/docs/reference/' }
          ]
        },
        {
          label: 'Page layout',
          href: base + '/docs/page-layout/',
          links: [
            { label: 'Header', href: base + '/docs/page-layout/header/' },
            { label: 'Footer', href: base + '/docs/page-layout/footer/' },
            { label: 'Themes', href: base + '/docs/foundations/themes/' }
          ]
        },
        {
          label: 'Resources',
          links: [
            { label: 'Svelte API', href: base + '/docs/reference/svelte-api/' },
            { label: 'Core API', href: base + '/docs/reference/core-api/' },
            { label: 'Layout tokens', href: base + '/docs/reference/tokens/' }
          ]
        }
      ]}
    >
      {#snippet brand()}
        <a class="site-brand" href={base + '/'}>
          <img src={base + '/page-sections-logo-footer.svg'} alt="" width="32" height="32" />
          Page Sections <span class="version">v{version}</span>
        </a>
        <p>Composable Svelte components for content-driven websites.</p>
      {/snippet}
    </Footer>
  </PageShell>
{/if}

<style>
  .header-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .github-link {
    outline: 1px solid var(--ps-border);
    outline-offset: -1px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    color: var(--ps-ink);
  }
  .github-link:focus-visible {
    outline: 2px solid var(--ps-accent);
    outline-offset: 2px;
  }
  .github-link:hover {
    background: var(--ps-selection, var(--ps-section-muted));
  }
  .github-link :global(svg) {
    width: 22px;
    height: 22px;
  }
  @media (max-width: 599.98px) {
    .github-link {
      display: none;
    }
    .site-brand {
      gap: 0.5rem;
      font-size: 0.875rem;
    }
  }
  @media (min-width: 1200px) {
    :global(.website-header .desktop-menu > ul) {
      justify-content: center;
    }
    :global(.website-header .brand) {
      margin-inline-end: clamp(1.5rem, 3vw, 4rem);
    }
    :global(.website-header .tools) {
      margin-inline-start: 1.5rem;
    }
  }
</style>
