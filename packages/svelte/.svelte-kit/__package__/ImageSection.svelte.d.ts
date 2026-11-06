import type { Snippet } from 'svelte';
import type { ImageSectionData } from '@page-sections/core';
type $$ComponentProps = {
    section: Omit<ImageSectionData, 'type'>;
    children?: Snippet;
};
declare const ImageSection: import("svelte").Component<$$ComponentProps, {}, "">;
type ImageSection = ReturnType<typeof ImageSection>;
export default ImageSection;
