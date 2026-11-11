<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { CodeSection } from '@page-sections/svelte';
<\/script>

<CodeSection
  section={{
    id: 'install',
    title: 'Installation',
    headline: 'Add the package',
    code: 'npm install @page-sections/svelte',
    language: 'bash',
    filename: 'Terminal',
    tone: 'muted'
  }}
/>`
    },
    {
      language: 'ts',
      code: `import { highlightCode } from '@page-sections/svelte/highlight';

// Run during prerendering or in your server load function.
const code = 'const answer = 42;';
const highlighted = await highlightCode(code, 'typescript');
// Pass both code and highlighted to CodeBlock or CodeSection.`
    },
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { Sections, type SectionData } from '@page-sections/svelte';
  const sections: SectionData[] = [
    {
      type: 'grid',
      id: 'explanation',
      title: 'An idea and its code',
      blocks: [
        {
          id: 'text',
          span: { xs: 4, s: 3, m: 4, l: 6 },
          sections: [
            {
              type: 'richText',
              id: 'story',
              title: 'The idea',
              blocks: [{ type: 'paragraph', text: 'Explain the idea beside the code.' }]
            }
          ]
        },
        {
          id: 'code',
          span: { xs: 4, s: 3, m: 4, l: 6 },
          sections: [
            {
              type: 'code',
              id: 'example',
              title: 'The code',
              code: 'const answer = 42;',
              language: 'typescript',
              lineNumbers: true
            }
          ]
        }
      ]
    }
  ];
<\/script>

<Sections {sections} />`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import CodePlayground from '$lib/CodePlayground.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Code', pageTitle: 'Code · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Code',
      introduction: 'Readable examples, on their own or alongside the story.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'playground',
      title: 'Try it',
      headline: 'Try the presentation',
      variant: 'content'
    }}><CodePlayground /></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'section',
      title: 'CodeSection',
      headline: 'A complete section',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>CodeSection</code> adds the usual section heading, spacing, background and navigation
        registration around a <code>CodeBlock</code>. Source code is always text, never executable
        HTML.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'highlighting',
      title: 'Syntax colors',
      headline: 'Highlight at build or server time',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Plain code works without a highlighting dependency. For syntax colors, install the optional <code
          >shiki</code
        >
        peer and import <code>highlightCode</code> from the separate entry point. This supports Shiki's
        bundled languages and aliases; unknown languages fall back to plain text.
      </p>
      <CodeBlock code="npm install shiki" language="bash" /><CodeBlock
        {...examples[1]}
        highlighted={data.highlights[1]}
      />
      <p>
        Pass the result as <code>highlighted</code>. The source and language must match; stale or
        incomplete tokens fall back to the original text. Colors for light and dark themes are
        included. The engine stays out of browser bundles when this function is called only from
        server code.
      </p>
      <p>
        For data-driven rendering, pass a <code>codeHighlights</code> object to
        <code>Sections</code>, keyed by each code section's ID. The same map is forwarded into
        nested grids. Keep original source in content storage; derive highlighting when rendering.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'composition',
      title: 'Text and code',
      headline: 'Compose with the existing grid',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Place a rich-text section and a code section in a <a
          href={base + '/docs/foundations/content-grid/'}>grid</a
        >. Reorder its blocks to put the code first. Small containers stack the blocks in reading
        order; larger containers display them side by side.
      </p>
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'reference',
      title: 'Options',
      headline: 'CodeBlock and CodeData',
      variant: 'content'
    }}
  >
    <div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Code options">
        <table>
          <thead><tr><th>Option</th><th>Default</th><th>Meaning</th></tr></thead><tbody>
            <tr
              ><td><code>code: string</code></td><td>Required</td><td
                >Original source. Copy preserves it exactly.</td
              ></tr
            >
            <tr
              ><td><code>language: string</code></td><td>text</td><td
                >Visible language label and highlighting language.</td
              ></tr
            >
            <tr
              ><td><code>filename: string</code></td><td>Unset</td><td
                >Optional file or terminal label.</td
              ></tr
            >
            <tr
              ><td><code>tone: SurfaceTone</code></td><td>muted</td><td
                >standard or muted theme surface.</td
              ></tr
            >
            <tr
              ><td><code>lineNumbers: boolean</code></td><td>false</td><td
                >Visual line numbers, excluded from speech and copied source.</td
              ></tr
            >
            <tr
              ><td><code>highlightLines: number[]</code></td><td>[]</td><td
                >One-based line markers. Invalid and out-of-range numbers have no effect.</td
              ></tr
            >
            <tr
              ><td><code>wrap: boolean</code></td><td>false</td><td
                >Wrap long lines instead of horizontal scrolling.</td
              ></tr
            >
          </tbody>
        </table>
      </div>
      <p>
        Additional component props: <code>highlighted?: HighlightedCode</code>, <code>copy</code>
        (true), <code>label</code> (“Code example”), <code>copyLabel</code> (“Copy code”),
        <code>copiedLabel</code>
        (“Copied”), and <code>copyErrorLabel</code>. Set these labels when localizing the host.
      </p>
      <p>
        <code>CodeSection</code> accepts <code>section: Omit&lt;CodeSectionData, 'type'&gt;</code>
        and optional <code>highlighted</code>. <code>CodeSectionData</code> extends
        <code>SectionDefinition</code>
        and <code>CodeData</code> with <code>type: 'code'</code>. <code>CodeToken</code> describes
        token text, light/dark colors and font style; <code>HighlightedCode</code> contains source, language
        and token lines. These models are JSON-compatible and live in core.
      </p>
    </div>
  </Section>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'accessibility',
      title: 'SSR and accessibility',
      headline: 'Useful before JavaScript',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Source, syntax colors supplied by the server and line markers render in initial HTML. The
        code region is keyboard-focusable for scrolling. The copy button is disabled until the
        Clipboard API is available; failures are announced without removing the source. Highlighting
        never uses raw HTML injection.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'compact-tools',
      title: 'Compact tools',
      headline: 'Language and copy tools',
      background: { color: 'standard', size: 'standard' },
      variant: 'content'
    }}
  >
    <p>
      The language and an accessible copy icon sit in the top-right corner of the code surface.
      There is no separate header row. Source scrolls independently without being covered by the
      tools; a single line stays compact. An optional filename remains an accessible figure caption
      and a tooltip on the tools. Copy feedback is announced through a live status region.
    </p>
  </Section>
</ContentPage>
