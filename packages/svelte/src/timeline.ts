import type { TimelineCategory, TimelineDate, TimelineEvent, TimelineSectionData } from '@page-sections/core';

const day = 86400000;
function utc(year: number, month = 1, date = 1) {
  const value = new Date(0);
  value.setUTCFullYear(year, month - 1, date);
  return value.getTime();
}

/** Strict parsing, including leap days; no timezone or Date.parse implementation dependence. */
export function parseTimelineDate(value: TimelineDate | undefined): number | undefined {
  if (typeof value !== 'string' || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return;
  const [year, month = 1, date = 1] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || date < 1 || date > 31) return;
  const result = utc(year, month, date);
  const check = new Date(result);
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== date) return;
  return result;
}

export function formatTimelineDate(value: TimelineDate, locale = 'en-GB'): string {
  const time = parseTimelineDate(value);
  if (time === undefined) return value;
  if (value.length === 4) return value;
  const options: Intl.DateTimeFormatOptions = { timeZone: 'UTC', year: 'numeric', month: 'short', ...(value.length === 10 ? { day: 'numeric' } as const : {}) };
  try { return new Intl.DateTimeFormat(locale, options).format(time); }
  catch { return new Intl.DateTimeFormat('en-GB', options).format(time); }
}

export function eventDateLabel(event: TimelineEvent, locale = 'en-GB', present = 'Present') {
  return event.type === 'point' ? formatTimelineDate(event.date, locale) :
    `${formatTimelineDate(event.start, locale)} – ${event.end ? formatTimelineDate(event.end, locale) : present}`;
}

export const DAY = day;
export const MARKER = 32;
export const TRACK = 48;
export const EDGE = 28;
export const AXIS = 40;
export const eventKey = (category: string, event: string) => JSON.stringify([category, event]);
export const eventLabel = (event: TimelineEvent) => event.label?.trim() || event.title;
const builtInIcons = new Set(['x', 'check', 'plus', 'graduation-cap', 'briefcase', 'bike', 'award', 'book-open', 'code', 'layers', 'heart', 'sprout', 'palette', 'rocket', 'git-pull-request']);
export function timelineIcon(event: TimelineEvent, category: TimelineCategory) {
  return builtInIcons.has(event.icon ?? '') ? event.icon! : builtInIcons.has(category.icon ?? '') ? category.icon! : 'layers';
}
const compareKey = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export type NormalizedEvent = { key: string; event: TimelineEvent; category: TimelineCategory; priority: number; start: number; end: number; duration: number };
export type TimelineDomain = { start: number; end: number };
export type TimelineItem = Omit<NormalizedEvent, 'event'> & { event?: TimelineEvent; members: NormalizedEvent[]; x: number; width: number; compact: boolean; cluster: boolean };
export type PlacedItem = TimelineItem & { lane: number; top: number };
export type ClusterState = readonly (readonly string[])[];

/** Normalize original intervals once, before clipping, filtering or projection. */
export function normalizeTimeline(section: Omit<TimelineSectionData, 'type'>, referenceDate: TimelineDate) {
  const explicitStart = parseTimelineDate(section.start), explicitEnd = parseTimelineDate(section.end);
  const reference = explicitEnd ?? parseTimelineDate(section.referenceDate ?? referenceDate);
  const categoryCounts = new Map<string, number>();
  for (const category of section.categories) categoryCounts.set(category.id, (categoryCounts.get(category.id) ?? 0) + 1);
  const categories = section.categories.filter(category => categoryCounts.get(category.id) === 1);
  const invalid: string[] = [];
  const all = categories.flatMap((category, priority) => {
    const counts = new Map<string, number>();
    for (const event of category.events) counts.set(event.id, (counts.get(event.id) ?? 0) + 1);
    return category.events.flatMap(event => {
      const key = eventKey(category.id, event.id);
      const start = parseTimelineDate(event.type === 'point' ? event.date : event.start);
      const end = event.type === 'point' ? start : event.end === undefined ? reference : parseTimelineDate(event.end);
      if (counts.get(event.id) !== 1 || start === undefined || end === undefined || end < start) { invalid.push(key); return []; }
      return [{ key, event, category, priority, start, end, duration: event.type === 'point' ? 0 : end - start }];
    });
  });
  const invalidWindow = (section.start !== undefined && explicitStart === undefined) ||
    (section.end !== undefined && explicitEnd === undefined) ||
    (explicitStart !== undefined && explicitEnd !== undefined && explicitEnd < explicitStart);
  const minimum = all.length ? Math.min(...all.map(item => item.start)) : reference ?? utc(2000);
  const maximum = all.length ? Math.max(...all.map(item => item.end)) : minimum;
  const start = explicitStart ?? utc(new Date(minimum).getUTCFullYear());
  const end = Math.max(start + day, explicitEnd ?? utc(new Date(maximum).getUTCFullYear() + 1));
  const events = invalidWindow ? [] : all.filter(item => item.start === item.end ? item.start >= start && item.start <= end : item.end > start && item.start < end);
  return { start, end, categories, events, invalid };
}

