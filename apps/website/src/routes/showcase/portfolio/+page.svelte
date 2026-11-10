<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Sections } from '@page-sections/svelte';
  import { portfolio } from '$lib/examples';
</script>

<ContentPage page={portfolio}><Sections sections={portfolio.sections} /></ContentPage>
