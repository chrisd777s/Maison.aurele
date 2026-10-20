import { expect, test, type Page } from "@playwright/test";

const capture = (name: string, project: string) => `tests/e2e/captures/${project}/${name}.png`;
const isNarrow = (project: string) => ["mobile-375", "tablette-768"].includes(project);

async function expectNoHorizontalScroll(page: Page) {
  const [scroll, viewport] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(scroll).toBeLessThanOrEqual(viewport);
}

/** Capture pleine page, blocs révélés au scroll forcés à l'état visible. */
async function fullCapture(page: Page, name: string, project: string) {
  await page.evaluate(() =>
    document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-visible", "")),
  );
  await page.waitForTimeout(1400);
  await page.screenshot({ path: capture(name, project), fullPage: true });
}

const PAGES = [
  { url: "/fr/la-maison", h1: "Une lumière née rue Saint-Paul.", name: "la-maison" },
  { url: "/en/the-maison", h1: "A light born on rue Saint-Paul.", name: "the-maison" },
  { url: "/fr/savoir-faire", h1: "Six gestes, une lumière.", name: "savoir-faire" },
  { url: "/fr/provenance", h1: "Chaque pierre a une adresse.", name: "provenance" },
  { url: "/fr/provenance/MA201-0302", h1: "Bague Marée Haute", name: "provenance-piece" },
  { url: "/fr/guide-des-tailles", h1: "Votre taille, en deux minutes.", name: "guide-tailles" },
  { url: "/fr/journal", h1: "Notes d’atelier.", name: "journal" },
  {
    url: "/fr/journal/choisir-un-diamant",
    h1: "Choisir un diamant, au-delà des 4C",
    name: "journal-article",
  },
  { url: "/fr/confidentialite", h1: "Politique de confidentialité", name: "confidentialite" },
  { url: "/en/terms-of-sale", h1: "Terms of sale", name: "terms" },
  { url: "/fr/garantie", h1: "Garantie à vie", name: "garantie" },
];

test.describe("pages éditoriales", () => {
  for (const p of PAGES) {
    test(`${p.url} : titre, hreflang, sans débordement`, async ({ page }, info) => {
      const response = await page.goto(p.url);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: p.h1, exact: true })).toBeVisible();
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      await expectNoHorizontalScroll(page);
      await fullCapture(page, p.name, info.project.name);
    });
  }

  test("codes et articles inconnus : vrai 404", async ({ request }) => {
    for (const url of ["/fr/provenance/ZZ999-0000", "/en/journal/inconnu"]) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(404);
    }
  });
});

test.describe("savoir-faire", () => {
  test("grand écran : la scène suit l'étape au défilement", async ({ page }, info) => {
    test.skip(isNarrow(info.project.name), "séquence épinglée sur grand écran seulement");
    await page.goto("/fr/savoir-faire");
    const sequence = page.locator("#sequence");
    await expect(sequence).toHaveAttribute("data-pilote", "");
    for (const step of ["gouache", "fonte", "polissage"]) {
      await page.locator(`[data-step="${step}"]`).evaluate((el) => {
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120);
      });
      await expect(sequence).toHaveAttribute("data-actif", step);
    }
    await page.waitForTimeout(1200);
    await page.screenshot({ path: capture("savoir-faire-polissage", info.project.name) });
  });

  test("mobile : chaque étape porte son illustration", async ({ page }, info) => {
    test.skip(!isNarrow(info.project.name), "grand écran");
    await page.goto("/fr/savoir-faire");
    await expect(page.locator(".etape-art")).toHaveCount(6);
    for (const art of await page.locator(".etape-art").all()) await expect(art).toBeVisible();
    await expect(page.locator(".sequence-scene")).toBeHidden();
  });
});

