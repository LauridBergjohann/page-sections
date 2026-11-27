<script lang="ts">
  import { ContentPage, Section, Sections, type HeadingAlign } from '@page-sections/svelte';
  const alignments: (HeadingAlign | undefined)[] = [undefined, 'left', 'center', 'right'];
  const introduction =
    'A readable introduction keeps its maximum line length while following the heading across the available section width.';
</script>

<ContentPage page={{ title: 'Heading alignment' }}>
  {#each alignments as headingAlign}
    {@const id = headingAlign ?? 'default'}
    <Section
      section={{
        id: `section-${id}`,
        title: id,
        headline: 'Shared section heading',
        eyebrow: 'A little context',
        introduction,
        headingAlign
      }}
    >
      <p class="body-copy">Body copy keeps its own alignment.</p>
      <Section
        section={{ id: `nested-${id}`, title: 'Nested', headline: 'Nested heading', introduction }}
      />
    </Section>
    <Sections
      sections={[
        {
          type: 'panel',
          id: `panel-${id}`,
          title: 'Panel',
          headline: 'Panel heading',
          introduction,
          headingAlign,
          blocks: [
            { type: 'paragraph', text: 'Panel body stays aligned independently.' },
            { type: 'panel', title: 'Nested panel', blocks: [] }
          ]
        },
        {
          type: 'features',
          id: `features-${id}`,
          title: 'Features',
          headline: 'Shared features heading',
          introduction,
          headingAlign,
          list: [
            {
              id: 'one',
              icon: 'layers',
              title: 'One feature',
              description: 'Feature content stays centered.'
            }
          ]
        },
        {
          type: 'hero',
          id: `hero-${id}`,
          title: 'Hero',
          headline: 'Hero composition',
          introduction,
          headingAlign,
          size: 's'
        }
      ]}
    />
  {/each}
</ContentPage>
