<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, HeadingSection, CarouselSection } from '@page-sections/svelte';
<\/script>

<ContentPage page={{ title: 'Field notes' }}>
  <HeadingSection section={{ id: 'page-heading', title: 'Field notes', headingLevel: 1,
    headingSize: 'l', background: { color: 'standard', size: 'standard' } }} />
  <HeadingSection section={{ id: 'chapter', title: 'A new chapter',
    headingLevel: 2, headingSize: 'xl', background: { color: 'muted' } }} />
  <CarouselSection section={{ id: 'projects', title: 'Projects',
    headline: 'Selected projects', headingLevel: 2, headingSize: 'm' }} list={[]} />
</ContentPage>`
    }
  ];
</script>

<script lang="ts">
  import ContentPage from '$lib/WebsitePage.svelte';
  import SectionAnatomy from '$lib/SectionAnatomy.svelte';
  import LiveCode from '$lib/LiveCode.svelte';
  import { onMount } from 'svelte';
  import { Section, HeadingSection, CodeBlock } from '@page-sections/svelte';
  import type { HeadingLevel, HeadingSize, SectionBackground } from '@page-sections/core';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let size = $state<HeadingSize>('l');
  let level = $state<HeadingLevel>(2);
  let color = $state<SectionBackground['color']>('muted');
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  let text = $state('A new perspective');
  let eyebrow = $state('HeadingSection');
  let introduction = $state('Choose the visual size independently of the document hierarchy.');
  const example = $derived({
    id: 'heading-preview',
    title: text,
    eyebrow,
    introduction,
    headingSize: size,
    headingLevel: level,
    background: { color, size: 'standard' as const }
  });
  const source = $derived(
    `<script>\n  import { HeadingSection } from '@page-sections/svelte';\n<\/script>\n\n<HeadingSection section={${JSON.stringify(example, null, 2)}} />`
  );
</script>

<ContentPage page={{ title: 'Heading' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Heading',
      headingLevel: 1,
      introduction:
        'Introduce a page or a new chapter with a clear headline. Add an eyebrow and a short introduction while choosing the visual size independently of the heading level.',
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'try',
      title: 'Try a heading',
      headline: 'Size and semantics are independent',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <fieldset class="controls" disabled={!ready}>
      <legend>Configure the HeadingSection</legend>
      <label>Heading text<input bind:value={text} /></label>
      <label>Eyebrow<input bind:value={eyebrow} /></label>
      <label>Introduction<input bind:value={introduction} /></label>
      <label
        >Heading size <select bind:value={size}
          ><option>m</option><option>l</option><option>xl</option></select
        ></label
      >
      <label
        >Heading level <select bind:value={level}
          >{#each [1, 2, 3, 4, 5, 6] as value}<option {value}>h{value}</option>{/each}</select
        ></label
      >
      <label
        >Surface <select bind:value={color}
          ><option value="standard">Standard</option><option value="muted">Muted</option><option
            value="transparent">Transparent</option
          ></select
        ></label
      >
      <button
        type="button"
        onclick={() => {
          text = 'A new perspective';
          eyebrow = 'HeadingSection';
          introduction = 'Choose the visual size independently of the document hierarchy.';
          size = 'l';
          level = 2;
          color = 'muted';
        }}>Reset example</button
      >
    </fieldset>
    <HeadingSection section={example} />
    <details><summary>View and copy the Svelte source</summary><LiveCode code={source} /></details>
  </Section>
  <SectionAnatomy kind="headings" />
  <Section
    section={{
      id: 'composition',
      title: 'Composition',
      headline: 'One heading component, several ways to compose it',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>Heading</code> renders text, an optional eyebrow and introduction. Its
        <code>level</code>
        controls h1–h6; <code>size</code> is m, l or xl. The default is h2/m. It has no background, page
        registration or section spacing.
      </p>
      <p>
        <code>HeadingSection</code> adds the normal Section layout, background, spacing and anchor.
        It accepts a <code>section</code> using <code>HeadingSectionData</code> (without a required
        type when used directly). Its visible heading falls back to <code>title</code>. Use
        <code>headingSize</code>
        and <code>headingLevel</code> independently.
      </p>
      <p>
        Optional <code>headline</code> fields remain on all sections, including CarouselSection. Section
        renders them through Heading, keeping the heading and collection in one semantic region. HeroSection
        uses Heading too, with xl as its default visual size. Ordinary sections default to l; the content
        variant defaults to m.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Place HeadingSection directly inside ContentPage, just like any other section. Choose its
        background, position and headingLevel explicitly. The page title property is metadata; it
        does not insert visible content. Use one h1 per page. Only sections at h2 or h3 appear in
        the right content menu; h3 entries are indented.
      </p>
      <p>
        Alternatively, place a HeroSection in the same position with headingLevel: 1. Hero size
        controls the composition height; headingSize controls the text.
      </p>
      <p>
        Sizes respond to the available container width: m spans 18–24px, l spans 24–32px and xl
        spans 32–44px. A smaller visual size does not change the heading level. The website uses l
        for page titles.
      </p>
    </div>
  </Section>
</ContentPage>

<style>
  .controls {
    border: 0;
    padding: 0;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  label {
    display: grid;
    gap: 0.5rem;
    min-width: 0;
  }
  legend {
    margin-bottom: 16px;
    font-weight: 600;
  }
  input,
  select,
  button {
    box-sizing: border-box;
    max-width: 100%;
    padding: 8px;
    color: var(--ps-ink);
    background: var(--ps-section-standard);
    border: 1px solid var(--ps-border);
    border-radius: 6px;
    font: inherit;
  }
  summary {
    margin-top: 20px;
    padding: 12px 0;
    cursor: pointer;
  }
</style>
