# Final Report — Sniffari

**Deliverable:** a complete, launch-ready pet-enrichment Shopify store, built entirely as importable files
**Date:** 2026-10-02 · **Spend:** $0.00 · **Repo:** `itsmaykol/shopi` @ `arena/01a0fc19-shopi`

---

## 1. Tool and access check

You asked me to work in Antigravity with a browser subagent, your logged-in Shopify admin, terminal, and
MCP servers. Here is what actually exists in this environment — measured, not assumed.

| Tool / access you expected | Status | What I did instead |
|---|---|---|
| **Browser subagent / live browser** | ❌ **Not available.** No browser automation, no session | Built my own headless Chromium pipeline (see below) | 
| **Your logged-in Shopify admin** | ❌ **Not available.** No session, no API key | Built the store as importable files + a clickable preview |
| **Shopify MCP server** | ❌ **Not connected** | — |
| **Shopify CLI** | ❌ **Not installed**, and no credentials to authenticate it | Hand-built the theme from the official Dawn source |
| **Antigravity Planning-mode artifacts** | ❌ **Not applicable** — I run in a cloud sandbox on your repo, not in your IDE | "Artifacts" here are real files in this repository |
| **Terminal** | ✅ **Available** (node 22, python 3.11, git, gcc, zip) | Used for building, zipping, validating, screenshotting |
| **Web research** | ⚠️ **Partial.** Shell internet is allowlisted (npm, GitHub, codeload only) | Used the platform's page-fetch and search tools — these work well |
| **TikTok Creative Center** | ❌ Login-walled | Substituted published TikTok Shop GMV research, all cited |
| **Meta Ad Library** | ❌ Login-walled | Ad-saturation scored as an **estimate** and labelled as such |
| **Google Trends** | ❌ **HTTP 429** on every attempt | Substituted cited third-party reproductions of Trends data |
| **AliExpress** | ⚠️ **Search pages yes, item pages no** (reCAPTCHA) | All pricing read live from search pages; the review-text gap is flagged |
| **Alibaba** | ❌ Slider CAPTCHA | **No Alibaba supplier is used or priced** |
| **CJdropshipping** | ⚠️ Homepage yes, product pages bot-walled | Kept as a documented backup; **no CJ costs used** |
| **Zendrop** | ❌ Category page returned 404 | Not used |

### What I built to compensate — three things worth knowing

**1. A real screenshot pipeline.** I installed headless Chromium, hit a missing-library failure
(`libnspr4.so`, `libnss3.so`), traced it to a brotli-compressed library bundle shipped inside the npm
package, wired up `LD_LIBRARY_PATH`, and got it rendering. **27 real screenshots** of the finished store
exist in `05-qa/screenshots/` — desktop and mobile, including cart-open and checkout states. They are
genuine renders, not mockups.

**2. A genuine, uploadable Shopify theme.** I pulled the official free `Shopify/dawn` theme (v16.0.0, MIT),
customized its colour schemes, typography, shape and homepage templates from the same data model as the
storefront, and packaged it as **`sniffari-dawn-theme.zip`** with only Shopify's seven accepted root
directories. It is ready for Admin → Themes → Upload zip.

**3. A storefront that is a real, clickable store.** 26 pages with a working cart (add → drawer → quantity →
free-shipping threshold → subtotal → checkout boundary), live on the preview server. It is both the design
proof and the copy source of truth.

### The one honest consequence

**I have never seen this theme inside a real Shopify store.** Everything is verified against the official
theme source and validated as JSON, but the import and the theme upload are the two steps most likely to
need a small fix. `NEEDS-YOUR-ACTION.md` covers exactly what to check, and `05-qa/QA-REPORT.md` §6 lists
precisely what remains untested. I would rather hand you a correct file package plus an honest gap than
claim an admin action I never took.

---

## 2. Niche decision and scoring

Full table with evidence: **`01-research/NICHE-SCORING.md`**

Ten niches scored 1–10 on your eight criteria, weighted by impact on a zero-budget, mobile-first,
organic-video store:

| Rank | Niche | Weighted score |
|---|---|---|
| 🥇 **1** | **Pet enrichment & everyday care (dogs + cats)** | **8.36** |
| 2 | Beauty & skincare (tools, not ingestibles) | 7.24 |
| 3 | Jewelry & accessories | 7.09 |
| 4 | Home organisation & cleaning (CleanTok) | 7.03 |
| 5 | Kitchen & meal-prep tools | 6.91 |
| 6 | Baby & parenting | 6.85 |
| 7 | Mood / ambient lighting | 6.64 |
| 8 | Car interior & detailing | 6.24 |
| 9 | Phone & tech accessories | 6.09 |
| 10 | Home office & desk setup | 6.06 |

