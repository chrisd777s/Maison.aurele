# Maison Aurèle

Site e-commerce de haute joaillerie (marque fictive) : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind v4, next-intl (FR/EN).
Lire `AGENTS.md` : cette version de Next.js diffère des connaissances d'entraînement, la doc locale est dans `node_modules/next/dist/docs/`.

## État

- Phase 1 (fondations : tokens, typographie, layout, i18n, navigation, pied de page) : faite.
- Phase 2 (catalogue de 15 pièces, CommerceProvider local + Shopify, collections, fiches produit, loupe) : faite.
- Phase 3 (3D procédurale : bague d'accueil, visionneuse, rendus fixes) : faite.
- Phase 4 (configurateur L'Atelier) : faite.
- Phase 5 (panier, Écrin et partage, Stripe Checkout, rendez-vous privé, courriels) : faite.
- Phase 6 (La Maison, Savoir-faire, Provenance, guide des tailles, Journal, pages légales) : faite.
- Phase 7 (performance, accessibilité, référencement, README, rapport Lighthouse) : faite.
  Après chaque phase : captures Playwright aux 4 largeurs, relecture, commit, puis attendre l'OK de l'utilisateur.

## Commandes

```
npm run dev            # http://localhost:3000
npm run check          # typegen + tsc + eslint + prettier + vitest
npm run build && PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e
node scripts/measure-js.mjs http://localhost:3100 /fr   # JS par page (serveur lancé)
scripts/lighthouse.sh                                   # Lighthouse mobile + bureau
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
- Atelier : `lib/atelier/` (état et codec d'URL versionné `v=1` : `forme`, `carats`, `metal`, `monture`, `gravure` ; barème indicatif dans `pricing.ts` ; pièce virtuelle `configuredProduct` dessinée par la 3D et le SVG). La page reste statique : la bague par défaut sert de repli au `Suspense`, `AtelierFromUrl` lit l'URL côté client ; le configurateur réécrit l'URL par `history.replaceState`. Le lien « Réaliser avec l'atelier » transmet `?creation=<paramètres>` au rendez-vous.
- Boutique : `lib/shop/` (magasin Zustand persisté `useShop`, relu après montage par `ShopProvider` — n'y écrire qu'une fois `hydrated`, sinon le stockage local est écrasé ; état d'interface à part, ex. `useCartDrawer`). Catalogue réduit (`CatalogueEntry`) transmis par le layout. `priceOrder` calcule l'affichage ET le montant facturé (le navigateur n'envoie que des références). Acompte : seuil et taux dans `order.ts`.
- Prix affichés : toujours `<Price cad={…} />` (devise d'affichage) ; `formatPrice` reste pour le serveur et les courriels (CAD).
- Écrin partagé : jeton base64url sans stockage (`lib/ecrin/token.ts`), validé dans le proxy (404) ; page `instant = false` (rendue à la demande, non indexée).
- Paiement : `app/api/checkout` (Stripe REST via `lib/stripe.ts`, mode démonstration sans clé), webhook signé `app/api/stripe/webhook`.
- Rendez-vous : `lib/appointment/` (schéma Zod partagé formulaire/route, créneaux calculés, .ics), formulaire RHF en 3 étapes (`components/appointment/`), route `app/api/rendez-vous`. Courriels : `lib/mail/` (`.outbox/` ou Resend), gabarits en tableaux et styles en ligne (couleurs de `lib/brand/hex.ts`).
- Éditorial : textes longs dans `data/` (`journal.ts`, `legal.ts`, `house.ts`), blocs `lib/editorial/types.ts` rendus par `components/editorial/Prose.tsx` ; jamais dans `messages/` (destiné à l'interface et en partie transmis au navigateur). `data/journal-index.ts` sans les corps (lu par le proxy). Espaces fines insécables avant `: ; ? !` et dans « ».
- Savoir-faire : `CraftArt` (une bague en six calques `[data-etape]`) ; `CraftSequence` charge GSAP + ScrollTrigger à la demande sur grand écran seulement (scène `sticky`, étape active en `data-actif`, tracés liés au défilement si le mouvement est permis) ; sans JS ou sur mobile, une illustration par étape.
- Provenance : `data/provenance.ts`, `lib/provenance/` (parcours, projection de la carte, `normalizeCode`). Codes et articles validés dans le proxy (404, minuscules redirigées). Recherche sans JS via `GET /api/provenance`.
- Guide des tailles : `lib/sizing/ring.ts` (CA/US, FR, UK, testé), `components/sizing/RingSizer.tsx` (carte ID-1 en portrait sur écran étroit).
- Messages côté client : `components/i18n/ClientMessages.tsx` ne transmet que `LAYOUT_NAMESPACES` + les espaces de noms passés par la page (`<ClientMessages namespaces={[…]}>` autour des composants clients). Tout nouveau `useTranslations("X")` dans un composant client doit y figurer (testé dans `tests/unit/seo-perf.test.ts`).
- 3D et appareil : sans carte graphique (WebGL logiciel : SwiftShader, llvmpipe), pas de 3D automatique (image fixe / SVG) ; la « Vue 3D » demandée passe en rendu léger. `localStorage["aurele-3d"]="force"` la force (tests e2e).
- Référencement : `app/sitemap.ts`, `app/robots.ts`, `openGraphBase(locale)` (à reprendre dans toute page qui définit `openGraph`), images de partage `app/og/[locale]/[kind]/[id]` (`lib/og/`, générées au build ; polices OFL réduites dans `assets/fonts`, rendus en JPEG dans `public/renders/partage` car `next/og` ne dessine pas le WebP). Le proxy ignore `/og/` et `/apple-icon`.
- Polices : `next/font/local` sur `assets/fonts/web/` (Cormorant romain 300–400, italique 300, Jost 300–400), réduites aux caractères du site par `scripts/fonts.sh` (fonttools). Nouvelle graisse ou nouveau caractère hors latin-1 : l'ajouter au script et régénérer.
- Ambiance de collection : `<html data-ambiance>` teinte `--fond` de tout le site sur une collection et ses pièces ; déduite de l'adresse (`lib/ambiance.ts`) par le script d'amorçage du gabarit puis par `AmbianceSync` aux navigations. Pas de `:root:has(...)` (recalcul de style de tout le document à chaque modification du DOM) ; défilement bloqué sous un `<dialog>` par `lib/dom/scroll-lock.ts`. `.scene-nuit` force une section en pénombre.

## Conventions

- Commentaires et contenus en français ; noms de code en anglais. Toute chaîne visible passe par `messages/{fr,en}.json` (clés identiques, testé).
- Couleurs : uniquement les tokens de `app/globals.css` (la palette Tailwind par défaut est retirée). Seule exception : `lib/brand/hex.ts` (courriels, images de partage, icônes), dont la concordance avec les tokens est testée. `--champagne` et `--pierre` sont décoratifs ; pour du texte ou du focus, `accent-encre` / `encre-douce` (contraste AA).
- Langue courante côté serveur : `next/root-params` (`locale`), jamais `headers()` (garde les pages statiques).
- URL traduites : déclarer chaque page dans `i18n/routing.ts` (`pathnames`), naviguer avec `Link` de `@/i18n/navigation`.
- Mouvement : courbe `ease-maison`, 600–1200 ms, montée ≤ 16 px ; `data-reveal` pour les révélations au scroll ; tout respecte `prefers-reduced-motion`.
- Composants serveur par défaut ; `"use client"` seulement pour l'interaction (menu, bascules).
- Pas de dépendance nouvelle sans raison écrite ici. Ajoutées : `zustand` (panier/Écrin persistés), `react-hook-form` + `zod` (formulaires, schémas partagés avec les routes ; adaptateur maison `lib/forms/zod-resolver.ts`, `@hookform/resolvers` ayant des dépendances optionnelles en conflit). Stripe et Resend : API REST par `fetch`, sans SDK. `gsap` (séquence épinglée du Savoir-faire ; chargé à la demande, jamais dans le bundle initial). `@axe-core/playwright` (dev : audit WCAG 2.2 AA automatisé dans les tests e2e). `sharp` est celui de Next.js, utilisé seulement par les scripts de rendu.
- `fieldset` : `min-inline-size: 0` posé globalement (sinon débordement horizontal sur mobile).
