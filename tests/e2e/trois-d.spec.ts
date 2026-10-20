import { expect, test } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;

test.describe("3D", () => {
  test("rendu logiciel (sans carte graphique) : l'accueil garde l'image fixe", async ({ page }) => {
    // Le navigateur de test émule WebGL par le processeur (SwiftShader).
    await page.goto("/fr");
    const hero = page.locator("[data-3d]").first();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    await expect(hero).toHaveAttribute("data-3d", "image");
    await expect(hero.locator("canvas")).toHaveCount(0);
  });

  test("accueil : image fixe d'abord, puis la bague 3D en fondu", async ({ page }, info) => {
    await page.addInitScript(() => localStorage.setItem("aurele-3d", "force"));
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/fr");
    const hero = page.locator("[data-3d]").first();
    // L'image fixe est là immédiatement (LCP), avec un texte alternatif descriptif.
    await expect(hero.getByRole("img", { name: /Bague Aube Première en or blanc/ })).toBeVisible();
    await expect(hero).toHaveAttribute("data-3d", "pret", { timeout: 60_000 });
    await expect(hero.locator("canvas")).toBeVisible();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: capture("accueil-3d", info.project.name) });
    expect(errors).toEqual([]);
  });

  test("fiche : visionneuse 3D à la demande", async ({ page }, info) => {
    await page.goto("/fr/creations/maree-haute");
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("button", { name: "Vue 3D" }).click();
    const viewer = page.getByRole("region", { name: "Images de la pièce" }).locator("[data-3d]");
    await expect(viewer).toHaveAttribute("data-3d", "pret", { timeout: 60_000 });
    await page.waitForTimeout(1200);
    await viewer.screenshot({ path: capture("visionneuse-3d", info.project.name) });
  });

  test("le rendu suit le métal choisi", async ({ page }) => {
    await page.goto("/fr/creations/maree-haute");
    const main = page.getByRole("region", { name: "Images de la pièce" }).getByRole("img").first();
    await expect(main).toHaveAttribute("src", /maree-haute--or-jaune/);
    await page.getByText("Or rose", { exact: true }).click();
    await expect(main).toHaveAttribute("src", /maree-haute--or-rose/);
  });
});
