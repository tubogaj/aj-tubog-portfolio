export function initReveals(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-scale]');

  if (reducedMotion || !window.gsap || !window.ScrollTrigger){
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  targets.forEach((el) => {
    window.gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}
