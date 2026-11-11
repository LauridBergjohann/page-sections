<script lang="ts">
  import WebsitePage from '$lib/WebsitePage.svelte';
  import { Section } from '@page-sections/svelte';
</script>

<WebsitePage
  page={{
    title: 'Building blocks',
    intro: 'Combine navigation and smaller components into your own layouts.'
  }}
  showContentMenu={false}
>
  <Section
    section={{ id: 'overview', title: 'Building blocks', background: { color: 'standard' } }}
  >
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
