import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type SectionDefinition } from '@page-sections/core';
import './styles.css';
type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'id'> & {
    section: SectionDefinition;
    children?: Snippet;
};
declare const Section: import("svelte").Component<Props, {}, "">;
type Section = ReturnType<typeof Section>;
export default Section;
