import type { Snippet } from 'svelte';
import './styles.css';
type $$ComponentProps = {
    menu?: Snippet;
    brand?: Snippet;
    left?: Snippet;
    right?: Snippet;
    settingsIcon?: Snippet;
    label?: string;
    settingsLabel?: string;
};
declare const Navigation: import("svelte").Component<$$ComponentProps, {}, "">;
type Navigation = ReturnType<typeof Navigation>;
export default Navigation;
