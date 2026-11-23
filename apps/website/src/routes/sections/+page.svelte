<script lang="ts">
  import SectionCatalog from '#lib/SectionCatalog.svelte';
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, Sections } from '@page-sections/svelte';
  import ContentPage from '#lib/WebsitePage.svelte';
  import { sectionCatalog } from '#lib/sectionCatalog.js';
  import { sectionExample } from '#lib/sectionExamples.js';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Sections', pageTitle: 'Sections · Page Sections' }}>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Sections',
      headingLevel: 1,
      headingSize: 'l',
      introduction:
        'Nine building blocks for your content. Pick a section, try its live example and explore the details.',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <SectionCatalog />
  <HeadingSection
    section={{
      id: 'examples-heading',
      title: 'Example Sections',
      headingLevel: 2,
      headingSize: 'l',
      introduction: "Below you'll find examples of all the sections..",
      background: { color: 'standard', size: 'standard' }
    }}
  />
  {#each sectionCatalog as item, index (item.slug)}
    <Section
      section={{
        id: item.slug,
        title: item.title,
        headline: item.title,
        headingLevel: 3,
        headingSize: 'm',
        introduction: item.description,
        background: { color: index % 2 === 0 ? 'muted' : 'standard', size: 'standard' }
      }}
    >
      <Sections sections={[sectionExample(item.slug)]} codeHighlights={data.codeHighlights} />
      <p class="detail-link"><a href={base + item.href}>Explore {item.title} →</a></p>
    </Section>
  {/each}
</ContentPage>

<style>
  .detail-link {
    margin-block: 20px 0;
    font-weight: 600;
  }
</style>
