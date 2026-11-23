<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Foundations', pageTitle: 'Foundations · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Foundations',
      introduction:
        'Learn the vocabulary and build a small page before adding site navigation or advanced layouts.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'what-you-will-learn',
      title: 'From installation to your first section',
      headline: 'From installation to your first section',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        A section groups related content within a page. Page Sections supplies a base container and
        ready-made versions for common content. You can start with a paragraph and add richer pieces
        as you need them.
      </p>
      <p>
        The first four chapters build on one another. Install the package, learn the section model,
        use it in a page, then customize its appearance.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'chapters',
      title: 'Read in this order',
      headline: 'Read in this order',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ol>
        <li>
          <a href={base + '/docs/foundations/installation/'}>Installation</a>: Add the package and
          load its styles in an existing Svelte application.
        </li>
        <li>
          <a href={base + '/docs/foundations/pages-and-sections/'}>What are sections?</a>:
          Understand the content region, its ID, its navigation label and its visible heading.
        </li>
        <li>
          <a href={base + '/docs/foundations/first-page/'}>Using sections</a>: Build a small page
          with a title and two text sections.
        </li>
        <li>
          <a href={base + '/docs/foundations/themes/'}>Theming</a>: Set shared colors, typography
          and light or dark mode.
        </li>
      </ol>
    </div>
  </Section>
  <Section
    section={{
      id: 'next-stage',
      title: 'After the foundations',
      headline: 'After the foundations',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        You will have a working content page. Continue with <a href={base + '/docs/page-layout/'}>
          Page layout
        </a> to understand the HTML landmarks around it and add navigation.
      </p>
    </div>
  </Section>
</WebsitePage>