**Winner: pet enrichment & everyday care.** Three reasons:

1. **The demand curve peaks exactly on our launch window.** US pet spending is $158B → **$165B projected
   for 2026**, and "dog toys" search interest peaks in **November–December** while **81% of pet owners buy
   holiday gifts** for their pets, with $51–75 the most common spend band — which is precisely where our
   bundles sit.
2. **The margins are structural, not lucky.** Verified supplier costs of $2.74–$7.39 against $19.99–$34.99
   retail, on small, light, durable, non-electronic goods that ship cheaply and rarely come back.
3. **Its one weakness is fixable.** Commodity pet accessories *are* saturated — so the store is positioned
   on **indoor enrichment + shedding/paw cleanliness** and sold in bundles, rather than racing on single
   commodity toys. That positioning is also the strongest short-form video angle.

**Niches that lost, and why** — this is as important as the winner: **car detailing** was disqualified on
seasonality (its category size declines $455M → $372M from September to December — we would be launching
into a four-month decline). **Beauty** was disqualified because its 2026 winners are *branded* Korean/derm
products we cannot legally sell. **Baby** was excluded on the safety-standards constraint, despite good
numbers. **Jewelry** has the best margins of all and lost on flat demand plus the highest trust barrier.

---

## 3. Product table with verification flags

Full detail, margin math and sell reasons: **`02-products/PRODUCT-TABLE.md`**
Supplier vetting, including the gaps: **`02-products/SUPPLIER-VETTING.md`**

**12 SKUs: 8 single products + 4 bundles.** Two heroes, the rest complementary.

| # | Product | Retail | Landed cost | Markup | Net @ $8 CPA | Supplier evidence |
|---|---|---|---|---|---|---|
| **1** | **Sniffari Snuffle Mat** ⭐ hero | **$34.99** | $6.45 | 5.4× | $19.23 (55%) | 4.7★/500+ · alt **4.9★/4,000+** |
| **2** | **Sniffari Fur Lifter** ⭐ hero | **$24.99** | $4.70 | 5.3× | $11.27 (45%) | **4.9★ / 10,000+ sold** |
| 3 | Anti-Choke Slow Feeder Bowl | $24.99 | $5.70 | 4.4× | $10.27 (41%) | 4.7★ / 1,000+ sold |
| 4 | Lick & Chill Mat | $21.99 | $6.70 | 3.3× | $6.35 (29%) | ⚠️ new listing — thin evidence |
| 5 | Self-Cleaning Slicker Brush | $24.99 | $6.00 | 4.2× | $9.97 (40%) | 4.8★ / 10,000+ sold |
| 6 | Deshedding Grooming Glove | $17.99 | $4.40 | 4.1× | $4.77 (27%) | 4.9★ / 1,000+ sold |
| 7 | Mud-Buster Paw Cleaner Cup | $27.99 | $6.10 | 4.6× | $12.78 (46%) | ⚠️ 4.3★ / only 29 sold |
| 8 | Trail-Sip Water Bottle | $24.99 | $5.80 | 4.3× | $10.17 (41%) | 4.8★ / 5,000+ sold |
| **9** | **Calm & Clean Kit** (bundle) | **$49.99** | $13.15 | 3.8× | $27.09 (54%) | components verified |
| **10** | **Shed-Control Trio** (bundle) | **$59.99** | $15.10 | 4.0× | $34.85 (58%) | components verified |
| 11 | New Puppy Starter Kit (bundle) | $64.99 | $16.55 | 3.9× | $38.26 (59%) | components verified |
| 12 | Enrichment Treat Duo (bundle) | $39.99 | $12.40 | 3.2× | $18.13 (45%) | components verified |

**Verification discipline:** every supplier price, rating, units-sold figure and delivery window in the table
is `VERIFIED-LIVE` — read from a page I opened today, URL given. Every cost and margin is `ESTIMATED` using
a **deliberately padded planning cost**, never the promotional price. That matters: AliExpress shows
loss-leader prices of $0.33 and $1.09 that would have made the margins look spectacular and been worthless
as a business plan.

**Gate check:** all 12 clear 3.2×–5.4× markup; **6 of 12 clear ≥30% net margin even at a pessimistic $12
CPA**, and 11 of 12 clear ≥27% at $8. The exception, the $17.99 glove, is deliberately a traffic driver and
bundle component, not a hero.

---

## 4. Store — what was built

