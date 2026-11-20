<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import {
    Card,
    Image,
    PageShell,
    type CardVariant,
    type CardSize,
    type SurfaceTone,
    type CardMediaAspect,
    type CardMediaFit,
    type ImageData
  } from '@page-sections/svelte';
  import LiveCode from './LiveCode.svelte';
  let { kind }: { kind: 'card' | 'image' } = $props();
  let ready = $state(false);
  let title = $state('Notes from the coast');
  let variant = $state<CardVariant>('catalog');
  let cardSize = $state<CardSize>('m');
  let tone = $state<SurfaceTone>('muted');
  let mediaAspect = $state<CardMediaAspect>('3/2');
  let fit = $state<CardMediaFit>('contain');
  let aspect = $state<ImageData['aspect']>('16/9');
  let mode = $state<'light' | 'dark'>('light');
  onMount(() => {
    ready = true;
  });
  const item = $derived({
    id: 'coast',
    title,
    eyebrow: 'Field notes',
    description: 'An editorial card has room for a description and independent links.',
    href: '#playground',
    image: { src: base + '/coast.svg', alt: 'Sandstone cliffs beside the sea' }
  });
  const image = $derived({
    src: base + '/hero-light.webp',
    srcDark: base + '/hero-dark.webp',
    alt: 'An abstract landscape of layered page sections',
    width: 1499,
    height: 1049,
    aspect,
    objectFit: fit
  });
  const source = $derived(
    kind === 'card'
      ? `<script>\n  import { Card } from '@page-sections/svelte';\n  const item = ${JSON.stringify(item, null, 2)};\n<\/script>\n\n<Card {item} variant="${variant}" cardSize="${cardSize}" tone="${tone}" mediaAspect="${mediaAspect}" mediaFit="${fit}" />`
      : `<script lang="ts">\n  import { Image, PageShell, type ImageData } from '@page-sections/svelte';\n  const image: ImageData = ${JSON.stringify(image, null, 2)};\n<\/script>\n\n<PageShell mode="${mode}">\n  <Image {image} />\n</PageShell>`
  );
  function reset() {
    title = 'Notes from the coast';
    variant = 'catalog';
    cardSize = 'm';
    tone = 'muted';
    mediaAspect = '3/2';
    fit = 'contain';
    aspect = '16/9';
    mode = 'light';
  }
</script>

<div class="playground-controls">
  {#if kind === 'card'}
    <label>Card title<input bind:value={title} disabled={!ready} /></label>
    <label
      >Variant<select bind:value={variant} disabled={!ready}
        ><option>catalog</option><option>editorial</option></select
      ></label
    >
    <label
      >Card size<select bind:value={cardSize} disabled={!ready}
        ><option>s</option><option>m</option><option>l</option></select
      ></label
    >
    <label
      >Tone<select bind:value={tone} disabled={!ready}
        ><option>standard</option><option>muted</option></select
      ></label
    >
    <label
      >Media aspect<select bind:value={mediaAspect} disabled={!ready}
        ><option>3/2</option><option>4/3</option><option>1/1</option></select
      ></label
    >
  {:else}
    <label
      >Image aspect<select bind:value={aspect} disabled={!ready}
        ><option>none</option><option>4/3</option><option>16/9</option><option>2/1</option><option
          >square</option
        ></select
      ></label
    >
    <label
      >Preview color mode<select bind:value={mode} disabled={!ready}
        ><option>light</option><option>dark</option></select
      ></label
    >
  {/if}
  <label
    >Image fit<select bind:value={fit} disabled={!ready}
      ><option>contain</option><option>cover</option></select
    ></label
  >
  <button type="button" onclick={reset} disabled={!ready}>Reset</button>
</div>
<p>
  {kind === 'card'
    ? 'Switch to editorial to reveal the description. Size controls catalog typography; the preview keeps a fixed width so you can compare the results.'
    : 'Change the aspect and fit to compare cropping with a fully visible image. Dark mode selects the alternative srcDark artwork.'}
</p>
<div class="component-preview" class:card-preview={kind === 'card'}>
  <PageShell {mode}>
    {#if kind === 'card'}<Card
        {item}
        {variant}
        {cardSize}
        {tone}
        {mediaAspect}
        mediaFit={fit}
      />{:else}<Image {image} />{/if}
  </PageShell>
</div>
<LiveCode code={source} />

<style>
  input {
    min-height: 40px;
    max-width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--ps-border);
    border-radius: 6px;
    background: var(--ps-section-standard);
    color: var(--ps-ink);
    font: inherit;
  }
  .component-preview {
    max-width: 720px;
    margin-block: 24px;
    padding: 16px;
    border: 1px dashed var(--ps-border);
    border-radius: 8px;
  }
  .card-preview {
    max-width: 360px;
  }
  .component-preview :global(.ps-shell) {
    min-height: 0;
  }
  p {
    color: var(--ps-body);
    line-height: 1.7;
  }
</style>
