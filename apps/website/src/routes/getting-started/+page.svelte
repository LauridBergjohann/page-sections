<script module lang="ts">
  export const examples = [
    { language: 'bash', code: 'npm install @page-sections/svelte' },
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, HeadingSection, Section } from '@page-sections/svelte';
<\/script>

<ContentPage page={{ title: 'Hello, Page Sections' }}>
  <HeadingSection section={{ id: 'title', title: 'Hello, Page Sections', headingLevel: 1 }} />
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
  import { HeadingSection, Section, CodeBlock, CardGridSection } from '@page-sections/svelte';

  import { nextStepCards } from '#lib/sectionCatalog.js';
  import ContentPage from '#lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Getting started' }}>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Getting started',
      introduction:
        'One package, one page. Start in an existing Svelte 5 or SvelteKit application.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
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
    <p>
      Or try it now in the <a href="https://svelte.dev/playground/f110f1e79b614ab7984adb25eef69c5b">
        Svelte Playground
      </a>!
    </p>
  </Section>
  <CardGridSection
    section={{
      id: 'next',
      title: 'Next steps',
      headline: '3. Make it yours',
      background: { color: 'standard', size: 'standard' }
    }}
    list={nextStepCards}
    cardSize="m"
    cardTone="standard"
    mediaHoverZoom={false}
  />
</ContentPage>
