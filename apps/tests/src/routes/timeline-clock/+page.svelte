<script lang="ts">
  import { ContentPage, TimelineSection } from '@page-sections/svelte';
  import { timelineExample } from '../../../../website/src/lib/timelineExample.js';
</script>

<ContentPage page={{ title: 'Timeline clock test' }}>
  <TimelineSection section={{ ...timelineExample, end: undefined, referenceDate: undefined }} />
</ContentPage>
