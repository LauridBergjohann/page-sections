<script lang="ts">
  import { HeadingSection, Section } from '@page-sections/svelte';

  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage page={{ title: 'Reference' }} showContentMenu={false}>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Reference',
      introduction: 'Look up components, core functions and design tokens.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'overview',
      title: 'Reference',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
