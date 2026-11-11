<script module lang="ts">
  // Executable examples are owned by this page and checked by check:docs.
  export const examples: { language: string; code: string; filename?: string; group?: string }[] =
    [];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Documentation', pageTitle: 'Documentation · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Documentation',
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
      <img src={base + '/page-sections-logo.svg'} alt="Page Sections logo" width="64" height="64" />
      <p>
        Page Sections is a simple, extensible toolkit for building content-driven websites from
        reusable sections and layouts.
      </p>
      <p>
        Use it to compose a portfolio, publication, product page or company website. Content stays
        ordinary HTML, layouts adapt to their containers, and reusable models keep CMS data separate
        from rendering components.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'start-here',
      title: 'Start here',
      headline: 'Start here',
      variant: 'content'
    }}
    ><div class="prose">
      <ol>
        <li><a href={base + '/docs/foundations/installation/'}>Install the packages</a>.</li>
        <li><a href={base + '/docs/foundations/first-page/'}>Build your first page</a>.</li>
        <li>
          Learn how <a href={base + '/docs/foundations/pages-and-sections/'}
            >pages, sections and blocks fit together</a
          >.
        </li>
        <li>
          Explore the <a
            href="https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo"
            >demo source</a
          >.
        </li>
      </ol>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'choose-an-entry-point',
      title: 'Choose an entry point',
      headline: 'Choose an entry point',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Guide</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Compose a page</td>
              <td><a href={base + '/docs/foundations/page-shell/'}>ContentPage and PageShell</a></td
              >
            </tr>
            <tr>
              <td>Arrange different-width content</td>
              <td><a href={base + '/docs/foundations/content-grid/'}>Section and ContentGrid</a></td
              >
            </tr>
            <tr>
              <td>Browse reusable components</td>
              <td><a href={base + '/docs/reference/svelte-api/'}>Svelte API</a></td>
            </tr>
            <tr>
              <td>Integrate a design system</td>
              <td><a href={base + '/docs/foundations/themes/'}>Themes and Styling</a></td>
            </tr>
            <tr>
              <td>Render CMS data or add a custom section</td>
              <td
                ><a href={base + '/docs/advanced/data-and-custom-sections/'}
                  >Data Models and Custom Sections</a
                ></td
              >
            </tr>
            <tr>
              <td>Use models without Svelte</td>
              <td><a href={base + '/docs/reference/core-api/'}>Core API</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        This website documents the public APIs of <code>@page-sections/core</code> and
        <code>@page-sections/svelte</code>. The footer shows the package version built with this
        website. Development, testing and publishing instructions live in the repository's
        <a href="https://github.com/LauridBergjohann/page-sections/tree/main/docs/development"
          >development guide</a
        >.
      </p>
    </div></Section
  >
</ContentPage>
