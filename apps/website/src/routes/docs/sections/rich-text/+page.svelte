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
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Rich text', pageTitle: 'Rich text · Page Sections' }} showContentMenu>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>﻿# RichTextSection</p>
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
        The required section combines SectionDefinition and RichTextContentData without a required
        type discriminator. The serialized discriminator is richText. Choose exactly one source:
      </p>
      <ul>
        <li>body: string, with optional format (markdown or text; default markdown).</li>
        <li>blocks: RichTextBlock[].</li>
      </ul>
      <p>RichTextBlock variants:</p>
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
              <td>text: InlineText; optional variant: default/lead/muted</td>
            </tr>
            <tr>
              <td>address</td>
              <td>name: string; lines: InlineText[]</td>
            </tr>
            <tr>
              <td>list</td>
              <td>items: InlineText[]; optional ordered: boolean</td>
            </tr>
            <tr>
              <td>panel</td>
              <td
                >blocks: RichTextBlock[]; optional title, tone (standard/muted), actions:
                ContentAction[]</td
              >
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        InlineText is a string or InlineRun array. Runs are text/strong/emphasis/code with text,
        link with text/href, or break. Inline content is escaped; links pass through safeHref.
        String values in blocks are literal text, not Markdown. Paragraph whitespace preserves line
        breaks. Panels can nest and increment their heading level, capped at h6.
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
        <code>RichTextContent</code> accepts required content: RichTextContentData and renders the
        same prose without a section wrapper. <code>InlineTextContent</code> accepts required text: InlineText.
        Neither adds a page heading, registry entry, arbitrary HTML parser or application dependency.
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
        Related: <a href={base + '/docs/sections/panels/'}>Panels</a>,
        <a href={base + '/docs/foundations/content-grid/'}>Section and grids</a>,
        <a href={base + '/docs/advanced/data-and-custom-sections/'}>Data models</a>.
      </p>
    </div></Section
  >
</ContentPage>
