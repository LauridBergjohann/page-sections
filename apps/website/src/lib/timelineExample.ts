import type { TimelineSectionData } from '@page-sections/core';
import { timelineShowcase } from './timelineShowcase.js';
import selection from './timeline-overview.selection.json';

export const timelineExample = timelineShowcase;

/** Resolve composite identities without mutating the canonical English source. */
export function timelineExampleFor(
  base: string,
  id = timelineExample.id,
  overview = false
): TimelineSectionData {
  const keys = new Set(
    selection.eventKeys.map((key) => JSON.stringify([key.categoryId, key.eventId]))
  );
  const overrides: Partial<TimelineSectionData> = overview
    ? { ...selection.sectionOverrides, direction: 'descending' }
    : {};
  return {
    ...timelineExample,
    ...overrides,
    id,
    locale: 'en-GB',
    categories: timelineExample.categories.map((category) => ({
      ...category,
      events: category.events
        .filter((event) => !overview || keys.has(JSON.stringify([category.id, event.id])))
        .map((event) => ({
          ...event,
          image: event.image
            ? {
                ...event.image,
                src: base + event.image.src,
                srcDark: event.image.srcDark ? base + event.image.srcDark : undefined
              }
            : undefined,
          action:
            event.action?.href === '#' + timelineExample.id
              ? { ...event.action, href: '#' + id }
              : event.action
        }))
    }))
  };
}
