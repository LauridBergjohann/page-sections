<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '#lib/paths.js';
  import { Sections } from '@page-sections/svelte';
  import type {
    SectionData,
    SectionBackgroundColor,
    ImageAspect,
    RichTextBlock,
    CardSize
  } from '@page-sections/core';
  import LiveCode from './LiveCode.svelte';
  let { kind }: { kind: 'hero' | 'image' | 'panel' | 'rich-text' | 'video' } = $props();
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  let headline = $state('A new perspective');
  let surface = $state<SectionBackgroundColor>('muted');
  let side = $state<'left' | 'right'>('right');
  let composition = $state<'overlay' | 'artwork'>('artwork');
  let size = $state<CardSize>('s');
  let textBackground = $state(true);
  let media = $state(true);
  let description = $state(true);
  let actions = $state(true);
  let aspect = $state<ImageAspect>('16/9');
  let fit = $state<'cover' | 'contain'>('cover');
  let alt = $state('Layers of green hills beneath a pale sky');
  let tone = $state<'standard' | 'muted'>('muted');
  let content = $state<'paragraph' | 'list' | 'address'>('paragraph');
  let format = $state<'markdown' | 'text' | 'blocks'>('markdown');
  let body = $state(
    '### Small beginnings\n\nBuild a page with **clear ideas** and [useful links](' +
      base +
      '/sections/).\n\n- Start with a story\n- Add a little context\n- Invite someone to explore'
  );
  let provider = $state<'html5' | 'youtube'>('html5');
  let youtube = $state('aqz-KE-bpKQ');
  let captions = $state(true);
  const blocks = $derived<RichTextBlock[]>(
    content === 'list'
      ? [
          {
            type: 'list',
            items: ['A clear hierarchy', 'Responsive surfaces', 'Native links and controls']
          }
        ]
      : content === 'address'
        ? [
            {
              type: 'address',
              name: 'Example Studio',
              lines: ['Garden Street 12', 'A place for new ideas']
            }
          ]
        : [
            {
              type: 'paragraph',
              text: [
                { type: 'strong', text: 'Make room for ideas. ' },
                {
                  type: 'text',
                  text: 'Group related information and give the reader a clear next step.'
                }
              ]
            }
          ]
  );
  const definition = $derived.by((): SectionData => {
    const shared = {
      id: `${kind}-live-preview`,
      title: `${kind} preview`,
      headline,
      headingLevel: 3 as const,
      background: { color: surface, size: 'standard' as const }
    };
    const image = { src: base + '/landscape.svg', alt, aspect, objectFit: fit };
    const links = actions
      ? [{ label: 'Explore sections', href: base + '/sections/', variant: 'primary' as const }]
      : [];
    switch (kind) {
      case 'hero':
        return {
          ...shared,
          type: 'hero',
          eyebrow: 'A place to begin',
          introduction: 'A section that gives your story room to breathe.',
          size,
          composition,
          imageSide: side,
          textBackground,
          image: media ? image : undefined,
          actions: links
        };
      case 'image':
        return {
          ...shared,
          type: 'image',
          image,
          imageSide: side,
          description: description
            ? 'The image keeps its aspect ratio while the accompanying text follows the available space.'
            : undefined
        };
      case 'panel':
        return { ...shared, type: 'panel', tone, blocks, actions: links };
      case 'rich-text':
        return format === 'blocks'
          ? { ...shared, type: 'richText', blocks }
          : { ...shared, type: 'richText', body, format };
      case 'video':
        return {
          ...shared,
          type: 'video',
          videoSide: side,
          description: description
            ? 'A silent, locally hosted animation of sections coming together. Use the native controls to play or pause.'
            : undefined,
          video: {
            provider,
            src: provider === 'youtube' ? youtube : base + '/media/sections-demo.webm',
            poster: media ? base + '/illustrations/video.svg' : undefined,
            captions: captions
              ? [
                  {
                    src: base + '/media/sections-demo.vtt',
                    language: 'en',
                    label: 'English descriptions'
                  }
                ]
              : []
          }
        };
    }
  });
  const name = $derived(
    {
      hero: 'HeroSection',
      image: 'ImageSection',
      panel: 'PanelSection',
      'rich-text': 'RichTextSection',
      video: 'VideoSection'
    }[kind]
  );
  const source = $derived(
    `<script>\n  import { ${name} } from '@page-sections/svelte';\n<\/script>\n\n<${name} section={${JSON.stringify(Object.fromEntries(Object.entries(definition).filter(([key]) => key !== 'type')), null, 2)}} />`
  );
  function reset() {
    headline = 'A new perspective';
    surface = 'muted';
    side = 'right';
    composition = 'artwork';
    size = 's';
    textBackground = true;
    media = true;
    description = true;
    actions = true;
    aspect = '16/9';
    fit = 'cover';
    alt = 'Layers of green hills beneath a pale sky';
    tone = 'muted';
    content = 'paragraph';
    format = 'markdown';
    body =
      '### Small beginnings\n\nBuild a page with **clear ideas** and [useful links](' +
      base +
      '/sections/).\n\n- Start with a story\n- Add a little context\n- Invite someone to explore';
    provider = 'html5';
    youtube = 'aqz-KE-bpKQ';
    captions = true;
  }
