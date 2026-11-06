import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import './layout.generated.css';
type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Explicit ContentBlock children; the enclosing Section owns the grid's outer padding. */
    children?: Snippet;
};
declare const ContentGrid: import("svelte").Component<Props, {}, "">;
type ContentGrid = ReturnType<typeof ContentGrid>;
export default ContentGrid;
