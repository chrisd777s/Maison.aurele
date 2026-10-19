import type { Product, ProductStone } from "@/lib/commerce/types";
import type { AtelierConfig } from "./config";
import { priceConfig, TRILOGY_SIDE_RATIO } from "./pricing";

const NWT = "Territoires du Nord-Ouest, Canada";

/**
 * Pièce « virtuelle » décrivant la bague composée : la 3D et les illustrations
 * savent déjà dessiner une pièce du catalogue, elles dessinent donc celle-ci.
 */
export function configuredProduct(config: AtelierConfig, name: string): Product {
  const main: ProductStone = {
    kind: "diamant",
    shape: config.shape,
    count: 1,
    carats: config.carats,
    color: "F",
    clarity: "VS1",
    cut: "Excellente",
    origin: NWT,
    role: "centrale",
  };
  const accents: ProductStone[] =
    config.setting === "halo"
      ? [
          {
            kind: "diamant",
            shape: "rond",
            count: 22,
            carats: 0.003 * 22 * Math.max(1, config.carats * 1.6),
            origin: NWT,
            role: "accent",
          },
        ]
      : config.setting === "trilogie"
        ? [
            {
              kind: "diamant",
              shape: "poire",
              count: 2,
              carats: 2 * config.carats * TRILOGY_SIDE_RATIO,
              origin: NWT,
              role: "accent",
            },
          ]
        : [];
  return {
    slug: "atelier",
    reference: "AUR-AT-000",
    collection: "aube",
    category: "bague",
    name,
    summary: "",
    description: "",
    priceCad: priceConfig(config).total,
    metals: [{ id: config.metal, priceDelta: 0 }],
    stones: [main, ...accents],
    metalWeightG: 3.5,
    leadTime: { inStock: false, weeksMin: 5, weeksMax: 7 },
    provenanceCode: "",
    visual: { form: config.setting },
  };
}
