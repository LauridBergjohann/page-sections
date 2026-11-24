/** Native top-layer enhancement. The semantic DOM and component state remain the owners. */
const key = Symbol.for('page-sections.popup-layer.v1');
/** Explicit triggers used by standalone Popup compositions. Weak keys need no global cleanup. */
export const popupAnchors = new WeakMap<HTMLElement, HTMLElement>();
export const popupAnchorPoints = new WeakMap<HTMLElement, { x: number; y: number }>();
/** Component-owned dismissal, without manufacturing a keyboard event or moving focus. */
export const popupDismissals = new WeakMap<HTMLElement, () => void>();
const panelsSelector =
  'details[open] > .ps-popup, details[open] > .settings-panel, details[open] > .mobile-panel, details[open] > .popup, [data-ps-popup], [data-spatial-navigation-popup]';
type Controller = { retain(root: HTMLElement): () => void };

function createController(): Controller {
  const roots = new Map<HTMLElement, { count: number; observer: MutationObserver }>();
  const viewport = () => ({ x: scrollX, y: scrollY, width: innerWidth, height: innerHeight });
  const originals = new Map<HTMLElement, { style: string | null; viewport: ReturnType<typeof viewport>; anchor?: { x: number; y: number } }>();
  let backdrop: HTMLDivElement | undefined;
  const animations = new Map<HTMLElement, Animation>();
  const closing = new Set<HTMLElement>();
  const closeTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  const originalInert = new Map<HTMLElement, boolean>();
  let backdropExit: Animation | undefined;
  const enterDuration = 360;
  const exitDuration = 260;
  const easing = 'cubic-bezier(.2,.4,.3,1)';
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const triggerFor = (panel: HTMLElement) => popupAnchors.get(panel) ??
    panel.parentElement?.querySelector<HTMLElement>(':scope > summary, :scope > a, :scope > button, :scope > input');
  const anchorRectFor = (panel: HTMLElement) => {
    const point = popupAnchorPoints.get(panel);
    return point ? { left: point.x, right: point.x, top: point.y, bottom: point.y, width: 0, height: 0 } : triggerFor(panel)?.getBoundingClientRect();
  };
  function animate(panel: HTMLElement, out = false) {
    animations.get(panel)?.cancel();
    const frames = [{ opacity: 0, scale: '.97' }, { opacity: 1, scale: '1' }];
    const animation = panel.animate(out ? frames.reverse() : frames, {
      duration: out ? exitDuration : enterDuration, easing, fill: 'both'
    });
    animations.set(panel, animation);
    return animation;
  }
  let queued = false;
  function restore(panel: HTMLElement) {
    if (!originals.has(panel)) return;
    animations.get(panel)?.cancel();
    animations.delete(panel);
    clearTimeout(closeTimers.get(panel));
    closeTimers.delete(panel);
    closing.delete(panel);
    panel.inert = originalInert.get(panel) ?? false;
    originalInert.delete(panel);
    if (panel.matches(':popover-open')) panel.hidePopover();
    panel.removeAttribute('popover');
    const original = originals.get(panel)!.style;
    if (original === null) panel.removeAttribute('style');
    else panel.setAttribute('style', original!);
    originals.delete(panel);
  }
  function dismiss(panel: HTMLElement) {
    if (closing.has(panel)) return;
    if (reducedMotion() || !panel.isConnected || !roots.size) { restore(panel); return; }
    closing.add(panel);
    // Keep only the visual surface alive during exit. State, hit testing and
    // keyboard access close immediately, including native details/hidden owners.
    panel.inert = true;
    panel.style.setProperty('display', 'block', 'important');
    panel.style.pointerEvents = 'none';
    if (!panel.matches(':popover-open')) panel.showPopover();
    const animation = animate(panel, true);
    const finish = () => {
      if (closing.has(panel) && animations.get(panel) === animation) restore(panel);
    };
    animation.onfinish = finish;
    // Native details may skip animation events when its content becomes hidden.
    // Keep cleanup bounded even when the browser suspends that visual subtree.
    closeTimers.set(panel, setTimeout(finish, exitDuration + 50));
  }
  function sync() {
    queued = false;
    const panels = new Set<HTMLElement>();
    for (const root of roots.keys()) {
      for (const panel of root.querySelectorAll<HTMLElement>(panelsSelector)) {
        const details = panel.parentElement;
        if (
          details instanceof HTMLDetailsElement &&
          details.open &&
          details.getClientRects().length &&
          !panel.getClientRects().length &&
          getComputedStyle(panel).display !== 'none'
        ) {
          // Chromium can retain a detached layout box after a top-layer child is
          // closed by its details ancestor. Rebuild that box on reopening only;
          // never replace the node, its event handlers or the disclosure state.
          const display = panel.style.getPropertyValue('display');
          const priority = panel.style.getPropertyPriority('display');
          panel.style.setProperty('display', 'none', 'important');
          void panel.offsetHeight;
          if (display) panel.style.setProperty('display', display, priority);
          else panel.style.removeProperty('display');
        }
        if (!panel.isConnected || !panel.getClientRects().length) continue;
        if (!originals.has(panel) && getComputedStyle(panel).position !== 'absolute') continue;
        // Mobile search owns its input and results as one panel.
        if (panel.parentElement?.closest(panelsSelector)) continue;
        panels.add(panel);
      }
    }
    for (const panel of originals.keys()) if (!panels.has(panel)) {
      if (panels.size && panel.dataset.psPopupPlacement === 'side') restore(panel);
      else dismiss(panel);
    }
    if (!panels.size) {
      if (backdrop && !backdropExit) {
        const surface = backdrop;
        if (reducedMotion() || !roots.size) { surface.remove(); backdrop = undefined; }
        else {
          backdropExit = surface.animate([{ opacity: 1 }, { opacity: 0 }], { duration: exitDuration, easing, fill: 'both' });
          backdropExit.onfinish = () => {
            surface.remove();
            if (backdrop === surface) backdrop = undefined;
            backdropExit = undefined;
          };
        }
      }
      return;
    }
    backdropExit?.cancel();
    backdropExit = undefined;
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.popover = 'manual';
      backdrop.dataset.psPopupBackdrop = '';
      backdrop.setAttribute('aria-hidden', 'true');
      // A single compositor surface, allocated only while a popup is open.
      // No filter animation, permanent will-change, canvas copy or per-frame JS.
      Object.assign(backdrop.style, {
        position: 'fixed',
        inset: '0',
        margin: '0',
        padding: '0',
        border: '0',
        width: '100vw',
        height: '100dvh',
        maxWidth: 'none',
        maxHeight: 'none',
        background: 'transparent',
        pointerEvents: 'none',
        backdropFilter: 'blur(3px)'
      });
      document.body.append(backdrop);
      backdrop.showPopover();
      if (!reducedMotion()) backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: enterDuration, easing });
    }
    // Keep navigation and disclosure triggers sharp and usable below the top layer.
    const clear = new Set(
      document.querySelectorAll<HTMLElement>('.ps-navigation .header, .ps-navigation .satellite')
    );
    for (const panel of panels) {
      const summary = triggerFor(panel);
      if (summary && ![...clear].some((node) => node.contains(summary))) clear.add(summary);
    }
    const holes = [...clear]
      .filter((node) => node.getClientRects().length)
      .map((node) => {
        const r = node.getBoundingClientRect();
        return `M${r.left} ${r.top}H${r.right}V${r.bottom}H${r.left}Z`;
      })
      .join(' ');
    backdrop.style.clipPath = `path(evenodd, "M0 0H${innerWidth}V${innerHeight}H0Z ${holes}")`;
    for (const panel of panels) {
      const entering = !originals.has(panel) || closing.has(panel);
      if (closing.delete(panel)) {
        clearTimeout(closeTimers.get(panel));
        closeTimers.delete(panel);
        animations.get(panel)?.cancel();
        panel.inert = originalInert.get(panel) ?? false;
        panel.style.removeProperty('display');
        panel.style.removeProperty('pointer-events');
      }
      if (!originals.has(panel)) {
        const rect = panel.getBoundingClientRect();
        const padding = getComputedStyle(panel).padding;
        const header = panel.closest<HTMLElement>('.ps-navigation .header');
        const headerRect = header?.getBoundingClientRect();
        const trigger = panel.parentElement?.querySelector<HTMLElement>(':scope > summary');
        let top = Math.max(
          12,
          headerRect
            ? headerRect.bottom
            : trigger
              ? trigger.getBoundingClientRect().bottom + 8
              : rect.top
        );
        const mobileMenu = panel.classList.contains('mobile-panel') && headerRect;
        const width = Math.min(mobileMenu ? headerRect.width - 24 : rect.width, innerWidth - 24);
        let left = mobileMenu ? headerRect.left + 12 : rect.left;
        if (panel.dataset.psPopupPlacement === 'side') {
          const anchor = anchorRectFor(panel);
          if (anchor) {
            const rightSpace = innerWidth - anchor.right - 12;
            const leftSpace = anchor.left - 12;
            left = rightSpace >= width + 10 || rightSpace >= leftSpace ? anchor.right + 10 : anchor.left - width - 10;
            top = Math.max(12, Math.min(anchor.top, innerHeight - Math.min(rect.height, innerHeight - 24) - 12));
          }
        }
        const anchorRect = triggerFor(panel)?.getBoundingClientRect();
        originals.set(panel, { style: panel.getAttribute('style'), viewport: viewport(), anchor: anchorRect ? { x: anchorRect.x, y: anchorRect.y } : undefined });
        originalInert.set(panel, panel.inert);
        panel.popover = 'manual';
        Object.assign(panel.style, {
          position: 'fixed',
          inset: 'auto',
          margin: '0',
          transform: 'none',
          left: Math.max(12, Math.min(left, innerWidth - width - 12)) + 'px',
          top: top + 'px',
          width: width + 'px',
          padding,
          boxSizing: 'border-box',
          // Preserve legacy adapter surfaces; new Popup owns its visual styling.
          ...(panel.classList.contains('ps-popup') ? {} : {
            border: '1px solid var(--ps-panel-border)',
            borderTopWidth: headerRect ? '0px' : '1px',
            borderRadius: 'var(--ps-radius)',
            boxShadow: 'var(--ps-popup-shadow, var(--ps-navigation-shadow, var(--ps-default-navigation-shadow)))',
            background: 'var(--ps-section-standard)', color: 'var(--ps-ink)'
          }),
          maxHeight: Math.max(0, innerHeight - top - 12) + 'px',
          overflowY: 'auto'
        });
      }
      // Closing a details ancestor can hide its native popover before the observer runs.
      // Always reconcile the actual browser state, including a rapid close/reopen.
      if (!panel.matches(':popover-open')) panel.showPopover();
      if (entering && !reducedMotion()) {
        const rect = panel.getBoundingClientRect();
        const trigger = anchorRectFor(panel);
        panel.style.transformOrigin = trigger
          ? `${Math.max(0, Math.min(rect.width, trigger.left + trigger.width / 2 - rect.left))}px ${Math.max(0, Math.min(rect.height, trigger.top + trigger.height / 2 - rect.top))}px`
          : '50% 0%';
        const animation = animate(panel);
        animation.onfinish = () => { if (animations.get(panel) === animation) { animation.cancel(); animations.delete(panel); } };
      }
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  }
  function closeOnViewportChange() {
    if (!originals.size) return;
    const current = viewport();
    // Scroll notifications are queued. A trigger can open its popup after the
    // viewport has moved but before that scroll event is delivered (including
    // focus/scrollIntoView). Only dismiss if the positioning geometry changed
    // since opening, not simply because an older notification arrived.
    if (![...originals.values()].some(({ viewport: positioned }) =>
      positioned.x !== current.x || positioned.y !== current.y ||
      positioned.width !== current.width || positioned.height !== current.height
    )) return;
    const legacy: HTMLElement[] = [];
    for (const panel of originals.keys()) {
      const dismiss = popupDismissals.get(panel);
      if (dismiss) { dismiss(); continue; }
      legacy.push(panel);
    }
    if (legacy.length) {
      // Preserve legacy owners' opportunity to update state before closing their DOM.
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      for (const panel of legacy) {
        const details = panel.parentElement;
        if (details instanceof HTMLDetailsElement) details.open = false;
      }
    }
  }
  function closeOnContainerScroll(event: Event) {
    if (!(event.target instanceof Element)) return;
    for (const panel of originals.keys()) {
      if (panel.dataset.psPopupPlacement !== 'side' || panel.contains(event.target)) continue;
      const trigger = triggerFor(panel);
      const positioned = originals.get(panel)?.anchor;
      const current = trigger?.getBoundingClientRect();
      if (trigger && event.target.contains(trigger) && current && positioned && (current.x !== positioned.x || current.y !== positioned.y)) {
        const details = panel.parentElement;
        if (details instanceof HTMLDetailsElement) details.open = false;
      }
    }
  }
  return {
    retain(root) {
      if (!roots.size) {
        window.addEventListener('scroll', closeOnViewportChange, { passive: true });
        window.addEventListener('resize', closeOnViewportChange, { passive: true });
        document.addEventListener('scroll', closeOnContainerScroll, { capture: true, passive: true });
      }
      const existing = roots.get(root);
      if (existing) existing.count++;
      else {
        root.dataset.psPopupsEnhanced = '';
        const observer = new MutationObserver(schedule);
        observer.observe(root, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['hidden', 'open', 'data-ps-popup', 'data-spatial-navigation-popup']
        });
        roots.set(root, { count: 1, observer });
      }
      schedule();
      return () => {
        const entry = roots.get(root);
        if (entry && --entry.count === 0) {
          entry.observer.disconnect();
          roots.delete(root);
          delete root.dataset.psPopupsEnhanced;
        }
        if (!roots.size) {
          window.removeEventListener('scroll', closeOnViewportChange);
          window.removeEventListener('resize', closeOnViewportChange);
          document.removeEventListener('scroll', closeOnContainerScroll, true);
        }
        schedule();
      };
    }
  };
}

export function enhancePopups(root: HTMLElement): () => void {
  if (!('showPopover' in HTMLElement.prototype)) return () => {};
  // Share ownership across shells and independently bundled compatible adapters.
  const owner = document as unknown as Record<symbol, Controller>;
  const controller = (owner[key] ??= createController());
  return controller.retain(root);
}

export function popupLayer(root: HTMLElement) {
  return { destroy: enhancePopups(root) };
}
