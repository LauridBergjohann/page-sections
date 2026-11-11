<script module lang="ts">
  export const examples: { language: string; code: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, Section } from '@page-sections/svelte';
<\/script>

<ContentPage
  page={{
    title: 'Planting',
    breadcrumbs: [
      { label: 'Guides', href: '/guides/' },
      { label: 'Garden', href: '/guides/garden/' },
      { label: 'Planting', href: '/guides/garden/planting/' },
    ],
  }}
  showContentMenu
  contentMenuLabel="In this guide"
>
  <Section
    section={{ id: 'soil', title: 'Prepare the soil', headline: 'Prepare the soil' }}
  >
    <p>Loosen the surface.</p>
  </Section>
  <Section section={{ id: 'seeds', title: 'Sow the seeds', headline: 'Sow the seeds' }}>
    <p>Follow the packet instructions.</p>
  </Section>
</ContentPage>
`
    }
  ];
</script>

<script lang="ts">
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'Breadcrumbs and content menu',
    pageTitle: 'Breadcrumbs and content menu · Page Sections'
  }}
  showContentMenu
>
  <Section section={{ id: 'overview', title: 'Overview', background: { color: 'standard' } }}>
    <div class="prose"><CodeBlock {...examples[0]} highlighted={data.highlights[0]} /></div>
  </Section>
  <Section
    section={{
      id: 'breadcrumbs',
      title: 'Breadcrumbs',
      headline: 'Breadcrumbs',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Use the same navigation tree for the menu, sidebar and breadcrumbs. The first breadcrumb is
        the main-menu entry; Home is reachable through the logo. Breadcrumbs accepts items and an
        optional label. It renders nothing with fewer than two items and marks the final entry with
        aria-current="page".
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'automatic-navigation',
      title: 'Automatic content menu',
      headline: 'Automatic content menu',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        <code>showContentMenu</code> registers section IDs and titles automatically. It displays a sticky
        right sidebar from XL or a sticky button with a popup on XS–L. The active bullet follows the reading
        position. Short last sections are selected at the end of the document. Reordered, added or removed
        sections update the list.
      </p>
      <p>
        Native anchor links work without JavaScript. The enhanced menu adds active-state tracking
        and Escape dismissal. No entries means no menu or reserved rail.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'sectionnavigation',
      title: 'SectionNavigation',
      headline: 'SectionNavigation',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        For a manually supplied list, SectionNavigation remains a small stateless building block. It
        accepts items (id and title), label (default “On this page”) and variant (horizontal or
        sidebar). It does not observe scrolling. ContentPage owns the complete automatic
        content-menu behavior.
      </p>
    </div></Section
  >
</ContentPage>
