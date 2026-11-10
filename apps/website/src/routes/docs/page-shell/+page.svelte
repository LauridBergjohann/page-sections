<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import {
    PageShell,
    ContentPage,
    Section,
    type ContentPageData
  } from '@page-sections/svelte';
  const page: ContentPageData = {
    title: 'Growing together',
    pageTitle: 'Growing together | Garden journal',
    eyebrow: 'Our journal',
    intro: 'Notes from a shared garden.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Journal' }]
  };
<\/script>

<PageShell mode="light" theme={{ accent: '#286449', radius: '12px' }}>
  <ContentPage {page} sectionNavigation="sidebar" navigationLabel="In this article">
    <Section
      section={{ id: 'spring', title: 'Spring', headline: 'Planting the first seeds' }}
    >
      <p>Choose a sunny patch and start small.</p>
    </Section>
    <Section
      section={{ id: 'summer', title: 'Summer', headline: 'Caring for new growth' }}
    >
      <p>Water regularly and share what you learn.</p>
    </Section>
  </ContentPage>
</PageShell>`
    },
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, HeroSection } from '@page-sections/svelte';
<\/script>

<svelte:head><title>Our garden | Journal</title></svelte:head>
<ContentPage
  page={{ title: 'Our garden' }}
  showHeader={false}
  manageDocumentTitle={false}
  id="content"
  lang="en"
  aria-labelledby="welcome-title"
>
  <HeroSection section={{ id: 'welcome', title: 'Our garden', headingLevel: 1 }} />
</ContentPage>`
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Page shell', pageTitle: 'Page shell · Page Sections' }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        ContentPage is the main content container. PageShell is an optional ancestor that shares a
        theme across the page and independent navigation.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'contentpage-props',
      title: 'ContentPage props',
      headline: 'ContentPage props',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Required / default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>page</code></td>
              <td><code>ContentPageData</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>Snippet</code></td>
              <td>Optional; no content by default</td>
            </tr>
            <tr>
              <td><code>sectionNavigation</code></td>
              <td><code>boolean</code> or <code>'horizontal'</code> or <code>'sidebar'</code></td>
              <td><code>false</code>; true means horizontal</td>
            </tr>
            <tr>
              <td><code>navigationLabel</code></td>
              <td><code>string</code></td>
              <td>Defaults through SectionNavigation to <code>On this page</code></td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td><code>PageTheme</code></td>
              <td>Optional; CSS overrides scoped to the main element</td>
            </tr>
            <tr>
              <td><code>class</code></td>
              <td><code>string</code></td>
              <td>Empty string</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>ContentPageData fields:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Meaning / default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code>, required</td>
              <td>Visible h1 and fallback browser title</td>
            </tr>
            <tr>
              <td><code>pageTitle</code></td>
              <td><code>string</code></td>
              <td>Browser title; defaults to title</td>
            </tr>
            <tr>
              <td><code>eyebrow</code></td>
              <td><code>string</code></td>
              <td>Optional text above h1</td>
            </tr>
            <tr>
              <td><code>intro</code></td>
              <td><code>string</code></td>
              <td>Optional introduction below h1</td>
            </tr>
            <tr>
              <td><code>breadcrumbs</code></td>
              <td><code>Breadcrumb[]</code></td>
              <td>Rendered by the default title header</td>
            </tr>
            <tr>
              <td><code>hero</code></td>
              <td><code>HeroSectionData</code></td>
              <td>Replaces the default header with a hero h1; a header snippet takes priority</td>
            </tr>
            <tr>
              <td><code>bodyLayout</code></td>
              <td>wide/narrow</td>
              <td>wide; narrow caps all sections together at narrowMax</td>
            </tr>
            <tr>
              <td><code>bodySpacing</code></td>
              <td>SectionDefinition spacing</td>
              <td>none; vertical space around the section body</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 id="custom-page-headers-and-host-metadata">Custom page headers and host metadata</h3>
      <p>
        ContentPage keeps its default title area unless <code>showHeader=&#123;false&#125;</code> is
        set, page.hero is supplied, or a <code>header</code> snippet replaces it. The snippet
        receives <code>(page, titleId)</code>; assign <code>titleId</code> to its heading to label
        main. <code>showHeader=&#123;false&#125;</code> also suppresses a supplied header snippet.
        Use <code>manageDocumentTitle=&#123;false&#125;</code> when the host route manages its
        document title. Standard HTML attributes such as <code>id</code>, <code>lang</code>,
        <code>aria-label</code>
        and <code>aria-labelledby</code> are forwarded to main; styling remains controlled through
        <code>theme</code>
        and <code>class</code>.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        Hero headings use the ID <code>$&#123;section.id&#125;-title</code>. Without a visible page
        header or explicit accessible label, ContentPage labels main with <code>page.title</code>.
        Provide exactly one page-level h1 in your own header or content. Section navigation remains
        available in all header modes.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'pageshell-props',
      title: 'PageShell props',
      headline: 'PageShell props',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Required / default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>Snippet</code></td>
              <td>Optional</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td><code>PageTheme</code></td>
              <td>Optional; inherited CSS defaults</td>
            </tr>
            <tr>
              <td><code>mode</code></td>
              <td><code>'light'</code> or <code>'dark'</code></td>
              <td>Unset; no system-mode detection or persistence</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        An explicit mode also informs descendant Image components when choosing <code>srcDark</code
        >. Without an explicit mode, images can use the system dark preference; this does not
        automatically switch the shell's palette. A nested <code>mode=&quot;light&quot;</code> does
        not reset inherited dark CSS values; see
        <a href={base + '/docs/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'layout-and-accessibility',
      title: 'Layout and accessibility',
      headline: 'Layout and accessibility',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        ContentPage caps content width and creates the grid container. A sidebar uses a 14rem column
        at viewport widths of 1200px or more; below that it sits above the sections. The standalone
        SectionNavigation sidebar variant remains a vertical list.
      </p>
      <p>
        The page renders a labelled main landmark, h1 and document title. Section navigation is
        produced after children register during SSR, then positioned above/beside them with CSS. DOM
        reading and keyboard order still place it after the content. Supply any skip links before
        the page; there is no active-section observer or automatic focus management.
      </p>
      <p>
        An internal SectionSurfaceGroup joins backgrounds. Registration is request-local. The
        content and links work without JavaScript when the host renders HTML on the server.
      </p>
      <p>
        Related: <a href={base + '/docs/content-grid/'}>Section and ContentGrid</a>,
        <a href={base + '/docs/breadcrumbs/'}>Breadcrumbs and Section Navigation</a>,
        <a href={base + '/docs/responsive-layout/'}>Responsive Layout</a>.
      </p>
    </div></Section
  >
</ContentPage>
