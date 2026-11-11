<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { CardGridSection, type CardItem } from '@page-sections/svelte';
  const list: CardItem[] = [
    {
      id: 'project',
      title: 'A first project',
      description: 'Room for a complete description.',
      footer: 'Design and development',
      actions: [{ label: 'Explore', href: '/projects/first', variant: 'primary' }]
    }
  ];
<\/script>

<CardGridSection
  section={{ id: 'projects', title: 'Projects', headline: 'Selected work' }}
  {list}
  cardVariant="editorial"
  itemSpan={{ xs: 4, s: 3, m: 4, l: 4 }}
/>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import CollectionPlayground from '$lib/CollectionPlayground.svelte';
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Card grid', pageTitle: 'Card grid · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Card grid',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'playground',
      title: 'Try it',
      headline: 'Try it yourself',
      variant: 'content'
    }}><CollectionPlayground /></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>﻿# CardGridSection</p>
      <p>
        Use a catalog for compact collections and editorial cards for longer website content. Both
        use the same container-based ContentGrid.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'props',
      title: 'Props',
      headline: 'Props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>Generic over <code>T extends CardItem</code>.</p>
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
              <td><code>section</code></td>
              <td><code>SectionDefinition</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>list</code></td>
              <td><code>T[]</code></td>
              <td>Required; unique itemKey ?? id per occurrence</td>
            </tr>
            <tr>
              <td><code>cardSize</code></td>
              <td>s/m/l</td>
              <td>m; uniform catalog size</td>
            </tr>
            <tr>
              <td><code>cardVariant</code></td>
              <td>catalog/editorial</td>
              <td>catalog</td>
            </tr>
            <tr>
              <td><code>cardTone</code></td>
              <td><code>SurfaceTone</code>: standard/muted</td>
              <td>standard</td>
            </tr>
            <tr>
              <td><code>mediaAspect</code></td>
              <td><code>CardMediaAspect</code>: 3/2, 4/3, 1/1</td>
              <td>3/2; uniform media frame</td>
            </tr>
            <tr>
              <td><code>mediaFit</code></td>
              <td><code>CardMediaFit</code>: contain/cover</td>
              <td>contain for catalog, cover for editorial</td>
            </tr>
            <tr>
              <td><code>itemSpan</code></td>
              <td><code>ContentSpan</code></td>
              <td>xs=4, s=3, m=4, l=4; editorial only</td>
            </tr>
            <tr>
              <td><code>textAlign</code></td>
              <td>start/center</td>
              <td>start</td>
            </tr>
            <tr>
              <td><code>media</code>, <code>surface</code></td>
              <td><code>Snippet&lt;[T]&gt;</code></td>
              <td>Optional replacements for card parts</td>
            </tr>
            <tr>
              <td><code>itemContent</code></td>
              <td><code>Snippet&lt;[T]&gt;</code></td>
              <td>Extra editorial copy</td>
            </tr>
            <tr>
              <td><code>card</code></td>
              <td
                ><code
                  >Snippet&lt;[T, &#123; cardSize: CardSize; variant: CardVariant; tone:
                  SurfaceTone; textAlign: 'start' | 'center'; mediaAspect: CardMediaAspect;
                  mediaFit: CardMediaFit; reserveEyebrow: boolean &#125;]&gt;</code
                ></td
              >
              <td>Optional complete card replacement</td>
            </tr>
            <tr>
              <td><code>oncardready</code></td>
              <td><code>(parts: CardElements&lt;T&gt;) =&gt; void | (() =&gt; void)</code></td>
              <td>Attachment/cleanup hook for default Card</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A complete card replacement owns its markup, accessibility and enhancement lifecycle.
        Media/surface snippets retain the default Card and its measured elements.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'layout-and-styling',
      title: 'Layout and styling',
      headline: 'Layout and styling',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Set <code>cardTone=&quot;muted&quot;</code> to distinguish cards from a standard section
        background. JSON sections use <code>cardTone: &quot;muted&quot;</code>. This chooses the
        theme surface without changing the section background, media layout or equal heights.
        Forward <code>options.tone</code> when providing a complete custom card snippet.
      </p>
      <p>
        Catalog S/M/L spans 2/2/4 columns; L spans 3 on the S grid. Only the media frame has a fixed
        ratio, selected with mediaAspect. The text area is added below it: two title lines for S/M,
        three for L, plus 12px padding on each side. S hides eyebrows. If any M/L item has an
        eyebrow, all cards reserve a separate label line, including blank items. Labels never
        consume title lines. S uses 12px titles, M 14px and L 18px. Titles clamp visually while
        their full text remains in the link's accessible name and title attribute.
      </p>
      <p>
        All grid rows share the tallest required card height, including rows with short titles or
        missing labels. Editorial cards retain natural copy, independent title/action links and
        bottom-aligned footers/actions. Descriptions, children and footers are editorial-only. A
        complete card replacement must fill its slot and use the supplied layout context to retain
        alignment.
      </p>
      <p>
        Use mediaFit=&quot;contain&quot; for complete objects with an 8px media inset, or
        mediaFit=&quot;cover&quot; for edge-to-edge cropped photos. Both use the same selected
        mediaAspect. ImageData.aspect/objectFit do not override this collection-level contract.
        Compare 3:2 and 1:1 in the interactive example above.
      </p>
      <p>
        Per-item size and the old auto-fit minimum widths were removed in 0.2. See <a
          href={base + '/docs/foundations/responsive-layout/'}>shared layout reference</a
        >.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'accessibility-and-ssr',
      title: 'Accessibility and SSR',
      headline: 'Accessibility and SSR',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        A catalog card with href is one native link. Do not put links/buttons into its media/surface
        snippets. Editorial cards use article markup, with separate title and action links. Heading
        levels inherit from the surrounding section. All content and links render on the server;
        attachment callbacks run after hydration.
      </p>
      <p>
        Related: <a href={base + '/docs/building-blocks/card-and-image/'}>Card and Image</a>,
        <a href={base + '/docs/sections/carousel/'}>CarouselSection</a>,
        <a href={base + '/docs/foundations/content-grid/'}>Section and grids</a>.
      </p>
    </div></Section
  >
</ContentPage>
