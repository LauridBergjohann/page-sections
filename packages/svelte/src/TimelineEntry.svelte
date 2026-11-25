<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TimelineEvent } from '@page-sections/core';
  import LucideIcon from './LucideIcon.svelte';
  import TimelineDetails from './TimelineDetails.svelte';
  import { eventDateLabel, eventLabel, timelineIcon, visibleLabel, type PlacedItem } from './timeline.js';
  import { tooltip } from './tooltip.js';
  let { item, enhanced, scroll = 0, viewport = 0, eventIcon, locale, presentLabel, onactivate }:
    { item: PlacedItem; enhanced: boolean; scroll?: number; viewport?: number; eventIcon?: Snippet<[TimelineEvent]>; locale?: string; presentLabel?: string; onactivate: (event: MouseEvent, item: PlacedItem) => void } = $props();
  const event = $derived(item.members[0].event);
  const label = $derived(eventLabel(event));
  const geometry = $derived(visibleLabel(item.x, item.width, scroll, viewport));
  let text: HTMLSpanElement | undefined = $state();
  let truncated = $state(true);
  const icon = $derived(timelineIcon(event, item.category));
  $effect(() => { void label; if (text) truncated = text.scrollWidth > text.clientWidth + 1; });
  function measure(node: HTMLElement) {
    const observer = new ResizeObserver(() => { truncated = node.scrollWidth > node.clientWidth + 1; });
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

{#snippet symbol()}
  <span class="event-icon" aria-hidden="true">{#if eventIcon}{@render eventIcon(event)}{:else}<LucideIcon name={icon} size={16} />{/if}</span>
{/snippet}
{#if enhanced}
  <button type="button" class="entry" class:compact={item.compact} data-event={event.id} data-category={item.category.id} data-type={event.type} data-lane={item.lane}
    style:left={`${item.x}px`} style:top={`${item.top}px`} style:width={`${item.width}px`} style:--timeline-color={item.category.color}
    aria-label={`${label}, ${eventDateLabel(event, locale, presentLabel)}`} aria-haspopup="dialog"
    use:tooltip={item.compact || truncated || !geometry.icon ? label : undefined}
    onclick={(e) => onactivate(e, item)}>
    {#if item.compact}{@render symbol()}
    {:else}
      <span class="bar-label" style:left={`${geometry.left}px`} style:width={`${geometry.width}px`}>
        {#if geometry.icon}{@render symbol()}{/if}
        <span class="label-text" bind:this={text} use:measure style:display={geometry.textWidth > 0 ? undefined : 'none'}>{label}</span>
      </span>
    {/if}
  </button>
{:else}
  <details data-event={event.id} class="fallback" style:--timeline-color={item.category.color}>
    <summary aria-label={`${event.title}, ${eventDateLabel(event, locale, presentLabel)}`}>{@render symbol()} <strong>{event.title}</strong> · {eventDateLabel(event, locale, presentLabel)}</summary>
    <TimelineDetails {event} {locale} {presentLabel} />
  </details>
{/if}

<style>
  .entry { position: absolute; height: 32px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--timeline-color) 70%, var(--ps-ink)); background: color-mix(in srgb, var(--timeline-color) 28%, var(--ps-section-standard)); color: var(--ps-ink); padding: 0; cursor: pointer; font: inherit; font-size: .8125rem; text-align: left; }
  .entry::after { content: ''; position: absolute; inset: -6px min(0px, calc((100% - 44px) / 2)); border-radius: inherit; }
  .entry:hover { background: color-mix(in srgb, var(--timeline-color) 45%, var(--ps-section-standard)); }
  .entry:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 3px; }
  .compact { display: grid; place-items: center; }
  .bar-label { position: absolute; top: 0; height: 100%; display: flex; gap: 6px; align-items: center; overflow: hidden; pointer-events: none; }
  .label-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .event-icon { display: inline-flex; flex: none; }
  .fallback { margin-block: 1rem; }
  summary { cursor: pointer; }
</style>
