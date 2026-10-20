import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { JournalCover } from "@/components/journal/JournalCover";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { articles } from "@/data/journal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEditorialDate } from "@/lib/editorial/date";
import { readingMinutes } from "@/lib/editorial/types";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  const locale = (await rootLocale()) as Locale;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/journal", locale),
  };
}

export default async function JournalPage() {
  const t = await getTranslations("Journal");
  const locale = (await rootLocale()) as Locale;
  const [lead, ...rest] = articles;

  return (
    <>
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-9">{t("title")}</h1>
        <p className="col-span-12 text-chapeau font-light text-encre-douce sm:col-span-10 lg:col-span-5 lg:col-start-7">
          {t("lede")}
        </p>
      </header>

      <section aria-label={t("listLabel")} className="grille gap-y-16 pt-16 lg:pt-24">
        {lead && (
          <article className="col-span-12 grid grid-cols-subgrid gap-y-8 lg:items-end">
            <Link
              href={{ pathname: "/journal/[slug]", params: { slug: lead.slug } }}
              tabIndex={-1}
              aria-hidden="true"
              className="col-span-12 lg:col-span-7"
              data-reveal
            >
              <JournalCover cover={lead.cover} />
            </Link>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9" data-reveal>
              <ArticleMeta
                rubric={lead.rubric[locale]}
                date={formatEditorialDate(lead.date, locale)}
                minutes={t("minutes", { count: readingMinutes(lead.body[locale]) })}
              />
              <h2 className="mt-5 text-titre-2">
                <Link
                  href={{ pathname: "/journal/[slug]", params: { slug: lead.slug } }}
                  className="hover:text-accent-encre"
                >
                  {lead.title[locale]}
                </Link>
              </h2>
              <p className="mt-6 text-encre-douce">{lead.dek[locale]}</p>
              <p className="mt-6 text-petit">
                {lead.author.name}, {lead.author.role[locale].toLocaleLowerCase(locale)}
              </p>
            </div>
          </article>
        )}
        {rest.map((article, i) => (
          <article
            key={article.slug}
            className={`col-span-12 sm:col-span-6 lg:col-span-5 ${i % 2 ? "lg:col-start-8 lg:mt-24" : "lg:col-start-1"}`}
            data-reveal
          >
            <Link
              href={{ pathname: "/journal/[slug]", params: { slug: article.slug } }}
              tabIndex={-1}
              aria-hidden="true"
            >
              <JournalCover cover={article.cover} />
            </Link>
            <div className="mt-6">
              <ArticleMeta
                rubric={article.rubric[locale]}
                date={formatEditorialDate(article.date, locale)}
                minutes={t("minutes", { count: readingMinutes(article.body[locale]) })}
              />
              <h2 className="mt-4 text-titre-3">
                <Link
                  href={{ pathname: "/journal/[slug]", params: { slug: article.slug } }}
                  className="hover:text-accent-encre"
                >
                  {article.title[locale]}
                </Link>
              </h2>
              <p className="mt-4 text-encre-douce">{article.dek[locale]}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function ArticleMeta({ rubric, date, minutes }: { rubric: string; date: string; minutes: string }) {
  return (
    <p className="surtitre flex flex-wrap gap-x-3 text-encre-douce">
      <span className="text-accent-encre">{rubric}</span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
      <span aria-hidden="true">·</span>
      <span>{minutes}</span>
    </p>
  );
}
