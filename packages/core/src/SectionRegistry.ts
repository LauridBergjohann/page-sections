import type { SectionDefinition, SectionNavigationItem } from './types.js';
export const SECTION_REGISTRY = Symbol('page-section-registry');
/** Beta.8 lifecycle registry, with ordering for keyed moves and detached snapshots. */
export class SectionRegistry {
  private entries = new Map<symbol, SectionNavigationItem>();
  constructor(private readonly changed: () => void = () => {}) {}
  get sections(): SectionNavigationItem[] { return [...this.entries.values()].map(item => ({ ...item })); }
  register(section: SectionDefinition) {
    const token = Symbol(section.id);
    const update = (next: SectionDefinition) => {
      if (!/^[a-z][a-z0-9-]*$/.test(next.id) || !next.title.trim()) throw new Error('Sections require a lowercase anchor and non-empty title.');
      for (const [key, item] of this.entries) if (key !== token && item.id === next.id) throw new Error(`Duplicate section id "${next.id}".`);
      const previous = this.entries.get(token);
      if (previous?.id === next.id && previous.title === next.title) return;
      this.entries.set(token, { id: next.id, title: next.title });
      this.changed();
    };
    update(section);
    return { update: (next: SectionDefinition) => { if (this.entries.has(token)) update(next); }, unregister: () => { if (this.entries.delete(token)) this.changed(); } };
  }
  order(ids: readonly string[]) {
    const positions = new Map(ids.map((id, index) => [id, index]));
    const entries = [...this.entries];
    const ordered = [...entries].sort((a, b) => (positions.get(a[1].id) ?? Infinity) - (positions.get(b[1].id) ?? Infinity));
    if (ordered.every(([token], i) => entries[i][0] === token)) return;
    this.entries = new Map(ordered);
    this.changed();
  }
}
