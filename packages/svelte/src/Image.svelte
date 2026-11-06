<script lang="ts">
  import type { ImageData } from '@page-sections/core';
  import { getContext } from 'svelte';
  import { THEME_MODE, type ReadThemeMode } from './themeContext.js';
  let { image, eager = false }: { image: ImageData; eager?: boolean } = $props();
  const ratio = $derived(image.aspect === 'square' ? '1' : image.aspect === 'none' ? undefined : image.aspect?.replace('/', ' / '));
  const readMode = getContext<ReadThemeMode | undefined>(THEME_MODE);
  const mode = $derived(readMode?.());
</script>
<picture style:--image-ratio={ratio} style:--image-fit={image.objectFit ?? 'cover'}>
  {#if image.srcDark}<source media={mode === 'dark' ? 'all' : mode === 'light' ? 'not all' : '(prefers-color-scheme: dark)'} srcset={image.srcDark} />{/if}
  <img src={image.src} srcset={image.srcset} sizes={image.sizes} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
</picture>
<style>picture { display: block; width: 100%; } img { display: block; width: 100%; height: auto; aspect-ratio: var(--image-ratio, auto); object-fit: var(--image-fit); border-radius: var(--ps-radius); }</style>
