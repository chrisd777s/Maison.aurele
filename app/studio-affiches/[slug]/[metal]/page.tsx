import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { localizeProduct } from "@/lib/commerce/local/provider";
import { PosterStage } from "./PosterStage";

export function generateStaticParams() {
  return products.flatMap((p) => p.metals.map((m) => ({ slug: p.slug, metal: m.id })));
}

/**
 * Rendu d'une pièce dans un métal, pour `scripts/render-posters.mjs`.
 * N'existe que si POSTER_STUDIO=1 au build : jamais en production.
 */
export default async function PosterPage({ params }: PageProps<"/studio-affiches/[slug]/[metal]">) {
  if (process.env.POSTER_STUDIO !== "1") notFound();
  const { slug, metal } = await params;
  const record = products.find((p) => p.slug === slug);
  const option = record?.metals.find((m) => m.id === metal);
  if (!record || !option) notFound();
  return <PosterStage product={localizeProduct(record, "fr")} metal={option.id} />;
}
