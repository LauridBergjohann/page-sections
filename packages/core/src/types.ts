import type { ContentSpan } from './responsiveLayout.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'm' | 'l' | 'xl';
export type PageKind = 'content' | 'detail';
export type SurfaceTone = 'standard' | 'muted';
export type CardMediaAspect = '3/2' | '4/3' | '1/1';
export type CardMediaFit = 'contain' | 'cover';
export type InlineText = string | InlineRun[];
export type InlineRun =
  | { type: 'text' | 'strong' | 'emphasis' | 'code'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'break' };
export interface ContentAction { label: string; href: string; variant?: 'primary' | 'secondary' | 'text' }
export type RichTextBlock =
  | { type: 'paragraph'; text: InlineText; variant?: 'default' | 'lead' | 'muted' }
  | { type: 'address'; name: string; lines: InlineText[] }
  | { type: 'list'; items: InlineText[]; ordered?: boolean }
  | { type: 'panel'; title?: string; blocks: RichTextBlock[]; tone?: SurfaceTone; actions?: ContentAction[] };
/** Exactly one source; Markdown keeps raw HTML disabled. */
export type RichTextContentData =
  | { body: string; format?: 'markdown' | 'text'; blocks?: never }
  | { blocks: RichTextBlock[]; body?: never; format?: never };

