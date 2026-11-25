<script lang="ts">
  import { onMount } from 'svelte';
  import { ButtonGroup, ContentPage, TimelineSection } from '@page-sections/svelte';
  import { timelineExample } from '../../../../website/src/lib/timelineExample.js';
  let direction = $state<'ascending' | 'descending'>('descending');
  let axisPosition = $state<'top' | 'bottom'>('bottom');
  let categories = $state(timelineExample.categories);
  onMount(() => {
    const remove = () => {
      categories = categories.filter((category) => category.id !== 'publications');
    };
    const rename = () => {
      categories = categories.map((category) => ({
        ...category,
        events: category.events.map((event) =>
          event.id === 'mh-projects-data-platform'
            ? { ...event, title: 'Updated platform details' }
            : event
        )
      }));
    };
    window.addEventListener('remove-publications', remove);
    window.addEventListener('rename-platform', rename);
    return () => {
      window.removeEventListener('remove-publications', remove);
      window.removeEventListener('rename-platform', rename);
    };
  });
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
  <ButtonGroup
    label="Axis position"
    items={[
      { id: 'top', label: 'Axis above', selected: axisPosition === 'top' },
      { id: 'bottom', label: 'Axis below', selected: axisPosition === 'bottom' }
    ]}
    onselect={(item) => (axisPosition = item.id as typeof axisPosition)}
  />
  <TimelineSection
    section={{ ...timelineExample, stageWidth: 'full', direction, axisPosition, categories }}
  />
</ContentPage>
