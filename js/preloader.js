export function runPreloader(){
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const sigEl = document.getElementById('preloaderSignature');
  const penEl = document.getElementById('preloaderPen');
  const barFill = document.getElementById('preloaderBarFill');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    if (window.gsap){
      window.gsap.to(preloader, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => preloader.remove(),
      });
    } else {
      preloader.style.transition = 'opacity .4s ease';
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 400);
    }
  };

  if (reduced || !window.gsap){
    setTimeout(finish, reduced ? 150 : 900);
    return;
  }

  const sigWidth = sigEl ? sigEl.getBoundingClientRect().width : 0;
  const writeDuration = 1.4;

  // Signature starts fully clipped (unwritten); the pen tip sweeps left to
  // right in sync with the clip revealing, simulating handwriting.
  window.gsap.set(sigEl, { clipPath: 'inset(0% 100% 0% 0%)' });
  window.gsap.set(penEl, { x: 0, opacity: 0 });

  const tl = window.gsap.timeline({ delay: 0.15, onComplete: finish });

  tl
    .to(barFill, { width: '35%', duration: writeDuration, ease: 'power1.inOut' }, 0)
    .to(penEl, { opacity: 1, duration: 0.15 }, 0)
    .to(sigEl, { clipPath: 'inset(0% 0% 0% 0%)', duration: writeDuration, ease: 'power1.inOut' }, 0)
    .to(penEl, { x: sigWidth, duration: writeDuration, ease: 'power1.inOut' }, 0)
    .to(penEl, { opacity: 0, duration: 0.2 }, writeDuration - 0.1)
    .to(barFill, { width: '100%', duration: 0.5, ease: 'power1.inOut' }, writeDuration)
    .to({}, { duration: 0.3 });
}