export type SectionBackgroundColor = 'transparent' | 'standard' | 'muted' | 'transparentToStandard' | 'transparentToMuted' | 'standardToTransparent' | 'standardToMuted' | 'mutedToTransparent' | 'mutedToStandard';
export interface SectionBackground { color: SectionBackgroundColor; size?: 'standard' | 'full' }
export interface SectionDefinition {
  id: string;
  /** Navigation/accessibility label; headline controls the visible heading, as in Beta.8. */
  title: string;
  headline?: string;
  eyebrow?: string;
  introduction?: string;
  headingLevel?: HeadingLevel;
  headingSize?: HeadingSize;
  background?: SectionBackground;
  layout?: 'full' | 'wide' | 'narrow' | 'inherit';
  spacing?: 'none' | 'tight' | 'normal' | 'loose' | 'spacious';
  divider?: 'none' | 'top' | 'bottom' | 'both';
  variant?: 'default' | 'content' | 'feature';
  style?: { width?: string; color?: string };
}
export type SectionNavigationItem = Pick<SectionDefinition, 'id' | 'title' | 'headingLevel'>;
export interface Breadcrumb { label: string; href?: string }
export interface ContentPageData { title: string; pageTitle?: string; breadcrumbs?: Breadcrumb[]; bodyLayout?: 'wide' | 'narrow'; bodySpacing?: SectionDefinition['spacing'] }
export type ImageAspect = 'none' | '4/3' | '16/9' | '2/1' | 'square';
export interface ImageData { src: string; srcDark?: string; alt: string; width?: number; height?: number; aspect?: ImageAspect; objectFit?: 'cover' | 'contain'; srcset?: string; sizes?: string }
export interface CardItem { id: string; itemKey?: string; title: string; href?: string; eyebrow?: string; description?: string; subtitle?: string; image?: ImageData; footer?: InlineText; actions?: ContentAction[] }
export type CardSize = 's' | 'm' | 'l';
export interface VideoData { src: string; provider: 'html5' | 'youtube'; poster?: string; captions?: { src: string; language: string; label: string }[] }
/** Source remains plain text; syntax tokens are an optional, derived presentation. */
export interface CodeData {
  code: string;
  language?: string;
  filename?: string;
  lineNumbers?: boolean;
  /** One-based line numbers. Invalid and out-of-range entries are ignored. */
  highlightLines?: number[];
  wrap?: boolean;
  tone?: SurfaceTone;
}
export interface CodeToken { content: string; color?: string; darkColor?: string; fontStyle?: number }
export interface HighlightedCode { code: string; language: string; lines: CodeToken[][] }
export interface CodeSectionData extends SectionDefinition, CodeData { type: 'code' }
/** Calendar dates: YYYY, YYYY-MM or YYYY-MM-DD. Missing parts mean the start of that period. */
export type TimelineDate = string;
export interface TimelineEventBase {
  id: string;
  title: string;
  /** Compact overview name. Empty labels fall back to title; details always show title. */
  label?: string;
  /** Optional Lucide key shown in the label; resolve additional keys with the eventIcon snippet. */
  icon?: string;
  description?: string | RichTextContentData;
  image?: ImageData;
  tags?: string[];
  action?: ContentAction;
}
export interface TimelinePointEvent extends TimelineEventBase { type: 'point'; date: TimelineDate }
export interface TimelinePeriodEvent extends TimelineEventBase { type: 'period'; start: TimelineDate; end?: TimelineDate }
export type TimelineEvent = TimelinePointEvent | TimelinePeriodEvent;
export interface TimelineCategory {
  id: string;
  title: string;
  color: string;
  /** Lucide icon key: graduation-cap, briefcase or bike; use the icon snippet for other Lucide icons. */
  icon?: string;
  events: TimelineEvent[];
}
export interface TimelineSectionData extends SectionDefinition {
  type: 'timeline';
  categories: TimelineCategory[];
  /** Date axis direction from left to right. Default ascending (oldest first). */
  direction?: 'ascending' | 'descending';
  /** Lane zero is nearest the axis. Default bottom. */
  axisPosition?: 'top' | 'bottom';
  /** Full page stage or embedded content width. Default full; recommended only without side navigation, which overlays the stage. */
  stageWidth?: 'full' | 'contained';
  /** Initial CSS pixels per calendar day. Default 0.6; clamped to at least the scale that fits the full timeline. */
  initialScale?: number;
  /** Group nearby compact events within their category. Default true. */
  clustering?: boolean;
  zoomLabel?: string;
  categoriesLabel?: string;
  eventsLabel?: string;
  closeLabel?: string;
  start?: TimelineDate;
  end?: TimelineDate;
  /** End of ongoing events, unless end is supplied. Default: the SSR render's UTC date. */
  referenceDate?: TimelineDate;
  /** Explicit locale keeps server and client date labels consistent. Default en-GB. */
  locale?: string;
  presentLabel?: string;
  emptyLabel?: string;
}
export interface HeadingSectionData extends SectionDefinition { type: 'heading' }
export interface HeroSectionData extends SectionDefinition { type: 'hero'; image?: ImageData; size?: CardSize; textBackground?: boolean; actions?: ContentAction[]; composition?: 'overlay' | 'artwork'; imageSide?: 'left' | 'right' }
export type RichTextSectionData = SectionDefinition & RichTextContentData & { type: 'richText' };
export interface PanelSectionData extends SectionDefinition { type: 'panel'; blocks: RichTextBlock[]; tone?: SurfaceTone; actions?: ContentAction[] }
export interface ImageSectionData extends SectionDefinition { type: 'image'; image: ImageData; description?: string; imageSide?: 'left' | 'right' }
export interface VideoSectionData extends SectionDefinition { type: 'video'; video: VideoData; description?: string; videoSide?: 'left' | 'right' }
export interface CardGridSectionData extends SectionDefinition { type: 'cardGrid'; list: CardItem[]; cardSize?: CardSize; variant?: SectionDefinition['variant']; cardShadow?: boolean; cardTone?: SurfaceTone; mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; itemSpan?: ContentSpan; textAlign?: 'start' | 'center' }
export interface CarouselSectionData extends SectionDefinition { type: 'carousel'; list: CardItem[]; cardSize?: CardSize; cardShadow?: boolean; cardTone?: SurfaceTone; mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; textAlign?: 'start' | 'center'; controls?: boolean; initialItemKey?: string }
export interface GridSectionData extends SectionDefinition { type: 'grid'; blocks: { id: string; span?: ContentSpan; sections: SectionData[] }[] }
/** Extend this map by module augmentation. Models remain JSON data; renderers are separate. */
export interface SectionTypeMap { heading: HeadingSectionData; hero: HeroSectionData; richText: RichTextSectionData; panel: PanelSectionData; image: ImageSectionData; video: VideoSectionData; cardGrid: CardGridSectionData; carousel: CarouselSectionData; grid: GridSectionData; code: CodeSectionData; timeline: TimelineSectionData }
export type SectionData = SectionTypeMap[keyof SectionTypeMap];
export interface PageData extends ContentPageData { sections: SectionData[] }
export interface MenuItem { id: string; label: string; href: string; current?: boolean; active?: boolean; icon?: string; children?: MenuItem[] }
export interface ButtonGroupItem { id: string; label: string; href?: string; selected?: boolean; disabled?: boolean }
export interface FooterLink { label: string; href: string }
export interface FooterMenuGroup { label: string; href?: string; links: readonly FooterLink[] }
export interface PageTheme {
  /** Cards, icon buttons and grouped controls. Use transparent to hide. */
  border?: string;
  /** Panels, navigation and popups. Use transparent to hide. */
  panelBorder?: string;
  background?: string; ink?: string; body?: string; accent?: string; onAccent?: string;
  standard?: string; muted?: string; radius?: string; narrowMax?: string; fontFamily?: string;
  footerBorder?: string; footerBackground?: string; footerInk?: string; footerRadius?: string; footerShadow?: string;
  footerBarBackground?: string; footerBarInk?: string;
}
