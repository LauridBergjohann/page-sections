<script lang="ts">
  import {
    ContentPage,
    Sections,
    Card,
    CardGridSection,
    Section,
    type SectionData
  } from '@page-sections/svelte';
  const list = Array.from({ length: 7 }, (_, i) => ({
    id: 'card-' + i,
    title: 'Coastal walks',
    description: 'Find a new perspective.',
    href: '#destination',
    image: { src: '/timeline-creative.svg', alt: 'Creative project' }
  }));
  const sections: SectionData[] = (['s', 'm', 'l'] as const).flatMap((cardSize) =>
    (['cardGrid', 'carousel'] as const).map((type) => ({
      id: type.toLowerCase() + '-' + cardSize,
      title: type + ' ' + cardSize,
      type,
      list,
      cardSize,
      contentPlacement: 'overlay',
      textTone: 'light',
      mediaFit: 'contain',
      mediaAspect: '1/1'
    }))
  );
</script>

<ContentPage page={{ title: 'Overlay cards' }}>
  <Sections {sections} />
  <CardGridSection
    section={{ id: 'custom', title: 'Custom card' }}
    list={list.slice(0, 1)}
    contentPlacement="overlay"
    textTone="dark"
    mediaAspect="4/3"
  >
    {#snippet card(item, options)}<Card {item} {...options} />{/snippet}
  </CardGridSection>
  <Section section={{ id: 'long', title: 'Long copy' }}>
    <div style="width: 240px">
      <Card
        contentPlacement="overlay"
        mediaAspect="3/2"
        item={{
          ...list[0],
          id: 'long-card',
          title: 'A long title that remains fully readable in a fixed card',
          description: 'Long copy remains selectable and scrollable. '.repeat(15),
          actions: [{ label: 'Independent action', href: '#action' }]
        }}
      />
    </div>
  </Section>
  <Section section={{ id: 'missing', title: 'Missing image' }}>
    <div style="width: 240px">
      <Card contentPlacement="overlay" item={{ id: 'missing', title: 'No image' }} />
    </div>
  </Section>
  <Section section={{ id: 'destination', title: 'Main destination' }} />
  <Section section={{ id: 'action', title: 'Action destination' }} />
</ContentPage>
