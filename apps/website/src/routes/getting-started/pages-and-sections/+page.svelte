<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import {
    PageShell,
    Navigation,
    MainMenu,
    ContentPage,
    Section
  } from '@page-sections/svelte';
<\/script>

<PageShell>
  <Navigation>
    {#snippet menu()}<MainMenu
        items={[{ id: 'home', label: 'Home', href: '/' }]}
      />{/snippet}
  </Navigation>
  <ContentPage page={{ title: 'A simple page' }}>
    <Section section={{ id: 'intro', title: 'Introduction', headline: 'Welcome' }}>
      <p>Your content stays normal Svelte markup.</p>
    </Section>
  </ContentPage>
</PageShell>`
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
  page={{ title: 'Pages and sections', pageTitle: 'Pages and sections · Page Sections' }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Use a small set of composable containers rather than a separate page format for every
        layout.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Building block</th>
              <th>Responsibility</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PageShell</td>
              <td
                >Optional shared theme and explicit color mode. Renders a div, not a page landmark.</td
              >
            </tr>
            <tr>
              <td>Navigation</td>
              <td>Site-level menu and optional satellites, independently of the page.</td>
            </tr>
            <tr>
              <td>ContentPage</td>
              <td>Main landmark, title, introduction, breadcrumbs and section registry.</td>
            </tr>
            <tr>
              <td>Section</td>
              <td
                >A meaningful content region with an anchor, navigation label and optional visible
                heading.</td
              >
            </tr>
            <tr>
              <td>ContentGrid</td>
              <td>Column layout for explicit ContentBlocks.</td>
            </tr>
            <tr>
              <td>ContentBlock</td>
              <td>Responsive column span; no automatic heading or registration.</td>
            </tr>
            <tr>
              <td>Sections</td>
              <td>Render an array of serializable section models.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        ContentPage does not own the main menu or interpret a <code>page.sections</code> array. Put Navigation
        alongside it and render children or a Sections component explicitly. Avoid nesting ContentPages:
        each renders a main landmark and page heading.
      </p>
      <p>
        Sections can be standalone. Within a ContentPage their anchors must be unique and match <code
          >^[a-z][a-z0-9-]*$</code
        >; registration rejects blank labels and duplicates. Prefer these conventions outside a page
        as well.
      </p>
      <p>
        Use declarative markup when content is authored in Svelte. Use data-driven Sections for CMS
        content, and provide custom renderers for domain-specific structures. Both paths use the
        same components and models.
      </p>
      <p>
        Continue with <a href={base + '/docs/page-shell/'}>ContentPage and PageShell</a>,
        <a href={base + '/docs/content-grid/'}>Section and ContentGrid</a>, and
        <a href={base + '/docs/data-and-custom-sections/'}>Data Models and Custom Sections</a>.
      </p>
    </div></Section
  >
</ContentPage>