export function projectTime(time: number, domain: TimelineDomain, scale: number, descending = false) {
  return EDGE + (descending ? domain.end - time : time - domain.start) / day * scale;
}
export function unprojectTime(x: number, domain: TimelineDomain, scale: number, descending = false) {
  return descending ? domain.end - (x - EDGE) / scale * day : domain.start + (x - EDGE) / scale * day;
}
export function viewportTime(scroll: number, viewport: number, domain: TimelineDomain, scale: number, descending = false) {
  const width = (domain.end - domain.start) / day * scale + EDGE * 2;
  // When the entire domain fits, empty trailing space has no calendar meaning.
  return unprojectTime(scroll + Math.min(viewport, width) / 2, domain, scale, descending);
}
export function anchoredScroll(time: number, fraction: number, viewport: number, domain: TimelineDomain, scale: number, descending = false) {
  return Math.max(0, Math.min(projectTime(time, domain, scale, descending) - fraction * viewport, Math.max(0, (domain.end - domain.start) / day * scale + EDGE * 2 - viewport)));
}
export function priorityOrder(a: Pick<NormalizedEvent, 'priority' | 'duration' | 'start' | 'key'>, b: Pick<NormalizedEvent, 'priority' | 'duration' | 'start' | 'key'>) {
  return a.priority - b.priority || b.duration - a.duration || a.start - b.start || compareKey(a.key, b.key);
}
export function chronological<T extends Pick<NormalizedEvent, 'start' | 'key'>>(events: readonly T[], descending = false): T[] {
  return [...events].sort((a, b) => (descending ? b.start - a.start : a.start - b.start) || compareKey(a.key, b.key));
}
type ClusterOptions = { join: number; split: number; maxSpan: number; minimum: number };
// A 32px marker, 8px breathing room, and at most three marker widths per group.
const clusterDefaults: ClusterOptions = { join: 40, split: 48, maxSpan: 96, minimum: 2 };
export function clusterTimeline(events: NormalizedEvent[], domain: TimelineDomain, scale: number, descending = false, previous: ClusterState = [], enabled = true, options: Partial<ClusterOptions> = {}): TimelineItem[] {
  const limits = { ...clusterDefaults, ...options };
  const previousGroup = new Map(previous.flatMap((keys, i) => keys.map(key => [key, i] as const)));
  const projected: TimelineItem[] = events.map(item => {
    const a = projectTime(Math.max(domain.start, item.start), domain, scale, descending);
    const b = projectTime(Math.min(domain.end, item.end), domain, scale, descending);
    const width = Math.abs(b - a);
    // Only truly short periods qualify; clipping a long period never makes it a cluster candidate.
    const compact = item.event.type === 'point' || item.duration / day * scale < MARKER * (previousGroup.has(item.key) ? 1.2 : 1);
    return { ...item, members: [item], x: compact ? (a + b) / 2 - MARKER / 2 : Math.min(a, b), width: compact ? MARKER : width, compact, cluster: false };
  });
  if (!enabled) return projected;
  const result = projected.filter(item => !item.compact);
  const candidates = projected.filter(item => item.compact).sort((a, b) => a.priority - b.priority || a.x - b.x || compareKey(a.key, b.key));
  let group: TimelineItem[] = [];
  const flush = () => {
    if (group.length < limits.minimum) result.push(...group);
    else {
      const members = chronological(group.flatMap(item => item.members));
      const centre = group.reduce((sum, item) => sum + item.x + item.width / 2, 0) / group.length;
      const first = members[0];
      result.push({ ...first, event: undefined, key: JSON.stringify(['cluster', ...members.map(item => item.key)]), members,
        start: Math.min(...members.map(item => item.start)), end: Math.max(...members.map(item => item.end)),
        duration: Math.max(...members.map(item => item.duration)), x: centre - 20, width: 40, compact: true, cluster: true });
    }
    group = [];
  };
  for (const item of candidates) {
    if (group.length) {
      const first = group[0], last = group[group.length - 1];
      const retained = previousGroup.has(item.key) && group.every(member => previousGroup.get(member.key) === previousGroup.get(item.key));
      const gap = item.x - last.x;
      if (item.priority !== first.priority || item.x - first.x > limits.maxSpan || (retained ? gap >= limits.split : gap > limits.join)) flush();
    }
    group.push(item);
  }
  flush();
  return result;
}
export function collides(a: TimelineItem, b: TimelineItem, gap = 8) {
  const temporal = a.members.some(x => b.members.some(y => x.start < Math.max(y.end, y.start + (y.event.type === 'point' ? day : 0)) && y.start < Math.max(x.end, x.start + (x.event.type === 'point' ? day : 0))));
  // 44px effective hit targets are part of the collision model.
  const left = (item: TimelineItem) => item.x - Math.max(0, 44 - item.width) / 2;
  const right = (item: TimelineItem) => item.x + item.width + Math.max(0, 44 - item.width) / 2;
  return temporal || (left(a) < right(b) + gap && left(b) < right(a) + gap);
}
/** Longest path in the priority DAG, not greedy interval partitioning. */
export function assignTimelineLanes(items: TimelineItem[], gap = 8) {
  const placed: (TimelineItem & { lane: number })[] = [];
  for (const item of [...items].sort(priorityOrder)) {
    let lane = 0;
    for (const higher of placed) if (collides(item, higher, gap)) lane = Math.max(lane, higher.lane + 1);
    placed.push({ ...item, lane });
  }
  return placed;
}
export function laneTop(lane: number, count: number, axis: 'top' | 'bottom') { return (axis === 'top' ? 8 + AXIS + lane * TRACK : 24 + (count - 1 - lane) * TRACK); }
/** Geometry is relative to the bar, bounded by its intersection with the viewport. */
export function visibleLabel(left: number, width: number, scroll: number, viewport: number, padding = 8, icon = 16, gap = 6) {
  const visibleStart = Math.max(left, scroll), visibleEnd = Math.min(left + width, scroll + viewport);
  const available = Math.max(0, visibleEnd - visibleStart - padding * 2);
  return { left: Math.max(0, visibleStart - left + padding), width: available, icon: available >= icon, textWidth: Math.max(0, available - icon - gap) };
}
export function timelineTicks(domain: TimelineDomain, scale: number, descending: boolean, locale?: string) {
  const span = (domain.end - domain.start) / day;
  const target = Math.max(90 / scale, span / 240);
  const ticks: { label: string; x: number }[] = [];
  const push = (time: number, label: string) => { if (time >= domain.start && time <= domain.end) ticks.push({ label, x: projectTime(time, domain, scale, descending) }); };
  if (target > 180) {
    const step = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find(n => n * 365 >= target) ?? 2000;
    for (let year = Math.ceil(new Date(domain.start).getUTCFullYear() / step) * step; utc(year) <= domain.end; year += step) push(utc(year), String(year).padStart(4, '0'));
  } else if (target > 20) {
    const step = target > 80 ? 6 : target > 40 ? 3 : 1;
    const date = new Date(domain.start);
    for (let month = Math.floor(date.getUTCMonth() / step) * step; utc(date.getUTCFullYear(), month + 1) <= domain.end; month += step) {
      const time = utc(date.getUTCFullYear(), month + 1);
      push(time, formatTimelineDate(new Date(time).toISOString().slice(0, 7), locale));
    }
  } else {
    const step = [1, 2, 7, 14, 21].find(n => n >= target) ?? 21;
    for (let time = Math.ceil(domain.start / (day * step)) * day * step; time <= domain.end; time += day * step) push(time, formatTimelineDate(new Date(time).toISOString().slice(0, 10), locale));
  }
  return ticks.sort((a, b) => a.x - b.x);
}
export function layoutTimeline(section: Omit<TimelineSectionData, 'type'>, referenceDate: TimelineDate, scale = .6, hidden: readonly string[] = [], previous: ClusterState = []) {
  const normalized = normalizeTimeline(section, referenceDate);
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : .6;
  const items = assignTimelineLanes(clusterTimeline(normalized.events.filter(item => !hidden.includes(item.category.id)), normalized, safeScale, section.direction === 'descending', previous, section.clustering !== false));
  const lanes = Math.max(1, ...items.map(item => item.lane + 1));
  return { ...normalized, scale: safeScale, lanes, width: (normalized.end - normalized.start) / day * safeScale + EDGE * 2, height: lanes * TRACK + AXIS + 16,
    items: items.map(item => ({ ...item, top: laneTop(item.lane, lanes, section.axisPosition ?? 'bottom') })),
    clusters: items.filter(item => item.cluster).map(item => item.members.map(member => member.key)),
    ticks: timelineTicks(normalized, safeScale, section.direction === 'descending', section.locale) };
}
