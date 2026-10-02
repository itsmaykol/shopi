#!/usr/bin/env node
/**
 * Phase 6 QA — crawls the built storefront and reports:
 *   - broken internal links (every href/src that points inside the site must resolve to a real file)
 *   - missing alt text on images
 *   - missing/short page titles + meta descriptions
 *   - price consistency: every price rendered on a page must exist in the data model
 *   - common typos / lorem ipsum / placeholder text that slipped through
 *   - page weight
 * Also captures desktop (1440x900) and mobile (390x844) screenshots.
 *
 * Usage: node qa.mjs [baseUrl] [outDir]
 */
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:8080";
const ROOT = "/home/user/shopi/03-store/preview";
const OUT = process.argv[3] || "/home/user/shopi/05-qa/screenshots";
mkdirSync(OUT, { recursive: true });

// ── collect every html page in the build
const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push("/" + relative(ROOT, p));
  }
})(ROOT);
pages.sort();

const files = new Set();
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else files.add("/" + relative(ROOT, p));
  }
})(ROOT);

const browser = await puppeteer.launch({
  args: [...chromium.args, "--hide-scrollbars", "--disable-dev-shm-usage"],
  executablePath: await chromium.executablePath(),
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

const issues = [];
const notes = [];
const pageReport = [];

const TYPO_PATTERNS = [
  [/\blorem ipsum\b/i, "Lorem ipsum placeholder text"],
  [/\bTODO\b/, "TODO marker"],
  [/\bFIXME\b/, "FIXME marker"],
  [/\bXXXX\b/, "XXXX placeholder"],
  [/\bundefined\b/i, "literal 'undefined' rendered"],
  [/\bNaN\b/, "literal 'NaN' rendered"],
  [/\bteh\b/i, "typo: 'teh'"],
  [/\brecieve/i, "typo: 'recieve'"],
  [/\boccured/i, "typo: 'occured'"],
  [/\bseperate/i, "typo: 'seperate'"],
  [/\bdefinately/i, "typo: 'definately'"],
  [/\bguarentee/i, "typo: 'guarentee'"],
  [/\bwich\b/i, "typo: 'wich'"],
  [/\byour welcome/i, "typo: 'your welcome'"],
  [/\balot\b/i, "typo: 'alot'"],
];

for (const path of pages) {
  const url = BASE + path;
  const page = await browser.newPage();
  const failedRequests = [];
  let bytes = 0;
  page.on("response", (r) => {
    const len = Number(r.headers()["content-length"] || 0);
    if (r.url().startsWith(BASE)) bytes += len;
  });
  page.on("requestfailed", (r) => {
    if (r.url().startsWith(BASE)) failedRequests.push(r.url());
  });

  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  const status = resp ? resp.status() : 0;
  if (status !== 200) issues.push(`[${path}] HTTP ${status}`);

  const data = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src") || "",
      alt: i.getAttribute("alt"),
      hasWidth: i.hasAttribute("width"),
      hasHeight: i.hasAttribute("height"),
    }));
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src"));
    const styles = [...document.querySelectorAll("link[rel=stylesheet]")].map((s) => s.getAttribute("href"));
    return {
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.getAttribute("content") || "",
      h1s: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      imgs,
      links,
      scripts,
      styles,
      text: document.body.innerText,
      html: document.documentElement.outerHTML.length,
      // supplier-evidence prices ($4.06, $0.33 …) are quoted listing data, not store prices,
      // so they are excluded from the price-consistency check.
      prices: (() => {
        const clone = document.body.cloneNode(true);
        clone.querySelectorAll(".supplierbox").forEach((n) => n.remove());
        return (clone.innerText.match(/\$[0-9]+\.[0-9]{2}/g) || []);
      })(),
      detailsCount: document.querySelectorAll("details").length,
      formCount: document.querySelectorAll("form").length,
      buttonsWithoutLabel: [...document.querySelectorAll("button")].filter(
        (b) => !b.textContent.trim() && !b.getAttribute("aria-label")
      ).length,
    };
  });

  // link + asset integrity
  for (const href of [...data.links, ...data.scripts, ...data.styles]) {
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (!files.has(clean)) issues.push(`[${path}] broken internal link → ${href}`);
  }

  // images (local paths only)
  for (const img of data.imgs) {
    if (!img.alt) issues.push(`[${path}] image missing alt text → ${img.src.slice(0, 70)}`);
    if (img.src.startsWith("/") && !files.has(img.src.split("?")[0]))
      issues.push(`[${path}] missing local image → ${img.src}`);
    if (!img.hasWidth || !img.hasHeight)
      notes.push(`[${path}] image without width/height (layout shift risk): ${img.src.slice(0, 60)}`);
  }

  if (!data.title) issues.push(`[${path}] missing <title>`);
  if (data.title.length > 70) notes.push(`[${path}] title is ${data.title.length} chars (may truncate in SERP)`);
  if (!data.desc) issues.push(`[${path}] missing meta description`);
  if (data.h1s.length === 0) issues.push(`[${path}] no <h1>`);
  if (data.h1s.length > 1) notes.push(`[${path}] ${data.h1s.length} <h1> elements`);
  if (data.buttonsWithoutLabel > 0) issues.push(`[${path}] ${data.buttonsWithoutLabel} button(s) with no text or aria-label`);

  for (const [re, label] of TYPO_PATTERNS) {
    const m = data.text.match(re);
    if (m) issues.push(`[${path}] ${label} → "${m[0]}"`);
  }

  // external image hosts that must be reachable from a real browser
  const extImgs = data.imgs.filter((i) => i.src.startsWith("http"));
  if (extImgs.length) notes.push(`[${path}] ${extImgs.length} hotlinked supplier image(s) — fallback SVG applies if CDN is blocked`);

  pageReport.push({
    path,
    status,
    title: data.title,
    bytes,
    imgs: data.imgs.length,
    links: data.links.length,
    details: data.detailsCount,
    forms: data.formCount,
    prices: [...new Set(data.prices)].sort(),
    failedRequests: failedRequests.length,
  });

  await page.close();
}

