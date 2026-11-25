<script lang="ts">
  import { onMount, tick, untrack, type Snippet } from 'svelte';
  import type { TimelineCategory, TimelineEvent, TimelineSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  import TimelineEntry from './TimelineEntry.svelte';
  import TimelineDetails from './TimelineDetails.svelte';
  import Popup from './Popup.svelte';
  import LucideIcon from './LucideIcon.svelte';
  import Chip from './Chip.svelte';
  import { tooltip } from './tooltip.js';
  import { layoutTimeline, normalizeTimeline, anchoredScroll, unprojectTime, viewportTime, chronological, eventLabel, eventDateLabel, formatTimelineDate, timelineIcon, DAY, EDGE, AXIS, type ClusterState, type PlacedItem, type NormalizedEvent } from './timeline.js';
  let { section, icon: categoryIcon, eventIcon }: { section: Omit<TimelineSectionData, 'type'>; icon?: Snippet<[TimelineCategory]>; eventIcon?: Snippet<[TimelineEvent]> } = $props();
  const uid = $props.id();
  // The serialized SSR day survives cached HTML and hydration across midnight.
  const referenceDate = typeof document !== 'undefined' ? document.getElementById(uid)?.dataset.referenceDate ?? new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  let enhanced = $state(false);
  let hidden = $state<string[]>([]);
  let scale = $state(untrack(() => Number.isFinite(section.initialScale) && section.initialScale! > 0 ? section.initialScale! : .6));
  let fit = $state(false);
  let viewport = $state(0);
  let scroll = $state(0);
  let frame: HTMLDivElement | undefined = $state();
  let zoomControl: HTMLInputElement | undefined = $state();
  let previous: ClusterState = [];
  const domain = $derived(normalizeTimeline(section, referenceDate));
  const fitScale = $derived(Math.max(.00001, (viewport - EDGE * 2) / ((domain.end - domain.start) / DAY)));
  const minimumScale = $derived(fitScale);
  const maximumScale = $derived(Math.max(64, minimumScale));
  const actualScale = $derived(fit ? minimumScale : Math.max(minimumScale, Math.min(maximumScale, scale)));
  const layout = $derived(layoutTimeline(section, referenceDate, actualScale, hidden, untrack(() => previous)));
  $effect(() => { previous = layout.clusters; });
  const descending = $derived(section.direction === 'descending');
  const axisTop = $derived(section.axisPosition === 'top');
  const range = $derived(`${formatTimelineDate(new Date(Math.max(domain.start, Math.min(domain.end, unprojectTime(scroll, domain, actualScale, descending)))).toISOString().slice(0, 10), section.locale)} – ${formatTimelineDate(new Date(Math.max(domain.start, Math.min(domain.end, unprojectTime(scroll + viewport, domain, actualScale, descending)))).toISOString().slice(0, 10), section.locale)}`);
  let activeKey = $state<string | null>(null);
  const active = $derived(layout.items.find(item => item.key === activeKey));
  let selected = $state.raw<NormalizedEvent | undefined>();
  let anchor = $state<HTMLElement>();
  let anchorPoint = $state<{ x: number; y: number }>();
  let popup: HTMLDivElement | undefined = $state();
  let list: HTMLDivElement | undefined = $state();
  let listScroll = 0;
  let popupScroll = 0;
  let selectedKey: string | undefined;
  let pointer: { x: number; y: number; scroll: number } | undefined;
  let scrollFrame = 0;
  let lastDirection: string | undefined;
  let lastStageWidth: string | undefined;
  let gestureUntil = 0;
  let zoomRevision = 0;
  $effect(() => {
    const width = section.stageWidth ?? 'full';
    if (width !== lastStageWidth) { lastStageWidth = width; activeKey = null; selected = undefined; }
  });
  $effect(() => {
    if (activeKey && !active) { activeKey = null; selected = undefined; tick().then(() => zoomControl?.focus({ preventScroll: true })); }
    else if (active && selected) {
      const current = active.members.find(member => member.key === selected?.key);
      if (current && current.event !== selected.event) selected = current;
    }
  });
  $effect(() => {
    const nextDirection = section.direction ?? 'ascending';
    if (frame && nextDirection !== lastDirection) {
      lastDirection = nextDirection;
      activeKey = null;
      tick().then(() => { if (frame) { frame.scrollLeft = descending ? 0 : Math.max(0, layout.width - viewport); scroll = frame.scrollLeft; } });
    }
  });
  onMount(() => { enhanced = true; return () => cancelAnimationFrame(scrollFrame); });
  function observe(node: HTMLDivElement) {
    const observer = new ResizeObserver(async () => {
      const width = node.clientWidth;
      if (width === viewport) return;
      // Retain the pre-resize offset: the browser may already have clamped the DOM offset.
      const time = viewport ? viewportTime(scroll, viewport, domain, actualScale, descending) : undefined;
      viewport = width;
      if (scale <= fitScale) fit = true;
      await tick();
      node.scrollLeft = time === undefined ? descending ? 0 : layout.width - width : anchoredScroll(time, .5, width, domain, actualScale, descending);
      scroll = node.scrollLeft;
    });
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
  function pan() {
    if (!frame || frame.scrollLeft === scroll) return;
    // Frame movement closes its dialog; an internal list scroll does not reach here.
    activeKey = null; selected = undefined;
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; if (frame) scroll = frame.scrollLeft; });
  }
  async function zoom(value: number, fraction = .5, time = viewportTime(frame?.scrollLeft ?? scroll, viewport, domain, actualScale, descending)) {
    const revision = ++zoomRevision;
    activeKey = null; selected = undefined;
    fit = value <= minimumScale; scale = Math.max(minimumScale, Math.min(maximumScale, value));
    await tick();
    if (frame && revision === zoomRevision) { frame.scrollLeft = anchoredScroll(time, fraction, viewport, domain, actualScale, descending); scroll = frame.scrollLeft; }
  }
  function gestures(node: HTMLDivElement) {
    let pinch: { distance: number; scale: number; time: number } | undefined;
    const fractionAt = (x: number) => Math.max(0, Math.min(1, (x - node.getBoundingClientRect().left - node.clientLeft) / node.clientWidth));
    const timeAt = (fraction: number) => unprojectTime(node.scrollLeft + fraction * viewport, domain, actualScale, descending);
    function wheel(event: WheelEvent) {
      // Trackpads report pinch gestures as control-wheel. Ordinary wheel input stays native.
      if (!event.ctrlKey) return;
      event.preventDefault();
      const fraction = fractionAt(event.clientX);
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport : 1);
      gestureUntil = performance.now() + 350;
      void zoom(actualScale * Math.exp(-Math.max(-500, Math.min(500, delta)) * .01), fraction, timeAt(fraction));
    }
    function start(event: TouchEvent) {
      if (event.touches.length !== 2) return;
      const [a, b] = [...event.touches];
      const fraction = fractionAt((a.clientX + b.clientX) / 2);
      pinch = { distance: Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)), scale: actualScale, time: timeAt(fraction) };
      gestureUntil = performance.now() + 350;
      event.preventDefault();
    }
    function move(event: TouchEvent) {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const [a, b] = [...event.touches];
      gestureUntil = performance.now() + 350;
      void zoom(pinch.scale * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / pinch.distance, fractionAt((a.clientX + b.clientX) / 2), pinch.time);
    }
    function end() { if (pinch) gestureUntil = performance.now() + 350; pinch = undefined; }
    node.addEventListener('wheel', wheel, { passive: false });
    node.addEventListener('touchstart', start, { passive: false });
    node.addEventListener('touchmove', move, { passive: false });
    node.addEventListener('touchend', end);
    node.addEventListener('touchcancel', end);
    return { destroy() {
      node.removeEventListener('wheel', wheel); node.removeEventListener('touchstart', start);
      node.removeEventListener('touchmove', move); node.removeEventListener('touchend', end); node.removeEventListener('touchcancel', end);
    } };
  }
  async function toggle(id: string) {
    const position = frame?.scrollLeft ?? scroll;
    activeKey = null; selected = undefined;
    hidden = hidden.includes(id) ? hidden.filter(value => value !== id) : [...hidden, id];
    await tick();
    // Replacing the browser's scroll-anchor element during filtering must not
    // choose a new time window. The source domain and scale remain unchanged.
    if (frame) { frame.scrollLeft = position; scroll = frame.scrollLeft; }
  }
  async function activate(event: MouseEvent, item: PlacedItem) {
    if (event.detail && performance.now() < gestureUntil) return;
    if (event.detail && pointer && (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 8 || Math.abs((frame?.scrollLeft ?? scroll) - pointer.scroll) > 4)) return;
    pointer = undefined;
    if (activeKey === item.key) { if (item.cluster && selected) await back(); else await close(); return; }
    if (frame) scroll = frame.scrollLeft;
    anchor = event.currentTarget as HTMLElement;
    anchorPoint = !item.cluster && event.detail ? { x: event.clientX, y: event.clientY } : undefined;
    selected = item.cluster ? undefined : item.members[0];
    selectedKey = undefined; listScroll = 0; activeKey = item.key;
    await tick();
    popup?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  }
  async function choose(member: NormalizedEvent) {
    listScroll = list?.scrollTop ?? 0; popupScroll = popup?.scrollTop ?? 0; selectedKey = member.key; selected = member;
    await tick();
    if (popup) { popup.scrollTop = 0; popup.querySelector<HTMLElement>('.ps-popup-close')?.focus({ preventScroll: true }); }
  }
  async function back() {
    selected = undefined;
    await tick();
    if (popup) popup.scrollTop = popupScroll;
    if (list) { list.scrollTop = listScroll; [...list.querySelectorAll<HTMLButtonElement>('button')].find(node => node.dataset.key === selectedKey)?.focus({ preventScroll: true }); }
  }
  async function close() {
    activeKey = null; selected = undefined;
    await tick();
    if (anchor?.isConnected) anchor.focus({ preventScroll: true }); else zoomControl?.focus({ preventScroll: true });
  }
  const groupRange = (item: PlacedItem) => `${formatTimelineDate(new Date(item.start).toISOString().slice(0, 10), section.locale)} – ${formatTimelineDate(new Date(item.end).toISOString().slice(0, 10), section.locale)}`;
