<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { PageShell, Header, ContentPage, Section } from '@page-sections/svelte';
<\/script>

<PageShell
  mode="light"
  theme={{
    accent: '#286449',
    panelBackground: '#ffffff',
    panelTintOpacity: 0.65,
    panelBackdropBlur: 8,
    radius: '12px',
    fontFamily: 'Georgia, serif',
    narrowMax: '720px'
  }}
>
  <Header scrollBehavior="fixed" items={[{ id: 'news', label: 'News', href: '#news' }]}>
    {#snippet brand()}<a href="/">Garden journal</a>{/snippet}
  </Header>
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
  --ps-panel-background: var(--surface);
  --ps-panel-tint-opacity: 0.65;
  --ps-panel-backdrop-blur: 8px;
  --ps-radius: 12px;
}`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '#lib/paths.js';
  import ContentPage from '#lib/WebsitePage.svelte';

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
  >
    <div class="prose">
      <p>
        A theme is a set of shared visual values such as colors, typeface and corner radius.
        PageShell is an optional wrapper that applies those values and a color mode to all
        components inside it. It renders a div, so it does not change your document landmarks. The
        theme prop is a <a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a> object; all
        its fields are optional CSS values.
      </p>
      <p>
        Page Sections provides CSS defaults without requiring a utility framework. Set shared
        variables on an ancestor, or use PageShell to scope a typed theme across navigation and page
        content.
      </p>
      <p>
        An explicit <code>mode="light"</code> or <code>mode="dark"</code> also sets
        <code>color-scheme</code> within PageShell, so native scrollbars and form controls follow
        that mode. For a document that scrolls at the viewport, apply the same
        <code>color-scheme</code> to <code>html</code>; it sits outside the wrapper.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        Text colors follow the same roles across sections: <code>--ps-body</code> colors body copy,
        introductions and descriptions, including custom section content and Markdown.
        <code>--ps-ink</code> colors headings, navigation and controls; <code>--ps-accent</code>
        colors content links and accents. These roles apply in both color modes. Buttons, footers and
        overlay cards retain their surface-specific contrast colors. To use one neutral text color everywhere,
        assign the same value to <code>ink</code> and <code>body</code> in your theme.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'complete-pagetheme-mapping',
      title: 'Complete PageTheme mapping',
      headline: 'Complete PageTheme mapping',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Properties are optional CSS strings, including units where needed, except the numeric panel
        material controls described below.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th><a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a> property</th>
              <th>CSS variable</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>border</code></td><td><code>--ps-border</code></td></tr>
            <tr><td><code>panelBorder</code></td><td><code>--ps-panel-border</code></td></tr>
            <tr>
              <td><code>panelBackground</code></td><td><code>--ps-panel-background</code></td>
            </tr>
            <tr>
              <td><code>panelTintOpacity</code></td><td><code>--ps-panel-tint-opacity</code></td>
            </tr>
            <tr>
              <td><code>panelBackdropBlur</code></td><td><code>--ps-panel-backdrop-blur</code></td>
            </tr>
            <tr>
              <td><code>footerBackground</code></td><td><code>--ps-footer-background</code></td>
            </tr>
            <tr><td><code>footerInk</code></td><td><code>--ps-footer-ink</code></td></tr>
            <tr><td><code>footerRadius</code></td><td><code>--ps-footer-radius</code></td></tr>
            <tr><td><code>footerShadow</code></td><td><code>--ps-footer-shadow</code></td></tr>
            <tr>
              <td><code>footerBarBackground</code></td><td>
                <code>--ps-footer-bar-background</code>
              </td>
            </tr>
            <tr><td><code>footerBarInk</code></td><td><code>--ps-footer-bar-ink</code></td></tr>
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
        PageShell applies these to its div; ContentPage.theme applies them to its main element. The <code>
          themeStyle
        </code>
        core helper performs the mapping and rejects unknown keys and values containing declaration delimiters.
        It is not a full CSS value validator. Use <code>border</code> for cards and controls, and
        <code>panelBorder</code>
        for panels and navigation. Set either to <code>transparent</code> to hide that edge without changing
        layout. Other CSS variables can be set directly in CSS.
      </p>
      <p>
        Use <code>panelBackground</code> (or <code>--ps-panel-background</code>) for the header,
        satellites, sidebars and floating popups independently of section backgrounds. For example,
        <code>theme=&#123;&#123; panelBackground: '#f0f3f5', standard: '#fff' &#125;&#125;</code>
        gives navigation panels a tinted surface while content stays white. If omitted, panels follow
        <code>--ps-section-standard</code> in both light and dark mode. ContentPanel keeps its explicitly
        selected standard or muted tone.
      </p>
      <p>
        The material controls follow spatial-elements: <code>panelTintOpacity</code> corresponds to
        <code>panelTheme.tintOpacity</code> (a number from 0 to 1), and
        <code>panelBackdropBlur</code>
        to <code>panelTheme.backdropBlur</code> (a pixel radius from 0 to 100). For example, use
        <code>panelTintOpacity: 0.65, panelBackdropBlur: 8</code> for the same tint strength and
        blur as its regular panel preset. The background color corresponds to its <code>tint</code>.
        Only the background tint becomes transparent; text, controls and borders keep their own
        opacity. This is different from spatial-elements' whole-panel <code>opacity</code>.
      </p>
      <p>
        Page Sections keeps opaque, unblurred defaults (1 and 0). Numeric theme values are clamped
        to the ranges above; non-finite values are rejected. In CSS, use a unitless
        <code>--ps-panel-tint-opacity</code> and a length such as <code>8px</code> for
        <code>--ps-panel-backdrop-blur</code>. Both inherit and can be overridden locally. Blur is
        visible through a translucent tint; a fully opaque background hides it. Browsers without
        backdrop-filter support still render the tint and readable content. The separate blur of the
        page behind an open popup remains independent of this panel material.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'light-and-dark-modes',
      title: 'Light and dark modes',
      headline: 'Light and dark modes',
      variant: 'content'
    }}
  >
    <div class="prose">
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
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'integrate-an-existing-design-system',
      title: 'Integrate an existing design system',
      headline: 'Integrate an existing design system',
      variant: 'content'
    }}
  >
    <div class="prose">
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        Place this class on an ancestor around the components and define the host variables. Shared
        styles also scope font, link and focus rules to <code>.ps-shell</code>,
        <code>.ps-page</code>
        and <code>.ps-navigation</code>; use a PageShell or equivalent class when composing
        low-level components independently.
      </p>
      <p>
        Geometry is a shared contract: viewport thresholds, grid columns/gaps, card sizes and the
        1536px content/menu cap come from layoutTokens. Per-size grid override inputs and
        <a href={base + '/docs/reference/types/#page-theme'}>PageTheme</a>.contentMax were removed
        in 0.2. Use narrowMax with page.bodyLayout or section.layout for reading widths. Colors,
        font family and radius remain theme controls.
      </p>
      <p>
        Section variant selects default grid typography, content headings or larger feature
        headings. Most high-level components do not forward arbitrary class/style props; use the
        documented theme and section fields or ancestor CSS. See the <a
          href={base + '/docs/reference/svelte-api/'}
        >
          Svelte API
        </a> for forwarding exceptions.
      </p>
      <p>
        Related: <a href={base + '/docs/design-system/backgrounds/'}>
          Section Backgrounds and Surface Groups
        </a>,
        <a href={base + '/docs/reference/tokens/'}>CSS Variables and Layout Tokens</a>.
      </p>
    </div>
  </Section>
</ContentPage>