</script>

<div class="section-playground" data-section-playground={kind}>
  <fieldset disabled={!ready} class="controls">
    <legend>Configure the {name}</legend>
    <label>Headline<input bind:value={headline} /></label>
    <label>
      Surface<select bind:value={surface}>
        <option>standard</option><option>muted</option><option>transparent</option>
      </select>
    </label>
    {#if kind === 'hero'}
      <label>
        Composition<select bind:value={composition}>
          <option>artwork</option><option>overlay</option>
        </select>
      </label>
      <label>
        Hero size<select bind:value={size}>
          <option value="s">Small</option><option value="m">Medium</option><option value="l">
            Large
          </option>
        </select>
      </label>
      <label class="check">
        <input type="checkbox" bind:checked={textBackground} />Text background
      </label>
      <label class="check"><input type="checkbox" bind:checked={media} />Show image</label>
    {/if}
    {#if kind === 'hero' || kind === 'image' || kind === 'video'}
      <label>
        Media side<select bind:value={side}><option>left</option><option>right</option></select>
      </label>
    {/if}
    {#if kind === 'image'}
      <label>
        Image aspect<select bind:value={aspect}>
          <option>none</option><option>4/3</option><option>16/9</option><option>2/1</option><option>
            square
          </option>
        </select>
      </label>
      <label>
        Image fit<select bind:value={fit}><option>cover</option><option>contain</option></select>
      </label>
      <label>Image alternative text<input bind:value={alt} /></label>
    {/if}
    {#if kind === 'image' || kind === 'video'}<label class="check">
        <input type="checkbox" bind:checked={description} />Show description
      </label>{/if}
    {#if kind === 'panel'}<label>
        Panel tone<select bind:value={tone}><option>standard</option><option>muted</option></select>
      </label>{/if}
    {#if kind === 'hero' || kind === 'panel'}<label class="check">
        <input type="checkbox" bind:checked={actions} />Show action
      </label>{/if}
    {#if kind === 'rich-text'}<label>
        Content format<select bind:value={format}>
          <option>markdown</option><option>text</option><option>blocks</option>
        </select>
      </label>{/if}
    {#if kind === 'panel' || (kind === 'rich-text' && format === 'blocks')}
      <label>
        Block type<select bind:value={content}>
          <option>paragraph</option><option>list</option><option>address</option>
        </select>
      </label>
    {/if}
    {#if kind === 'rich-text' && format !== 'blocks'}<label class="wide">
        Content<textarea rows="6" bind:value={body}></textarea>
      </label>{/if}
    {#if kind === 'video'}
      <label>
        Video provider<select bind:value={provider}>
          <option value="html5">Native video</option><option value="youtube">YouTube</option>
        </select>
      </label>
      {#if provider === 'youtube'}<label>
          YouTube ID or URL<input bind:value={youtube} />
        </label>{:else}
        <label class="check"><input type="checkbox" bind:checked={media} />Show poster</label>
        <label class="check">
          <input type="checkbox" bind:checked={captions} />Include captions
        </label>
      {/if}
    {/if}
    <button type="button" onclick={reset}>Reset example</button>
  </fieldset>
  <div class="preview" data-live-preview={kind}>
    {#key kind === 'video' ? `${provider}-${youtube}` : kind}<Sections
        sections={[definition]}
      />{/key}
  </div>
  {#if kind === 'video'}<p class="hint">
      The native example is silent and hosted with this site. Selecting YouTube loads the external
      player.
    </p>{/if}
  <details class="source">
    <summary>View and copy the Svelte source</summary><LiveCode code={source} />
  </details>
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 16px;
    border: 0;
    padding: 0;
    margin: 0 0 24px;
  }
  legend {
    font-weight: 600;
    margin-bottom: 16px;
  }
  label {
    display: grid;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
    font-size: 0.875rem;
  }
  input,
  select,
  textarea,
  button {
    font: inherit;
    color: var(--ps-ink);
    background: var(--ps-section-standard);
    border: 1px solid var(--ps-border);
    border-radius: 6px;
    padding: 8px;
    min-height: 40px;
    max-width: 100%;
    box-sizing: border-box;
  }
  .check {
    display: flex;
    align-items: center;
    min-height: 40px;
  }
  .check input {
    min-height: auto;
  }
  .wide {
    flex-basis: 100%;
  }
  textarea {
    width: 100%;
  }
  button {
    cursor: pointer;
  }
  .preview {
    min-width: 0;
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
    overflow: hidden;
  }
  .source {
    margin-top: 20px;
  }
  summary {
    cursor: pointer;
    padding: 12px 0;
    font-weight: 600;
  }
  .hint {
    font-size: 0.875rem;
    color: var(--ps-body);
  }
</style>
