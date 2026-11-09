import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().positive(),
      tipo: z.enum(['bano', 'cocina']),
      titulo: z.string().min(3),
      resumen: z.string().min(10).max(260),
      /** Cambios visibles en el vídeo. Solo lo que se ve: sin inventar materiales ni plazos. */
      cambios: z.array(z.string()).min(2).max(6),
      /** Vídeo procesado en public/media/obras (ver scripts/media.sh). */
      video: z.string().regex(/^\/media\/obras\/[\w-]+\.mp4$/),
      duracion: z.number().positive(),
      /** Capítulos del vídeo (segundos): inicio de "obra" (opcional) y de "después". */
      capitulos: z.object({ obra: z.number().nonnegative().optional(), despues: z.number().positive() }),
      antes: z.object({ src: image(), alt: z.string().min(10) }),
      despues: z.object({ src: image(), alt: z.string().min(10) }),
      credito: z.string().optional(),
      instagram: z.url().optional(),
    })
    .refine((d) => d.capitulos.despues < d.duracion, { message: 'capitulos.despues debe ser menor que duracion' }),
});

export const collections = { obras };
