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

  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'Data and custom renderers',
    pageTitle: 'Data and custom renderers · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Data and custom renderers',
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
  >
    <div class="prose">
      <p>
        Keep content as JSON-compatible data and render it with components supplied by your
        application. This makes the same model usable for local files, a CMS or a future editing
        interface.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'page-and-section-models',
      title: 'Page and section models',
      headline: 'Page and section models',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code><a href={base + '/docs/reference/types/#content-page-data'}>ContentPageData</a></code>
        has required title and optional pageTitle, breadcrumbs, bodyLayout (wide/narrow) and bodySpacing.
        <code><a href={base + '/docs/reference/types/#page-data'}>PageData</a></code>
        extends it with required
        <code>
          sections: <a href={base + '/docs/reference/types/#section-data'}>SectionData</a>[]
        </code>. ContentPage itself does not read page.sections; render Sections explicitly.
      </p>
      <p>
        <code>
          <a href={base + '/docs/reference/types/#section-data'}>SectionData</a> =
          <a href={base + '/docs/reference/types/#section-type-map'}>SectionTypeMap</a>[keyof
          <a href={base + '/docs/reference/types/#section-type-map'}>SectionTypeMap</a>]
        </code>. Every built-in entry extends the
        <a href={base + '/docs/components/grids/'}>shared SectionDefinition</a>.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Interface / discriminator</th>
              <th>
                Additional fields beyond <a
                  href={base + '/docs/reference/types/#section-definition'}
                >
                  SectionDefinition
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#hero-section-data'}>HeroSectionData</a>
                </code>
                / <code>hero</code>
              </td>
              <td>
                Optional image: <a href={base + '/docs/reference/types/#image-data'}>ImageData</a>,
                size: <a href={base + '/docs/reference/types/#card-size'}>CardSize</a>,
                textBackground: boolean, actions:
                <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a>[],
                composition: overlay/artwork, imageSide: left/right
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#rich-text-section-data'}>
                    RichTextSectionData
                  </a>
                </code>
                / <code>richText</code>
              </td>
              <td>
                Either body with optional format (markdown/text), or blocks: <a
                  href={base + '/docs/reference/types/#rich-text-block'}
                >
                  RichTextBlock
                </a>[]
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#panel-section-data'}>PanelSectionData</a>
                </code>
                / <code>panel</code>
              </td>
              <td>Required blocks; optional tone (standard/muted), actions</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#image-section-data'}>ImageSectionData</a>
                </code>
                / <code>image</code>
              </td>
              <td>
                Required image: <a href={base + '/docs/reference/types/#image-data'}>ImageData</a>;
                optional description: string, imageSide: left/right
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#video-section-data'}>VideoSectionData</a>
                </code>
                / <code>video</code>
              </td>
              <td>
                Required video: <a href={base + '/docs/reference/types/#video-data'}>VideoData</a>;
                optional description: string, videoSide: left/right
              </td>
            </tr>
            <tr>
              <td>
                <a href={base + '/docs/reference/types/#feature-section-data'}>
                  FeatureSectionData
                </a>
                / <code>features</code>
              </td><td>
                Required list: <a href={base + '/docs/reference/types/#feature-item'}>
                  FeatureItem
                </a>[]; optional featureSize and iconTone. Incomplete rows are centered.
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#card-grid-section-data'}>
                    CardGridSectionData
                  </a>
                </code>
                / <code>cardGrid</code>
              </td>
              <td>
                Required list: <a href={base + '/docs/reference/types/#card-item'}>CardItem</a>[];
                optional cardSize, cardShadow, mediaAspect, mediaFit, contentPlacement, textTone,
                itemSpan, textAlign
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#carousel-section-data'}>
                    CarouselSectionData
                  </a>
                </code>
                / <code>carousel</code>
              </td>
              <td>
                Required list: <a href={base + '/docs/reference/types/#card-item'}>CardItem</a>[];
                optional cardSize, cardShadow, mediaAspect, mediaFit, contentPlacement, textTone,
                textAlign, controls, initialItemKey
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#grid-section-data'}>GridSectionData</a>
                </code>
                / <code>grid</code>
              </td>
              <td>
                Required blocks: &#123; id: string; span?: <a
                  href={base + '/docs/reference/types/#content-span'}
                >
                  ContentSpan
                </a>; sections:
                <a href={base + '/docs/reference/types/#section-data'}>SectionData</a>[] &#125;[]
              </td>
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sections-component-props',
      title: 'Sections component props',
      headline: 'Sections component props',
      variant: 'content'
    }}
  >
    <div class="prose">
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
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#section-data'}>SectionData</a>[]
                </code>
              </td>
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
        <code>
          codeHighlights: Record&lt;string, <a
            href={base + '/docs/reference/types/#highlighted-code'}
          >
            HighlightedCode
          </a>&gt;
        </code>
        supplies derived syntax tokens keyed by section ID and is forwarded into nested grids. Sections
        keys entries by id. A matching custom renderer takes precedence over a built-in and receives the
        complete <code>section</code> prop. Unknown types throw an error during rendering. Recursive grid
        sections forward the same renderer map. No fetching, JSON validation, schema migration or routing
        is performed.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'add-a-custom-section',
      title: 'Add a custom section',
      headline: 'Add a custom section',
      variant: 'content'
    }}
  >
    <div class="prose">
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'related-models',
      title: 'Related models',
      headline: 'Related models',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <a href={base + '/docs/reference/types/#card-item'}>CardItem</a> and
        <a href={base + '/docs/reference/types/#image-data'}>ImageData</a>
        are fully documented in <a href={base + '/docs/components/card/'}>Card and Image</a>;
        <a href={base + '/docs/reference/types/#video-data'}>VideoData</a>
        in <a href={base + '/sections/video/'}>VideoSection</a>. Header uses
        <a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a>,
        <a href={base + '/docs/reference/types/#button-group-item'}>ButtonGroupItem</a>,
        <a href={base + '/docs/reference/types/#breadcrumb'}>Breadcrumb</a>
        and
        <a href={base + '/docs/reference/types/#section-navigation-item'}>SectionNavigationItem</a>.
        <a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a> describes CSS values and is
        not a place to store event handlers or framework components.
      </p>
      <p>
        Related: <a href={base + '/docs/reference/core-api/'}>Core API</a>,
        <a href={base + '/docs/advanced/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div>
  </Section>
</ContentPage>
