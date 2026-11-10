<script lang="ts">
  import DocsFrame from '$lib/DocsFrame.svelte';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<DocsFrame>{@render children()}</DocsFrame>
