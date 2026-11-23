<script lang="ts">
  import PrimaryButton from './PrimaryButton.svelte';
  import SecondaryButton from './SecondaryButton.svelte';
  import { safeHref, type ContentAction } from '@page-sections/core';
  let { actions = [] }: { actions?: ContentAction[] } = $props();
</script>
{#if actions.length}<div class="ps-actions">
  {#each actions as action}
    {#if action.variant === 'primary'}<PrimaryButton href={action.href} data-action="primary">{action.label}<span aria-hidden="true"> &rarr;</span></PrimaryButton>
    {:else if action.variant === 'secondary'}<SecondaryButton href={action.href} data-action="secondary">{action.label}<span aria-hidden="true"> &rarr;</span></SecondaryButton>
    {:else}<a href={safeHref(action.href)} data-action="text">{action.label}<span aria-hidden="true"> &rarr;</span></a>{/if}
  {/each}
</div>{/if}
<style>
  .ps-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
  a { display: inline-block; font-weight: 600; text-underline-offset: .2em; }
  a:hover { filter: brightness(.9); }
</style>
