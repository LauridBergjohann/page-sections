<script lang="ts">
  import {
    HeadingSection,
    ContentPage,
    HeroSection,
    RichTextSection,
    ImageSection,
    VideoSection,
    CardGridSection,
    CarouselSection,
    Section,
    ContentGrid,
    ContentBlock,
    Card,
    Image,
    ButtonGroup,
    Sections
  } from '@page-sections/svelte';

  import { cards, landscape, coast, editorial } from '$lib/content';
</script>

<ContentPage
  page={{
    title: 'The building blocks.',
    pageTitle: 'Components — Page Sections',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Components' }]
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'The building blocks.',
      eyebrow: '01 / Components',
      introduction:
        'Real content, composed in different ways. Resize the window to see each layout respond.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
  <HeroSection
    section={{
      id: 'hero',
      title: 'Hero',
      headline: 'A strong opening.',
      introduction:
        'A headline, a landscape and a clear next step. The medium hero leaves room for the story below.',
      background: { color: 'standard' },
      image: coast,
      size: 'm',
      actions: [{ label: 'Jump to the grid', href: '#layout' }]
    }}
  />
  <RichTextSection
    section={{
      id: 'text',
      title: 'Rich text',
      headline: 'Words with room to breathe',
      layout: 'narrow',
      spacing: 'loose',
      body: '## A small field journal\n\nThe best pages begin with **something worth sharing**. Markdown supports headings, lists and ordinary links.\n\n- Keep the structure clear.\n- Let the content set the pace.\n- [Explore surfaces](/backgrounds/) when the story changes.'
    }}
  />
  <ImageSection
    section={{
      id: 'images',
      title: 'Images',
      headline: 'Two views of the same world',
      background: { color: 'muted' },
      image: { ...landscape, aspect: '16/9' },
      description:
        'A wide landscape on the left. Explicit dimensions reserve space while the image loads.'
    }}
  />
  <ImageSection
    section={{
      id: 'image-right',
      title: 'Image on the right',
      headline: 'A closer look',
      background: { color: 'muted' },
      image: { ...coast, aspect: 'square' },
      imageSide: 'right',
      description:
        'A square crop on the right. The media and text stack when the section becomes narrow.'
    }}
  />
  <VideoSection
    section={{
      id: 'video',
      title: 'Video',
      headline: 'A moment in motion',
      background: { color: 'standard' },
      video: {
        provider: 'html5',
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        poster: '/coast.svg'
      },
      description:
        'A short, silent flower clip with native video controls. Playback requires access to the external MDN media host; no application JavaScript is needed.'
    }}
  />
  <CardGridSection
    section={{
      id: 'cards',
      title: 'Card grid',
      headline: 'A collection with variety',
      background: { color: 'muted' },
      spacing: 'loose'
    }}
    list={cards.slice(0, 3)}
    cardSize="m"
  />
  <CarouselSection
    section={{
      id: 'carousel',
      title: 'Carousel',
      headline: 'Follow your curiosity',
      background: { color: 'standard' },
      spacing: 'loose'
    }}
    list={cards}
    cardSize="l"
  />
  <Section
    section={{
      id: 'layout',
      title: 'Responsive grid',
      headline: 'One grid. Different rhythms.',
      spacing: 'loose'
    }}
  >
    <p class="demo-copy">
      The grid has 4, 6, 8 or 12 columns, based on its container width. These blocks stack on small
      screens and share a row when more room is available.
    </p>
    <ContentGrid>
      <ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}
        ><div class="demo-sample" data-testid="primary-block">
          <span class="demo-label">4 → 3 → 5 → 8 columns</span>
          <h3>The main story</h3>
          <p>A flexible area for the content that deserves the most attention.</p>
        </div></ContentBlock
      >
      <ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}
        ><div class="demo-sample" data-testid="secondary-block">
          <span class="demo-label">4 → 3 → 3 → 4 columns</span>
          <h3>A related thought</h3>
          <p>A companion to the main story, with its own responsive span.</p>
        </div></ContentBlock
      >
    </ContentGrid>
  </Section>
  <Section
    section={{
      id: 'narrow',
      title: 'Narrow content',
      headline: 'A quieter reading width',
      layout: 'narrow',
      background: { color: 'standard' }
    }}
    ><p class="demo-copy">
      This section uses the narrow layout, capped at 780px by the default theme. Its grid responds
      to that smaller container, even on a wide screen.
    </p>
    <ContentGrid
      ><ContentBlock span={{ xs: 4, s: 3 }}
        ><div class="demo-sample">A note in the margin.</div></ContentBlock
      ><ContentBlock span={{ xs: 4, s: 3 }}
        ><div class="demo-sample">A second perspective.</div></ContentBlock
      ></ContentGrid
    ></Section
  >
  <Section
    section={{
      id: 'wide',
      title: 'Wide content',
      headline: 'Room for individual pieces',
      layout: 'wide',
      spacing: 'loose',
      background: { color: 'muted' }
    }}
  >
    <ContentGrid>
      <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}
        ><Card
          variant="editorial"
          item={{
            id: 'standalone',
            title: 'A standalone card',
            description: 'Use Card directly inside your own grid.',
            href: '/backgrounds/',
            image: coast
          }}
        /></ContentBlock
      >
      <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}
        ><figure>
          <Image image={{ ...landscape, aspect: '2/1' }} />
          <figcaption>A standalone Image with a 2:1 crop and a native figure caption.</figcaption>
        </figure>
        <p class="demo-copy">ButtonGroup can contain ordinary links, too.</p>
        <ButtonGroup
          label="Continue exploring"
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'surfaces', label: 'Surfaces', href: '/backgrounds/' }
          ]}
        /></ContentBlock
      >
    </ContentGrid>
  </Section>
  <Section
    section={{
      id: 'full',
      title: 'Full width',
      headline: 'A section beyond the content column',
      layout: 'full',
      background: { color: 'standard', size: 'full' },
      spacing: 'loose'
    }}
    ><p class="demo-copy">
      The section surface uses full width; its content retains the canonical maximum. On the
      backgrounds page, full-width surfaces keep their content inside the normal page column.
    </p></Section
  >
  <Section
    section={{
      id: 'data',
      title: 'From data',
      headline: 'The same components, driven by content',
      spacing: 'loose'
    }}
    ><p class="demo-copy">
      The following two sections come from a typed, serializable PageData object in
      src/lib/content.ts. Sections chooses the renderer from each record's type.
    </p>
    <pre class="demo-code">{JSON.stringify(editorial.sections[0], null, 2)}</pre></Section
  >
  <Sections sections={editorial.sections} />
</ContentPage>
