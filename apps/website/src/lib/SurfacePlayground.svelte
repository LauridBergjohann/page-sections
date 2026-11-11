<script lang="ts">
  import { onMount } from 'svelte';
  import { Section, SectionSurfaceGroup, type SectionBackgroundColor } from '@page-sections/svelte';
  import LiveCode from './LiveCode.svelte';
  let color = $state<SectionBackgroundColor>('standardToMuted');
  let size = $state<'standard' | 'full'>('standard');
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const source = $derived(
    `<script>\n  import { Section, SectionSurfaceGroup } from '@page-sections/svelte';\n<\/script>\n\n<SectionSurfaceGroup>\n  <Section section={{ id: 'first', title: 'First', background: { color: '${color}', size: '${size}' } }}>\n    <p>A surface with room for your content.</p>\n  </Section>\n  <Section section={{ id: 'second', title: 'Second', background: { color: 'muted', size: '${size}' } }}>\n    <p>A neighbouring surface.</p>\n  </Section>\n</SectionSurfaceGroup>`
  );
</script>

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
</div>
<div class="surface-preview">
  <SectionSurfaceGroup>
    <Section
      section={{
        id: 'surface-first',
        title: 'First',
        background: { color, size },
        spacing: 'loose'
      }}><p>A surface with room for your content.</p></Section
    >
    <Section
      section={{
        id: 'surface-second',
        title: 'Second',
        background: { color: 'muted', size },
        spacing: 'loose'
      }}><p>A neighbouring surface. Matching edges join automatically.</p></Section
    >
  </SectionSurfaceGroup>
</div>
<LiveCode code={source} />

<style>
  .surface-preview {
    margin-block: 1.5rem;
    isolation: isolate;
    overflow: clip;
  }
</style>
