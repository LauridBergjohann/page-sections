import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { TimelineSection, Sections } from '../packages/svelte/src/index.js';
import { assignTimelineLanes, eventDateLabel, layoutTimeline, parseTimelineDate } from '../packages/svelte/src/timeline.js';
import type { TimelineEvent, TimelineSectionData } from '@page-sections/core';
import { timelineExample } from '../apps/website/src/lib/timelineExample.js';

const section = (events: TimelineEvent[], options: Partial<TimelineSectionData> = {}): TimelineSectionData => ({
  type: 'timeline', id: 'test', title: 'Test', categories: [{ id: 'one', title: 'One', color: '#168d91', events }], ...options
});
const period = (id: string, start: string, end?: string): TimelineEvent => ({ id, title: id, type: 'period', start, end });

describe('calendar dates', () => {
  it('accepts exact year/month/day precision in UTC, including years below 100', () => {
    expect(parseTimelineDate('2024')).toBe(Date.UTC(2024, 0, 1));
    expect(parseTimelineDate('2024-02')).toBe(Date.UTC(2024, 1, 1));
    expect(parseTimelineDate('2024-02-29')).toBe(Date.UTC(2024, 1, 29));
    expect(new Date(parseTimelineDate('0099')!).getUTCFullYear()).toBe(99);
    for (const date of ['2023-02-29', '2024-13', '2024-04-31', '24', '2024-1', '0000', '2024-01-01T00:00Z', 'garbage']) expect(parseTimelineDate(date)).toBeUndefined();
  });
  it('preserves date precision and custom ongoing labels', () => {
    expect(eventDateLabel({ id: 'p', title: 'P', type: 'point', date: '2024' })).toBe('2024');
    expect(eventDateLabel({ id: 'p', title: 'P', type: 'point', date: '2024-02' })).toBe('Feb 2024');
    expect(eventDateLabel({ id: 'p', title: 'P', type: 'point', date: '2024-02-29' })).toBe('29 Feb 2024');
    expect(eventDateLabel(period('p', '2022'), 'de-DE', 'Heute')).toBe('2022 – Heute');
  });
});

describe('interval partitioning and labels', () => {
  const intervals = [period('a', '2020', '2024'), period('b', '2021', '2023'), period('c', '2022', '2025'), period('d', '2023', '2026'), period('e', '2026', '2027')].map(event => ({ event, start: parseTimelineDate(event.type === 'period' ? event.start : '')!, end: parseTimelineDate(event.type === 'period' ? event.end : '')! }));
  it('uses minimum lanes, reuses them at boundaries, and ignores input order', () => {
    const result = assignTimelineLanes(intervals);
    expect(result.map(item => [item.event.id, item.lane])).toEqual([['a', 0], ['b', 1], ['c', 2], ['d', 1], ['e', 0]]);
    expect(assignTimelineLanes([...intervals].reverse())).toEqual(result);
  });
  it('separates simultaneous points and clustered labels deterministically', () => {
    const events: TimelineEvent[] = ['z', 'a', 'b'].map(id => ({ id, title: id, type: 'point', date: '2024-06-01' }));
    const layout = layoutTimeline(section(events), '2026');
    expect(layout.categories[0].events.map(item => [item.event.id, item.lane, item.labelLane])).toEqual([['a', 0, 0], ['b', 1, 1], ['z', 2, 2]]);
  });
  it('uses measured label footprints, including tall final labels', () => {
    const data = section([period('a', '2020', '2021'), period('b', '2021', '2022')], { start: '2020', end: '2022' });
    const result = layoutTimeline(data, '2026', { '["one","a"]': 400, '["one","b"]': 900 });
    expect(result.categories[0].events.map(item => item.labelLane)).toEqual([0, 1]);
    expect(result.contentHeight).toBeGreaterThan(result.height + 116);
  });
  it('stacks labels when only one column fits, and uses horizontal space when available', () => {
    const data = section(['a', 'b', 'c'].map(id => ({ id, title: id, type: 'point', date: '2024' })));
    const heights = Object.fromEntries(['a', 'b', 'c'].map(id => [JSON.stringify(['one', id]), 80]));
    const narrow = layoutTimeline(data, '2026', heights, { one: 300 }).categories[0];
    expect(narrow.events.map(item => item.labelLane)).toEqual([0, 0, 0]);
    expect(narrow.events.map(item => item.labelTop)).toEqual([0, 80, 160]);
    const wide = layoutTimeline(data, '2026', heights, { one: 900 }).categories[0];
    expect(wide.events.map(item => item.labelLane)).toEqual([0, 1, 2]);
    expect(wide.events.map(item => item.labelTop)).toEqual([0, 0, 0]);
    for (const category of [narrow, wide]) for (const item of category.events) {
      expect(item.labelLeft + item.labelWidth).toBeLessThanOrEqual(category.width);
    }
  });
  it('fits dense marker lanes without labels and does not cap long timelines', () => {
    const data = section(Array.from({ length: 12 }, (_, i) => period(String(i), '1900', '2026')));
    const result = layoutTimeline(data, '2026', {}, { one: 90 });
    expect(result.height).toBeGreaterThan(6000);
    for (const item of result.categories[0].events) {
      expect(item.labelsVisible).toBe(false);
      expect(item.markerLeft + item.markerWidth).toBeLessThanOrEqual(90);
      expect(item.markerWidth).toBeGreaterThan(0);
    }
  });
});

