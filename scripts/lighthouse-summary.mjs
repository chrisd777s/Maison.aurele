/** Tableau Markdown des scores Lighthouse d'un dossier de rapports JSON. */
import { readdirSync, readFileSync } from "node:fs";

const dir = process.argv[2] ?? "lighthouse";
const score = (r, c) => Math.round((r.categories[c]?.score ?? 0) * 100);
const rows = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const r = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
    const [page, preset] = f.replace(/\.json$/, "").split(".");
    const a = (id) => r.audits[id]?.displayValue ?? "—";
    return `| /${page.replaceAll("_", "/")} | ${preset} | ${score(r, "performance")} | ${score(r, "accessibility")} | ${score(r, "best-practices")} | ${score(r, "seo")} | ${a("largest-contentful-paint")} | ${a("total-blocking-time")} | ${a("cumulative-layout-shift")} |`;
  });
console.log("| Page | Profil | Perf. | Access. | Bonnes pratiques | SEO | LCP | TBT | CLS |");
console.log("| --- | --- | --: | --: | --: | --: | --: | --: | --: |");
console.log(rows.join("\n"));
