<script lang="ts">
  import { ContentPage, TimelineSection, type TimelineSectionData } from '@page-sections/svelte';
  const section: TimelineSectionData = {
    type: 'timeline',
    id: 'dense',
    title: 'Dense timeline',
    headline: 'Dense timeline',
    start: '1900',
    end: '2026',
    categories: Array.from({ length: 12 }, (_, category) => ({
      id: String(category),
      title: `Category ${category + 1}`,
      color: '#168d91',
      icon: 'briefcase',
      events: Array.from({ length: 4 }, (_, event) => ({
        id: String(event),
        type: 'period' as const,
        title: `Event ${category + 1}.${event + 1}`,
        start: String(1900 + event),
        end: '2026'
      }))
    }))
  };
</script>

<ContentPage page={{ title: 'Dense timeline test' }}><TimelineSection {section} /></ContentPage>
