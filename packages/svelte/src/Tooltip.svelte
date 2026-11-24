<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tooltip } from './tooltip.js';
  let { text, children }: { text: string; children: Snippet } = $props();
  let host: HTMLSpanElement;
  $effect(() => {
    const trigger = host.firstElementChild;
    if (!(trigger instanceof HTMLElement)) return;
    return tooltip(trigger, text).destroy;
  });
</script>

<!-- Supply one focusable trigger; its semantics and layout remain unchanged. -->
<span bind:this={host} style="display: contents">{@render children()}</span>
