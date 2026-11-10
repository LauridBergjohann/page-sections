<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import {
    CardGridSection,
    CarouselSection,
    type CardSize,
    type SurfaceTone,
    type CardVariant,
    type CardMediaAspect,
    type CardMediaFit
  } from '@page-sections/svelte';
  import LiveCode from './LiveCode.svelte';
  let { kind = 'grid' }: { kind?: 'grid' | 'carousel' } = $props();
  let cardSize = $state<CardSize>('m');
  let cardTone = $state<SurfaceTone>('muted');
  let cardVariant = $state<CardVariant>('catalog');
  let mediaAspect = $state<CardMediaAspect>('3/2');
  let mediaFit = $state<CardMediaFit>('contain');
  let textAlign = $state<'start' | 'center'>('start');
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const list = [
    {
      id: 'coast',
      title: 'Notes from the coast',
      eyebrow: 'Field notes',
      description: 'Make space for stories, observations and a slower way of seeing.',
      href: '#playground',
      image: { src: base + '/coast.svg', alt: 'Sandstone cliffs beside the sea' }
    },
    {
      id: 'hills',
      title: 'A different perspective',
      description: 'Cards without an eyebrow still align with their neighbours.',
      href: '#playground',
      image: { src: base + '/landscape.svg', alt: 'Layers of green hills' }
    },
    {
      id: 'journey',
      title: 'Small beginnings, longer journeys',
      eyebrow: 'Experiments',
      description: 'Try a different image ratio and notice that the text keeps its own space.',
      href: '#playground',
      image: { src: base + '/coast.svg', alt: 'A sunlit coastline' }
    },
    {
      id: 'more',
      title: 'Room to grow',
      eyebrow: 'Ideas',
      description:
        'Explore equal heights and responsive columns with content of different lengths.',
      href: '#playground',
      image: { src: base + '/landscape.svg', alt: 'A landscape of hills' }
    }
  ];
  const options = $derived({ cardSize, cardTone, cardVariant, mediaAspect, mediaFit, textAlign });
  const name = $derived(kind === 'grid' ? 'CardGridSection' : 'CarouselSection');
  const source = $derived(
    `<script lang="ts">\n  import { ${name} } from '@page-sections/svelte';\n  const list = ${JSON.stringify(list, null, 2).replaceAll('\n', '\n  ')};\n<\/script>\n\n<${name}\n  section={{ id: 'collection', title: 'Collection' }}\n  {list}\n${Object.entries(
      options
    )
      .map(([key, value]) => `  ${key}="${value}"`)
      .join('\n')}\n/>`
  );
  function reset() {
    cardSize = 'm';
    cardTone = 'muted';
    cardVariant = 'catalog';
    mediaAspect = '3/2';
    mediaFit = 'contain';
    textAlign = 'start';
  }
</script>

<div class="playground">
  <div class="playground-controls">
    <label
      >Card size<select bind:value={cardSize} disabled={!ready}
        ><option value="s">Small</option><option value="m">Medium</option><option value="l"
          >Large</option
        ></select
      ></label
    >
    <label
      >Card tone<select bind:value={cardTone} disabled={!ready}
        ><option>standard</option><option>muted</option></select
      ></label
    >
    <label
      >Card variant<select bind:value={cardVariant} disabled={!ready}
        ><option>catalog</option><option>editorial</option></select
      ></label
    >
    <label
      >Media aspect<select bind:value={mediaAspect} disabled={!ready}
        ><option>3/2</option><option>4/3</option><option>1/1</option></select
      ></label
    >
    <label
      >Media fit<select bind:value={mediaFit} disabled={!ready}
        ><option>cover</option><option>contain</option></select
      ></label
    >
    <label
      >Text alignment<select bind:value={textAlign} disabled={!ready}
        ><option>start</option><option>center</option></select
      ></label
    >
    <button type="button" onclick={reset} disabled={!ready}>Reset example</button>
  </div>
  <div data-preview>
    {#if kind === 'grid'}<CardGridSection
        section={{ id: 'collection', title: 'Collection' }}
        {list}
        {...options}
      />
    {:else}<CarouselSection
        section={{ id: 'collection', title: 'Collection' }}
        {list}
        {...options}
      />{/if}
  </div>
</div>
<p class="example-note">
  Catalog sizes control compact card geometry. Editorial cards use content spans and keep
  descriptions visible. The code below follows your selections.
</p>
<LiveCode code={source} />
