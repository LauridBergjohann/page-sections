<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { PageShell, ContentPage, Section } from '@page-sections/svelte';
<\/script>

<PageShell
  mode="light"
  theme={{
    accent: '#286449',
    radius: '12px',
    fontFamily: 'Georgia, serif',
    narrowMax: '720px'
  }}
>
  <ContentPage page={{ title: 'Garden journal' }}>
    <Section
      section={{
        id: 'news',
        title: 'News',
        headline: 'A new season',
        background: { color: 'muted' }
      }}
    >
      <p>A theme follows the content wherever it is used.</p>
    </Section>
  </ContentPage>
</PageShell>`
    },
    {
      language: 'css',
      code: `.site-theme {
  --ps-accent: var(--brand-link);
  --ps-ink: var(--text-primary);
  --ps-body: var(--text-secondary);
  --ps-section-standard: var(--surface);
  --ps-section-muted: var(--surface-muted);
  --ps-radius: 12px;
}`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Themes and styling', pageTitle: 'Themes and styling · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Themes and styling',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Page Sections provides CSS defaults without requiring a utility framework. Set shared
        variables on an ancestor, or use PageShell to scope a typed theme across navigation and page
        content.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'complete-pagetheme-mapping',
      title: 'Complete PageTheme mapping',
      headline: 'Complete PageTheme mapping',
      variant: 'content'
    }}
    ><div class="prose">
      <p>Every property is an optional CSS string, including units where needed.</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>PageTheme property</th>
              <th>CSS variable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>background</code></td>
              <td><code>--ps-background</code></td>
            </tr>
            <tr>
              <td><code>ink</code></td>
              <td><code>--ps-ink</code></td>
            </tr>
            <tr>
              <td><code>body</code></td>
              <td><code>--ps-body</code></td>
            </tr>
            <tr>
              <td><code>accent</code></td>
              <td><code>--ps-accent</code></td>
            </tr>
            <tr>
              <td><code>standard</code></td>
              <td><code>--ps-section-standard</code></td>
            </tr>
            <tr>
              <td><code>muted</code></td>
              <td><code>--ps-section-muted</code></td>
            </tr>
            <tr>
              <td><code>radius</code></td>
              <td><code>--ps-radius</code></td>
            </tr>
            <tr>
              <td><code>onAccent</code></td>
              <td><code>--ps-on-accent</code></td>
            </tr>
            <tr>
              <td><code>narrowMax</code></td>
              <td><code>--ps-narrow-max</code></td>
            </tr>
            <tr>
              <td><code>fontFamily</code></td>
              <td><code>--ps-font-family</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        PageShell applies these to its div; ContentPage.theme applies them to its main element. The <code
          >themeStyle</code
        >
        core helper performs the mapping and rejects unknown keys and values containing declaration delimiters.
        It is not a full CSS value validator. Variables outside this table, such as
        <code>--ps-border</code>, can be set in CSS.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'light-and-dark-modes',
      title: 'Light and dark modes',
      headline: 'Light and dark modes',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        PageShell accepts <code>mode: 'light' | 'dark'</code>. Dark mode changes the palette
        variables listed in the <a href={base + '/docs/reference/tokens/'}>CSS reference</a>. An
        explicit theme on the same element overrides that palette through inline CSS.
      </p>
      <p>
        The host owns system-preference detection, persistence and initial server-side selection.
        Omitting mode does not automatically switch the palette. The stylesheet has no light-reset
        selector: nesting a light shell inside a dark shell inherits dark variables unless you
        explicitly supply a light palette. Image uses the nearest PageShell's mode context for
        srcDark; absent an explicit mode, its picture source uses the OS preference independently.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'integrate-an-existing-design-system',
      title: 'Integrate an existing design system',
      headline: 'Integrate an existing design system',
      variant: 'content'
    }}
    ><div class="prose">
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        Place this class on an ancestor around the components and define the host variables. Shared
        styles also scope font, link and focus rules to <code>.ps-shell</code>,
        <code>.ps-page</code>
        and <code>.ps-navigation</code>; use a PageShell or equivalent class when composing
        low-level components independently.
      </p>
      <p>
        Geometry is a shared contract: viewport thresholds, grid columns/gaps, catalog sizes and the
        1536px content/menu cap come from layoutTokens. Per-size grid override inputs and
        PageTheme.contentMax were removed in 0.2. Use narrowMax with page.bodyLayout or
        section.layout for reading widths. Colors, font family and radius remain theme controls.
      </p>
      <p>
        Section variant selects default grid typography, content headings or larger feature
        headings. Most high-level components do not forward arbitrary class/style props; use the
        documented theme and section fields or ancestor CSS. See the <a
          href={base + '/docs/reference/svelte-api/'}>Svelte API</a
        > for forwarding exceptions.
      </p>
      <p>
        Related: <a href={base + '/docs/foundations/backgrounds/'}
          >Section Backgrounds and Surface Groups</a
        >,
        <a href={base + '/docs/reference/tokens/'}>CSS Variables and Layout Tokens</a>.
      </p>
    </div></Section
  >
</ContentPage>
