<script lang="ts" generics="T extends CardItem">
  import { getContext, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { safeHref, type CardItem, type CardSize, type SurfaceTone, type CardMediaAspect, type CardMediaFit, type CardContentPlacement, type CardTextTone, type HeadingLevel } from '@page-sections/core';
  import type { CardElements } from './card.js';
  import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
  import Image from './Image.svelte';
  import InlineText from './InlineText.svelte';
  import Actions from './Actions.svelte';
  let { item, cardSize = 'm', tone = 'standard', shadow = false, mediaAspect = '3/2', mediaFit = 'contain', mediaHoverZoom = true, contentPlacement = 'below', textTone = 'light', reserveEyebrow, textAlign = 'start', headingLevel, children, media, surface, onready, class: className = '', ...rest }: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    item: T; cardSize?: CardSize; tone?: SurfaceTone; shadow?: boolean; textAlign?: 'start' | 'center'; headingLevel?: HeadingLevel;
    mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; mediaHoverZoom?: boolean; contentPlacement?: CardContentPlacement; textTone?: CardTextTone; reserveEyebrow?: boolean;
    children?: Snippet<[T]>; media?: Snippet<[T]>; surface?: Snippet<[T]>; onready?: (parts: CardElements<T>) => void | (() => void);
  } = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const level = $derived(headingLevel ?? readContext?.().headingLevel ?? defaultSectionContext.headingLevel);
  const href = $derived(safeHref(item.href));
  const hasEyebrow = $derived(Boolean(item.eyebrow?.trim()) && cardSize !== 's');
  const showEyebrowRow = $derived(hasEyebrow || Boolean(reserveEyebrow && cardSize !== 's'));
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
<article {...rest} bind:this={root} aria-labelledby={titleId} class={['ps-card', className]} data-card-id={item.itemKey ?? item.id}
  data-ps-card-size={cardSize} data-tone={tone} data-shadow={shadow} data-media-fit={contentPlacement === 'overlay' ? 'cover' : mediaFit} data-media-hover-zoom={mediaHoverZoom} data-content-placement={contentPlacement} data-text-tone={textTone} style:text-align={textAlign} style:--ps-card-media-aspect={mediaAspect}>
  <div class="surface ps-shadow-surface" bind:this={surfaceElement} data-ps-card-part="surface" aria-hidden="true">{@render surface?.(item)}</div>
  <div class="media-frame" class:no-media={!media && !item.image} data-ps-card-part="media-frame">
    <div class="media-viewport">
    <div class="media" bind:this={mediaElement} data-ps-card-part="media">
      {#if media}{@render media(item)}{:else if item.image}<Image image={item.image} />{/if}
    </div>
    </div>
  </div>
  {#if contentPlacement === 'overlay' && href}<a class="media-link" {href} tabindex="-1" aria-hidden="true"></a>{/if}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Fixed-height overlay copy must remain keyboard-scrollable without JavaScript.) -->
  <div class="text" bind:this={copy} data-ps-card-part="copy" tabindex={contentPlacement === 'overlay' ? 0 : undefined} role={contentPlacement === 'overlay' ? 'region' : undefined} aria-labelledby={contentPlacement === 'overlay' ? titleId : undefined}>
    {#snippet mainCopy()}
      {#if showEyebrowRow}<p class="eyebrow" data-ps-card-part="eyebrow" aria-hidden={hasEyebrow ? undefined : true}>{hasEyebrow ? item.eyebrow : ''}</p>{/if}
      <svelte:element this={`h${level}`} bind:this={title} id={titleId} class="title" data-ps-card-part="title">
        {#if href && contentPlacement !== 'overlay'}<a class="primary-link" {href}><span class="title-label">{item.title}</span></a>{:else}<span class="title-label">{item.title}</span>{/if}
      </svelte:element>
      {#if item.description ?? item.subtitle}<p class="description">{item.description ?? item.subtitle}</p>{/if}
    {/snippet}
    {#if contentPlacement === 'overlay' && href}
      <a class="copy-link" {href} aria-labelledby={titleId}>{@render mainCopy()}</a>
    {:else}{@render mainCopy()}{/if}
    <div class="custom-content">{@render children?.(item)}</div>
    {#if item.footer}<p class="footer"><InlineText text={item.footer} /></p>{/if}
    <Actions actions={item.actions} />
  </div>
</article>
<style>
  .ps-card { position: relative; isolation: isolate; display: grid; grid-template-rows: auto 1fr; width: 100%; min-width: 0; height: 100%; color: var(--ps-ink); border-radius: var(--ps-radius); }
  .surface { position: absolute; inset: 0; z-index: -1; pointer-events: none; border: 1px solid var(--ps-border); border-radius: inherit; background: var(--ps-section-standard); transition: box-shadow 280ms cubic-bezier(.2,.4,.3,1), border-color 280ms cubic-bezier(.2,.4,.3,1); }
  /* Keep the outline above clipped media without clipping link focus rings or card shadows. */
  .ps-card::after { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none; border: 1px solid var(--ps-border); border-radius: inherit; transition: border-color 280ms cubic-bezier(.2,.4,.3,1); }
  [data-tone='muted'] .surface { background: var(--ps-section-muted); }
  [data-shadow='true'] .surface { box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); }
  .ps-card:has(:focus-visible) > .surface { border-color: var(--ps-accent); box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); }
  .ps-card:has(:focus-visible)::after { border-color: var(--ps-accent); }
  .ps-card[data-shadow='true']:has(:focus-visible) > .surface { box-shadow: var(--ps-card-hover-shadow, var(--ps-default-card-hover-shadow)); }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    .ps-card[data-media-hover-zoom='true']:has(a, button):hover .media { inset: 0; }
    .ps-card[data-media-hover-zoom='true'][data-media-fit='cover']:has(a, button):hover .media { transform: scale(1.06); }
  }
  @media (hover: hover) {
    .ps-card:hover > .surface { border-color: var(--ps-accent); box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); }
    .ps-card:hover::after { border-color: var(--ps-accent); }
    .ps-card[data-shadow='true']:hover > .surface { box-shadow: var(--ps-card-hover-shadow, var(--ps-default-card-hover-shadow)); }
  }
  .media, .text { min-width: 0; min-height: 0; }
  .media-frame { position: relative; width: 100%; aspect-ratio: var(--ps-card-media-aspect); align-self: start; border-radius: var(--ps-radius) var(--ps-radius) 0 0; }
  .media-viewport { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; isolation: isolate; }
  .media-frame.no-media { display: none; }
  .media { position: absolute; inset: min(var(--ps-card-media-inset), 33%); transition: inset 280ms cubic-bezier(.2,.4,.3,1), transform 280ms cubic-bezier(.2,.4,.3,1); }
  [data-media-fit='cover'] .media { inset: 0; }
  .media :global(picture), .media :global(img) { width: 100%; height: 100%; object-fit: contain; border-radius: 0; }
  [data-media-fit='cover'] .media :global(img) { object-fit: cover; }
  .text { grid-area: 2 / 1; display: flex; flex-direction: column; padding: var(--ps-card-text-inset-block) var(--ps-card-text-inset-inline); }
  .eyebrow { margin: 0; color: var(--ps-accent); font-size: var(--ps-card-eyebrow-size); font-weight: var(--ps-card-eyebrow-weight); line-height: var(--ps-card-line-height); flex: 0 0 var(--ps-card-line-height); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .title { margin: 0; color: var(--ps-ink); overflow-wrap: anywhere; font-size: var(--ps-card-title-size); font-weight: var(--ps-card-title-weight); line-height: var(--ps-card-line-height); height: calc(var(--ps-card-text-rows) * var(--ps-card-line-height)); flex-shrink: 0; }
  .title-label { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--ps-card-text-rows); line-clamp: var(--ps-card-text-rows); overflow: hidden; }
  .text:has(> .description) .title { height: auto; }
  .title .primary-link, .title .primary-link:hover { color: inherit; text-decoration: none; }
  /* Stretch the native title link over the card without nesting other interactive elements. */
  .primary-link::after { content: ''; position: absolute; inset: 0; z-index: 1; border-radius: var(--ps-radius); }
  .primary-link:focus-visible { outline: none; }
  .primary-link:focus-visible::after { outline: 3px solid var(--ps-accent); outline-offset: 4px; }
  .custom-content:empty { display: none; }
  .description, .footer { margin: 1rem 0 0; line-height: 1.75; color: var(--ps-body); }
  .description { margin-top: .5em; font-size: min(var(--ps-card-title-size), var(--ps-grid-body-size)); line-height: 1.5; overflow-wrap: anywhere; }
  .footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--ps-border); font-size: .875rem; }
  .text > :global(.ps-actions) { margin-top: auto; padding-top: 1rem; }
  .text :global(.ps-actions a), .footer :global(a), .custom-content :global(:is(a, button, input, select, textarea, summary, [tabindex])) { position: relative; z-index: 2; pointer-events: auto; }
  /* Overlay height follows the media ratio. Long copy stays reachable by scrolling. */
  [data-content-placement='overlay'] { grid-template-rows: minmax(0, 1fr); aspect-ratio: var(--ps-card-media-aspect); height: auto; --ps-card-overlay-ink: #fff; --ps-card-overlay-rgb: 0, 0, 0; }
  [data-content-placement='overlay'][data-text-tone='dark'] { --ps-card-overlay-ink: #111; --ps-card-overlay-rgb: 255, 255, 255; }
  [data-content-placement='overlay'] .media-frame { grid-area: 1 / 1; height: 100%; border-radius: inherit; }
  .media-link { position: absolute; inset: 0; z-index: 1; border-radius: inherit; }
  [data-content-placement='overlay'] .text { box-sizing: border-box; grid-area: 1 / 1; align-self: end; position: relative; z-index: 2; max-height: 100%; overflow: auto; overscroll-behavior: contain; border-radius: inherit; padding-top: 24px; color: var(--ps-card-overlay-ink); background: linear-gradient(to top, rgba(var(--ps-card-overlay-rgb), .6), rgba(var(--ps-card-overlay-rgb), 0)); }
  /* Let gradient padding reach the native image link; copy and actions remain selectable. */
  [data-content-placement='overlay'] .text:has(> .copy-link) { pointer-events: none; }
  [data-content-placement='overlay'] .text > * { pointer-events: auto; flex-shrink: 0; }
  .copy-link, .copy-link:hover { display: block; color: inherit; text-decoration: none; }
  .copy-link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  [data-content-placement='overlay'] :is(.title, .eyebrow, .description, .footer) { color: inherit; }
  [data-content-placement='overlay'] .title { height: auto; }
  [data-content-placement='overlay'] .title-label { display: block; overflow: visible; }
  [data-content-placement='overlay'] .primary-link::after { display: none; }
  [data-content-placement='overlay'] .primary-link:focus-visible, [data-content-placement='overlay'] .text:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
  [data-content-placement='overlay'] .text :global(a[data-action='text']), [data-content-placement='overlay'] .footer :global(a) { color: inherit; }
  [data-content-placement='overlay'] .footer { border-color: currentColor; }
  @media (prefers-reduced-motion: reduce) { .surface, .media, .ps-card::after { transition: none; } }
</style>
