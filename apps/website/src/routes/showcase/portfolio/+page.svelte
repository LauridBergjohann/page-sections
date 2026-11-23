<script lang="ts">
  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';
  import { Sections } from '@page-sections/svelte';
  import { portfolio } from '#lib/examples.js';
</script>

<ContentPage page={portfolio}><Sections sections={portfolio.sections} /></ContentPage>
