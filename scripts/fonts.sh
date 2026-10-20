#!/bin/bash
# Régénère les polices web auto-hébergées (assets/fonts/web) depuis les sources
# OFL de Google Fonts : graisses utiles seulement, caractères du site seulement.
# Prérequis : pip install fonttools brotli
# Un caractère absent (nom étranger saisi dans un formulaire…) s'affiche dans la
# police de repli, lettre par lettre : ajouter sa plage à UNICODES au besoin.
set -euo pipefail
OUT=assets/fonts/web
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
B=https://raw.githubusercontent.com/google/fonts/main/ofl
UNICODES="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+0178,U+02C6,U+02DA,U+02DC,U+1D49,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2039-203A,U+202F,U+20AC,U+2122,U+2190,U+2192,U+2212,U+221E,U+2248,U+2265"

build() { # source, graisses (300 ou 300:400), sortie
  curl -sSfL -o "$TMP/src.ttf" "$B/$1"
  fonttools varLib.instancer "$TMP/src.ttf" "wght=$2" -o "$TMP/inst.ttf" -q
  pyftsubset "$TMP/inst.ttf" --unicodes="$UNICODES" --layout-features+=onum,lnum,pnum,tnum \
    --flavor=woff2 --output-file="$OUT/$3"
  echo "✓ $3 ($(wc -c <"$OUT/$3") octets)"
}

# Cormorant : romain 300–400 (titres 300, logo 400, texte hérité 350), italique 300.
build "cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf" 300:400 CormorantGaramond-300-400.woff2
build "cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf" 300 CormorantGaramond-Italic-300.woff2
# Jost : texte 350, surtitres 400, chapeaux 300.
build "jost/Jost%5Bwght%5D.ttf" 300:400 Jost-300-400.woff2
