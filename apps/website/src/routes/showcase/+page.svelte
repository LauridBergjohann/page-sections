<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { CardGridSection } from '@page-sections/svelte';
</script>

<ContentPage
  page={{
    title: 'Small pieces. Complete experiences.',
    pageTitle: 'Showcase · Page Sections',
    eyebrow: 'The showcase',
    intro: 'Explore complete pages and focused compositions built from the public components.'
  }}
>
  <CardGridSection
    section={{ id: 'examples', title: 'Examples' }}
    cardVariant="editorial"
    cardTone="muted"
    list={[
      {
        id: 'portfolio',
        title: 'A personal portfolio',
        eyebrow: '01 / Content from data',
        description:
          'An artwork hero, editorial cards, a biography and a contact panel, all rendered from a serializable model.',
        href: base + '/showcase/portfolio/',
        image: { src: base + '/landscape.svg', alt: 'Layered green mountains' }
      },
      {
        id: 'legal',
        title: 'A quieter reading layout',
        eyebrow: '02 / Everyday content',
        description: 'A narrow legal page with structured paragraphs, lists, addresses and panels.',
        href: base + '/showcase/legal/',
        image: { src: base + '/coast.svg', alt: 'A quiet coastline' }
      },
      {
        id: 'components',
        title: 'The building blocks',
        eyebrow: '03 / Composition',
        description: 'Images, video, responsive grids and a native carousel on one page.',
        href: base + '/showcase/components/',
        image: { src: base + '/landscape.svg', alt: 'Layers of green hills' }
      },
      {
        id: 'surfaces',
        title: 'A sense of continuity',
        eyebrow: '04 / Surfaces',
        description:
          'Compare adjacent surfaces, gradients, rounded groups and full-width backgrounds.',
        href: base + '/showcase/backgrounds/',
        image: { src: base + '/coast.svg', alt: 'Warm cliffs beside the sea' }
      },
      {
        id: 'integration',
        title: 'Enhance without replacing',
        eyebrow: '05 / Integration',
        description:
          'Observe card attachment and cleanup while changing formats and reordering a collection.',
        href: base + '/showcase/integration/'
      }
    ]}
  />
</ContentPage>
