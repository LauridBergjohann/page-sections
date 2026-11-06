<script lang="ts" generics="T extends CardItem">
  import { getContext, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { safeHref, type CardItem, type CardSize, type CardVariant, type HeadingLevel } from '@page-sections/core';
  import type { CardElements } from './card.js';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  import Image from './Image.svelte';
  import InlineText from './InlineText.svelte';
  import Actions from './Actions.svelte';
  let { item, cardSize = 'm', variant = 'catalog', textAlign = 'start', headingLevel, children, media, surface, onready, class: className = '', ...rest }: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    item: T; cardSize?: CardSize; variant?: CardVariant; textAlign?: 'start' | 'center'; headingLevel?: HeadingLevel;
    children?: Snippet<[T]>; media?: Snippet<[T]>; surface?: Snippet<[T]>; onready?: (parts: CardElements<T>) => void | (() => void);
  } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
  const href = $derived(safeHref(item.href));
  const wholeLink = $derived(variant === 'catalog' && Boolean(href));
  const hasEyebrow = $derived(Boolean(item.eyebrow?.trim()) && (variant !== 'catalog' || cardSize !== 's'));
  const titleId = $props.id();
  let root = $state<HTMLElement>();
  let surfaceElement = $state<HTMLDivElement>();
  let mediaElement = $state<HTMLDivElement>();
  let copy = $state<HTMLDivElement>();
  let title = $state<HTMLElement>();
  $effect(() => {
    const callback = onready;
    if (root && surfaceElement && mediaElement && copy && title) {
      const parts = { item, root, surface: surfaceElement, media: mediaElement, copy, title };
      return untrack(() => callback?.(parts));
    }
  });
</script>
<svelte:element this={wholeLink ? 'a' : 'article'} {...rest} bind:this={root} href={wholeLink ? href : undefined}
  aria-labelledby={wholeLink ? titleId : undefined} class={['ps-card', className]} data-card-id={item.itemKey ?? item.id}
  data-ps-card-size={cardSize} data-card-variant={variant} style:text-align={textAlign} style:--ps-card-eyebrow-rows={hasEyebrow ? 1 : 0}>
  <div class="surface" bind:this={surfaceElement} data-ps-card-part="surface" aria-hidden="true">{@render surface?.(item)}</div>
  <div class="media" bind:this={mediaElement} data-ps-card-part="media">
    {#if media}{@render media(item)}{:else if item.image}<Image image={item.image} />{/if}
  </div>
  <div class="text" bind:this={copy} data-ps-card-part="copy">
    {#if hasEyebrow}<p class="eyebrow" data-ps-card-part="eyebrow">{item.eyebrow}</p>{/if}
    <svelte:element this={`h${level}`} bind:this={title} id={titleId} class="title" data-ps-card-part="title" title={item.title}>
      {#if href && !wholeLink}<a {href}>{item.title}</a>{:else}{item.title}{/if}
    </svelte:element>
    {#if variant === 'editorial'}
      {#if item.description ?? item.subtitle}<p class="description">{item.description ?? item.subtitle}</p>{/if}
      {@render children?.(item)}
      {#if item.footer}<p class="footer"><InlineText text={item.footer} /></p>{/if}
      <Actions actions={item.actions} />
    {/if}
  </div>
</svelte:element>
<style>
  .ps-card { position: relative; isolation: isolate; display: grid; width: 100%; min-width: 0; height: 100%; color: var(--ps-ink); text-decoration: none; border-radius: var(--ps-radius); }
  .surface { position: absolute; inset: 0; z-index: -1; pointer-events: none; border: 1px solid var(--ps-border); border-radius: inherit; background: var(--ps-section-standard); }
  .media, .text { min-width: 0; min-height: 0; }
  .title { margin: 0; overflow-wrap: anywhere; }
  .eyebrow { margin: 0; color: var(--ps-accent); }
  [data-card-variant='catalog'] { aspect-ratio: 1; grid-template-rows: minmax(0, 1fr) min(100%, max(25%, calc(var(--ps-card-text-rows) * var(--ps-card-line-height) + 2 * var(--ps-card-text-inset-block)))); }
  [data-card-variant='catalog'] .media { grid-area: 1 / 1; height: 100%; width: auto; max-width: 100%; aspect-ratio: 4 / 3; place-self: center; }
  [data-card-variant='catalog'] .media :global(picture), [data-card-variant='catalog'] .media :global(img) { width: 100%; height: 100%; object-fit: contain; border-radius: 0; }
  [data-card-variant='catalog'] .text { grid-area: 2 / 1; display: flex; flex-direction: column; justify-content: center; padding: var(--ps-card-text-inset-block) var(--ps-card-text-inset-inline); }
  [data-card-variant='catalog'] .eyebrow { font-size: var(--ps-card-eyebrow-size); font-weight: var(--ps-card-eyebrow-weight); line-height: var(--ps-card-line-height); flex: 0 0 var(--ps-card-line-height); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  [data-card-variant='catalog'] .title { font-size: var(--ps-card-title-size); font-weight: var(--ps-card-title-weight); line-height: var(--ps-card-line-height); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: calc(var(--ps-card-text-rows) - var(--ps-card-eyebrow-rows)); line-clamp: calc(var(--ps-card-text-rows) - var(--ps-card-eyebrow-rows)); max-height: calc((var(--ps-card-text-rows) - var(--ps-card-eyebrow-rows)) * var(--ps-card-line-height)); overflow: hidden; flex-shrink: 0; }
  [data-card-variant='editorial'] { grid-template-rows: auto 1fr; }
  [data-card-variant='editorial'] .media:empty { display: none; }
  [data-card-variant='editorial'] .text { grid-row: 2; display: flex; flex-direction: column; gap: 1rem; padding: var(--ps-grid-gap, 16px); }
  [data-card-variant='editorial'] .title { font-size: 1.25rem; line-height: 1.35; }
  [data-card-variant='editorial'] p { margin: 0; line-height: 1.75; }
  [data-card-variant='editorial'] .eyebrow { font-size: .75rem; letter-spacing: .08em; }
  [data-card-variant='editorial'] .description { color: var(--ps-body); }
  [data-card-variant='editorial'] .text > :global(.ps-actions) { margin-top: auto; }
  [data-card-variant='editorial'] .footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--ps-border); color: var(--ps-body); font-size: .875rem; }
  .ps-card:focus-visible { outline: 3px solid var(--ps-accent); outline-offset: 4px; }
</style>
