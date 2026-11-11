<script lang="ts">
  import { PageShell } from '@page-sections/svelte';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<PageShell>{@render children()}</PageShell>

<style>
  :global(body) {
    margin: 0;
  }
</style>
