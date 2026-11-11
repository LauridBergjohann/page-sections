<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Sections } from '@page-sections/svelte';
  import { portfolio } from '$lib/examples';
</script>

<ContentPage page={portfolio}><Sections sections={portfolio.sections} /></ContentPage>