test.describe("provenance", () => {
  test("recherche par code (saisie libre) puis fiche du parcours", async ({ page }) => {
    await page.goto("/fr/provenance");
    const field = page.getByRole("textbox", { name: "Code de provenance" });
    await field.fill("zz000");
    await page.getByRole("button", { name: "Retracer" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "ne correspond à aucune pièce" }),
    ).toBeVisible();
    await expect(field).toBeFocused();

    await field.fill("au101 0187");
    await page.getByRole("button", { name: "Retracer" }).click();
    await expect(page).toHaveURL(/\/fr\/provenance\/AU101-0187$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bague Aube Première");
    await expect(page.getByRole("img", { name: /Carte du parcours/ })).toBeVisible();
    await expect(page.getByText("Sertie le 11 février 2026 par Mathieu Lavoie.")).toBeVisible();
    await expect(page.getByText("Anvers, Belgique")).toBeVisible();
  });

  test("code du QR en minuscules : redirection vers la forme canonique", async ({ page }) => {
    await page.goto("/en/provenance/ob305-0451");
    await expect(page).toHaveURL(/\/en\/provenance\/OB305-0451$/);
    await expect(page.getByText("Accent stones")).toBeVisible();
  });

  test("la fiche produit mène à son parcours", async ({ page }) => {
    await page.goto("/fr/creations/maree-haute");
    await page.getByRole("link", { name: /MA201-0302/ }).click();
    await expect(page).toHaveURL(/\/fr\/provenance\/MA201-0302$/);
    await expect(page.getByText("Ratnapura, Sri Lanka").first()).toBeVisible();
  });
});

test.describe("guide des tailles", () => {
  test("calibrage par carte, mesure, calibrage mémorisé", async ({ page }, info) => {
    await page.goto("/fr/guide-des-tailles");
    const card = page.getByTestId("carte-calibrage");
    await expect(card).toBeVisible();
    const before = (await card.boundingBox())!;
    await page.getByRole("button", { name: "Agrandir" }).click();
    await page.getByRole("button", { name: "Agrandir" }).click();
    const after = (await card.boundingBox())!;
    expect(Math.max(after.width, after.height)).toBeGreaterThan(
      Math.max(before.width, before.height),
    );
    if (isNarrow(info.project.name) && info.project.name === "mobile-375") {
      // Téléphone : la carte est présentée debout.
      expect(after.height).toBeGreaterThan(after.width);
    }
    await expectNoHorizontalScroll(page);
    await page.screenshot({ path: capture("guide-carte", info.project.name) });

    await page.getByRole("button", { name: "Le cadre correspond à ma carte" }).click();
    await expect(
      page.getByRole("heading", { name: "Posez une bague sur le cercle." }),
    ).toBeFocused();
    const slider = page.getByLabel("Diamètre du cercle");
    // Diamètre de départ : taille 6 (16,5 mm). Dix pas de 0,1 mm → 17,5 mm, taille 7.
    await slider.focus();
    for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("taille-resultat")).toContainText("7");
    await expect(page.getByRole("definition").filter({ hasText: "N½" })).toBeVisible();
    await expectNoHorizontalScroll(page);
    await page.screenshot({ path: capture("guide-bague", info.project.name) });

    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Posez une bague sur le cercle." }),
    ).toBeVisible();
  });
});

test.describe("journal et pages légales", () => {
  test("du Journal à un article, puis aux pièces citées", async ({ page }) => {
    await page.goto("/fr/journal");
    await expect(page.getByRole("article")).toHaveCount(3);
    await page.getByRole("link", { name: "La perle, ou l’art de la patience" }).click();
    await expect(page).toHaveURL(/\/fr\/journal\/histoire-de-la-perle$/);
    await expect(page.getByRole("heading", { level: 2, name: "Les pièces citées" })).toBeVisible();
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(data.some((d) => d.includes('"@type":"Article"'))).toBe(true);
  });

  test("sommaire de la politique de confidentialité", async ({ page }) => {
    await page.goto("/fr/confidentialite");
    await page
      .getByRole("navigation", { name: "Sommaire" })
      .getByRole("link", { name: "Vos droits" })
      .click();
    await expect(page).toHaveURL(/#vos-droits$/);
    await expect(page.getByRole("heading", { level: 2, name: "Vos droits" })).toBeInViewport();
  });

  test("pied de page : garantie à vie", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("contentinfo").getByRole("link", { name: "Lifetime warranty" }).click();
    await expect(page).toHaveURL(/\/en\/lifetime-warranty$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lifetime warranty");
  });
});
