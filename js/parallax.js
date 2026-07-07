export function initParallax(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reducedMotion || !hasFinePointer) return;

  const glow = document.querySelector('.cursor-glow');
  const ambientBg = document.querySelector('.ambient-bg');

  let raf = null;

  document.addEventListener('mousemove', (e) => {
    if (glow){
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      glow.classList.add('is-active');
    }

    if (raf) return;
    raf = requestAnimationFrame(() => {
      if (ambientBg){
        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;
        ambientBg.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = null;
    });
  });
}
