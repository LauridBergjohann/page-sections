<script lang="ts">
  import { Section } from '@page-sections/svelte';
  import { base } from '#lib/paths.js';
  import { sectionCatalog } from './sectionCatalog';
  let { kind }: { kind: string } = $props();
  const item = $derived(sectionCatalog.find((item) => item.slug === kind)!);
  const notes: Record<string, string[]> = {
    'card-grid': [
      'Each item occupies a predictable grid span. Card size changes the number of cards per row.',
      'Cards share consistent image and title geometry. Add descriptions and actions when an item needs more context.',
      'Try changing the media ratio and tone in the demo, then resize the window to see the container grid adapt.'
    ],
    carousel: [
      'Cards share the same size, tone and media controls as CardGrid.',
      'The collection stays on one horizontal track. Native scrolling works with touch, a trackpad or the optional arrow controls.',
      'Use a carousel for a focused collection; prefer CardGrid when seeing every item together matters.'
    ],
    code: [
      'The source is always readable text. Highlighting adds syntax colors without changing the copied code.',
      'Line numbers, highlighted lines and wrapping can be configured separately.',
      'Compare a standalone block with code beside prose using the position control.'
    ],
    headings: [
      'The eyebrow introduces context; the headline gives the section its name; the introduction adds a short explanation.',
      'Visual size and semantic level are independent. Keep one page h1 and use h2/h3 for its sections.',
      'Compare m, l and xl at the same heading level before choosing the emphasis.'
    ],
    hero: [
      'Artwork separates image and copy. Overlay places readable copy over a larger background image.',
      'Composition size controls minimum height. Heading size and document level remain independent.',
      'Turn off the image for a text-led introduction, or compare the translucent text panel with an unboxed overlay.'
    ],
    image: [
      'The image can fill the section or share a row with descriptive text.',
      'Cover crops to the selected ratio; contain preserves the complete image with spare space around it.',
      'Change the media side to compare the compositions. On small containers the content stacks in its reading order.'
    ],
    panel: [
      'A panel groups related content on a standard or muted surface.',
      'Structured paragraphs, lists and addresses share the same typography as RichText. Actions stay native links.',
      'Compare the two tones against the surrounding surface, then try the list or address preset.'
    ],
    'rich-text': [
      'Markdown is useful for authored prose; plain text preserves literal characters.',
      'Structured blocks represent paragraphs, lists, addresses and nested panels as serializable data.',
      'Switch between Markdown and plain text to see how the same source is interpreted, then try the block presets.'
    ],
    video: [
      'Native media uses browser controls, a poster and optional caption tracks. YouTube uses a lazy iframe.',
      'A description creates a responsive media/text pair. Without it the player fills the available content width.',
      'Compare the media sides, turn the description off, and inspect the generated source for poster and caption settings.'
    ]
  };
</script>

<Section
  section={{
    id: 'anatomy',
    title: 'Anatomy and variations',
    headline: 'Anatomy and variations',
    background: { color: 'standard', size: 'standard' }
  }}
>
  <div class="anatomy">
    <figure>
      <img src={item.image.src} alt={item.image.alt} width="800" height="500" loading="lazy" />
      <figcaption>{item.title}: a visual guide to the composition.</figcaption>
    </figure>
    <div class="prose">
      {#each notes[kind] as note}<p>{note}</p>{/each}
      <p>
        All sections also share <a href={base + '/docs/components/section/'}>
          layout, spacing and surface options
        </a>.
      </p>
    </div>
  </div>
</Section>

<style>
  .anatomy {
    display: grid;
    gap: 24px;
    align-items: center;
  }
  figure {
    margin: 0;
    min-width: 0;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--ps-radius);
  }
  figcaption {
    margin-top: 8px;
    font-size: 0.875rem;
    color: var(--ps-body);
  }
  @media (min-width: 1200px) {
    .anatomy {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
