<script lang="ts">
  import { HeadingSection, CardGridSection } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
</script>

<ContentPage
  page={{ title: 'Small pieces. Complete experiences.', pageTitle: 'Showcase · Page Sections' }}
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Small pieces. Complete experiences.',
      eyebrow: 'The showcase',
      introduction:
        'Explore complete pages and focused compositions built from the public components.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
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
        id: 'components',
        title: 'The building blocks',
        eyebrow: '02 / Composition',
        description: 'Images, video, responsive grids and a native carousel on one page.',
        href: base + '/showcase/components/',
        image: { src: base + '/landscape.svg', alt: 'Layers of green hills' }
      },
      {
        id: 'surfaces',
        title: 'A sense of continuity',
        eyebrow: '03 / Surfaces',
        description:
          'Compare adjacent surfaces, gradients, rounded groups and full-width backgrounds.',
        href: base + '/showcase/backgrounds/',
        image: { src: base + '/coast.svg', alt: 'Warm cliffs beside the sea' }
      },
      {
        id: 'integration',
        title: 'Enhance without replacing',
        eyebrow: '04 / Integration',
        description:
          'Observe card attachment and cleanup while changing formats and reordering a collection.',
        href: base + '/showcase/integration/'
      }
    ]}
  />
</ContentPage>
