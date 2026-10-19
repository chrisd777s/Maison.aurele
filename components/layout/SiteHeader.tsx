import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeaderShopLinks } from "@/components/shop/HeaderShopLinks";
import { CollectionsMenu } from "./CollectionsMenu";
import { LocaleSwitch } from "./LocaleSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { Wordmark } from "./Wordmark";
import { collectionItems, primaryItems, secondaryItems } from "./nav-items";

export async function SiteHeader() {
  const t = await getTranslations("Header");
  const nav = await getTranslations("Nav");
  const taglines = await getTranslations("Collections");

  return (
    <header className="entete sticky top-0 z-50 h-entete bg-voile backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[120rem] items-center justify-between px-marge">
        {/* Gauche : menu (mobile) ou navigation principale (grand écran) */}
        <div className="flex flex-1 items-center">
          <div className="xl:hidden">
            <MobileMenu openLabel={t("menu")} closeLabel={t("closeMenu")} title={t("menuTitle")}>
              <nav aria-label={t("mainNav")}>
                <p className="surtitre mb-4 text-encre-douce">{nav("collections")}</p>
                <ul className="mb-10 space-y-1">
                  {collectionItems.map((item) => (
                    <li key={item.key}>
                      <NavLink
                        href={item.href}
                        className="font-display text-titre-2 leading-tight font-light"
                      >
                        {nav(item.key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3 border-t border-filet pt-8">
                  {[...primaryItems.slice(1), ...secondaryItems].map((item) => (
                    <li key={item.key}>
                      <NavLink href={item.href} className="font-display text-titre-3 font-light">
                        {nav(item.key)}
                      </NavLink>
                    </li>
                  ))}
                  <li className="pt-4">
                    <NavLink href="/rendez-vous" className="surtitre lien-fin text-accent-encre">
                      {nav("rendezVous")}
                    </NavLink>
                  </li>
                </ul>
                <LocaleSwitch className="mt-10 -ml-2" />
              </nav>
            </MobileMenu>
          </div>

          <nav aria-label={t("mainNav")} className="hidden xl:block">
            <ul className="flex items-center gap-8 whitespace-nowrap">
              <li>
                <CollectionsMenu label={nav("collections")}>
                  <ul className="grille gap-y-8 py-12">
                    {collectionItems.map((item, i) => (
                      <li key={item.key} className="col-span-4">
                        <NavLink href={item.href} className="group block">
                          <span className="surtitre text-encre-douce">0{i + 1}</span>
                          <span className="mt-3 block font-display text-titre-3 font-light">
                            {nav(item.key)}
                          </span>
                          <span className="mt-1 block font-display text-chapeau text-encre-douce italic">
                            {taglines(item.key as "aube" | "maree" | "obsidienne")}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </CollectionsMenu>
              </li>
              {primaryItems.slice(1).map((item) => (
                <li key={item.key}>
                  <NavLink href={item.href} className="surtitre lien-fin">
                    {nav(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Centre : logotype */}
        <Link href="/" aria-label={t("home")} className="inline-flex min-h-11 items-center px-2">
          <Wordmark />
        </Link>

        {/* Droite : accès rapides */}
        <nav aria-label={t("secondaryNav")} className="flex flex-1 items-center justify-end">
          <ul className="flex items-center gap-4 whitespace-nowrap sm:gap-7">
            <li className="hidden xl:block">
              <NavLink href="/la-maison" className="surtitre lien-fin">
                {nav("maison")}
              </NavLink>
            </li>
            <li className="hidden md:block">
              <NavLink href="/rendez-vous" className="surtitre lien-fin">
                {nav("rendezVousCourt")}
              </NavLink>
            </li>
            <li className="hidden xl:block">
              <LocaleSwitch />
            </li>
            <HeaderShopLinks />
          </ul>
        </nav>
      </div>
    </header>
  );
}
