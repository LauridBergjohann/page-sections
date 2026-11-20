<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { Section, ContentGrid, ContentBlock } from '@page-sections/svelte';
<\/script>

<Section
  section={{
    id: 'layout',
    title: 'Layout',
    headline: 'Main story and related notes',
    style: { width: '1100px' }
  }}
>
  <ContentGrid>
    <ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}><p>Main story</p></ContentBlock>
    <ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}><p>Related notes</p></ContentBlock>
  </ContentGrid>
</Section>`
    }
  ];
</script>

<script lang="ts">
  import DeviceLayouts from '$lib/DeviceLayouts.svelte';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Responsive layout', pageTitle: 'Responsive layout · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Responsive layout',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'every-screen',
      title: 'From phones to ultrawide',
      headline: 'Designed for the whole range of screens',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The Spatial Elements layout system behind Page Sections considers the full range of viewing
        conditions: phones, tablets, laptops, desktop monitors and ultrawide screens. Responsive
        design should make thoughtful use of extra space as well as fit into a small window.
      </p>
      <p>
        On ultrawide screens, the content column stays centered and capped at 1536 CSS pixels. Wider
        sidebars use the surrounding space without stretching the main content across the entire
        display. The seven viewport sizes below describe available space, not a fixed device model.
      </p>
    </div>
    <DeviceLayouts />
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Page Sections distinguishes <strong>viewport width</strong> from
        <strong>content-container width</strong>. A narrow article in a wide window should still use
        a narrow content grid. Dimensions are CSS pixels; physical screen size and device pixel
        ratio do not select a breakpoint.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'viewport-classification-and-page-width',
      title: 'Viewport classification and page width',
      headline: 'Viewport classification and page width',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Width</th>
              <th><code>resolveViewportLayout</code></th>
              <th>Default ordinary content width</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;600</td>
              <td>xs</td>
              <td>Available width</td>
            </tr>
            <tr>
              <td>600–839</td>
              <td>s</td>
              <td>Available width</td>
            </tr>
            <tr>
              <td>840–1199</td>
              <td>m</td>
              <td>Available width</td>
            </tr>
            <tr>
              <td>1200–1599</td>
              <td>l</td>
              <td>Available width, capped at 1536px</td>
            </tr>
            <tr>
              <td>1600–1808</td>
              <td>xl</td>
              <td>Parent available width minus 272px, capped at 1536px</td>
            </tr>
            <tr>
              <td>1809–2299</td>
              <td>2xl</td>
              <td>Available width, capped at 1536px</td>
            </tr>
            <tr>
              <td>&gt;=2300</td>
              <td>3xl</td>
              <td>Same ordinary content cap</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The 1536px cap is canonical. <code
          >resolvePageLayout(<a href={base + '/docs/reference/types/#responsive-layout-input'}
            >ResponsiveLayoutInput</a
          >)</code
        > resolves content/menu positions, including optional scrollbar and safe-area reservations. The
        native navigation uses the available containing-block width; mount it at the viewport level.
      </p>
      <p>
        Header shows its item disclosure below 1200px and satellites at 1600px. ContentPage uses its
        sidebars from 1600px. Image/video pairs split at a 600px container; artwork heroes at 840px.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'content-grids',
      title: 'Content grids',
      headline: 'Content grids',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Unpadded container width</th>
              <th>Grid</th>
              <th>Columns</th>
              <th>Gutter/gap</th>
              <th>Heading size / line</th>
              <th>Body size / line</th>
              <th>Heading gap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;600</td>
              <td>xs</td>
              <td>4</td>
              <td>12px</td>
              <td>18 / 28px</td>
              <td>14 / 20px</td>
              <td>8px</td>
            </tr>
            <tr>
              <td>600–839</td>
              <td>s</td>
              <td>6</td>
              <td>16px</td>
              <td>18 / 28px</td>
              <td>14 / 20px</td>
              <td>8px</td>
            </tr>
            <tr>
              <td>840–1199</td>
              <td>m</td>
              <td>8</td>
              <td>16px</td>
              <td>20 / 32px</td>
              <td>14 / 20px</td>
              <td>12px</td>
            </tr>
            <tr>
              <td>&gt;=1200</td>
              <td>l</td>
              <td>12</td>
              <td>24px</td>
              <td>24 / 40px</td>
              <td>16 / 24px</td>
              <td>16px</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Section creates a named <code>ps-content</code> container, and its inner wrapper supplies one
        outer gutter on each side. ContentGrid adds only gaps between columns. A container exactly 840px
        wide selects m before its 32px total horizontal padding is subtracted.
      </p>
      <p>
        For container width c, column count n and gap g, column width is <code
          >max(0, (c - (n + 1) * g) / n)</code
        >. A span of s columns occupies <code>s * columnWidth + (s - 1) * g</code>, capped by
        container width. Numeric core resolution caps c at 1536px and normalizes negative/nonfinite
        input to zero. The section content wrapper also caps at 1536px; full layout can extend its
        outer surface.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'explicit-responsive-blocks',
      title: 'Explicit responsive blocks',
      headline: 'Explicit responsive blocks',
      variant: 'content'
    }}
    ><div class="prose">
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Below 600px the blocks stack as full rows. On s they split evenly; on m and l the first is
        wider. Omitted spans fill a row; responsive values inherit mobile-first. Oversized values
        clamp; nonpositive, noninteger and nonfinite values fill a row. ContentBlock also emits
        client warnings for invalid/clamped values. Visual order follows source order; no dense
        placement is applied.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'card-layout',
      title: 'Card layout',
      headline: 'Card layout',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Cards use the same media-plus-text layout in CardGridSection and CarouselSection: S/M span 2
        columns, L spans 4 (3 on the S grid). Media ratios are 3/2 (default), 4/3 or 1/1; titles
        have two lines in S/M and three in L, with an additional collection-wide eyebrow line for
        M/L when used. Text has 12px padding; contained media has an 8px inset. S titles are 12px.
        The complete card is not constrained to a square. Geometry follows layoutTokens.cards and
        resolveCardLayout.
      </p>
      <p>
        Descriptions appear below the title when provided, with natural text height and equal grid
        rows. CardGridSection accepts itemSpan to override the default width. A card’s main link
        covers its whole surface, while additional action links keep their own destinations.
        Optional cardShadow adds a resting shadow; hover and keyboard focus emphasize the border and
        elevation.
      </p>
      <p>
        Nested text and panels omit redundant outer gutters. A nested grid or card collection
        establishes a new grid and owns one gutter pair; nested declarative grids should use <code
          >&lt;Section inset&gt;</code
        >. Breakpoint selection always uses that section container before padding.
      </p>
      <p>
        See <a href={base + '/docs/reference/core-api/'}>Core API</a> and
        <a href={base + '/docs/reference/tokens/'}>CSS Variables and Layout Tokens</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sidebar-geometry',
      title: 'Sidebar geometry',
      headline: 'Sidebar geometry'
    }}
    ><div class="prose">
      <p>
        <code>resolveContentPageLayout</code> keeps the main-menu geometry independent. Below 1600px no
        desktop rail is reserved. XL uses 248px panels with 12px gaps and outer margins. The unoccupied
        side keeps 136px. At 2XL panels remain 248px, with 28px gaps and outer margins; an unoccupied
        side follows the centered menu edge. At 3XL panels grow to 300px and the content stays centered
        at 1536px. A docked content menu includes the gap in its surface; set contentMenuDetached to true
        for the freestanding rectangle.
      </p>
    </div></Section
  >
</ContentPage>
