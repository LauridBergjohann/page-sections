import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type ContentSpan } from '@page-sections/core';
type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Column count, or mobile-first counts by content grid size. Omitted values fill the row. */
    span?: ContentSpan;
    children?: Snippet;
};
declare const ContentBlock: import("svelte").Component<Props, {}, "">;
type ContentBlock = ReturnType<typeof ContentBlock>;
export default ContentBlock;
