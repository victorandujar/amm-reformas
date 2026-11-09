# AMM Reformas — propuesta web

> **Propuesta de diseño no oficial** preparada por Web Local Growth. No es la web oficial de AMM Reformas.

| | |
|---|---|
| **Cliente potencial** | AMM Reformas · Alberto Manjón · Sant Boi de Llobregat · [@amm_reformas](https://www.instagram.com/amm_reformas/) · 637 95 89 94 |
| **Objetivo** | Convertir el trabajo que ya enseña en Instagram en peticiones de presupuesto (WhatsApp y llamada) |
| **Alcance (Plan A)** | Home de una página: oficio, antes/después, obras, proceso y presupuesto; aviso legal y privacidad |
| **Estado** | Demo terminada · pendiente de revisión · `PUBLIC_IS_DEMO=true` |

## Dirección de arte — "A pie de obra"

La web funciona como el cuaderno de obra de un oficio con nombre propio, no como una constructora.

- **Colores** (`src/styles/global.css`, `@theme`):
  - `cal` #F1EDE4: fondo de yeso.
  - `grafito` #1F1F1D: texto.
  - `mortero` #6F6A61: líneas y notas.
  - `replanteo` #B8452A: único acento, la tiza roja del cordel de replanteo.
- **Tipografía:**
  - Archivo variable en ancho expandido (`wdth 125`) para la rotulación.
  - JetBrains Mono para cotas y anotaciones.
  - Las dos van autoalojadas.
- **Lenguaje gráfico:** plantas técnicas en SVG con líneas de cota que se dibujan al cargar (solo CSS, y respetan `prefers-reduced-motion`). Fondo de papel milimetrado, botones rectos y separadores en forma de regla.
- **Composición:**
  - Titular apilado y "medido" con una cota vertical sobre el plano, sin el hero partido texto/imagen.
  - Servicios como índice tipográfico.
  - Las obras en una tira horizontal con scroll-snap.
  - El proceso en tabla de fases.

## Funcionalidades

- **Comparador antes/después:** `BeforeAfter.astro`. Usa un `<input type="range">` nativo, funciona con teclado y tiene unas 10 líneas de TypeScript.
- **Formulario de presupuesto:**
  - Valida en el cliente (`src/lib/quote.ts`) y abre WhatsApp con el mensaje redactado.
  - No hay backend y no se guardan datos.
- **Barra fija en móvil** con Llamar y WhatsApp.
- **Obras como colección de contenido** (`src/content/obras/*.md`, con esquema Zod). Admite fotos optimizadas por `astro:assets` a AVIF/WebP en varios anchos.

## Recursos pendientes del negocio

| Recurso | Dónde va |
|---|---|
| Fotos reales de 4-8 obras (antes/después) | `src/assets/obras/` + campo `fotos` en cada `.md`; poner `ejemplo: false` |
| Dirección, código postal y NIF | `src/data/business.ts` y las páginas legales (campos `null` / *pendiente*) |
| Municipios en los que trabaja | `areaServed` en `business.ts` |
| Validar textos de proceso y promesas ("presupuesto por escrito") | `src/data/process.ts`, `Hero.astro` |

Mientras falten fotos, cada obra muestra un esquema técnico con la etiqueta "Foto real pendiente". **No se han inventado datos** (años, número de obras, reseñas ni horarios).

### Añadir una obra con fotos

```md
---
order: 1
tipo: bano
titulo: Bañera a plato de ducha
resumen: …
ejemplo: false
fotos:
  - src: ../../assets/obras/bano-01-despues.jpg
    alt: Baño reformado con plato de ducha a ras de suelo y mampara fija
---
```

## SEO

- `title` y `description` únicos.
- Canonical, Open Graph con imagen de 1200×630 (`public/og.png`) y sitemap.
- JSON-LD `GeneralContractor` generado desde `business.ts`, solo con datos verificados: sin `aggregateRating` ni dirección hasta confirmarlos.
- HTML semántico con un solo `h1`.
- **Modo demo** (`PUBLIC_IS_DEMO` distinto de `false`): `noindex, nofollow`, `robots.txt` con `Disallow: /` y banner de propuesta no oficial.
- **Producción:** `PUBLIC_IS_DEMO=false` y `SITE_URL=https://<dominio>`.

## Calidad comprobada

| Comprobación | Resultado |
|---|---|
| `astro check` (TS strictest) | 0 errores, 0 avisos |
| `astro build` | OK, 3 páginas + robots + sitemap |
| Lighthouse móvil (modo producción) | Rendimiento 99 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · LCP 1,8 s · CLS 0 |
| Lighthouse escritorio | 100 · 100 · 100 · 100 |
| Enlaces internos y anclas | Todos OK |
| Formulario | Errores accesibles (`aria-invalid` y `aria-live`), foco en el primer error, mensaje de WhatsApp correcto |
| Comparador | Funciona con teclado |
| Responsive | Sin scroll horizontal a 390 y a 1440 px |

En modo demo el SEO de Lighthouse baja a 66. Es intencionado, por el `noindex`.

## Ejecutar

```bash
cd projects/amm-reformas
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build → dist/
npm run preview
```

Requiere Node ≥ 22.

## Desplegar en Vercel

1. Importar el repositorio en Vercel.
2. **Root Directory:** `projects/amm-reformas`. Framework: Astro, que se detecta solo.
3. Variables de entorno: `PUBLIC_IS_DEMO=true` (y `SITE_URL` si se usa un dominio propio de la preview).
4. `vercel.json` ya incluye URLs limpias, cabeceras de seguridad y caché inmutable para `/_astro/*`.

Para pasar a producción: `PUBLIC_IS_DEMO=false`, dominio del cliente en `SITE_URL`, fotos reales y datos legales completos.
