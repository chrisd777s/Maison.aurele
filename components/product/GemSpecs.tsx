import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Product, ProductStone } from "@/lib/commerce/types";
import { formatNumber } from "@/lib/format";

/** Une paire terme/définition : seul enfant `div` admis dans un `dl`. */
function Row({ term, value }: { term: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[minmax(8rem,40%)_1fr] gap-4 border-t border-filet py-3">
      <dt className="text-petit text-encre-douce">{term}</dt>
      <dd className="text-petit">{value}</dd>
    </div>
  );
}

/** Caractéristiques gemmologiques : 4C pour les diamants blancs, teinte et traitement sinon. */
export async function GemSpecs({ product }: { product: Product }) {
  const t = await getTranslations("Product");
  const m = await getTranslations("Materials");
  const locale = await getLocale();

  function stoneRows(stone: ProductStone) {
    const weight =
      stone.carats !== undefined
        ? t("carats", { value: formatNumber(stone.carats, locale) })
        : undefined;
    const diameter =
      stone.sizeMm !== undefined
        ? t("millimetres", { value: formatNumber(stone.sizeMm, locale) })
        : undefined;
    return (
      <>
        <Row term={t("stone")} value={m(`kinds.${stone.kind}`)} />
        {stone.count > 1 && <Row term={t("count")} value={String(stone.count)} />}
        {stone.kind !== "perle-akoya" && (
          <Row term={t("shape")} value={m(`shapes.${stone.shape}`)} />
        )}
        <Row term={t("weight")} value={weight} />
        <Row term={t("diameter")} value={diameter} />
        <Row term={t("colour")} value={stone.color ?? stone.hue} />
        <Row term={t("clarity")} value={stone.clarity} />
        <Row term={t("cut")} value={stone.cut ? m(`cuts.${stone.cut}`) : undefined} />
        <Row term={t("treatment")} value={stone.treatment} />
        <Row term={t("origin")} value={stone.origin} />
      </>
    );
  }

  const main = product.stones.filter((s) => s.role === "centrale");
  const accents = product.stones.filter((s) => s.role === "accent");

  return (
    <div className="grid gap-x-gouttiere gap-y-12 md:grid-cols-2">
      <div>
        <h3 className="surtitre mb-4 font-sans text-encre-douce">{t("centralStone")}</h3>
        <dl className="border-b border-filet">
          {main.map((stone, i) => (
            <Fragment key={i}>{stoneRows(stone)}</Fragment>
          ))}
        </dl>
      </div>
      <div className="space-y-12">
        {accents.length > 0 && (
          <div>
            <h3 className="surtitre mb-4 font-sans text-encre-douce">{t("accentStones")}</h3>
            <dl className="border-b border-filet">
              {accents.map((stone, i) => (
                <Fragment key={i}>{stoneRows(stone)}</Fragment>
              ))}
            </dl>
          </div>
        )}
        <div>
          <h3 className="surtitre mb-4 font-sans text-encre-douce">{t("metalTitle")}</h3>
          <dl className="border-b border-filet">
            <Row
              term={t("metal")}
              value={product.metals.map((x) => m(`metals.${x.id}`)).join(" / ")}
            />
            <Row
              term={t("metalWeight")}
              value={t("grams", { value: formatNumber(product.metalWeightG, locale, 1) })}
            />
            <Row
              term={t("certificate")}
              value={
                product.certificate
                  ? t("certificateValue", { number: product.certificate })
                  : undefined
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
}
