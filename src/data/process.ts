import type { ImageMetadata } from 'astro';
import visita from '../assets/proceso/visita.jpg';
import picado from '../assets/proceso/picado.jpg';
import solado from '../assets/proceso/solado.jpg';
import alicatado from '../assets/proceso/alicatado.jpg';
import acabados from '../assets/proceso/acabados.jpg';
import entrega from '../assets/proceso/entrega.jpg';

export interface Step {
  readonly n: string;
  readonly title: string;
  readonly text: string;
  readonly img: ImageMetadata;
  readonly alt: string;
}

/** Fases ilustradas con fotogramas reales de una de sus obras. Sin plazos inventados. */
export const steps: readonly Step[] = [
  { n: '01', title: 'Visita y presupuesto', text: 'Vemos la obra en persona, medimos y te paso el presupuesto por partidas.', img: visita, alt: 'Baño antiguo antes de empezar la obra' },
  { n: '02', title: 'Picado e instalaciones', text: 'Se pica lo viejo y se rehacen agua y desagües antes de cerrar paredes.', img: picado, alt: 'Operario trabajando en las tuberías nuevas dentro de la pared picada' },
  { n: '03', title: 'Solado', text: 'Suelo nuevo colocado y nivelado pieza a pieza.', img: solado, alt: 'Operario asentando una baldosa efecto madera con la maza' },
  { n: '04', title: 'Alicatado', text: 'Paredes alicatadas con niveladores para que todo quede plano.', img: alicatado, alt: 'Operario alicatando la pared con niveladores de baldosa' },
  { n: '05', title: 'Acabados', text: 'Mueble, lavabo, grifería, espejo y remates.', img: acabados, alt: 'Mueble de madera con lavabo sobre encimera negra' },
  { n: '06', title: 'Entrega', text: 'Repasamos juntos la obra terminada y limpia.', img: entrega, alt: 'Ducha terminada con mampara y hornacinas iluminadas' },
];
