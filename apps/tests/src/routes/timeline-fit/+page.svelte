<script lang="ts">
  import { ContentPage, TimelineSection } from '@page-sections/svelte';
  import { timelineExample } from '../../../../website/src/lib/timelineExample.js';
</script>

<ContentPage page={{ title: 'Timeline fit test' }}>
  <TimelineSection section={{ ...timelineExample, initialScale: 0.00001 }} />
</ContentPage>
