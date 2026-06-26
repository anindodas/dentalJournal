import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(
  "https://journal-dental-pro.preview.static.emergentagent.com/?utm_source=share",
  { waitUntil: "networkidle", timeout: 90000 }
);
await page.waitForTimeout(3000);

const html = await page.content();
fs.writeFileSync("static-full.html", html);

// Extract computed styles from key elements
const styles = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      color: s.color,
      background: s.backgroundColor,
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
    };
  };
  return {
    body: pick("body"),
    h1: pick("h1"),
    nav: pick("nav"),
    button: pick("button"),
  };
});

console.log(JSON.stringify(styles, null, 2));

// Get all section headings and structure
const structure = await page.evaluate(() => {
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,p,a,button")].slice(0, 80).map((el) => ({
    tag: el.tagName,
    text: el.textContent?.trim().slice(0, 100),
    className: el.className,
  }));
  return headings;
});

fs.writeFileSync("static-structure.json", JSON.stringify(structure, null, 2));

await page.screenshot({ path: "preview-full.png", fullPage: true });
console.log("Done, HTML length:", html.length);

await browser.close();
