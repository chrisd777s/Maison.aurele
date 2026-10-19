import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ShopProvider } from "@/components/shop/ShopProvider";
import { siteUrl } from "@/data/maison";
import { routing } from "@/i18n/routing";
import { getProducts } from "@/lib/commerce";
import { toCatalogueEntry } from "@/lib/shop/catalogue";
import { cormorant, jost } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("titleDefault"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: "Maison Aurèle",
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0c" },
  ],
  colorScheme: "light dark",
};

// Avant la première peinture : ambiance mémorisée + signal « JS disponible ».
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('aurele-theme');if(t==='jour'||t==='nuit')d.dataset.theme=t}catch(e){}})()`;

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const catalogue = (await getProducts(locale)).map(toCatalogueEntry);

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <ShopProvider catalogue={catalogue}>
            <SkipLink />
            <SiteHeader />
            <main id="contenu" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
            <RevealObserver />
          </ShopProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
