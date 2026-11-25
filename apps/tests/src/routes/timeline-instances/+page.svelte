<script lang="ts">
  import { ContentPage, TimelineSection } from '@page-sections/svelte';
  import { timelineExampleFor } from '../../../../website/src/lib/timelineExample.js';
</script>

<ContentPage page={{ title: 'Multiple timelines' }}>
  {#each ['first-timeline', 'second-timeline'] as id}
    <TimelineSection
      section={{ ...timelineExampleFor('', id, true), stageWidth: 'contained', spacing: 'tight' }}
    >
      {#snippet eventIcon(event)}
        <svg
          data-custom-icon={event.id}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M2 8h12M8 2v12" stroke="currentColor" />
        </svg>
      {/snippet}
    </TimelineSection>
  {/each}
</ContentPage>
