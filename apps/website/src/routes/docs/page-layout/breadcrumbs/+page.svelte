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
        Use the same navigation tree for the menu, sidebar and breadcrumbs. Supply the path from the
        main-menu entry through the current page. Breadcrumbs automatically adds an icon-only Home
        link at the beginning. An existing first entry pointing to Home is reused, so it is never
        shown twice. An empty path or a path containing only Home renders no breadcrumb. Every other
        path is visible, including a single page such as Documentation or About.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'home-link',
      title: 'Home and base paths',
      headline: 'Home and base paths',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The Home icon links to <code>/</code> by default. If your application lives under a base
        path, set <code>breadcrumbHomeHref="/my-app/"</code> on ContentPage. Set
        <code>breadcrumbHomeLabel="Startseite"</code> to translate its accessible name and tooltip.
        When using Breadcrumbs directly, the equivalent props are <code>homeHref</code> and
        <code>homeLabel</code>. The navigation landmark's label can be set with <code>label</code>.
      </p>
      <p>
        ContentPage keeps the breadcrumb row reserved even on the homepage, so content and sidebars
        retain their vertical position when moving between pages.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'accessibility',
      title: 'Accessibility and small screens',
      headline: 'Accessibility and small screens',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Home and ancestor pages use native links that work with the keyboard and without JavaScript.
        The Home icon has the accessible name “Home”. The final entry is plain text marked with
        <code>aria-current="page"</code>. Breadcrumbs stay on one line; long labels are shortened
        with an ellipsis while their full text remains available to assistive technology. The Home
        icon scales with the breadcrumb font size while retaining a 24-pixel click target.
      </p>
      <p>
        Links use the normal body text color without underlines. Hovering or focusing a link with
        the keyboard changes its text or icon to the accent color. Separators and entries without
        links are partially transparent, keeping the trail visually secondary to the page content.
      </p>
    </div>
  </Section>
</ContentPage>
