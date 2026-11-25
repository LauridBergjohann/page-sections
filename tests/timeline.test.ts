import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { TimelineSection, Sections } from '../packages/svelte/src/index.js';
import { DAY, EDGE, MARKER, anchoredScroll, chronological, clusterTimeline, collides, eventDateLabel, eventLabel, layoutTimeline, normalizeTimeline, parseTimelineDate, priorityOrder, projectTime, unprojectTime, viewportTime, visibleLabel } from '../packages/svelte/src/timeline.js';
import type { TimelineEvent, TimelineSectionData } from '@page-sections/core';
import catalog from './fixtures/timeline/edge-cases.json';
import { timelineExample, timelineExampleFor } from '../apps/website/src/lib/timelineExample.js';

const reference = catalog.referenceDate;
const section = (events: TimelineEvent[], options: Partial<TimelineSectionData> = {}): TimelineSectionData => ({ type: 'timeline', id: 'test', title: 'Test', categories: [{ id: 'one', title: 'One', color: '#168d91', events }], ...options });
const period = (id: string, start: string, end?: string): TimelineEvent => ({ id, title: id, type: 'period', start, end });
const date = (value: string) => parseTimelineDate(value)!;
function fixture(id: string): TimelineSectionData {
  const input = catalog.fixtures.find(f => f.id === id)!.input;
  const events = input.events as (TimelineEvent & { categoryId: string })[];
  const categories = 'categories' in input ? input.categories! : [...new Set(events.map(e => e.categoryId))].map(id => ({ id }));
  return { type: 'timeline', id, title: id, referenceDate: reference, locale: 'en-GB', clustering: input.clusteringEnabled,
    categories: categories.map(category => ({ id: category.id, title: category.id, color: '#168d91', events: events.filter(e => e.categoryId === category.id) })) };
}
const ids = (result: ReturnType<typeof layoutTimeline>) => result.items.flatMap(item => item.members.map(member => member.key)).sort();

