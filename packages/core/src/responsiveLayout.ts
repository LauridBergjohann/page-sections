// Extracted from Spatial Elements Beta.8; see NOTICE.
import tokens from './layoutTokens.json' with { type: 'json' };

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

/** Uses the same slot for poster containment and measured 3D fitting. */
export function resolveCardLayout(containerWidth: number, cardSize: LayoutCardSize = 'm') {
	const grid = resolveContentGrid(containerWidth);
	const card = tokens.cards[cardSize];
	const span = cardSize === 'l' && grid.size === 's' ? tokens.cards.l.gridSSpan : card.span;
	const width = contentSpanWidth(grid.width, span);
	const textHeight = Math.min(width, Math.max(width / 4, card.rows * card.lineHeight + 2 * tokens.cardTextInset.block));
	const availableHeight = width - textHeight;
	const fitWidth = Math.min(width, availableHeight * 4 / 3);
	const fitHeight = fitWidth * 3 / 4;
	return {
		...card,
		span, width, height: width, textHeight,
		media: { x: (width - fitWidth) / 2, y: (availableHeight - fitHeight) / 2, width: fitWidth, height: fitHeight }
	};
}

