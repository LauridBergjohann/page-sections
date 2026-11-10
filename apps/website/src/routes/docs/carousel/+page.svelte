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
  import CollectionPlayground from '$lib/CollectionPlayground.svelte';
  import { base } from '$app/paths';
  import { ContentPage, Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Carousel', pageTitle: 'Carousel · Page Sections' }} sectionNavigation>
  <Section
    section={{ id: 'playground', title: 'Try it', headline: 'Try it yourself', variant: 'content' }}
    ><CollectionPlayground kind="carousel" /></Section
  >
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>﻿# CarouselSection</p>
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
    </div></Section
  >
  <Section section={{ id: 'props', title: 'Props', headline: 'Props', variant: 'content' }}
    ><div class="prose">
      <p>
        Generic over T extends CardItem. Required section: SectionDefinition and list: T[]. Optional
        cardSize (m), cardVariant (catalog), mediaAspect (3/2; also 4/3 or 1/1), mediaFit (contain
        for catalog, cover for editorial), textAlign (start), controls (true), previousLabel
        (Previous cards), nextLabel (Next cards), media(item), itemContent(item),
        oncardready(parts), initialItemKey and onselectionchange(key).
      </p>
      <p>
        <code>initialItemKey</code> is applied once after mount, matching itemKey ?? id.
        onselectionchange reports the occurrence nearest the leading edge after a native scrollend;
        duplicate content identities require unique occurrence keys. Initial placement and callback
        are enhancements; SSR starts at the first item. oncardready has the same lifecycle as
        <a href={base + '/docs/card-and-image/'}>Card</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'layout-and-interaction',
      title: 'Layout and interaction',
      headline: 'Layout and interaction',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Each slide takes the canonical S/M/L column span, with the same container width, outer
        gutters and gap as CardGridSection. Slides share equal heights. Catalog cards use the
        selected media ratio plus independent title space and a collection-wide eyebrow row. S/M
        titles have two lines, L three; S hides eyebrows. Contained media has an 8px inset; cover
        fills the frame. Editorial mode grows with content. The previous arbitrary pixel width caps
        and ps-carousel-card-width override were removed.
      </p>
      <p>
        The focusable native region supports touch, wheel/trackpad and keyboard scrolling without
        JavaScript. CSS scroll snapping aligns cards to the leading edge. Controls appear only after
        mount, when enabled and the collection has more than one item. Each moves by 85% of the
        track; reduced motion disables smooth scrolling. RTL reverses scrolling direction and
        selection-edge calculations.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'accessibility-and-ssr',
      title: 'Accessibility and SSR',
      headline: 'Accessibility and SSR',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Supply translated region and button labels. The component is a scrollable collection, not a
        live slideshow; there is no autoplay or live announcement. Cards inherit their heading level
        and keep native links in server HTML.
      </p>
      <p>
        Related: <a href={base + '/docs/card-grid/'}>CardGridSection</a>,
        <a href={base + '/docs/core-api/'}>Core API</a>,
        <a href={base + '/docs/migration/'}>Migration</a>.
      </p>
    </div></Section
  >
</ContentPage>
