export interface Step {
  readonly n: string;
  readonly title: string;
  readonly text: string;
}

/** Proceso propuesto para validar con el negocio. No incluye plazos: no se inventan. */
export const steps: readonly Step[] = [
  { n: '01', title: 'Visita', text: 'Vemos la obra en persona. Medidas, estado de las instalaciones y lo que quieres conseguir.' },
  { n: '02', title: 'Presupuesto', text: 'Por partidas y por escrito, para que sepas qué incluye cada cosa antes de empezar.' },
  { n: '03', title: 'Derribo', text: 'Se protege la vivienda y se retira lo viejo. Escombro fuera, sin dejarlo en el rellano.' },
  { n: '04', title: 'Instalaciones', text: 'Agua, desagües y electricidad nuevos antes de cerrar paredes.' },
  { n: '05', title: 'Acabados', text: 'Alicatado, solado, sanitarios y remates. Lo que se ve y lo que dura.' },
  { n: '06', title: 'Entrega', text: 'Repasamos juntos la obra terminada y limpia.' },
];
