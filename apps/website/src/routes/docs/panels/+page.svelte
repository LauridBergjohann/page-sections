<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { PanelSection } from '@page-sections/svelte';
<\/script>

<PanelSection
  section={{
    id: 'profile',
    title: 'Profile',
    headline: 'At a glance',
    tone: 'muted',
    blocks: [{ type: 'paragraph', text: 'Design and development in Germany.' }],
    actions: [
      { label: 'Contact', href: 'mailto:hello@example.com', variant: 'primary' }
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

<ContentPage page={{ title: 'Panels', pageTitle: 'Panels · Page Sections' }} showContentMenu>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>﻿# PanelSection</p>
      <p>
        Panels group short facts, notes, contact information or a call to action. Use them directly,
        in a data-driven grid or as nested rich-text blocks.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'panelsection-props',
      title: 'PanelSection props',
      headline: 'PanelSection props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Required section: Omit&lt;PanelSectionData, 'type'&gt;. Shared SectionDefinition fields
        apply; additional fields are blocks: RichTextBlock[] (required), tone: standard/muted
        (default muted), actions: ContentAction[] (optional). The data discriminator is panel. The
        section headline is rendered once inside the panel and labels the section. Nested
        panels/text follow the inherited heading hierarchy.
      </p>
      <p>
        <code>tone</code> selects the panel surface independently of <code>background.color</code>,
        which paints the surrounding section. <code>standard</code> uses
        <code>--ps-section-standard</code>; <code>muted</code> uses <code>--ps-section-muted</code>.
        Both follow the active theme. For example, a standard section with a muted panel provides a
        distinct inset surface. This API already exists in 0.2.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'contentpanel-props',
      title: 'ContentPanel props',
      headline: 'ContentPanel props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        ContentPanel is the lower-level wrapper without a section or registry entry. Optional props:
        title, titleId, headingLevel (inherited; standalone h2), tone (muted), actions and children:
        Snippet. Its title increments the level inherited by nested panels. Padding follows the
        active grid gap; radius, colors and borders follow the theme.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'actions-props',
      title: 'Actions props',
      headline: 'Actions props',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Actions accepts optional actions: ContentAction[]. An empty/omitted list renders nothing.
        Each action has label, href and optional variant: primary/secondary/text (default text).
        Primary uses accent and onAccent; secondary uses the standard surface. URLs pass through
        safeHref. Actions are ordinary anchors, available in SSR, and introduce no router or
        icon-library dependency.
      </p>
      <p>
        Related: <a href={base + '/docs/rich-text/'}>Structured text</a>,
        <a href={base + '/docs/themes/'}>Themes</a>,
        <a href={base + '/docs/data-and-custom-sections/'}>Data models</a>.
      </p>
    </div></Section
  >
</ContentPage>