describe('horizontal timeline acceptance fixtures', () => {
  it('strict-priority-chain: obeys every overlapping precedence edge, even across an otherwise free track', () => {
    const result = layoutTimeline(fixture('strict-priority-chain'), reference);
    expect(result.items.map(item => [item.event!.id, item.lane])).toEqual([['a', 0], ['b', 1], ['c', 2]]);
    const [a, b, c] = result.items;
    expect(a.end <= c.start).toBe(true);
    expect(b.start < a.end && c.start < b.end).toBe(true);
  });
  it('reuse-lanes-across-categories: retains composite IDs and reuses a shared track', () => {
    const result = layoutTimeline(fixture('reuse-lanes-across-categories'), reference);
    expect(result.items.map(item => item.lane)).toEqual([0, 0, 0]);
    expect(new Set(ids(result)).size).toBe(3);
  });
  it('stable-complete-ties: stable identity wins regardless of source ordering', () => {
    const data = fixture('stable-complete-ties');
    const first = layoutTimeline(data, reference);
    expect(first.items.map(item => item.event!.id)).toEqual(['tie-a', 'tie-b', 'tie-c']);
    expect(first.items.map(item => item.lane)).toEqual([0, 1, 2]);
    for (const category of data.categories) category.events.reverse();
    expect(layoutTimeline(data, reference).items).toEqual(first.items);
  });
  it('rendered-glyph-collision: separate dates still collide at marker and hit-target resolution', () => {
    const result = layoutTimeline(fixture('rendered-glyph-collision'), reference, 12);
    expect(result.items.map(item => item.lane)).toEqual([0, 1]);
    for (const item of result.items) {
      expect(item.duration).toBe(0);
      expect(item.x + MARKER / 2).toBe(projectTime(item.start, result, 12));
    }
    expect(result.items[0].start + DAY).toBe(result.items[1].start);
  });
  it('sticky-label-visible-intersection: hides text before icons and never crosses the visible bar', () => {
    for (const scroll of [0, 100, 240, 470, 510, 540]) {
      const label = visibleLabel(80, 440, scroll, 220);
      const left = 80 + label.left, end = left + label.width;
      if (label.width) {
        expect(left).toBe(Math.max(80, scroll) + 8);
        expect(end).toBeLessThanOrEqual(Math.min(520, scroll + 220));
      }
      expect(label.icon).toBe(label.width >= 16);
      expect(label.textWidth).toBe(Math.max(0, label.width - 22));
      if (scroll >= 510) expect(label.icon).toBe(false);
    }
  });
  it('direction-and-axis-independent: mirrors dates and tracks independently, retaining original durations', () => {
    const data = fixture('direction-and-axis-independent');
    const a = layoutTimeline({ ...data, axisPosition: 'top' }, reference);
    for (const direction of ['ascending', 'descending'] as const) for (const axisPosition of ['top', 'bottom'] as const) {
      const b = layoutTimeline({ ...data, direction, axisPosition }, reference);
      for (const item of b.items) {
        const original = a.items.find(other => other.key === item.key)!;
        expect(item.width).toBeGreaterThan(0);
        expect(item.lane).toBe(original.lane);
        expect(item.duration).toBe(original.duration);
        expect(item.width).toBeCloseTo(original.width);
        expect(direction === 'ascending' ? item.x : b.width - item.x - item.width).toBeCloseTo(original.x);
        if (axisPosition === 'bottom') expect(item.top + original.top).toBe(b.height - 32);
      }
    }
  });
  it('zoom-preserves-time-anchor: preserves the center time and clamps only at boundaries', () => {
    const domain = { start: date('2000'), end: date('2030') };
    for (const descending of [true, false]) for (const scale of [.1, .2, .4, .1]) {
      const time = date('2013-08-20');
      const scroll = anchoredScroll(time, .5, 400, domain, scale, descending);
      expect(unprojectTime(scroll + 200, domain, scale, descending)).toBeCloseTo(time);
      const edge = anchoredScroll(date('2000-01-02'), .5, 400, domain, scale, descending);
      expect(edge).toBeGreaterThanOrEqual(0);
      expect(edge).toBeLessThanOrEqual((domain.end - domain.start) / DAY * scale + EDGE * 2 - 400);
    }
  });
  it('ultrawide-resize-preserves-scale: reveals more time at a constant user scale', () => {
    const domain = { start: date('2000'), end: date('2030') };
    for (const width of [700, 1300, 2200]) {
      const scroll = anchoredScroll(date('2017-07-01'), .5, width, domain, .3);
      const visible = unprojectTime(scroll + width, domain, .3) - unprojectTime(scroll, domain, .3);
      expect(visible / DAY).toBeCloseTo(width / .3);
    }
  });
  it('keeps a meaningful center when the full domain fits and clamps a pre-resize anchor at the boundary', () => {
    const domain = { start: date('2022'), end: date('2027') };
    for (const descending of [false, true]) {
      const center = viewportTime(0, 3440, domain, .6, descending);
      expect(center).toBe((domain.start + domain.end) / 2);
      const scroll = anchoredScroll(center, .5, 390, domain, .6, descending);
      expect(viewportTime(scroll, 390, domain, .6, descending)).toBeCloseTo(center);
    }
  });
  it('identical-date-cluster-list: keeps every identical-date member individually addressable', () => {
    for (const scale of [.02, .6, 64]) {
      const result = layoutTimeline(fixture('identical-date-cluster-list'), reference, scale);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].members).toHaveLength(6);
      expect(chronological(result.items[0].members, true).map(item => item.event.id)).toEqual(['same-alpha', 'same-beta', 'same-delta', 'same-epsilon', 'same-gamma', 'same-zeta']);
    }
  });
  it('category-local-clustering-long-bars-retained: preserves all entries, colors and actual duration priority', () => {
    const data = fixture('category-local-clustering-long-bars-retained');
    const result = layoutTimeline(data, reference, 6);
    expect(result.items.find(item => item.event?.id === 'long-range')?.compact).toBe(false);
    expect(ids(result)).toEqual(normalizeTimeline(data, reference).events.map(item => item.key).sort());
    for (const item of result.items) {
      expect(new Set(item.members.map(member => member.category.id))).toEqual(new Set([item.category.id]));
      expect(item.duration).toBe(Math.max(...item.members.map(member => member.duration)));
    }
  });
  it('bounded-cluster-chain: bounds transitive groups rather than swallowing the full chain', () => {
    const normalized = normalizeTimeline(fixture('bounded-cluster-chain'), reference);
    const result = clusterTimeline(normalized.events, normalized, 20, false, [], true, { join: 22, maxSpan: 45 });
    expect(result.map(item => item.members.length)).toEqual([3, 2]);
    for (const item of result) expect((item.end - item.start) / DAY * 20).toBeLessThanOrEqual(45);
    expect(result.flatMap(item => item.members)).toHaveLength(5);
  });
  it('cluster-hysteresis: separates entry and exit thresholds with deterministic previous state', () => {
    const normalized = normalizeTimeline(fixture('cluster-hysteresis'), reference);
    let previous: string[][] = [];
    const states = [30, 33, 35, 38, 35, 32].map(scale => {
      const result = clusterTimeline(normalized.events, normalized, scale, false, previous, true, { join: 32, split: 38 });
      expect(clusterTimeline(normalized.events, normalized, scale, false, previous, true, { join: 32, split: 38 })).toEqual(result);
      previous = result.filter(item => item.cluster).map(item => item.members.map(member => member.key));
      return previous.length > 0;
    });
    expect(states).toEqual([true, true, true, false, false, true]);
  });
  it('filtering-preserves-view-and-focus: retains the full domain and restores deterministic layout', () => {
    const data = fixture('filtering-preserves-view-and-focus');
    const all = layoutTimeline(data, reference, .4);
    for (const hidden of [['programme'], ['publications'], data.categories.map(c => c.id)]) {
      const filtered = layoutTimeline(data, reference, .4, hidden);
      expect([filtered.start, filtered.end, filtered.width]).toEqual([all.start, all.end, all.width]);
      expect(filtered.items.every(item => !hidden.includes(item.category.id))).toBe(true);
    }
    expect(layoutTimeline(data, reference, .4).items).toEqual(all.items);
  });
  it('fixed-reference-ongoing-and-future: retains precedence, explicit future dates and one shared clock', () => {
    const data = fixture('fixed-reference-ongoing-and-future');
    const result = normalizeTimeline(data, '2026-11-26');
    expect(result.events.find(item => item.event.id === 'ongoing')?.end).toBe(date(reference));
    expect(result.events.find(item => item.event.id === 'future-point')?.start).toBe(date('2027-04-08'));
    expect(result.events.find(item => item.event.id === 'future-period')?.end).toBe(date('2027-06-01'));
    for (const [options, expected] of [[{ end: '2026-12-31', referenceDate: reference }, '2026-12-31'], [{ referenceDate: reference }, reference], [{}, '2026-11-26']] as const) {
      expect(normalizeTimeline(section([period('ongoing', '2020')], options), '2026-11-26').events[0].end).toBe(date(expected));
    }
    expect(normalizeTimeline(section([period('future-open', '2030')]), reference).events).toHaveLength(0);
  });
  it('date-precision-timezones: preserves UTC precision, DST days, small years and label fallback', () => {
    const events = normalizeTimeline(fixture('date-precision-timezones'), reference).events;
    for (const zone of ['UTC', 'Europe/Berlin', 'America/Los_Angeles']) {
      const before = process.env.TZ;
      try {
        process.env.TZ = zone;
        expect(eventDateLabel(events.find(item => item.event.id === 'year-only')!.event)).toBe('2019');
        expect(eventDateLabel(events.find(item => item.event.id === 'month-only')!.event)).toBe('Mar 2024');
        expect(eventDateLabel(events.find(item => item.event.id === 'day-only')!.event)).toBe('31 Mar 2024');
        expect(events.find(item => item.event.id === 'dst-period')!.duration).toBe(2 * DAY);
        expect(new Date(date('0042-03-01')).getUTCFullYear()).toBe(42);
      } finally { process.env.TZ = before; }
    }
    const event = events[0].event;
    expect(eventLabel({ ...event, label: '  ' })).toBe(event.title);
    expect(eventLabel({ ...event, label: 'Short' })).toBe('Short');
    expect(eventDateLabel(period('ongoing', '2022'), 'de-DE', 'Heute')).toBe('2022 – Heute');
  });
  it('invalid-dates-and-zero-duration: rejects invalid values without corrupting valid geometry', () => {
    const data = fixture('invalid-dates-and-zero-duration');
    const result = layoutTimeline(data, reference, 4);
    expect(result.invalid).toHaveLength(5);
    expect(ids(result)).toHaveLength(4);
    const zero = result.items.find(item => item.event?.id === 'zero-duration-period')!;
    expect(zero.event?.type).toBe('period'); expect(zero.duration).toBe(0); expect(zero.compact).toBe(true);
    for (const item of result.items) expect([item.x, item.width, item.top].every(Number.isFinite)).toBe(true);
    const first = result.events.find(item => item.event.id === 'adjacent-first')!, second = result.events.find(item => item.event.id === 'adjacent-second')!;
    expect(first.end).toBe(second.start);
    for (const options of [{ start: 'bad' }, { end: 'bad' }, { start: '2026', end: '2020' }]) expect(layoutTimeline(section([period('a', '2022')], options), reference).items).toEqual([]);
    for (const value of ['2023-02-29', '2024-13', '2024-04-31', '24', '2024-1', '0000', '2024-01-01T00:00Z']) expect(parseTimelineDate(value)).toBeUndefined();
  });
});