// ── screenshots: desktop + mobile, homepage + key templates
const shots = [
  ["/index.html", "homepage"],
  ["/collection/bestsellers.html", "collection-bestsellers"],
  ["/collection/bundles.html", "collection-bundles"],
  ["/products/snuffle-mat.html", "product-snuffle-mat"],
  ["/products/fur-lifter.html", "product-fur-lifter"],
  ["/pages/faq.html", "page-faq"],
  ["/pages/shipping-policy.html", "page-shipping"],
  ["/pages/about.html", "page-about"],
  ["/pages/contact.html", "page-contact"],
];

const shoot = async (path, name, width, height, label) => {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200)); // let fonts + fallbacks settle
  await page.screenshot({ path: join(OUT, `${label}-${name}.png`), fullPage: true });

  // cart interaction test on the two product shots
  if (name.startsWith("product-")) {
    await page.click("[data-add]");
    await new Promise((r) => setTimeout(r, 500));
    const drawerVisible = await page.$eval("[data-cart-drawer]", (d) => !d.hidden);
    const subtotal = await page.$eval("[data-cart-subtotal]", (e) => e.textContent.trim());
    const count = await page.$eval("[data-cart-count]", (e) => e.textContent.trim());
    if (!drawerVisible) issues.push(`[${path}] add-to-cart did not open the cart drawer`);
    if (subtotal === "$0.00") issues.push(`[${path}] add-to-cart did not update the subtotal`);
    if (count === "0" || count === "") issues.push(`[${path}] add-to-cart did not update the cart count`);
    await page.screenshot({ path: join(OUT, `${label}-${name}-cart-open.png`), fullPage: false });
    // checkout button must NOT navigate away / must warn
    await page.click("[data-checkout]");
    await new Promise((r) => setTimeout(r, 300));
    const warned = await page.$eval("[data-checkout-note]", (e) => !e.hidden);
    if (!warned) issues.push(`[${path}] checkout button gave no explanation`);
    await page.screenshot({ path: join(OUT, `${label}-${name}-checkout-note.png`), fullPage: false });
  }
  await page.close();
};

for (const [path, name] of shots) {
  await shoot(path, name, 1440, 900, "desktop");
  await shoot(path, name, 390, 844, "mobile");
}

// mobile menu test
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + "/index.html", { waitUntil: "domcontentloaded" });
  await page.click("[data-menu-open]");
  await new Promise((r) => setTimeout(r, 300));
  const open = await page.$eval("[data-mobilemenu]", (m) => !m.hidden);
  if (!open) issues.push("[mobile] hamburger menu did not open");
  await page.screenshot({ path: join(OUT, "mobile-homepage-menu-open.png") });
  await page.close();
}

await browser.close();

// ── price consistency: every rendered price must exist in the data model
const { products } = await import("/home/user/shopi/03-store/build/data.mjs");
const valid = new Set();
products.forEach((p) => {
  valid.add(p.price.toFixed(2));
  valid.add(p.compareAt.toFixed(2));
});
valid.add("4.95"); // flat shipping
valid.add("35.00"); // free ship threshold
const allPrices = new Set();
pageReport.forEach((p) => p.prices.forEach((x) => allPrices.add(x.replace("$", ""))));
const orphanPrices = [...allPrices].filter((p) => !valid.has(p));

const report = {
  generated: new Date().toISOString(),
  base: BASE,
  pagesChecked: pages.length,
  screenshots: readdirSync(OUT).length,
  issues,
  notes,
  orphanPrices,
  pageReport,
};
writeFileSync("/home/user/shopi/05-qa/qa-results.json", JSON.stringify(report, null, 2));

console.log(`pages checked: ${pages.length}`);
console.log(`issues: ${issues.length}`);
issues.forEach((i) => console.log("  ✗ " + i));
console.log(`notes: ${notes.length}`);
notes.slice(0, 20).forEach((n) => console.log("  · " + n));
console.log(`prices rendered but not in the data model: ${orphanPrices.length ? orphanPrices.join(", ") : "none"}`);
console.log(`screenshots: ${report.screenshots} → ${OUT}`);
