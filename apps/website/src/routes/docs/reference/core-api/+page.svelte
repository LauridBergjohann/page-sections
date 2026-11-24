<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'ts',
      code: `import {
  resolveContentGrid,
  contentSpanWidth,
  resolveCardLayout
} from '@page-sections/core';
const grid = resolveContentGrid(840);
console.log(grid.size, grid.columns, contentSpanWidth(840, 3)); // m, 8, 293
const card = resolveCardLayout(840, 'm');
console.log(card.width, card.height, card.media);`
    },
    {
      language: 'ts',
      code: `import { SectionRegistry } from '@page-sections/core';
const registry = new SectionRegistry();
const handle = registry.register({ id: 'intro', title: 'Introduction' });
handle.update({ id: 'intro', title: 'Start here' });
console.log(registry.sections);
handle.unregister();`
    },
    {
      language: 'ts',
      code: `import { createSectionBackgroundNormalizer } from '@page-sections/core';
const normalize = createSectionBackgroundNormalizer((diagnostic) =>
  console.warn(diagnostic.message)
);
const background = normalize(
  { color: 'standardToMuted', size: 'full' },
  { pageKind: 'content' }
);
console.log(background.cssBackground);`
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

<ContentPage page={{ title: 'Core API', pageTitle: 'Core API · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Core API',
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
        Timeline data: <a href={base + '/docs/reference/types/#timeline-section-data'}>
          TimelineSectionData
        </a>, <a href={base + '/docs/reference/types/#timeline-category'}>TimelineCategory</a>,
        <a href={base + '/docs/reference/types/#timeline-event'}>TimelineEvent</a>,
        <a href={base + '/docs/reference/types/#timeline-event-base'}>TimelineEventBase</a>,
        <a href={base + '/docs/reference/types/#timeline-point-event'}>TimelinePointEvent</a>,
        <a href={base + '/docs/reference/types/#timeline-period-event'}>TimelinePeriodEvent</a>,
        <a href={base + '/docs/reference/types/#timeline-date'}>TimelineDate</a>.
      </p>
      <p>
        All runtime functions, constants, classes and types below are exported from <code>
          @page-sections/core
        </code>. The package has no runtime dependencies, DOM requirement or rendering
        implementation. Svelte re-exports its types only.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'layout-constants-and-types',
      title: 'Layout constants and types',
      headline: 'Layout constants and types',
      variant: 'content'
    }}
  >
    <div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Export</th>
              <th>Value / shape</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>layoutTokens</code></td>
              <td>Canonical JSON object; see complete token reference</td>
            </tr>
            <tr>
              <td><code>contentGridSizes</code></td>
              <td>Readonly tuple: xs, s, m, l</td>
            </tr>
            <tr>
              <td><code>viewportLayoutSizes</code></td>
              <td>Readonly tuple: xs, s, m, l, xl, 2xl, 3xl</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#content-grid-size'}>ContentGridSize</a>
                </code>
              </td>
              <td>Union of contentGridSizes values</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#viewport-layout-size'}>
                    ViewportLayoutSize
                  </a>
                </code>
              </td>
              <td>Union of viewportLayoutSizes values</td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#content-span'}>ContentSpan</a></code>
              </td>
              <td>
                number or Partial&lt;Record&lt;<a
                  href={base + '/docs/reference/types/#content-grid-size'}
                >
                  ContentGridSize
                </a>, number&gt;&gt;
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#layout-card-size'}>LayoutCardSize</a>
                </code>
              </td>
              <td>keyof layoutTokens.cards: s, m, l</td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#layout-rect'}>LayoutRect</a></code>
              </td>
              <td>x, y, width, height: number</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#layout-insets'}>LayoutInsets</a>
                </code>
              </td>
              <td>top, right, bottom, left: number</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#responsive-layout-input'}>
                    ResponsiveLayoutInput
                  </a>
                </code>
              </td>
              <td>
                Required width/height: number; optional scrollbarWidth: number, safeArea:
                Partial&lt;<a href={base + '/docs/reference/types/#layout-insets'}>
                  LayoutInsets
                </a>&gt;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <code>
          resolvePageLayout(input: <a
            href={base + '/docs/reference/types/#responsive-layout-input'}
          >
            ResponsiveLayoutInput
          </a>)
        </code>
        returns
        <code>
          &#123; layout, content: &#123; x, width &#125;, menu: &#123; x, y, width, height &#125;
          &#125;
        </code>. It accounts for a reserved scrollbar and safe-area insets while classifying the
        original viewport width. The host owns those measurements; native Header assumes a
        full-width containing block.
      </p>
      <p>
        <code>resolveMenuOffset(scrollY: number, fixed = false)</code> returns zero until 32px, then
        <code>32 - scrollY</code>; fixed mode always returns zero.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'layout-functions',
      title: 'Layout functions',
      headline: 'Layout functions',
      variant: 'content'
    }}
  >
    <div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Function</th>
              <th>Result and behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>
                  resolveViewportLayout(width: number): <a
                    href={base + '/docs/reference/types/#viewport-layout-size'}
                  >
                    ViewportLayoutSize
                  </a>
                </code>
              </td>
              <td>Greatest matching viewport threshold; negative/nonfinite input becomes zero</td>
            </tr>
            <tr>
              <td><code>resolveContentGrid(width: number)</code></td>
              <td>
                size, width, minWidth, columns, gap, headlineSize, headlineLineHeight, bodySize,
                bodyLineHeight, headlineGap, columnWidth; width clamps to 0–1536
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  resolveContentSpan(span: <a href={base + '/docs/reference/types/#content-span'}>
                    ContentSpan
                  </a>
                  | undefined, grid:
                  <a href={base + '/docs/reference/types/#content-grid-size'}>ContentGridSize</a>):
                  number
                </code>
              </td>
              <td>
                Mobile-first inheritance, full-row default, integer validation and column-count
                clamp
              </td>
            </tr>
            <tr>
              <td><code>contentSpanWidth(width: number, span: number): number</code></td>
              <td>
                Pixel width for a numeric span including internal gaps, excluding outer gutters
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  resolveCardLayout(containerWidth: number, cardSize: <a
                    href={base + '/docs/reference/types/#layout-card-size'}
                  >
                    LayoutCardSize
                  </a>
                  = 'm', options:
                  <a href={base + '/docs/reference/types/#card-layout-options'}>
                    CardLayoutOptions
                  </a> = &#123;&#125;)
                </code>
              </td>
              <td>
                Card token fields plus span, width, height, textHeight, eyebrowRows, mediaFrame and
                media: <a href={base + '/docs/reference/types/#layout-rect'}>LayoutRect</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        For resolveCardLayout, s/m/l request 2/2/4 columns, except l uses 3 on the s grid.
        <a href={base + '/docs/reference/types/#card-layout-options'}>CardLayoutOptions</a> accepts
        mediaAspect (3/2 default; also 4/3 or 1/1), mediaFit (contain default or cover), and
        reserveEyebrow (false default, ignored for S). Derive reserveEyebrow from the entire
        collection, as the Svelte collections do. Width comes from contentSpanWidth;
        mediaFrame.height is width divided by the selected ratio. Text height is
        <code>(rows + eyebrowRows) * lineHeight + 2 * cardTextInset.block</code>; total height is
        mediaFrame.height + textHeight. The media rectangle is inset by 8px for contain (clamped to
        available space), or fills mediaFrame for cover. These are default base card measurements,
        not measurements of arbitrary CSS overrides or additional card content. Observe the actual
        <a href={base + '/docs/reference/types/#card-elements'}>CardElements</a>.media rectangle
        when attaching a renderer.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sectionregistry-and-section-registry',
      title: 'SectionRegistry and SECTION_REGISTRY',
      headline: 'SectionRegistry and SECTION_REGISTRY',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>new SectionRegistry(changed?: () =&gt; void)</code> creates a navigation registry.
        <code>SECTION_REGISTRY</code> is its exported context-key symbol, not a singleton registry.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sections</code> getter</td>
              <td>
                Fresh <a href={base + '/docs/reference/types/#section-navigation-item'}>
                  SectionNavigationItem
                </a>[] with detached item copies, in registry order
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  register(section: <a href={base + '/docs/reference/types/#section-definition'}>
                    SectionDefinition
                  </a>)
                </code>
              </td>
              <td>
                Returns update(next: <a href={base + '/docs/reference/types/#section-definition'}>
                  SectionDefinition
                </a>) and unregister() lifecycle methods
              </td>
            </tr>
            <tr>
              <td><code>order(ids: readonly string[])</code></td>
              <td>
                Sorts by supplied IDs; unspecified registrations follow in their existing order
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Registration checks nonblank titles, IDs matching <code>^[a-z][a-z0-9-]*$</code>, and
        page-local uniqueness. Changes call the callback. Updating unchanged metadata emits nothing.
        Unregister is idempotent, and subsequent updates on that handle do nothing. The registry
        stores id/title only, not content. Create one per page/request; Svelte ContentPage handles
        this automatically.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'background-normalization',
      title: 'Background normalization',
      headline: 'Background normalization',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>
          normalizeSectionBackground(background: <a
            href={base + '/docs/reference/types/#section-background'}
          >
            SectionBackground
          </a>
          | undefined, context:
          <a href={base + '/docs/reference/types/#section-background-context'}>
            SectionBackgroundContext
          </a>
          = &#123;&#125;):
          <a href={base + '/docs/reference/types/#resolved-section-background'}>
            ResolvedSectionBackground
          </a>
        </code>
        returns effective background values. <code>context.pageKind?: 'content' | 'detail'</code>;
        detail forces standard size. Svelte Section inherits pageKind from SectionSurfaceGroup and
        forwards it to the normalizer. Its optional onDiagnostic callback receives deduplicated
        diagnostics.
      </p>
      <p>
        <code>
          <a href={base + '/docs/reference/types/#resolved-section-background'}>
            ResolvedSectionBackground
          </a>
        </code>
        has color:
        <a href={base + '/docs/reference/types/#section-background-color'}>
          SectionBackgroundColor
        </a>, size: standard/full, gradient: boolean, cssBackground: string and optional diagnostic:
        <a href={base + '/docs/reference/types/#section-background-diagnostic'}>
          SectionBackgroundDiagnostic
        </a>.
      </p>
      <p>
        <a href={base + '/docs/reference/types/#section-background-diagnostic'}>
          SectionBackgroundDiagnostic
        </a>
        fields: code (<code>gradient-requires-full-background</code>), message: string,
        requestedColor:
        <a href={base + '/docs/reference/types/#section-background-color'}>
          SectionBackgroundColor
        </a>, requestedSize: standard/full, pageKind: content/detail/undefined, effectiveColor:
        transparent/standard/muted. Gradients with an effective standard size resolve to their end
        color.
      </p>
      <p>
        <code>
          createSectionBackgroundNormalizer(report?: (diagnostic: <a
            href={base + '/docs/reference/types/#section-background-diagnostic'}
          >
            SectionBackgroundDiagnostic
          </a>) =&gt; void)
        </code>
        returns
        <code>
          (background, context) =&gt; <a
            href={base + '/docs/reference/types/#resolved-section-background'}
          >
            ResolvedSectionBackground
          </a>
        </code>. Unlike the direct function, the returned function's context argument is required
        (pass
        <code>&#123;&#125;</code>). It reports each requested-color/size/pageKind combination once
        per normalizer instance. No global state or automatic console logger is used.
      </p>
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sectionsurfaceregistry-and-section-surfaces',
      title: 'SectionSurfaceRegistry and SECTION_SURFACES',
      headline: 'SectionSurfaceRegistry and SECTION_SURFACES',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>new SectionSurfaceRegistry(changed?: () =&gt; void)</code> tracks presentation order.
        <code>SECTION_SURFACES</code> is the exported context-key symbol.
      </p>
      <ul>
        <li>
          <code>
            register(surface: Pick&lt;<a
              href={base + '/docs/reference/types/#resolved-section-background'}
            >
              ResolvedSectionBackground
            </a>, 'color' | 'size'&gt;)
          </code> returns a numeric id, update(next) and unregister(). IDs increase within that instance.
        </li>
        <li>
          <code>order(ids: readonly number[])</code> deduplicates known IDs and appends unspecified registrations.
        </li>
        <li>
          <code>corners</code> returns
          <code>&#123; id: number; top: boolean; bottom: boolean &#125;[]</code>. Standard
          nontransparent neighbors join regardless of color; transparent/full surfaces break the
          group.
        </li>
        <li>
          Updates after unregister do nothing. A changed callback runs when registration, surface
          values or order change.
        </li>
      </ul>
      <p>
        The input alias Surface is internal and is not a named package export. Use the structural
        Pick type above. See <a href={base + '/docs/design-system/backgrounds/'}>
          Section Backgrounds and Surface Groups
        </a>.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'theme-and-url-helpers',
      title: 'Theme and URL helpers',
      headline: 'Theme and URL helpers',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>
          themeStyle(theme: <a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a> = &#123;&#125;):
          string
        </code>
        maps recognized fields to semicolon-separated <code>--ps-*</code> declarations. Unknown keys
        or values containing
        <code>;</code>, <code>&#123;</code>, <code>&#125;</code>, <code>&lt;</code> or
        <code>&gt;</code> throw. This prevents additional declaration injection but does not validate
        arbitrary CSS grammar. Defaults to an empty string; palette defaults live in CSS.
      </p>
      <p>
        <code>safeHref(href: string | undefined): string | undefined</code> returns undefined for unsupported
        URI schemes; permits http, https, mailto, tel and strings without a scheme. It strips control/space
        characters for the scheme check but returns the original accepted string. It is not URL normalization,
        domain allowlisting or comprehensive untrusted-content validation.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'content-type-index',
      title: 'Content type index',
      headline: 'Content type index',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>Every public content type is covered here or on its linked component page:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Types</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#section-navigation-item'}>
                    SectionNavigationItem
                  </a>
                </code>
              </td>
              <td>
                <a href={base + '/docs/components/grids/'}>Section fields</a>; navigation item is
                Pick&lt;<a href={base + '/docs/reference/types/#section-definition'}>
                  SectionDefinition
                </a>, id/title&gt;
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#section-background'}>SectionBackground</a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#section-background-color'}>
                    SectionBackgroundColor
                  </a>
                </code>
              </td>
              <td><a href={base + '/docs/design-system/backgrounds/'}>Backgrounds</a></td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#section-background-context'}>
                    SectionBackgroundContext
                  </a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#section-background-diagnostic'}>
                    SectionBackgroundDiagnostic
                  </a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#resolved-section-background'}>
                    ResolvedSectionBackground
                  </a>
                </code>
              </td>
              <td>Background normalization above</td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#content-page-data'}>ContentPageData</a>
                </code>,
                <code><a href={base + '/docs/reference/types/#page-data'}>PageData</a></code>
              </td>
              <td>
                <a href={base + '/docs/page-layout/content-page/'}>Page props</a> and
                <a href={base + '/docs/advanced/data-and-custom-sections/'}>data models</a>
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#section-type-map'}>SectionTypeMap</a>
                </code>,
                <code><a href={base + '/docs/reference/types/#section-data'}>SectionData</a></code>,
                <code>
                  <a href={base + '/docs/reference/types/#grid-section-data'}>GridSectionData</a>
                </code>
              </td>
              <td>
                <a href={base + '/docs/advanced/data-and-custom-sections/'}>
                  Data models and extension
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#hero-section-data'}>HeroSectionData</a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#rich-text-section-data'}>
                    RichTextSectionData
                  </a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#image-section-data'}>ImageSectionData</a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#video-section-data'}>VideoSectionData</a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#card-grid-section-data'}>
                    CardGridSectionData
                  </a>
                </code>,
                <code>
                  <a href={base + '/docs/reference/types/#carousel-section-data'}>
                    CarouselSectionData
                  </a>
                </code>
              </td>
              <td>
                <a href={base + '/docs/advanced/data-and-custom-sections/'}>Built-in model table</a>
              </td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#card-item'}>CardItem</a></code>,
                <code><a href={base + '/docs/reference/types/#card-size'}>CardSize</a></code>,
                <code><a href={base + '/docs/reference/types/#image-data'}>ImageData</a></code>,
                <code><a href={base + '/docs/reference/types/#image-aspect'}>ImageAspect</a></code>
              </td>
              <td><a href={base + '/docs/components/card/'}>Card and Image</a></td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#video-data'}>VideoData</a></code>
              </td>
              <td><a href={base + '/sections/video/'}>VideoSection</a></td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a></code>,
                <code>
                  <a href={base + '/docs/reference/types/#button-group-item'}>ButtonGroupItem</a>
                </code>
              </td>
              <td><a href={base + '/docs/page-layout/header/'}>Header and Satellites</a></td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#breadcrumb'}>Breadcrumb</a></code>
              </td>
              <td><a href={base + '/docs/page-layout/breadcrumbs/'}>Breadcrumbs</a></td>
            </tr>
            <tr>
              <td>
                <code><a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a></code>
              </td>
              <td><a href={base + '/docs/foundations/themes/'}>Themes and Styling</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        There is no runtime JSON schema/validator export. Applications validate externally supplied
        content. See <a href={base + '/docs/reference/tokens/'}>CSS Variables and Layout Tokens</a> for
        all token values.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'structured-content-types-02',
      title: 'Structured content types (0.2)',
      headline: 'Structured content types (0.2)',
      variant: 'content'
    }}
  >
    <div class="prose">
      <ul>
        <li>
          <code><a href={base + '/docs/reference/types/#heading-level'}>HeadingLevel</a></code>: 1
          through 6; inherited by nested sections and cards.
        </li>
        <li>
          <code><a href={base + '/docs/reference/types/#page-kind'}>PageKind</a></code>: content or
          detail; controls background normalization and large detail-pane corners.
        </li>
        <li>
          <code>
            <a href={base + '/docs/reference/types/#card-media-aspect'}>CardMediaAspect</a>
          </code>: 3/2, 4/3 or 1/1; applies to the media frame only.
        </li>
        <li>
          <code><a href={base + '/docs/reference/types/#card-media-fit'}>CardMediaFit</a></code>:
          contain or cover; independent from the frame ratio.
        </li>
        <li>
          <code>
            <a href={base + '/docs/reference/types/#card-layout-options'}>CardLayoutOptions</a>
          </code>: mediaAspect, mediaFit and reserveEyebrow for base card measurements.
        </li>
        <li>
          <code><a href={base + '/docs/reference/types/#inline-text'}>InlineText</a></code>: string
          or <a href={base + '/docs/reference/types/#inline-run'}>InlineRun</a> array.
          <code><a href={base + '/docs/reference/types/#inline-run'}>InlineRun</a></code>:
          text/strong/emphasis/code with text, link with text/href, or break.
        </li>
        <li>
          <code><a href={base + '/docs/reference/types/#content-action'}>ContentAction</a></code>:
          label, href, optional variant (primary, secondary, text).
        </li>
        <li>
          <code>
            <a href={base + '/docs/reference/types/#rich-text-content-data'}>RichTextContentData</a>
          </code>: either body with optional format, or blocks; the two sources are mutually
          exclusive.
        </li>
        <li>
          <code><a href={base + '/docs/reference/types/#rich-text-block'}>RichTextBlock</a></code>:
          paragraph (text, optional variant default/lead/muted), address (name, lines), list (items,
          optional ordered), panel (optional title/tone/actions, blocks). Panels can nest.
        </li>
        <li>
          <code>
            <a href={base + '/docs/reference/types/#panel-section-data'}>PanelSectionData</a>
          </code>: shared
          <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>, type
          panel, required blocks, optional tone and actions.
        </li>
      </ul>
      <p>
        See <a href={base + '/sections/rich-text/'}>structured text</a>,
        <a href={base + '/sections/panel/'}>panels</a>
        and <a href={base + '/docs/design-system/responsive-layout/'}>shared layout reference</a>.
      </p>
      <p>
        <code><a href={base + '/docs/reference/types/#surface-tone'}>SurfaceTone</a></code> is the
        shared <code>standard | muted</code> surface selection for Card.tone, collection cardTone,
        <a href={base + '/docs/reference/types/#panel-section-data'}>PanelSectionData</a>.tone and
        structured panel blocks. The selection follows the active theme and does not change the
        surrounding
        <a href={base + '/docs/reference/types/#section-background'}>SectionBackground</a>.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'code-models',
      title: 'Code models',
      headline: 'Code models',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code><a href={base + '/docs/reference/types/#code-data'}>CodeData</a></code> contains
        source and presentation options.
        <code><a href={base + '/docs/reference/types/#code-section-data'}>CodeSectionData</a></code>
        adds section metadata and the <code>code</code> discriminator.
        <code><a href={base + '/docs/reference/types/#code-token'}>CodeToken</a></code>
        and
        <code><a href={base + '/docs/reference/types/#highlighted-code'}>HighlightedCode</a></code>
        describe optional derived syntax tokens. See the
        <a href={base + '/sections/code/'}>complete code reference</a> for fields, defaults and examples.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'site-navigation',
      title: 'Header and page frames',
      headline: 'Header and page frames'
    }}
  >
    <div class="prose">
      <p>
        <code>
          resolveNavigation(tree, location: <a
            href={base + '/docs/reference/types/#navigation-location'}
          >
            NavigationLocation
          </a>)
        </code>
        derives active items, the current root, sidebarItems and breadcrumbs from a tree of page links.
        <a href={base + '/docs/reference/types/#navigation-location'}>NavigationLocation</a>
        accepts pathname or currentId.
        <a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a> requires href; optional icon
        is an application-owned key.
      </p>
      <p>
        <code>resolveContentPageLayout(input)</code> extends
        <a href={base + '/docs/reference/types/#responsive-layout-input'}>ResponsiveLayoutInput</a> with
        leftSidebar, showContentMenu and contentMenuDetached booleans (default false). It returns the
        independent menu rectangle, content rectangle and optional sidebar rectangles. Safe-area and scrollbar
        insets are included.
      </p>
      <p>
        <code>
          resolveActiveContentSection(sections: <a
            href={base + '/docs/reference/types/#content-section-bounds'}
          >
            ContentSectionBounds
          </a>[], readingTop, readingBottom, scrollY, maxScrollY)
        </code>
        returns the active ID or undefined.
        <a href={base + '/docs/reference/types/#content-section-bounds'}>ContentSectionBounds</a> contains
        id, top and bottom. Coordinates are relative to the reading viewport; the function has no DOM
        dependency.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'heading-models',
      title: 'Heading models',
      headline: 'Heading models',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <p>
      <code><a href={base + '/docs/reference/types/#heading-size'}>HeadingSize</a></code> is m | l |
      xl, independent of <a href={base + '/docs/reference/types/#heading-level'}>HeadingLevel</a>.
      <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>.headingSize
      selects the visual size.
      <code>
        <a href={base + '/docs/reference/types/#heading-section-data'}>HeadingSectionData</a>
      </code>
      extends <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>
      with type: 'heading'. It is part of
      <a href={base + '/docs/reference/types/#section-type-map'}>SectionTypeMap</a>
      and renders through Sections. Place it or a
      <a href={base + '/docs/reference/types/#hero-section-data'}>HeroSectionData</a>
      record directly in <a href={base + '/docs/reference/types/#page-data'}>PageData</a>.sections
      and set headingLevel: 1 for the page title.
    </p>
  </Section>
  <Section
    section={{
      id: 'footer-models',
      title: 'Footer models',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      <code><a href={base + '/docs/reference/types/#footer-link'}>FooterLink</a></code> requires
      label and href.
      <code><a href={base + '/docs/reference/types/#footer-menu-group'}>FooterMenuGroup</a></code>
      requires label and a readonly links array, with an optional href for its heading. Footer accepts
      at most four groups.
      <code><a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a></code>
      includes footerBackground, footerInk, footerRadius, footerShadow, footerBarBackground and footerBarInk.
      See
      <a href={base + '/docs/page-layout/footer/'}>Footer</a>.
    </p>
  </Section>
</ContentPage>
