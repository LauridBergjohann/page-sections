import type { Snippet } from 'svelte';
import { type HeroSectionData } from '@page-sections/core';
type $$ComponentProps = {
    section: Omit<HeroSectionData, 'type'>;
    children?: Snippet;
};
declare const HeroSection: import("svelte").Component<$$ComponentProps, {}, "">;
type HeroSection = ReturnType<typeof HeroSection>;
export default HeroSection;
