import { expect, test, type Page } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;
const isDesktop = (project: string) => ["bureau-1280", "large-1920"].includes(project);

async function revealAll(page: Page) {
  await page.evaluate(() =>
    document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-visible", "")),
  );
  await page.waitForTimeout(1400);
}

test.describe("catalogue", () => {
  for (const slug of ["aube", "maree", "obsidienne"]) {
    test(`collection ${slug} : 5 pièces, ambiance, fil d'Ariane`, async ({ page }, info) => {
      await page.goto(`/fr/collections/${slug}`);
      await expect(page.locator(`[data-ambiance="${slug}"]`)).toHaveCount(1);
      await expect(page.getByRole("region", { name: "Les pièces" }).getByRole("link")).toHaveCount(
        5,
      );
      const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(JSON.parse(ld ?? "{}")["@type"]).toBe("BreadcrumbList");
      await page.waitForTimeout(800);
      await page.screenshot({ path: capture(`collection-${slug}`, info.project.name) });
      await revealAll(page);
      await page.screenshot({
        path: capture(`collection-${slug}-complet`, info.project.name),
        fullPage: true,
      });
    });
  }

  test("fiche produit : prix selon le métal, taille, données structurées", async ({
    page,
  }, info) => {
    await page.goto("/fr/creations/aube-premiere");
    await expect(
      page.getByRole("heading", { level: 1, name: "Bague Aube Première" }),
    ).toBeVisible();
    const price = page.locator("[aria-live=polite]");
    await expect(price).toHaveText(/14\s800\s\$/);
    await page.getByText("Platine", { exact: true }).click();
    await expect(price).toHaveText(/15\s700\s\$/);
    await page.getByLabel("Taille (CA/US)").selectOption("7");
    await expect(page.getByLabel("Taille (CA/US)")).toHaveValue("7");

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const productLd = blocks.map((b) => JSON.parse(b)).find((d) => d["@type"] === "Product");
    expect(productLd.offers.price).toBe(14800);
    expect(productLd.offers.priceCurrency).toBe("CAD");

    await page.waitForTimeout(600);
    await page.screenshot({ path: capture("produit-aube-premiere", info.project.name) });
    await revealAll(page);
    await page.screenshot({
      path: capture("produit-aube-premiere-complet", info.project.name),
      fullPage: true,
    });
  });

  test("loupe de joaillier : survol et clavier", async ({ page }, info) => {
    await page.goto("/fr/creations/maree-haute");
    const stage = page.getByRole("group", { name: "Loupe de joaillier" });
    if (isDesktop(info.project.name)) {
      const box = (await stage.boundingBox())!;
      // Réessaie le survol tant que la page n'est pas hydratée.
      await expect(async () => {
        await page.mouse.move(
          box.x + box.width * 0.5,
          box.y + box.height * 0.33 + Math.random() * 4,
        );
        await expect(page.locator(".loupe-lentille")).toBeVisible({ timeout: 500 });
      }).toPass();
      await page.screenshot({ path: capture("loupe", info.project.name) });
      await page.mouse.move(0, 0);
      await expect(page.locator(".loupe-lentille")).toHaveCount(0);
    }
    await stage.focus();
    await page.keyboard.press("ArrowUp");
    await expect(page.locator(".loupe-lentille")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".loupe-lentille")).toHaveCount(0);
  });

  test("URL anglaise et bascule de langue sur une fiche", async ({ page }, info) => {
    test.skip(!isDesktop(info.project.name), "bascule dans le menu sur mobile");
    await page.goto("/fr/creations/obsidienne-eclipse");
    await page.getByRole("banner").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/pieces\/obsidienne-eclipse$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Obsidienne Éclipse Ring" }),
    ).toBeVisible();
  });

  test("slugs inconnus : vrai 404 dès la première visite", async ({ request }) => {
    for (const url of ["/fr/creations/nexiste-pas", "/en/pieces/nope", "/fr/collections/rien"]) {
      const response = await request.get(`${url}-${Date.now()}`);
      expect(response.status(), url).toBe(404);
    }
  });

  test("accueil : chapitres et pièce d'exception", async ({ page }, info) => {
    await page.goto("/fr");
    await expect(page.getByRole("heading", { level: 3, name: "Marée" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Bague Obsidienne Absolue" })).toBeAttached();
    await revealAll(page);
    await page.screenshot({
      path: capture("accueil-fr-complet-p2", info.project.name),
      fullPage: true,
    });
  });
});