### Brand
**Sniffari** — "sniff" + "safari". Original logo: the "sniff line", a single stroke that starts as a dog's
snout and resolves into a spiral (a sniff swirl, and a snuffle mat from above) — legible at favicon size.
Palette: ink `#16211C`, cream `#FBF7F0`, sand `#EFE6D8`, sage `#7E9C86`, clay `#C0663A`, pine `#2E4A3D`.
Type: Fraunces (headings) + Inter (body) in the storefront; Playfair Display + Inter in the theme.
⚪ **Trademark status: NOT cleared — flagged as a required action.**

### Everything built, and where it lives

| Requirement | Delivered | Artifact |
|---|---|---|
| Free mobile-first theme, customized | ✅ Dawn v16, 5 brand colour schemes, pill buttons, 12px cards | `03-store/theme/sniffari-dawn-theme.zip` |
| Homepage: hero, featured collection, benefits, social proof, FAQ, email capture | ✅ All six, mobile-first | theme `templates/index.json` + `preview/index.html` |
| Collections incl. Bestsellers | ✅ 5 collections with automated tag conditions | `shopify-import/collections.md` |
| Full product pages | ✅ 12 pages: hook, bullets, prose, specs table, shipping, FAQ, supplier evidence | `preview/products/*.html` |
| Required pages | ✅ About, Contact, Shipping, Refund, Privacy, Terms, FAQ, Track order | `preview/pages/*.html` + `shopify-import/pages/` |
| Navigation, footer, favicon, checkout branding | ✅ Full menu map, 3 footer menus, logo + favicon SVG, checkout colours specified | `shopify-import/navigation.md` |
| Bundles & quantity discounts | ✅ 4 bundles priced 12–17% under components | `data.mjs` |
| Cross-sell / upsell | ✅ "Goes well with" + bundle row on every product page | product template |
| Free-shipping threshold | ✅ $35 with a live progress bar in the cart drawer | cart JS |
| Abandoned cart email | ✅ 3-email flow written to paste | `emails/02-abandoned-cart.md` |
| Welcome email with discount code | ✅ 2-email flow, code `WELCOME10` | `emails/01-welcome-discount.md` |
| Post-purchase sequence | ✅ Confirmation, dispatched, delivered + review request | `emails/03-post-purchase.md` |
| Review & photo collection | ✅ Written into the post-purchase flow; app choice flagged as your action | `emails/03` + action item #10 |
| Social share elements | ✅ Dawn's share block retained on product pages | theme `product.json` |
| SEO basics | ✅ Titles, meta descriptions, canonical, OG tags, `robots.txt`, `sitemap.xml`, alt text on 195 images | build + preview root |
| Meta & TikTok pixel placeholders | ✅ Written and **commented out** in the theme — nothing loads today | theme `layout/theme.liquid` |
| Shipping rates matched to real supplier costs | ✅ Zones/rates with the reasoning behind the $35 threshold | `shopify-import/shipping-rates.md` |
| Payment settings ready for you | ✅ Left untouched by design | action item #3 |
| Store unpublished | ✅ Nothing published; the password page stays on until you turn it off | — |

### Screenshot evidence — `05-qa/screenshots/` (27 images)

Homepage, Bestsellers, Bundles, both hero product pages, FAQ, Shipping policy and About — **each at
1440×900 desktop and 390×844 mobile** — plus cart-open and checkout-boundary states, and the mobile menu.
Raw crawl data: `05-qa/qa-results.json`.

### QA result — `05-qa/QA-REPORT.md`

**26 pages crawled, 0 issues**, after three find→fix→re-test rounds. Tests included 1,171 links checked
against the real file tree, alt text on 195 images, 14 typo/placeholder patterns, price consistency against
the data model, and **interaction assertions** (add-to-cart reads DOM state after the click, so it cannot
pass on a lucky screenshot).

Three real defects were found and fixed:
1. **`undefined` rendered as visible card copy on 17 pages** — six products were missing a data field.
2. **Emoji icons rendered as empty boxes** in the trust bar and cart — replaced with inline SVG.
3. **Fallback image placeholders looked like broken images** — redesigned as a branded graphic.

---

## 5. Launch kit

`04-launch-kit/LAUNCH-KIT.md` — for both hero products:

- **6 TikTok/Reels scripts**, each with a timed shot table (hook inside 2 seconds, problem, demo, CTA)
- **10 ad hooks**, labelled by which audience each one wins
- **2 shot lists** (22 shots total) designed to film in one afternoon once your sample arrives
- **Captions + hashtags** with master sets and per-angle variations
- **14-day organic calendar**, plus a sustainable cadence after it
- **3 ad angles with audiences**, budgets and kill criteria — **explicitly marked do-not-run-yet**
- A repurposing grid so one filming session feeds a month across five platforms

