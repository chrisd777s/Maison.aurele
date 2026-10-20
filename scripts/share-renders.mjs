/**
 * Versions JPEG des rendus pour les images de partage : `next/og` ne dessine pas
 * le WebP. Appelé par render-posters.mjs ; peut aussi tourner seul :
 *   node scripts/share-renders.mjs
 * Sortie : public/renders/partage/<slug>--<métal>.jpg (504 × 630, fond ivoire).
 */
import { mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";

export async function shareRender(name) {
  await mkdir("public/renders/partage", { recursive: true });
  await sharp(`public/renders/${name}.webp`)
    .resize(504, 630, { fit: "cover" })
    .flatten({ background: "#f6f1ea" }) // --ivoire
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/renders/partage/${name}.jpg`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const names = (await readdir("public/renders"))
    .filter((f) => f.endsWith(".webp"))
    .map((f) => f.replace(/\.webp$/, ""));
  for (const name of names) await shareRender(name);
  console.log(`✓ ${names.length} images de partage`);
}
