<script lang="ts">
  import { ContentPage, Sections } from '@page-sections/svelte';
  import { catalog } from '#lib/examples.js';
</script>

<ContentPage page={catalog}><Sections sections={catalog.sections} /></ContentPage>
