export function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links){
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navAnchors)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !navAnchors.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}
