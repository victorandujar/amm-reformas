import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** Póster optimizado para <video>: un único archivo ligero (el atributo poster no admite srcset). */
export const poster = async (src: ImageMetadata, width = 480): Promise<string> =>
  (await getImage({ src, width, format: 'webp', quality: 70 })).src;
