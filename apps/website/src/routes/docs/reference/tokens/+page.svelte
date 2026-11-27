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
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'CSS variables and tokens',
    pageTitle: 'CSS variables and tokens · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'CSS variables and tokens',
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
        Timeline uses the shared palette, spacing and typography tokens. Its horizontal frame
        scrolls independently; zoom changes only the time scale.
      </p>
      <p>
        CSS variables customize presentation; <code>layoutTokens</code> supplies canonical numeric values
        for core calculations and generated grid CSS. Changing CSS does not mutate the token object. This
        page distinguishes public theme controls, generated layout variables and implementation details.
      </p>
      <p>
        Navigation measures <code>--ps-selection-x</code>, <code>--ps-selection-y</code>,
        <code>--ps-selection-width</code>, <code>--ps-selection-height</code> and
        <code>--ps-selection-radius</code> internally for the moving selection surface. Do not set
        these measurements yourself. Use <code>--ps-selection</code> for its color and
        <code>--ps-radius</code> for the ButtonGroup's outer corners.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'theme-and-component-variables',
      title: 'Theme and component variables',
      headline: 'Theme and component variables',
      variant: 'content'
    }}
  >
    <div class="prose">
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
              <td>Headings, navigation and controls</td>
            </tr>
            <tr>
              <td><code>--ps-body</code></td>
              <td>#465564</td>
              <td>Section body copy, introductions and descriptions</td>
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
              <td>Cards, icon buttons, ButtonGroups and inputs; transparent hides the edge</td>
            </tr>
            <tr>
              <td><code>--ps-chip-color</code></td><td>var(--ps-accent)</td><td>
                Chip accent; the color prop overrides this inherited default.
              </td>
            </tr>
            <tr>
              <td><code>--ps-button-group-divider</code></td><td>var(--ps-border)</td><td>
                Separators between grouped options
              </td>
            </tr>
            <tr>
              <td><code>--ps-tooltip-background</code></td><td>var(--ps-ink)</td><td>
                Contrasting tooltip surface
              </td>
            </tr>
            <tr>
              <td><code>--ps-tooltip-ink</code></td><td>var(--ps-section-standard)</td><td>
                Tooltip text
              </td>
            </tr>
            <tr>
              <td><code>--ps-tooltip-border</code></td><td>
                24% standard surface, transparent
              </td><td>Tooltip outline</td>
            </tr>
            <tr>
              <td><code>--ps-footer-border</code></td><td>24% footer ink, footer background</td><td>
                Independent footer outline
              </td>
            </tr>
            <tr>
              <td><code>--ps-panel-border</code></td>
              <td>color-mix(in srgb, var(--ps-ink) 12%, transparent)</td>
              <td>Panels, popups and navigation; docked headers have a bottom edge only</td>
            </tr>
            <tr>
              <td><code>--ps-navigation-shadow</code></td>
              <td>0 4px 8px rgb(0 0 0 / 12%)</td>
              <td>
                Header and satellite elevation; popups inherit it unless overridden; none disables
                it
              </td>
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
        Legacy card minimum-width and carousel-width variables were removed in 0.2. Card geometry is
        generated from the same tokens as core.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'generated-grid-variables',
      title: 'Generated grid variables',
      headline: 'Generated grid variables',
      variant: 'content'
    }}
  >
    <div class="prose">
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'internal-resolved-variables',
      title: 'Internal resolved variables',
      headline: 'Internal resolved variables',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        ContentBlock writes <code>--ps-content-block-span-xs</code>,
        <code>--ps-content-block-span-s</code>, <code>--ps-content-block-span-m</code>,
        <code>--ps-content-block-span-l</code>; container rules select
        <code>--ps-content-block-span</code>. Configure the span prop instead of overriding these.
      </p>
      <p>
        SectionSurfaceGroup writes <code>--ps-section-top-radius</code> and
        <code>--ps-section-bottom-radius</code>, using var(--ps-radius) or 0px. Ungrouped surfaces
        default to 0px. Image uses private <code>--image-ratio</code> and <code>--image-fit</code>
        variables; configure <a href={base + '/docs/reference/types/#image-data'}>ImageData</a> instead.
      </p>
      <p>
        Fixed Header uses <code>--ps-header-dock-extra</code> for the gap between the header and
        satellite docking positions. Internal <code>--ps-header-dock-start</code> and
        <code>--ps-header-dock-radius</code> define each surface's corner animation range.
        <code>--ps-sidebar-header-offset</code> adds the docked menu height to desktop sidebar
        offsets inside PageShell; it is zero without a fixed header. Configure Header's
        <code>scrollBehavior</code> prop instead of setting these derived values.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'complete-numeric-token-groups',
      title: 'Complete numeric token groups',
      headline: 'Complete numeric token groups',
      variant: 'content'
    }}
  >
    <div class="prose">
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
              <td>
                xs=0, s=600, m=840, l=1200, xl=1600, 2xl=1809, 3xl=2300; viewport classification and
                selected CSS rules
              </td>
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
              <td>inline=12, block=12; used by core and card CSS</td>
            </tr>
            <tr>
              <td><code>cardMediaInset</code></td>
              <td>12; contained-media inset matching the text; cover uses zero</td>
            </tr>
            <tr>
              <td><code>menu</code></td>
              <td>
                height=66, wideHeight=64, wideTop=16, scrollThreshold=32; generated header
                dimensions and delayed scrolling
              </td>
            </tr>
            <tr>
              <td><code>satellite</code></td>
              <td>width=80, height=40, inset=28, top=28; generated dimensions and positions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Overlay implementation variables <code>--ps-card-overlay-ink</code> and
        <code>--ps-card-overlay-rgb</code> hold the local foreground and gradient channels. Choose textTone
        instead of overriding them.
      </p>
      <p>
        FeatureSection reuses the card column spans and typography. Its private <code>
          --ps-feature-icon-size
        </code> sets 72/104/144px circles for S/M/L; choose featureSize rather than overriding it. Circle
        colors reuse section-standard, section-muted, accent and on-accent.
      </p>
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
              <th>gridSSpan</th><th>gridLSpan</th>
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
              <td>Absent</td><td>Absent</td>
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
              <td>Absent</td><td>3</td>
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
              <td>3</td><td>Absent</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These feed resolveCardLayout and Svelte cards. Descriptions use natural title height;
        descriptions and additional content make the final height content-dependent in below mode.
        Overlay uses a fixed media aspect and scrollable copy. <code> breadcrumb </code> contains:
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
              <td>12</td>
              <td>24</td>
            </tr>
            <tr>
              <td>s</td>
              <td>12</td>
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
        Breadcrumbs uses these generated viewport sizes and minimum heights. Its trail stays on one
        line, with ellipses for long labels and a fixed-width Home icon. Header consumes the
        generated menu and satellite geometry.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Related: <a href={base + '/docs/foundations/themes/'}>Themes and Styling</a>,
        <a href={base + '/docs/design-system/responsive-layout/'}>
          Responsive Layout and Breakpoints
        </a>,
        <a href={base + '/docs/reference/core-api/'}>Core API</a>.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'generated-component-variables',
      title: 'Generated component variables',
      headline: 'Generated component variables',
      variant: 'content'
    }}
  >
    <div class="prose">
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
              <td>32px delayed-scroll interval; override on Header or an ancestor</td>
            </tr>
            <tr>
              <td>
                --ps-satellite-width, --ps-satellite-height, --ps-satellite-inset,
                --ps-satellite-top
              </td>
              <td>80px, 40px, 28px, 28px</td>
            </tr>
            <tr>
              <td>--ps-breadcrumb-font-size, --ps-breadcrumb-height</td>
              <td>Viewport values in the table above</td>
            </tr>
            <tr> <td>--ps-card-medium-span</td><td>2 columns; 3 on the L grid</td></tr><tr>
              <td>--ps-card-large-span</td>
              <td>3 in the S grid, otherwise 4</td>
            </tr>
            <tr>
              <td>--ps-card-span</td>
              <td>Current card span</td>
            </tr>
            <tr>
              <td>--ps-card-title-size, --ps-card-title-weight</td>
              <td>Card title typography</td>
            </tr>
            <tr>
              <td>--ps-card-eyebrow-size, --ps-card-eyebrow-weight</td>
              <td>Card eyebrow typography</td>
            </tr>
            <tr>
              <td>--ps-card-line-height, --ps-card-text-rows</td>
              <td>Card line height and title-only row budget</td>
            </tr>
            <tr>
              <td>--ps-card-media-aspect</td>
              <td>Selected mediaAspect; defaults to 3/2</td>
            </tr>
            <tr>
              <td>--ps-card-media-inset</td>
              <td>12px contained-media inset matching the text; cover uses zero</td>
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'code-colors',
      title: 'Code colors',
      headline: 'Derived syntax colors',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>--ps-code-light</code> and <code>--ps-code-dark</code> are per-token values emitted by CodeBlock
        from its optional highlighted input. They are presentation internals, not global theme settings.
        Code surfaces use the existing standard/muted palette and border/radius tokens.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'shadows',
      title: 'Shadows',
      headline: 'Control shadows',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Set these variables on <code>:root</code>, your <code>.ps-shell</code> theme or a local wrapper.
        Defaults are resolved at each surface, so descendants inherit your controls without JavaScript.
      </p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Variable</th><th>Default</th><th>Effect</th></tr></thead>
          <tbody>
            <tr>
              <td><code>--ps-shadow-color</code></td><td>#000</td><td>
                Shadow color. Prefer an opaque color; its alpha, if supplied, also reduces opacity.
              </td>
            </tr>
            <tr>
              <td><code>--ps-shadow-size</code></td><td>1</td><td>
                Nonnegative multiplier for offset and blur. 2 doubles their size.
              </td>
            </tr>
            <tr>
              <td><code>--ps-shadow-intensity</code></td><td>1</td><td>
                Nonnegative opacity multiplier. 0 hides standard shadows, 0.5 halves their opacity,
                2 doubles it. Opacity is capped at 100%.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre><code
          >{'.ps-shell {\n  --ps-shadow-color: #172330;\n  --ps-shadow-size: 1.5;\n  --ps-shadow-intensity: 0.75;\n}\n\n.ps-shell[data-ps-theme="dark"] {\n  --ps-shadow-intensity: 1.5;\n}'}</code
        ></pre>
      <p>
        For a different direction, spread or multiple shadow layers, use a complete CSS
        <code>box-shadow</code> value in a role override. Set it to <code>none</code> to disable that
        role. Complete overrides take precedence over the shared controls.
      </p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Override</th><th>Default appearance</th><th>Surfaces</th></tr></thead>
          <tbody>
            <tr>
              <td><code>--ps-navigation-shadow</code></td><td>0 4px 8px, 12% opacity</td><td>
                Header and satellites
              </td>
            </tr>
            <tr>
              <td><code>--ps-surface-shadow</code></td><td>0 3px 8px, 12% opacity</td><td>
                Contained sections, sidebars, the contents trigger, and cards with shadow enabled
              </td>
            </tr>
            <tr>
              <td><code>--ps-popup-shadow</code></td><td>Navigation shadow</td><td>
                Menu, settings, search and contents popups
              </td>
            </tr>
            <tr>
              <td><code>--ps-card-hover-shadow</code></td><td>0 8px 20px, 20% opacity</td><td>
                Hover and keyboard focus on cards with shadow enabled
              </td>
            </tr>
            <tr>
              <td><code>--ps-footer-shadow</code></td><td>Surface shadow</td><td>Footer panel</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre><code
          >{'.ps-shell {\n  --ps-popup-shadow: 0 8px 24px rgb(0 0 0 / 18%);\n  --ps-footer-shadow: none;\n}'}</code
        ></pre>
      <p>
        Internal <code>--ps-default-navigation-shadow</code>,
        <code>--ps-default-surface-shadow</code>
        and <code>--ps-default-card-hover-shadow</code> resolve the shared controls on each surface. Use
        the public controls above rather than setting these internal values.
      </p>
      <p>
        The role variables are optional overrides, rather than precomputed values on <code>
          :root
        </code>. When using them for your own components, supply a fallback, for example
        <code>box-shadow: var(--ps-surface-shadow, 0 3px 8px rgb(0 0 0 / 12%))</code>.
      </p>
      <p>
        Increasing the shared size also increases the section shadow's clipping allowance. For
        unusually large complete <code>--ps-surface-shadow</code> overrides, set
        <code>--ps-surface-shadow-extent</code> to a sufficient CSS length, such as
        <code>48px</code>. Internal edges between joined sections remain clipped. Docked contents
        panels remain flat, allowing the section shadow to fall across them. Controls do not add
        shadows to surfaces that are intentionally flat, such as cards with shadow disabled at rest.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sidebar-tokens',
      title: 'Sidebar tokens',
      headline: 'Sidebar tokens'
    }}
  >
    <div class="prose">
      <p>
        <code>layoutTokens.sidebars</code> defines stickyTop (16), contentMenuOffset (16), xl (outer 12,
        gap 12, panelWidth 248), wide (outer 28, gap 28, panelWidth 248) and extraWide (outer 28, gap
        28, panelWidth 300). Docked content menus additionally fill the gap.
      </p>
      <p>
        Generated internal geometry variables: <code>--ps-sidebar-gap</code>,
        <code>--ps-sidebar-sticky-top</code>, <code>--ps-content-menu-offset</code>,
        <code>--ps-sidebar-left-width</code>, <code>--ps-sidebar-right-width</code>,
        <code>--ps-frame-left</code>
        and <code>--ps-frame-right</code>. Change canonical layout tokens and regenerate CSS when
        changing geometry.
      </p>
      <p>
        <code>--ps-surface-shadow</code> controls the subtle left-sidebar and contained section
        shadow. Internal <code>--ps-shadow-top-clip</code> and <code>--ps-shadow-bottom-clip</code>
        prevent seams between connected section surfaces. Internal
        <code>--ps-section-border-top</code>, <code>--ps-section-border-bottom</code> and
        <code>--ps-section-surface-overlap</code> keep their outline continuous.
      </p>
      <p>
        Internal <code>--ps-content-menu-border-start</code>, <code>--ps-content-menu-radius</code>
        and <code>--ps-content-menu-shadow</code>
        switch the right panel between docked and freestanding surfaces.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'selection-surface',
      title: 'Selection surface',
      headline: 'Selection surface',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <p>
      <code>--ps-selection</code> optionally customizes the selected navigation and button-group surface.
      When absent, it falls back to --ps-section-muted. The website uses bergjohann-com's neutral grey
      selection and green-teal accent palette; the package's default theme remains independent.
    </p>
  </Section>
  <Section
    section={{
      id: 'sidebar-viewport',
      title: 'Sidebar viewport',
      headline: 'Sidebar viewport',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <p>
      <code>--ps-sidebar-available-height</code> is computed internally for each scroll panel from
      its current viewport position. It updates on scrolling and resizing, leaving the sticky inset
      below the panel. Native sidebar scrollbars use a thin thumb derived from
      <code>--ps-body</code> and a transparent track.
    </p>
  </Section>
  <Section
    section={{
      id: 'footer-tokens',
      title: 'Footer tokens',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      <code>--ps-footer-background</code> and <code>--ps-footer-ink</code> default to #163570 and
      #fff. <code>--ps-footer-radius</code> falls back to --ps-radius;
      <code>--ps-footer-shadow</code>
      falls back to --ps-surface-shadow. <code>--ps-footer-bar-background</code> and
      <code>--ps-footer-bar-ink</code> fall back to --ps-section-muted and --ps-body. Separators
      inherit bottom-bar ink at 30% opacity. All six tokens have typed
      <a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a> properties.
    </p>
  </Section>
</ContentPage>
