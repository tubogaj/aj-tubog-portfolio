export function initParticles(){
  const canvas = document.getElementById('bgNetwork');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999, active: false };

  const CONNECT_DIST = 120;
  const MOUSE_DIST = 160;
  const REPEL_DIST = 90;

  function particleCount(){
    const area = width * height;
    return Math.max(36, Math.min(100, Math.round(area / 16000)));
  }

  function resize(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticles(){
    const count = particleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.4,
    }));
  }

  function step(){
    ctx.clearRect(0, 0, width, height);

    for (const p of particles){
      // gentle drift
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));

      // mouse repel
      if (mouse.active){
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_DIST && dist > 0.001){
          const force = (REPEL_DIST - dist) / REPEL_DIST;
          p.x += (dx / dist) * force * 1.6;
          p.y += (dy / dist) * force * 1.6;
        }
      }
    }

    // particle-to-particle links
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < CONNECT_DIST){
          const alpha = (1 - dist / CONNECT_DIST) * 0.10;
          ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // mouse-to-particle highlight links
    if (mouse.active){
      for (const p of particles){
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < MOUSE_DIST){
          const alpha = (1 - dist / MOUSE_DIST) * 0.32;
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // particle dots
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    for (const p of particles){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  requestAnimationFrame(step);

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
}
