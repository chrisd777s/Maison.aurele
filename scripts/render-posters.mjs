/**
 * Génère les images fixes des pièces à partir de la vraie scène 3D.
 * Elles servent d'image principale (LCP), de vignette et de remplacement
 * lorsque la 3D est désactivée.
 *
 *   POSTER_STUDIO=1 npx next dev -p 3300      (dans un autre terminal)
 *   node scripts/render-posters.mjs [slug…]   (toutes les pièces, tous les métaux par défaut)
 *
 * Sortie : public/renders/<slug>--<métal>.webp (1600 × 2000, fond transparent),
 * et sa version JPEG pour les images de partage (public/renders/partage/).
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { shareRender } from "./share-renders.mjs";

const BASE = process.env.POSTER_BASE_URL ?? "http://127.0.0.1:3300";
const only = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  // WebGL logiciel si aucun GPU n'est disponible (intégration continue, conteneur).
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

// Liste des affiches (pièce × métal) publiée par le studio lui-même.
const index = await browser.newPage();
await index.goto(`${BASE}/studio-affiches`, { waitUntil: "load" });
const jobs = (
  await index
    .locator("[data-affiche]")
    .evaluateAll((links) =>
      links.map((a) => ({ name: a.dataset.affiche, href: a.getAttribute("href") })),
    )
).filter((job) => only.length === 0 || only.some((o) => job.name.startsWith(o)));
await index.close();

for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: 800, height: 1000 },
    deviceScaleFactor: 2,
  });
  page.on("pageerror", (e) => console.error(`  ${job.name} : ${e.message}`));
  await page.goto(`${BASE}${job.href}`, { waitUntil: "load", timeout: 180_000 });
  await page.waitForFunction(() => window.__posterReady === true, null, { timeout: 180_000 });
  const png = await page.locator("#affiche canvas").screenshot({ omitBackground: true });
  await sharp(png)
    .resize(1600, 2000, { fit: "cover" })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(`public/renders/${job.name}.webp`);
  await shareRender(job.name);
  console.log(`✓ ${job.name}`);
  await page.close();
}

await browser.close();