describe('shared scale and validation', () => {
  it('mirrors the axis and clipped periods while preserving dates and interval lanes', () => {
    const data = section([period('older', '2018', '2021'), period('current', '2021'), period('overlap', '2022', '2025'), { id: 'point', title: 'Point', type: 'point', date: '2023-06' }], { start: '2020', end: '2024' });
    const ascending = layoutTimeline(data, '2026');
    const descending = layoutTimeline({ ...data, direction: 'descending' }, '2026');
    expect(descending.ticks.map(tick => tick.label)).toEqual(ascending.ticks.map(tick => tick.label).reverse());
    expect(descending.ticks[0].top).toBe(0);
    expect(descending.ticks.at(-1)!.top).toBe(descending.height);
    for (const down of descending.categories[0].events) {
      const up = ascending.categories[0].events.find(item => item.event.id === down.event.id)!;
      expect(down.lane).toBe(up.lane);
      expect(down.height).toBeCloseTo(up.height);
      expect(down.top + up.top + (down.event.type === 'point' ? 0 : down.height)).toBeCloseTo(ascending.height);
      expect([down.start, down.end]).toEqual([up.start, up.end]);
    }
  });
  it('orders newest-first labels visually, including ongoing events sharing an end', () => {
    const data = section([period('a', '2020'), period('b', '2023'), period('c', '2022')], { end: '2026', direction: 'descending' });
    const result = layoutTimeline(data, '2026', {}, { one: 330 });
    const events = result.categories[0].events;
    expect(events.map(item => item.event.id)).toEqual(['b', 'c', 'a']);
    expect(events.map(item => item.top)).toEqual([0, 0, 0]);
    expect(events.map(item => item.labelTop)).toEqual([0, 116, 232]);
    expect(layoutTimeline({ ...data, categories: [{ ...data.categories[0], events: [...data.categories[0].events].reverse() }] }, '2026', {}, { one: 330 })).toEqual(result);
  });
  it('positions dates proportionally and clips explicit windows', () => {
    const result = layoutTimeline(section([period('one', '2019', '2025'), period('outside', '2010', '2011'), { type: 'point', id: 'middle', title: 'Middle', date: '2022' }], { start: '2020', end: '2024' }), '2026');
    expect(result.categories[0].events).toHaveLength(2);
    expect(result.categories[0].events[0].top).toBe(0);
    expect(result.categories[0].events[0].height).toBe(result.height);
    const expected = (Date.UTC(2022, 0, 1) - Date.UTC(2020, 0, 1)) / (Date.UTC(2024, 0, 1) - Date.UTC(2020, 0, 1)) * result.height;
    expect(result.categories[0].events[1].top).toBe(expected);
  });
  it('uses configured end before referenceDate for ongoing events', () => {
    for (const options of [{ referenceDate: '2025' }, { referenceDate: '2024', end: '2025' }]) {
      const result = layoutTimeline(section([period('ongoing', '2020')], options), '2026');
      expect(result.categories[0].events[0].end).toBe(parseTimelineDate('2025'));
    }
  });
  it('excludes periods touching only a window boundary but includes boundary points', () => {
    const result = layoutTimeline(section([period('before', '2019', '2020'), period('after', '2024', '2025'), { id: 'point', title: 'Point', type: 'point', date: '2024' }], { start: '2020', end: '2024' }), '2026');
    expect(result.categories[0].events.map(item => item.event.id)).toEqual(['point']);
  });
  it('handles empty, reversed, invalid and duplicate data without NaN or unstable keys', () => {
    expect(layoutTimeline(section([]), '2026').categories[0].events).toEqual([]);
    const events = [period('bad', 'invalid'), period('reverse', '2025', '2020'), period('duplicate', '2020'), period('duplicate', '2021')];
    expect(layoutTimeline(section(events), '2026').categories[0].events).toEqual([]);
    for (const options of [{ start: 'bad' }, { end: 'bad' }, { start: '2026', end: '2020' }]) expect(layoutTimeline(section([period('a', '2022')], options), '2026').categories[0].events).toEqual([]);
  });
});

