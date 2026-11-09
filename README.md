# AMM Reformas — propuesta web

> **Propuesta de diseño no oficial** preparada por Web Local Growth. No es la web oficial de AMM Reformas.

| | |
|---|---|
| **Cliente potencial** | AMM Reformas · Alberto Manjón · Sant Boi de Llobregat · [@amm_reformas](https://www.instagram.com/amm_reformas/) · 637 95 89 94 |
| **Objetivo** | Convertir el trabajo que ya enseña en Instagram en peticiones de presupuesto (WhatsApp y llamada) |
| **Alcance (Plan A)** | Home de una página: portada en vídeo, moviola de obras, oficio, antes/después, proceso y presupuesto; aviso legal y privacidad |
| **Estado** | Demo terminada · pendiente de revisión · `PUBLIC_IS_DEMO=true` |

## Identidad

- **Marca:** logotipo original de AMM Reformas vectorizado (`src/assets/brand/`: `amm-mark`, `amm-lockup`, `amm-full`). Hereda `currentColor` y sirve en blanco o negro.
- **Paleta:** el blanco y negro del logotipo (`src/styles/global.css`, `@theme`). La interfaz no añade color; el color lo ponen sus obras.
- **Tipografía:** Poppins, geométrica como el logotipo, para titulares y texto. JetBrains Mono para cotas y anotaciones. Las dos van autoalojadas.
- **Concepto "A pie de obra":** cinta métrica, cotas y papel milimetrado como lenguaje gráfico.

## Funcionalidades

- **Portada en vídeo:** tríptico de reels reales (uno en móvil). Los vídeos solo se cargan y reproducen cuando están en pantalla, respetan `prefers-reduced-motion` y tienen un botón para pausarlos (WCAG 2.2.2). Script: `src/scripts/videos.ts`.
- **Moviola de obras:** `Obras.astro` + `src/scripts/moviola.ts`.
  - Se elige la obra en el índice y se reproduce, o se **arrastra la cinta métrica** para recorrer el vídeo fotograma a fotograma.
  - La cinta marca los capítulos "Antes / En obra / Después", con botones para saltar a cada uno.
  - Usa un `<input type="range">` nativo (teclado y lector de pantalla incluidos). Sin JavaScript, el vídeo tiene controles nativos.
- **Comparador antes/después** con fotos reales, por teclado o arrastrando.
- **Proceso** ilustrado con fotogramas reales de una de sus obras.
- **Formulario de presupuesto:** valida en el cliente y abre WhatsApp con el mensaje redactado. No hay backend y no se guardan datos.
- **Barra fija en móvil** con Llamar y WhatsApp.

## Medios

Los vídeos son los reels publicados en [@amm_reformas](https://www.instagram.com/amm_reformas/).

- **Originales:** en `media-src/` (no versionados).
- **`scripts/media.sh`** (requiere `ffmpeg`) genera:
  - `public/media/obras/*.mp4`: 432×768, sin audio, keyframe cada 0,5 s para poder arrastrar con fluidez, de 0,7 a 3 MB.
  - `public/media/hero/*.mp4`: bucles de 7 s, unos 300 KB.
  - `src/assets/obras/*.jpg` y `src/assets/proceso/*.jpg`: fotogramas que `astro:assets` optimiza a WebP/AVIF.
- **Cada obra** es un `.md` en `src/content/obras/` con esquema Zod: vídeo, duración, capítulos y fotos de antes/después.
- **Los textos** solo describen lo que se ve en los vídeos. La cocina 06 mantiene el crédito "Diseño de cocina, PEMA" que aparece en el reel.

**Derechos:** los vídeos y el logotipo son de AMM Reformas. Se usan solo en esta propuesta privada; para publicar hace falta su autorización.

## Pendiente del negocio

| Dato | Dónde va |
|---|---|
| Dirección, código postal y NIF | `src/data/business.ts` y las páginas legales |
| Municipios en los que trabaja | `areaServed` en `business.ts` |
| Validar textos de proceso y servicios | `src/data/process.ts`, `src/data/services.ts` |
| Autorización para usar sus vídeos y su logotipo | — |

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
| Lighthouse móvil (modo producción) | Rendimiento 99 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · LCP 2,0 s · CLS 0 · 542 KiB |
| Lighthouse escritorio | 100 · 100 · 100 · 100 |
| Enlaces internos y anclas | Todos OK |
| Formulario | Errores accesibles (`aria-invalid` y `aria-live`), foco en el primer error, mensaje de WhatsApp correcto |
| Comparador | Funciona con teclado |
| Moviola | Probada: arrastre, teclado (Inicio/flechas), saltos de capítulo, cambio de obra, play/pausa |
| Vídeos de portada | Se pausan con el botón; no se cargan fuera de pantalla |
| Responsive | Sin scroll horizontal a 390 y a 1440 px |

En modo demo el SEO de Lighthouse baja a 66. Es intencionado, por el `noindex`.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build → dist/
npm run preview
```

Requiere Node ≥ 22.

## Desplegar en Vercel

1. Importar el repositorio en Vercel.
2. **Root Directory:** la raíz del repo (por defecto). Framework: Astro, que se detecta solo.
3. Variables de entorno: `PUBLIC_IS_DEMO=true` (y `SITE_URL` si se usa un dominio propio de la preview).
4. `vercel.json` ya incluye URLs limpias, cabeceras de seguridad y caché inmutable para `/_astro/*`.

Para pasar a producción: `PUBLIC_IS_DEMO=false`, dominio del cliente en `SITE_URL`, fotos reales y datos legales completos.
