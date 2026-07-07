export function initFolders(){
  const folders = document.querySelectorAll('.folder');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  folders.forEach((folder) => {
    const body = folder.querySelector('.folder-body');

    folder.addEventListener('toggle', () => {
      folder.classList.toggle('is-open', folder.open);

      // Accordion behavior: closing other open folders keeps the list scannable
      if (folder.open){
        folders.forEach((other) => {
          if (other !== folder && other.open){
            other.open = false;
            other.classList.remove('is-open');
          }
        });
      }

      if (!reducedMotion && window.gsap && body && folder.open){
        const targetHeight = body.scrollHeight;
        window.gsap.fromTo(
          body,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => { body.style.height = 'auto'; },
          }
        );
      }
    });
  });
}
