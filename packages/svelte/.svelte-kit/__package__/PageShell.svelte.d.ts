import { type Snippet } from 'svelte';
import { type PageTheme } from '@page-sections/core';
import './styles.css';
type $$ComponentProps = {
    theme?: PageTheme;
    mode?: 'light' | 'dark';
    children?: Snippet;
};
declare const PageShell: import("svelte").Component<$$ComponentProps, {}, "">;
type PageShell = ReturnType<typeof PageShell>;
export default PageShell;
