<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { popupLayer, popupAnchors } from './popupLayer.js';
  let {
    title, children, open = $bindable(true), inline = false, disclosure = false,
    anchor, onclose, class: className = '', element = $bindable(), ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
    title?: string; children?: Snippet; open?: boolean;
    /** Inline content shares typography without creating a floating surface. */
    inline?: boolean;
    /** Let a parent native details element own visibility. */
    disclosure?: boolean;
    anchor?: HTMLElement; onclose?: () => void; element?: HTMLDivElement;
  } = $props();
  const titleId = $props.id();
  $effect(() => {
    if (!element || !anchor) return;
    const panel = element;
    popupAnchors.set(panel, anchor);
    return () => { popupAnchors.delete(panel); };
  });
  function enhance(node: HTMLElement) { return popupLayer(node.parentElement!); }
  function isOpen() {
    return !inline && open && (!disclosure || element?.parentElement?.hasAttribute('open'));
  }
  function close(restoreFocus = false) {
    if (!isOpen()) return;
    const parent = element?.parentElement;
    if (disclosure && parent instanceof HTMLDetailsElement) parent.open = false;
    else open = false;
    onclose?.();
    if (restoreFocus) (anchor ?? parent?.querySelector<HTMLElement>(':scope > summary'))?.focus();
  }
</script>

<svelte:window onkeydown={(event) => {
  if (event.key === 'Escape' && isOpen()) { close(true); event.preventDefault(); }
}} onpointerdown={(event) => {
  if (!(event.target instanceof Node) || element?.contains(event.target) || anchor?.contains(event.target)) return;
  if (disclosure && element?.parentElement?.querySelector(':scope > summary')?.contains(event.target)) return;
  close();
}} />

<div {...rest} bind:this={element} use:enhance class="ps-popup ps-shadow-popup {className}"
  class:ps-popup-inline={inline} hidden={!open || rest.hidden}
  data-ps-popup={!inline && !disclosure && open ? '' : undefined}
  aria-labelledby={title ? titleId : rest['aria-labelledby']}>
  {#if title}<p class="ps-popup-title" id={titleId}>{title}</p>{/if}
  {@render children?.()}
</div>

<style>
  .ps-popup { position: absolute; top: calc(100% + 8px); right: 0; box-sizing: border-box; width: min(280px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); overflow: auto; overscroll-behavior: contain; margin: 0; padding: 1rem; border: 1px solid var(--ps-panel-border); border-radius: var(--ps-radius); background: var(--ps-section-standard); color: var(--ps-ink); box-shadow: var(--ps-popup-shadow, var(--ps-navigation-shadow, var(--ps-default-navigation-shadow))); font-size: .875rem; line-height: 1.5; }
  .ps-popup-inline { position: static; width: auto; max-height: none; overflow: visible; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
  .ps-popup-title { margin: 0 0 .75rem; color: var(--ps-ink); font-size: 1rem; line-height: 1.5; font-weight: 650; }
  .ps-popup[hidden] { display: none; }
</style>
