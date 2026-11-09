/**
 * Fuente única de datos del negocio (NAP, contacto, servicios).
 * Solo datos publicados por el propio negocio. Lo no verificado queda en `null`
 * y los componentes lo omiten: nunca se rellena con datos inventados.
 */
export interface Business {
  readonly name: string;
  readonly owner: string;
  readonly city: string;
  readonly region: string;
  readonly postalCode: string | null;
  readonly streetAddress: string | null;
  readonly phone: { readonly display: string; readonly e164: string };
  readonly instagram: { readonly handle: string; readonly url: string };
  readonly areaServed: readonly string[];
}

export const business: Business = {
  name: 'AMM Reformas',
  owner: 'Alberto Manjón',
  city: 'Sant Boi de Llobregat',
  region: 'Barcelona',
  postalCode: null, // pendiente de confirmar con el negocio
  streetAddress: null, // pendiente de confirmar con el negocio
  phone: { display: '637 95 89 94', e164: '+34637958994' },
  instagram: { handle: '@amm_reformas', url: 'https://www.instagram.com/amm_reformas/' },
  // Pendiente de validar con el negocio: municipios en los que trabaja realmente.
  areaServed: ['Sant Boi de Llobregat', 'Baix Llobregat'],
};

export const whatsappUrl = (text?: string): string => {
  const base = `https://wa.me/${business.phone.e164.replace('+', '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const telUrl = `tel:${business.phone.e164}`;
