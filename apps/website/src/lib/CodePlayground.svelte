<script lang="ts">
  import { onMount } from 'svelte';
  import {
    CodeBlock,
    ContentBlock,
    ContentGrid,
    type HighlightedCode,
    type SurfaceTone
  } from '@page-sections/svelte';
  import LiveCode from './LiveCode.svelte';
  const samples: Record<string, string> = {
    svelte:
      '<script>\n  import { CodeBlock } from \'@page-sections/svelte\';\n<\/script>\n\n<CodeBlock code="Hello, world!" />',
    typescript:
      "type Note = { title: string; published: boolean };\n\nconst note: Note = {\n  title: 'Ideas worth sharing',\n  published: true\n};",
    json: '{\n  "type": "code",\n  "id": "example",\n  "title": "Example",\n  "language": "text",\n  "code": "Hello, world!"\n}',
    css: '.story {\n  display: grid;\n  gap: 1.5rem;\n  color: var(--ps-ink);\n}',
    bash: 'npm install @page-sections/svelte\nnpm run dev'
  };
  let language = $state('svelte');
  let tone = $state<SurfaceTone>('muted');
  let layout = $state('right');
  let lineNumbers = $state(true);
  let wrap = $state(false);
  let ready = $state(false);
  let highlighted = $state<HighlightedCode>();
  onMount(() => {
    ready = true;
  });
  const code = $derived(samples[language]);
  $effect(() => {
    const source = code,
      lang = language;
    let active = true;
    import('./clientHighlight')
      .then((module) => module.highlight(source, lang))
      .then((result) => {
        if (active) highlighted = result;
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  });
  const block = $derived(
    `<CodeBlock\n  code={${JSON.stringify(code)}}\n  language="${language}"\n  tone="${tone}"\n  lineNumbers={${lineNumbers}}\n  wrap={${wrap}}\n  highlightLines={[2]}\n/>`
  );
  const source = $derived(
    `<script>\n  import { CodeBlock, ContentGrid, ContentBlock } from '@page-sections/svelte';\n<\/script>\n\n${layout === 'alone' ? block : `<ContentGrid>\n${layout === 'left' ? `  <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}>\n    ${block.replaceAll('\n', '\n    ')}\n  </ContentBlock>\n` : ''}  <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}>\n    <p>Explain the idea beside the code.</p>\n  </ContentBlock>\n${layout === 'right' ? `  <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}>\n    ${block.replaceAll('\n', '\n    ')}\n  </ContentBlock>\n` : ''}</ContentGrid>`}`
  );
</script>

<div class="playground">
  <div class="playground-controls">
    <label
      >Language<select bind:value={language} disabled={!ready}
        >{#each Object.keys(samples) as lang}<option>{lang}</option>{/each}</select
      ></label
    >
    <label
      >Code position<select bind:value={layout} disabled={!ready}
        ><option value="right">Right of text</option><option value="left">Left of text</option
        ><option value="alone">Standalone</option></select
      ></label
    >
    <label
      >Code tone<select bind:value={tone} disabled={!ready}
        ><option>standard</option><option>muted</option></select
      ></label
    >
    <label>Line numbers<input type="checkbox" bind:checked={lineNumbers} disabled={!ready} /></label
    >
    <label>Wrap long lines<input type="checkbox" bind:checked={wrap} disabled={!ready} /></label>
  </div>
  <div class="preview" data-code-preview>
    {#snippet example()}<CodeBlock
        {code}
        {language}
        {tone}
        {lineNumbers}
        {wrap}
        {highlighted}
        highlightLines={[2]}
      />{/snippet}
    {#if layout === 'alone'}{@render example()}
    {:else}<ContentGrid>
        {#if layout === 'left'}<ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}
            >{@render example()}</ContentBlock
          >{/if}
        <ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}
          ><div class="prose">
            <h3>Explain the idea beside the code.</h3>
            <p>
              A code example can stand on its own or share a row with a description. The same
              content grid handles both layouts.
            </p>
            <p>
              Resize the window: the blocks stack when there is not enough room. Change the language
              to compare syntax colors.
            </p>
          </div></ContentBlock
        >
        {#if layout === 'right'}<ContentBlock span={{ xs: 4, s: 3, m: 4, l: 6 }}
            >{@render example()}</ContentBlock
          >{/if}
      </ContentGrid>{/if}
  </div>
</div>
<p>
  The composition below uses the current settings. Add precomputed tokens with <code
    >highlighted</code
  > for syntax colors.
</p>
<LiveCode code={source} />

<style>
  .preview {
    padding-block: 1rem;
  }
</style>
