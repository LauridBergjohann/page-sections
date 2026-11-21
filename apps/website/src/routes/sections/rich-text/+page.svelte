<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { RichTextSection } from '@page-sections/svelte';
<\/script>

<RichTextSection
  section={{
    id: 'contact',
    title: 'Contact',
    headline: 'Contact',
    blocks: [
      {
        type: 'address',
        name: 'Example Studio',
        lines: ['Sample Street 12', 'Example City']
      },
      {
        type: 'paragraph',
        text: [
          { type: 'strong', text: 'Email: ' },
          { type: 'link', text: 'hello@example.com', href: 'mailto:hello@example.com' }
        ]
      },
      {
        type: 'panel',
        title: 'A note',
        blocks: [{ type: 'paragraph', text: 'More information.' }]
      }
    ]
  }}
/>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import SectionAnatomy from '$lib/SectionAnatomy.svelte';
  import SectionPlayground from '$lib/SectionPlayground.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'RichText', pageTitle: 'Rich text · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'RichText',
      headingLevel: 1,
      introduction:
        'Tell longer stories with headings, paragraphs, lists and links. Write Markdown or plain text, or compose structured content blocks.',
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'playground',
      title: 'Try it',
      headline: 'Try it yourself',
      background: { color: 'standard', size: 'standard' }
    }}><SectionPlayground kind="rich-text" /></Section
  >
  <SectionAnatomy kind="rich-text" />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Render Markdown, literal text or structured blocks. Use blocks for addresses, inline
        emphasis, lists and panels without custom section components.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'props-and-configuration',
      title: 'Props and configuration',
      headline: 'Props and configuration',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The required section combines <a href={base + '/docs/reference/types/#section-definition'}
          >SectionDefinition</a
        >
        and <a href={base + '/docs/reference/types/#rich-text-content-data'}>RichTextContentData</a> without
        a required type discriminator. The serialized discriminator is richText. Choose exactly one source:
      </p>
      <ul>
        <li>body: string, with optional format (markdown or text; default markdown).</li>
        <li>
          blocks: <a href={base + '/docs/reference/types/#rich-text-block'}>RichTextBlock</a>[].
        </li>
      </ul>
      <p><a href={base + '/docs/reference/types/#rich-text-block'}>RichTextBlock</a> variants:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Fields</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>paragraph</td>
              <td
                >text: <a href={base + '/docs/reference/types/#inline-text'}>InlineText</a>;
                optional variant: default/lead/muted</td
              >
            </tr>
            <tr>
              <td>address</td>
              <td
                >name: string; lines: <a href={base + '/docs/reference/types/#inline-text'}
                  >InlineText</a
                >[]</td
              >
            </tr>
            <tr>
              <td>list</td>
              <td
                >items: <a href={base + '/docs/reference/types/#inline-text'}>InlineText</a>[];
                optional ordered: boolean</td
              >
            </tr>
            <tr>
              <td>panel</td>
              <td
                >blocks: <a href={base + '/docs/reference/types/#rich-text-block'}>RichTextBlock</a
                >[]; optional title, tone (standard/muted), actions:
                <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a>[]</td
              >
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <a href={base + '/docs/reference/types/#inline-text'}>InlineText</a> is a string or
        <a href={base + '/docs/reference/types/#inline-run'}>InlineRun</a> array. Runs are text/strong/emphasis/code
        with text, link with text/href, or break. Inline content is escaped; links pass through safeHref.
        String values in blocks are literal text, not Markdown. Paragraph whitespace preserves line breaks.
        Panels can nest and increment their heading level, capped at h6.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'low-level-content-components',
      title: 'Low-level content components',
      headline: 'Low-level content components',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        <code>RichTextContent</code> accepts required content:
        <a href={base + '/docs/reference/types/#rich-text-content-data'}>RichTextContentData</a>
        and renders the same prose without a section wrapper. <code>InlineTextContent</code> accepts
        required text: <a href={base + '/docs/reference/types/#inline-text'}>InlineText</a>. Neither
        adds a page heading, registry entry, arbitrary HTML parser or application dependency.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'rendering-and-styling',
      title: 'Rendering and styling',
      headline: 'Rendering and styling',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Markdown uses markdown-it with html=false, linkify=true and typographer=false. Plain text
        uses escaped text with preserved line breaks. Raw Markdown HTML is escaped; dangerous links
        are rejected. Authored Markdown headings retain their levels, so choose them to fit the
        page. Structured headings inherit automatically.
      </p>
      <p>
        The ps-prose wrapper provides line spacing, wrapping and scrollable code/table content.
        Section controls width, background and padding. All content is present in SSR HTML.
      </p>
      <p>
        Related: <a href={base + '/sections/panel/'}>Panels</a>,
        <a href={base + '/docs/building-blocks/grids/'}>Section and grids</a>,
        <a href={base + '/docs/advanced/data-and-custom-sections/'}>Data models</a>.
      </p>
    </div></Section
  >
</ContentPage>
