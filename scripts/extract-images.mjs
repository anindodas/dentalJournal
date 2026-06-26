import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(
  "https://journal-dental-pro.preview.static.emergentagent.com/?utm_source=share",
  { waitUntil: "networkidle", timeout: 90000 }
);
await page.waitForTimeout(3000);

const data = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")].map((img) => ({
    src: img.src,
    alt: img.alt,
  }));
  const partners = [...document.querySelectorAll("p, span, div")]
    .map((el) => el.textContent?.trim())
    .filter((t) => t && t.length < 40 && /[A-Z]/.test(t));
  return { imgs, partners: partners.slice(0, 30) };
});

fs.writeFileSync("preview-images.json", JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
