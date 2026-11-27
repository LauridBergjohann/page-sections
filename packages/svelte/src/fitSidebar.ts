/** Keep the complete scroll container inside the viewport, before and after docking. */
export function fitSidebar(node: HTMLElement) {
  let frame = 0;
  const update = () => {
    frame = 0;
    const style = getComputedStyle(node);
    const bottomGap = parseFloat(style.getPropertyValue('--ps-sidebar-sticky-top')) || 16;
    const top = Math.max(parseFloat(style.top) || bottomGap, node.getBoundingClientRect().top);
    const height = Math.max(0, window.innerHeight - top - bottomGap);
    node.style.setProperty('--ps-sidebar-available-height', `${height}px`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  observer.observe(document.documentElement);
  if (node.parentElement) observer.observe(node.parentElement);
  // A reactive Header mode change can alter sticky offsets without resizing the page.
  const headerObserver = new MutationObserver(schedule);
  headerObserver.observe(node.closest('.ps-shell') ?? document.body, {
    attributes: true, subtree: true, attributeFilter: ['data-scroll']
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  return { destroy() {
    cancelAnimationFrame(frame);
    observer.disconnect();
    headerObserver.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  } };
}
