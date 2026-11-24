<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { TimelineCategory, TimelineEvent, TimelineSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import TimelineEntry from './TimelineEntry.svelte';
  import LucideIcon from './LucideIcon.svelte';
  import Chip from './Chip.svelte';
  import { layoutTimeline } from './timeline.js';
  let { section, icon: categoryIcon, eventIcon }: { section: Omit<TimelineSectionData, 'type'>; icon?: Snippet<[TimelineCategory]>; eventIcon?: Snippet<[TimelineEvent]> } = $props();
  const uid = $props.id();
  // Reuse the SSR date across hydration, including cached pages and midnight crossings.
  const referenceDate = typeof document !== 'undefined' ? document.getElementById(uid)?.dataset.referenceDate ?? new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  let enhanced = $state(false);
  let hidden = $state<string[]>([]);
  let active = $state<string | null>(null);
  let labelHeights = $state<Record<string, number>>({});
  let width = $state(0);
  let textScale = $state(1);
  const baseLayout = $derived(layoutTimeline(section, referenceDate));
  const axisWidth = $derived(Math.max(3.25, Math.min(9, Math.max(0, ...baseLayout.ticks.map(tick => tick.label.length)) * .45 + .6)));
  const widths = $derived.by(() => {
    const count = baseLayout.categories.length;
    const available = Math.max(0, width - axisWidth * 16 * textScale);
    const hiddenCount = baseLayout.categories.filter(category => hidden.includes(category.id)).length;
    const equal = available / Math.max(1, count);
    // Reserve room for the restore label, while giving active categories the remaining space.
    const compact = (title: string) => hiddenCount === count ? equal : Math.min(equal, (title.length * .6 + 4) * 16 * textScale);
    const reserved = baseLayout.categories.reduce((sum, category) => sum + (hidden.includes(category.id) ? compact(category.title) : 0), 0);
    const expanded = (available - reserved) / Math.max(1, count - hiddenCount);
    return Object.fromEntries(baseLayout.categories.map(category => [category.id, hidden.includes(category.id) ? compact(category.title) : expanded]));
  });
  const layout = $derived(layoutTimeline(section, referenceDate, labelHeights, widths, textScale));
  const visible = $derived(layout.categories.filter(category => !hidden.includes(category.id)));
  const columns = $derived(`${axisWidth}rem ${layout.categories.map(category => `${category.width}px`).join(' ')}`);
  const key = (category: string, event: string) => JSON.stringify([category, event]);
  $effect(() => { void section.direction; active = null; });
  $effect(() => {
    if (active && !visible.some(category => category.events.some(item => key(category.id, item.event.id) === active))) active = null;
  });
  onMount(() => { enhanced = true; });
  function measure(node: HTMLElement) {
    const observer = new ResizeObserver(() => {
      width = node.getBoundingClientRect().width;
      textScale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
    });
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
  function dockHeader(node: HTMLElement) {
    let frame = 0;
    const update = () => {
      frame = 0;
      const edge = parseFloat(getComputedStyle(node).top) || 0;
      node.toggleAttribute('data-docked', Math.abs(node.getBoundingClientRect().top - edge) < .5);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    document.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return { destroy() { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); } };
  }
  function toggle(id: string) {
    hidden = hidden.includes(id) ? hidden.filter(value => value !== id) : [...hidden, id];
    active = null;
  }
</script>

<Section {section}>
  <div id={uid} class="ps-timeline" use:measure data-enhanced={enhanced} data-reference-date={referenceDate} style:--timeline-columns={columns} style:--timeline-axis-width={`${axisWidth}rem`}>
    {#if enhanced}
      <span class="axis-caption">Date</span>
      <div class="timeline-header" use:dockHeader>
        <div class="filters">
          <span aria-hidden="true"></span>
          {#each layout.categories as category (category.id)}
            <div class="category-filter" class:compact={category.width < 160 * textScale} class:narrow={category.width < 64 * textScale}>
              <Chip label={category.title} title={category.title} selected={!hidden.includes(category.id)} color={category.color} onclick={() => toggle(category.id)}>
                {#snippet icon()}
                  {#if hidden.includes(category.id)}<LucideIcon name="plus" />
                  {:else if category.icon}{#if categoryIcon}{@render categoryIcon({ ...category, events: category.events.map(item => item.event) })}{:else}<LucideIcon name={category.icon} />{/if}{/if}
                {/snippet}
                {#snippet trailingIcon()}{#if !hidden.includes(category.id)}<LucideIcon name="check" size={16} />{/if}{/snippet}
              </Chip>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if !visible.some(category => category.events.length)}<p class="empty" role="status">{section.emptyLabel ?? 'No events to display. Choose a category or a different date range.'}</p>{/if}
    {#if enhanced || visible.some(category => category.events.length)}
      <div class="chart" style:height={enhanced ? `${layout.contentHeight}px` : undefined}>
        {#if enhanced}<div class="axis" aria-hidden="true">{#each layout.ticks as tick}<span style:top={`${tick.top + 16}px`}>{tick.label}</span>{/each}</div>{/if}
        {#each layout.categories as category (category.id)}
          {#if hidden.includes(category.id)}<div aria-hidden="true"></div>{:else}
            <div class="category" style:--timeline-color={category.color} aria-label={category.title} role="group">
              {#if !enhanced}<h3>{category.title}</h3>{/if}
              {#if enhanced}
                <div class="rail" style:left={`${category.railLeft}px`} style:height={`${layout.height + 32}px`} aria-hidden="true"></div>
                {#each layout.ticks as tick}<span class="gridline" style:top={`${tick.top + 16}px`} aria-hidden="true"></span>{/each}
              {/if}
              {#each category.events as item (item.event.id)}
                <TimelineEntry {...item} top={item.top + 16} labelTop={item.labelTop + 16} group={`${uid}-events`} {enhanced} {eventIcon}
                  active={active === key(category.id, item.event.id)} locale={section.locale} presentLabel={section.presentLabel}
                  onlabelsize={(height) => { const id = key(category.id, item.event.id); if (labelHeights[id] !== height) labelHeights = { ...labelHeights, [id]: height }; }}
                  onactivate={() => { const id = key(category.id, item.event.id); active = active === id ? null : id; }}
                  onclose={() => { if (active === key(category.id, item.event.id)) active = null; }} />
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</Section>

<style>
  .ps-timeline { color: var(--ps-ink); container-type: inline-size; }
  .ps-timeline[data-enhanced='true'] { position: relative; isolation: isolate; padding-top: .5rem; }
  .timeline-header { position: sticky; top: var(--ps-timeline-sticky-offset, 0px); z-index: 5; padding-bottom: 1rem; pointer-events: none; }
  .filters, [data-enhanced='true'] .chart { display: grid; grid-template-columns: var(--timeline-columns); min-width: 0; }
  .timeline-header:global([data-docked]) :global(.ps-chip) { border-start-start-radius: 0; border-start-end-radius: 0; border-end-start-radius: 22px; border-end-end-radius: 22px; }
  .category-filter { min-width: 0; margin-inline: 2px; pointer-events: auto; }
  .category-filter :global(.ps-chip) { width: 100%; }
  .category-filter :global(.ps-chip[aria-pressed='false'] .ps-chip-trailing-icon) { display: none; }
  .compact :global(.ps-chip-trailing-icon) { display: none; }
  .narrow :global(.ps-chip) { font-size: .75rem; padding-inline: 2px; }
  .narrow :global(.ps-chip-icon) { display: none; }
  .axis-caption { position: absolute; top: .5rem; left: 0; width: var(--timeline-axis-width); height: 44px; box-sizing: border-box; display: grid; align-items: center; padding-left: .5rem; font-size: .8rem; color: var(--ps-body); }
  .chart { position: relative; }
  .category { position: relative; min-width: 0; }
  .axis { position: relative; z-index: 3; border-right: 1px solid var(--ps-border); }
  .axis span { position: absolute; right: .65rem; transform: translateY(-50%); font-size: .8rem; color: var(--ps-body); white-space: nowrap; }
  .rail { position: absolute; top: -16px; transform: translateX(-1px); border-left: 2px solid var(--timeline-color); }
  .gridline { position: absolute; left: 0; right: 0; border-top: 1px dotted var(--ps-border); }
  [data-enhanced='true'] .empty { position: absolute; top: 5rem; left: 0; right: 0; padding: 1rem; }
</style>
