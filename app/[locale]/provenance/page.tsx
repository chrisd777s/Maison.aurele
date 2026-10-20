import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { ClientMessages } from "@/components/i18n/ClientMessages";
import { ProvenanceLookup } from "@/components/provenance/ProvenanceLookup";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Provenance");
  const locale = (await rootLocale()) as Locale;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/provenance", locale),
  };
}

export default async function ProvenancePage() {
  const t = await getTranslations("Provenance");
  const m = await getTranslations("Materials");
  const locale = (await rootLocale()) as Locale;
  const products = (await getProducts(locale)).filter((p) => p.provenanceCode);
  const stages = ["origin", "cutting", "atelier"] as const;

  return (
    <ClientMessages namespaces={["Provenance"]}>
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-9">{t("title")}</h1>
        <p className="col-span-12 text-chapeau font-light text-encre-douce sm:col-span-10 lg:col-span-5 lg:col-start-7">
          {t("lede")}
        </p>
      </header>

      <div className="grille pt-16">
        <div className="col-span-12 border-y border-filet py-10 lg:col-span-8 lg:col-start-5">
          <ProvenanceLookup codes={products.map((p) => p.provenanceCode)} />
        </div>
      </div>

      <section aria-labelledby="engagement" className="grille gap-y-10 pt-section">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("commitmentEyebrow")}</Eyebrow>
        <h2 id="engagement" className="col-span-12 text-titre-2 lg:col-span-8">
          {t("commitmentTitle")}
        </h2>
        <ol className="col-span-12 grid gap-x-gouttiere gap-y-12 sm:grid-cols-3 lg:col-span-9 lg:col-start-4">
          {stages.map((stage, i) => (
            <li key={stage} data-reveal className="border-t border-filet pt-6">
              <span className="chiffres text-titre-3 text-accent-encre">0{i + 1}</span>
              <h3 className="mt-3 text-titre-3">{t(`stages.${stage}.title`)}</h3>
              <p className="mt-4 text-encre-douce">{t(`stages.${stage}.text`)}</p>
            </li>
          ))}
        </ol>
        <p
          data-reveal
          className="col-span-12 max-w-[60ch] text-encre-douce lg:col-span-6 lg:col-start-4"
        >
          {t("gold")}
        </p>
      </section>

      <section aria-labelledby="registre" className="grille gap-y-10 pt-section">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("registerEyebrow")}</Eyebrow>
        <div className="col-span-12 lg:col-span-9">
          <h2 id="registre" className="text-titre-2">
            {t("registerTitle")}
          </h2>
          <p className="mt-6 max-w-[56ch] text-encre-douce">{t("registerText")}</p>
          <ul className="mt-12 border-b border-filet">
            {products.map((p) => {
              const stone = p.stones.find((s) => s.role === "centrale") ?? p.stones[0]!;
              return (
                <li key={p.slug} className="border-t border-filet">
                  <Link
                    href={{ pathname: "/provenance/[code]", params: { code: p.provenanceCode } }}
                    className="group grid gap-x-gouttiere gap-y-1 py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-baseline"
                  >
                    <span className="font-display text-chapeau group-hover:text-accent-encre">
                      {p.name}
                    </span>
                    <span className="text-petit text-encre-douce">
                      {m(`kinds.${stone.kind}`)} · {stone.origin}
                    </span>
                    <span className="surtitre text-encre-douce">{p.provenanceCode}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </ClientMessages>
  );
}
