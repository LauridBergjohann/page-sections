<script module lang="ts">
  // Executable examples are owned by this page and checked by check:docs.
  export const examples: { language: string; code: string; filename?: string; group?: string }[] =
    [];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Migration from 0.1', pageTitle: 'Migration from 0.1 · Page Sections' }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>﻿# Migrating to 0.2</p>
      <p>
        Version 0.2 unifies the native layout with the canonical Spatial Elements geometry and adds
        content structures for ordinary websites.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'required-changes-from-011',
      title: 'Required changes from 0.1.1',
      headline: 'Required changes from 0.1.1',
      variant: 'content'
    }}
    ><div class="prose">
      <ol>
        <li>
          Choose cardVariant=&quot;editorial&quot; for cards with descriptions, snippets, footers or
          separate actions. The default catalog variant uses a media frame plus independent title
          space; its safe href makes the entire card a link.
        </li>
        <li>
          Remove CardItem.size. Set one cardSize on the collection. Catalog S/M/L spans 2/2/4
          columns, except L spans 3 in the S grid. Use editorial itemSpan for responsive content
          columns.
        </li>
        <li>
          Remove PageTheme.contentMax and old per-size grid, ps-card-min and ps-carousel-card-width
          overrides. The 1536px cap and grid geometry are shared contracts. Use narrowMax and
          page.bodyLayout='narrow' for reading widths.
        </li>
        <li>
          Review inherited heading levels. Sections/cards/panels now follow their nesting context
          (up to h6). Explicit headingLevel remains available. Authored Markdown headings are
          unchanged.
        </li>
        <li>
          Review spacing: named spacing is a multiple of the active grid gap; nested text/panels
          omit redundant gutters. Nested grids establish their own container and one gutter pair.
        </li>
        <li>
          Surface rounding starts at viewport XL; detail groups force standard backgrounds and lose
          rounding at 3XL. Breadcrumb sizes now follow viewport tokens.
        </li>
      </ol>
    </div></Section
  >
  <Section
    section={{
      id: 'card-media-and-text',
      title: 'Card media and text',
      headline: 'Card media and text',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Set mediaAspect=&quot;3/2&quot;, &quot;4/3&quot; or &quot;1/1&quot; on a collection; the
        default is 3/2. Use mediaFit=&quot;contain&quot; (catalog default, inset 8px) for complete
        objects, or &quot;cover&quot; (editorial default) for cropped photos. These props override
        per-image aspect/fit within cards. S now spans two columns with a 12px title; M uses 14px.
        S/M titles reserve two lines and L three. M/L eyebrows add a separate line consistently
        across the collection. Grid rows share a height.
      </p>
      <p>
        When adopting this release in Spatial Elements, start with mediaAspect=&quot;1/1&quot; and
        mediaFit=&quot;contain&quot;. Remove the old square-card and 75/25 split assumptions, and
        update virtual row heights, camera fitting, transition rectangles and appearance tests to
        the new measurements. Keep the title budget independent of labels, and use the actual inner
        media element for poster/geometry parity. This is a deliberate revision of the Beta.8 card
        specification.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'replacing-website-specific-sections',
      title: 'Replacing website-specific sections',
      headline: 'Replacing website-specific sections',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Website content</th>
              <th>Public model/component</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Home introduction with artwork</td>
              <td>ContentPageData.hero, composition=artwork</td>
            </tr>
            <tr>
              <td>Project/feature cards with copy and links</td>
              <td>cardGrid with cardVariant=editorial, itemSpan, footer and actions</td>
            </tr>
            <tr>
              <td>About/biography and fact columns</td>
              <td>grid with nested richText and panel sections</td>
            </tr>
            <tr>
              <td>Legal paragraphs and addresses</td>
              <td>bodyLayout=narrow, richText blocks: paragraph/address/list</td>
            </tr>
            <tr>
              <td>Inline email/contact links</td>
              <td>InlineText link runs</td>
            </tr>
            <tr>
              <td>Notes and calls to action</td>
              <td>panel section or nested panel block</td>
            </tr>
            <tr>
              <td>Catalog list and native carousel</td>
              <td>cardGrid/carousel with catalog S/M/L</td>
            </tr>
            <tr>
              <td>Responsive main menu and settings</td>
              <td>Navigation items, brand, left/right, closeKey</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        See the <a href={base + '/showcase/portfolio/'}>portfolio</a> and
        <a href={base + '/showcase/legal/'}>legal page</a> for complete data-driven pages. The
        <a href={base + '/docs/card-grid/'}>card guide</a>
        compares the collection options, and the
        <a href={base + '/showcase/integration/'}>integration example</a> exercises attachment and selection
        lifecycles.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'release-and-adoption-sequence',
      title: 'Release and adoption sequence',
      headline: 'Release and adoption sequence',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Version 0.2 introduced these layout and content changes. Both packages continue to advance
        together through the fixed Changesets group. When upgrading from 0.1, review this guide and
        verify your application against the exact published versions.
      </p>
      <p>
        Replace application-specific content adapters with the public models where appropriate and
        remove redundant geometry overrides. Spatial integrations keep their stage, virtual scroll,
        GPU surfaces and camera interactions host-owned. CardElements/oncardready and media/surface
        snippets provide attachment boundaries; the native carousel is not a replacement for the
        spatial selection engine.
      </p>
      <p>
        Related: <a href={base + '/docs/card-grid/'}>CardGridSection</a>,
        <a href={base + '/docs/rich-text/'}>RichTextSection</a>,
        <a href={base + '/docs/navigation/'}>Navigation</a>.
      </p>
    </div></Section
  >
</ContentPage>
