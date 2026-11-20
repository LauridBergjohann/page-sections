<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { Section } from '@page-sections/svelte';\n<\/script>\n\n<Section section={{ id: 'opening-hours', title: 'Hours', headline: 'Come and visit' }}>\n  <p>Open every Saturday from 10:00 to 16:00.</p>\n</Section>"
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage
  page={{ title: 'What are sections?', pageTitle: 'What are sections? · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'What are sections?',
      introduction:
        'A section is one meaningful part of a page. Give it content, a stable address and a clear label.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'a-content-region',
      title: 'One topic, one section',
      headline: 'One topic, one section',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Think of an article with an introduction, a planting guide and opening hours. Each topic can
        be a section. The Section component renders an HTML section element around the content you
        write inside it. It supplies consistent spacing and optional headings and backgrounds.
      </p>
      <p>
        A component is a reusable piece of Svelte markup. A property (or prop) is an input passed to
        that component. Here, the section prop is an object: a group of named values describing this
        content region.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'names-and-headings',
      title: 'ID, title and headline',
      headline: 'ID, title and headline',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <dl>
        <dt><code>id</code></dt>
        <dd>
          A stable address within the page, such as <code>opening-hours</code>. A link ending in
          <code>#opening-hours</code> jumps here. Use a lowercase letter followed by lowercase letters,
          digits or hyphens; keep it unique on the page.
        </dd>
        <dt><code>title</code></dt>
        <dd>A short required label used for navigation and accessibility.</dd>
        <dt><code>headline</code></dt>
        <dd>
          The optional heading displayed above your content. A title alone does not display a
          heading in the base Section.
        </dd>
      </dl>
      <p>
        These fields belong to <a href={base + '/docs/reference/types/#section-definition'}
          >SectionDefinition</a
        >, the shared data type describing a section. Its other fields are optional; you can learn
        them as you need them.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'ready-made-sections',
      title: 'Base container and ready-made sections',
      headline: 'Base container and ready-made sections',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Use Section when you want to write the contents yourself. Ready-made components add a
        particular content structure: RichTextSection renders text, ImageSection pairs an image with
        optional text, and CardGridSection arranges a collection of cards.
      </p>
      <p>
        The plural Sections component has a different job: it selects components from an array of
        content data. You do not need it for pages written directly in Svelte; it is introduced in
        Advanced.
      </p>
      <p>
        Next, <a href={base + '/docs/foundations/first-page/'}>use sections in a small page</a>.
      </p>
    </div></Section
  >
</WebsitePage>
