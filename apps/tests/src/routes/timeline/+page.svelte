<script lang="ts">
  import { ButtonGroup, ContentPage, Sections } from '@page-sections/svelte';
  import { timelineExample } from '../../../../website/src/lib/timelineExample.js';
  let direction = $state<'ascending' | 'descending'>('ascending');
</script>

<ContentPage page={{ title: 'Timeline test' }} showContentMenu>
  <ButtonGroup
    label="Time direction"
    items={[
      { id: 'ascending', label: 'Oldest first', selected: direction === 'ascending' },
      { id: 'descending', label: 'Newest first', selected: direction === 'descending' }
    ]}
    onselect={(item) => (direction = item.id as typeof direction)}
  />
  <div class="timeline-example"><Sections sections={[{ ...timelineExample, direction }]} /></div>
</ContentPage>
