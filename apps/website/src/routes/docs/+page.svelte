<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Documentation', pageTitle: 'Documentation · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Documentation',
      introduction:
        'Build your understanding one chapter at a time, from your first content section to a complete website.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'start-here',
      title: 'Start with the basics',
      headline: 'Start with the basics',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Page Sections is a Svelte toolkit for composing content websites. A section is a meaningful
        part of a page, such as an introduction, a text passage or an image with a caption. You
        combine these parts in ordinary Svelte markup.
      </p>
      <p>
        You only need basic HTML and Svelte knowledge to begin. Follow Next at the bottom of each
        chapter; each part introduces the names used by the next one. API details are linked
        wherever you need them.
      </p>
      <p><a href={base + '/docs/foundations/installation/'}>Start with installation</a></p>
    </div></Section
  >
  <Section
    section={{
      id: 'learning-path',
      title: 'Your learning path',
      headline: 'Your learning path',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <ol>
        <li>
          <a href={base + '/docs/foundations/'}>Foundations</a> — Install the library, understand what
          a section is, compose your first content and choose a theme.
        </li>
        <li>
          <a href={base + '/docs/page-layout/'}>Page layout</a> — Turn that content into a semantic HTML
          page with a header, main content, sidebars and footer.
        </li>
        <li>
          <a href={base + '/docs/building-blocks/'}>Components</a> — Explore the base Section, individual
          cards, images and column layouts.
        </li>
        <li>
          <a href={base + '/docs/design-system/'}>Design system</a> — Understand widths, viewport breakpoints,
          container responsiveness and connected backgrounds.
        </li>
        <li>
          <a href={base + '/docs/advanced/'}>Advanced</a> — Build your own section, render content data
          and prepare server-rendered HTML.
        </li>
        <li>
          <a href={base + '/docs/reference/'}>Reference</a> — Look up object fields, component exports,
          core utilities and exact design tokens.
        </li>
      </ol>
    </div></Section
  >
  <Section
    section={{
      id: 'find-an-answer',
      title: 'Find a specific answer',
      headline: 'Find a specific answer',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Already know the basics? The <a href={base + '/sections/'}>section gallery</a> shows
        ready-made text, media and collection layouts. The
        <a href={base + '/docs/reference/types/'}>data type reference</a> explains object properties such
        as a link action or an image, including their nested fields.
      </p>
      <p>
        The documentation follows the package version shown in the footer. Examples use application
        routes and media files that you provide.
      </p>
    </div></Section
  >
</WebsitePage>
