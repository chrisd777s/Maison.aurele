"use client";

import { useSearchParams } from "next/navigation";
import { decodeConfig } from "@/lib/atelier/config";
import { AtelierConfigurator } from "./AtelierConfigurator";

/**
 * Lit la bague partagée dans l'URL. Rendu côté client uniquement : la page
 * reste statique, la version par défaut sert de premier affichage.
 */
export function AtelierFromUrl() {
  const params = useSearchParams();
  // Seule la configuration d'arrivée compte : ensuite, le configurateur pilote
  // son propre état et réécrit l'URL.
  return <AtelierConfigurator initial={decodeConfig(params)} />;
}
