// Extracted from Spatial Elements Beta.8; see NOTICE.
import tokens from './layoutTokens.json' with { type: 'json' };
import type { CardMediaAspect, CardMediaFit } from './types.js';

/** Canonical values also consumed by the generated, SSR-safe stylesheet. */
export const layoutTokens = tokens;
export const contentGridSizes = ['xs', 's', 'm', 'l'] as const;
export const viewportLayoutSizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'] as const;
export type ContentGridSize = typeof contentGridSizes[number];
export type ViewportLayoutSize = typeof viewportLayoutSizes[number];
export type LayoutCardSize = keyof typeof tokens.cards;
export type ContentSpan = number | Partial<Record<ContentGridSize, number>>;
export interface LayoutRect { x: number; y: number; width: number; height: number }
export interface LayoutInsets { top: number; right: number; bottom: number; left: number }
export interface ResponsiveLayoutInput {
	width: number;
	/** Reserved classic scrollbar/gutter width. Media-query width remains `width`. */
	scrollbarWidth?: number;
	/** Stable CSS layout height, supplied by the viewport owner; never physical screen height. */
	height: number;
	safeArea?: Partial<LayoutInsets>;
}
const size = (value: number | undefined) => Number.isFinite(value) ? Math.max(0, value!) : 0;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function resolveViewportLayout(width: number): ViewportLayoutSize {
	const w = size(width);
	return [...viewportLayoutSizes].reverse().find((name) => w >= tokens.layoutMinWidths[name]) ?? 'xs';
}

/** Canonical page/menu rectangles in CSS pixels. Reading widths do not change this geometry. */
export function resolvePageLayout(input: ResponsiveLayoutInput) {
  const viewport = size(input.width);
  const available = Math.max(0, viewport - size(input.scrollbarWidth));
  const left = Math.min(available, size(input.safeArea?.left));
  const right = Math.min(available - left, size(input.safeArea?.right));
  const width = available - left - right;
  const layout = resolveViewportLayout(viewport);
  const wide = viewport >= tokens.layoutMinWidths.xl;
  const contentWidth = Math.min(tokens.contentMax, Math.max(0, width - (layout === 'xl' ? 2 * tokens.xlContentInset : 0)));
  const content = { x: left + (width - contentWidth) / 2, width: contentWidth };
  return { layout, content, menu: { x: wide ? content.x : left, width: wide ? content.width : width,
    y: size(input.safeArea?.top) + (wide ? tokens.menu.wideTop : 0), height: wide ? tokens.menu.wideHeight : tokens.menu.height } };
}

/** Offset shared by native and enhanced navigation shells. */
export function resolveMenuOffset(scrollY: number, fixed = false): number {
  const delta = size(scrollY) - tokens.menu.scrollThreshold;
  return fixed || delta <= 0 ? 0 : -delta;
}

/** Width includes the grid's two outer margins, implemented once as section padding. */
export function resolveContentGrid(width: number) {
	const w = Math.min(size(width), tokens.contentMax);
	const name = [...contentGridSizes].reverse().find((key) => w >= tokens.grid[key].minWidth) ?? 'xs';
	const grid = tokens.grid[name];
	return {
		size: name,
		width: w,
		...grid,
		columnWidth: Math.max(0, (w - (grid.columns + 1) * grid.gap) / grid.columns)
	};
}

/** Mobile-first spans inherit; omitted/invalid spans fill the row, excessive spans clamp. */
export function resolveContentSpan(span: ContentSpan | undefined, grid: ContentGridSize): number {
	let requested: number | undefined = typeof span === 'number' ? span : undefined;
	if (span && typeof span === 'object') {
		for (const key of contentGridSizes) {
			if (span[key] !== undefined) requested = span[key];
			if (key === grid) break;
		}
	}
	const columns = tokens.grid[grid].columns;
	return requested !== undefined && Number.isInteger(requested) && requested > 0
		? Math.min(requested, columns) : columns;
}

export function contentSpanWidth(width: number, span: number) {
	const grid = resolveContentGrid(width);
	const columns = resolveContentSpan(span, grid.size);
	return Math.min(grid.width, columns * grid.columnWidth + (columns - 1) * grid.gap);
}

export interface CardLayoutOptions {
  mediaAspect?: CardMediaAspect;
  mediaFit?: CardMediaFit;
  /** Set from the entire collection, so missing eyebrows keep their allocated row. S always hides it. */
  reserveEyebrow?: boolean;
}

/** Default catalog geometry in CSS pixels; media is the actual poster/3D fitting rectangle. */
export function resolveCardLayout(containerWidth: number, cardSize: LayoutCardSize = 'm', options: CardLayoutOptions = {}) {
	const grid = resolveContentGrid(containerWidth);
	const card = tokens.cards[cardSize];
	const span = cardSize === 'l' && grid.size === 's' ? tokens.cards.l.gridSSpan : card.span;
	const width = contentSpanWidth(grid.width, span);
	const aspect = options.mediaAspect ?? '3/2';
	const [horizontal, vertical] = aspect.split('/').map(Number);
	const mediaHeight = width * vertical / horizontal;
	const eyebrowRows = cardSize !== 's' && options.reserveEyebrow ? 1 : 0;
	const textHeight = (card.rows + eyebrowRows) * card.lineHeight + 2 * tokens.cardTextInset.block;
	const inset = options.mediaFit === 'cover' ? 0 : Math.min(tokens.cardMediaInset, width / 2, mediaHeight / 2);
	return {
		...card,
		span, width, height: mediaHeight + textHeight, textHeight, eyebrowRows,
		mediaFrame: { x: 0, y: 0, width, height: mediaHeight },
		media: { x: inset, y: inset, width: Math.max(0, width - 2 * inset), height: Math.max(0, mediaHeight - 2 * inset) }
	};
}

