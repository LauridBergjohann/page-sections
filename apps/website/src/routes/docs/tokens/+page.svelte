<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'ts',
      code: `import { layoutTokens } from '@page-sections/core';
console.log(layoutTokens.grid.m.columns, layoutTokens.grid.m.gap); // 8, 16`
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'CSS variables and tokens',
    pageTitle: 'CSS variables and tokens · Page Sections'
  }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        CSS variables customize presentation; <code>layoutTokens</code> supplies canonical numeric values
        for core calculations and generated grid CSS. Changing CSS does not mutate the token object. This
        page distinguishes public theme controls, generated layout variables and implementation details.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'theme-and-component-variables',
      title: 'Theme and component variables',
      headline: 'Theme and component variables',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>--ps-background</code></td>
              <td>#f6f7f9</td>
              <td>Page/navigation background</td>
            </tr>
            <tr>
              <td><code>--ps-ink</code></td>
              <td>#172330</td>
              <td>Main text</td>
            </tr>
            <tr>
              <td><code>--ps-body</code></td>
              <td>#465564</td>
              <td>Supporting text</td>
            </tr>
            <tr>
              <td><code>--ps-accent</code></td>
              <td>#125cb0</td>
              <td>Links, focus and accents</td>
            </tr>
            <tr>
              <td><code>--ps-on-accent</code></td>
              <td>#fff</td>
              <td>Text on primary actions; dark default #151d27</td>
            </tr>
            <tr>
              <td><code>--ps-section-standard</code></td>
              <td>#fff</td>
              <td>Standard surface</td>
            </tr>
            <tr>
              <td><code>--ps-section-muted</code></td>
              <td>#e8edf3</td>
              <td>Muted surface</td>
            </tr>
            <tr>
              <td><code>--ps-radius</code></td>
              <td>18px</td>
              <td>Surface/media/control rounding</td>
            </tr>
            <tr>
              <td><code>--ps-font-family</code></td>
              <td>system-ui, sans-serif</td>
              <td>Shared typography</td>
            </tr>
            <tr>
              <td><code>--ps-content-max</code></td>
              <td>1536px</td>
              <td>Canonical metadata; not a theme override</td>
            </tr>
            <tr>
              <td><code>--ps-narrow-max</code></td>
              <td>780px</td>
              <td>Narrow sections</td>
            </tr>
            <tr>
              <td><code>--ps-border</code></td>
              <td>color-mix(in srgb, var(--ps-ink) 18%, transparent)</td>
              <td>Borders</td>
            </tr>
            <tr>
              <td><code>--ps-navigation-shadow</code></td>
              <td>0 4px 8px rgb(0 0 0 / 12%)</td>
              <td>Header and satellite elevation; none disables it</td>
            </tr>
            <tr>
              <td><code>--ps-scroll-offset</code></td>
              <td>1rem fallback</td>
              <td>Section anchor scroll margin</td>
            </tr>
            <tr>
              <td><code>--ps-section-width</code></td>
              <td>100% fallback</td>
              <td>Section width, also assigned by section.style.width</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Dark mode (<code>[data-ps-theme='dark']</code>) assigns background #151d27, ink #f2f5fa,
        body #bdcbdc, accent #91baff, standard #202d3b and muted #28384a. Other variables retain
        their values. The border is defined on :root; do not assume it is recomputed from every
        descendant ink override. Set border explicitly when adapting a palette if needed.
      </p>
      <p>
        Legacy card minimum-width and carousel-width variables were removed in 0.2. Catalog geometry
        is generated from the same tokens as core.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'generated-grid-variables',
      title: 'Generated grid variables',
      headline: 'Generated grid variables',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The ps-grid-scope class resolves the active container size. These generated values are
        read-only layout contracts, not theme inputs: --ps-grid-columns, --ps-grid-gap,
        --ps-grid-headline-size, --ps-grid-headline-line-height, --ps-grid-body-size,
        --ps-grid-body-line-height, --ps-grid-headline-gap. Legacy --ps-&#123;size&#125;-* inputs
        were removed. Defaults:
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Grid</th>
              <th>minWidth</th>
              <th>columns</th>
              <th>gap</th>
              <th>headlineSize</th>
              <th>headlineLineHeight</th>
              <th>bodySize</th>
              <th>bodyLineHeight</th>
              <th>headlineGap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>xs</td>
              <td>0</td>
              <td>4</td>
              <td>12</td>
              <td>18</td>
              <td>28</td>
              <td>14</td>
              <td>20</td>
              <td>8</td>
            </tr>
            <tr>
              <td>s</td>
              <td>600</td>
              <td>6</td>
              <td>16</td>
              <td>18</td>
              <td>28</td>
              <td>14</td>
              <td>20</td>
              <td>8</td>
            </tr>
            <tr>
              <td>m</td>
              <td>840</td>
              <td>8</td>
              <td>16</td>
              <td>20</td>
              <td>32</td>
              <td>14</td>
              <td>20</td>
              <td>12</td>
            </tr>
            <tr>
              <td>l</td>
              <td>1200</td>
              <td>12</td>
              <td>24</td>
              <td>24</td>
              <td>40</td>
              <td>16</td>
              <td>24</td>
              <td>16</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        All dimensional values are CSS pixels. Change canonical layoutTokens plus the generator and
        parity tests when revising geometry; overriding columns/gaps only in a host stylesheet
        breaks the shared contract.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'internal-resolved-variables',
      title: 'Internal resolved variables',
      headline: 'Internal resolved variables',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        ContentBlock writes <code>--ps-content-block-span-xs</code>,
        <code>--ps-content-block-span-s</code>, <code>--ps-content-block-span-m</code>,
        <code>--ps-content-block-span-l</code>; container rules select
        <code>--ps-content-block-span</code>. Configure the span prop instead of overriding these.
      </p>
      <p>
        SectionSurfaceGroup writes <code>--ps-section-top-radius</code> and
        <code>--ps-section-bottom-radius</code>, using var(--ps-radius) or 0px. Ungrouped surfaces
        default to 0px. Image uses private <code>--image-ratio</code> and <code>--image-fit</code> variables;
        configure ImageData instead.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'complete-numeric-token-groups',
      title: 'Complete numeric token groups',
      headline: 'Complete numeric token groups',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>layoutTokens</code> is exported from core; no JSON deep import is required. The groups below
        describe its entire structure. Treat it as canonical read-only configuration in application code;
        there is no reactive theme API for mutating it.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Values and consumers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>contentMax</code></td>
              <td>1536; numeric content cap and generated CSS default</td>
            </tr>
            <tr>
              <td><code>layoutMinWidths</code></td>
              <td
                >xs=0, s=600, m=840, l=1200, xl=1600, 2xl=1809, 3xl=2300; viewport classification
                and selected CSS rules</td
              >
            </tr>
            <tr>
              <td><code>grid</code></td>
              <td>Four rows in the complete table above; numeric grid and generated CSS</td>
            </tr>
            <tr>
              <td><code>xlContentInset</code></td>
              <td>136; each side's generated inset between xl and 2xl</td>
            </tr>
            <tr>
              <td><code>cardTextInset</code></td>
              <td>inline=12, block=12; used by core and catalog CSS</td>
            </tr>
            <tr>
              <td><code>cardMediaInset</code></td>
              <td>8; contained-media inset; cover uses zero</td>
            </tr>
            <tr>
              <td><code>menu</code></td>
              <td
                >height=66, wideHeight=64, wideTop=16, scrollThreshold=112; generated header
                dimensions and delayed scrolling</td
              >
            </tr>
            <tr>
              <td><code>satellite</code></td>
              <td>width=80, height=40, inset=28, top=28; generated dimensions and positions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><code>cards</code> contains:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>span</th>
              <th>titleSize</th>
              <th>titleWeight</th>
              <th>eyebrowSize</th>
              <th>eyebrowWeight</th>
              <th>lineHeight</th>
              <th>rows</th>
              <th>gridSSpan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>s</td>
              <td>2</td>
              <td>12</td>
              <td>500</td>
              <td>0</td>
              <td>400</td>
              <td>18</td>
              <td>2</td>
              <td>Absent</td>
            </tr>
            <tr>
              <td>m</td>
              <td>2</td>
              <td>14</td>
              <td>500</td>
              <td>12</td>
              <td>400</td>
              <td>20</td>
              <td>2</td>
              <td>Absent</td>
            </tr>
            <tr>
              <td>l</td>
              <td>4</td>
              <td>18</td>
              <td>500</td>
              <td>14</td>
              <td>400</td>
              <td>24</td>
              <td>3</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These feed resolveCardLayout and Svelte catalog cards; editorial cards use content
        typography. <code>breadcrumb</code> contains:
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Viewport size</th>
              <th>fontSize</th>
              <th>height</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>xs</td>
              <td>10</td>
              <td>24</td>
            </tr>
            <tr>
              <td>s</td>
              <td>10</td>
              <td>24</td>
            </tr>
            <tr>
              <td>m</td>
              <td>12</td>
              <td>30</td>
            </tr>
            <tr>
              <td>l</td>
              <td>14</td>
              <td>40</td>
            </tr>
            <tr>
              <td>xl</td>
              <td>14</td>
              <td>40</td>
            </tr>
            <tr>
              <td>2xl</td>
              <td>14</td>
              <td>40</td>
            </tr>
            <tr>
              <td>3xl</td>
              <td>14</td>
              <td>40</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Breadcrumbs consumes these generated viewport sizes and minimum heights, allowing wrapping
        to grow beyond the minimum. Navigation consumes the generated menu and satellite geometry.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Related: <a href={base + '/docs/themes/'}>Themes and Styling</a>,
        <a href={base + '/docs/responsive-layout/'}>Responsive Layout and Breakpoints</a>,
        <a href={base + '/docs/core-api/'}>Core API</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'generated-component-variables',
      title: 'Generated component variables',
      headline: 'Generated component variables',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        These variables are implementation outputs. Configure component props or canonical tokens
        instead of assigning them in a host theme.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Variables</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>--ps-menu-height, --ps-menu-top, --ps-nav-height</td>
              <td>66/0/66 below XL; 64/16/80 from XL</td>
            </tr>
            <tr>
              <td>--ps-sticky-range</td>
              <td>112px delayed-scroll interval</td>
            </tr>
            <tr>
              <td
                >--ps-satellite-width, --ps-satellite-height, --ps-satellite-inset,
                --ps-satellite-top</td
              >
              <td>80px, 40px, 28px, 28px</td>
            </tr>
            <tr>
              <td>--ps-breadcrumb-font-size, --ps-breadcrumb-height</td>
              <td>Viewport values in the table above</td>
            </tr>
            <tr>
              <td>--ps-card-large-span</td>
              <td>3 in the S grid, otherwise 4</td>
            </tr>
            <tr>
              <td>--ps-card-span</td>
              <td>Current catalog span</td>
            </tr>
            <tr>
              <td>--ps-card-title-size, --ps-card-title-weight</td>
              <td>Catalog title typography</td>
            </tr>
            <tr>
              <td>--ps-card-eyebrow-size, --ps-card-eyebrow-weight</td>
              <td>Catalog eyebrow typography</td>
            </tr>
            <tr>
              <td>--ps-card-line-height, --ps-card-text-rows</td>
              <td>Catalog line height and title-only row budget</td>
            </tr>
            <tr>
              <td>--ps-card-media-aspect</td>
              <td>Selected mediaAspect; defaults to 3/2</td>
            </tr>
            <tr>
              <td>--ps-card-media-inset</td>
              <td>8px contained-media inset; cover uses zero</td>
            </tr>
            <tr>
              <td>--ps-card-text-inset-inline, --ps-card-text-inset-block</td>
              <td>12px each</td>
            </tr>
            <tr>
              <td>--ps-spacing-factor</td>
              <td>none/tight/normal/loose/spacious = 0/0.5/1/2/4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div></Section
  >
  <Section
    section={{
      id: 'code-colors',
      title: 'Code colors',
      headline: 'Derived syntax colors',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>--ps-code-light</code> and <code>--ps-code-dark</code> are per-token values emitted by CodeBlock
        from its optional highlighted input. They are presentation internals, not global theme settings.
        Code surfaces use the existing standard/muted palette and border/radius tokens.
      </p>
    </div></Section
  >
</ContentPage>
