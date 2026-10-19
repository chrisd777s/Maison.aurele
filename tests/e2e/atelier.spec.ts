import { expect, test, type Page } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;
const isDesktop = (project: string) => ["bureau-1280", "large-1920"].includes(project);

/** Attend que la version lue dans l'URL ait remplacé le premier affichage statique. */
async function open(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator("form")).toHaveCount(1);
}

test.describe("L'Atelier", () => {
  test("composer au clavier : prix, URL, restauration au rechargement", async ({ page }, info) => {
    await open(page, "/fr/atelier");
    const price = page.getByTestId("prix-atelier");
    await expect(price).toHaveText(/9\s800\s\$/);

    await page.getByRole("radio", { name: "Ovale", exact: true }).check({ force: true });
    const slider = page.getByRole("slider", { name: "Poids de la pierre centrale" });
    await slider.focus();
    for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuetext", "1,5 ct");
    await page.getByRole("radio", { name: "Platine", exact: true }).check({ force: true });
    await page.getByRole("radio", { name: /Halo/ }).check({ force: true });
    await page.getByLabel("Votre gravure").fill("À toi, toujours <3");

    await expect(page).toHaveURL(/forme=ovale/);
    await expect(page).toHaveURL(/carats=1\.50/);
    await expect(page).toHaveURL(/metal=platine/);
    await expect(page).toHaveURL(/monture=halo/);
    await expect(page.getByLabel("Votre gravure")).toHaveValue("À toi, toujours 3");
    const total = await price.textContent();
    expect(total).not.toMatch(/9\s800/);

    await page.reload();
    await expect(page.locator("form")).toHaveCount(1);
    await expect(page.getByRole("radio", { name: "Ovale", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Platine", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: /Halo/ })).toBeChecked();
    await expect(page.getByTestId("prix-atelier")).toHaveText(total!);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: capture("atelier", info.project.name) });
    await page.screenshot({ path: capture("atelier-complet", info.project.name), fullPage: true });
  });

  test("lien partagé : la bague s'ouvre telle quelle", async ({ page }) => {
    await open(
      page,
      "/fr/atelier?v=1&forme=poire&carats=2.00&metal=or-rose&monture=trilogie&gravure=Toujours",
    );
    await expect(page.getByRole("radio", { name: "Poire", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Or rose", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: /Trilogie/ })).toBeChecked();
    await expect(page.getByLabel("Votre gravure")).toHaveValue("Toujours");
    await expect(page.getByRole("link", { name: "Réaliser avec l’atelier" })).toHaveAttribute(
      "href",
      /\/fr\/rendez-vous\?creation=/,
    );
  });

  test("copier le lien", async ({ page, context }, info) => {
    test.skip(!isDesktop(info.project.name), "partage natif sur mobile");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await open(page, "/fr/atelier?forme=coussin&carats=1.20");
    await page.getByRole("button", { name: "Copier le lien" }).click();
    await expect(page.getByTestId("copie-statut")).toHaveText(/Lien copié/);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("forme=coussin");
  });

  test("aperçu 3D vivant", async ({ page }, info) => {
    await open(page, "/fr/atelier");
    const viewer = page.locator("figure[data-3d]");
    await expect(viewer).toHaveAttribute("data-3d", "pret", { timeout: 60_000 });
    await page.getByRole("radio", { name: "Émeraude", exact: true }).check({ force: true });
    await page.waitForTimeout(1200);
    await viewer.screenshot({ path: capture("atelier-3d-emeraude", info.project.name) });
  });

  test("version anglaise", async ({ page }) => {
    await open(page, "/en/atelier");
    await expect(page.getByRole("heading", { level: 1, name: "Compose your ring." })).toBeVisible();
    await expect(page.getByTestId("prix-atelier")).toHaveText("$9,800");
  });
});
