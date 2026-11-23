<script module lang="ts">
  export const examples: { language: string; code: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { ContentPage, HeadingSection, SidebarNavigation, Section } from '@page-sections/svelte';
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
  <HeadingSection section={{ id: 'title', title: 'Planting', headingLevel: 1, background: { color: 'standard' } }} />
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
    },
    {
      language: 'svelte',
      code: `<script>
  import { PageShell, Header, ContentPage, Footer } from '@page-sections/svelte';
<\/script>

<PageShell mode="light">
  <Header items={[{ id: 'home', label: 'Home', href: '/' }]}>
    {#snippet brand()}<a class="brand" href="/">My Website</a>{/snippet}
  </Header>
  <ContentPage page={{ title: 'Welcome' }}>
    <h1>Welcome</h1>
    <p>Page content.</p>
    {#snippet pageEnd()}<a href="/next/">Continue reading</a>{/snippet}
  </ContentPage>
  <Footer footnote="© My Website" links={[{ label: 'Privacy', href: '/privacy/' }]}>
    {#snippet brand()}<p class="description">A short description.</p>{/snippet}
  </Footer>
</PageShell>

<style>
  .brand { font-weight: 700; color: #007b5e; }
  .description { max-width: 32ch; }
</style>`
    }
  ];
</script>

<script lang="ts">
  import PageLayoutDiagram from '$lib/PageLayoutDiagram.svelte';
  import PageLayoutPreview from '$lib/PageLayoutPreview.svelte';
  import { base } from '$app/paths';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let left = $state(true);
  let right = $state(true);
</script>

<ContentPage
  page={{
    title: 'ContentPage and sidebars',
    pageTitle: 'ContentPage and sidebars · Page Sections'
  }}
  showSidebar={left}
  showContentMenu={right}
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'ContentPage and sidebars',
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
    <PageLayoutDiagram kind="content-page" />
  </Section>
  <Section
    section={{
      id: 'live-example',
      title: 'Live example',
      headline: 'Try the page layout',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutPreview kind="content-page" />
  </Section>
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
        ContentPage renders the main landmark and holds this page’s content. Its leftSidebar snippet
        can hold navigation to other pages; showContentMenu adds an index of topics on this page on
        the right. SidebarNavigation renders a site navigation tree, while resolveNavigation derives
        the current path, breadcrumbs and sidebar items from that tree.
      </p>
      <p>
        Change the sidebars of this page and resize the browser. In a narrow window, the content
        menu moves into a sticky popup.
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
        <code
          >page: <a href={base + '/docs/reference/types/#content-page-data'}>ContentPageData</a
          ></code
        >
        is required. It supplies the title, optional pageTitle, and breadcrumbs.
        <code>children</code>
        contains the sections.
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
          menu from registered h2/h3 sections. H1 and h4�h6 are excluded; h3 entries are indented. A page
          without eligible sections reserves no right rail.
        </li>
        <li><code>contentMenuLabel?: string</code> defaults to “On this page”.</li>
        <li>
          <code>pageEnd?: Snippet</code> renders after the sections within the content column, for example
          previous/next links.
        </li>
        <li>
          <code>manageDocumentTitle</code> defaults to true. Turn it off when the host owns the document
          title.
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
        Place a HeadingSection or HeroSection with headingLevel: 1 directly in the page content. It
        controls its own background, position and typography, like every other section. Breadcrumbs
        remain separate. Supply the path from the first main-menu entry through the current page;
        exclude Home. A one-entry breadcrumb is hidden. Its row remains reserved, including on pages
        without breadcrumbs, so the content and sidebars keep their vertical position. The logo
        links to Home.
      </p>
      <p>
        Supply exactly one h1. The main landmark uses page.title as its accessible label, unless
        aria-label or aria-labelledby is provided.
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
        PageShell optionally wraps Header, ContentPage and Footer to share <code>theme</code>
        and
        <code>mode</code> (light or dark). It accepts a children snippet. It does not detect or persist
        a system preference; the application owns that choice.
      </p>
      <p>
        Recommended site structure: PageShell contains Header, ContentPage and Footer as siblings.
        They own their header, main and footer elements; do not add duplicate wrappers. PageShell
        itself is a neutral div. Header keeps brand and tools outside its menu navigation landmarks.
        ContentPage may include related asides, and its pageEnd snippet stays inside main. The site
        Footer belongs after ContentPage.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        Theme variables configure shared surfaces; classes on snippet elements configure your own
        content in the declaring component's style block. Header and Footer accept class, style and
        other HTML attributes on their roots. Their link defaults have low specificity so local
        snippet styles can override them.
      </p>
      <p>
        Migration: Navigation remains a deprecated export of Header. Replace it with Header and
        remove any surrounding header element. Rename ContentPage's footer snippet to pageEnd;
        footer remains a fallback, and pageEnd wins if both are passed.
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
        On wide screens, the sidebars sit beside the content. In smaller windows, the content menu
        moves into a sticky popup. The content menu stops at the end of the sections, before related
        pages or reading links in <code>pageEnd</code>. An attached menu keeps 16px of space at both
        ends of the section column; a detached menu ends flush with it. Long sidebars scroll
        independently, while the main content stays readable.
      </p>
      <p>
        The <a href={base + '/docs/design-system/responsive-layout/'}>responsive design system</a> explains
        the layout sizes, breakpoints and sidebar widths. Topic links also work without JavaScript; JavaScript
        adds active-topic tracking and keyboard focus restoration.
      </p>
    </div></Section
  >
</ContentPage>
