import { expect, test } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;

test.describe("fondations", () => {
  test("la racine redirige vers une langue", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(fr|en)$/);
  });

  for (const locale of ["fr", "en"] as const) {
    test(`accueil ${locale} : titre, hreflang, capture`, async ({ page }, info) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      // Nom accessible : lu une seule fois malgré la découpe en lettres.
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: locale === "fr" ? "La lumière, captive." : "Light, held captive.",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      await page.waitForTimeout(2600); // fin des animations d'entrée
      await page.screenshot({ path: capture(`accueil-${locale}`, info.project.name) });
      // Page entière : on force l'apparition des blocs révélés au scroll.
      await page.evaluate(() =>
        document
          .querySelectorAll("[data-reveal]")
          .forEach((el) => el.setAttribute("data-visible", "")),
      );
      await page.waitForTimeout(1400);
      await page.screenshot({
        path: capture(`accueil-${locale}-complet`, info.project.name),
        fullPage: true,
      });
    });
  }

  test("le lien d'évitement mène au contenu", async ({ page }) => {
    await page.goto("/fr");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Aller au contenu" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("#contenu")).toBeFocused();
  });

  test("bascule de langue en conservant la page", async ({ page }, info) => {
    test.skip(
      info.project.name === "mobile-375" || info.project.name === "tablette-768",
      "dans le menu",
    );
    await page.goto("/fr");
    await page.getByRole("banner").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("menu mobile : ouverture, focus piégé, fermeture par Échap", async ({ page }, info) => {
    test.skip(!["mobile-375", "tablette-768"].includes(info.project.name), "grand écran");
    await page.goto("/fr");
    await page.getByRole("button", { name: "Menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation" });
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(700);
    await page.screenshot({ path: capture("menu", info.project.name) });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("panneau Collections au clavier", async ({ page }, info) => {
    test.skip(["mobile-375", "tablette-768"].includes(info.project.name), "menu mobile");
    await page.goto("/fr");
    const button = page.getByRole("button", { name: "Collections" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.waitForTimeout(700);
    await page.screenshot({ path: capture("collections", info.project.name) });
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("salon de nuit", async ({ page }, info) => {
    await page.goto("/fr");
    await page.getByRole("button", { name: "Salon de nuit" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "nuit");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "nuit");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2600);
    await page.screenshot({ path: capture("accueil-nuit", info.project.name) });
  });

  test("page introuvable localisée", async ({ page }, info) => {
    const response = await page.goto("/fr/nulle-part");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Cette page s’est dérobée à la lumière.",
    );
    await page.screenshot({ path: capture("404", info.project.name) });
  });
});
