/**
 * Mesure le JavaScript chargé par une page jusqu'au repos réseau (octets
 * compressés transférés), script par script.
 *   node scripts/measure-js.mjs http://localhost:3100 /fr /fr/creations/aube-premiere
 */
import { chromium } from "@playwright/test";

const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH });
for (const path of paths) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const urls = new Map();
  const sizes = new Map();
  cdp.on("Network.responseReceived", (e) => {
    if (e.type === "Script") urls.set(e.requestId, e.response.url);
  });
  cdp.on("Network.loadingFinished", (e) => {
    if (urls.has(e.requestId)) sizes.set(urls.get(e.requestId), e.encodedDataLength);
  });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const rows = [...sizes].sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((s, [, n]) => s + n, 0);
  console.log(`\n${path} : ${(total / 1024).toFixed(1)} Ko (${rows.length} scripts)`);
  if (process.env.DETAIL)
    for (const [u, n] of rows)
      console.log(`  ${(n / 1024).toFixed(1).padStart(6)}  ${u.replace(base, "")}`);
  await page.close();
}
await browser.close();
