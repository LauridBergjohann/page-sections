import { type ButtonGroupItem } from '@page-sections/core';
type $$ComponentProps = {
    items: ButtonGroupItem[];
    label: string;
    onselect?: (item: ButtonGroupItem) => void;
};
declare const ButtonGroup: import("svelte").Component<$$ComponentProps, {}, "">;
type ButtonGroup = ReturnType<typeof ButtonGroup>;
export default ButtonGroup;
