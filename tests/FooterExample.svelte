<script lang="ts">
  import { Footer, PageShell } from '../packages/svelte/src/index.js';
  import type { FooterMenuGroup } from '@page-sections/core';
  let { groups = [], identity = true }: { groups?: FooterMenuGroup[]; identity?: boolean } = $props();
</script>
{#snippet icon()}<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>{/snippet}
{#snippet brand()}<a href="/">Example brand</a><p>A short description.</p>{/snippet}
<PageShell theme={{ footerBackground: '#123456', footerInk: '#fff', footerRadius: '8px', footerShadow: 'none', footerBarBackground: '#ddd', footerBarInk: '#333' }}>
  <Footer
    brand={identity ? brand : undefined}
    social={identity ? [{ label: 'Community', href: '/community/', icon }] : []}
    menu={groups}
    links={[{ label: 'Privacy', href: '/privacy/' }, { label: 'Unsafe', href: 'javascript:alert(1)' }]}
  >
    {#snippet footnote()}<span>© Example <a href="/about/">About</a></span>{/snippet}
  </Footer>
</PageShell>
