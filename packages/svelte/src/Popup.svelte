<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import LucideIcon from './LucideIcon.svelte';
  import { popupLayer, popupAnchors, popupAnchorPoints, popupDismissals } from './popupLayer.js';
  let {
    title, children, open = $bindable(true), inline = false, disclosure = false, closable = false, closeLabel = 'Close popup',
    anchor, anchorPoint, placement = 'default', onclose, onrequestclose, modal = false, class: className = '', element = $bindable(), ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
    title?: string; children?: Snippet; open?: boolean;
    /** Inline content shares typography without creating a floating surface. */
    inline?: boolean;
    /** Let a parent native details element own visibility. */
    disclosure?: boolean;
    /** Show a Lucide close button on floating panels. Inline surfaces omit it. */
    closable?: boolean;
    closeLabel?: string;
    anchor?: HTMLElement;
    /** Optional viewport point within a large trigger (for example a timeline bar). */
    anchorPoint?: { x: number; y: number };
    /** Side placement flips and clamps to the viewport; default preserves disclosure positioning. */
    placement?: 'default' | 'side';
    /** Trap focus and prevent background interaction for a composed dialog. */
    modal?: boolean;
    /** A controlled navigation owner can return to a parent view instead of closing. */
    onrequestclose?: () => void;
    onclose?: () => void; element?: HTMLDivElement;
  } = $props();
  const titleId = $props.id();
  $effect(() => {
    if (!element || !anchor) return;
    const panel = element;
    popupAnchors.set(panel, anchor);
    if (anchorPoint) popupAnchorPoints.set(panel, anchorPoint);
    else popupAnchorPoints.delete(panel);
    return () => { popupAnchors.delete(panel); popupAnchorPoints.delete(panel); };
  });
  function enhance(node: HTMLElement) {
    const parent = node.parentElement!;
    if (anchor) popupAnchors.set(node, anchor);
    if (anchorPoint) popupAnchorPoints.set(node, anchorPoint);
    const layer = popupLayer(parent);
    let positioned = { x: scrollX, y: scrollY };
    // Capture each opening before queued scroll events are delivered. This also
    // works without native popovers and without a PageShell/controller owner.
    const observer = new MutationObserver(() => {
      if (isOpen()) positioned = { x: scrollX, y: scrollY };
    });
    observer.observe(parent, { attributes: true, attributeFilter: ['open'] });
    observer.observe(node, { attributes: true, attributeFilter: ['hidden', 'data-ps-popup', 'class'] });
    function scroll() {
      if (isOpen() && (positioned.x !== scrollX || positioned.y !== scrollY)) close();
    }
    popupDismissals.set(node, () => close());
    function guard(event: Event) {
      if (!modal || !isOpen() || node.contains(event.target as Node)) return;
      if (event.type === 'focusin') node.querySelector<HTMLElement>('button, a, input, [tabindex]')?.focus({ preventScroll: true });
      else { event.preventDefault(); event.stopImmediatePropagation(); }
    }
    document.addEventListener('pointerdown', guard, true);
    document.addEventListener('click', guard, true);
    document.addEventListener('focusin', guard, true);
    document.addEventListener('scroll', scroll, { passive: true });
    return { destroy() {
      document.removeEventListener('scroll', scroll);
      document.removeEventListener('pointerdown', guard, true);
      document.removeEventListener('click', guard, true);
      document.removeEventListener('focusin', guard, true);
      observer.disconnect();
      popupDismissals.delete(node);
      layer.destroy();
    } };
  }
  function isOpen() {
    return !inline && open && (!disclosure || element?.parentElement?.hasAttribute('open'));
  }
  function close(restoreFocus = false) {
    if (!isOpen()) return;
    if (onrequestclose) { onrequestclose(); return; }
    const parent = element?.parentElement;
    if (disclosure && parent instanceof HTMLDetailsElement) parent.open = false;
    else open = false;
    if (restoreFocus) (anchor?.closest<HTMLElement>('button, a, summary, [tabindex]') ?? anchor ?? parent?.querySelector<HTMLElement>(':scope > summary'))?.focus();
    // Notify after focus restoration so an anchor's focus handler cannot reopen the owner.
    onclose?.();
  }
</script>

<svelte:window onkeydown={(event) => {
  if (event.defaultPrevented || !isOpen()) return;
  if (event.key === 'Escape') { close(true); event.preventDefault(); }
  if (modal && event.key === 'Tab' && element) {
    const controls = [...element.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]')].filter(node => node.getClientRects().length && !node.closest('[hidden]'));
    const index = controls.indexOf(document.activeElement as HTMLElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1)?.focus(); }
    else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) { event.preventDefault(); controls[0]?.focus(); }
  }
}} onpointerdown={(event) => {
  if (!(event.target instanceof Node) || element?.contains(event.target) || anchor?.contains(event.target)) return;
  if (disclosure && element?.parentElement?.querySelector(':scope > summary')?.contains(event.target)) return;
  close();
}} />

{#snippet closeButton()}
  <button class="ps-popup-close" type="button" aria-label={closeLabel} onclick={() => close(true)}><LucideIcon name="x" /></button>
{/snippet}

<div {...rest} bind:this={element} use:enhance class="ps-popup ps-shadow-popup {className}"
  role={modal ? 'dialog' : rest.role} aria-modal={modal ? true : undefined}
  class:ps-popup-inline={inline} class:ps-popup-closable={closable && !inline} hidden={!open || rest.hidden}
  data-ps-popup={!inline && !disclosure && open ? '' : undefined}
  data-ps-popup-placement={placement === 'side' ? 'side' : undefined}
  aria-labelledby={title ? titleId : rest['aria-labelledby']}>
  {#if title}
    <div class="ps-popup-heading">
      <p class="ps-popup-title" id={titleId}>{title}</p>
      {#if closable && !inline}{@render closeButton()}{/if}
    </div>
  {:else if closable && !inline}
    {@render closeButton()}
  {/if}
  {@render children?.()}
</div>

<style>
  .ps-popup { position: absolute; top: calc(100% + 8px); right: 0; box-sizing: border-box; width: min(280px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); overflow: auto; overscroll-behavior: contain; margin: 0; padding: 1rem; border: 1px solid var(--ps-panel-border); border-radius: var(--ps-radius); background: var(--ps-panel-background, var(--ps-section-standard)); color: var(--ps-ink); box-shadow: var(--ps-popup-shadow, var(--ps-navigation-shadow, var(--ps-default-navigation-shadow))); font-size: .875rem; line-height: 1.5; }
  .ps-popup-inline { position: static; width: auto; max-height: none; overflow: visible; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
  .ps-popup-heading { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
  .ps-popup-title { flex: 1; min-width: 0; overflow-wrap: anywhere; margin: 0; color: var(--ps-ink); font-size: 1rem; line-height: 1.5; font-weight: 650; }
  .ps-popup-closable:not(:has(> .ps-popup-heading)) { padding-top: 3rem; }
  .ps-popup-heading .ps-popup-close { position: static; flex: none; }
  .ps-popup-close { position: absolute; top: .4rem; right: .4rem; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: .5rem; color: var(--ps-ink); background: transparent; cursor: pointer; transition: background-color 300ms cubic-bezier(.2,.4,.3,1); }
  .ps-popup-close:hover { background: var(--ps-selection, var(--ps-section-muted)); }
  .ps-popup-close:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .ps-popup-close { transition: none; } }
  .ps-popup[hidden] { display: none; }
</style>
