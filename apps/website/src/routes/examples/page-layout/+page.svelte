<script lang="ts">
  import { onMount } from 'svelte';
  import {
    PageShell,
    Header,
    ContentPage,
    HeadingSection,
    Section,
    SidebarNavigation,
    Footer
  } from '@page-sections/svelte';
  import { base } from '#lib/paths.js';
  import NavigationIcon from '#lib/NavigationIcon.svelte';
  let kind = $state('content-page');
  let enabled = $state(true);
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    kind = params.get('kind') ?? 'content-page';
    enabled = params.get('enabled') !== 'false';
  });
  const items = [
    {
      id: 'guides',
      label: 'Guides',
      href: '#page-title',
      icon: 'book-text',
      active: true,
      children: [
        { id: 'planting', label: 'Planting', href: '#preparation' },
        { id: 'care', label: 'Plant care', href: '#planting' }
      ]
    },
    { id: 'about', label: 'About', href: '#example-footer', icon: 'info' }
  ];
  const fullPath = [
    { label: 'Guides', href: '#page-title' },
    { label: 'Garden', href: '#preparation' },
    { label: 'Planting', href: '#page-title' }
  ];
  const showSidebars = $derived(kind !== 'content-page' || enabled);
</script>

{#snippet left()}<a class="satellite-link" href="#preparation">Seasonal guide</a>{/snippet}
{#snippet right()}<a class="satellite-link" href="#planting">Start planting</a>{/snippet}
{#snippet sidebar()}<SidebarNavigation {items} />{/snippet}
<PageShell mode="light">
  <Header
    {items}
    left={kind === 'header' && enabled ? left : undefined}
    right={kind === 'header' && enabled ? right : undefined}
  >
    {#snippet brand()}<a class="brand" href="#page-title">Garden notes</a>{/snippet}
    {#snippet itemIcon(item)}<NavigationIcon name={item.icon} />{/snippet}
  </Header>
  <ContentPage
    page={{
      title: 'Planting',
      breadcrumbs: kind === 'breadcrumbs' && !enabled ? [fullPath[2]] : fullPath
    }}
    showContentMenu={showSidebars}
    leftSidebar={showSidebars ? sidebar : undefined}
  >
    <HeadingSection
      section={{
        id: 'page-title',
        title: 'Planting',
        headingLevel: 1,
        introduction: 'A complete page built from Header, ContentPage and Footer.',
        background: { color: 'standard' }
      }}
    />
    <Section
      section={{
        id: 'preparation',
        title: 'Preparation',
        headline: 'Prepare the soil',
        background: { color: 'standard' }
      }}
    >
      <p>
        Loosen the soil and choose a sunny patch. This section has a stable ID: follow its link in
        the contents menu or copy the heading anchor.
      </p>
      {#if kind !== 'headings-and-anchors' || enabled}
        <Section
          section={{
            id: 'location',
            title: 'Choose a spot',
            headline: 'Choose a spot',
            headingLevel: 3
          }}
        >
          <p>
            This h3 is a topic inside the h2 above. Its contents-menu entry is indented to reflect
            that relationship.
          </p>
        </Section>
      {/if}
    </Section>
    <Section
      section={{
        id: 'planting',
        title: 'Planting',
        headline: 'Sow the seeds',
        background: { color: 'muted' }
      }}
    >
      <p>
        Water regularly and leave enough room to grow. Resize this viewport to see the navigation
        and sidebars adapt.
      </p>
      <p><a href={base + '/docs/page-layout/'} target="_top">Read the page layout guide</a></p>
    </Section>
  </ContentPage>
  <Footer
    id="example-footer"
    footnote="© Garden notes"
    links={[{ label: 'Back to top', href: '#page-title' }]}
    menu={kind === 'footer' && !enabled
      ? []
      : [
          {
            label: 'Learn',
            links: [
              { label: 'Preparation', href: '#preparation' },
              { label: 'Planting', href: '#planting' }
            ]
          },
          {
            label: 'Explore',
            links: [{ label: 'Page layout guide', href: base + '/docs/page-layout/' }]
          }
        ]}
  />
</PageShell>

<style>
  .brand {
    font-weight: 700;
    white-space: nowrap;
    padding-inline: 12px;
  }
  .satellite-link {
    padding: 12px;
    display: inline-block;
  }
  p {
    line-height: 1.7;
  }
</style>
