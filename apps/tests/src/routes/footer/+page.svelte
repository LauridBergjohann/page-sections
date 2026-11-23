<script lang="ts">
  import { Footer, PageShell } from '@page-sections/svelte';
  let identity = $state(true);
  let menus = $state(true);
  let dark = $state(false);
  let custom = $state(false);
  const links = [
    { label: 'Imprint', href: '/examples/legal/' },
    { label: 'Privacy', href: '/examples/legal/' },
    { label: 'Licence', href: '/examples/legal/' }
  ];
  const groups = Array.from({ length: 4 }, (_, index) => ({
    label: `Product ${index + 1}`,
    href: index % 2 ? undefined : '/examples/',
    links: [
      { label: 'Overview', href: '/examples/' },
      { label: 'Getting started', href: '/components/' },
      { label: 'Components', href: '/components/' },
      { label: 'Themes', href: '/backgrounds/' },
      { label: 'Roadmap', href: '/examples/' }
    ]
  }));
</script>

{#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 4h16v12H8l-4 4V4Z" />
  </svg>{/snippet}
{#snippet brand()}<a href="/" class:customBrand={custom}><strong>Example brand</strong></a>
  <p>Composable Svelte components for content-driven websites.</p>{/snippet}

<div class="fixture-controls">
  <label><input type="checkbox" bind:checked={identity} /> Brand and social</label>
  <label><input type="checkbox" bind:checked={menus} /> Menu</label>
  <label><input type="checkbox" bind:checked={dark} /> Dark footer</label>
  <label><input type="checkbox" bind:checked={custom} /> Custom footer theme</label>
</div>
<PageShell
  mode={dark ? 'dark' : 'light'}
  theme={custom
    ? {
        footerBackground: '#123456',
        footerInk: '#fedcba',
        footerRadius: '4px',
        footerShadow: 'none',
        footerBarBackground: '#654321',
        footerBarInk: '#abcdef'
      }
    : undefined}
>
  <div class="footer-fixture">
    <Footer
      brand={identity ? brand : undefined}
      social={identity
        ? ['GitHub', 'YouTube', 'Twitter', 'Community', 'Photos', 'News'].map((label) => ({
            label,
            href: '/examples/',
            icon
          }))
        : []}
      menu={menus ? groups : []}
      footnote="© 2026 Page Sections. All rights reserved."
      {links}
    />
  </div>
</PageShell>

<style>
  .customBrand {
    color: #ffcc00;
    text-decoration: underline;
  }
  .fixture-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
  }
  .footer-fixture {
    padding-top: 80px;
    background: var(--ps-background);
  }
</style>
