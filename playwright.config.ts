import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3100);

// Les quatre largeurs de référence du brief : 375, 768, 1280, 1920 px.
export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  projects: [
    {
      name: "mobile-375",
      use: {
        ...devices["iPhone 13 Mini"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "tablette-768",
      use: { browserName: "chromium", viewport: { width: 768, height: 1024 } },
    },
    {
      name: "bureau-1280",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
    {
      name: "large-1920",
      use: { browserName: "chromium", viewport: { width: 1920, height: 1080 } },
    },
  ],
  webServer: {
    command: `npx next start -p ${port}`,
    port,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
