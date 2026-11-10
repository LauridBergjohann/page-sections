<script lang="ts">
  import { onMount } from 'svelte';
  import { ContentGrid, ContentBlock } from '@page-sections/svelte';
  import LiveCode from './LiveCode.svelte';
  let narrow = $state(false);
  let reverse = $state(false);
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const first = $derived(reverse ? { xs: 4, s: 3, m: 3, l: 4 } : { xs: 4, s: 3, m: 5, l: 8 });
  const second = $derived(reverse ? { xs: 4, s: 3, m: 5, l: 8 } : { xs: 4, s: 3, m: 3, l: 4 });
  const source = $derived(
    `<script>\n  import { ContentGrid, ContentBlock } from '@page-sections/svelte';\n<\/script>\n\n<div style="max-width: ${narrow ? '590px' : '100%'}">\n  <ContentGrid>\n    <ContentBlock span={${JSON.stringify(first)}}>Main story</ContentBlock>\n    <ContentBlock span={${JSON.stringify(second)}}>Related thought</ContentBlock>\n  </ContentGrid>\n</div>`
  );
</script>

<div class="playground">
  <div class="playground-controls">
    <label
      >Container<select bind:value={narrow} disabled={!ready}
        ><option value={false}>Available width</option><option value={true}>590px maximum</option
        ></select
      ></label
    >
    <label
      >Emphasis<select bind:value={reverse} disabled={!ready}
        ><option value={false}>First block</option><option value={true}>Second block</option
        ></select
      ></label
    >
  </div>
  <div style:max-width={narrow ? '590px' : '100%'} class="grid-preview">
    <ContentGrid
      ><ContentBlock span={first}><div class="sample">Main story</div></ContentBlock><ContentBlock
        span={second}><div class="sample">Related thought</div></ContentBlock
      ></ContentGrid
    >
  </div>
</div>
<LiveCode code={source} />

<style>
  .grid-preview {
    margin: 1rem auto;
  }
  .sample {
    padding: 2rem 1rem;
    border: 1px dashed var(--ps-accent);
    border-radius: 0.5rem;
    background: var(--ps-section-muted);
  }
</style>
