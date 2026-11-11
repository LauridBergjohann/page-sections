<script lang="ts">
  import WebsitePage from '$lib/WebsitePage.svelte';
  import { Section } from '@page-sections/svelte';
</script>

<WebsitePage
  page={{
    title: 'Sections',
    intro: 'Choose the right section for text, media, code and collections.'
  }}
  showContentMenu={false}
>
  <Section
    section={{
      id: 'overview',
      title: 'Sections',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
