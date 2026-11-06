import type { HeadingLevel, PageKind } from '@page-sections/core';
export const SECTION_CONTEXT = Symbol('page-sections-layout-context');
export interface SectionContext { pageKind: PageKind; headingLevel: HeadingLevel; nested: boolean }
export type ReadSectionContext = () => SectionContext;
export const defaultSectionContext: SectionContext = { pageKind: 'content', headingLevel: 2, nested: false };
export const nextHeading = (level: HeadingLevel): HeadingLevel => Math.min(6, level + 1) as HeadingLevel;
