<script lang="ts">
  import { ContentPage, Sections, SectionSurfaceGroup } from '../packages/svelte/src/index.js';
  import { portfolio, legal } from '../apps/tests/src/lib/examples.js';
  let { kind = 'portfolio' }: { kind?: 'portfolio' | 'legal' | 'detail' } = $props();
  const page = $derived(kind === 'legal' ? legal : portfolio);
</script>
{#if kind === 'detail'}
  <SectionSurfaceGroup pageKind="detail"><Sections sections={[{ type: 'richText', id: 'detail', title: 'Detail', body: 'Detail', background: { color: 'standardToMuted', size: 'full' } }]} /></SectionSurfaceGroup>
{:else}
  <ContentPage {page} aria-labelledby={page.sections[0].id + '-title'}><Sections sections={page.sections} /></ContentPage>
{/if}
