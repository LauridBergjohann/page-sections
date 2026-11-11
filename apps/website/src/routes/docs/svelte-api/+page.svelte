<script module lang="ts">
  // Executable examples are owned by this page and checked by check:docs.
  export const examples: { language: string; code: string; filename?: string; group?: string }[] =
    [];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Svelte API', pageTitle: 'Svelte API · Page Sections' }}
  showContentMenu
>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Import components from <code>@page-sections/svelte</code>. The public components are listed
        below. Component props are documented on the linked pages; this index shows where to start,
        without duplicating the full reference.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Export</th>
              <th>Purpose / required props</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>ContentPage</code></td>
              <td>Main content; page</td>
              <td><a href={base + '/docs/page-shell/'}>Pages</a></td>
            </tr>
            <tr>
              <td><code>PageShell</code></td>
              <td>Shared theme/mode; none</td>
              <td><a href={base + '/docs/page-shell/'}>Pages</a></td>
            </tr>
            <tr>
              <td><code>Section</code></td>
              <td>General content region; section</td>
              <td><a href={base + '/docs/content-grid/'}>Section and grids</a></td>
            </tr>
            <tr>
              <td><code>ContentGrid</code></td>
              <td>Responsive block grid; none</td>
              <td><a href={base + '/docs/content-grid/'}>Section and grids</a></td>
            </tr>
            <tr>
              <td><code>ContentBlock</code></td>
              <td>Explicit grid span; none</td>
              <td><a href={base + '/docs/content-grid/'}>Section and grids</a></td>
            </tr>
            <tr>
              <td><code>SectionSurfaceGroup</code></td>
              <td>Adjacent background corners; none</td>
              <td><a href={base + '/docs/backgrounds/'}>Surface groups</a></td>
            </tr>
            <tr>
              <td><code>HeroSection</code></td>
              <td>Prominent copy/image/actions; section</td>
              <td><a href={base + '/docs/hero/'}>HeroSection</a></td>
            </tr>
            <tr>
              <td><code>RichTextSection</code></td>
              <td>Markdown, plain text or blocks; section</td>
              <td><a href={base + '/docs/rich-text/'}>RichTextSection</a></td>
            </tr>
            <tr>
              <td><code>RichTextContent</code></td>
              <td>Text without a section wrapper; content</td>
              <td><a href={base + '/docs/rich-text/'}>RichTextSection</a></td>
            </tr>
            <tr>
              <td><code>InlineTextContent</code></td>
              <td>Escaped inline runs; text</td>
              <td><a href={base + '/docs/rich-text/'}>RichTextSection</a></td>
            </tr>
            <tr>
              <td><code>Actions</code></td>
              <td>Native action links; optional actions</td>
              <td><a href={base + '/docs/panels/'}>Panels</a></td>
            </tr>
            <tr>
              <td><code>ContentPanel</code></td>
              <td>Reusable inset panel; no required props</td>
              <td><a href={base + '/docs/panels/'}>Panels</a></td>
            </tr>
            <tr>
              <td><code>PanelSection</code></td>
              <td>Panel with section metadata; section</td>
              <td><a href={base + '/docs/panels/'}>Panels</a></td>
            </tr>
            <tr>
              <td><code>ImageSection</code></td>
              <td>Image with optional text; section</td>
              <td><a href={base + '/docs/images/'}>ImageSection</a></td>
            </tr>
            <tr>
              <td><code>VideoSection</code></td>
              <td>HTML5/YouTube with optional text; section</td>
              <td><a href={base + '/docs/video/'}>VideoSection</a></td>
            </tr>
            <tr>
              <td><code>CardGridSection</code></td>
              <td>Responsive card collection; section, list</td>
              <td><a href={base + '/docs/card-grid/'}>CardGridSection</a></td>
            </tr>
            <tr>
              <td><code>CarouselSection</code></td>
              <td>Horizontal card collection; section, list</td>
              <td><a href={base + '/docs/carousel/'}>CarouselSection</a></td>
            </tr>
            <tr>
              <td><code>Card</code></td>
              <td>Standalone article; item</td>
              <td><a href={base + '/docs/card-and-image/'}>Card and Image</a></td>
            </tr>
            <tr>
              <td><code>Image</code></td>
              <td>Shared picture/img renderer; image</td>
              <td><a href={base + '/docs/card-and-image/'}>Card and Image</a></td>
            </tr>
            <tr>
              <td><code>Navigation</code></td>
              <td>Independent menu and satellites; none</td>
              <td><a href={base + '/docs/navigation/'}>Navigation</a></td>
            </tr>
            <tr>
              <td><code>MainMenu</code></td>
              <td>Recursive native menu; items</td>
              <td><a href={base + '/docs/navigation/'}>Navigation</a></td>
            </tr>
            <tr>
              <td><code>ButtonGroup</code></td>
              <td>Labelled controls/links; items, label</td>
              <td><a href={base + '/docs/navigation/'}>Navigation</a></td>
            </tr>
            <tr>
              <td><code>Breadcrumbs</code></td>
              <td>Site ancestry; items</td>
              <td><a href={base + '/docs/breadcrumbs/'}>Breadcrumbs and index</a></td>
            </tr>
            <tr>
              <td><code>SectionNavigation</code></td>
              <td>Explicit anchor list; items</td>
              <td><a href={base + '/docs/breadcrumbs/'}>Breadcrumbs and index</a></td>
            </tr>
            <tr>
              <td><code>Sections</code></td>
              <td>Data-driven dispatcher; sections</td>
              <td><a href={base + '/docs/data-and-custom-sections/'}>Data models</a></td>
            </tr>
            <tr
              ><td><code>CodeBlock</code></td><td>Standalone source presentation; code</td><td
                ><a href={base + '/docs/code/'}>Code</a></td
              ></tr
            >
            <tr
              ><td><code>CodeSection</code></td><td>Source with section metadata; section</td><td
                ><a href={base + '/docs/code/'}>Code</a></td
              ></tr
            >
          </tbody>
        </table>
      </div>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'props-and-snippets',
      title: 'Props and snippets',
      headline: 'Props and snippets',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Svelte 5 snippets are used instead of named legacy slots. Navigation has
        menu/brand/left/right/tools/settingsIcon/menuIcon snippets. Card has
        media(item)/surface(item)/children(item); the collections have
        media(item)/itemContent(item). CardGridSection also has surface(item) and a complete
        card(item, configuration) replacement. Generic item subtypes are preserved. Section,
        ContentPage, PageShell, ContentGrid, ContentBlock, SectionSurfaceGroup, HeroSection,
        ImageSection and VideoSection accept ordinary children snippets.
      </p>
      <p>
        RichTextSection and Sections have no children prop. Section forwards ordinary HTMLElement
        attributes except id/children; ContentGrid and ContentBlock forward div attributes.
        ContentPage forwards main attributes (including id, lang and ARIA attributes), except style;
        use theme and class for styling. Card also forwards HTMLElement attributes, including class
        and event callbacks. Other components do not accept general class/style or arbitrary HTML
        attributes. Configure them through documented props, section metadata and CSS variables.
      </p>
      <p>
        Most predefined components accept <code>section: Omit&lt;TheirSectionData, 'type'&gt;</code
        >. CardGridSection and CarouselSection instead take shared SectionDefinition plus separate
        list/configuration props. <code>type</code> belongs to serialized sections rendered by Sections,
        not to a required declarative prop.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'types-and-styles',
      title: 'Types and styles',
      headline: 'Types and styles',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The root export includes <code>export type * from '@page-sections/core'</code> and the
        Svelte-specific <code>CardElements&lt;T&gt;</code> type (item, root, surface, media, copy, title).
        It does not re-export core runtime classes/functions/constants. Component prop interfaces are
        not separately named exports; use Svelte's ComponentProps where applicable or the shared data
        interfaces.
      </p>
      <p>
        Shared styles are exported through <code>@page-sections/svelte/styles.css</code>. The
        optional <code>@page-sections/svelte/highlight</code> entry exports
        <code>highlightCode</code>; install its Shiki peer to use it, preferably at build/server
        time. No internal component file, context symbol or generated CSS path is a supported deep
        import. See <a href={base + '/docs/installation/'}>Installation</a> for which components load
        shared CSS themselves.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'rendering-contract',
      title: 'Rendering contract',
      headline: 'Rendering contract',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        These are Svelte source components compiled by the consuming toolchain. SSR requires host
        support. Text, native links and responsive layouts do not require hydration; button
        callbacks and reactive updates do. There are no routing, fetching, CMS, image-processing or
        automatic SSR configuration APIs.
      </p>
      <p>
        Related: <a href={base + '/docs/core-api/'}>Core API</a>,
        <a href={base + '/docs/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sidebar-navigation',
      title: 'SidebarNavigation',
      headline: 'SidebarNavigation'
    }}
    ><div class="prose">
      <p>
        <code>SidebarNavigation</code> renders a recursive site tree with current-page markers and expandable
        ancestors. Pass it as ContentPage's leftSidebar snippet. ContentPage's showContentMenu flag supplies
        the separate automatic right menu; footer provides a slot for reading-order links. Navigation's
        itemIcon snippet supplies application-owned icons.
      </p>
    </div></Section
  >
</ContentPage>
