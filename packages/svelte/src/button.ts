import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

/** Shared native attributes for action buttons and navigation links. */
export type ButtonProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & Pick<HTMLButtonAttributes, 'type' | 'disabled' | 'form' | 'name' | 'value'> & {
  href?: string;
  target?: HTMLAnchorAttributes['target'];
  rel?: string;
  children?: Snippet;
  active?: boolean;
  borderless?: boolean;
  element?: HTMLButtonElement | HTMLAnchorElement;
};
export type IconButtonProps = ButtonProps & { label: string };
