<script lang="ts">
  import { onMount } from 'svelte';
  import { Section, type SectionBackgroundColor } from '@page-sections/svelte';
  import { normalizeSectionBackground } from '@page-sections/core';
  import LiveCode from './LiveCode.svelte';
  let color = $state<SectionBackgroundColor>('transparentToStandard');
  let size = $state<'standard' | 'full'>('full');
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const normalized = $derived(normalizeSectionBackground({ color, size }));
  const source = $derived(
    `<script>\n  import { ContentPage, Section } from '@page-sections/svelte';\n<\/script>\n\n<ContentPage page={{ title: 'Surfaces' }}>\n  <Section section={{ id: 'first', title: 'First', headline: 'Your selected background', background: { color: '${color}', size: '${size}' }, spacing: 'loose' }}>\n    <p>The content column keeps its width while the background changes.</p>\n  </Section>\n  <Section section={{ id: 'second', title: 'Second', headline: 'A neighbouring surface', background: { color: 'muted', size: '${size}' }, spacing: 'loose' }}>\n    <p>Compare the edge, color transition and shared corners.</p>\n  </Section>\n</ContentPage>`
  );
</script>

<Section
  section={{
    id: 'surface-controls',
    title: 'Background controls',
    background: { color: 'standard' }
  }}
>
  <div class="playground-controls">
    <label
      >Background<select bind:value={color} disabled={!ready}
        >{#each ['transparent', 'standard', 'muted', 'standardToMuted', 'mutedToStandard', 'transparentToStandard', 'standardToTransparent', 'transparentToMuted', 'mutedToTransparent'] as value}<option
            >{value}</option
          >{/each}</select
      ></label
    >
    <label
      >Background size<select bind:value={size} disabled={!ready}
        ><option>standard</option><option>full</option></select
      ></label
    >
    <button
      type="button"
      disabled={!ready}
      onclick={() => {
        color = 'transparentToStandard';
        size = 'full';
      }}>Reset</button
    >
  </div>
  <p>
    The next two sections are part of this page. Select full to paint across the viewport, including
    behind the sidebars. Change the website's color mode to compare theme colors.
  </p>
  <p class="status" role="status">
    {#if normalized.diagnostic}Gradients require full size. At standard size, this selection uses
      the end color: {normalized.color}. Choose full to see the gradient.{:else}Now showing {color} at
      {size} size.{/if}
  </p>
</Section>
<Section
  section={{
    id: 'surface-first',
    title: 'First',
    headline: 'Your selected background',
    background: { color, size },
    spacing: 'loose'
  }}
>
  <div class="content-guide">
    <p>The content column keeps its width while the background changes.</p>
    <span>Content edge</span>
  </div>
</Section>
<Section
  section={{
    id: 'surface-second',
    title: 'Second',
    headline: 'A neighbouring surface',
    background: { color: 'muted', size },
    spacing: 'loose'
  }}
>
  <div class="content-guide">
    <p>Compare the edge, color transition and shared corners.</p>
    <span>Content edge</span>
  </div>
</Section>
<Section section={{ id: 'surface-source', title: 'Live source', background: { color: 'standard' } }}
  ><LiveCode code={source} /></Section
>

<style>
  p {
    line-height: 1.7;
  }
  .status {
    color: var(--ps-body);
  }
  .content-guide {
    border-inline: 1px dashed var(--ps-accent);
    padding: 24px;
    min-height: 140px;
  }
  .content-guide span {
    font-size: 12px;
    color: var(--ps-body);
  }
</style>
