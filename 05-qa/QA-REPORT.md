# Phase 6 — QA Report

**Build tested:** `03-store/preview/` (26 pages)
**Method:** headless Chromium crawl + interaction tests + full-page screenshots at two viewports
**Result: 0 issues across 26 pages**, after 3 rounds of find → fix → re-test
**Artifacts:** `qa-results.json` (raw crawl), `screenshots/` (27 images, 6.7 MB)

---

## 1. What was tested, and what it found

| Test | Scope | Result |
|---|---|---|
| Broken internal links | 1,171 links across 26 pages, checked against the real file tree | **0 broken** |
| Missing local images / assets | 195 images + all CSS/JS references | **0 missing** |
| Alt text coverage | Every `<img>` | **0 without alt text** |
| Width/height on images | Every `<img>` | **0 missing** (no layout shift) |
| Page titles present | All 26 | **0 missing**; none over 70 characters |
| Meta descriptions | All 26 | **0 missing** |
| Exactly one `<h1>` per page | All 26 | **Pass** |
| Buttons with no accessible name | Every `<button>` | **0** (all have text or `aria-label`) |
| Typo / placeholder scan | 14 patterns: lorem ipsum, TODO, FIXME, `undefined`, `NaN`, "recieve", "occured", "seperate", "definately", "guarentee", "teh", "alot"… | **0 hits** |
| Price consistency | Every rendered `$x.xx` matched against the data model | **0 orphan prices** |
| HTTP status | All 26 routes | **200** |
| Failed local requests | Console/network during crawl | **0** |

## 2. Interaction tests (not just visual checks)

| Flow | Test | Result |
|---|---|---|
| Add to cart (product page) | Click → cart drawer opens | ✅ Pass — verified programmatically, not by eye |
| Add to cart | Subtotal updates from $0.00 | ✅ Pass |
| Add to cart | Header cart badge updates | ✅ Pass |
| Cart quantity | `+` / `−` / remove | ✅ Pass |
| Free-shipping bar | Under threshold → progress bar with "$X away"; over threshold → "unlocked" state | ✅ Pass both states |
| Checkout button | Must not silently navigate; must explain | ✅ Pass — shows an explicit note that checkout is not connected in the preview |
| Mobile hamburger menu | Opens drawer at 390px | ✅ Pass |
| Image fallback | Simulated supplier-CDN failure | ✅ Pass — branded SVG mark renders, no broken-image icon |
| Newsletter form | Submit → confirmation, input clears | ✅ Pass |
| Thumbnail gallery | Click changes the main image, active state moves | ✅ Pass |
| FAQ accordions | 65 `<details>` elements open/close | ✅ Pass |

*The add-to-cart and checkout assertions read DOM state after the click, so they cannot pass on a lucky
screenshot.*

## 3. Issues found and fixed (all three rounds)

### Round 1 — 17 issues
| Issue | Impact | Fix |
|---|---|---|
| **`undefined` rendered as card copy on 17 pages** | Six products were missing the `hero` field, so their cards showed the literal text "undefined" — a genuine credibility killer | Added the six missing fields; added a `p.hero \|\| p.hook` fallback so this class of bug cannot recur |
| Product `<title>` tags of 74–82 characters | Would truncate in search results | Titles switched to the short product name + brand, now all ≤ 70 |
| Price-consistency check reporting supplier prices as errors | False positives would hide real errors | The check now excludes the supplier-evidence block from the price scan |

### Round 2 — visual defects caught by reviewing the screenshots
| Issue | Impact | Fix |
|---|---|---|
| **Emoji icons rendered as empty boxes** in the trust bar and cart | The build environment has no emoji font; on a user's phone it would usually render — but "usually" is not good enough for a hero trust bar | Replaced all four with inline SVG icons; removed the remaining emoji from the cart message |
| **Fallback placeholders looked like broken images** — a grey blob with small caption text | If the supplier CDN blocks image loading, the whole grid looked broken | Redesigned the fallback as a proper brand graphic: logo mark, "Sniffari" wordmark and the product category |

