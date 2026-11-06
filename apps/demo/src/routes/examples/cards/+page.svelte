<script lang="ts">
  import { ContentPage, Sections } from '@page-sections/svelte';
  import { catalog } from '$lib/examples';
</script>
<ContentPage page={catalog}><Sections sections={catalog.sections} /></ContentPage>
