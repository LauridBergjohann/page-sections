<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Design system', pageTitle: 'Design system · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Design system',
      introduction:
        'Understand how shared sizes, responsive rules and surfaces keep different sections consistent.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'shared-rules',
      title: 'One set of layout rules',
      headline: 'One set of layout rules',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        A design system is a shared set of visual decisions: widths, spacing, type sizes, colors and
        surfaces. Page Sections applies these decisions across its components so a custom section
        can align with a ready-made one.
      </p>
      <p>
        You have already used <a href={base + '/docs/foundations/themes/'}>Theming</a> to set colors and
        typography. This chapter explains geometry and responsive behavior before you look up individual
        token values.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'widths',
      title: 'Separate page width from content width',
      headline: 'Separate page width from content width',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        The viewport is the browser’s available layout area. A container is the space assigned to a
        particular content region. A wide viewport can still contain a narrow section or a small
        grid between sidebars. Page layout uses viewport breakpoints; content grids respond to their
        own container width.
      </p>
      <p>
        ContentPage page.bodyLayout selects wide or narrow reading width. Section layout can inherit
        that choice or request wide, narrow or full behavior. Background size is independent: a full
        background paints across the viewport while the content keeps its chosen reading width.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'chapters',
      title: 'Learn the responsive rules',
      headline: 'Learn the responsive rules',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <ul>
        <li>
          <a href={base + '/docs/design-system/atomic-design/'}>Atomic design</a> — Atoms, molecules,
          organisms and page composition, with shared visual rules.
        </li>
        <li>
          <a href={base + '/docs/design-system/responsive-layout/'}
            >Layout sizes and responsiveness</a
          > — Viewport breakpoints, container grid sizes, card sizes and calculation helpers.
        </li>
        <li>
          <a href={base + '/docs/design-system/backgrounds/'}>Backgrounds and groups</a> — Standard and
          muted surfaces, full-width paint, transitions and nested groups.
        </li>
        <li>
          <a href={base + '/docs/reference/tokens/'}>CSS variables and tokens</a> — Exact values and the
          variables available for customization.
        </li>
      </ul>
    </div></Section
  >
</WebsitePage>
