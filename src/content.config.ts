import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().positive(),
      tipo: z.enum(['bano', 'cocina', 'albanileria']),
      titulo: z.string().min(3),
      resumen: z.string().min(10).max(220),
      /** true mientras sea un hueco de la propuesta, sin fotos reales del negocio. */
      ejemplo: z.boolean().default(false),
      fotos: z
        .array(z.object({ src: image(), alt: z.string().min(8) }))
        .default([]),
    }),
});

export const collections = { obras };
