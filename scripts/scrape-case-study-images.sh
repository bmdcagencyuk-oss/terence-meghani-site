#!/usr/bin/env bash
# Scrape case-study images from the live WordPress site.
# WordPress serves case studies at the site root (e.g. /news-uk/) not /work/[slug]/.
# Outputs newline-delimited JSON: { "slug": "...", "images": ["...", ...] } per slug.

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
  IMAGES=$(printf '%s' "$HTML" \
    | grep -oE '(data-src|data-lazy-src|src)="[^"]*\.(jpg|jpeg|png|webp)[^"]*"' \
    | sed -E 's/^[^"]*"//;s/"$//' \
    | grep -Ev "$EXCLUDE_PATTERN" \
    | sort -u)
  # Emit as JSON array line
  {
    printf '{"slug":"%s","images":[' "$SLUG"
    FIRST=1
    while IFS= read -r IMG; do
      [[ -z "$IMG" ]] && continue
      if [[ $FIRST -eq 1 ]]; then FIRST=0; else printf ','; fi
      printf '"%s"' "$IMG"
    done <<< "$IMAGES"
    printf ']}\n'
  } >> "$OUT"
  COUNT=$(printf '%s' "$IMAGES" | grep -c . || true)
  printf '  %-36s %d images\n' "$SLUG" "$COUNT"
done

echo "--- wrote $OUT ---"
