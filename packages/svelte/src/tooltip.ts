import './tooltip.css';

let nextId = 0;
/** A hoverable, Escape-dismissible tooltip without a layout wrapper. */
export function tooltip(node: HTMLElement, text: string | undefined | null) {
  let tip: HTMLSpanElement | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const id = `ps-tooltip-${++nextId}`;
  const cancel = () => clearTimeout(timer);
  function hide() {
    cancel();
    tip?.remove();
    tip = undefined;
    const ids = (node.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(value => value && value !== id);
    if (ids.length) node.setAttribute('aria-describedby', ids.join(' '));
    else node.removeAttribute('aria-describedby');
    window.removeEventListener('keydown', escape, true);
    window.removeEventListener('scroll', hide, true);
    window.removeEventListener('resize', hide);
  }
  function escape(event: KeyboardEvent) { if (event.key === 'Escape') hide(); }
  function leave() {
    cancel();
    if (!node.matches(':focus-visible')) timer = setTimeout(hide, 120);
  }
  function show() {
    cancel();
    if (!text || tip || !node.isConnected || node.matches('[aria-expanded="true"], details[open] > summary')) return;
    tip = document.createElement('span');
    tip.id = id;
    tip.className = 'ps-tooltip';
    tip.role = 'tooltip';
    tip.textContent = text;
    if ('showPopover' in tip) tip.popover = 'manual';
    node.parentElement?.append(tip);
    tip.showPopover?.();
    const anchor = node.getBoundingClientRect();
    const bounds = tip.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.left + (anchor.width - bounds.width) / 2, innerWidth - bounds.width - 8));
    const above = anchor.top - bounds.height - 8;
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(8, Math.min(above >= 8 ? above : anchor.bottom + 8, innerHeight - bounds.height - 8))}px`;
    node.setAttribute('aria-describedby', [node.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    tip.addEventListener('pointerenter', cancel);
    tip.addEventListener('pointerleave', leave);
    window.addEventListener('keydown', escape, true);
    window.addEventListener('scroll', hide, { capture: true, passive: true });
    window.addEventListener('resize', hide);
  }
  function enter(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    cancel(); timer = setTimeout(show, 350);
  }
  node.addEventListener('pointerenter', enter);
  node.addEventListener('pointerleave', leave);
  node.addEventListener('focus', show);
  node.addEventListener('blur', hide);
  node.addEventListener('pointerdown', hide);
  node.addEventListener('click', hide);
  return {
    update(value: string | undefined | null) { text = value; if (!value) hide(); else if (tip) tip.textContent = value; },
    destroy() {
      hide();
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerleave', leave);
      node.removeEventListener('focus', show);
      node.removeEventListener('blur', hide);
      node.removeEventListener('pointerdown', hide);
      node.removeEventListener('click', hide);
    }
  };
}
