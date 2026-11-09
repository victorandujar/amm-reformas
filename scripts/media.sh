#!/usr/bin/env bash
# Genera los vídeos web y fotogramas a partir de los reels originales de @amm_reformas.
# Originales (no versionados): media-src/<id>.mp4  ·  Requiere ffmpeg.
# Uso: bash scripts/media.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media-src
OUT_V=public/media/obras
OUT_H=public/media/hero
OUT_I=src/assets/obras
OUT_P=src/assets/proceso
mkdir -p "$OUT_V" "$OUT_H" "$OUT_I" "$OUT_P"

# slug | id | fin (s, antes del sello final) | t antes | t después
OBRAS=(
  "bano-ducha-madera|DdUTzDOOAor|35.5|2.4|31.0"
  "bano-led|DHggjFdtJ2l|25.5|1.0|6.5"
  "bano-hornacina|DVzEkgEDiqX|15.5|0.4|13.2"
  "bano-integral|DWMjm9NjdMi|47.0|0.5|21.0"
  "cocina-isla|DJXShSMuOpr|33.5|3.0|32.0"
  "cocina-office|DUq23R6DqdO|53.0|6.0|46.0"
)

for row in "${OBRAS[@]}"; do
  IFS='|' read -r slug id end ta td <<<"$row"
  in="$SRC/$id.mp4"
  # Vídeo web: 432×768, sin audio, GOP corto (-g 15 = 0,5 s) para poder arrastrar sin saltos.
  ffmpeg -v error -y -i "$in" -t "$end" -an -vf "scale=432:768:force_original_aspect_ratio=increase,crop=432:768,fps=30" \
    -c:v libx264 -preset slow -crf 29 -g 15 -keyint_min 15 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart "$OUT_V/$slug.mp4"
  ffmpeg -v error -y -ss "$ta" -i "$in" -frames:v 1 -q:v 2 "$OUT_I/$slug-antes.jpg"
  ffmpeg -v error -y -ss "$td" -i "$in" -frames:v 1 -q:v 2 "$OUT_I/$slug-despues.jpg"
done

# Bucles cortos para la portada (solo "después"), 480×854, muy ligeros.
HERO=(
  "1|DdUTzDOOAor|10|7"
  "2|DJXShSMuOpr|11|7"
  "3|DVzEkgEDiqX|3.5|7"
)
for row in "${HERO[@]}"; do
  IFS='|' read -r n id ss dur <<<"$row"
  ffmpeg -v error -y -ss "$ss" -i "$SRC/$id.mp4" -t "$dur" -an \
    -vf "scale=480:854:force_original_aspect_ratio=increase,crop=480:854,fps=30" \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT_H/hero-$n.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$SRC/$id.mp4" -frames:v 1 -q:v 3 "$OUT_I/hero-$n.jpg"
done

# Fotogramas del proceso (obra bano-integral).
P="$SRC/DWMjm9NjdMi.mp4"
for row in "visita|0.6" "picado|8.2" "solado|10.2" "alicatado|16.4" "acabados|40.2" "entrega|30.0"; do
  IFS='|' read -r name t <<<"$row"
  ffmpeg -v error -y -ss "$t" -i "$P" -frames:v 1 -q:v 2 "$OUT_P/$name.jpg"
done
echo "OK"
