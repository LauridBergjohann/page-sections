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
  <Card {item} mediaAspect="4/3">
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
  import ComponentPlayground from '#lib/ComponentPlayground.svelte';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Card', pageTitle: 'Card · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Card',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'playground',
      title: 'Try it yourself',
      headline: 'Try it yourself',
      background: { color: 'standard' }
    }}
  >
    <ComponentPlayground kind="card" />
  </Section>
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'card-props',
      title: 'Card props',
      headline: 'Card props',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Generic <code>
          T extends <a href={base + '/docs/reference/types/#card-item'}>CardItem</a>
        </code>; required item. Optional cardSize (m), shadow (false), mediaAspect (3/2; also 4/3 or
        1/1), mediaFit (contain), reserveEyebrow (otherwise follows the item), textAlign
        (start/center), headingLevel (inherited, standalone h2), media(item), surface(item),
        children(item) and onready(parts). Card forwards HTMLElement attributes, including class and
        event callbacks; card identity/accessibility attributes remain component-owned.
      </p>
      <h3 id="complete-carditem-model">
        Complete <a href={base + '/docs/reference/types/#card-item'}>CardItem</a> model
      </h3>
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
              <td>
                Inherited heading; its native link covers the entire card when href is supplied
              </td>
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
              <td>
                <code><a href={base + '/docs/reference/types/#image-data'}>ImageData</a></code>
              </td>
              <td>Optional default media</td>
            </tr>
            <tr>
              <td><code>footer</code></td>
              <td>
                <code><a href={base + '/docs/reference/types/#inline-text'}>InlineText</a></code>
              </td>
              <td>Optional footer</td>
            </tr>
            <tr>
              <td><code>actions</code></td>
              <td>
                <code>
                  <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a>[]
                </code>
              </td>
              <td>Independent action links</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Card height includes the selected media frame and a text area. Titles use up to two lines in
        S/M and three in L. Cards without descriptions reserve that title space; with a description,
        the title uses only the lines it needs. Eyebrows add a separate accent-colored line (hidden
        for S); reserveEyebrow keeps an empty line when aligning cards with missing labels.
        Collections compute this flag from the full list. Text padding is 12px on each side. A
        supplied description appears below the title with a compact half-em gap. Its font scales
        with card size and never exceeds the title size. Descriptions grow naturally, as do
        children, footers and actions. The card fills its grid slot.
      </p>
      <p>
        <a href={base + '/docs/reference/types/#card-media-aspect'}>CardMediaAspect</a> is 3/2, 4/3
        or 1/1. <a href={base + '/docs/reference/types/#card-media-fit'}>CardMediaFit</a> is contain
        (8px media inset, whole image) or cover (no inset, cropped image). The frame ratio and image
        fit are independent. Card media props override
        <a href={base + '/docs/reference/types/#image-data'}>ImageData</a>.aspect/objectFit inside
        the slot; standalone Image behavior is unchanged. Cards without media omit the image frame.
      </p>
      <p>
        <code>
          onready?: (parts: <a href={base + '/docs/reference/types/#card-elements'}>
            CardElements
          </a>&lt;T&gt;) =&gt; void | (() =&gt; void)
        </code>
        supplies item, root, surface, media, copy and title elements after mount. Its returned cleanup
        runs when the item/callback changes or the card unmounts. Keyed moves and media-format changes
        preserve the same occurrence. The media element is the inner fitting rectangle; media-frame is
        the outer aspect-ratio box. Observe element resizing when fitting external geometry: onready is
        an attachment hook, not a resize notification.
        <code>data-card-id</code> contains itemKey ?? id; data-ps-card-part names each measured part.
        The title link stretches over the card, including the image. Actions, footer links and interactive
        children remain separate native controls; no anchors are nested. These hooks support external
        enhancements without a rendering-engine dependency.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'accessibility-and-ssr',
      title: 'Accessibility and SSR',
      headline: 'Accessibility and SSR',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Enable <code>shadow</code> for a subtle resting shadow. Hover animates the border to the accent
        color and strengthens the shadow; cards without a resting shadow gain a light one. Leaving restores
        the original appearance. Keyboard focus is highlighted too, and reduced-motion preferences disable
        the transition.
      </p>
      <p>
        Use meaningful alt text, avoid repeating a decorative card cover in speech, and supply
        width/height to reduce shifts. Native picture selection and loading work in server-rendered
        HTML. The library does not resize, upload or generate responsive assets.
      </p>
      <p>
        Related: <a href={base + '/sections/image/'}>ImageSection</a>,
        <a href={base + '/sections/card-grid/'}>CardGridSection</a>,
        <a href={base + '/docs/foundations/themes/'}>Themes and Styling</a>.
      </p>
    </div>
  </Section>
</ContentPage>
