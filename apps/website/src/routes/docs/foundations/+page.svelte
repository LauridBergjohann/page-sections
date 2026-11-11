<script lang="ts">
  import WebsitePage from '$lib/WebsitePage.svelte';
  import { Section } from '@page-sections/svelte';
</script>

<WebsitePage
  page={{
    title: 'Foundations',
    intro: 'Understand page composition, responsive layouts, themes and backgrounds.'
  }}
  showContentMenu={false}
>
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
