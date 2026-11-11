<script module lang="ts">
  export const examples = [
    { language: 'bash', code: 'npm install @page-sections/svelte' },
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, Section } from '@page-sections/svelte';
<\/script>

<ContentPage page={{ title: 'Hello, Page Sections' }}>
  <Section section={{ id: 'welcome', title: 'Welcome',
    headline: 'Your content starts here',
    background: { color: 'standard', size: 'standard' } }}>
    <p>Write ordinary HTML inside responsive sections.</p>
  </Section>
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
  page={{
    title: 'Getting started',
    intro: 'One package, one page. Start in an existing Svelte 5 or SvelteKit application.'
  }}
>
  <Section
    section={{
      id: 'install',
      title: 'Install',
      headline: '1. Install the package',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
  </Section>
  <Section
    section={{
      id: 'first-page',
      title: 'Create a page',
      headline: '2. Add your content',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      Use this in <code>App.svelte</code>, or in <code>src/routes/+page.svelte</code> with SvelteKit.
      The components include their styles.
    </p>
    <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
  </Section>
  <Section
    section={{
      id: 'next',
      title: 'Next steps',
      headline: '3. Make it yours',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <p>
      Add <a href={base + '/docs/sections/'}>sections</a>, configure your
      <a href={base + '/docs/page-shell/'}>page layout</a>
      and adapt the <a href={base + '/docs/themes/'}>theme</a>.
    </p>
    <p>
      The <a href={base + '/docs/installation/'}>installation reference</a> covers requirements and
      framework setup. For a complete starting point, explore the
      <a href="https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo"
        >minimal demo</a
      >.
    </p>
  </Section>
</ContentPage>
