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
