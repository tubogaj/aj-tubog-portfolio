export function initLenis(prefersReducedMotion){
  if (prefersReducedMotion || !window.Lenis) return null;

  const lenis = new window.Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  if (window.gsap){
    window.gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  if (window.ScrollTrigger){
    lenis.on('scroll', window.ScrollTrigger.update);
  }

  return lenis;
}
