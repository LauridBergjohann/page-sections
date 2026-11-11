<script lang="ts">
  import { HeadingSection, Section } from '@page-sections/svelte';

  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage page={{ title: 'Foundations' }} showContentMenu={false}>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Foundations',
      introduction: 'Understand page composition, responsive layouts, themes and backgrounds.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'overview',
      title: 'Foundations',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
