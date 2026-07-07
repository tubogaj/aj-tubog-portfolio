export function initMagnetic(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reducedMotion || !hasFinePointer) return;

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.setProperty('--btn-x', `${x * 0.25}px`);
      el.style.setProperty('--btn-y', `${y * 0.25}px`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--btn-x', '0px');
      el.style.setProperty('--btn-y', '0px');
    });
  });
}
