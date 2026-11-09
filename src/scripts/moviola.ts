/**
 * Moviola de obras: elegir obra, reproducir y "arrastrar la cinta" para recorrer
 * el vídeo de antes a después. Sin dependencias; el <input type="range"> nativo
 * aporta teclado y lector de pantalla.
 */
type Chapter = 'antes' | 'obra' | 'despues';

interface ObraMeta {
  id: string;
  video: string;
  poster: string;
  duracion: number;
  obraT: number | null;
  despuesT: number;
}

const LABEL: Record<Chapter, string> = { antes: 'Antes', obra: 'En obra', despues: 'Después' };
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt = (s: number): string => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const readMeta = (b: HTMLButtonElement): ObraMeta => ({
  id: b.dataset.obra ?? '',
  video: b.dataset.video ?? '',
  poster: b.dataset.poster ?? '',
  duracion: Number(b.dataset.duracion),
  obraT: b.dataset.obraT ? Number(b.dataset.obraT) : null,
  despuesT: Number(b.dataset.despuesT),
});

export const initMoviola = (root: HTMLElement): void => {
  const q = <T extends Element>(sel: string): T => {
    const el = root.querySelector<T>(sel);
    if (!el) throw new Error(`moviola: falta ${sel}`);
    return el;
  };
  const video = q<HTMLVideoElement>('video');
  const range = q<HTMLInputElement>('#moviola-range');
  const tape = q<HTMLElement>('[data-tape]');
  const time = q<HTMLElement>('[data-time]');
  const chapterBadge = q<HTMLElement>('[data-chapter]');
  const playBtn = q<HTMLButtonElement>('[data-play]');
  const playIcon = q<HTMLElement>('[data-play-icon]');
  const bigPlay = q<HTMLButtonElement>('[data-big-play]');
  const markObra = q<HTMLElement>('[data-mark="obra"]');
  const markDespues = q<HTMLElement>('[data-mark="despues"]');
  const jumpObra = q<HTMLButtonElement>('[data-jump="obra"]');
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-obra]')];
  const fichas = [...root.querySelectorAll<HTMLElement>('[data-ficha]')];

  let meta = readMeta(buttons[0]!);
  let seekTarget: number | null = null;
  let raf = 0;
  let interacted = false;

  // Con JS tomamos el control: fuera los controles nativos.
  video.controls = false;
  bigPlay.classList.replace('hidden', 'grid');

  const duration = (): number => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : meta.duracion);

  const chapterAt = (t: number): Chapter => {
    if (t >= meta.despuesT) return 'despues';
    if (meta.obraT !== null && t >= meta.obraT) return 'obra';
    return 'antes';
  };

  const render = (t: number): void => {
    const d = duration();
    const p = Math.min(100, (t / d) * 100);
    tape.style.setProperty('--p', `${p}%`);
    if (seekTarget === null) range.value = String(Math.round(p * 10));
    const ch = chapterAt(t);
    chapterBadge.textContent = LABEL[ch];
    chapterBadge.classList.toggle('bg-grafito', ch === 'despues');
    chapterBadge.classList.toggle('text-cal', ch === 'despues');
    chapterBadge.classList.toggle('bg-cal', ch !== 'despues');
    chapterBadge.classList.toggle('text-grafito', ch !== 'despues');
    time.textContent = `${fmt(t)} / ${fmt(d)}`;
    range.setAttribute('aria-valuetext', `${LABEL[ch]}, segundo ${Math.floor(t)} de ${Math.floor(d)}`);
  };

  const renderPlaying = (): void => {
    const playing = !video.paused && !video.ended;
    playIcon.textContent = playing ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    bigPlay.classList.toggle('opacity-0', playing || interacted);
    bigPlay.classList.toggle('pointer-events-none', playing || interacted);
  };

  const loop = (): void => {
    render(video.currentTime);
    if (!video.paused) raf = requestAnimationFrame(loop);
  };

  const seek = (t: number): void => {
    seekTarget = Math.max(0, Math.min(t, duration() - 0.05));
    if (video.seeking) return;
    const target = seekTarget;
    if (typeof video.fastSeek === 'function') video.fastSeek(target);
    else video.currentTime = target;
  };

  const play = (): void => {
    interacted = true;
    if (video.ended) video.currentTime = 0;
    void video.play().catch(() => undefined);
  };
  const toggle = (): void => (video.paused ? play() : video.pause());

  const placeMarks = (): void => {
    const d = meta.duracion;
    markDespues.style.left = `${(meta.despuesT / d) * 100}%`;
    markObra.classList.toggle('hidden', meta.obraT === null);
    jumpObra.classList.toggle('hidden', meta.obraT === null);
    if (meta.obraT !== null) markObra.style.left = `${(meta.obraT / d) * 100}%`;
  };

  const select = (btn: HTMLButtonElement, autoplay: boolean): void => {
    meta = readMeta(btn);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    fichas.forEach((f) => (f.hidden = f.dataset.ficha !== meta.id));
    video.pause();
    video.poster = meta.poster;
    video.src = meta.video;
    video.setAttribute('aria-label', `Vídeo de la obra: ${btn.querySelector('.truncate')?.textContent ?? ''}`);
    video.load();
    placeMarks();
    render(0);
    if (autoplay) play();
  };

  // Eventos del vídeo
  video.addEventListener('play', () => {
    renderPlaying();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  });
  video.addEventListener('pause', renderPlaying);
  video.addEventListener('ended', () => {
    renderPlaying();
    render(duration());
  });
  video.addEventListener('seeked', () => {
    if (seekTarget !== null && Math.abs(video.currentTime - seekTarget) > 0.12) {
      seek(seekTarget);
      return;
    }
    seekTarget = null;
    render(video.currentTime);
  });
  video.addEventListener('loadedmetadata', () => render(video.currentTime));
  video.addEventListener('click', toggle);

  // Cinta métrica
  range.addEventListener('input', () => {
    interacted = true;
    video.pause();
    const t = (Number(range.value) / 1000) * duration();
    render(t);
    seek(t);
  });

  playBtn.addEventListener('click', toggle);
  bigPlay.addEventListener('click', play);

  root.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((b) =>
    b.addEventListener('click', () => {
      interacted = true;
      video.pause();
      const target = b.dataset.jump === 'despues' ? meta.despuesT + 0.3 : b.dataset.jump === 'obra' ? (meta.obraT ?? 0) + 0.3 : 0;
      render(target);
      seek(target);
    }),
  );

  buttons.forEach((b) => b.addEventListener('click', () => select(b, true)));

  // Primera vez que la moviola entra en pantalla: arranca sola (sin sonido), salvo movimiento reducido.
  if (!reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !interacted) {
          void video.play().catch(() => undefined);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(video);
  }

  placeMarks();
  render(0);
  renderPlaying();
};
