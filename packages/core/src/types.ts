import type { ContentSpan } from './responsiveLayout.js';

export type SectionBackgroundColor = 'transparent' | 'standard' | 'muted' | 'transparentToStandard' | 'transparentToMuted' | 'standardToTransparent' | 'standardToMuted' | 'mutedToTransparent' | 'mutedToStandard';
export interface SectionBackground { color: SectionBackgroundColor; size?: 'standard' | 'full' }
export interface SectionDefinition {
  id: string;
  /** Navigation/accessibility label; headline controls the visible heading, as in Beta.8. */
  title: string;
  headline?: string;
  eyebrow?: string;
  introduction?: string;
  headingLevel?: 1 | 2 | 3;
  background?: SectionBackground;
  layout?: 'full' | 'wide' | 'narrow' | 'inherit';
  spacing?: 'none' | 'tight' | 'normal' | 'loose' | 'spacious';
  divider?: 'none' | 'top' | 'bottom' | 'both';
  variant?: 'default' | 'content' | 'feature';
  style?: { width?: string; color?: string };
}
export type SectionNavigationItem = Pick<SectionDefinition, 'id' | 'title'>;
export interface Breadcrumb { label: string; href?: string }
export interface ContentPageData { title: string; pageTitle?: string; eyebrow?: string; intro?: string; breadcrumbs?: Breadcrumb[] }
export type ImageAspect = 'none' | '4/3' | '16/9' | '2/1' | 'square';
export interface ImageData { src: string; srcDark?: string; alt: string; width?: number; height?: number; aspect?: ImageAspect; objectFit?: 'cover' | 'contain'; srcset?: string; sizes?: string }
export interface CardItem { id: string; itemKey?: string; title: string; href?: string; eyebrow?: string; description?: string; subtitle?: string; image?: ImageData; size?: CardSize }
export type CardSize = 's' | 'm' | 'l';
export interface VideoData { src: string; provider: 'html5' | 'youtube'; poster?: string; captions?: { src: string; language: string; label: string }[] }
export interface HeroSectionData extends SectionDefinition { type: 'hero'; image?: ImageData; size?: CardSize; textBackground?: boolean; actions?: { label: string; href: string }[] }
export interface RichTextSectionData extends SectionDefinition { type: 'richText'; body: string; format?: 'markdown' | 'text' }
export interface ImageSectionData extends SectionDefinition { type: 'image'; image: ImageData; description?: string; imageSide?: 'left' | 'right' }
export interface VideoSectionData extends SectionDefinition { type: 'video'; video: VideoData; description?: string; videoSide?: 'left' | 'right' }
export interface CardGridSectionData extends SectionDefinition { type: 'cardGrid'; list: CardItem[]; cardSize?: CardSize }
export interface CarouselSectionData extends SectionDefinition { type: 'carousel'; list: CardItem[]; cardSize?: CardSize; controls?: boolean }
export interface GridSectionData extends SectionDefinition { type: 'grid'; blocks: { id: string; span?: ContentSpan; sections: SectionData[] }[] }
/** Extend this map by module augmentation. Models remain JSON data; renderers are separate. */
export interface SectionTypeMap { hero: HeroSectionData; richText: RichTextSectionData; image: ImageSectionData; video: VideoSectionData; cardGrid: CardGridSectionData; carousel: CarouselSectionData; grid: GridSectionData }
export type SectionData = SectionTypeMap[keyof SectionTypeMap];
export interface PageData extends ContentPageData { sections: SectionData[] }
export interface MenuItem { id: string; label: string; href?: string; current?: boolean; children?: MenuItem[] }
export interface ButtonGroupItem { id: string; label: string; href?: string; selected?: boolean; disabled?: boolean }
export interface PageTheme { background?: string; ink?: string; body?: string; accent?: string; standard?: string; muted?: string; radius?: string; contentMax?: string; narrowMax?: string; fontFamily?: string }
