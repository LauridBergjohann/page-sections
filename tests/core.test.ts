import { describe, expect, it } from 'vitest';
import { resolveContentGrid, resolveContentSpan, contentSpanWidth, resolvePageLayout, resolveCardLayout, resolveMenuOffset, SectionRegistry, SectionSurfaceRegistry, normalizeSectionBackground, safeHref, themeStyle } from '../packages/core/src/index.js';
describe('Beta.8 layout extraction', () => {
  it.each([[599.9, 'xs', 4], [600, 's', 6], [839.9, 's', 6], [840, 'm', 8], [1200, 'l', 12], [2500, 'l', 12]])('resolves %s container pixels', (width, size, columns) => { expect(resolveContentGrid(Number(width))).toMatchObject({ size, columns }); });
  it('retains single outer gutters and fractional span widths', () => { expect(contentSpanWidth(840, 8)).toBe(808); expect(contentSpanWidth(840, 3)).toBe(293); expect(resolveContentGrid(-2).width).toBe(0); expect(resolveContentGrid(Infinity).width).toBe(0); });
  it('inherits responsive spans and clamps invalid values', () => { expect(resolveContentSpan({ s: 3 }, 'xs')).toBe(4); expect(resolveContentSpan({ s: 3 }, 'l')).toBe(3); expect(resolveContentSpan(20, 'xs')).toBe(4); expect(resolveContentSpan(1.2, 'm')).toBe(8); });
});
describe('section registries', () => {
  it('updates, reorders, rejects duplicate ids and unregisters', () => { const registry = new SectionRegistry(); const a = registry.register({ id: 'a', title: 'A' }); registry.register({ id: 'b', title: 'B' }); expect(() => registry.register({ id: 'a', title: 'Other' })).toThrow(/Duplicate/); a.update({ id: 'a', title: 'Changed' }); registry.order(['b', 'a']); expect(registry.sections.map(x => x.title)).toEqual(['B', 'Changed']); const snapshot = registry.sections; snapshot[0].title = 'Mutation'; expect(registry.sections[0].title).toBe('B'); a.unregister(); a.update({ id: 'c', title: 'Detached' }); expect(registry.sections).toHaveLength(1); });
  it('keeps requests independent', () => { const a = new SectionRegistry(); a.register({ id: 'a', title: 'A' }); expect(new SectionRegistry().sections).toEqual([]); });
  it('joins adjacent surfaces and splits them at transparent sections', () => { const registry = new SectionSurfaceRegistry(); const a = registry.register({ color: 'standard', size: 'standard' }); const b = registry.register({ color: 'muted', size: 'standard' }); registry.register({ color: 'transparent', size: 'standard' }); expect(registry.corners.slice(0, 2)).toEqual([{ id: a.id, top: true, bottom: false }, { id: b.id, top: false, bottom: true }]); b.unregister(); expect(registry.corners[0].bottom).toBe(true); });
});
it('normalizes background gradients without GPU dependencies', () => { expect(normalizeSectionBackground({ color: 'standardToMuted' })).toMatchObject({ color: 'muted', gradient: false }); expect(normalizeSectionBackground({ color: 'standardToMuted', size: 'full' }).cssBackground).toContain('linear-gradient'); });
it('rejects executable URLs and CSS declaration injection', () => { expect(safeHref('java\nscript:alert(1)')).toBeUndefined(); expect(safeHref('/hello')).toBe('/hello'); expect(() => themeStyle({ ink: 'red;display:none' })).toThrow(); });
it('maps independent panel surfaces without changing the content surface', () => {
  expect(themeStyle({ panelBackground: '#f0f3f5', standard: '#fff' })).toBe('--ps-panel-background:#f0f3f5;--ps-section-standard:#fff');
  expect(themeStyle()).not.toContain('--ps-panel-background');
  expect(() => themeStyle({ panelBackground: 'red;display:none' })).toThrow();
});
it('uses spatial-elements units and limits for the panel material', () => {
  expect(themeStyle({ panelTintOpacity: undefined, panelBackdropBlur: undefined })).toBe('');
  expect(themeStyle({ panelTintOpacity: 0.65, panelBackdropBlur: 8 })).toBe('--ps-panel-tint-opacity:0.65;--ps-panel-backdrop-blur:8px');
  expect(themeStyle({ panelTintOpacity: -1, panelBackdropBlur: 150 })).toBe('--ps-panel-tint-opacity:0;--ps-panel-backdrop-blur:100px');
  expect(themeStyle({ panelTintOpacity: 2, panelBackdropBlur: -4 })).toBe('--ps-panel-tint-opacity:1;--ps-panel-backdrop-blur:0px');
  expect(themeStyle({ panelTintOpacity: 0, panelBackdropBlur: 0 })).toBe('--ps-panel-tint-opacity:0;--ps-panel-backdrop-blur:0px');
  for (const value of [NaN, Infinity, -Infinity, '8px', '1;display:none']) {
    expect(() => themeStyle({ panelTintOpacity: value as number })).toThrow(/Invalid theme property/);
    expect(() => themeStyle({ panelBackdropBlur: value as number })).toThrow(/Invalid theme property/);
  }
});

