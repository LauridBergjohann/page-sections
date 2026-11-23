<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { ContentPage, Section } from '@page-sections/svelte';\n<\/script>\n\n<ContentPage page={{ title: 'Planting guide' }} showContentMenu>\n  <h1>Planting guide</h1>\n  <Section section={{ id: 'prepare', title: 'Preparation', headline: 'Prepare the garden', headingSize: 'l' }}>\n    <p>Begin with the ground beneath your feet.</p>\n    <Section section={{ id: 'soil', title: 'Soil', headline: 'Improve the soil', headingSize: 'm' }}>\n      <p>Add compost before planting.</p>\n    </Section>\n  </Section>\n  <a href=\"#soil\">Return to soil preparation</a>\n</ContentPage>"
    }
  ];
</script>

<script lang="ts">
  import PageLayoutDiagram from '#lib/PageLayoutDiagram.svelte';
  import PageLayoutPreview from '#lib/PageLayoutPreview.svelte';
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage
  page={{
    title: 'Heading levels and anchor links',
    pageTitle: 'Heading levels and anchor links · Page Sections'
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Heading levels and anchor links',
      introduction:
        'Use heading levels for the document outline and stable IDs for links to individual topics.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'anatomy',
      title: 'At a glance',
      headline: 'At a glance',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutDiagram kind="headings-and-anchors" />
  </Section>
  <Section
    section={{
      id: 'live-example',
      title: 'Live example',
      headline: 'Try the page layout',
      background: { color: 'standard' }
    }}
  >
    <PageLayoutPreview kind="headings-and-anchors" />
  </Section>
  <Section
    section={{
      id: 'outline',
      title: 'Structure before appearance',
      headline: 'Structure before appearance',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Use one h1 to identify the page, h2 for its main topics and h3 for subtopics. Choose the
        level by the relationship between topics. Choose the visual size separately: headingLevel
        sets h1 through h6, while headingSize chooses m, l or xl.
      </p>
      <p>
        ContentPage starts section headings at h2. A nested Section inherits the next level when its
        parent has a headline; levels stop at h6. A parent without a headline does not advance the
        level. You can set headingLevel explicitly when your content requires it.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'anchors',
      title: 'Make every topic addressable',
      headline: 'Make every topic addressable',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The section id becomes its HTML id. Use a stable lowercase slug and keep it unique across
        all sections on the page, including nested ones. Link to it with href="#soil" or append
        #soil to a page URL. A changed headline does not require changing the ID.
      </p>
      <p>
        The title is the concise navigation label. The headline is the visible heading; omitting it
        on a base Section also omits that section from the automatic h2/h3 content index.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'index',
      title: 'Let the page build its index',
      headline: 'Let the page build its index',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        ContentPage with showContentMenu collects sections with h2 and h3 headings. The resulting
        ContentMenu is the “On this page” navigation; it tracks the active section after JavaScript
        enhancement. Native fragment links work in server-rendered HTML without JavaScript.
      </p>
      <p>
        For a manually supplied list, SectionNavigation accepts <a
          href={base + '/docs/reference/types/#section-navigation-item'}
        >
          SectionNavigationItem[]
        </a>. For a ready-made page title, see
        <a href={base + '/sections/headings/'}>HeadingSection</a>.
      </p>
    </div>
  </Section>
</WebsitePage>