describe('SSR component and renderer', () => {
  it('renders newest-first native disclosures and decorative event icons', () => {
    const data = section([
      { id: 'old', title: 'First release', type: 'point', date: '2024', icon: 'rocket' },
      { id: 'new', title: 'Latest release', type: 'point', date: '2026', icon: 'git-pull-request' }
    ], { direction: 'descending' });
    const { body } = render(TimelineSection, { props: { section: data } });
    expect(body.indexOf('data-event="new"')).toBeLessThan(body.indexOf('data-event="old"'));
    expect(body).toContain('event-icon');
    expect(body).toContain('<svg');
    expect(body).toContain('aria-label="Latest release, 2026"');
  });
  it('renders chronological native disclosures and optional details without dead buttons', () => {
    const { body } = render(TimelineSection, { props: { section: timelineExample } });
    expect(body).toContain('data-enhanced="false"');
    expect(body).toContain('<summary');
    expect(body).toContain('Illustration of the Northbridge campus');
    expect(body).toContain('loading="lazy"');
    expect(body).toContain('timeline-campus-dark.svg');
    expect(body).toContain('href="https://example.com/certificate"');
    expect(body).toContain('aria-label="Tags"');
    expect(body).not.toContain('aria-pressed');
    expect(body).not.toContain('Close details');
    expect(body).not.toMatch(/<details[^>]*\sopen(?:\s|>)/);
    expect(body.indexOf('data-event="bachelor"')).toBeLessThan(body.indexOf('data-event="master"'));
  });
  it('integrates JSON models and common Section metadata; omits absent optional markup', () => {
    const data = section([{ id: 'bare', type: 'point', date: '2022', title: 'Bare event' }], { headline: 'Visible heading', background: { color: 'muted' } });
    const { body } = render(Sections, { props: { sections: JSON.parse(JSON.stringify([data])) } });
    expect(body).toContain('data-ps-section="test"');
    expect(body).toContain('data-background-color="muted"');
    expect(body).toContain('Visible heading');
    expect(body).not.toContain('<picture');
    expect(body).not.toContain('class="tags');
    expect(body).not.toContain('data-action');
  });
});