describe('shared navigation and catalog geometry', () => {
  it.each([[320, 320, 66, 0], [1599, 1599, 66, 0], [1600, 1328, 64, 16], [1808, 1536, 64, 16], [1809, 1536, 64, 16], [2300, 1536, 64, 16]])('resolves the menu at %s pixels', (width, menuWidth, height, y) => {
    expect(resolvePageLayout({ width, height: 900 }).menu).toEqual({ x: (width - menuWidth) / 2, width: menuWidth, height, y });
  });
  it('accounts for reserved scrollbar space and safe areas without changing viewport classification', () => {
    expect(resolvePageLayout({ width: 1600, height: 900, scrollbarWidth: 17, safeArea: { left: 20, right: 30, top: 10 } })).toMatchObject({ layout: 'xl', menu: { x: 156, y: 26, width: 1261, height: 64 } });
    expect(resolvePageLayout({ width: 50, height: 0, safeArea: { left: 70, right: 90 } }).menu.width).toBe(0);
  });
  it('keeps the header still for the first 32 scroll pixels', () => {
    expect([0, 31, 32, 33, 200].map(value => resolveMenuOffset(value))).toEqual([0, 0, 0, -1, -168]);
    expect(resolveMenuOffset(200, true)).toBe(0);
  });
  it.each([[320, 's', 142, 2], [320, 'm', 142, 2], [320, 'l', 296, 4], [720, 'l', 336, 3], [840, 'm', 190, 2], [1536, 'm', 354, 3], [1536, 'l', 480, 4]] as const)('fits %s/%s cards into canonical spans', (width, cardSize, expected, span) => {
    const card = resolveCardLayout(width, cardSize);
    expect(card).toMatchObject({ width: expected, span });
    expect(card.mediaFrame.width / card.mediaFrame.height).toBeCloseTo(3 / 2);
    expect(card.media.y * 2 + card.media.height + card.textHeight).toBeCloseTo(card.height);
  });
  it.each([[320, [2, 2, 4]], [600, [2, 2, 3]], [840, [2, 2, 4]], [1200, [2, 3, 4]]] as const)('uses the requested card spans at %s', (width, spans) => {
    expect((['s', 'm', 'l'] as const).map(size => resolveCardLayout(width, size).span)).toEqual(spans);
  });
  it('keeps overlay geometry fixed and forces full media even when contain is requested', () => {
    const card = resolveCardLayout(1536, 'm', { contentPlacement: 'overlay', mediaAspect: '4/3', mediaFit: 'contain', reserveEyebrow: true });
    expect(card.height).toBe(265.5);
    expect(card.media).toEqual(card.mediaFrame);
    expect(card.textHeight).toBe(84);
  });
  it('allocates independent media, title and optional eyebrow space', () => {
    const compact = resolveCardLayout(320, 'm');
    const labeled = resolveCardLayout(320, 'm', { reserveEyebrow: true });
    const square = resolveCardLayout(320, 'm', { reserveEyebrow: true, mediaAspect: '1/1' });
    expect(compact.textHeight).toBe(64); // Two 20px title lines plus 24px padding.
    expect(labeled.textHeight).toBe(84); // The label never consumes a title line.
    expect(square).toMatchObject({ width: 142, height: 226, textHeight: 84, media: { x: 12, y: 12, width: 118, height: 118 } });
    expect(resolveCardLayout(320, 's', { reserveEyebrow: true }).eyebrowRows).toBe(0);
    const cropped = resolveCardLayout(320, 'm', { mediaAspect: '4/3', mediaFit: 'cover' });
    expect(cropped.media).toEqual(cropped.mediaFrame);
    expect(cropped.textHeight).toBe(compact.textHeight);
    expect(cropped.media.height).toBe(106.5);
  });
  it('normalizes full backgrounds in a detail context', () => {
    expect(normalizeSectionBackground({ color: 'standardToMuted', size: 'full' }, { pageKind: 'detail' })).toMatchObject({ size: 'standard', color: 'muted', gradient: false });
  });
});
