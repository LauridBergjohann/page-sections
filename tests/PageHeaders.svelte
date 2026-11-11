<script lang="ts">
  import { ContentPage, HeadingSection, HeroSection, Section } from '../packages/svelte/src/index.js';
  let { custom = false }: { custom?: boolean } = $props();
</script>
<svelte:head>{#if !custom}<title>Host SEO title</title>{/if}</svelte:head>
{#if custom}
  <ContentPage page={{ title: 'Custom page' }} aria-labelledby="custom-title" showContentMenu>
    <HeadingSection section={{ id: 'custom', title: 'Custom page header', headingLevel: 1, headingSize: 'm', background: { color: 'muted', size: 'full' } }} />
    <Section section={{ id: 'details', title: 'Details', headline: 'Details' }}>
      <Section section={{ id: 'nested', title: 'Nested', headline: 'Nested' }}>
        <Section section={{ id: 'deep', title: 'Deep', headline: 'Deep' }}>Deep content</Section>
      </Section>
    </Section>
    <Section section={{ id: 'unheaded', title: 'Unheaded' }}>No heading</Section>
  </ContentPage>
{:else}
  <ContentPage page={{ title: 'Hero page' }} manageDocumentTitle={false}
    id="content" lang="de" aria-labelledby="welcome-title" showContentMenu>
    <HeroSection section={{ id: 'welcome', title: 'Welcome', headline: 'Hello from the hero', headingLevel: 1 }} />
    <Section section={{ id: 'details', title: 'Details', headline: 'More details' }}>Details</Section>
  </ContentPage>
{/if}