</script>

{#snippet legend()}
  <div class="legend" role="group" aria-label={section.categoriesLabel ?? 'Categories'}>
    {#each domain.categories as category (category.id)}
      <Chip label={category.title} selected={!hidden.includes(category.id)} color={category.color} onclick={() => toggle(category.id)}>
        {#snippet icon()}{#if categoryIcon}{@render categoryIcon(category)}{:else}<span class="swatch" style:background={category.color}></span>{/if}{/snippet}
        {#snippet trailingIcon()}{#if !hidden.includes(category.id)}<LucideIcon name="check" size={16} />{:else}<LucideIcon name="plus" size={16} />{/if}{/snippet}
      </Chip>
    {/each}
  </div>
{/snippet}
{#snippet zoomControls()}
      <div class="zoom-controls">
        <label for={`${uid}-zoom`}>{section.zoomLabel ?? 'Zoom'}</label>
        <input bind:this={zoomControl} id={`${uid}-zoom`} type="range" min="0" max="100" step="0.1" value={maximumScale === minimumScale ? 0 : 100 * Math.log(actualScale / minimumScale) / Math.log(maximumScale / minimumScale)} aria-valuetext={range} oninput={(event) => zoom(minimumScale * (maximumScale / minimumScale) ** (+event.currentTarget.value / 100))} />
        <output for={`${uid}-zoom`}>{range}</output>
      </div>
{/snippet}
{#snippet timeline()}
  <div id={uid} class="ps-timeline" data-stage-width={section.stageWidth ?? 'full'} data-enhanced={enhanced} data-reference-date={referenceDate} data-scale={actualScale} data-axis={axisTop ? 'top' : 'bottom'} data-fit={actualScale === minimumScale}>
    {#if enhanced}
      {#if axisTop}{@render zoomControls()}{:else}{@render legend()}{/if}
      {#if !layout.items.length}<p class="empty" role="status">{section.emptyLabel ?? 'No events to display. Choose a category or a different date range.'}</p>{/if}
      <!-- Keyboard users can focus the native horizontal scroll region. -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="timeline-frame" bind:this={frame} use:observe use:gestures onscroll={pan} role="region" aria-label={section.title} tabindex="0"
        onpointerdown={(event) => { pointer = { x: event.clientX, y: event.clientY, scroll: frame?.scrollLeft ?? 0 }; }}>
        <div class="chart" style:width={`${layout.width}px`} style:height={`${layout.height}px`}>
          <div class="axis" style:top={`${axisTop ? 0 : layout.height - AXIS}px`} aria-hidden="true">
            {#each layout.ticks as tick}<span style:left={`${tick.x}px`}>{tick.label}</span>{/each}
          </div>
          {#each layout.ticks as tick}<div class="gridline" style:left={`${tick.x}px`} aria-hidden="true"></div>{/each}
          {#each [...layout.items].sort((a, b) => a.x - b.x || a.lane - b.lane) as item (item.key)}
            {#if item.cluster}
              <button class="cluster" type="button" style:left={`${item.x}px`} style:top={`${item.top - 4}px`} style:--timeline-color={item.category.color} data-cluster={item.key} data-category={item.category.id} data-lane={item.lane}
                aria-label={`${item.members.length} ${section.eventsLabel ?? 'events'} · ${item.category.title}, ${groupRange(item)}`} aria-haspopup="dialog" use:tooltip={`${item.members.length} ${section.eventsLabel ?? 'events'} · ${groupRange(item)}`} onclick={(e) => activate(e, item)}>{item.members.length}</button>
            {:else}<TimelineEntry {item} {enhanced} {scroll} {viewport} {eventIcon} locale={section.locale} presentLabel={section.presentLabel} onactivate={activate} />{/if}
          {/each}
        </div>
      </div>
      {#if axisTop}{@render legend()}{:else}{@render zoomControls()}{/if}
    {:else}
      {#each domain.categories as category (category.id)}
        <div role="group" aria-label={category.title}><h3>{category.title}</h3>
          {#each chronological(domain.events.filter(item => item.category.id === category.id), descending) as entry (entry.key)}
            <TimelineEntry item={{ ...entry, members: [entry], x: 0, width: 0, top: 0, lane: 0, compact: false, cluster: false }} {enhanced} {eventIcon} locale={section.locale} presentLabel={section.presentLabel} onactivate={activate} />
          {/each}
        </div>
      {/each}
      {#if !domain.events.length}<p>{section.emptyLabel ?? 'No events to display. Choose a category or a different date range.'}</p>{/if}
    {/if}
    {#if enhanced && active}
      <Popup title={selected?.event.title ?? `${active.members.length} ${section.eventsLabel ?? 'events'} · ${active.category.title}`} role="dialog" closable closeLabel={section.closeLabel ?? 'Close details'} {anchor} {anchorPoint} placement="side" onrequestclose={close} bind:element={popup} class="timeline-popup" style={`--timeline-color: ${active.category.color}`}>
        {#if selected}
          <TimelineDetails event={selected.event} locale={section.locale} presentLabel={section.presentLabel} />
        {/if}
        {#if active.cluster}
          <div hidden={!!selected}>
            <div class="cluster-list" bind:this={list}>
              {#each chronological(active.members, descending) as member (member.key)}
                <button type="button" class="cluster-row" data-key={member.key} onclick={() => choose(member)}>
                  <span class="row-icon" aria-hidden="true">{#if eventIcon}{@render eventIcon(member.event)}{:else}<LucideIcon name={timelineIcon(member.event, member.category)} size={20} />{/if}</span>
                  <span><strong>{eventLabel(member.event)}</strong><span class="row-date">{eventDateLabel(member.event, section.locale, section.presentLabel)}</span></span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </Popup>
    {/if}
  </div>
{/snippet}

<!-- Keep the registered Section alive when moving its timeline between slots. -->
<Section section={section.stageWidth === 'contained' ? section : { ...section, layout: 'full' }}
  children={section.stageWidth === 'contained' ? timeline : undefined}
  stage={section.stageWidth === 'contained' ? undefined : timeline} />

<style>
  .ps-timeline { position: relative; min-width: 0; color: var(--ps-ink); font: var(--ps-grid-body-size)/1.5 var(--ps-font-family); }
  .zoom-controls { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-block: .5rem 1rem; font-size: .8125rem; }
  input { width: clamp(100px, 18vw, 240px); min-width: 0; accent-color: var(--ps-accent); }
  output { color: var(--ps-body); margin-left: auto; }
  .legend { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; padding-block: .75rem; }
  .legend :global(.ps-chip) { max-width: 100%; }
  .swatch { width: 12px; height: 12px; border-radius: 50%; }
  .timeline-frame { overflow-x: auto; overflow-y: hidden; overscroll-behavior-x: contain; touch-action: pan-x pan-y; min-width: 0; scrollbar-width: thin; border: 1px solid var(--ps-border); border-radius: 12px; }
  .chart { position: relative; min-width: 100%; isolation: isolate; }
  .axis { position: absolute; left: 0; right: 0; height: 40px; border-top: 1px solid var(--ps-border); }
  [data-axis='top'] .axis { border-top: 0; border-bottom: 1px solid var(--ps-border); }
  .axis span { position: absolute; top: 8px; transform: translateX(-50%); white-space: nowrap; font-size: .75rem; color: var(--ps-body); }
  .gridline { position: absolute; top: 0; bottom: 0; border-left: 1px dotted var(--ps-border); z-index: -1; }
  .cluster { position: absolute; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid color-mix(in srgb, var(--timeline-color) 70%, var(--ps-ink)); background: color-mix(in srgb, var(--timeline-color) 35%, var(--ps-section-standard)); color: var(--ps-ink); font: inherit; font-size: .875rem; font-weight: 650; cursor: pointer; }
  .cluster::after { content: ''; position: absolute; inset: -2px; }
  button:focus-visible, .timeline-frame:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 3px; }
  .ps-timeline :global(.timeline-popup) { width: min(420px, calc(100vw - 24px)); }
  .cluster-list { max-height: min(420px, calc(100dvh - 180px)); overflow-y: auto; overscroll-behavior: contain; }
  .cluster-row { display: flex; align-items: flex-start; gap: .75rem; width: 100%; padding: .75rem .4rem; text-align: left; font: inherit; color: var(--ps-ink); background: transparent; border: 0; border-top: 1px solid var(--ps-border); cursor: pointer; }
  .cluster-row:hover { background: color-mix(in srgb, var(--timeline-color) 12%, transparent); }
  .cluster-row strong { display: block; font-weight: 600; overflow-wrap: anywhere; }
  .row-icon { flex: none; margin-top: 3px; }
  .row-date { display: block; font-size: .75rem; color: var(--ps-body); margin-top: .25rem; }
  .empty { padding: 1rem; }
  @media (max-width: 500px) { output { width: 100%; margin-left: 0; } .legend { justify-content: flex-start; } }
</style>
