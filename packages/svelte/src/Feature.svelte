<script lang="ts" generics="T extends FeatureItem">
  import { getContext, type Snippet } from 'svelte';
  import { safeHref, type FeatureItem, type FeatureIconTone, type CardSize } from '@page-sections/core';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  import LucideIcon from './LucideIcon.svelte';
  let { item, iconTone, featureSize, icon }: { item: T; iconTone: FeatureIconTone; featureSize: CardSize; icon?: Snippet<[T]> } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
  const href = $derived(safeHref(item.href));
  const id = $props.id();
</script>
<svelte:element this={href ? 'a' : 'div'} {href} class="ps-feature" data-feature-size={featureSize} data-feature-id={item.itemKey ?? item.id} data-icon-tone={iconTone} aria-labelledby={href ? id : undefined} aria-describedby={href ? id + '-description' : undefined}>
  <span class="icon-circle" aria-hidden="true">
    {#if icon}{@render icon(item)}{:else}<LucideIcon name={item.icon} fallback="layers" />{/if}
  </span>
  <svelte:element this={`h${level}`} id={id} class="title">{item.title}</svelte:element>
  <p id={id + '-description'} class="description">{item.description}</p>
</svelte:element>
<style>
  .ps-feature { display: flex; flex-direction: column; align-items: center; height: 100%; min-width: 0; text-align: center; text-decoration: none; color: var(--ps-ink); border-radius: var(--ps-radius); }
  .icon-circle { display: flex; align-items: center; justify-content: center; flex: none; width: min(100%, var(--ps-feature-icon-size, 104px)); aspect-ratio: 1; border-radius: 50%; border: 1px solid transparent; background: var(--ps-section-muted); color: var(--ps-accent); transition: border-color 280ms cubic-bezier(.2,.4,.3,1), box-shadow 280ms cubic-bezier(.2,.4,.3,1); }
  [data-feature-size='s'] .icon-circle { --ps-feature-icon-size: 72px; }
  [data-feature-size='l'] .icon-circle { --ps-feature-icon-size: 144px; }
  [data-icon-tone='standard'] .icon-circle { background: var(--ps-section-standard); }
  [data-icon-tone='primary'] .icon-circle { background: var(--ps-accent); color: var(--ps-on-accent); }
  .icon-circle :global(svg) { width: 50%; height: 50%; }
  a .icon-circle { border-color: var(--ps-border); }
  a:focus-visible { outline: 3px solid var(--ps-accent); outline-offset: 4px; }
  a:focus-visible .icon-circle { border-color: var(--ps-accent); box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); }
  @media (hover: hover) { a:hover .icon-circle { border-color: var(--ps-accent); box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); } }
  .title { margin: 12px 0 0; font-size: var(--ps-card-title-size); line-height: var(--ps-card-line-height); font-weight: var(--ps-card-title-weight); color: inherit; overflow-wrap: anywhere; }
  .description { margin: .5em 0 0; font-size: min(var(--ps-card-title-size), var(--ps-grid-body-size)); line-height: 1.5; color: var(--ps-body); overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .icon-circle { transition: none; } }
</style>
