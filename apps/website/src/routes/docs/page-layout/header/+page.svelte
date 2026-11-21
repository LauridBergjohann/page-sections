<script module lang="ts">
  export const examples: { language: string; code: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import {
    Header,
    ContentPage,
    SidebarNavigation,
    Section,
  } from '@page-sections/svelte';
  import { resolveNavigation, type MenuItem } from '@page-sections/core';
  const tree: MenuItem[] = [
    {
      id: 'guides',
      label: 'Guides',
      href: '/guides/',
      children: [
        {
          id: 'garden',
          label: 'Garden',
          href: '/guides/garden/',
          children: [
            { id: 'planting', label: 'Planting', href: '/guides/garden/planting/' },
          ],
        },
      ],
    },
  ];
  const navigation = resolveNavigation(tree, { currentId: 'planting' });
<\/script>

<Header items={navigation.items}>
  {#snippet brand()}<a href="/">Garden journal</a>{/snippet}
</Header>
<ContentPage
  page={{ title: 'Planting', breadcrumbs: navigation.breadcrumbs }}
  showContentMenu
>
  {#snippet leftSidebar()}<SidebarNavigation items={navigation.sidebarItems} />{/snippet}
  <Section section={{ id: 'soil', title: 'Soil' }}
    ><p>Start with healthy soil.</p></Section
  >
</ContentPage>
`
    }
  ];
</script>

<script lang="ts">
  import PageLayoutDiagram from '$lib/PageLayoutDiagram.svelte';
  import PageLayoutPreview from '$lib/PageLayoutPreview.svelte';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{
    title: 'Header and satellites',
    pageTitle: 'Header and satellites · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Header and satellites',
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
    <PageLayoutDiagram kind="header" />
  </Section>
  <Section
    section={{
      id: 'live-example',
      title: 'Live example',
      headline: 'Try the page layout',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutPreview kind="header" />
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
        Header is the site-level header container. MainMenu is the list of primary navigation links
        inside it. A satellite is an optional area next to the header for secondary controls, such
        as a theme selector. A Svelte snippet is a fragment of markup supplied to a named slot; use
        the brand, menu and tools snippets to customize those areas.
      </p>
      <p>
        In the complete example below, a <a href={base + '/docs/reference/types/#menu-item'}
          >MenuItem</a
        >
        is one labeled navigation link with optional child links. The helper
        <code>resolveNavigation</code>
        selects the current page from that tree and produces breadcrumbs and sidebar entries.
        <code>SidebarNavigation</code> displays those entries beside the main content.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'navigation-props',
      title: 'Header',
      headline: 'Header',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        <code>items: <a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a>[]</code> supplies
        the site tree. Every entry requires a stable id, label and href; children are recursive. Optional
        current marks the current page, active marks an ancestor, and icon is an application-defined key.
      </p>
      <p>
        Header renders the site header landmark. Only the menus are inside nav landmarks; brand,
        tools and settings sit outside navigation. It accepts brand, tools, left and right snippets,
        plus menuIcon and settingsIcon. Satellites appear alongside the header in wide windows and
        move into settings when space is limited. The optional menu snippet replaces the desktop
        menu; items still supplies the mobile tree. <code>closeKey</code>
        closes open menus when the host changes routes. <code>scrollBehavior</code> supports static (default),
        delayed and fixed.
      </p>
      <p>
        <code>Navigation</code> remains a deprecated compatibility export of Header with the same props.
        Prefer Header in new code and remove an existing outer header wrapper. Pass class, style, id and
        other HTML attributes directly to Header. The documentation URL remains unchanged.
      </p>
      <p>
        <code
          >itemIcon?: Snippet&lt;[<a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a
          >]&gt;</code
        > renders icons before the label at every menu level, including the main entries at every screen
        size. Supply an icon key on each item and render it through this snippet. The website uses Lucide;
        the library has no icon dependency.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'mainmenu',
      title: 'MainMenu and interaction',
      headline: 'MainMenu and interaction',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        In smaller windows, the burger contains every hierarchy level. A page link and a separate
        native disclosure control keep navigation distinct from expanding children. In wider
        windows, the header shows the first level. Hover or keyboard focus reveals the second level
        in an overlay, while the page behind it blurs. Opening the mobile burger menu also blurs the
        page. The blur animates in and out over 180ms, unless reduced motion is requested. The
        overlay does not list deeper levels.
      </p>
      <p>
        Clicking any menu link immediately navigates to its page. Links retain open-in-new-tab and
        other browser behavior. Escape closes the overlay and restores focus when appropriate.
        Parent pages must link to their children, so every level remains reachable on touchscreens
        and without hover.
      </p>
      <p>
        Standalone <code>MainMenu</code> accepts items, icon, variant (desktop/mobile), closeKey and onOpenChange.
        Use Header for the complete header, satellites and backdrop.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'sidebar-navigation',
      title: 'SidebarNavigation',
      headline: 'SidebarNavigation',
      background: { color: 'standard', size: 'standard' }
    }}
    ><div class="prose">
      <p>
        Supply items, optional activeId, an accessible label and an optional icon snippet. The
        active page receives an accent line; its ancestors open automatically. The usual items are <code
          >resolveNavigation(tree, location).sidebarItems</code
        >, representing the second and subsequent levels of the selected main entry.
      </p>
      <p>
        <code>resolveNavigation</code> accepts pathname or currentId. Explicit IDs also support detail
        routes. It returns items with current/active markers, activeId, root, sidebarItems and breadcrumbs
        without changing the supplied tree. The tree starts at the main-menu entries; keep Home as the
        brand link.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'buttongroup',
      title: 'ButtonGroup',
      headline: 'ButtonGroup',
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
              <td
                ><code
                  ><a href={base + '/docs/reference/types/#button-group-item'}>ButtonGroupItem</a
                  >[]</code
                ></td
              >
              <td>Required</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>Required accessible group label</td>
            </tr>
            <tr>
              <td><code>onselect</code></td>
              <td
                ><code
                  >(item: <a href={base + '/docs/reference/types/#button-group-item'}
                    >ButtonGroupItem</a
                  >) =&gt; void</code
                ></td
              >
              <td>Optional callback for button activation</td>
            </tr>
            <tr
              ><td><code>icon</code></td><td
                >Snippet&lt;[<a href={base + '/docs/reference/types/#button-group-item'}
                  >ButtonGroupItem</a
                >]&gt;</td
              ><td>Optional icon rendered for each item</td></tr
            >
            <tr
              ><td><code>iconOnly</code></td><td>boolean</td><td
                >false; with an icon, use the item label as the accessible name and tooltip</td
              ></tr
            >
          </tbody>
        </table>
      </div>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th
                ><a href={base + '/docs/reference/types/#button-group-item'}>ButtonGroupItem</a> field</th
              >
              <th>Type</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code>, required</td>
              <td>Unique group key</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code>, required</td>
              <td>Visible text</td>
            </tr>
            <tr>
              <td><code>href</code></td>
              <td><code>string</code></td>
              <td>A non-disabled item with href becomes a native link</td>
            </tr>
            <tr>
              <td><code>selected</code></td>
              <td><code>boolean</code></td>
              <td>Button aria-pressed or link aria-current=true; not updated internally</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>Renders a disabled button, even if href exists</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Button activation calls onselect; links navigate normally and do not call it. There is no
        radio-group selection algorithm or automatic state mutation. Buttons use type=button and
        normal keyboard focus; the wrapper has role=group and its label. Rendered buttons require
        JavaScript for their callbacks; links remain functional in SSR HTML.
      </p>
      <p>
        ButtonGroup does not import full shared theme styles on its own. Header does, or import the
        stylesheet explicitly when using them elsewhere.
      </p>
      <p>
        Site navigation, <a href={base + '/docs/page-layout/breadcrumbs/'}
          >breadcrumbs and section navigation</a
        > answer different questions: where can I go, where am I in the site, and what is on this page?
        Give each landmark a suitable label.
      </p>
      <p>
        Header links use neutral <code>--ps-ink</code>; content links retain
        <code>--ps-accent</code>. Header and satellites share <code>--ps-navigation-shadow</code>.
        Set this token on a navigation ancestor to customize or disable elevation. The header and
        satellite containers have no border or outline; shadows separate them from the page.
      </p>
      <p>
        The current page and its ancestors retain a muted background in both menus. Only the current
        page is bold. The main menu marks the top-level ancestor with an accent line; the sidebar
        marks the actual page. Top-level menu backgrounds fill the menu height with square corners.
        Sidebar branches reopen along the current page path after navigation. Desktop submenus
        connect directly to their parent link and are centered beneath it. Selected ButtonGroup
        items use a muted background and accent text; icons that inherit the text color follow the
        same selection treatment. With one selected item, the background slides to its new position
        in 180 milliseconds while the text and icon colors transition. Only the group's outer
        corners are rounded. The main-menu background and accent line move together when the active
        route changes; font weight changes immediately. Reduced-motion preferences disable these
        animations.
      </p>
    </div></Section
  >
</ContentPage>
