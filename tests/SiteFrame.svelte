<script lang="ts">
  import { PageShell, Header, ContentPage, Footer } from '../packages/svelte/src/index.js';
  let { legacy = false }: { legacy?: boolean } = $props();
</script>

{#snippet ending()}<a href="/next/">Next chapter</a>{/snippet}
<PageShell>
  <Header id="site-header" class="custom-header" aria-label="Site header" items={[{ id: 'docs', label: 'Docs', href: '/docs/' }]}>
    {#snippet brand()}<a href="/">Site brand</a>{/snippet}
    {#snippet tools()}<button type="button">Search site</button>{/snippet}
    {#snippet right()}<button type="button">Appearance</button>{/snippet}
  </Header>
  <ContentPage page={{ title: 'Example' }} pageEnd={legacy ? undefined : ending}>
    <h1>Example</h1>
    {#snippet leftSidebar()}<p>Related content</p>{/snippet}
    {#snippet footer()}<p>Legacy page ending</p>{/snippet}
  </ContentPage>
  <Footer footnote="Site copyright" links={[{ label: 'Privacy', href: '/privacy/' }]} />
</PageShell>