describe('SSR, examples and shared-track invariants', () => {
  it('cluster-window-interaction and responsive-stage-and-long-labels retain all native disclosures before hydration', () => {
    const { body } = render(TimelineSection, { props: { section: timelineExample } });
    expect(body).toContain('data-enhanced="false"');
    expect(body.match(/<details /g)).toHaveLength(56);
    expect(body).toContain('timeline-campus-dark.svg');
    expect(body).toContain('loading="lazy"');
    expect(body).toContain('Back to the timeline');
    expect(body).toContain('aria-label="Tags"');
    expect(body).not.toContain('aria-pressed');
    expect(body).not.toContain('role="dialog"');
    expect(body).toContain('ps-section-stage');
    const minimal = section([{ id: 'bare', type: 'point', date: '2022', title: 'Bare event' }]);
    const rendered = render(Sections, { props: { sections: [minimal] } }).body;
    expect(rendered).toContain('<summary'); expect(rendered).not.toContain('<picture');
  });
  it('derives both English examples and rewrites instance links and asset base paths without source mutation', () => {
    const before = JSON.stringify(timelineExample);
    const full = timelineExampleFor('/prefix', 'full'), compact = timelineExampleFor('/prefix', 'compact', true);
    expect(full.categories.flatMap(c => c.events)).toHaveLength(56);
    expect(compact.categories.flatMap(c => c.events)).toHaveLength(18);
    expect(compact.introduction).toContain('fictional');
    expect(compact.locale).toBe('en-GB'); expect(compact.direction).toBe('descending');
    expect(compact.end).toBeUndefined();
    expect(compact.categories.flatMap(c => c.events).find(e => e.action)?.action?.href).toBe('#compact');
    expect(full.categories.flatMap(c => c.events).find(e => e.image)?.image?.src).toMatch(/^\/prefix\/timeline-/);
    expect(JSON.stringify(timelineExample)).toBe(before);
  });
  it('clipping and label length never change original duration priority or time geometry', () => {
    const data = section([period('a', '2000', '2026'), period('b', '2020', '2025')], { start: '2022', end: '2024', clustering: false });
    const result = layoutTimeline(data, reference);
    expect(result.items[0].event?.id).toBe('a');
    data.categories[0].events[0].label = 'A very long label '.repeat(200);
    expect(layoutTimeline(data, reference).items.map(({ x, width, lane }) => ({ x, width, lane }))).toEqual(result.items.map(({ x, width, lane }) => ({ x, width, lane })));
  });
  it('a deterministic 400-event dataset represents every source once and obeys every priority edge', () => {
    const data = section([]);
    data.categories = Array.from({ length: 4 }, (_, c) => ({ id: String(c), title: String(c), color: '#168d91', events: Array.from({ length: 100 }, (_, i) => ({ type: 'point' as const, id: String(i), title: String(i), date: new Date(date('2020') + ((i * 37) % 700) * DAY).toISOString().slice(0, 10) })) }));
    const result = layoutTimeline(data, reference);
    expect(ids(result)).toHaveLength(400); expect(new Set(ids(result)).size).toBe(400);
    for (const a of result.items) for (const b of result.items) if (priorityOrder(a, b) < 0 && collides(a, b)) expect(a.lane).toBeLessThan(b.lane);
  });
});
