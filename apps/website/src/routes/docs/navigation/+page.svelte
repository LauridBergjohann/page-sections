<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { PageShell, Navigation, ButtonGroup } from '@page-sections/svelte';
  let mode = $state<'light' | 'dark'>('light');
<\/script>

<PageShell {mode}>
  <Navigation
    items={[
      { id: 'home', label: 'Home', href: '/', current: true },
      {
        id: 'guides',
        label: 'Guides',
        href: '/guides',
        children: [{ id: 'seeds', label: 'Seeds', href: '/guides/seeds' }]
      }
    ]}
    scrollBehavior="delayed"
  >
    {#snippet brand()}<a href="/">Garden journal</a>{/snippet}
    {#snippet left()}
      <ButtonGroup
        label="Language"
        items={[
          { id: 'en', label: 'EN', href: '/en', selected: true },
          { id: 'de', label: 'DE', href: '/de' }
        ]}
      />
    {/snippet}
    {#snippet right()}
      <ButtonGroup
        label="Theme"
        items={[
          { id: 'light', label: 'Light', selected: mode === 'light' },
          { id: 'dark', label: 'Dark', selected: mode === 'dark' }
        ]}
        onselect={(item) => {
          mode = item.id === 'dark' ? 'dark' : 'light';
        }}
      />
    {/snippet}
  </Navigation>
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
  page={{
    title: 'Navigation and satellites',
    pageTitle: 'Navigation and satellites · Page Sections'
  }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Navigation arranges a central menu and optional left/right controls. These controls are
        called satellites: they might select a language, change a theme or contain an
        application-specific action. Navigation works without ContentPage, PageShell or a router.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'navigation-props',
      title: 'Navigation props',
      headline: 'Navigation props',
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
              <td><code>MenuItem[]</code></td>
              <td>Optional native responsive menu</td>
            </tr>
            <tr>
              <td><code>menu</code></td>
              <td><code>Snippet</code></td>
              <td>Optional custom central content; takes precedence over desktop items</td>
            </tr>
            <tr>
              <td><code>tools</code></td>
              <td><code>Snippet</code></td>
              <td>Optional header controls</td>
            </tr>
            <tr>
              <td><code>menuIcon</code></td>
              <td><code>Snippet</code></td>
              <td>Decorative compact-menu icon</td>
            </tr>
            <tr>
              <td><code>menuLabel</code></td>
              <td><code>string</code></td>
              <td>Open navigation</td>
            </tr>
            <tr>
              <td><code>closeKey</code></td>
              <td><code>unknown</code></td>
              <td>A changed value closes all disclosures; bind the route path</td>
            </tr>
            <tr>
              <td><code>scrollBehavior</code></td>
              <td>static/delayed/fixed</td>
              <td>static</td>
            </tr>
            <tr>
              <td><code>left</code></td>
              <td><code>Snippet</code></td>
              <td>Optional; no left satellite when omitted</td>
            </tr>
            <tr>
              <td><code>right</code></td>
              <td><code>Snippet</code></td>
              <td>Optional; no right satellite when omitted</td>
            </tr>
            <tr>
              <td><code>brand</code></td>
              <td><code>Snippet</code></td>
              <td>Optional logo/header content</td>
            </tr>
            <tr>
              <td><code>settingsIcon</code></td>
              <td><code>Snippet</code></td>
              <td>Optional decorative icon; defaults to a gear</td>
            </tr>
            <tr>
              <td><code>settingsLabel</code></td>
              <td><code>string</code></td>
              <td>Settings; accessible disclosure label and panel heading</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>Main navigation</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Use named snippets for branded content and controls. With items, navigation is a native
        details disclosure below 1200px and a desktop menu above it. Put the logo and skip link
        inside brand. Custom menu snippets own their responsive behavior; omit items when supplying
        a complete custom menu. Header tools remain visible at every size.
      </p>
      <p>
        Below XL (1600px), the header spans available width and has a 66px minimum height. Its
        Settings disclosure contains the left/right controls. At XL, the header has a 64px minimum
        height and 16px top inset; its width is min(1536px, available width minus 272px). At 2XL
        (1809px) it is exactly 1536px when space permits, including border and padding. Satellites
        are 80 by 40px at 28px from the top and viewport edges. Keep brand, controls and desktop
        item labels compact enough to fit; arbitrary oversized custom content can grow the header.
      </p>
      <p>
        Static navigation scrolls with the document. Delayed navigation stays still for the first
        112px, then moves with the document; fixed reserves its normal height and stays at the top.
        Mount Navigation at the viewport level and avoid a scrolling/clipping ancestor when using
        delayed/fixed. There is no window-scroll listener or application router dependency.
      </p>
      <p>
        Links, item disclosures and Settings work without JavaScript. After hydration, Escape
        returns focus to the active disclosure summary, clicks outside navigation close its
        disclosures, and link activation closes them too. Bind closeKey to the host route for
        programmatic navigation. Resizing closes compact menus/settings when their desktop
        equivalents appear. Desktop nested item disclosures use overlays so they do not enlarge the
        header.
      </p>
      <p>
        Satellite controls render in both wide and compact containers; CSS exposes the appropriate
        copy. Keep state in their parent and avoid hard-coded IDs in repeated snippets. Geometry
        follows generated canonical tokens; colors, font and radius remain themeable.
      </p>
    </div></Section
  >
  <Section section={{ id: 'mainmenu', title: 'MainMenu', headline: 'MainMenu', variant: 'content' }}
    ><div class="prose">
      <p>
        The only prop is required <code>items: MenuItem[]</code>. An empty list produces an empty
        list element.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>MenuItem field</th>
              <th>Type</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code>, required</td>
              <td>Unique within its sibling list</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code>, required</td>
              <td>Visible text</td>
            </tr>
            <tr>
              <td><code>href</code></td>
              <td><code>string</code></td>
              <td>Native URL; passed through safeHref</td>
            </tr>
            <tr>
              <td><code>current</code></td>
              <td><code>boolean</code></td>
              <td>When true, linked item has aria-current=page</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>MenuItem[]</code></td>
              <td>A nonempty list creates details/summary with nested entries</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A group with both children and href shows its label as a summary and its destination link
        inside the disclosure. For a leaf, supply href to make it navigable. Groups open through
        native click, touch, Enter or Space. MainMenu uses document list semantics rather than
        application-menu keyboard conventions. On its own it does not detect routes or add
        dismissal/overlay behavior. Navigation supplies those behaviors when given items.
      </p>
    </div></Section
  >
  <Section
    section={{
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
              <td><code>ButtonGroupItem[]</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>Required accessible group label</td>
            </tr>
            <tr>
              <td><code>onselect</code></td>
              <td><code>(item: ButtonGroupItem) =&gt; void</code></td>
              <td>Optional callback for button activation</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>ButtonGroupItem field</th>
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
        MainMenu and ButtonGroup do not import full shared theme styles on their own. Navigation
        does, or import the stylesheet explicitly when using them elsewhere.
      </p>
      <p>
        Site navigation, <a href={base + '/docs/breadcrumbs/'}>breadcrumbs and section navigation</a
        > answer different questions: where can I go, where am I in the site, and what is on this page?
        Give each landmark a suitable label.
      </p>
      <p>
        Navigation links use neutral <code>--ps-ink</code>; content links retain
        <code>--ps-accent</code>. Header and satellites share <code>--ps-navigation-shadow</code>.
        Set this token on a navigation ancestor to customize or disable elevation. If host button
        groups paint their own outline and radius, leave the satellite wrapper unpainted and apply
        the token to the actual group to avoid duplicate edges.
      </p>
    </div></Section
  >
</ContentPage>
