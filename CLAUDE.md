# Maison Aurèle

Site e-commerce de haute joaillerie (marque fictive) : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind v4, next-intl (FR/EN).
Lire `AGENTS.md` : cette version de Next.js diffère des connaissances d'entraînement, la doc locale est dans `node_modules/next/dist/docs/`.

## État

- Phase 1 (fondations : tokens, typographie, layout, i18n, navigation, pied de page) : faite.
- Phase 2 (catalogue de 15 pièces, CommerceProvider local + Shopify, collections, fiches produit, loupe) : faite.
- Phase 3 (3D procédurale : bague d'accueil, visionneuse, rendus fixes) : faite.
- Phases suivantes : 4 configurateur · 5 commerce · 6 éditorial · 7 perf/a11y/SEO.
  Après chaque phase : captures Playwright aux 4 largeurs, relecture, commit, puis attendre l'OK de l'utilisateur.

## Commandes

```
npm run dev            # http://localhost:3000
npm run check          # typegen + tsc + eslint + prettier + vitest
npm run build && PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e
```

Captures : `tests/e2e/captures/<largeur>/` (non versionnées).

## Architecture

- Catalogue : `data/collections.ts`, `data/products.ts` (textes FR/EN dans les données ; descriptions de 60 à 90 mots, testé). Interface `CommerceProvider` dans `lib/commerce/types.ts` ; accès mis en cache via `lib/commerce/index.ts` (`"use cache"`), fournisseur choisi par `COMMERCE_PROVIDER` (`local` par défaut, `shopify`).
- Shopify : `lib/commerce/shopify/` (requêtes Storefront, métadonnées sous l'espace `aurele`, conversion pure testée dans `tests/unit/shopify.test.ts`).
- Slugs inconnus : le proxy (`proxy.ts`) renvoie un vrai 404 avant le rendu (sinon le rendu partiel répond 200). Toute nouvelle route dynamique de catalogue doit y être ajoutée.
- 3D : `lib/three/gem-geometry.ts` (tailles facettées, testées : solides fermés), `components/three/` (studio procédural sans HDR dont la boîte principale suit le curseur ou le gyroscope, matières, modèles par `visual.form`, canevas). Diamant/saphir en réfraction (`MeshRefractionMaterial`) au niveau « complet » ; niveaux choisis par `lib/device/capabilities.ts`.
- `LazyJewel` : image fixe d'abord (LCP), 3D chargée au repos puis fondu ; pause hors écran ; Three.js jamais dans le bundle initial.
- Rendus fixes : `public/renders/<slug>--<métal>.webp`, générés par `npm run renders` (studio `app/studio-affiches`, construit à part dans `.next-affiches`, n'existe qu'avec `POSTER_STUDIO=1`). À relancer après toute modification d'un modèle, d'une matière ou du catalogue.
- Illustrations SVG (`components/art/JewelArt.tsx`) : vues « détail de la pierre » et « planche d'atelier ».
- Ambiance de collection : `data-ambiance` sur un élément de la page teinte `--fond` de toute la page (`:root:has(...)`). `.scene-nuit` force une section en pénombre.

## Conventions

- Commentaires et contenus en français ; noms de code en anglais. Toute chaîne visible passe par `messages/{fr,en}.json` (clés identiques, testé).
- Couleurs : uniquement les tokens de `app/globals.css` (la palette Tailwind par défaut est retirée). `--champagne` et `--pierre` sont décoratifs ; pour du texte ou du focus, `accent-encre` / `encre-douce` (contraste AA).
- Langue courante côté serveur : `next/root-params` (`locale`), jamais `headers()` (garde les pages statiques).
- URL traduites : déclarer chaque page dans `i18n/routing.ts` (`pathnames`), naviguer avec `Link` de `@/i18n/navigation`.
- Mouvement : courbe `ease-maison`, 600–1200 ms, montée ≤ 16 px ; `data-reveal` pour les révélations au scroll ; tout respecte `prefers-reduced-motion`.
- Composants serveur par défaut ; `"use client"` seulement pour l'interaction (menu, bascules).
- Pas de dépendance nouvelle sans raison écrite ici.
