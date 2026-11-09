export interface Service {
  readonly id: string;
  readonly title: string;
  readonly lead: string;
  readonly scope: readonly string[];
}

/** Servicios declarados en la bio de @amm_reformas: baños, cocinas y albañilería. */
export const services: readonly Service[] = [
  {
    id: 'banos',
    title: 'Baños',
    lead: 'De la bañera que ya no usas a una ducha a ras de suelo. Se desmonta, se rehacen instalaciones y se alicata de nuevo.',
    scope: ['Cambio de bañera por plato de ducha', 'Alicatado y solado', 'Fontanería y desagües', 'Sanitarios y mampara'],
  },
  {
    id: 'cocinas',
    title: 'Cocinas',
    lead: 'Distribución, instalaciones y acabados. La obra completa para que la cocina nueva tenga dónde apoyarse.',
    scope: ['Derribo y redistribución', 'Puntos de agua y electricidad', 'Revestimientos de pared y suelo', 'Preparación para el montaje del mobiliario'],
  },
  {
    id: 'albanileria',
    title: 'Albañilería',
    lead: 'Tabiques, regatas, recrecidos y reparaciones. El oficio de base que sostiene cualquier reforma.',
    scope: ['Tabiquería y aperturas', 'Recrecidos y nivelación', 'Enlucidos y reparaciones', 'Pequeña obra en general'],
  },
];
