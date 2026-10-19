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

## Variables d'environnement

Voir `.env.example`. Le site fonctionne sans aucun compte externe.
