import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(
  "https://journal-dental-pro.preview.emergentagent.com/?utm_source=share",
  { waitUntil: "domcontentloaded", timeout: 90000 }
);

await page.waitForTimeout(12000);

const frames = page.frames();
console.log("Frames:", frames.map((f) => f.url()));

let bestText = "";
let bestHtml = "";

for (const frame of frames) {
  try {
    const text = await frame.innerText("body");
    const html = await frame.content();
    if (text.length > bestText.length) {
      bestText = text;
      bestHtml = html;
    }
  } catch {
    // ignore cross-origin frames
  }
}

if (!bestText) {
  bestText = await page.innerText("body");
  bestHtml = await page.content();
}

fs.writeFileSync("preview-scrape.txt", bestText);
fs.writeFileSync("preview-scrape.html", bestHtml);
await page.screenshot({ path: "preview-screenshot.png", fullPage: true });

console.log("Text length:", bestText.length);
console.log(bestText.slice(0, 5000));

await browser.close();
