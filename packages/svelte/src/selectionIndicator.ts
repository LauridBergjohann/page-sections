/** Keep one selection surface aligned with native controls, including after font/size changes. */
export function selectionIndicator(
  host: HTMLElement,
  selectors: { items: string; selected: string }
) {
  let frame = 0;
  let entrance = 0;
  let disposed = false;
  let controls: HTMLElement[] = [];
  const resize = new ResizeObserver(schedule);

  function measure() {
    frame = 0;
    if (disposed) return;
    const next = [...host.querySelectorAll<HTMLElement>(selectors.items)];
    if (
      next.length !== controls.length ||
      next.some((control, index) => control !== controls[index])
    ) {
      resize.disconnect();
      resize.observe(host);
      next.forEach((control) => resize.observe(control));
      controls = next;
    }
    const selected = controls.filter((control) => control.matches(selectors.selected));
    const target = selected.length === 1 ? selected[0] : undefined;
    if (!target || !target.getClientRects().length || !target.offsetWidth) {
      delete host.dataset.psSelectionReady;
      delete host.dataset.psSelectionAnimated;
      cancelAnimationFrame(entrance);
      return;
    }
    const bounds = host.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    host.style.setProperty(
      '--ps-selection-x',
      `${box.left - bounds.left + host.scrollLeft - host.clientLeft}px`
    );
    host.style.setProperty(
      '--ps-selection-y',
      `${box.top - bounds.top + host.scrollTop - host.clientTop}px`
    );
    host.style.setProperty('--ps-selection-width', `${box.width}px`);
    host.style.setProperty('--ps-selection-height', `${box.height}px`);
    host.style.setProperty('--ps-selection-radius', getComputedStyle(target).borderRadius);
    if (!host.hasAttribute('data-ps-selection-ready')) {
      host.dataset.psSelectionReady = '';
      // Replace the SSR highlight at its measured position before enabling movement.
      entrance = requestAnimationFrame(() => {
        entrance = requestAnimationFrame(() => {
          host.dataset.psSelectionAnimated = '';
        });
      });
    }
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(measure);
  }
  const mutation = new MutationObserver(schedule);
  mutation.observe(host, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'aria-current', 'aria-pressed']
  });
  resize.observe(host);
  window.addEventListener('resize', schedule, { passive: true });
  void document.fonts?.ready.then(schedule);
  measure();
  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(entrance);
      resize.disconnect();
      mutation.disconnect();
      window.removeEventListener('resize', schedule);
    }
  };
}
