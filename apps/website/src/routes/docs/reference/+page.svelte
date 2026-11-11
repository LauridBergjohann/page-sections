<script lang="ts">
  import WebsitePage from '$lib/WebsitePage.svelte';
  import { Section } from '@page-sections/svelte';
</script>

<WebsitePage
  page={{ title: 'Reference', intro: 'Look up components, core functions and design tokens.' }}
  showContentMenu={false}
>
  <Section section={{ id: 'overview', title: 'Reference', background: { color: 'standard' } }}>
    <p>
      Follow the chapters below in order, or choose the topic you need. Each chapter includes
      examples and links to continue reading.
    </p>
  </Section>
</WebsitePage>
