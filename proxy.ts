import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import {
  knownArticles,
  knownCollections,
  knownProducts,
  knownProvenanceCodes,
} from "./lib/commerce/known-slugs";
import { decodeEcrin } from "./lib/ecrin/token";
import { normalizeCode } from "./lib/provenance/code";
import { routing } from "./i18n/routing";

// Redirige `/` et les chemins sans langue vers `/fr` ou `/en` (Accept-Language, cookie).
const intl = createMiddleware(routing);

// Pages de catalogue (FR et EN) dont le slug doit exister.
const CATALOGUE = /^\/(fr|en)\/(collections|creations|pieces)\/([^/]+)\/?$/;
// Articles du Journal.
const ARTICLE = /^\/(fr|en)\/journal\/([^/]+)\/?$/;
// Code de provenance (imprimé en QR sur l'écrin) : la casse saisie importe peu.
const PROVENANCE = /^\/(fr|en)\/provenance\/([^/]+)\/?$/;
// Lien de partage de l'Écrin : jeton illisible ou pièce inconnue → 404.
const SHARED_ECRIN = /^\/(fr|en)\/ecrin\/(?:partage|shared)\/([^/]+)\/?$/;

function notFound(request: NextRequest, locale: string) {
  // Rendu de la 404 localisée (route attrape-tout), statut 404 garanti.
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/introuvable`;
  return NextResponse.rewrite(url, { status: 404 });
}

export default function proxy(request: NextRequest) {
  const match = CATALOGUE.exec(request.nextUrl.pathname);
  if (match) {
    const [, locale, kind, slug] = match;
    const known = kind === "collections" ? knownCollections : knownProducts;
    if (!known.has(decodeURIComponent(slug!))) return notFound(request, locale!);
  }
  const article = ARTICLE.exec(request.nextUrl.pathname);
  if (article && !knownArticles.has(decodeURIComponent(article[2]!))) {
    return notFound(request, article[1]!);
  }
  const provenance = PROVENANCE.exec(request.nextUrl.pathname);
  if (provenance) {
    const [, locale, raw] = provenance;
    const code = normalizeCode(decodeURIComponent(raw!));
    if (!knownProvenanceCodes.has(code)) return notFound(request, locale!);
    if (code !== raw) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/provenance/${code}`;
      return NextResponse.redirect(url, 308);
    }
  }
  const shared = SHARED_ECRIN.exec(request.nextUrl.pathname);
  if (shared && !decodeEcrin(shared[2]!, knownProducts)) return notFound(request, shared[1]!);
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|og/|apple-icon|_next|_vercel|studio-affiches|.*\\..*).*)"],
};
