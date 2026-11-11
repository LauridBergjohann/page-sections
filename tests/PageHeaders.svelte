<script lang="ts">
  import { ContentPage, HeroSection, Section } from '../packages/svelte/src/index.js';
  let { custom = false }: { custom?: boolean } = $props();
</script>
<svelte:head>{#if !custom}<title>Host SEO title</title>{/if}</svelte:head>
{#if custom}
  <ContentPage page={{ title: 'Custom page' }} showContentMenu>
    {#snippet header(page, titleId)}<header><h1 id={titleId}>{page.title} header</h1></header>{/snippet}
    <Section section={{ id: 'details', title: 'Details' }}>Details</Section>
  </ContentPage>
{:else}
  <ContentPage page={{ title: 'Hero page' }} showHeader={false} manageDocumentTitle={false}
    id="content" lang="de" aria-labelledby="welcome-title" showContentMenu>
    <HeroSection section={{ id: 'welcome', title: 'Welcome', headline: 'Hello from the hero', headingLevel: 1 }} />
    <Section section={{ id: 'details', title: 'Details', headline: 'More details' }}>Details</Section>
  </ContentPage>
{/if}
