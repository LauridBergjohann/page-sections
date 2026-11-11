<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { ContentPage } from '@page-sections/svelte';
  import { Sections, type PageData } from '@page-sections/svelte';
  const page: PageData = {
    title: 'Garden notebook',
    sections: [
      { type: 'heading', id: 'page-title', title: 'Garden notebook', headingLevel: 1 },
      {
        type: 'richText',
        id: 'intro',
        title: 'Introduction',
        body: 'Notes from **this season**.'
      },
      {
        type: 'grid',
        id: 'details',
        title: 'Details',
        blocks: [
          {
            id: 'left',
            span: { xs: 4, s: 3 },
            sections: [
              {
                type: 'richText',
                id: 'hours',
                title: 'Hours',
                body: 'Open on Saturdays.'
              }
            ]
          },
          {
            id: 'right',
            span: { xs: 4, s: 3 },
            sections: [
              {
                type: 'richText',
                id: 'address',
                title: 'Address',
                body: '42 Garden Lane.'
              }
            ]
          }
        ]
      }
    ]
  };
<\/script>

<ContentPage {page} showContentMenu><Sections sections={page.sections} /></ContentPage
>`
    },
    {
      language: 'ts',
      code: `import type { SectionDefinition } from '@page-sections/core';
export interface QuoteSection extends SectionDefinition {
  type: 'quote';
  quote: string;
  author: string;
}
declare module '@page-sections/core' {
  interface SectionTypeMap {
    quote: QuoteSection;
  }
}`,
      group: 'custom',
      filename: 'quote.ts'
    },
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { Section } from '@page-sections/svelte';
  import type { QuoteSection } from './quote.js';
  let { section }: { section: QuoteSection } = $props();
<\/script>

<Section {section}>
  <blockquote>
    <p>{section.quote}</p>
    <footer>{section.author}</footer>
  </blockquote>
</Section>`,
      group: 'custom',
      filename: 'Quote.svelte'
    },
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { ContentPage, Sections, type PageData } from '@page-sections/svelte';
  import Quote from './Quote.svelte';
  import type {} from './quote.js';
  const page: PageData = {
    title: 'Shared wisdom',
    sections: [
      { type: 'heading', id: 'page-title', title: 'Shared wisdom', headingLevel: 1 },
      {
        type: 'quote',
        id: 'advice',
        title: 'Advice',
        quote: 'Start with one small patch.',
        author: 'The garden team'
      }
    ]
  };
<\/script>

<ContentPage {page} showContentMenu
  ><Sections sections={page.sections} renderers={{ quote: Quote }} /></ContentPage
