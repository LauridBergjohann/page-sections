<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { CarouselSection, type CardItem } from '@page-sections/svelte';
  const list: CardItem[] = [
    { id: 'one', title: 'First', href: '/one' },
    { id: 'two', title: 'Second', href: '/two' }
  ];
<\/script>

<CarouselSection
  section={{ id: 'browse', title: 'Browse', headline: 'Explore the collection' }}
  {list}
  cardSize="m"
/>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import CollectionPlayground from '#lib/CollectionPlayground.svelte';
  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';
  import SectionAnatomy from '#lib/SectionAnatomy.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Carousel', pageTitle: 'Carousel · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Carousel',
      headingLevel: 1,
      introduction:
        'Present a collection in a horizontally scrollable row. Cards stay easy to browse with native scrolling and optional navigation controls.',
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
    }}
  >
    <CollectionPlayground kind="carousel" />
  </Section>
  <SectionAnatomy kind="carousel" />
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
        <code>contentPlacement="below"</code> is the default. Choose
        <code>contentPlacement="overlay"</code>
        to place text at the bottom of the image. Overlay always uses cover, and
        <code>mediaAspect</code>
        fixes the entire card ratio. <code>textTone="light"</code> (default) uses pure white text
        over a dark gradient; <code>textTone="dark"</code> uses dark text over a light gradient. These
        local colors stay independent of the page theme and do not recolor the image.
      </p>
      <p>
        Use short titles and teasers for overlay cards. Longer copy, custom content and actions
        remain reachable in a keyboard-focusable scrolling text area without enlarging the card.
        Text remains selectable, the image and title share the main link, and actions remain
        independent. Missing images retain the same fixed card shape and gradient.
      </p>
      <p>
        A native horizontal collection using the same card sizes as CardGridSection. It is
        progressively enhanced with previous/next buttons and selection callbacks; it does not
        implement Spatial Elements' virtual scrolling, camera or 3D selection mechanics.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Card surfaces accept <code>cardTone=&quot;standard&quot;</code> (default) or
        <code>&quot;muted&quot;</code>, also through JSON section data. They use the same palette as
        panels and are independent of the section background.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'props',
      title: 'Props',
      headline: 'Props',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Generic over T extends <a href={base + '/docs/reference/types/#card-item'}>CardItem</a>.
        Required section:
        <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a> and list: T[].
        Optional cardSize (m), cardShadow (false), mediaAspect (3/2; also 4/3 or 1/1), mediaFit (contain),
        contentPlacement (below), textTone (light; overlay only), textAlign (start), controls (true),
        previousLabel (Previous cards), nextLabel (Next cards), media(item), itemContent(item), oncardready(parts),
        initialItemKey and onselectionchange(key).
      </p>
      <p>
        <code>initialItemKey</code> is applied once after mount, matching itemKey ?? id.
        onselectionchange reports the occurrence nearest the leading edge after a native scrollend;
        duplicate content identities require unique occurrence keys. Initial placement and callback
        are enhancements; SSR starts at the first item. oncardready has the same lifecycle as
        <a href={base + '/docs/components/card/'}>Card</a>.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'layout-and-interaction',
      title: 'Layout and interaction',
      headline: 'Layout and interaction',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Card sizes S/M/L use 2/2/4 columns on XS and M, 2/2/3 on S, and 2/3/4 on L. Each slide takes
        that canonical span, with the same container width, outer gutters and gap as
        CardGridSection. Slides share equal heights. Cards use the selected media ratio plus
        independent title space in below mode and a collection-wide eyebrow row. S/M titles have up
        to two lines, L three; S hides eyebrows. Contained media has an 8px inset; cover fills the
        frame. Descriptions follow the actual title with a compact gap and text no larger than the
        title. Cards grow to fit their content. Optional
        <code>cardShadow</code> adds a resting shadow; hover strengthens the shadow and highlights the
        border in the accent color. The previous arbitrary pixel width caps and ps-carousel-card-width
        override were removed.
      </p>
      <p>
        The focusable native region supports touch, wheel/trackpad and keyboard scrolling without
        JavaScript. CSS scroll snapping aligns cards to the leading edge. Controls appear only after
        mount, when enabled and the collection has more than one item. Each moves by 85% of the
        track; reduced motion disables smooth scrolling. RTL reverses scrolling direction and
        selection-edge calculations.
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
        Supply translated region and button labels. The component is a scrollable collection, not a
        live slideshow; there is no autoplay or live announcement. Cards inherit their heading level
        and keep native links in server HTML.
      </p>
      <p>
        Related: <a href={base + '/sections/card-grid/'}>CardGridSection</a>,
        <a href={base + '/docs/reference/core-api/'}>Core API</a>,
        <a href={base + '/docs/design-system/responsive-layout/'}>shared layout reference</a>.
      </p>
    </div>
  </Section>
</ContentPage>
