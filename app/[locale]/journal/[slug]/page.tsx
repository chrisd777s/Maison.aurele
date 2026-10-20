import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Prose } from "@/components/editorial/Prose";
import { JournalCover } from "@/components/journal/JournalCover";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { articles, getArticle } from "@/data/journal";
import { siteUrl } from "@/data/maison";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { formatEditorialDate } from "@/lib/editorial/date";
import { readingMinutes } from "@/lib/editorial/types";
import { shareImage } from "@/lib/og/share";
import { breadcrumbJsonLd, organizationRef } from "@/lib/seo/jsonld";
import { alternatesFor, openGraphBase } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = PageProps<"/[locale]/journal/[slug]">;

async function load(props: Props) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();
  const locale = (await rootLocale()) as Locale;
  return { article, locale };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { article, locale } = await load(props);
  return {
    title: article.title[locale],
    description: article.dek[locale],
    alternates: alternatesFor(
      { pathname: "/journal/[slug]", params: { slug: article.slug } },
      locale,
    ),
    openGraph: {
      ...openGraphBase(locale),
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
      images: [await shareImage(locale, "journal", article.slug)],
    },
  };
}

export default async function ArticlePage(props: Props) {
  const { article, locale } = await load(props);
  const t = await getTranslations("Journal");
  const p = await getTranslations("Product");
  const href = { pathname: "/journal/[slug]", params: { slug: article.slug } } as const;
  const related = (await getProducts(locale)).filter((product) =>
    article.related.includes(product.slug),
  );
  const others = articles.filter((a) => a.slug !== article.slug);
  const blocks = article.body[locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title[locale],
          description: article.dek[locale],
          datePublished: article.date,
          image: `${siteUrl}/og/${locale}/journal/${article.slug}`,
          inLanguage: locale,
          author: { "@type": "Person", name: article.author.name },
          publisher: organizationRef,
          mainEntityOfPage: `${siteUrl}${getPathname({ href, locale })}`,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: p("home"), href: "/" },
            { name: t("eyebrow"), href: "/journal" },
            { name: article.title[locale], href },
          ],
          locale,
        )}
      />

      <article>
        <header className="grille gap-y-8 pt-12 lg:pt-20">
          <nav aria-label={p("breadcrumb")} className="col-span-12">
            <Link href="/journal" className="surtitre lien-fin text-encre-douce">
              ← {t("eyebrow")}
            </Link>
          </nav>
          <div className="col-span-12 lg:col-span-9 lg:col-start-3">
            <p className="surtitre flex flex-wrap gap-x-3 text-encre-douce">
              <span className="text-accent-encre">{article.rubric[locale]}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.date}>{formatEditorialDate(article.date, locale)}</time>
              <span aria-hidden="true">·</span>
              <span>{t("minutes", { count: readingMinutes(blocks) })}</span>
            </p>
            <h1 className="mt-6 text-titre-1">{article.title[locale]}</h1>
            <p className="mt-8 max-w-[44ch] font-display text-chapeau text-encre-douce italic">
              {article.dek[locale]}
            </p>
            <p className="mt-8 text-petit">
              {t("by", { name: article.author.name })}
              <span className="text-encre-douce">
                {" "}
                · {article.author.role[locale].toLocaleLowerCase(locale)}
              </span>
            </p>
          </div>
          <div className="col-span-12 mt-4 lg:col-span-10 lg:col-start-2">
            <JournalCover cover={article.cover} />
          </div>
        </header>

        <div className="grille pt-16 lg:pt-24">
          <Prose blocks={blocks} className="col-span-12 lg:col-span-7 lg:col-start-4" />
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="pieces-citees" className="grille gap-y-10 pt-section">
          <Eyebrow className="col-span-12">{t("relatedEyebrow")}</Eyebrow>
          <h2 id="pieces-citees" className="col-span-12 text-titre-2">
            {t("relatedTitle")}
          </h2>
          {related.map((product) => (
            <div key={product.slug} className="col-span-12 sm:col-span-4" data-reveal>
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      )}

      <section aria-labelledby="a-lire" className="grille gap-y-8 pt-section">
        <h2 id="a-lire" className="surtitre col-span-12 font-sans text-encre-douce">
          {t("moreTitle")}
        </h2>
        {others.map((a) => (
          <div
            key={a.slug}
            className="col-span-12 border-t border-filet pt-6 sm:col-span-6"
            data-reveal
          >
            <p className="surtitre text-accent-encre">{a.rubric[locale]}</p>
            <h3 className="mt-3 text-titre-3">
              <Link
                href={{ pathname: "/journal/[slug]", params: { slug: a.slug } }}
                className="hover:text-accent-encre"
              >
                {a.title[locale]}
              </Link>
            </h3>
            <p className="mt-3 text-encre-douce">{a.dek[locale]}</p>
          </div>
        ))}
      </section>
    </>
  );
}
