/** Construcción y validación del mensaje de presupuesto (sin dependencias, testeable). */
export interface QuoteRequest {
  nombre: string;
  tipo: string;
  municipio: string;
  metros: string;
  detalle: string;
}

export type QuoteErrors = Partial<Record<keyof QuoteRequest, string>>;

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');

export const readQuote = (data: FormData): QuoteRequest => ({
  nombre: clean(data.get('nombre')),
  tipo: clean(data.get('tipo')),
  municipio: clean(data.get('municipio')),
  metros: clean(data.get('metros')),
  detalle: clean(data.get('detalle')),
});

export const validateQuote = (q: QuoteRequest): QuoteErrors => {
  const errors: QuoteErrors = {};
  if (q.nombre.length < 2) errors.nombre = 'Escribe tu nombre.';
  if (!q.tipo) errors.tipo = 'Elige el tipo de obra.';
  if (q.municipio.length < 2) errors.municipio = 'Indica el municipio de la obra.';
  if (q.metros && !/^\d{1,4}([.,]\d{1,2})?$/.test(q.metros)) errors.metros = 'Solo números, por ejemplo 6 o 4,5.';
  if (q.detalle.length > 600) errors.detalle = 'Máximo 600 caracteres.';
  return errors;
};

export const quoteMessage = (q: QuoteRequest): string =>
  [
    `Hola Alberto, soy ${q.nombre}.`,
    `Quería presupuesto para: ${q.tipo}.`,
    `Municipio: ${q.municipio}.`,
    q.metros ? `Metros aproximados: ${q.metros} m².` : '',
    q.detalle ? `Detalle: ${q.detalle}` : '',
  ]
    .filter(Boolean)
    .join('\n');
