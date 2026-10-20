import { readdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;

/** La page ne défile pas horizontalement (un débordement fait dézoomer les mobiles). */
async function expectNoHorizontalScroll(page: Page) {
  const [scroll, viewport] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(scroll).toBeLessThanOrEqual(viewport);
}

/** Fiche produit chargée et hydratée (le bouton d'ajout répond). */
async function openProduct(page: Page, slug: string) {
  await page.goto(`/fr/creations/${slug}`);
  await expect(page.getByRole("button", { name: "Ajouter au panier" })).toBeEnabled();
  await page.waitForLoadState("networkidle");
}

test.describe("Panier et paiement", () => {
  test("ajout, attentions, quantité, paiement de démonstration, panier vidé", async ({
    page,
  }, info) => {
    await openProduct(page, "maree-goutte");
    await page.getByRole("radio", { name: /Or rose/ }).check({ force: true });
    await page.getByRole("button", { name: "Ajouter au panier" }).click();

    const drawer = page.getByRole("dialog", { name: /Votre panier/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByTestId("ligne-panier")).toHaveCount(1);
    await expect(drawer.getByText(/^Or rose ·/)).toBeVisible();
    await expect(page.getByTestId("ouvrir-panier")).toHaveAccessibleName(/1 pièce/);

    await drawer.getByRole("button", { name: "Ajouter un exemplaire" }).click();
    await expect(page.getByTestId("ouvrir-panier")).toHaveAccessibleName(/2 pièces/);
    await drawer.getByLabel("Carte manuscrite").fill("Pour nos dix ans.");
    await drawer.getByRole("radio", { name: /Retrait au salon privé, Paris/ }).check();
    await expectNoHorizontalScroll(page);
    await page.waitForTimeout(800);
    await page.screenshot({ path: capture("panier", info.project.name) });

    // L'état survit au rechargement (stockage local).
    await page.reload();
    await page.getByTestId("ouvrir-panier").click();
    await expect(drawer.getByLabel("Carte manuscrite")).toHaveValue("Pour nos dix ans.");
    await expect(
      drawer.getByRole("radio", { name: /Retrait au salon privé, Paris/ }),
    ).toBeChecked();

    await drawer.getByTestId("payer").click();
    await expect(page).toHaveURL(/\/fr\/commande\/merci\?ref=MA-[A-Z0-9]+&demo=1/);
    await expect(page.getByTestId("commande-confirmee")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Merci." })).toBeVisible();
    await expect(page.getByTestId("ouvrir-panier")).toHaveAccessibleName("Ouvrir le panier");
  });

  test("pièce d'exception : acompte de 30 % et solde", async ({ page }) => {
    await openProduct(page, "obsidienne-absolue");
    await expect(page.getByText(/acompte de 30 %/).first()).toBeVisible();
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    const drawer = page.getByRole("dialog", { name: /Votre panier/ });
    await expect(drawer.getByText("À régler aujourd’hui")).toBeVisible();
    await expect(drawer.getByTestId("total-panier")).toHaveText(/14\s400\s\$/);
    await expect(drawer.getByText("Solde à la livraison")).toBeVisible();
    // Échap ferme le tiroir et rend le focus à la page.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("devise d'affichage : USD indicatif, mémorisé", async ({ page }) => {
    await openProduct(page, "aube-premiere");
    await page.locator("footer").getByText("USD", { exact: true }).click();
    const price = page
      .locator("main")
      .getByText(/10\s660\s\$\sUS/)
      .first();
    await expect(price).toBeVisible();
    await page.reload();
    await expect(
      page
        .locator("main")
        .getByText(/10\s660\s\$\sUS/)
        .first(),
    ).toBeVisible();
    await page.locator("footer").getByText("CAD", { exact: true }).click();
    await expect(
      page
        .locator("main")
        .getByText(/14\s800\s\$/)
        .first(),
    ).toBeVisible();
  });
});

test.describe("L'Écrin", () => {
  test("mettre de côté, partager sans les prix, recevoir", async ({ page }, info) => {
    for (const slug of ["aube-premiere", "maree-ecume", "obsidienne-silence"]) {
      await openProduct(page, slug);
      await page.getByRole("button", { name: "Garder dans mon Écrin" }).click();
      await expect(page.getByRole("button", { name: "Dans votre Écrin" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    await expect(page.getByRole("link", { name: /L’Écrin \(3 pièces\)/ })).toBeVisible();

    await page.goto("/fr/ecrin");
    await expect(page.getByTestId("piece-ecrin")).toHaveCount(3);
    await page.getByRole("button", { name: "Retirer Collier Marée Écume de l’Écrin" }).click();
    await expect(page.getByTestId("piece-ecrin")).toHaveCount(2);
    await expectNoHorizontalScroll(page);
    await page.waitForTimeout(600);
    await page.screenshot({ path: capture("ecrin", info.project.name), fullPage: true });

    await page.getByLabel(/Masquer les prix/).check();
    const preview = page.getByTestId("apercu-partage");
    const href = await preview.getAttribute("href");
    expect(href).toMatch(/^\/fr\/ecrin\/partage\/[A-Za-z0-9_-]+$/);
    expect(href).not.toContain("aube");

    // Le destinataire n'a rien dans son propre Écrin : nouvelle page, même navigateur vidé.
    await page.evaluate(() => localStorage.clear());
    await page.goto(href!);
    await expect(page.getByTestId("piece-partagee")).toHaveCount(2);
    await expect(page.locator("[data-prix=masques]")).toHaveCount(1);
    await expect(page.locator("main").getByText(/\d\s\d{3}\s\$/)).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.waitForTimeout(600);
    await page.screenshot({ path: capture("ecrin-partage", info.project.name) });

    await page.getByRole("button", { name: "Garder dans mon Écrin" }).click();
    await expect(page.getByRole("button", { name: "Dans votre Écrin" })).toBeDisabled();
    await expect(page.getByRole("link", { name: /L’Écrin \(2 pièces\)/ })).toBeVisible();
  });

  test("lien de partage invalide : vraie 404", async ({ request }) => {
    const response = await request.get("/fr/ecrin/partage/bm9uLXZhbGlkZQ");
    expect(response.status()).toBe(404);
  });
});

test.describe("Rendez-vous privé", () => {
  test("trois étapes depuis L'Atelier, erreurs, confirmation et courriels", async ({
    page,
  }, info) => {
    // Parcours long qui passe par L'Atelier (3D en rendu logiciel) : budget de temps triplé.
    test.slow();
    const before = readdirSync(".outbox", { withFileTypes: true }).length;
    await page.goto("/fr/atelier?v=1&forme=coussin&carats=1.20&metal=or-rose&monture=halo");
    await expect(page.locator("form")).toHaveCount(1);
    await page.getByRole("link", { name: "Réaliser avec l’atelier" }).click();
    await expect(page).toHaveURL(/\/fr\/rendez-vous\?creation=/);
    await page.waitForLoadState("networkidle");

    // Étape 1 : continuer sans choix → erreur.
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page.getByText("Ce choix est nécessaire.")).toBeVisible();
    await page.getByRole("radio", { name: /Paris/ }).check({ force: true });
    await page.getByRole("button", { name: "Continuer" }).click();

    // Étape 2 : le titre d'étape reçoit le focus.
    await expect(page.getByRole("heading", { name: /Le moment/ })).toBeFocused();
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page.getByText("Choisissez un jour puis un créneau.")).toBeVisible();
    await page.locator('input[name="date"]').first().check({ force: true });
    await page.locator('input[name="time"]:not([disabled])').first().check({ force: true });
    await expect(page.getByText("Choisissez un jour puis un créneau.")).toBeHidden();
    await expectNoHorizontalScroll(page);
    await page.screenshot({
      path: capture("rendez-vous-moment", info.project.name),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Continuer" }).click();

    // Étape 3 : intention, coordonnées, accord.
    await expect(
      page.getByRole("form").getByText("Coussin de 1,2 ct, halo, or rose 18 carats"),
    ).toBeVisible();
    await page.getByRole("radio", { name: "Des fiançailles" }).check({ force: true });
    await page.getByLabel("Prénom").fill("Camille");
    await page.getByLabel("Nom", { exact: true }).fill("Roy");
    await page.getByLabel("Courriel").fill("pas-un-courriel");
    await page.getByRole("button", { name: "Confirmer le rendez-vous" }).click();
    await expect(page.getByText("Indiquez une adresse courriel valide.")).toBeVisible();
    await expect(
      page.getByText("Votre accord est nécessaire pour organiser le rendez-vous."),
    ).toBeVisible();
    await page.getByLabel("Courriel").fill("camille@example.com");
    await page.getByRole("checkbox", { name: /J’accepte/ }).check();
    await page.screenshot({
      path: capture("rendez-vous-intention", info.project.name),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Confirmer le rendez-vous" }).click();

    const done = page.getByTestId("rendez-vous-confirme");
    await expect(done).toBeVisible();
    await expect(done.getByText(/^RV-[A-Z0-9]+$/)).toBeVisible();
    await expect(done.getByText(/camille@example\.com/)).toBeVisible();
    await page.screenshot({ path: capture("rendez-vous-confirme", info.project.name) });

    const download = page.waitForEvent("download");
    await done.getByRole("button", { name: "Ajouter à mon agenda" }).click();
    expect((await download).suggestedFilename()).toMatch(/^RV-[A-Z0-9]+\.ics$/);

    // Confirmation au visiteur et avis au salon : 2 messages × (HTML + JSON).
    expect(readdirSync(".outbox").length).toBeGreaterThanOrEqual(before + 4);
  });

  test("depuis une fiche : la pièce est reprise", async ({ page }) => {
    await page.goto("/en/private-appointment?piece=obsidienne-eclipse");
    await page.waitForLoadState("networkidle");
    await page.getByRole("radio", { name: /Video call/ }).check({ force: true });
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator('input[name="date"]').first().check({ force: true });
    await page.locator('input[name="time"]:not([disabled])').first().check({ force: true });
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("form").getByText("Obsidienne Éclipse Ring")).toBeVisible();
  });
});
