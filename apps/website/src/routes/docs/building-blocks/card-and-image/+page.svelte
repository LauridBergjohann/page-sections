<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { Card, Image, type CardItem } from '@page-sections/svelte';
  import '@page-sections/svelte/styles.css';
  const item: CardItem = {
    id: 'guide',
    title: 'A first garden',
    href: '/guide',
    description: 'Start small.'
  };
<\/script>

<div class="ps-shell">
  <Card {item} variant="editorial" mediaAspect="4/3">
    {#snippet media(card)}
      <Image
        image={{
          src: '/images/garden.jpg',
          alt: \`Cover for \${card.title}\`,
          aspect: '4/3',
          width: 1200,
          height: 900
        }}
      />
    {/snippet}
    {#snippet children(card)}<small>From the garden library: {card.title}</small
      >{/snippet}
  </Card>
</div>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Card and Image', pageTitle: 'Card and Image · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Card and Image',
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
    ><div class="prose">
      <p>
        These low-level building blocks are useful when composing a custom section. Card supplies
        the same article used by the two collection components; Image supplies shared responsive and
        theme-aware image rendering.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Card accepts <code>tone=&quot;standard&quot;</code> (default) or
        <code>&quot;muted&quot;</code>. CardGridSection and CarouselSection forward their
        <code>cardTone</code> option to this prop. The selected surface follows the theme; custom surface
        snippets retain control over their own paint.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'card-props',
      title: 'Card props',
      headline: 'Card props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Generic <code>T extends CardItem</code>; required item. Optional cardSize (m), variant
        (catalog), mediaAspect (3/2; also 4/3 or 1/1), mediaFit (contain for catalog, cover for
        editorial), reserveEyebrow (otherwise follows the item), textAlign (start/center),
        headingLevel (inherited, standalone h2), media(item), surface(item), children(item) and
        onready(parts). Children are editorial-only. Card forwards HTMLElement attributes, including
        class and event callbacks; card identity/accessibility attributes remain component-owned.
      </p>
      <h3 id="complete-carditem-model">Complete CardItem model</h3>
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
              <td>Content identity</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code>, required</td>
              <td>Inherited heading; full-card link for catalog, title link for editorial</td>
            </tr>
            <tr>
              <td><code>itemKey</code></td>
              <td><code>string</code></td>
              <td>Optional occurrence key; collection keys use itemKey then id</td>
            </tr>
            <tr>
              <td><code>href</code></td>
              <td><code>string</code></td>
              <td>Optional native link, passed through safeHref</td>
            </tr>
            <tr>
              <td><code>eyebrow</code></td>
              <td><code>string</code></td>
              <td>Optional text before title</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td>Optional description paragraph</td>
            </tr>
            <tr>
              <td><code>subtitle</code></td>
              <td><code>string</code></td>
              <td>Fallback when description is nullish; an empty description suppresses it</td>
            </tr>
            <tr>
              <td><code>image</code></td>
              <td><code>ImageData</code></td>
              <td>Optional default media</td>
            </tr>
            <tr>
              <td><code>footer</code></td>
              <td><code>InlineText</code></td>
              <td>Editorial footer</td>
            </tr>
            <tr>
              <td><code>actions</code></td>
              <td><code>ContentAction[]</code></td>
              <td>Independent editorial actions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Catalog height is the selected media frame plus an independent text area. S/M reserve two
        title lines; L reserves three. Eyebrows add a separate line (hidden for S); reserveEyebrow
        keeps an empty line when aligning cards with missing labels. Collections compute this flag
        from the full list. Text padding is 12px on each side. Catalog does not render descriptions,
        children, footers or actions; use editorial for those. Editorial grows with content and
        fills its grid slot.
      </p>
      <p>
        CardMediaAspect is 3/2, 4/3 or 1/1. CardMediaFit is contain (8px media inset, whole image)
        or cover (no inset, cropped image). The frame ratio and image fit are independent. Card
        media props override ImageData.aspect/objectFit inside the slot; standalone Image behavior
        is unchanged. Missing catalog media keeps its frame; editorial cards without media omit it.
      </p>
      <p>
        <code>onready?: (parts: CardElements&lt;T&gt;) =&gt; void | (() =&gt; void)</code> supplies
        item, root, surface, media, copy and title elements after mount. Its returned cleanup runs
        when the item/callback changes or the card unmounts. Keyed moves and media-format changes
        preserve the same occurrence. The media element is the inner fitting rectangle; media-frame
        is the outer aspect-ratio box. Observe element resizing when fitting external geometry:
        onready is an attachment hook, not a resize notification. <code>data-card-id</code> contains itemKey
        ?? id; data-ps-card-part names each measured part. Custom catalog snippets must not introduce
        interactive descendants inside a linked card. These hooks support external enhancements without
        a rendering-engine dependency.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'image-props-and-complete-imagedata-model',
      title: 'Image props and complete ImageData model',
      headline: 'Image props and complete ImageData model',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Required <code>image: ImageData</code>; optional <code>eager: boolean</code> defaults to false.
        No children or attribute-forwarding props.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>ImageData field</th>
              <th>Type</th>
              <th>Default / behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>src</code></td>
              <td><code>string</code>, required</td>
              <td>Fallback image URL</td>
            </tr>
            <tr>
              <td><code>alt</code></td>
              <td><code>string</code>, required</td>
              <td>Alternative text; empty for decorative images</td>
            </tr>
            <tr>
              <td><code>srcDark</code></td>
              <td><code>string</code></td>
              <td>Optional dark source in picture</td>
            </tr>
            <tr>
              <td><code>width</code>, <code>height</code></td>
              <td><code>number</code></td>
              <td>Optional intrinsic dimensions forwarded to img</td>
            </tr>
            <tr>
              <td><code>aspect</code></td>
              <td><code>ImageAspect</code></td>
              <td>Unset/none: no forced ratio; 4/3, 16/9, 2/1 or square</td>
            </tr>
            <tr>
              <td><code>objectFit</code></td>
              <td><code>'cover'</code> or <code>'contain'</code></td>
              <td>cover</td>
            </tr>
            <tr>
              <td><code>srcset</code>, <code>sizes</code></td>
              <td><code>string</code></td>
              <td>Optional responsive attributes on the fallback img</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        ImageAspect is <code>'none'</code>, <code>'4/3'</code>, <code>'16/9'</code>,
        <code>'2/1'</code>, <code>'square'</code>. The picture fills its available width; img height
        is auto, uses the selected ratio and <code>--ps-radius</code>. Loading is lazy unless eager;
        decoding is async. HeroSection uses eager mode, while cards and ImageSection use the
        default.
      </p>
      <p>
        An ancestor PageShell's explicit mode determines whether srcDark is selected. Without one,
        the source uses <code>prefers-color-scheme: dark</code>. A <code>data-ps-theme</code> attribute
        alone changes CSS but does not provide PageShell's Svelte image-mode context. Explicit light mode
        suppresses the dark source.
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
        Use meaningful alt text, avoid repeating a decorative card cover in speech, and supply
        width/height to reduce shifts. Native picture selection and loading work in server-rendered
        HTML. The library does not resize, upload or generate responsive assets.
      </p>
      <p>
        Related: <a href={base + '/docs/sections/images/'}>ImageSection</a>,
        <a href={base + '/docs/sections/card-grid/'}>CardGridSection</a>,
        <a href={base + '/docs/foundations/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
</ContentPage>
