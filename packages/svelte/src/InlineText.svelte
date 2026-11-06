<script lang="ts">
  import { safeHref, type InlineText } from '@page-sections/core';
  let { text }: { text: InlineText } = $props();
</script>
{#if typeof text === 'string'}{text}{:else}
  {#each text as run}
    {#if run.type === 'link'}<a href={safeHref(run.href)}>{run.text}</a>
    {:else if run.type === 'strong'}<strong>{run.text}</strong>
    {:else if run.type === 'emphasis'}<em>{run.text}</em>
    {:else if run.type === 'code'}<code>{run.text}</code>
    {:else if run.type === 'break'}<br />
    {:else}{run.text}{/if}
  {/each}
{/if}
