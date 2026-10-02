# Implementation Plan — Zero-Spend Dropshipping Store Build

**Project:** Find the most profitable dropshipping niche, select products, build a launch-ready Shopify store.
**Repo:** `itsmaykol/shopi` · **Branch:** `arena/01a0fc19-shopi`
**Date:** 2026-10-02
**Budget:** $0.00 (hard constraint)

---

## 0. Access reality check (read this first)

I ran a capability probe before planning. Full probe results are in `06-final/FINAL-REPORT.md`.
The honest summary:

| Capability you assumed | Status in this session | Consequence |
|---|---|---|
| Browser subagent / live browser sessions | **NOT AVAILABLE** — no browser automation exists in this sandbox | I cannot log into your Shopify admin, cannot drive TikTok Creative Center / Meta Ad Library UIs, cannot take screenshots of *your* admin |
| Your logged-in Shopify admin | **NOT AVAILABLE** — no session, no API key, no MCP server connected | I cannot create products/pages/collections inside your store |
| Shopify CLI | **NOT INSTALLED** — and no Shopify credentials to authenticate it | Cannot push a theme to your store |
| Shopify MCP server | **NOT CONNECTED** | — |
| Antigravity Planning-mode UI / subagents on your machine | **NOT AVAILABLE** — I am running in an isolated cloud sandbox on your GitHub repo, not in Antigravity | "Artifacts" here = real files in this repo, not Antigravity UI panels |
| Ad Library / Trends UI scraping | **BLOCKED** — those UIs are JS/login-gated; Google Trends returns HTTP 429 | Niche data comes from open, fetchable sources + search, each cited |
| Internet from the shell | **BLOCKED EXCEPT allowlisted hosts** (npm, github, codeload) | Web access is via fetch/search tools only |
| Read web pages as text/markdown | **WORKS** (verified: CJdropshipping product pages return live prices) | Supplier pricing IS verifiable |
| Download the real Dawn theme | **WORKS** (verified: 881 KB tarball from `codeload.github.com`) | I can ship a genuine, customized, uploadable theme |
| Install headless Chromium via npm | **WORKS** (installing) | Real desktop + mobile screenshots of the store are possible |

**I will not pretend otherwise.** Nothing in the final report will claim a Shopify-admin action
that did not happen.

### So what does "launch-ready" mean here?

Instead of editing your store through a browser I don't have, I build the store as **portable,
importable assets** that move into your store in ~20 minutes, most of it automated:

1. **`03-store/shopify-import/products.csv`** — Shopify's official product CSV format. Admin → Products → Import. Creates every product, variant, price, image URL, tag, collection membership and SEO field in one shot.
2. **`03-store/theme/ZIP`** — a customized build of the official free **Dawn** theme (color palette, fonts, sections, logo mark, favicon, nav, footer). Admin → Online Store → Themes → Add theme → Upload zip.
3. **`03-store/pages/`** — every required page (About, Contact, Shipping, Refund, Privacy, Terms, FAQ, Track Order) as paste-ready HTML.
4. **`03-store/collections/` + `navigation/` + `emails/`** — collection definitions, nav/footer maps, and the 4 free email flows (welcome, abandoned cart, post-purchase, review request) as paste-ready copy.
5. **Live static storefront preview** — a pixel-level build of the actual store, served as a live preview so you can *click* the store before importing anything.
6. **`04-launch-kit/`** — TikTok/Reels scripts, hooks, shot lists, 14-day calendar, ad angles.
7. **`05-qa/`** — automated QA of the preview (links, prices, images, mobile) + screenshots.

Anything that genuinely requires your login (payments, domain, publishing, paid apps) is written into
`06-final/NEEDS-YOUR-ACTION.md` and I continue without it, per your rules.

---

## 1. Phase plan

### Phase 1 — Niche selection
- Evaluate 10 niches on the 8 criteria you specified (demand direction, margin potential, saturation,
  short-form virality, repeat/upsell, return risk, shipability, emotional drive). Each 1–10.
