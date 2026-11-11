/** Keep the complete scroll container inside the viewport, before and after docking. */
export function fitSidebar(node: HTMLElement) {
  let frame = 0;
  const update = () => {
    frame = 0;
    const inset = parseFloat(getComputedStyle(node).getPropertyValue('--ps-sidebar-sticky-top')) || 16;
    const top = Math.max(inset, node.getBoundingClientRect().top);
    const height = Math.max(0, window.innerHeight - top - inset);
    node.style.setProperty('--ps-sidebar-available-height', `${height}px`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  observer.observe(document.documentElement);
  if (node.parentElement) observer.observe(node.parentElement);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  return { destroy() {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  } };
}
