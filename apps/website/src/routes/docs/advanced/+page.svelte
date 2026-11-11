<script lang="ts">
  import WebsitePage from '$lib/WebsitePage.svelte';
  import { Section } from '@page-sections/svelte';
</script>

<WebsitePage
  page={{
    title: 'Advanced',
    intro: 'Connect data sources, add custom sections and render on the server.'
  }}
  showContentMenu={false}
>
  <Section section={{ id: 'overview', title: 'Advanced', background: { color: 'standard' } }}>
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
