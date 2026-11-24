<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { Chip } from '@page-sections/svelte/atoms';
  import Plus from '@lucide/svelte/icons/plus';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  let selected = $state(false);
<\/script>

<Chip label="Work" {selected} color="#168d91" onclick={() => selected = !selected}>
  {#snippet icon()}{#if selected}<Briefcase size={20} />{:else}<Plus size={20} />{/if}{/snippet}
</Chip>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, Chip, CodeBlock } from '@page-sections/svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import Check from '@lucide/svelte/icons/check';
  import WebsitePage from '#lib/WebsitePage.svelte';
  let selected = $state(false);
</script>

<WebsitePage page={{ title: 'Chip', pageTitle: 'Chip ? Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'heading',
      title: 'Chip',
      headingLevel: 1,
      introduction: 'A compact, reusable selection control with a stable label and optional icons.',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'example',
      title: 'Try it',
      headline: 'Try it',
      background: { color: 'standard' }
    }}
  >
    <div class="examples">
      <Chip label="Work" {selected} color="#168d91" onclick={() => (selected = !selected)}>
        {#snippet icon()}{#if selected}<Briefcase size={20} />{:else}<Plus
              size={20}
            />{/if}{/snippet}
      </Chip>
      <Chip label="Education" selected color="#169b63">
        {#snippet icon()}<Check size={20} />{/snippet}
      </Chip>
      <Chip label="Unavailable" disabled />
    </div>
    <p>
      Toggle Work with the pointer, Enter or Space. Selected and unselected chips retain the same
      height, icon box, padding and gap. Inactive labels use a lighter font weight.
    </p>
    <CodeBlock {...examples[0]} />
  </Section>
  <Section
    section={{
      id: 'usage',
      title: 'API and atomic design',
      headline: 'API and atomic design',
      background: { color: 'standard' }
    }}
  >
    <p>
      Chip is an atom: one native button for a filter or selection. Import it from the package root
      or <code>@page-sections/svelte/atoms</code>. TimelineSection composes these same chips for
      category filters.
    </p>
    <ul>
      <li>
        <code>label: string</code> is required and remains visible. Long labels truncate within constrained
        containers; the accessible name retains the complete label.
      </li>
      <li>
        <code>selected: boolean</code> defaults to false and controls <code>aria-pressed</code>. The
        parent updates the value through <code>onclick</code>.
      </li>
      <li>
        <code>color?: string</code> supplies a CSS accent color; the default is the shared theme accent.
      </li>
      <li>
        <code>icon</code> and <code>trailingIcon</code> are optional decorative snippets. Use 20px Lucide
        icons; the library adds no icon dependency.
      </li>
      <li>
        Native button attributes and callbacks, including <code>disabled</code>, <code>class</code>
        and <code>style</code>, are forwarded. The button defaults to <code>type="button"</code>.
      </li>
      <li>
        <code>title</code> provides an optional themed tooltip. Keep essential information in the visible
        label.
      </li>
    </ul>
    <p>
      Chips are 44px tall with 12px horizontal padding and an 8px icon-to-label gap at the default
      font size. Focus, disabled states, dark mode and reduced motion follow the shared theme.
    </p>
  </Section>
</WebsitePage>

<style>
  .examples {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
</style>
