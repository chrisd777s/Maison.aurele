import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { JourneyMap } from "@/components/provenance/JourneyMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { products as productRecords } from "@/data/products";
import { artisan, provenanceRecord } from "@/data/provenance";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { formatNumber } from "@/lib/format";
import { formatCoordinates, journeysFor } from "@/lib/provenance/journey";
import { RENDER_HEIGHT, RENDER_WIDTH, renderSrc } from "@/lib/renders";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { alternatesFor } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return productRecords.map((p) => ({ code: p.provenanceCode }));
}

type Props = PageProps<"/[locale]/provenance/[code]">;

async function load(props: Props) {
  const { code } = await props.params;
  const locale = (await rootLocale()) as Locale;
  const product = (await getProducts(locale)).find((p) => p.provenanceCode === code);
  if (!product) notFound();
  return { product, record: provenanceRecord(code), locale };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { product, locale } = await load(props);
  const t = await getTranslations("Provenance");
  return {
    title: t("pieceMetaTitle", { name: product.name, code: product.provenanceCode }),
    description: t("pieceMetaDescription", { name: product.name }),
    alternates: alternatesFor(
      { pathname: "/provenance/[code]", params: { code: product.provenanceCode } },
      locale,
    ),
  };
}

export default async function ProvenancePiecePage(props: Props) {
  const { product, record, locale } = await load(props);
  const t = await getTranslations("Provenance");
  const m = await getTranslations("Materials");
  const p = await getTranslations("Product");
  const journeys = journeysFor(product.stones);
  const central = journeys.find((j) => j.central) ?? journeys[0]!;
  const others = journeys.filter((j) => j !== central);
  const mainStone = product.stones.find((s) => s.role === "centrale") ?? product.stones[0]!;
  const metal = product.metals[0]!.id;
  const dateFormat = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  const setter = record ? artisan(record.setter) : null;
  const polisher = record ? artisan(record.polisher) : null;
  const pieceHref = { pathname: "/creations/[slug]", params: { slug: product.slug } } as const;
  const selfHref = {
    pathname: "/provenance/[code]",
    params: { code: product.provenanceCode },
  } as const;

  const stoneLine = (kind: (typeof product.stones)[number]["kind"]) =>
    product.stones
      .filter((s) => s.kind === kind)
      .map((s) => {
        const weight =
          s.carats !== undefined
            ? p("carats", { value: formatNumber(s.carats, locale) })
            : s.sizeMm !== undefined
              ? p("millimetres", { value: formatNumber(s.sizeMm, locale) })
              : null;
        return [s.count > 1 ? `${s.count} ×` : null, m(`kinds.${s.kind}`), weight]
          .filter(Boolean)
          .join(" ");
      })
      .join(", ");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: p("home"), href: "/" },
            { name: t("eyebrow"), href: "/provenance" },
            { name: product.provenanceCode, href: selfHref },
          ],
          locale,
        )}
      />
      <nav aria-label={p("breadcrumb")} className="grille pt-8 lg:pt-10">
        <ol className="surtitre col-span-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-encre-douce">
          <li>
            <Link href="/provenance" className="lien-fin">
              {t("eyebrow")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-encre">
            {product.provenanceCode}
          </li>
        </ol>
      </nav>

      <header className="grille items-end gap-y-8 pt-10 lg:pt-14">
        <div className="col-span-12 lg:col-span-8">
          <Eyebrow>{t("pieceEyebrow", { code: product.provenanceCode })}</Eyebrow>
          <h1 className="mt-6 text-titre-1">{product.name}</h1>
          <p className="mt-4 font-display text-chapeau text-encre-douce italic">
            {product.summary}
          </p>
        </div>
        <div className="col-span-6 col-start-4 sm:col-span-4 sm:col-start-9 lg:col-span-3 lg:col-start-10">
          <Image
            src={renderSrc(product.slug, metal)}
            alt={p("renderAlt", {
              name: product.name,
              metal: m(`metals.${metal}`).toLocaleLowerCase(locale),
              summary: product.summary,
            })}
            width={RENDER_WIDTH}
            height={RENDER_HEIGHT}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
            className="block aspect-[4/5] w-full object-contain"
          />
        </div>
      </header>

      <section aria-labelledby="parcours" className="grille gap-y-10 pt-16 lg:pt-20">
        <h2 id="parcours" className="surtitre col-span-12 font-sans text-encre-douce">
          {t("journeyTitle", { stone: m(`kinds.${central.kind}`) })}
        </h2>
        <div className="col-span-12">
          <JourneyMap
            journeys={journeys}
            label={t("mapLabel", {
              stops: central.stops.map((s) => s.place.name[locale]).join(" → "),
            })}
          />
        </div>
        <ol className="col-span-12 grid gap-x-gouttiere gap-y-10 sm:grid-cols-3">
          {central.stops.map((stop, i) => (
            <li key={stop.stage} data-reveal className="border-t border-filet pt-6">
              <span className="surtitre flex items-center gap-3 text-encre-douce">
                <span className="chiffres text-chapeau text-accent-encre normal-case">
                  0{i + 1}
                </span>
                {t(`stops.${stop.stage}.${central.kind === "perle-akoya" ? "pearl" : "stone"}`)}
              </span>
              <p className="mt-3 font-display text-titre-3">{stop.place.name[locale]}</p>
              <p className="chiffres mt-2 text-petit text-encre-douce">
                {formatCoordinates(stop.place, locale)}
              </p>
              {stop.stage === "atelier" && record && setter && (
                <p className="mt-4 text-petit">
                  {t("setOn", {
                    date: dateFormat.format(new Date(record.setAt)),
                    name: setter.name,
                  })}
                </p>
              )}
            </li>
          ))}
        </ol>
        {others.length > 0 && (
          <div className="col-span-12 lg:col-span-8">
            <h3 className="surtitre font-sans text-encre-douce">{t("accentsTitle")}</h3>
            <ul className="mt-4 space-y-2">
              {others.map((j) => (
                <li key={j.kind} className="text-petit">
                  <span className="text-encre">{stoneLine(j.kind)}</span>
                  <span className="text-encre-douce">
                    {" "}
                    · {j.stops.map((s) => s.place.name[locale]).join(" → ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="fiche" className="grille gap-y-10 pt-section">
        <h2 id="fiche" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("recordTitle")}
        </h2>
        <dl className="col-span-12 border-b border-filet lg:col-span-7">
          {[
            [t("recordCode"), product.provenanceCode],
            [t("recordStone"), stoneLine(mainStone.kind)],
            [p("certificate"), product.certificate ?? null],
            [t("recordSetAt"), record ? dateFormat.format(new Date(record.setAt)) : null],
            [
              t("recordSetter"),
              setter ? `${setter.name}, ${setter.role[locale].toLocaleLowerCase(locale)}` : null,
            ],
            [
              t("recordPolisher"),
              polisher
                ? `${polisher.name}, ${polisher.role[locale].toLocaleLowerCase(locale)}`
                : null,
            ],
            [t("recordMetal"), record ? t("metalLot", { lot: record.metalLot }) : null],
          ]
            .filter((row): row is [string, string] => row[1] !== null)
            .map(([term, value]) => (
              <div
                key={term}
                className="grid grid-cols-[minmax(8rem,40%)_1fr] gap-4 border-t border-filet py-3"
              >
                <dt className="text-petit text-encre-douce">{term}</dt>
                <dd className="text-petit">{value}</dd>
              </div>
            ))}
        </dl>
        <div className="col-span-12 lg:col-span-7 lg:col-start-4">
          <p className="max-w-[56ch] text-petit text-encre-douce">{t("recordNote")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={pieceHref}>{t("seePiece")}</ButtonLink>
            <ButtonLink
              href={{ pathname: "/rendez-vous", query: { piece: product.slug } }}
              variant="trait"
            >
              {t("seeInSalon")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
