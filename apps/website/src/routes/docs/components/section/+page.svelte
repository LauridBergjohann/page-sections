<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { Section } from '@page-sections/svelte';\n<\/script>\n\n<Section section={{\n  id: 'visit', title: 'Visit', headline: 'Plan a visit',\n  introduction: 'Everyone is welcome.',\n  layout: 'narrow', spacing: 'loose',\n  background: { color: 'muted', size: 'standard' }\n}}>\n  <p>Bring comfortable shoes and a little curiosity.</p>\n  <a href=\"/directions/\">Find the garden</a>\n</Section>"
    }
  ];
</script>

<script lang="ts">
  import SectionCatalog from '#lib/SectionCatalog.svelte';
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage page={{ title: 'Section', pageTitle: 'Section · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Section',
      introduction: 'The base content region behind the ready-made section components.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <SectionCatalog heading />
  <Section
    section={{
      id: 'base-container',
      title: 'Write your content inside Section',
      headline: 'Write your content inside Section',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Section renders a semantic section element. Its section prop contains the shared metadata;
        its children are ordinary Svelte markup. Use it for a content structure that does not need a
        dedicated ready-made component.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'configuration',
      title: 'Configure the region',
      headline: 'Configure the region',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The required section prop is a <a href={base + '/docs/reference/types/#section-definition'}>
          SectionDefinition
        </a>. It requires id and title. Add headline for a visible heading, then optionally eyebrow
        and introduction for supporting text. The type reference lists every field, including
        layout, spacing, divider and the nested
        <a href={base + '/docs/reference/types/#section-background'}>SectionBackground</a> object.
      </p>
      <p>
        headingLevel controls document semantics; headingSize controls appearance. layout can be
        full, wide, narrow or inherit. spacing can be none, tight, normal, loose or spacious.
        Top-level sections default to normal spacing; nested sections default to none.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'component-props',
      title: 'Component-only props',
      headline: 'Component-only props',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <dl>
        <dt><code>stage</code></dt>
        <dd>
          Optional snippet outside the 1536px content wrapper. With layout full it supports a wide
          timeline stage while the heading remains constrained. Background selection is independent.
        </dd>
        <dt><code>children</code></dt>
        <dd>
          A Svelte snippet containing the content. A snippet is a reusable fragment of markup
          supplied by the caller.
        </dd>
        <dt><code>renderHeader</code></dt>
        <dd>
          Defaults to true. Set false only when your wrapper renders the heading itself; retain a
          matching accessible heading or label.
        </dd>
        <dt><code>inset</code></dt>
        <dd>
          Controls horizontal inner padding. It defaults to true for outer sections and false for
          nested sections.
        </dd>
        <dt><code>onDiagnostic</code></dt>
        <dd>
          Optional callback for background normalization diagnostics; see <a
            href={base + '/docs/reference/types/#section-background-diagnostic'}
          >
            SectionBackgroundDiagnostic
          </a>.
        </dd>
      </dl>
      <p>
        Standard HTML attributes, class and event callbacks are forwarded to the section element.
        Set its identity through section.id, not a separate id prop.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'composition',
      title: 'Compose with the page and its theme',
      headline: 'Compose with the page and its theme',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Inside ContentPage, sections register their labels and anchors and inherit heading context.
        They also participate in connected background surfaces. Read <a
          href={base + '/docs/design-system/backgrounds/'}
        >
          Backgrounds and groups
        </a>
        for surface behavior and
        <a href={base + '/docs/advanced/create-your-own-section/'}>Create your own section</a> to wrap
        the base component in a reusable design.
      </p>
    </div>
  </Section>
</WebsitePage>
