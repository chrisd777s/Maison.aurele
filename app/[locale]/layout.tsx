import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { ClientMessages } from "@/components/i18n/ClientMessages";
import { AmbianceSync } from "@/components/layout/AmbianceSync";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ShopProvider } from "@/components/shop/ShopProvider";
import { siteUrl } from "@/data/maison";
import { routing, type Locale } from "@/i18n/routing";
import { shareImage } from "@/lib/og/share";
import { openGraphBase } from "@/lib/seo/metadata";
import { ambianceFor } from "@/lib/ambiance";
import { getProducts } from "@/lib/commerce";
import { toCatalogueEntry } from "@/lib/shop/catalogue";
import { cormorant, jost } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const locale = (await rootLocale()) as Locale;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("titleDefault"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: "Maison Aurèle",
    formatDetection: { telephone: false },
    openGraph: { ...openGraphBase(locale), images: [await shareImage(locale, "maison")] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0c" },
  ],
  colorScheme: "light dark",
};

// Avant la première peinture : signal « JS disponible », thème mémorisé et
// ambiance de collection d'après l'adresse (voir lib/ambiance.ts).
const bootScript = (pieces: Record<string, string>) =>
  `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('aurele-theme');if(t==='jour'||t==='nuit')d.dataset.theme=t}catch(e){}var a=(${ambianceFor.toString()})(location.pathname,${JSON.stringify(pieces)});if(a)d.dataset.ambiance=a})()`;

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const catalogue = (await getProducts(locale)).map(toCatalogueEntry);
  const pieces = Object.fromEntries(catalogue.map((p) => [p.slug, p.collection]));

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript(pieces) }} />
      </head>
      <body>
        <ClientMessages>
          <ShopProvider catalogue={catalogue}>
            <SkipLink />
            <SiteHeader />
            <main id="contenu" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
            <RevealObserver />
            <AmbianceSync pieces={pieces} />
          </ShopProvider>
        </ClientMessages>
      </body>
    </html>
  );
}
