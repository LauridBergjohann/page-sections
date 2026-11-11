<script module lang="ts">
  export const examples: { language: string; code: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { ContentPage, SidebarNavigation, Section } from '@page-sections/svelte';
  import { resolveNavigation } from '@page-sections/core';
  const navigation = resolveNavigation(
    [
      {
        id: 'guides',
        label: 'Guides',
        href: '/guides/',
        children: [{ id: 'planting', label: 'Planting', href: '/guides/planting/' }],
      },
    ],
    { currentId: 'planting' },
  );
<\/script>

<ContentPage
  page={{ title: 'Planting', breadcrumbs: navigation.breadcrumbs }}
  showContentMenu
>
  {#snippet leftSidebar()}
    <SidebarNavigation items={navigation.sidebarItems} activeId={navigation.activeId} />
  {/snippet}
  <Section
    section={{
      id: 'preparation',
      title: 'Preparation',
      headline: 'Prepare the soil',
      background: { color: 'standard' },
    }}
  >
    <p>Loosen the surface and choose a sunny patch.</p>
  </Section>
  <Section
    section={{
      id: 'planting',
      title: 'Planting',
      headline: 'Sow the seeds',
      background: { color: 'muted' },
    }}
  >
    <p>Follow the packet instructions and water regularly.</p>
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
  let left = $state(true);
  let right = $state(true);
</script>

<ContentPage
  page={{ title: 'Page shell and sidebars', pageTitle: 'Page shell and sidebars · Page Sections' }}
  showSidebar={left}
  showContentMenu={right}
>
  <Section
    section={{
      id: 'try-layout',
      title: 'Try the layout',
      headline: 'Try the page frame',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Change the sidebars of this page and resize the browser. Below 1600px the content menu moves
        into a sticky popup.
      </p>
      <fieldset>
        <legend>Visible sidebars</legend><label
          ><input type="checkbox" bind:checked={left} /> Left sidebar</label
        > <label><input type="checkbox" bind:checked={right} /> Content menu</label>
      </fieldset>
      <CodeBlock
        language="svelte"
        code={'<ContentPage showContentMenu={' +
          right +
          '}>' +
          (left ? '\n  {#snippet leftSidebar()}...{/snippet}' : '') +
          '\n  ...\n</ContentPage>'}
      />
    </div>
  </Section>
  <Section
    section={{
      id: 'overview',
      title: 'Overview',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose"><CodeBlock {...examples[0]} highlighted={data.highlights[0]} /></div>
  </Section>
  <Section
    section={{
      id: 'contentpage-props',
      title: 'ContentPage props',
      headline: 'ContentPage props',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        <code>page: ContentPageData</code> is required. It supplies the title, optional pageTitle,
        eyebrow, intro, breadcrumbs and header. <code>children</code> contains the sections.
        <code>bodyLayout</code>
        is wide or narrow; <code>bodySpacing</code> controls vertical body spacing.
      </p>
      <ul>
        <li>
          <code>leftSidebar?: Snippet</code> supplies the contents of the left surface. ContentPage owns
          its width, shadow and scrolling.
        </li>
        <li>
          <code>showContentMenu?: boolean</code> defaults to false. It builds the right-hand contents
          menu from registered sections. An empty page reserves no right rail.
        </li>
        <li><code>contentMenuLabel?: string</code> defaults to “On this page”.</li>
        <li>
          <code>footer?: Snippet</code> renders after the sections within the content column, for example
          previous/next links.
        </li>
        <li>
          <code>header?: Snippet&lt;[ContentPageData, string]&gt;</code> replaces the title header; use
          the supplied ID on its heading.
        </li>
        <li>
          <code>showHeader</code> and <code>manageDocumentTitle</code> default to true. Turn them off
          when the host owns the h1 or document title.
        </li>
        <li>
          <code>theme</code>, <code>class</code> and standard main-element attributes are supported.
        </li>
      </ul>
    </div></Section
  >
  <Section
    section={{
      id: 'custom-page-headers-and-host-metadata',
      title: 'Headers and breadcrumbs',
      headline: 'Headers and breadcrumbs',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        The header snippet takes priority over page.header. Without either, ContentPage renders its
        title using HeadingSection, with size l and a transparent surface. Configure page.header as
        a heading or hero record. Both receive h1. Breadcrumbs sit outside that choice and remain
        available with a hero or a hidden header. Supply the path from the first main-menu entry
        through the current page; exclude Home. A one-entry breadcrumb is hidden. Its row remains
        reserved, including on pages without breadcrumbs, so the content and sidebars keep their
        vertical position. The logo links to Home.
      </p>
      <p>
        Supply exactly one h1. When showHeader is false, main falls back to page.title as its
        accessible label, unless aria-label or aria-labelledby is provided.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'pageshell-props',
      title: 'PageShell',
      headline: 'PageShell',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        PageShell optionally wraps navigation and ContentPage to share <code>theme</code> and
        <code>mode</code> (light or dark). It accepts a children snippet. It does not detect or persist
        a system preference; the application owns that choice.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'layout-and-accessibility',
      title: 'Responsive layout and scrolling',
      headline: 'Responsive layout and scrolling',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        Sections never exceed 1536px. At XS–L (below 1600px), both desktop sidebars are hidden. The
        right contents menu remains available in a sticky popup. Both panels are 248px wide at XL
        and 2XL, with a 12px gap at XL and a 28px gap at 2XL. At 3XL panels are 300px wide with a
        28px gap, and the 1536px content column stays centered regardless of sidebar occupancy.
      </p>
      <p>
        Both panels stick 16px from the viewport top and scroll internally when necessary. The right
        panel docks only when every page-level section, including the heading, has a standard-width
        standard or muted background. It then fills the gap, starts 16px lower and has no shadow. A
        transparent or full-width surface makes it freestanding, with the same rounded corners, gap
        and shadow as the left panel. An ordinary unpainted page header also makes it freestanding.
        Nested blocks inside an opaque section do not break that section's surface. This updates
        automatically, including without JavaScript. The main menu keeps its own centered geometry.
      </p>
      <p>
        The registry renders anchor links during SSR. JavaScript adds active-section tracking,
        Escape dismissal and focus restoration. Native details make the mobile popup usable without
        JavaScript. Navigation remains composed of ordinary links.
      </p>
    </div></Section
  >
</ContentPage>