>`,
      group: 'custom',
      filename: 'App.svelte'
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'Data and custom sections',
    pageTitle: 'Data and custom sections · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Data and custom sections',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Keep content as JSON-compatible data and render it with components supplied by your
        application. This makes the same model usable for local files, a CMS or a future editing
        interface.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'page-and-section-models',
      title: 'Page and section models',
      headline: 'Page and section models',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>ContentPageData</code> has required title and optional pageTitle, breadcrumbs,
        bodyLayout (wide/narrow) and bodySpacing. <code>PageData</code> extends it with required
        <code>sections: SectionData[]</code>. ContentPage itself does not read page.sections; render
        Sections explicitly.
      </p>
      <p>
        <code>SectionData = SectionTypeMap[keyof SectionTypeMap]</code>. Every built-in entry
        extends the <a href={base + '/docs/foundations/content-grid/'}>shared SectionDefinition</a>.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Interface / discriminator</th>
              <th>Additional fields beyond SectionDefinition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>HeroSectionData</code> / <code>hero</code></td>
              <td
                >Optional image: ImageData, size: CardSize, textBackground: boolean, actions:
                ContentAction[], composition: overlay/artwork, imageSide: left/right</td
              >
            </tr>
            <tr>
              <td><code>RichTextSectionData</code> / <code>richText</code></td>
              <td>Either body with optional format (markdown/text), or blocks: RichTextBlock[]</td>
            </tr>
            <tr>
              <td><code>PanelSectionData</code> / <code>panel</code></td>
              <td>Required blocks; optional tone (standard/muted), actions</td>
            </tr>
            <tr>
              <td><code>ImageSectionData</code> / <code>image</code></td>
              <td>Required image: ImageData; optional description: string, imageSide: left/right</td
              >
            </tr>
            <tr>
              <td><code>VideoSectionData</code> / <code>video</code></td>
              <td>Required video: VideoData; optional description: string, videoSide: left/right</td
              >
            </tr>
            <tr>
              <td><code>CardGridSectionData</code> / <code>cardGrid</code></td>
              <td
                >Required list: CardItem[]; optional cardSize, cardVariant, mediaAspect, mediaFit,
                itemSpan, textAlign</td
              >
            </tr>
            <tr>
              <td><code>CarouselSectionData</code> / <code>carousel</code></td>
              <td
                >Required list: CardItem[]; optional cardSize, cardVariant, mediaAspect, mediaFit,
                textAlign, controls, initialItemKey</td
              >
            </tr>
            <tr>
              <td><code>GridSectionData</code> / <code>grid</code></td>
              <td
                >Required blocks: &#123; id: string; span?: ContentSpan; sections: SectionData[]
                &#125;[]</td
              >
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Grid renders Section + ContentGrid + ContentBlocks and recursively renders each block's
        sections. A block id is its keyed-loop identity, not a rendered anchor. Nested sections
        still register in the page, so their IDs must be unique across the page. Nested text/panel
        sections omit extra outer padding by default. Nested grids/collections establish their own
        container and one gutter pair. Heading levels inherit from the enclosing section and stop at
        h6.
      </p>
      <p>
        There is no plain <code>section</code> discriminator and no exported GridSection component. Use
        declarative Section or a custom type for arbitrary content.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sections-component-props',
      title: 'Sections component props',
      headline: 'Sections component props',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sections</code></td>
              <td><code>SectionData[]</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>renderers</code></td>
              <td><code>Record&lt;string, Component&lt;any&gt;&gt;</code></td>
              <td>Empty object</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The <code>code</code> discriminator renders CodeSection. Optional
        <code>codeHighlights: Record&lt;string, HighlightedCode&gt;</code>
        supplies derived syntax tokens keyed by section ID and is forwarded into nested grids. Sections
        keys entries by id. A matching custom renderer takes precedence over a built-in and receives the
        complete <code>section</code> prop. Unknown types throw an error during rendering. Recursive grid
        sections forward the same renderer map. No fetching, JSON validation, schema migration or routing
        is performed.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'add-a-custom-section',
      title: 'Add a custom section',
      headline: 'Add a custom section',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Create these three files in the same directory. The data remains serializable; component
        constructors stay in the renderer map.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
      <CodeBlock {...examples[3]} highlighted={data.highlights[3]} />
      <p>
        The augmentation must be included in the application's TypeScript compilation. Renderer
        typing is intentionally broad (<code>Component&lt;any&gt;</code>); the map does not enforce
        correspondence between a key and its component props. Give each renderer a precise section
        prop type as above and validate external data before rendering it.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'related-models',
      title: 'Related models',
      headline: 'Related models',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        CardItem and ImageData are fully documented in <a
          href={base + '/docs/building-blocks/card-and-image/'}>Card and Image</a
        >; VideoData in <a href={base + '/docs/sections/video/'}>VideoSection</a>. Navigation uses
        MenuItem, ButtonGroupItem, Breadcrumb and SectionNavigationItem. PageTheme describes CSS
        values and is not a place to store event handlers or framework components.
      </p>
      <p>
        Related: <a href={base + '/docs/reference/core-api/'}>Core API</a>,
        <a href={base + '/docs/advanced/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div></Section
  >
</ContentPage>