- Weights: demand direction ×1.25, margin ×1.25, virality ×1.25, saturation ×1.0 (inverted — low competition scores high),
  repeat/upsell ×1.0, return risk ×1.0 (inverted), shipability ×0.75, emotion ×0.75.
- Cross-check each against Q4 seasonality (we launch 2026-10-02, so Q4 gifting demand is a live tailwind).
- Output: scoring table artifact with cited evidence, then ONE winner + 3-sentence justification. No asking you to choose.

### Phase 2 — Product selection
- 8–12 SKUs: 1–2 heroes + complementary/bundle items.
- Gate: solves a clear problem or triggers strong emotion · demos in ≤15s · retails $19–$70 ·
  ≥3× markup over landed cost · ≥30% net margin after ~2.9%+30¢ + est. ad cost · light, small, durable ·
  not saturated with identical ads.
- Per product: supplier link, supplier price, ship cost, ship time to US, supplier rating/order volume,
  my price, margin math, one-line sell reason, VERIFIED/ESTIMATED flag.

### Phase 3 — Supplier vetting
- Prefer dropshipping-native suppliers with real US delivery ≤7–12 days and Shopify integration:
  CJ Dropshipping, Zendrop, Spocket, DSers/AliExpress, Alibaba-if-explicitly-dropship.
- Check: rating, years active, response speed, return policy, buyer photos, recurring complaints. Reject quality-complaint patterns.
- Re-verify live price/availability immediately before writing the import CSV (your rule).

### Phase 4 — Build the store (complete, not a draft)
- Brand: name + trademark sanity check, logo concept, palette, font pairing, premium feel.
- Theme: free Dawn, mobile-first customization. Homepage (hero promise, featured collection, benefits,
  honest social proof, FAQ, email capture), Bestsellers collection, full product pages, all required
  pages, nav/footer/favicon/checkout branding.
- Free conversion stack: bundles + quantity breaks, cross-sell/upsell, free-shipping threshold,
  abandoned cart, welcome discount, post-purchase, review/photo collection, social share, SEO basics,
  Meta + TikTok pixel placeholders.
- Shipping rates/zones mapped to real supplier costs. Payment settings left empty for you.
- Store **stays unpublished** (password page) — I cannot and will not publish it.

### Phase 5 — Viral launch kit
Per hero: 3 TikTok/Reels scripts (2-second hook), 5 ad hooks, shot list, captions + hashtags.
Plus 14-day organic calendar and 3 test-ready ad angles with audiences. **No ads will be run.**

### Phase 6 — QA
Automated crawl of every route at 390×844 (mobile) and 1440×900 (desktop): broken links, missing images,
typos, price consistency vs. product table, policy accuracy, load weight. Fix → re-test → screenshot.
Do not report done until clean.

---

## 2. Anti-fabrication protocol

- Every number in the product/niche tables carries `VERIFIED` (page opened, URL + screenshot captured)
  or `ESTIMATED` (stated reasoning).
- Search snippets are never upgraded to VERIFIED; only pages I actually opened count.
- If a supplier page cannot be opened, the product does not go in the table as verified.
- No invented order counts, ratings, shipping times, or trend curves.
- No fake reviews/testimonials/scarcity/timers/press logos. Review sections ship as honest placeholders.
- No branded/trademarked/licensed goods, no restricted or unsafe categories, no health/income/guaranteed-result claims.

## 3. Risk register (abridged)

| Risk | Mitigation |
|---|---|
| Supplier price changes between research and import | Re-check every SKU live right before the CSV is written; record check timestamp |
| Ship-time promises drift | Publish honest ranges with a buffer, not best-case promises |
| Import CSV image URLs are hotlinked | Document that images must be kept from the supplier CDN as allowed, or re-uploaded on first order |
| No real reviews at launch | Honest empty-state + review-request email flow instead of fabricated social proof |
| Q4 supplier congestion (Nov–Dec) | Flag cutoff dates in the shipping policy; pick suppliers with US-warehouse options |
| I cannot verify the live admin after import | I ship a QA'd preview + a post-import verification checklist you run in 5 minutes |
