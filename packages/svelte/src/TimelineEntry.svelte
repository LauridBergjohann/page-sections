<script lang="ts">
  import type { TimelineEvent } from '@page-sections/core';
  import type { Snippet } from 'svelte';
  import LucideIcon from './LucideIcon.svelte';
  import Popup from './Popup.svelte';
  import Image from './Image.svelte';
  import Actions from './Actions.svelte';
  import RichTextContent from './RichTextContent.svelte';
  import { eventDateLabel } from './timeline.js';
  let { event, eventIcon, group, enhanced, active, onactivate, onclose, onlabelsize, top, height, markerLeft, markerWidth, labelTop, labelLeft, labelWidth, labelsVisible, locale, presentLabel }:
    { event: TimelineEvent; eventIcon?: Snippet<[TimelineEvent]>; group: string; enhanced: boolean; active: boolean; onactivate: () => void; onclose: () => void;
      onlabelsize: (height: number) => void; top: number; height: number; markerLeft: number; markerWidth: number; labelTop: number; labelLeft: number; labelWidth: number; labelsVisible: boolean; locale?: string; presentLabel?: string } = $props();
  let details: HTMLDetailsElement;
  let summary: HTMLElement;
  let anchor = $state<HTMLElement>();
  let anchorPoint = $state<{ x: number; y: number }>();
  const date = $derived(eventDateLabel(event, locale, presentLabel));
  function measure(node: HTMLElement) {
    const observer = new ResizeObserver(() => { if (enhanced && labelsVisible) onlabelsize(Math.ceil(node.getBoundingClientRect().height) + 12); });
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<details bind:this={details} name={group} open={enhanced ? active : undefined} class="entry"
  data-event={event.id} data-type={event.type} style:--event-top={`${top}px`} style:--event-height={`${height}px`}
  data-labels={labelsVisible} style:--marker-left={`${markerLeft}px`} style:--marker-width={`${markerWidth}px`}
  style:--label-left={`${labelLeft}px`} style:--label-top={`${labelTop}px`} style:--label-width={`${labelWidth}px`}
  ontoggle={() => { if (enhanced && !details.open && active) onclose(); }}>
  <summary bind:this={summary} aria-label={`${event.title}, ${date}`}
    onfocus={() => { if (enhanced && summary.matches(':focus-visible')) summary.querySelector(labelsVisible ? '.label' : '.marker')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }} onclick={(e) => {
    if (!enhanced) return;
    e.preventDefault();
    anchor = (e.target as HTMLElement).closest<HTMLElement>('.marker, .label') ?? summary.querySelector<HTMLElement>(labelsVisible ? '.label' : '.marker') ?? summary;
    anchorPoint = anchor.classList.contains('marker') && e.detail > 0 ? { x: e.clientX, y: e.clientY } : undefined;
    onactivate();
  }}>
    <span class="marker" aria-hidden="true"></span>
    {#if enhanced && labelsVisible}<svg class="connector" aria-hidden="true"><path d={`M${markerLeft + markerWidth} ${top + (event.type === 'point' ? 0 : 12)} H${labelLeft - 6} V${labelTop + 12} H${labelLeft}`} /></svg>{/if}
    <span class="label" use:measure><span class="label-heading">{#if event.icon}<span class="event-icon" aria-hidden="true">{#if eventIcon}{@render eventIcon(event)}{:else}<LucideIcon name={event.icon} size={16} />{/if}</span>{/if}<strong>{event.title}</strong></span><span class="date">{date}</span></span>
  </summary>
  <Popup title={event.title} disclosure inline={!enhanced} closable closeLabel="Close details" placement="side" {anchor} {anchorPoint} onclose={() => onclose()}>
    <p class="detail-date">{date}</p>
    {#if event.image}<div class="media"><Image image={{ ...event.image, aspect: event.image.aspect ?? '16/9' }} /></div>{/if}
    {#if event.description}<RichTextContent content={typeof event.description === 'string' ? { body: event.description, format: 'text' } : event.description} />{/if}
    {#if event.tags?.length}<ul class="tags" aria-label="Tags">{#each event.tags as tag}<li>{tag}</li>{/each}</ul>{/if}
    {#if event.action}<Actions actions={[event.action]} />{/if}
  </Popup>
</details>

<style>
  .entry { margin-block: .75rem; }
  summary { cursor: pointer; }
  .label strong, .date { display: block; }
  .label-heading { display: flex; align-items: flex-start; gap: .4rem; }
  .label-heading strong { min-width: 0; }
  .event-icon { display: inline-flex; flex-shrink: 0; margin-top: .05rem; }
  .date, .detail-date { color: var(--ps-body); font-size: .8rem; }
  .detail-date { margin: -.25rem 0 .75rem; }
  .media { margin-block: .75rem; max-height: 180px; overflow: hidden; border-radius: var(--ps-radius); }
  .media :global(img) { max-height: 180px; }
  .tags { display: flex; gap: .4rem; flex-wrap: wrap; padding: 0; margin: .75rem 0; list-style: none; }
  .tags li { padding: .15rem .6rem; border-radius: 999px; background: color-mix(in srgb, var(--timeline-color) 14%, var(--ps-section-standard)); color: var(--ps-ink); font-size: .75rem; }
  summary:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 3px; }
  .entry :global(.ps-popup:not(.ps-popup-inline)) { width: min(320px, calc(100vw - 24px)); }
  :global(.ps-timeline[data-enhanced='true']) .entry { position: absolute; inset: 0; margin: 0; pointer-events: none; }
  :global(.ps-timeline[data-enhanced='true']) summary { display: block; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  :global(.ps-timeline[data-enhanced='true']) .marker,
  :global(.ps-timeline[data-enhanced='true']) .label { position: absolute; top: var(--event-top); pointer-events: auto; }
  :global(.ps-timeline[data-enhanced='true']) .marker { left: var(--marker-left); width: var(--marker-width); height: var(--event-height); border-radius: 999px; box-sizing: border-box; }
  :global(.ps-timeline[data-enhanced='true']) .marker { z-index: 1; border: 1px solid color-mix(in srgb, var(--timeline-color) 80%, var(--ps-ink)); background: color-mix(in srgb, var(--timeline-color) 65%, var(--ps-section-standard)); transition: background-color 300ms cubic-bezier(.2,.4,.3,1), border-color 300ms cubic-bezier(.2,.4,.3,1); }
  :global(.ps-timeline[data-enhanced='true']) [data-type='point'] .marker { height: var(--marker-width); transform: translateY(-50%); }
  :global(.ps-timeline[data-enhanced='true']) [data-type='point'] .marker { background: var(--timeline-color); }
  :global(.ps-timeline[data-enhanced='true']) [data-labels='false'] .marker { border-width: min(1px, calc(var(--marker-width) * .1)); }
  :global(.ps-timeline[data-enhanced='true']) .label { z-index: 2; top: var(--label-top); left: var(--label-left); width: var(--label-width); box-sizing: border-box; padding: .4rem .65rem; border: 1px solid var(--ps-border); border-radius: .65rem; background: color-mix(in srgb, var(--ps-section-standard) 94%, var(--timeline-color)); font-size: .875rem; line-height: 1.25; }
  :global(.ps-timeline[data-enhanced='true']) [data-labels='false'] .label { display: none; }
  :global(.ps-timeline[data-enhanced='true']) .label strong { overflow-wrap: anywhere; }
  :global(.ps-timeline[data-enhanced='true']) .date { margin-top: .2rem; overflow-wrap: anywhere; }
  .connector { position: absolute; inset: 0; width: 100%; height: 100%; fill: none; stroke: color-mix(in srgb, var(--timeline-color) 55%, var(--ps-border)); stroke-width: 1; }
  :global(.ps-timeline[data-enhanced='true']) summary:is(:hover, :focus-visible) .label,
  :global(.ps-timeline[data-enhanced='true']) details[open] .label { border-color: var(--timeline-color); box-shadow: 0 2px 8px color-mix(in srgb, var(--ps-ink) 10%, transparent); }
  :global(.ps-timeline[data-enhanced='true']) summary:is(:hover, :focus-visible) .marker,
  :global(.ps-timeline[data-enhanced='true']) details[open] .marker { background: color-mix(in srgb, var(--timeline-color) 85%, var(--ps-ink)); border-color: color-mix(in srgb, var(--timeline-color) 55%, var(--ps-ink)); }
  :global(.ps-timeline[data-enhanced='true']) summary:focus-visible { outline: 0; }
  :global(.ps-timeline[data-enhanced='true']) summary:focus-visible :is(.label, .marker) { outline: 2px solid var(--ps-accent); outline-offset: 2px; }
  :global(.ps-timeline[data-enhanced='true']) .entry :global(.ps-popup) { pointer-events: auto; }
  :global(.ps-timeline[data-enhanced='true']) .marker { scroll-margin-block: calc(var(--ps-timeline-sticky-offset, 0px) + 5rem) 2rem; }
  :global(.ps-timeline[data-enhanced='true']) .label { scroll-margin-block: calc(var(--ps-timeline-sticky-offset, 0px) + 5rem) 2rem; }
  @media (pointer: coarse) { :global(.ps-timeline[data-enhanced='true']) .marker::after { content: ''; position: absolute; inset: -8px -3px; } }
  @media (prefers-reduced-motion: reduce) { :global(.ps-timeline[data-enhanced='true']) .marker { transition: none; } }
</style>
