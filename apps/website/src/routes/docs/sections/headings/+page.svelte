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
  import { Section, HeadingSection, CodeBlock } from '@page-sections/svelte';
  import type { HeadingLevel, HeadingSize, SectionBackground } from '@page-sections/core';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let size = $state<HeadingSize>('l');
  let level = $state<HeadingLevel>(2);
  let color = $state<SectionBackground['color']>('muted');
</script>

<ContentPage page={{ title: 'Headings' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Headings',
      headingLevel: 1,
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
    <div class="controls">
      <label
        >Heading size <select bind:value={size}
          ><option>m</option><option>l</option><option>xl</option></select
        ></label
      >
      <label
        >Heading level <select bind:value={level}
          ><option value={1}>h1</option><option value={2}>h2</option><option value={3}>h3</option
          ></select
        ></label
      >
      <label
        >Surface <select bind:value={color}
          ><option value="standard">Standard</option><option value="muted">Muted</option></select
        ></label
      >
    </div>
    <HeadingSection
      section={{
        id: 'heading-preview',
        title: 'A new perspective',
        eyebrow: 'HeadingSection',
        introduction: 'Choose the visual size independently of the document hierarchy.',
        headingSize: size,
        headingLevel: level,
        background: { color, size: 'standard' }
      }}
    />
  </Section>
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
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  label {
    display: grid;
    gap: 0.5rem;
  }
</style>
