import type { Snippet } from 'svelte';
import type { VideoSectionData } from '@page-sections/core';
type $$ComponentProps = {
    section: Omit<VideoSectionData, 'type'>;
    children?: Snippet;
};
declare const VideoSection: import("svelte").Component<$$ComponentProps, {}, "">;
type VideoSection = ReturnType<typeof VideoSection>;
export default VideoSection;
