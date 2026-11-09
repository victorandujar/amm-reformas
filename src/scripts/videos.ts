/**
 * Vídeos decorativos en bucle ([data-autoplay]): solo se cargan y reproducen
 * cuando están en pantalla, visibles y si el usuario no pide menos movimiento.
 * Los botones [data-video-toggle] permiten pausarlos todos (WCAG 2.2.2).
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]')];
const visible = new Map<HTMLVideoElement, boolean>();
let paused = reduced.matches;

const sync = (v: HTMLVideoElement): void => {
  const show = visible.get(v) === true && v.offsetParent !== null;
  if (paused || !show) {
    v.pause();
    return;
  }
  if (v.preload === 'none') v.preload = 'auto';
  v.play().catch(() => {
    /* autoplay bloqueado: se queda el póster */
  });
};

const renderToggles = (): void => {
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-video-toggle]')) {
    b.setAttribute('aria-pressed', String(paused));
    b.textContent = paused ? 'Reproducir vídeos' : 'Pausar vídeos';
  }
};

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      visible.set(v, e.isIntersecting);
      sync(v);
    }
  },
  { threshold: 0.15 },
);
videos.forEach((v) => io.observe(v));

document.addEventListener('click', (e) => {
  const btn = (e.target as Element | null)?.closest('[data-video-toggle]');
  if (!btn) return;
  paused = !paused;
  videos.forEach(sync);
  renderToggles();
});
renderToggles();
