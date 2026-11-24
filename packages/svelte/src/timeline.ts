import type { TimelineDate, TimelineEvent, TimelineSectionData } from '@page-sections/core';

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

type Interval = { event: TimelineEvent; start: number; end: number };
/** Earliest-start interval partitioning. Half-open periods reuse a lane at a shared boundary. */
export function assignTimelineLanes(intervals: Interval[]) {
  const ends: number[] = [];
  return [...intervals].sort((a, b) => a.start - b.start || b.end - a.end ||
    (a.event.id < b.event.id ? -1 : a.event.id > b.event.id ? 1 : 0)).map(item => {
    let lane = ends.findIndex(end => end <= item.start);
    if (lane === -1) lane = ends.length;
    // Points occupy one calendar day, so simultaneous points remain distinct.
    ends[lane] = Math.max(item.start + day, item.end);
    return { ...item, lane };
  });
}

export function layoutTimeline(section: Omit<TimelineSectionData, 'type'>, referenceDate: TimelineDate, labelHeights: Readonly<Record<string, number>> = {}, widths?: Readonly<Record<string, number>>, textScale = 1) {
  const explicitStart = parseTimelineDate(section.start);
  const explicitEnd = parseTimelineDate(section.end);
  const reference = explicitEnd ?? parseTimelineDate(section.referenceDate ?? referenceDate);
  const categoryCounts = new Map<string, number>();
  for (const category of section.categories) categoryCounts.set(category.id, (categoryCounts.get(category.id) ?? 0) + 1);
  const categories = section.categories.filter(category => categoryCounts.get(category.id) === 1).map(category => {
    const ids = new Map<string, number>();
    for (const event of category.events) ids.set(event.id, (ids.get(event.id) ?? 0) + 1);
    const intervals = category.events.flatMap(event => {
      const start = parseTimelineDate(event.type === 'point' ? event.date : event.start);
      const end = event.type === 'point' ? start : event.end === undefined ? reference : parseTimelineDate(event.end);
      if (ids.get(event.id) !== 1 || start === undefined || end === undefined || end < start) return [];
      return [{ event, start, end }];
    });
    return { category, intervals };
  });
  const all = categories.flatMap(category => category.intervals);
  const invalidWindow = (section.start !== undefined && explicitStart === undefined) ||
    (section.end !== undefined && explicitEnd === undefined) ||
    (explicitStart !== undefined && explicitEnd !== undefined && explicitEnd < explicitStart);
  const minimum = all.length ? Math.min(...all.map(item => item.start)) : reference ?? utc(2000);
  const maximum = all.length ? Math.max(...all.map(item => item.end)) : minimum;
  const start = explicitStart ?? utc(new Date(minimum).getUTCFullYear());
  const end = Math.max(start + day, explicitEnd ?? utc(new Date(maximum).getUTCFullYear() + 1));
  const height = Math.max(640, (end - start) / day / 365.2425 * 76);
  const descending = section.direction === 'descending';
  const position = (value: number) => {
    const offset = (Math.max(start, Math.min(end, value)) - start) / (end - start) * height;
    return descending ? height - offset : offset;
  };
  // Keep very long timelines useful without rendering thousands of grid lines.
  const yearStep = Math.max(1, Math.ceil((new Date(end).getUTCFullYear() - new Date(start).getUTCFullYear()) / 60));
  const ticks: { label: string; top: number }[] = [{ label: formatTimelineDate(section.start ?? String(new Date(start).getUTCFullYear()), section.locale), top: position(start) }];
  for (let year = new Date(start).getUTCFullYear() + yearStep; utc(year) < end; year += yearStep) {
    const top = position(utc(year));
    if (top > 32 && height - top > 32) ticks.push({ label: String(year), top });
  }
  ticks.push({ label: formatTimelineDate(section.end ?? String(new Date(end).getUTCFullYear()), section.locale), top: position(end) });
  ticks.sort((a, b) => a.top - b.top);
  const rendered = categories.map(({ category, intervals }) => {
    const events = assignTimelineLanes(invalidWindow ? [] : intervals.filter(item =>
      item.event.type === 'point' || item.start === item.end
        ? item.start >= start && item.start <= end
        : item.end > start && item.start < end));
    const lanes = Math.max(1, ...events.map(item => item.lane + 1));
    const available = widths?.[category.id] ?? Infinity;
    // Match the Chip's 2px outer gap, 1px border, .75rem padding and 20px icon.
    const iconCenter = 3 + 12 * textScale + 10;
    const iconVisible = available >= 64 * textScale;
    const labelInset = iconCenter - 10;
    const labelSpace = available - labelInset - lanes * 28 - 10;
    const labelsVisible = labelSpace >= 140 * textScale;
    const maxColumns = Math.max(1, Math.floor(labelSpace / (184 * textScale)));
    const labelWidth = Number.isFinite(labelSpace) ? Math.max(0, Math.min(174 * textScale, labelSpace / maxColumns - 10)) : 174 * textScale;
    const laneStep = labelsVisible ? 28 : Math.max(0, Math.min(28, (available - (iconVisible ? iconCenter : 6) - 6) / lanes));
    const markerWidth = Math.min(20, laneStep * .72);
    const markerInset = iconVisible ? iconCenter - markerWidth / 2 : Math.max(0, (available - lanes * laneStep) / 2);
    const labelEnds: number[] = [];
    // Assign interval lanes chronologically in either direction, then place labels
    // in visual reading order. Reversing the axis never changes lane ownership.
    const visual = events.map(item => ({ ...item, top: Math.min(position(item.start), position(item.end)), height: Math.max(4, Math.abs(position(item.end) - position(item.start))) }));
    visual.sort((a, b) => a.top - b.top || (descending ? b.start - a.start : a.start - b.start) || a.lane - b.lane);
    const positioned = visual.map(item => {
      const top = item.top;
      let labelLane = labelEnds.findIndex(bottom => bottom <= top);
      if (labelLane === -1) labelLane = labelEnds.length < maxColumns ? labelEnds.length : labelEnds.indexOf(Math.min(...labelEnds));
      const labelTop = Math.max(top, labelEnds[labelLane] ?? top);
      const labelHeight = labelHeights[JSON.stringify([category.id, item.event.id])] ?? 116;
      labelEnds[labelLane] = labelTop + labelHeight;
      return { ...item, labelLane, labelHeight, labelTop,
        markerLeft: markerInset + item.lane * laneStep, markerWidth,
        labelLeft: labelInset + lanes * 28 + labelLane * (labelWidth + 10), labelWidth, labelsVisible };
    });
    return { ...category, events: positioned, lanes, width: widths?.[category.id] ?? 44 + lanes * 28 + Math.max(1, labelEnds.length) * 184, railLeft: markerInset + markerWidth / 2 };
  });
  const contentHeight = Math.max(height + 32, ...rendered.flatMap(category => category.events.filter(item => item.labelsVisible).map(item => item.labelTop + item.labelHeight + 16)));
  return { height, contentHeight, ticks: invalidWindow ? [] : ticks, categories: rendered };
}
