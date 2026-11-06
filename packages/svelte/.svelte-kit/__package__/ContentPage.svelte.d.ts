import { type Snippet } from 'svelte';
import { type ContentPageData, type PageTheme } from '@page-sections/core';
import './styles.css';
type $$ComponentProps = {
    page: ContentPageData;
    children?: Snippet;
    sectionNavigation?: boolean | 'horizontal' | 'sidebar';
    navigationLabel?: string;
    theme?: PageTheme;
    class?: string;
};
declare const ContentPage: import("svelte").Component<$$ComponentProps, {}, "">;
type ContentPage = ReturnType<typeof ContentPage>;
export default ContentPage;
