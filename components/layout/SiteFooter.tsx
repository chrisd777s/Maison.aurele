import { getTranslations } from "next-intl/server";
import { maison } from "@/data/maison";
import { Link } from "@/i18n/navigation";
import type { Href } from "./nav-items";
import { CurrencySwitch } from "@/components/shop/CurrencySwitch";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

type FooterLink = { href: Href; label: string };

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="surtitre mb-5 font-sans text-encre-douce">{title}</h2>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="lien-fin text-petit">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const theme = await getTranslations("Theme");
  const locale = await getTranslations("Locale");

  return (
    <footer className="mt-section border-t border-filet bg-surface">
      <div className="grille gap-y-14 pt-20 pb-10 lg:pt-28">
        <div className="col-span-12 lg:col-span-5">
          <Wordmark />
          <p className="mt-8 font-display text-titre-2 font-light italic">{t("signature")}</p>
          <p className="mt-6 max-w-[34ch] text-petit text-encre-douce">{t("intro")}</p>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-x-gouttiere gap-y-12 sm:grid-cols-3 lg:col-span-7 xl:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 xl:col-span-2">
            <h2 className="surtitre mb-5 font-sans text-encre-douce">{t("placesTitle")}</h2>
            <address className="space-y-6 text-petit not-italic">
              <p>
                <span className="block text-encre-douce">{t("montrealLabel")}</span>
                {maison.places.montreal.street}, {maison.places.montreal.district}
                <span className="block text-encre-douce">{t("montrealHours")}</span>
              </p>
              <p>
                <span className="block text-encre-douce">{t("parisLabel")}</span>
                {maison.places.paris.street}, {maison.places.paris.city}
                <span className="block text-encre-douce">{t("parisHours")}</span>
              </p>
              <p>
                <a href={`mailto:${maison.email}`} className="lien-fin">
                  {t("writeUs")}
                </a>
              </p>
            </address>
          </div>
          <LinkColumn
            title={t("houseTitle")}
            links={[
              { href: "/la-maison", label: nav("maison") },
              { href: "/savoir-faire", label: nav("savoirFaire") },
              { href: "/provenance", label: nav("provenance") },
              { href: "/journal", label: nav("journal") },
            ]}
          />
          <LinkColumn
            title={t("serviceTitle")}
            links={[
              { href: "/rendez-vous", label: nav("rendezVous") },
              { href: "/guide-des-tailles", label: nav("guide") },
              { href: "/garantie", label: t("warranty") },
              { href: "/retours", label: t("returns") },
            ]}
          />
          <div className="col-span-2 sm:col-span-1">
            <h2 className="surtitre mb-3 font-sans text-encre-douce">{t("preferences")}</h2>
            <p className="sr-only">{locale("label")}</p>
            <LocaleSwitch className="-ml-2" />
            <p className="sr-only">{theme("label")}</p>
            <ThemeToggle />
            <CurrencySwitch className="-ml-1" />
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-5 border-t border-filet pt-8 text-petit text-encre-douce lg:flex-row lg:items-center lg:justify-between">
          <p>{t("copyright")}</p>
          <p>{t("commitments")}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className="lien-fin">
                {t("legalNotice")}
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="lien-fin">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/conditions-de-vente" className="lien-fin">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
