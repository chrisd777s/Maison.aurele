#!/bin/bash
# Audit Lighthouse (mobile et bureau) des pages principales, sur un serveur de production.
# Usage : npm run build && npx next start -p 3100 &   puis   scripts/lighthouse.sh [base] [dossier]
# Le build doit connaître son URL (NEXT_PUBLIC_SITE_URL=http://localhost:3100), sinon
# l'audit SEO signale une URL canonique sur un autre domaine.
set -euo pipefail
BASE=${1:-http://localhost:3100}
OUT=${2:-lighthouse}
mkdir -p "$OUT"
PAGES=(/fr /en /fr/collections/maree /fr/creations/maree-haute /en/pieces/aube-premiere /fr/atelier
  /fr/rendez-vous /fr/la-maison /fr/savoir-faire /fr/provenance/MA201-0302 /fr/guide-des-tailles
  /fr/journal /fr/journal/choisir-un-diamant /fr/confidentialite)
for page in "${PAGES[@]}"; do
  name=$(echo "${page#/}" | tr '/' '_')
  for preset in mobile desktop; do
    flags=()
    [ "$preset" = desktop ] && flags=(--preset=desktop)
    npx -y lighthouse@12 "$BASE$page" --quiet "${flags[@]}" \
      --chrome-flags="--headless=new --no-sandbox" \
      --output=json --output-path="$OUT/$name.$preset.json" || echo "échec : $page ($preset)"
  done
done
node scripts/lighthouse-summary.mjs "$OUT"
