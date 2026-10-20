import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Audit WCAG 2.2 AA automatisé (axe-core) de chaque page, en ambiance jour et
 * en salon de nuit, puis des états ouverts (menu, panier, rendez-vous).
 * axe ne voit pas tout (ordre de lecture, pertinence des alternatives) : la
 * relecture manuelle reste documentée dans le README.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const PAGES = [
  "/fr",
  "/en",
  "/fr/collections/obsidienne",
  "/fr/creations/maree-haute",
  "/en/pieces/aube-premiere",
  "/fr/atelier",
  "/fr/rendez-vous",
  "/fr/ecrin",
  "/fr/la-maison",
  "/fr/savoir-faire",
  "/fr/provenance",
  "/fr/provenance/MA201-0302",
  "/fr/guide-des-tailles",
  "/fr/journal",
  "/en/journal/histoire-de-la-perle",
  "/fr/confidentialite",
  "/fr/nulle-part",
];

/**
 * États finaux seulement : mouvement réduit émulé (animations quasi instantanées)
 * et blocs révélés au défilement forcés visibles, sinon axe mesure des textes en
 * plein fondu.
 */
async function settle(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() =>
    document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-visible", "")),
  );
  await page.waitForTimeout(600);
}

async function audit(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(TAGS);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const summary = violations.map(
    (v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
  expect(summary, summary.join("\n")).toEqual([]);
}

// Deux largeurs suffisent : la mise en page change, pas les couleurs ni la structure.
test.beforeEach(({}, info) => {
  test.skip(!["mobile-375", "bureau-1280"].includes(info.project.name), "375 et 1280 seulement");
});

for (const theme of ["jour", "nuit"] as const) {
  test.describe(`axe, ambiance ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("aurele-theme", t), theme);
    });
    for (const url of PAGES) {
      test(url, async ({ page }) => {
        await page.goto(url);
        await settle(page);
        await audit(page);
      });
    }
  });
}

test.describe("axe, états ouverts", () => {
  test("menu mobile et panneau Collections", async ({ page }, info) => {
    await page.goto("/fr");
    await settle(page);
    if (info.project.name === "mobile-375") {
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
    } else {
      await page.getByRole("button", { name: "Collections" }).click();
      await expect(page.getByRole("button", { name: "Collections" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    }
    await page.waitForTimeout(800);
    await audit(page);
  });

  test("panier ouvert", async ({ page }) => {
    await page.goto("/fr/creations/maree-goutte");
    await settle(page);
    const add = page.getByRole("button", { name: "Ajouter au panier" });
    await expect(add).toBeEnabled();
    await page.waitForLoadState("networkidle");
    await add.click();
    await expect(page.getByRole("dialog", { name: /Votre panier/ })).toBeVisible();
    await page.waitForTimeout(800);
    await audit(page, "dialog[open]");
  });

  test("rendez-vous : erreurs de validation", async ({ page }) => {
    await page.goto("/fr/rendez-vous");
    await page.waitForLoadState("networkidle");
    await page
      .getByRole("button", { name: /Continuer|Suivant/ })
      .first()
      .click();
    await page.waitForTimeout(400);
    await audit(page, "main");
  });
});
