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
  import PageLayoutDiagram from '#lib/PageLayoutDiagram.svelte';
  import PageLayoutPreview from '#lib/PageLayoutPreview.svelte';
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import ContentPage from '#lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'Breadcrumbs',
    pageTitle: 'Breadcrumbs · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Breadcrumbs',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'anatomy',
      title: 'At a glance',
      headline: 'At a glance',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutDiagram kind="breadcrumbs" />
  </Section>
  <Section
    section={{
      id: 'live-example',
      title: 'Live example',
      headline: 'Try the page layout',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutPreview kind="breadcrumbs" />
  </Section>
  <Section
    section={{
      id: 'overview',
      title: 'Overview',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Breadcrumbs show a page’s position in the site hierarchy, from a broad category to the
        current page. Each <a href={base + '/docs/reference/types/#breadcrumb'}>Breadcrumb</a> object
        has a label and an optional href. ContentPage accepts this list through page.breadcrumbs. This
        is different from the content menu, which links to sections within the current page.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'breadcrumbs',
      title: 'Breadcrumbs',
      headline: 'Breadcrumbs',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Use the same navigation tree for the menu, sidebar and breadcrumbs. The first breadcrumb is
        the main-menu entry; Home is reachable through the logo. Breadcrumbs accepts items and an
        optional label. It renders nothing with fewer than two items and marks the final entry with
        aria-current="page". The trail stays on one line. Labels that do not fit are shortened with
        an ellipsis; their full text remains available to assistive technology.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'automatic-navigation',
      title: 'Automatic content menu',
      headline: 'Automatic content menu',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        <code>showContentMenu</code> registers section IDs and titles automatically. It displays a sticky
        right sidebar in wide windows or a sticky button with a popup in smaller windows. The active bullet
        follows the reading position. Short last sections are selected at the end of the document. Reordered,
        added or removed sections update the list. The compact button sits 12 pixels from both the right
        edge and the beginning of the page's first section. It scrolls up with the content, then docks
        12 pixels below the viewport edge. A permanently fixed header reserves its own height above the
        button. While the popup is open, the button uses the accent color and selection background, matching
        ButtonGroup; closing it restores its normal appearance.
      </p>
      <p>
        Native anchor links work without JavaScript. The enhanced menu adds active-state tracking
        and Escape dismissal. No entries means no menu or reserved rail.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'sectionnavigation',
      title: 'SectionNavigation',
      headline: 'SectionNavigation',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        For a manually supplied list, SectionNavigation remains a small stateless building block. It
        accepts items (id and title), label (default “On this page”) and variant (horizontal or
        sidebar). It does not observe scrolling. ContentPage owns the complete automatic
        content-menu behavior.
      </p>
    </div>
  </Section>
</ContentPage>
