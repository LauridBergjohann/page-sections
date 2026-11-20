<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: '<script lang="ts">\n  import { Section, type SectionDefinition } from \'@page-sections/svelte\';\n  let { section }: { section: SectionDefinition & { quote: string; author: string } } = $props();\n<\/script>\n\n<Section {section}>\n  <blockquote>\n    <p>{section.quote}</p>\n    <footer>{section.author}</footer>\n  </blockquote>\n</Section>',
      filename: 'QuoteSection.svelte',
      group: 'quote'
    },
    {
      language: 'svelte',
      code: "<script>\n  import { ContentPage } from '@page-sections/svelte';\n  import QuoteSection from './QuoteSection.svelte';\n<\/script>\n\n<ContentPage page={{ title: 'Garden stories' }} showContentMenu>\n  <h1>Garden stories</h1>\n  <QuoteSection section={{ id: 'advice', title: 'Advice', headline: 'Start small', quote: 'One small patch is enough to begin.', author: 'The garden team', background: { color: 'muted' } }} />\n</ContentPage>",
      filename: 'App.svelte',
      group: 'quote'
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
  page={{ title: 'Create your own section', pageTitle: 'Create your own section · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Create your own section',
      introduction:
        'Build a reusable quote component around the base Section and keep the page’s shared behavior.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'start-with-content',
      title: 'Start with a content pattern',
      headline: 'Start with a content pattern',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Suppose several pages need a quotation and attribution. Section already handles the region,
        anchor, heading, background and inherited layout. Your component only needs to describe the
        quote content and place it inside that base container.
      </p>
      <p>
        Define the section prop as <a href={base + '/docs/reference/types/#section-definition'}
          >SectionDefinition</a
        > plus the two fields your content requires. The following file is a complete QuoteSection.svelte
        component.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'use-it',
      title: 'Use it like any other section',
      headline: 'Use it like any other section',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Import your new component and give it a unique ID, a navigation label and quote content. The
        example includes a headline so it appears in the page’s on-page index.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
    </div></Section
  >
  <Section
    section={{
      id: 'preserve-behavior',
      title: 'Keep the base behavior intact',
      headline: 'Keep the base behavior intact',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Forward the complete section object to Section. Use ordinary semantic markup for the
        quotation and attribution. Avoid adding another main landmark, another section registry or a
        fixed page width inside the wrapper.
      </p>
      <p>
        The base component supplies the heading; your quote content follows it. Test a narrow
        container, long text and light/dark themes. Check the section link and the on-page index as
        well as its appearance.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'from-markup-to-data',
      title: 'Add a data renderer when needed',
      headline: 'Add a data renderer when needed',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        This component works directly in Svelte without registering a new type. If a CMS must choose
        it from a section array, add a type discriminator and extend <a
          href={base + '/docs/reference/types/#section-type-map'}>SectionTypeMap</a
        >
        as shown in
        <a href={base + '/docs/advanced/data-and-custom-sections/#add-a-custom-section'}
          >Data and custom renderers</a
        >. The renderer map connects that data type to your component.
      </p>
    </div></Section
  >
</WebsitePage>
