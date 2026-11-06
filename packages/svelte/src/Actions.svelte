<script lang="ts">
  import { safeHref, type ContentAction } from '@page-sections/core';
  let { actions = [] }: { actions?: ContentAction[] } = $props();
</script>
{#if actions.length}<div class="ps-actions">
  {#each actions as action}<a href={safeHref(action.href)} data-action={action.variant ?? 'text'}>{action.label}<span aria-hidden="true"> &rarr;</span></a>{/each}
</div>{/if}
<style>
  .ps-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
  a { display: inline-block; font-weight: 600; text-underline-offset: .2em; }
  [data-action='primary'], [data-action='secondary'] { padding: .75rem 1.25rem; border: 1px solid var(--ps-accent); border-radius: var(--ps-radius); text-decoration: none; }
  [data-action='primary'] { background: var(--ps-accent); color: var(--ps-on-accent); }
  [data-action='secondary'] { background: var(--ps-section-standard); color: var(--ps-accent); }
  a:hover { filter: brightness(.9); }
</style>
