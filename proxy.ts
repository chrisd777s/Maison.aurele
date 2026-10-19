import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirige `/` et les chemins sans langue vers `/fr` ou `/en` (Accept-Language, cookie).
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
