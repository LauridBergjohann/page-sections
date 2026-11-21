<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { ContentPage, Section } from '@page-sections/svelte';\n<\/script>\n\n<ContentPage page={{ title: 'The community garden' }} showContentMenu>\n  <h1>The community garden</h1>\n  <Section section={{ id: 'welcome', title: 'Welcome', headline: 'Grow something together' }}>\n    <p>A shared space for small beginnings.</p>\n  </Section>\n  <Section section={{ id: 'opening-hours', title: 'Hours', headline: 'Plan your visit' }}>\n    <p>Open every Saturday from 10:00 to 16:00.</p>\n  </Section>\n</ContentPage>"
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
  page={{ title: 'Using sections', pageTitle: 'Using sections · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Using sections',
      introduction:
        'Put two sections in a page and see how labels, headings and ordinary HTML work together.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'page-container',
      title: 'Introduce the page container',
      headline: 'Introduce the page container',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        You have seen Section, which groups one topic. ContentPage groups the main content of an
        entire page and renders the HTML main landmark. Its page prop describes the page; the
        required title sets the browser document title by default.
      </p>
      <p>
        ContentPage does not insert a visible page heading. Write one h1 yourself, then use section
        headlines for the topics below it. The page container gives these sections an h2 heading
        level by default.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'read-the-example',
      title: 'Read the example',
      headline: 'Read the example',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        The h1 names the page. Each section supplies a unique id and a short title; headline
        displays the longer topic heading. Paragraphs remain ordinary HTML, so you can add lists,
        links and other semantic markup inside a section.
      </p>
      <p>
        The page object follows <a href={base + '/docs/reference/types/#content-page-data'}
          >ContentPageData</a
        >. The section object follows
        <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>. Click
        these type names whenever you need to inspect their fields.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'add-an-index',
      title: 'Let readers jump between topics',
      headline: 'Let readers jump between topics',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Add showContentMenu to ContentPage to create an on-page index from sections with h2 or h3
        headlines. The index uses each section title for its label and id for its destination. You
        do not have to maintain a second list of anchors.
      </p>
      <p>
        Try changing the second section title to “Visit” while keeping its headline. The index label
        changes; the visible heading stays the same. Keep IDs stable so saved links continue to
        work.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'continue',
      title: 'Choose the appearance next',
      headline: 'Choose the appearance next',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Now that the structure works, continue with <a href={base + '/docs/foundations/themes/'}
          >Theming</a
        >. Later, <a href={base + '/docs/page-layout/'}>Page layout</a> explains where headers and footers
        belong around your main content.
      </p>
    </div></Section
  >
</WebsitePage>
