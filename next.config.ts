import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Le studio d'affiches se construit à part (voir scripts/render-posters.mjs).
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  typescript: {
    tsconfigPath: process.env.NEXT_DIST_DIR ? "tsconfig.affiches.json" : "tsconfig.json",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 85 pour les rendus de bijoux (facettes fines), 75 ailleurs.
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
