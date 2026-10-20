# Maison Aurèle

Site de haute joaillerie — « La lumière, captive. »

> Projet en cours de construction par phases. Ce README sera complété à la phase 7
> (variables d'environnement, Shopify, Stripe, remplacement des visuels, rapport Lighthouse).

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
npm run test:e2e   # parcours + captures 375 / 768 / 1280 / 1920 px
```

## Visuels des pièces

Les images des pièces sont rendues depuis la scène 3D procédurale (aucun fichier 3D externe) :

```bash
npm run renders                 # toutes les pièces, tous les métaux
npm run renders -- aube-premiere  # une seule pièce
```

Pour les remplacer par des photographies, déposer `public/renders/<slug>--<métal>.webp`
(1600 × 2000, fond transparent ou uni) avec les mêmes noms.

## Variables d'environnement

Voir `.env.example`. Le site fonctionne sans aucun compte externe.

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
