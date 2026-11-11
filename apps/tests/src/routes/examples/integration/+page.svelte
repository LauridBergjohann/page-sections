<script lang="ts">
  import {
    CardGridSection,
    CarouselSection,
    ContentPage,
    Navigation,
    Section,
    SectionSurfaceGroup,
    RichTextSection,
    type CardElements
  } from '@page-sections/svelte';
  import { catalogItems } from '$lib/examples';
  import type { CardMediaAspect } from '@page-sections/core';
  let mediaAspect: CardMediaAspect = $state('1/1');
  const integrationItems = catalogItems.map((item) => ({
    ...item,
    href: '/examples/cards/#catalog-m'
  }));
  let items = $state(integrationItems.slice(0, 3));
  let attached = $state(0);
  let detached = $state(0);
  let selected = $state('');
  let diagnostics = $state(0);
  function ready(parts: CardElements) {
    attached += 1;
    // An enhancement can measure these elements without replacing the native card.
    parts.root.dataset.adapter = parts.item.itemKey ?? parts.item.id;
    return () => {
      detached += 1;
      delete parts.root.dataset.adapter;
    };
  }
</script>

<ContentPage page={{ title: 'Integration contracts' }}>
  <p>Native card content remains available when an enhancement attaches to its elements.</p>
  <button onclick={() => (items = items.toReversed())}>Reverse items</button>
  <button onclick={() => (items = items.slice(1))}>Remove item</button>
  <output data-testid="attached">{attached}</output><output data-testid="detached"
    >{detached}</output
  >
  <label
    >Media format <select bind:value={mediaAspect}
      ><option value="3/2">3:2</option><option value="4/3">4:3</option><option value="1/1"
        >1:1</option
      ></select
    ></label
  >
  <CardGridSection
    section={{ id: 'adapter-cards', title: 'Adapter cards' }}
    list={items}
    {mediaAspect}
    oncardready={ready}
  >
    {#snippet media(item)}<span data-custom-media>{item.itemKey}</span>{/snippet}
    {#snippet surface(item)}<span data-custom-surface={item.itemKey}></span>{/snippet}
  </CardGridSection>
  <CarouselSection
    section={{ id: 'selection', title: 'Selection' }}
    list={integrationItems}
    initialItemKey="occurrence-2"
    onselectionchange={(key) => (selected = key)}
  />
  <output data-testid="selected">{selected}</output>
  <SectionSurfaceGroup pageKind="detail">
    <RichTextSection
      section={{
        id: 'detail-context',
        title: 'Detail context',
        headline: 'Detail surface',
        body: 'Standard-sized surface in a detail pane.',
        background: { color: 'standardToMuted', size: 'full' }
      }}
    />
  </SectionSurfaceGroup>
  <Section
    section={{ id: 'diagnostic', title: 'Diagnostic', background: { color: 'standardToMuted' } }}
    onDiagnostic={() => (diagnostics += 1)}
    ><output data-testid="diagnostics">{diagnostics}</output></Section
  >
  <Navigation
    label="Nested menu example"
    items={[
      {
        id: 'nested',
        href: '/examples/',
        label: 'More pages',
        children: [{ id: 'legal', label: 'Legal example', href: '/examples/legal/' }]
      }
    ]}
  />
</ContentPage>
