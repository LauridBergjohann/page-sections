import type { ContentSpan } from './responsiveLayout.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'm' | 'l' | 'xl';
export type PageKind = 'content' | 'detail';
export type SurfaceTone = 'standard' | 'muted';
export type CardVariant = 'catalog' | 'editorial';
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
export type SectionNavigationItem = Pick<SectionDefinition, 'id' | 'title'>;
export interface Breadcrumb { label: string; href?: string }
export interface ContentPageData { title: string; pageTitle?: string; eyebrow?: string; intro?: string; breadcrumbs?: Breadcrumb[]; header?: HeadingSectionData | HeroSectionData; bodyLayout?: 'wide' | 'narrow'; bodySpacing?: SectionDefinition['spacing'] }
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
export interface HeadingSectionData extends SectionDefinition { type: 'heading' }
export interface HeroSectionData extends SectionDefinition { type: 'hero'; image?: ImageData; size?: CardSize; textBackground?: boolean; actions?: ContentAction[]; composition?: 'overlay' | 'artwork'; imageSide?: 'left' | 'right' }
export type RichTextSectionData = SectionDefinition & RichTextContentData & { type: 'richText' };
export interface PanelSectionData extends SectionDefinition { type: 'panel'; blocks: RichTextBlock[]; tone?: SurfaceTone; actions?: ContentAction[] }
export interface ImageSectionData extends SectionDefinition { type: 'image'; image: ImageData; description?: string; imageSide?: 'left' | 'right' }
export interface VideoSectionData extends SectionDefinition { type: 'video'; video: VideoData; description?: string; videoSide?: 'left' | 'right' }
export interface CardGridSectionData extends SectionDefinition { type: 'cardGrid'; list: CardItem[]; cardSize?: CardSize; variant?: SectionDefinition['variant']; cardVariant?: CardVariant; cardTone?: SurfaceTone; mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; itemSpan?: ContentSpan; textAlign?: 'start' | 'center' }
export interface CarouselSectionData extends SectionDefinition { type: 'carousel'; list: CardItem[]; cardSize?: CardSize; cardVariant?: CardVariant; cardTone?: SurfaceTone; mediaAspect?: CardMediaAspect; mediaFit?: CardMediaFit; textAlign?: 'start' | 'center'; controls?: boolean; initialItemKey?: string }
export interface GridSectionData extends SectionDefinition { type: 'grid'; blocks: { id: string; span?: ContentSpan; sections: SectionData[] }[] }
/** Extend this map by module augmentation. Models remain JSON data; renderers are separate. */
export interface SectionTypeMap { heading: HeadingSectionData; hero: HeroSectionData; richText: RichTextSectionData; panel: PanelSectionData; image: ImageSectionData; video: VideoSectionData; cardGrid: CardGridSectionData; carousel: CarouselSectionData; grid: GridSectionData; code: CodeSectionData }
export type SectionData = SectionTypeMap[keyof SectionTypeMap];
export interface PageData extends ContentPageData { sections: SectionData[] }
export interface MenuItem { id: string; label: string; href: string; current?: boolean; active?: boolean; icon?: string; children?: MenuItem[] }
export interface ButtonGroupItem { id: string; label: string; href?: string; selected?: boolean; disabled?: boolean }
export interface PageTheme { background?: string; ink?: string; body?: string; accent?: string; onAccent?: string; standard?: string; muted?: string; radius?: string; narrowMax?: string; fontFamily?: string }
