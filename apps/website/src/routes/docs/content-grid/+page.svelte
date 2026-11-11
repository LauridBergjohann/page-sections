<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import {
    ContentPage,
    Section,
    ContentGrid,
    ContentBlock
  } from '@page-sections/svelte';
<\/script>

<ContentPage page={{ title: 'Visit the garden' }}>
  <Section
    section={{
      id: 'visit',
      title: 'Visit',
      headline: 'Make a day of it',
      background: { color: 'muted' }
    }}
  >
    <ContentGrid>
      <ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}>
        <h3>What to bring</h3>
        <p>Comfortable shoes and a little curiosity.</p>
      </ContentBlock>
      <ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}>
        <h3>Opening hours</h3>
        <p>Saturdays, 10 am–2 pm.</p>
      </ContentBlock>
    </ContentGrid>
  </Section>
</ContentPage>`
    }
  ];
</script>

<script lang="ts">
  import GridPlayground from '$lib/GridPlayground.svelte';
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Sections and grids', pageTitle: 'Sections and grids · Page Sections' }}
  showContentMenu
>
  <Section
    section={{ id: 'playground', title: 'Try it', headline: 'Try it yourself', variant: 'content' }}
    ><GridPlayground /></Section
  >
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Section gives ordinary content a semantic region, anchor, spacing and optional background.
        ContentGrid and ContentBlock arrange explicit content inside it. Use them when a page needs
        an article/aside pair, feature columns or other layouts that vary with available width.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'section-props',
      title: 'Section props',
      headline: 'Section props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>section: SectionDefinition</code> is required. <code>children?: Snippet</code>
        supplies content. Section also accepts <code>HTMLAttributes&lt;HTMLElement&gt;</code> except
        <code>id</code>
        and the ordinary children attribute; its own <code>class</code> is combined with the library class.
        Component-owned ID, accessibility and layout attributes are computed from section metadata. Do
        not depend on overriding them through forwarded attributes.
      </p>
      <h3 id="complete-sectiondefinition">Complete SectionDefinition</h3>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Default / behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code>, required</td>
              <td>Page-local anchor; registered IDs match <code>^[a-z][a-z0-9-]*$</code></td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code>, required</td>
              <td>Nonblank navigation/accessibility label</td>
            </tr>
            <tr>
              <td><code>headline</code></td>
              <td><code>string</code></td>
              <td>No visible heading unless supplied</td>
            </tr>
            <tr>
              <td><code>eyebrow</code></td>
              <td><code>string</code></td>
              <td>Optional text before heading</td>
            </tr>
            <tr>
              <td><code>introduction</code></td>
              <td><code>string</code></td>
              <td>Optional introductory paragraph</td>
            </tr>
            <tr>
              <td><code>headingLevel</code></td>
              <td><code>HeadingLevel</code> (1-6)</td>
              <td>Inherited; standalone 2</td>
            </tr>
            <tr>
              <td><code>background</code></td>
              <td><code>SectionBackground</code></td>
              <td>Transparent, standard width</td>
            </tr>
            <tr>
              <td><code>layout</code></td>
              <td
                ><code>'full'</code>, <code>'wide'</code>, <code>'narrow'</code>,
                <code>'inherit'</code></td
              >
              <td>inherit</td>
            </tr>
            <tr>
              <td><code>spacing</code></td>
              <td
                ><code>'none'</code>, <code>'tight'</code>, <code>'normal'</code>,
                <code>'loose'</code>, <code>'spacious'</code></td
              >
              <td>normal; nested sections default to none</td>
            </tr>
            <tr>
              <td><code>divider</code></td>
              <td
                ><code>'none'</code>, <code>'top'</code>, <code>'bottom'</code>,
                <code>'both'</code></td
              >
              <td>none</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'default'</code>, <code>'content'</code>, <code>'feature'</code></td>
              <td>Default grid headings, content headings or larger feature headings</td>
            </tr>
            <tr>
              <td><code>style</code></td>
              <td><code>&#123; width?: string; color?: string &#125;</code></td>
              <td>Optional CSS width/color overrides</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <code>layout: 'narrow'</code> caps at <code>--ps-narrow-max</code> (780px); wide caps at the
        canonical 1536px. Inherit fills the parent. Inside ContentPage, full layout also respects
        the page's content column and its 1536px limit, including asymmetric sidebar layouts. Use
        <code>background.size: 'full'</code>
        to paint a viewport-wide background independently of content width. Outside ContentPage, full
        layout uses <code>100vw</code> with centered negative margins. <code>style.width</code> normally
        caps at the available width.
      </p>
      <p>
        Vertical padding is 0, 0.5, 1, 2 or 4 times the active grid gap for
        none/tight/normal/loose/spacious. Inset sections retain one horizontal gutter pair even with
        spacing none. Dividers are 1px borders using <code>--ps-border</code>. Variants select
        default grid headings, content headings or larger feature headings.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'contentgrid-and-contentblock-props',
      title: 'ContentGrid and ContentBlock props',
      headline: 'ContentGrid and ContentBlock props',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ContentGrid</td>
              <td
                >Optional <code>children: Snippet</code> and standard div HTML attributes, including class/style</td
              >
            </tr>
            <tr>
              <td>ContentBlock</td>
              <td>The same, plus optional <code>span: ContentSpan</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        ContentSpan is <code>number</code> or
        <code>Partial&lt;Record&lt;ContentGridSize, number&gt;&gt;</code>, where ContentGridSize is
        <code>xs</code>, <code>s</code>, <code>m</code>, <code>l</code>. Missing spans fill a row.
        An object inherits the last smaller configured span; before its first configured value, it
        fills the row. Positive integers clamp to available columns; invalid numbers fill the row.
        ContentBlock warns about invalid/clamped values in a client effect; these warnings are not
        development-only.
      </p>
      <p>
        Section establishes a named container <strong>before</strong> its inner padding. ContentGrid
        adds no second outer padding. Standalone grids need a <code>.ps-content-container</code> ancestor
        to respond to container width; without one, base XS rules apply. Grid rows use normal flow, not
        dense backfilling, so DOM and keyboard order stay intact.
      </p>
      <p>
        Section renders the inherited heading level (standalone h2, up to h6) when headline is set;
        otherwise the region uses title as its accessible label. Standalone sections work without a
        registry, while sections in ContentPage register and update automatically. Neither grid
        component introduces a heading or landmark. CSS layout works in the first SSR response.
      </p>
      <p>
        Related: <a href={base + '/docs/responsive-layout/'}>Responsive Layout and Breakpoints</a>,
        <a href={base + '/docs/backgrounds/'}>Section Backgrounds and Surface Groups</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'nested-sections-and-diagnostics',
      title: 'Nested sections and diagnostics',
      headline: 'Nested sections and diagnostics',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>renderHeader</code> defaults to true; disable it only when a specialized renderer
        supplies the matching headline ID itself. <code>inset</code> defaults to true for top-level sections
        and false for nested text/panels. Grid renderers set inset=true to establish their own single
        gutter pair. Nested spacing defaults to none; top-level spacing defaults to normal. Spacing factors
        none/tight/normal/loose/spacious are 0/0.5/1/2/4 times the active grid gap.
      </p>
      <p>
        <code>onDiagnostic?: (diagnostic: SectionBackgroundDiagnostic) =&gt; void</code> receives normalization
        diagnostics after hydration, once per requested color/size/context combination. It can update
        host state. Page kind is inherited from SectionSurfaceGroup; normalization itself also applies
        during SSR.
      </p>
    </div></Section
  >
</ContentPage>