### Round 3 — verified clean
Re-crawled after every fix. **Final: 0 issues, 26 pages, 27 screenshots.**

## 4. Performance

| Metric | Value | Assessment |
|---|---|---|
| HTML per page (uncompressed) | 62–92 KB | Normal for a rich page; gzips to **~8 KB** |
| CSS | 5.4 KB gzipped, single file, no framework | Excellent |
| JavaScript | **Zero dependencies, no framework, ~3 KB inline** | Nothing blocks render |
| Local asset payload | 1.4 MB (1.35 MB of it is the 1024×1024 hero illustration) | Should be re-exported as WebP (~150 KB) before launch — noted below |
| Render-blocking requests | One stylesheet; fonts load async with a full system fallback stack | Good |
| Third-party requests | **Zero** — no trackers, no fonts CDN dependency, no analytics | Faster than almost any real store |

## 5. Policy accuracy check (the one people get wrong)

Every claim on the legal and policy pages was cross-checked against what the supplier data actually supports:

| Claim on the store | Backed by | Verdict |
|---|---|---|
| "Most US orders arrive in 7–15 days" | Observed windows of 3–13 days across five listings | ✅ Honest — padded above the best case, so the promise should hold |
| "Free US shipping over $35, otherwise $4.95" | Margin math in `PRODUCT-TABLE.md` | ✅ $35 threshold sits above the ~$22–28 average single-item cart, which is what drives the upsell |
| "30-day returns on unused, unwashed items" | Matches the standard AliExpress return window | ✅ Achievable, and the policy states plainly who pays postage in each case |
| "No batteries, no apps, no subscriptions" | All 12 SKUs are non-electronic | ✅ Verifiable from the specs |
| "No fake reviews / no countdown timers" | Enforced in the build itself | ✅ The honest empty state is live, and no scarcity device exists anywhere in the markup |
| "Nothing here treats, cures or prevents anything" | Stated on product pages and in the FAQ | ✅ Health claims deliberately absent throughout |
| Track-order page | States it is not connected to a live system yet | ✅ No false promise; instructions given for the free Shopify replacement |

## 6. What I could NOT test (and you must)

| Untested | Why | What you do |
|---|---|---|
| Real Shopify rendering of the Dawn theme | No admin access from this environment | Upload the zip, open the theme editor, walk the 9-point checklist in `NEEDS-YOUR-ACTION.md` |
| Real checkout and payment | Requires your payment account, and going through it would mean spending money | Your own test order once payments are connected |
| Real transactional emails | Needs Shopify Email/Notifications configured | Send a test of each of the 4 flows after pasting them in |
| Image loading from Shopify's CDN after import | The CSV hot-links supplier images; Shopify fetches them at import time | Check the product grid after import; re-add any that failed |
| Behaviour on a real mobile device | Tested at 390×844 in Chromium, not on iOS Safari/Android Chrome | Open the live preview on your phone — 30 seconds |

## 7. Pre-launch polish list (nice-to-have, not blockers)

1. **Re-export the hero illustration as WebP** — saves about 1.2 MB on the homepage.
2. **Add a real OG image** per product (currently one shared `og:image`).
3. **Compress supplier images on import** — Shopify does this automatically, but check the first few.
4. **Add product schema (`Product` JSON-LD)** — Dawn outputs some structured data; adding `Product` +
   `Offer` markup can improve Google Shopping eligibility. Free, and worth 15 minutes.
5. **Replace the `hello@sniffari.example` placeholder** with your real support address everywhere it appears.

---

## 8. Reproducing this QA

```bash
# serve the built store
cd 03-store/preview && python3 -m http.server 8080

# run the crawl + screenshots (needs puppeteer-core + @sparticuz/chromium + LD_LIBRARY_PATH)
cd 05-qa && node qa.mjs http://127.0.0.1:8080 ./screenshots
```

The script exits non-zero-equivalent output listing every issue, so it can be re-run after any edit as a
regression check. `qa-results.json` holds the full per-page dataset.
