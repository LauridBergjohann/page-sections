<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { Breadcrumbs, SectionNavigation, Section } from '@page-sections/svelte';
  import '@page-sections/svelte/styles.css';
<\/script>

<div class="ps-shell">
  <Breadcrumbs
    items={[
      { label: 'Home', href: '/' },
      { label: 'Guides', href: '/guides' },
      { label: 'Planting' }
    ]}
  />
  <SectionNavigation
    label="In this guide"
    items={[
      { id: 'preparation', title: 'Preparation' },
      { id: 'planting', title: 'Planting' }
    ]}
  />
  <Section
    section={{ id: 'preparation', title: 'Preparation', headline: 'Prepare the soil' }}
    ><p>Loosen the surface.</p></Section
  >
  <Section section={{ id: 'planting', title: 'Planting', headline: 'Sow the seeds' }}
    ><p>Follow the packet instructions.</p></Section
  >
</div>`
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
  page={{ title: 'Breadcrumbs and anchors', pageTitle: 'Breadcrumbs and anchors · Page Sections' }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Breadcrumbs show a page's location in the site hierarchy. SectionNavigation links to anchors
        on one page. Neither component owns routing or watches scroll position.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'breadcrumbs',
      title: 'Breadcrumbs',
      headline: 'Breadcrumbs',
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
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>items</code></td>
              <td><code>Breadcrumb[]</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>Breadcrumb</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Breadcrumb has required <code>label: string</code> and optional <code>href: string</code>.
        Earlier items with href render links. The last item always renders text with
        aria-current=page, even if it has href. Earlier items without href are plain text. A
        labelled nav contains an ordered list; separators are CSS, and long paths wrap. An empty
        array still renders the nav/list; ContentPage avoids rendering Breadcrumbs for an empty
        array.
      </p>
      <p>
        Set <code>page.breadcrumbs</code> on ContentPage for automatic rendering. ContentPage does not
        expose the Breadcrumbs label prop, so use a separately rendered Breadcrumbs component if a custom
        landmark label is needed.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'sectionnavigation',
      title: 'SectionNavigation',
      headline: 'SectionNavigation',
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
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>items</code></td>
              <td><code>SectionNavigationItem[]</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>On this page</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'horizontal'</code> or <code>'sidebar'</code></td>
              <td>horizontal</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        SectionNavigationItem is <code>&#123; id: string; title: string &#125;</code>. Links use
        <code>#id</code>; provide IDs matching real sections. Horizontal lists wrap; sidebar lists
        stack vertically at all widths. An empty array renders nothing. It does not register
        sections, validate IDs, track an active section, add aria-current, or make itself sticky.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'automatic-section-navigation',
      title: 'Automatic section navigation',
      headline: 'Automatic section navigation',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        ContentPage's <code>sectionNavigation</code> prop builds items from descendant Section
        registrations. True means horizontal; <code>'sidebar'</code> adds a page-level 14rem sidebar
        at 1200px viewport width and above. Narrower pages place it above the content. Its
        <code>navigationLabel</code> sets the landmark label.
      </p>
      <p>
        Registration happens during server rendering, before the navigation is evaluated. To
        accomplish this, the navigation follows sections in DOM order even when CSS positions it
        above them. Keyboard and assistive-technology order follows the DOM. The links are native
        and work without JavaScript; dynamic metadata and keyed reordering update after hydration.
        Supply skip links separately if needed.
      </p>
      <p>
        Related: <a href={base + '/docs/page-shell/'}>ContentPage and PageShell</a>,
        <a href={base + '/docs/navigation/'}>Navigation and Satellites</a>,
        <a href={base + '/docs/core-api/'}>Core API</a>.
      </p>
    </div></Section
  >
</ContentPage>
