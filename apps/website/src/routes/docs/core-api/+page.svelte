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
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Core API', pageTitle: 'Core API · Page Sections' }} showContentMenu>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        All runtime functions, constants, classes and types below are exported from <code
          >@page-sections/core</code
        >. The package has no runtime dependencies, DOM requirement or rendering implementation.
        Svelte re-exports its types only.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'layout-constants-and-types',
      title: 'Layout constants and types',
      headline: 'Layout constants and types',
      variant: 'content'
    }}
    ><div class="prose">
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
              <td><code>ContentGridSize</code></td>
              <td>Union of contentGridSizes values</td>
            </tr>
            <tr>
              <td><code>ViewportLayoutSize</code></td>
              <td>Union of viewportLayoutSizes values</td>
            </tr>
            <tr>
              <td><code>ContentSpan</code></td>
              <td>number or Partial&lt;Record&lt;ContentGridSize, number&gt;&gt;</td>
            </tr>
            <tr>
              <td><code>LayoutCardSize</code></td>
              <td>keyof layoutTokens.cards: s, m, l</td>
            </tr>
            <tr>
              <td><code>LayoutRect</code></td>
              <td>x, y, width, height: number</td>
            </tr>
            <tr>
              <td><code>LayoutInsets</code></td>
              <td>top, right, bottom, left: number</td>
            </tr>
            <tr>
              <td><code>ResponsiveLayoutInput</code></td>
              <td
                >Required width/height: number; optional scrollbarWidth: number, safeArea:
                Partial&lt;LayoutInsets&gt;</td
              >
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <code>resolvePageLayout(input: ResponsiveLayoutInput)</code> returns
        <code
          >&#123; layout, content: &#123; x, width &#125;, menu: &#123; x, y, width, height &#125;
          &#125;</code
        >. It accounts for a reserved scrollbar and safe-area insets while classifying the original
        viewport width. The host owns those measurements; native Navigation assumes a full-width
        containing block.
      </p>
      <p>
        <code>resolveMenuOffset(scrollY: number, fixed = false)</code> returns zero until 112px,
        then <code>112 - scrollY</code>; fixed mode always returns zero.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'layout-functions',
      title: 'Layout functions',
      headline: 'Layout functions',
      variant: 'content'
    }}
    ><div class="prose">
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
              <td><code>resolveViewportLayout(width: number): ViewportLayoutSize</code></td>
              <td>Greatest matching viewport threshold; negative/nonfinite input becomes zero</td>
            </tr>
            <tr>
              <td><code>resolveContentGrid(width: number)</code></td>
              <td
                >size, width, minWidth, columns, gap, headlineSize, headlineLineHeight, bodySize,
                bodyLineHeight, headlineGap, columnWidth; width clamps to 0–1536</td
              >
            </tr>
            <tr>
              <td
                ><code
                  >resolveContentSpan(span: ContentSpan | undefined, grid: ContentGridSize): number</code
                ></td
              >
              <td
                >Mobile-first inheritance, full-row default, integer validation and column-count
                clamp</td
              >
            </tr>
            <tr>
              <td><code>contentSpanWidth(width: number, span: number): number</code></td>
              <td
                >Pixel width for a numeric span including internal gaps, excluding outer gutters</td
              >
            </tr>
            <tr>
              <td
                ><code
                  >resolveCardLayout(containerWidth: number, cardSize: LayoutCardSize = 'm',
                  options: CardLayoutOptions = &#123;&#125;)</code
                ></td
              >
              <td
                >Card token fields plus span, width, height, textHeight, eyebrowRows, mediaFrame and
                media: LayoutRect</td
              >
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        For resolveCardLayout, s/m/l request 2/2/4 columns, except l uses 3 on the s grid.
        CardLayoutOptions accepts mediaAspect (3/2 default; also 4/3 or 1/1), mediaFit (contain
        default or cover), and reserveEyebrow (false default, ignored for S). Derive reserveEyebrow
        from the entire collection, as the Svelte collections do. Width comes from contentSpanWidth;
        mediaFrame.height is width divided by the selected ratio. Text height is <code
          >(rows + eyebrowRows) * lineHeight + 2 * cardTextInset.block</code
        >; total height is mediaFrame.height + textHeight. The media rectangle is inset by 8px for
        contain (clamped to available space), or fills mediaFrame for cover. These are default
        catalog measurements, not measurements of arbitrary CSS overrides or editorial copy. Observe
        the actual CardElements.media rectangle when attaching a renderer.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'sectionregistry-and-section-registry',
      title: 'SectionRegistry and SECTION_REGISTRY',
      headline: 'SectionRegistry and SECTION_REGISTRY',
      variant: 'content'
    }}
    ><div class="prose">
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
              <td>Fresh SectionNavigationItem[] with detached item copies, in registry order</td>
            </tr>
            <tr>
              <td><code>register(section: SectionDefinition)</code></td>
              <td>Returns update(next: SectionDefinition) and unregister() lifecycle methods</td>
            </tr>
            <tr>
              <td><code>order(ids: readonly string[])</code></td>
              <td
                >Sorts by supplied IDs; unspecified registrations follow in their existing order</td
              >
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
    </div></Section
  >
  <Section
    section={{
      id: 'background-normalization',
      title: 'Background normalization',
      headline: 'Background normalization',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code
          >normalizeSectionBackground(background: SectionBackground | undefined, context:
          SectionBackgroundContext = &#123;&#125;): ResolvedSectionBackground</code
        >
        returns effective background values. <code>context.pageKind?: 'content' | 'detail'</code>;
        detail forces standard size. Svelte Section inherits pageKind from SectionSurfaceGroup and
        forwards it to the normalizer. Its optional onDiagnostic callback receives deduplicated
        diagnostics.
      </p>
      <p>
        <code>ResolvedSectionBackground</code> has color: SectionBackgroundColor, size: standard/full,
        gradient: boolean, cssBackground: string and optional diagnostic: SectionBackgroundDiagnostic.
      </p>
      <p>
        SectionBackgroundDiagnostic fields: code (<code>gradient-requires-full-background</code>),
        message: string, requestedColor: SectionBackgroundColor, requestedSize: standard/full,
        pageKind: content/detail/undefined, effectiveColor: transparent/standard/muted. Gradients
        with an effective standard size resolve to their end color.
      </p>
      <p>
        <code
          >createSectionBackgroundNormalizer(report?: (diagnostic: SectionBackgroundDiagnostic)
          =&gt; void)</code
        >
        returns <code>(background, context) =&gt; ResolvedSectionBackground</code>. Unlike the
        direct function, the returned function's context argument is required (pass
        <code>&#123;&#125;</code>). It reports each requested-color/size/pageKind combination once
        per normalizer instance. No global state or automatic console logger is used.
      </p>
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
    </div></Section
  >
  <Section
    section={{
      id: 'sectionsurfaceregistry-and-section-surfaces',
      title: 'SectionSurfaceRegistry and SECTION_SURFACES',
      headline: 'SectionSurfaceRegistry and SECTION_SURFACES',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>new SectionSurfaceRegistry(changed?: () =&gt; void)</code> tracks presentation order.
        <code>SECTION_SURFACES</code> is the exported context-key symbol.
      </p>
      <ul>
        <li>
          <code>register(surface: Pick&lt;ResolvedSectionBackground, 'color' | 'size'&gt;)</code> returns
          a numeric id, update(next) and unregister(). IDs increase within that instance.
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
        Pick type above. See <a href={base + '/docs/backgrounds/'}
          >Section Backgrounds and Surface Groups</a
        >.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'theme-and-url-helpers',
      title: 'Theme and URL helpers',
      headline: 'Theme and URL helpers',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>themeStyle(theme: PageTheme = &#123;&#125;): string</code> maps recognized fields to
        semicolon-separated <code>--ps-*</code> declarations. Unknown keys or values containing
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
    </div></Section
  >
  <Section
    section={{
      id: 'content-type-index',
      title: 'Content type index',
      headline: 'Content type index',
      variant: 'content'
    }}
    ><div class="prose">
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
              <td><code>SectionDefinition</code>, <code>SectionNavigationItem</code></td>
              <td
                ><a href={base + '/docs/content-grid/'}>Section fields</a>; navigation item is
                Pick&lt;SectionDefinition, id/title&gt;</td
              >
            </tr>
            <tr>
              <td><code>SectionBackground</code>, <code>SectionBackgroundColor</code></td>
              <td><a href={base + '/docs/backgrounds/'}>Backgrounds</a></td>
            </tr>
            <tr>
              <td
                ><code>SectionBackgroundContext</code>, <code>SectionBackgroundDiagnostic</code>,
                <code>ResolvedSectionBackground</code></td
              >
              <td>Background normalization above</td>
            </tr>
            <tr>
              <td><code>ContentPageData</code>, <code>PageData</code></td>
              <td
                ><a href={base + '/docs/page-shell/'}>Page props</a> and
                <a href={base + '/docs/data-and-custom-sections/'}>data models</a></td
              >
            </tr>
            <tr>
              <td
                ><code>SectionTypeMap</code>, <code>SectionData</code>,
                <code>GridSectionData</code></td
              >
              <td
                ><a href={base + '/docs/data-and-custom-sections/'}>Data models and extension</a
                ></td
              >
            </tr>
            <tr>
              <td
                ><code>HeroSectionData</code>, <code>RichTextSectionData</code>,
                <code>ImageSectionData</code>, <code>VideoSectionData</code>,
                <code>CardGridSectionData</code>, <code>CarouselSectionData</code></td
              >
              <td><a href={base + '/docs/data-and-custom-sections/'}>Built-in model table</a></td>
            </tr>
            <tr>
              <td
                ><code>CardItem</code>, <code>CardSize</code>, <code>ImageData</code>,
                <code>ImageAspect</code></td
              >
              <td><a href={base + '/docs/card-and-image/'}>Card and Image</a></td>
            </tr>
            <tr>
              <td><code>VideoData</code></td>
              <td><a href={base + '/docs/video/'}>VideoSection</a></td>
            </tr>
            <tr>
              <td><code>MenuItem</code>, <code>ButtonGroupItem</code></td>
              <td><a href={base + '/docs/navigation/'}>Navigation and Satellites</a></td>
            </tr>
            <tr>
              <td><code>Breadcrumb</code></td>
              <td><a href={base + '/docs/breadcrumbs/'}>Breadcrumbs</a></td>
            </tr>
            <tr>
              <td><code>PageTheme</code></td>
              <td><a href={base + '/docs/themes/'}>Themes and Styling</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        There is no runtime JSON schema/validator export. Applications validate externally supplied
        content. See <a href={base + '/docs/tokens/'}>CSS Variables and Layout Tokens</a> for all token
        values.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'structured-content-types-02',
      title: 'Structured content types (0.2)',
      headline: 'Structured content types (0.2)',
      variant: 'content'
    }}
    ><div class="prose">
      <ul>
        <li><code>HeadingLevel</code>: 1 through 6; inherited by nested sections and cards.</li>
        <li>
          <code>PageKind</code>: content or detail; controls background normalization and large
          detail-pane corners.
        </li>
        <li><code>CardVariant</code>: catalog or editorial.</li>
        <li><code>CardMediaAspect</code>: 3/2, 4/3 or 1/1; applies to the media frame only.</li>
        <li><code>CardMediaFit</code>: contain or cover; independent from the frame ratio.</li>
        <li>
          <code>CardLayoutOptions</code>: mediaAspect, mediaFit and reserveEyebrow for catalog
          measurements.
        </li>
        <li>
          <code>InlineText</code>: string or InlineRun array. <code>InlineRun</code>:
          text/strong/emphasis/code with text, link with text/href, or break.
        </li>
        <li>
          <code>ContentAction</code>: label, href, optional variant (primary, secondary, text).
        </li>
        <li>
          <code>RichTextContentData</code>: either body with optional format, or blocks; the two
          sources are mutually exclusive.
        </li>
        <li>
          <code>RichTextBlock</code>: paragraph (text, optional variant default/lead/muted), address
          (name, lines), list (items, optional ordered), panel (optional title/tone/actions,
          blocks). Panels can nest.
        </li>
        <li>
          <code>PanelSectionData</code>: shared SectionDefinition, type panel, required blocks,
          optional tone and actions.
        </li>
      </ul>
      <p>
        See <a href={base + '/docs/rich-text/'}>structured text</a>,
        <a href={base + '/docs/panels/'}>panels</a>
        and <a href={base + '/docs/responsive-layout/'}>shared layout reference</a>.
      </p>
      <p>
        <code>SurfaceTone</code> is the shared <code>standard | muted</code> surface selection for Card.tone,
        collection cardTone, PanelSectionData.tone and structured panel blocks. The selection follows
        the active theme and does not change the surrounding SectionBackground.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'code-models',
      title: 'Code models',
      headline: 'Code models',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>CodeData</code> contains source and presentation options. <code>CodeSectionData</code>
        adds section metadata and the <code>code</code> discriminator. <code>CodeToken</code> and
        <code>HighlightedCode</code>
        describe optional derived syntax tokens. See the
        <a href={base + '/docs/code/'}>complete code reference</a> for fields, defaults and examples.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'site-navigation',
      title: 'Navigation and page frames',
      headline: 'Navigation and page frames'
    }}
    ><div class="prose">
      <p>
        <code>resolveNavigation(tree, location: NavigationLocation)</code> derives active items, the current
        root, sidebarItems and breadcrumbs from a tree of page links. NavigationLocation accepts pathname
        or currentId. MenuItem requires href; optional icon is an application-owned key.
      </p>
      <p>
        <code>resolveContentPageLayout(input)</code> extends ResponsiveLayoutInput with leftSidebar and
        showContentMenu booleans. It returns the independent menu rectangle, content rectangle and optional
        sidebar rectangles. Safe-area and scrollbar insets are included.
      </p>
      <p>
        <code
          >resolveActiveContentSection(sections: ContentSectionBounds[], readingTop, readingBottom,
          scrollY, maxScrollY)</code
        > returns the active ID or undefined. ContentSectionBounds contains id, top and bottom. Coordinates
        are relative to the reading viewport; the function has no DOM dependency.
      </p>
    </div></Section
  >
</ContentPage>
