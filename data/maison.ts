/**
 * Coordonnées de la Maison. Valeurs de démonstration : à remplacer par celles du client
 * (voir README, « Mise en production »).
 */
export const maison = {
  name: "Maison Aurèle",
  founded: 2011,
  email: "salon@maison-aurele.example",
  places: {
    montreal: {
      street: "Rue Saint-Paul",
      district: "Vieux-Montréal",
      city: "Montréal",
      region: "QC",
      country: "CA",
    },
    paris: {
      street: "Rue de la Paix",
      district: "2ᵉ arrondissement",
      city: "Paris",
      region: "Île-de-France",
      country: "FR",
    },
  },
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
