import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("Header");
  return (
    <a
      href="#contenu"
      className="surtitre fixed top-3 left-3 z-[60] -translate-y-24 bg-encre px-5 py-3 text-fond transition-transform duration-[var(--duree-courte)] ease-maison focus-visible:translate-y-0"
    >
      {t("skipToContent")}
    </a>
  );
}
