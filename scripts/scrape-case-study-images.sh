#!/usr/bin/env bash
# Scrape case-study images + videos from the live WordPress site.
# WordPress serves case studies at the site root (e.g. /news-uk/) not /work/[slug]/.
# Outputs newline-delimited JSON:
#   { "slug": "...", "images": ["..."], "videos": ["..."] }

set -euo pipefail

SLUGS=(
  news-uk
  al-jannah-villa-marrakech
  tedx-university-of-salford
  dcd-connect
  fireaway-pizza
  japex-automotive
  tulsi-vagjiani
  triage-vets
  kbmd
  vijays-virasat
  protech-motors
  metro-laundrette-dry-cleaners
  london-kings-clothing
  hd-security-systems
  ecoboxes
  high-five-family-fitness
  mhv-clinic
  ddg-windows-london
  chear-beauty
  kemp-services
  the-hollybush-bar-restaurant
  sefia-london
  taur-security
  la-royale
)

# Exclude site chrome / nav / footer logos — only keep editorial case-study imagery.
EXCLUDE_PATTERN='(wp-content/uploads/2025/01/wt|Emblem-logo|bbc\.svg|nhs\.svg|tedx\.svg|news-uk-logo|royal-london|fireaway-1|dcd-data|nec_iz|grok-image|favicon|apple-touch)'

OUT="/tmp/case-study-images.jsonl"
: > "$OUT"

for SLUG in "${SLUGS[@]}"; do
  # WordPress redirects /work/[slug]/ -> /[slug]/
  URL="https://terencemeghani.com/${SLUG}/"
  HTML=$(curl -sL --max-time 30 "$URL" || echo "")
  # Extract image URLs from data-src + src attributes
  # `|| true` guards against zero matches tripping `set -euo pipefail`.
  IMAGES=$(printf '%s' "$HTML" \
    | grep -oE '(data-src|data-lazy-src|src)="[^"]*\.(jpg|jpeg|png|webp)[^"]*"' \
    | sed -E 's/^[^"]*"//;s/"$//' \
    | grep -Ev "$EXCLUDE_PATTERN" \
    | sort -u || true)

  # Extract video URLs (webm/mp4/mov only — leave YouTube/Vimeo for a future
  # iframe-embed pass; the live site ships self-hosted webm via Cloudinary).
  VIDEOS=$(printf '%s' "$HTML" \
    | grep -oE '(data-src|src)="[^"]*\.(webm|mp4|mov)[^"]*"' \
    | sed -E 's/^[^"]*"//;s/"$//' \
    | sort -u || true)

  # Emit as JSON line with images + videos arrays
  {
    printf '{"slug":"%s","images":[' "$SLUG"
    FIRST=1
    while IFS= read -r IMG; do
      [[ -z "$IMG" ]] && continue
      if [[ $FIRST -eq 1 ]]; then FIRST=0; else printf ','; fi
      printf '"%s"' "$IMG"
    done <<< "$IMAGES"
    printf '],"videos":['
    FIRST=1
    while IFS= read -r VID; do
      [[ -z "$VID" ]] && continue
      if [[ $FIRST -eq 1 ]]; then FIRST=0; else printf ','; fi
      printf '"%s"' "$VID"
    done <<< "$VIDEOS"
    printf ']}\n'
  } >> "$OUT"
  ICOUNT=$(printf '%s' "$IMAGES" | grep -c . || true)
  VCOUNT=$(printf '%s' "$VIDEOS" | grep -c . || true)
  printf '  %-36s %s images  %s videos\n' "$SLUG" "$ICOUNT" "$VCOUNT"
done

echo "--- wrote $OUT ---"
