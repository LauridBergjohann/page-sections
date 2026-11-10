<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Sections } from '@page-sections/svelte';
  import { legal } from '$lib/examples';
</script>

<ContentPage page={legal}><Sections sections={legal.sections} /></ContentPage>
