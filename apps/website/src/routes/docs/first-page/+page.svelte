<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { ContentPage } from '@page-sections/svelte';
  import { RichTextSection, CardGridSection, type ContentPageData } from '@page-sections/svelte';
  const page: ContentPageData = {
    title: 'The reading room',
    intro: 'Guides for curious people.',
    breadcrumbs: [{ label: 'Reading room' }]
  };
<\/script>

<ContentPage {page} showContentMenu>
  <RichTextSection
    section={{
      id: 'start',
      title: 'Start here',
      headline: 'Make yourself at home',
      body: 'Choose a guide, or explore the **whole collection**.'
    }}
  />
  <CardGridSection
    section={{
      id: 'guides',
      title: 'Guides',
      headline: 'Your next read',
      background: { color: 'muted' }
    }}
    list={[
      { id: 'design', title: 'Designing a small garden', href: '/guides/design' },
      { id: 'seasons', title: 'Understanding the seasons', href: '/guides/seasons' }
    ]}
  />
</ContentPage>`
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Your first page', pageTitle: 'Your first page · Page Sections' }}
  showContentMenu
>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        After <a href={base + '/docs/installation/'}>installation</a>, add a page with a text
        introduction and a collection of links:
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        ContentPage creates the document title, an <code>h1</code>, breadcrumbs and a page-local
        section registry. Each Section contributes its <code>id</code> and <code>title</code> to the
        optional index. <code>headline</code> controls the visible section heading, so navigation labels
        can remain short.
      </p>
      <p>
        Inspect the result with JavaScript disabled <strong
          >after enabling SSR/prerendering in your application</strong
        >. Text and links should already be in the HTML response.
      </p>
      <p>
        Next, <a href={base + '/docs/content-grid/'}>arrange content in columns</a>,
        <a href={base + '/docs/navigation/'}>add standalone navigation</a>, or
        <a href={base + '/docs/data-and-custom-sections/'}>describe the page as data</a>.
      </p>
    </div></Section
  >
</ContentPage>
