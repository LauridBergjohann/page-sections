<script lang="ts">
  import type { HeadingLevel, HeadingSize } from '@page-sections/core';
  import './styles.css';
  let {
    text,
    level = 2,
    size = 'm',
    id,
    eyebrow,
    introduction
  }: {
    text?: string;
    level?: HeadingLevel;
    size?: HeadingSize;
    id?: string;
    eyebrow?: string;
    introduction?: string;
  } = $props();
</script>

<div class="ps-heading" data-size={size}>
  {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
  {#if text}<svelte:element this={`h${level}`} {id} class="headline">{text}</svelte:element>{/if}
  {#if introduction}<p class="introduction">{introduction}</p>{/if}
</div>

<style>
  .headline {
    margin: 0;
    font-weight: 650;
    line-height: 1.25;
    overflow-wrap: anywhere;
    font-size: clamp(1.125rem, 2.5cqw, 1.5rem);
  }
  [data-size='l'] .headline {
    font-size: clamp(1.5rem, 3cqw, 2rem);
    letter-spacing: -0.02em;
  }
  [data-size='xl'] .headline {
    font-size: clamp(2rem, 4cqw, 2.75rem);
    line-height: 1.15;
    letter-spacing: -0.03em;
  }
  .eyebrow {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.5;
    color: var(--ps-accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .introduction {
    margin: 0.75rem 0 0;
    max-width: 64ch;
    color: var(--ps-body);
    line-height: 1.65;
  }
</style>
