# Maison Aurèle

Site de haute joaillerie — « La lumière, captive. »

Marque **fictive** : maison de haute joaillerie de Montréal (atelier-boutique du Vieux-Montréal, salon privé à Paris). Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind v4, next-intl (FR/EN), Three.js pour la 3D, GSAP pour la séquence du Savoir-faire.

Le site tourne **sans aucun compte externe** : catalogue local, paiement en mode démonstration, courriels écrits sur disque. Chaque service se branche par une variable d'environnement.

## Pages

| Page                                  | FR                                  | EN                                    |
| ------------------------------------- | ----------------------------------- | ------------------------------------- |
| Accueil (bague 3D)                    | `/fr`                               | `/en`                                 |
| Collections (Aube, Marée, Obsidienne) | `/fr/collections/aube`              | `/en/collections/aube`                |
| Fiche pièce (loupe, visionneuse 3D)   | `/fr/creations/aube-premiere`       | `/en/pieces/aube-premiere`            |
| L'Atelier (configurateur)             | `/fr/atelier`                       | `/en/atelier`                         |
| Rendez-vous privé                     | `/fr/rendez-vous`                   | `/en/private-appointment`             |
| Écrin (sélection partageable)         | `/fr/ecrin`                         | `/en/ecrin`                           |
| La Maison, Savoir-faire               | `/fr/la-maison`, `/fr/savoir-faire` | `/en/the-maison`, `/en/craftsmanship` |
| Provenance (code de l'écrin)          | `/fr/provenance/AU101-0187`         | `/en/provenance/AU101-0187`           |
| Guide des tailles                     | `/fr/guide-des-tailles`             | `/en/ring-size-guide`                 |
| Journal                               | `/fr/journal`                       | `/en/journal`                         |
| Pages légales                         | `/fr/confidentialite`, …            | `/en/privacy`, …                      |

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000 → redirige vers /fr ou /en
```

## Vérifier

```bash
npm run check      # types, lint, format, tests unitaires
npm run build
npx playwright install chromium   # une seule fois, en local
npm run test:e2e   # parcours, audit axe WCAG 2.2 AA, captures 375 / 768 / 1280 / 1920 px
```

Mesures (serveur de production lancé sur le port 3100) :

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && npx next start -p 3100 &
node scripts/measure-js.mjs http://localhost:3100 /fr /fr/journal   # JS chargé par page
scripts/lighthouse.sh                                               # Lighthouse mobile + bureau
```

## Visuels des pièces

Les images des pièces sont rendues depuis la scène 3D procédurale (aucun fichier 3D externe) :

```bash
npm run renders                 # toutes les pièces, tous les métaux
npm run renders -- aube-premiere  # une seule pièce
```

Pour les remplacer par des photographies, déposer `public/renders/<slug>--<métal>.webp`
(1600 × 2000, fond transparent ou uni) avec les mêmes noms, puis `node scripts/share-renders.mjs`
(versions JPEG utilisées par les images de partage).

Les illustrations du Savoir-faire, de La Maison et du Journal sont des compositions vectorielles
provisoires (`components/craft`, `components/journal`, `app/[locale]/la-maison`) : à remplacer par
les photographies de l'atelier.

## Variables d'environnement

Copier `.env.example` en `.env.local`. Toutes sont facultatives en local.

| Variable                                                                  | Rôle                                                              | Sans valeur                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                    | URL publique : canoniques, hreflang, sitemap, Open Graph, JSON-LD | `http://localhost:3000` (**obligatoire en production**, lue au build) |
| `COMMERCE_PROVIDER`                                                       | `local` ou `shopify`                                              | catalogue du dépôt                                                    |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_API_VERSION` | Storefront API                                                    | —                                                                     |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`                              | Stripe Checkout et webhook signé                                  | mode démonstration                                                    |
| `RESEND_API_KEY`, `MAIL_FROM`                                             | envoi des courriels                                               | fichiers dans `MAIL_OUTBOX_DIR` (`.outbox/`)                          |

## Shopify

1. Créer une application personnalisée avec accès **Storefront API** (lecture des produits, collections, métadonnées) et reporter le domaine `*.myshopify.com` et le jeton.
2. Produits : le handle est le slug du site ; une option `Métal` dont les valeurs correspondent aux métaux du catalogue (`Or jaune`, `Platine`, …).
3. Métadonnées sous l'espace `aurele` — produits : `reference`, `collection`, `category`, `summary`, `stones` (JSON), `metal_weight_g`, `certificate`, `lead_time` (JSON), `provenance_code`, `visual_form`, `featured`, `size_kind` ; collections : `order`, `tagline`, `stones_line`, `inspiration`, `signature_metal`. La conversion est décrite et testée dans `lib/commerce/shopify/mapper.ts`.
4. Limites actuelles : les slugs reconnus par le proxy (404 avant rendu) et le parcours de provenance détaillé viennent encore des données locales (`lib/commerce/known-slugs.ts`, `data/provenance.ts`) ; à générer au build depuis Shopify.

## Commerce

- **Panier et Écrin** : conservés dans le navigateur (`localStorage`, clé `aurele-boutique`), sans compte. Les prix n'y sont jamais stockés : le serveur les relit dans le catalogue au moment du paiement.
- **Paiement** : `POST /api/checkout`. Avec `STRIPE_SECRET_KEY` (clé de test), redirection vers Stripe Checkout en dollars canadiens ; sans clé, mode démonstration (page de remerciement directe). Les pièces de 15 000 $ et plus sont réservées par un acompte de 30 % (`lib/shop/order.ts`).
- **Webhook** : `POST /api/stripe/webhook` vérifie la signature et envoie la confirmation de commande. En local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`, puis reporter le secret affiché dans `STRIPE_WEBHOOK_SECRET`.
- **Taxes** : non calculées dans cette version (à activer avec Stripe Tax avant la mise en production).
- **Devises** : CAD facturé ; USD et EUR indicatifs, à taux fixes datés dans `lib/currency.ts` (à mettre à jour à la main).

## Rendez-vous et courriels

- `POST /api/rendez-vous` valide la demande (même schéma Zod que le formulaire), vérifie le créneau, puis envoie deux courriels : la confirmation au visiteur et un avis au salon.
- Les créneaux sont calculés (`lib/appointment/slots.ts`) : du mardi au samedi, sur trois semaines. À remplacer par un agenda réel (Calendly, Google Agenda) avant la mise en production.
- Sans `RESEND_API_KEY`, les courriels sont écrits dans `.outbox/` (un `.html` à ouvrir dans un navigateur, un `.json` avec destinataire et version texte). L'écriture de fichiers n'est pas possible sur un hébergement sans disque (Vercel) : y configurer Resend.

## Contenus éditoriaux

- **Textes longs** (Journal, pages légales, La Maison, étapes du savoir-faire) : dans `data/journal.ts`, `data/legal.ts` et `data/house.ts`, en français et en anglais. Ils ne sont lus que côté serveur. Les libellés d'interface restent dans `messages/`.
- **Provenance** : `data/provenance.ts` (parcours par nature de pierre, artisans, date de sertissage et lot de métal par code). Le code imprimé en QR sur l'écrin ouvre `/{langue}/provenance/{CODE}` ; un code inconnu répond 404, un code en minuscules est redirigé. Avec Shopify, la fiche se lit dans la métadonnée `aurele.provenance_code`, mais le parcours détaillé reste à brancher.
- **Guide des tailles** : calibrage par carte bancaire (format ID-1), mémorisé dans le navigateur (`aurele-calibrage`). Précision annoncée d'une demi-taille.
- **Pages légales** : raison sociale, NEQ, RCS et hébergeur sont des **valeurs de démonstration** (Maison Aurèle est une marque fictive). À remplacer et à faire relire par un juriste avant toute mise en ligne.

## Performance, accessibilité, référencement

- **JavaScript** : environ 172 Ko compressés chargés par page, dont ~150 Ko pour React et le routeur de Next.js (incompressibles) ; le code du site pèse ~20 Ko. Three.js (~265 Ko) et GSAP ne sont chargés qu'à la demande : la 3D après le premier affichage et au repos, GSAP sur la page Savoir-faire et sur grand écran seulement.
- **Messages** : chaque page ne transmet au navigateur que les traductions de ses composants interactifs (`components/i18n/ClientMessages.tsx`) : −25 Ko de HTML par page, et les gabarits de courriel ne quittent plus le serveur.
- **Images** : rendus fixes en AVIF/WebP par `next/image`, image principale prioritaire (LCP).
- **Polices** : auto-hébergées et préchargées, réduites aux graisses utilisées et aux caractères du site (`scripts/fonts.sh`) : 64 Ko au lieu de 102. Un caractère hors de ce jeu (lettre polonaise ou tchèque dans un nom saisi, par exemple) s'affiche dans la police de repli.
- **3D** : jamais lancée d'office sur un appareil sans carte graphique (WebGL émulé par le processeur) : elle y bloquait le fil principal plusieurs secondes. L'image fixe reste ; la « Vue 3D » demandée sur une fiche s'affiche en rendu léger.
- **Styles** : aucun sélecteur `:has()` sur la racine (l'ambiance de collection est posée sur `<html>` d'après l'adresse) : le navigateur recalculait les styles de tout le document à chaque modification du DOM, soit environ deux fois moins de travail de style au chargement.
- **Accessibilité** : audit axe (WCAG 2.0 à 2.2, niveaux A et AA) de chaque page en ambiance jour et nuit, menu, panier et formulaire ouverts (`tests/e2e/accessibilite.spec.ts`). Couvert aussi par les tests : lien d'évitement, menu et panneau Collections au clavier (focus piégé, Échap, retour du focus), focus déplacé sur l'étape suivante du formulaire de rendez-vous et du guide des tailles, focus rendu au champ fautif de la recherche de provenance, cibles d'au moins 24 px (règle WCAG 2.2 d'axe ; 44 px pour les commandes principales). Toutes les animations respectent `prefers-reduced-motion`.
- **Référencement** : `sitemap.xml` (98 adresses, hreflang), `robots.txt`, canoniques et hreflang par page, JSON-LD (Organization et boutiques, Product avec images, BreadcrumbList, Article), images de partage 1200 × 630 générées au build (`/og/{langue}/{type}/{id}`, polices OFL de `assets/fonts`).

### Rapport Lighthouse

Lighthouse 12, Chromium sans carte graphique, serveur de production local, le 20 octobre 2026 (`scripts/lighthouse.sh`). Profil mobile : Moto G4 simulé, 4G lente, processeur ralenti ×4.

| Page                           | Profil  | Perf. | Access. | Bonnes pratiques | SEO |   LCP |    TBT | CLS |
| ------------------------------ | ------- | ----: | ------: | ---------------: | --: | ----: | -----: | --: |
| /en                            | desktop |   100 |     100 |              100 | 100 | 0.7 s |  10 ms |   0 |
| /en                            | mobile  |    98 |     100 |              100 | 100 | 2.3 s |  80 ms |   0 |
| /en/pieces/aube-premiere       | desktop |   100 |     100 |              100 | 100 | 0.6 s |   0 ms |   0 |
| /en/pieces/aube-premiere       | mobile  |    96 |     100 |              100 | 100 | 2.6 s | 110 ms |   0 |
| /fr                            | desktop |   100 |     100 |              100 | 100 | 0.7 s |  10 ms |   0 |
| /fr                            | mobile  |    93 |     100 |              100 | 100 | 3.0 s | 160 ms |   0 |
| /fr/atelier                    | desktop |   100 |     100 |              100 | 100 | 0.7 s |   0 ms |   0 |
| /fr/atelier                    | mobile  |    96 |     100 |              100 | 100 | 2.3 s | 170 ms |   0 |
| /fr/collections/maree          | desktop |   100 |     100 |              100 | 100 | 0.4 s |   0 ms |   0 |
| /fr/collections/maree          | mobile  |    98 |     100 |              100 | 100 | 2.3 s |  90 ms |   0 |
| /fr/confidentialite            | desktop |   100 |     100 |              100 | 100 | 0.6 s |  10 ms |   0 |
| /fr/confidentialite            | mobile  |    97 |     100 |              100 | 100 | 2.2 s | 150 ms |   0 |
| /fr/creations/maree-haute      | desktop |   100 |     100 |              100 | 100 | 0.7 s |   0 ms |   0 |
| /fr/creations/maree-haute      | mobile  |    98 |     100 |              100 | 100 | 2.4 s |  60 ms |   0 |
| /fr/guide-des-tailles          | desktop |   100 |     100 |              100 | 100 | 0.7 s |  10 ms |   0 |
| /fr/guide-des-tailles          | mobile  |    97 |     100 |              100 | 100 | 2.3 s | 110 ms |   0 |
| /fr/journal                    | desktop |   100 |     100 |              100 | 100 | 0.6 s |  10 ms |   0 |
| /fr/journal                    | mobile  |    98 |     100 |              100 | 100 | 2.4 s |  60 ms |   0 |
| /fr/journal/choisir-un-diamant | desktop |   100 |     100 |              100 | 100 | 0.7 s |  10 ms |   0 |
| /fr/journal/choisir-un-diamant | mobile  |    98 |     100 |              100 | 100 | 2.3 s |  60 ms |   0 |
| /fr/la-maison                  | desktop |   100 |     100 |              100 | 100 | 0.6 s |   0 ms |   0 |
| /fr/la-maison                  | mobile  |    99 |     100 |              100 | 100 | 1.7 s | 130 ms |   0 |
| /fr/provenance/MA201-0302      | desktop |   100 |     100 |              100 | 100 | 0.6 s |   0 ms |   0 |
| /fr/provenance/MA201-0302      | mobile  |    95 |     100 |              100 | 100 | 2.8 s |  70 ms |   0 |
| /fr/rendez-vous                | desktop |   100 |     100 |              100 | 100 | 0.7 s |   0 ms |   0 |
| /fr/rendez-vous                | mobile  |    95 |     100 |              100 | 100 | 2.6 s | 140 ms |   0 |
| /fr/savoir-faire               | desktop |   100 |     100 |              100 | 100 | 0.6 s |   0 ms |   0 |
| /fr/savoir-faire               | mobile  |    97 |     100 |              100 | 100 | 2.3 s | 130 ms |   0 |

**Lecture critique.** Accessibilité, bonnes pratiques et SEO : 100 partout ; performance bureau : 100 partout. En **mobile**, 13 pages sur 14 atteignent l'objectif de 95 (médiane 97). L'accueil français, à 93 dans ce passage, donne 96, 97 et 98 sur trois mesures supplémentaires : la simulation varie de ±3 points d'un passage à l'autre. Ce qui coûte encore :

1. **LCP de 1,7 à 3,0 s** en 4G lente simulée : l'image ou le texte principal attend le HTML, la feuille de style et les polices préchargées (64 Ko depuis leur réduction, contre 102 : la médiane mobile est passée de 95 à 97).
2. **TBT de 60 à 170 ms** : hydratation de React et du routeur (~150 Ko compressés, socle du cadre).

Avant la phase 7 : accueil mobile à 59 (3D en rendu logiciel : 145 s de blocage), contraste insuffisant des étapes inactives du Savoir-faire, `dl` invalide sur les fiches, favicon absent, aucune image de partage, ni sitemap, ni robots.txt.

## Mise en production

1. Définir `NEXT_PUBLIC_SITE_URL` **avant** le build (canoniques, sitemap, images de partage).
2. Remplacer les coordonnées de démonstration (`data/maison.ts`, `data/legal.ts`) et faire relire les pages légales.
3. Brancher Stripe (clés de production, webhook, Stripe Tax), Resend (domaine vérifié) et un agenda réel pour les rendez-vous.
4. Remplacer les visuels provisoires (rendus, illustrations) par les photographies.
