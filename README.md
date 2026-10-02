# Sniffari — zero-spend dropshipping store build

A complete, launch-ready **pet enrichment & everyday care** Shopify store, built in this repository.
Niche research, product selection, supplier vetting, brand, storefront, theme, copy, emails, launch kit
and QA — all as real files you can import, upload, paste and publish.

**Store:** Sniffari · **Niche:** indoor pet enrichment & everyday care (dogs + cats)
**Built:** 2026-10-02 · **Budget spent:** $0.00

---

## ⚡ Start here

| I want to… | Open this |
|---|---|
| **See the store** | `03-store/preview/index.html` — or run the live preview (`npx serve 03-store/preview`) |
| **Import the products into Shopify** | `03-store/shopify-import/products.csv` → Admin → Products → Import |
| **Upload the theme** | `03-store/theme/sniffari-dawn-theme.zip` → Admin → Themes → Add theme → Upload zip |
| **Know what I have to do** | ↳ **`06-final/NEEDS-YOUR-ACTION.md`** |
| **Read the honest summary** | ↳ **`06-final/FINAL-REPORT.md`** |
| **See what was verified vs estimated** | `02-products/PRODUCT-TABLE.md` + `01-research/RESEARCH-SOURCES.md` |
| **Post the first video** | `04-launch-kit/LAUNCH-KIT.md` |
| **Check my QA evidence** | `05-qa/QA-REPORT.md` + `05-qa/screenshots/` (27 images) |

---

## What's in here

```
00-plan/
  IMPLEMENTATION-PLAN.md          The plan I executed, and what access was actually available
  TASK-LIST.md                    Live task list, updated as work completed

01-research/
  NICHE-SCORING.md                10 niches scored on 8 weighted criteria + evidence + the winner
  RESEARCH-SOURCES.md             Every source URL used, and what each one established

02-products/
  PRODUCT-TABLE.md                12 products: supplier link, price, margin math, VERIFIED/ESTIMATED flags
  SUPPLIER-VETTING.md             Phase 3 — suppliers assessed, what could and could not be verified

03-store/
  BRAND.md                        Name, logo concept, palette, fonts, voice, trademark status
  preview/                        ★ The clickable storefront — 26 pages, real design, working cart
  theme/sniffari-dawn-theme.zip   ★ Customized free Dawn theme, ready to upload
  theme/README.md                 Theme notes + the 3 things that must be done by hand
  shopify-import/products.csv     ★ Shopify's official import format — all 12 products, 1 import
  shopify-import/pages/           Paste-ready HTML for About / Contact / FAQ / Track order
  shopify-import/collections.md   5 automated collections
  shopify-import/navigation.md    Main menu + three footer menus + checkout branding
  shopify-import/shipping-rates.md Shipping zones and rates, with the reasoning
  emails/                         4 free email flows: welcome, abandoned cart, post-purchase, win-back
  build/                          The generators + data model — edit data.mjs and rebuild everything

04-launch-kit/
  LAUNCH-KIT.md                   6 scripts, 10 ad hooks, 2 shot lists, 14-day calendar, 3 ad angles

05-qa/
  QA-REPORT.md                    What was tested, what passed, what still needs a human
  qa-results.json                 Raw crawl output
  screenshots/                    27 desktop + mobile captures, incl. cart and checkout states

06-final/
  FINAL-REPORT.md                 ← the deliverable summary
  NEEDS-YOUR-ACTION.md            ← everything only you can do
```

---

## The store in one paragraph

**Sniffari** sells the unglamorous side of living with an indoor pet: **enrichment** (snuffle mat, lick mat,
slow feeder, treat duo) and **shed control** (fur lifter, slicker brush, deshedding glove), plus **walk
cleanup** (paw cleaner cup, travel bottle). Eight single products and four bundles, retailing
$17.99–$64.99 with 3.2×–5.4× markup. Everything is non-electronic, small, light and durable — no batteries
to fail, no certifications to obtain, no safety category to worry about.

## Rebuilding after you edit `data.mjs`

```bash
cd 03-store/build
node build.mjs      # regenerates 03-store/preview/
node handoff.mjs    # regenerates the Shopify import package + emails
node theme.mjs /path/to/extracted/dawn   # regenerates the theme + zip
```

`data.mjs` is the single source of truth: prices, copy, specs, FAQs and supplier evidence all live there.
Change a price once and it updates the storefront, the CSV and the theme together.

## The three rules this build was held to

1. **Zero spend.** Free theme (Dawn, MIT), free apps only, no paid anything. Every optional paid item is
   listed in `NEEDS-YOUR-ACTION.md` with a free alternative.
2. **No fabrication.** Every supplier price, rating and delivery window is marked `VERIFIED-LIVE` with the
   page it came from, or `ESTIMATED` with the reasoning. Where I could not verify something, the report says
   so — see the supplier-vetting gaps and the QA report's "what I could not test" section.
3. **No fake social proof.** No invented reviews, testimonials, order counts, urgency timers or press
   logos. The storefront has an honest "we have no reviews yet, here's why" section instead, and a real
   review-collection flow to replace it.