**No ads were run. No ad account was touched.**

---

## 6. Honest risks

These are the things most likely to go wrong, ranked by how much they would hurt.

| # | Risk | Severity | Why it is real | Mitigation in the build |
|---|---|---|---|---|
| 1 | **A hero product disappoints on arrival** | 🔴 High | I never saw the physical product, and aliased low-cost textiles vary by batch | Sample order (action #1) before any ad spend; return policy written to refund fast rather than fight |
| 2 | **Delivery exceeds the 7–15 day promise in Q4** | 🔴 High | Late Nov–Dec is genuinely slow for every carrier, and the store launches into it | Promise is already padded above the best observed window (3 days) and the shipping policy names Q4 explicitly |
| 3 | **Supplier price rise breaks the margin** | 🟠 Medium | Promotional pricing on these listings changes weekly | All margin math uses padded planning costs, not promo prices; re-verify before scaling ads |
| 4 | **Trade dress / image rights** | 🟠 Medium | Product photos are hot-linked from supplier listings — standard dropshipping practice, but a genuine grey area | Documented in `PRODUCT-TABLE.md`; reshoot with your own sample to remove the question entirely |
| 5 | **Trademark conflict on "Sniffari"** | 🟠 Medium | Not cleared — I had no database access | Flagged; a 10-minute USPTO check is action item #5, and renaming is a one-command rebuild |
| 6 | **Zero reviews at launch suppresses conversion** | 🟠 Medium | Honest social proof still converts worse than real proof | Honest empty state that builds trust, plus a review-request flow already wired into post-purchase |
| 7 | **Two SKUs have thin supplier evidence** | 🟡 Low-Med | Lick Mat (1 sold) and Paw Cleaner Cup (29 sold) | Flagged in the table; excluded from the hero slots; second-sourcing is on your action list |
| 8 | **Theme upload or CSV import needs a small fix** | 🟡 Low-Med | I could not test either against a live store | Validated as JSON and zipped to Shopify's spec; both steps are covered by checklists in the QA report |
| 9 | **Paying customers before you know your true delivery time** | 🟡 Low | First orders are your delivery experiment | Place the first 10 supplier orders by hand and record actual days; tighten the promise with real data |
| 10 | **Product liability in an unregulated category** | 🟢 Low | Pets chew things | Nothing electronic, ingestible, or safety-critical; every page states supervise-and-remove and "nothing is a chew toy" |

### What to test with your first real order

Everything below is a hypothesis until a real parcel moves:

1. **Actual ship-to-delivery days** — start the clock at checkout, stop it at your door. This single number
   determines whether 7–15 days is honest or optimistic, and it is the biggest driver of 1-star reviews.
2. **Packaging condition** — is it crushed? Is there a supplier invoice with your cost printed on it inside?
   (A visible invoice is a support nightmare; DSers can suppress packing slips.)
3. **Whether the product matches the listing photos** — especially the snuffle mat's fabric weight and the
   Fur Lifter's bristle roll. This is where cheap suppliers get caught.
4. **Whether the Fur Lifter actually grips your specific couch fabric** — it will fly on microfiber and
   struggle on loose-weave linen. Find out on your own sofa before you promise it to 10,000 people.
5. **The snuffle mat's wash cycle** — does it survive a machine wash without the base distorting? You claim
   machine washable; verify it before a customer does.
6. **How the cart converts at $0 ad spend** — post the 14-day calendar, then look at add-to-cart rate. If
   organic traffic converts and the product is good, ads are worth testing. If it does not, the product or
   the price is wrong and ads will only lose money faster.

---

## 7. Launch kit

See §5 and `04-launch-kit/LAUNCH-KIT.md`. Nothing is running. Nothing has been scheduled. Nothing has been
spent.

---

## 8. Suggested launch sequence

| When | Do this | Time |
|---|---|---|
| Today | Order the sample (action #1) · read the hero reviews (#2) | 30 min |
| Sample arrives | Film both heroes from the launch kit shot lists · shoot your own product photos | 1 afternoon |
| This week | Import CSV → collections → pages → policies → rates → theme → branding | ~20 min |
| Then | Trademark check (#5) · placeholders (#6) · payment details (#3) | 30 min |
| Day 1 live | Start the 14-day calendar · place your first orders by hand | 15 min/day |
| Day 14 | Review the numbers, then decide whether ads are worth testing | 30 min |
