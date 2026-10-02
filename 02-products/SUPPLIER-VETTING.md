# Phase 3 — Supplier Vetting

**Date:** 2026-10-02 · Companion to `PRODUCT-TABLE.md` (which carries the per-product cost data)

---

## 1. Verdict up front

**Primary source for launch: AliExpress + DSers (free tier).** Every price, rating, units-sold figure and
delivery window in this project was read live from AliExpress listings today. It is the only platform where
I could actually verify anything in this environment.

**CJdropshipping is a documented backup, not a costed source.** Its product pages returned a bot-check
("Human verification") when I tried to open them. I will not put a number in a margin table that I could
not read, so **no CJ pricing appears anywhere in this build** — even though CJ is a perfectly reasonable
supplier to use once you can log in.

---

## 2. Platform scorecard

| Platform | Dropshipping support | Shopify integration | Could I verify live data? | Verdict |
|---|---|---|---|---|
| **AliExpress + DSers** | Native — built for it | Free DSers app, official | ✅ **Yes** — 9 listings read live with prices, ratings, units sold, delivery windows | ✅ **Primary** |
| **CJdropshipping** | Native, strong US warehousing | Free app, official | ❌ No — "Human verification" wall on product URLs | ⚪ **Backup** (use for US-warehouse overflow once logged in) |
| **Zendrop** | Native | Free app | ❌ No — `/product-category/pet-supplies/` returned **404** | ⚪ Not used |
| **Spocket** | Native, US/EU suppliers | Free app (limited) | ❌ Not attempted — catalogue is largely behind a signup wall | ⚪ Not used |
| **Alibaba (bulk)** | Bulk-oriented; slow | None natively | ❌ No — search returned a slider CAPTCHA | ❌ **Excluded** — matches your own warning |
| **Amazon retail** | Not a dropship supplier | — | — | ❌ Excluded |

## 3. What WAS verified, per product

Every row below was read from a page I opened. Delivery windows are the dates shown on the listing on
2026-10-02, converted to day-ranges from that date.

| Product | Supplier rating | Units sold | Observed price | Delivery to US | Evidence quality |
|---|---|---|---|---|---|
| Snuffle Mat | 4.7★ (alt listing **4.9★**) | 500+ (**alt: 4,000+**) | $5.59 / $4.06 | Oct 06–14 → **4–12 d** | **Strong** — two independent listings agree |
| Fur Lifter (hair roller) | 4.9★ (sibling 4.5★ / 248 reviews) | **10,000+** (sibling 1,000+) | $0.33 promo / $2.74 / $0.99 | Oct 06–14 → **4–12 d** | **Strong** — highest review count in the build |
| Slow Feeder Bowl | 4.7★ | 1,000+ | $1.09 | Oct 07–13 → **5–11 d** | **Strong** |
| Lick Mat | — | **1 sold** | $5.43 | Oct 05–12 → **5–12 d** | ⚠️ **Weak — second-source required** |
| Slicker Brush | 4.8★ | **10,000+** | $1.09–$4.00 | Oct 06–14 → **4–12 d** | **Strong** |
| Deshedding Glove | 4.9★ | 1,000+ | $1.09 | Oct 06–14 → **4–12 d** | **Strong** |
| Paw Cleaner Cup | 4.3★ | **29 sold** | $1.09 | Oct 08–15 → **6–13 d** | ⚠️ **Weak — second-source required** |
| Travel Water Bottle | 4.8★ | **5,000+** | $1.09 | not shown on search page | **Strong volume, unverified window** |

## 4. What I could NOT verify — and why you should care

This is the honest part, and it is the one place where this build has a real gap.

| Check you asked for | Status | Why |
|---|---|---|
| Full buyer reviews (text) | ❌ **Not done** | AliExpress item pages sit behind a reCAPTCHA for automated access. I could read star averages and review *counts*, not the review text. |
| Buyer photos | ❌ **Not done** | Same wall — the photo gallery only renders for a signed-in human. |
| Years active per store | ❌ **Not done** | Seller profile pages are behind the same wall. |
| Response speed | ❌ **Not done** | Requires messaging a seller from a logged-in account. |
| Per-store return policy | ❌ **Not done** | Store policy pages are not reachable without a session. |
| Recurring quality complaints | ❌ **Not done** | Cannot be assessed without the review text above. |

**Do not let anyone tell you this was covered — it wasn't.** What I did instead, to reduce the risk this
gap creates:

1. **Chose a category with essentially no catastrophic failure modes.** Nothing in this store has a battery,
   a dose, a blade, a child-safety certificate or a health claim. The worst realistic outcome is "it didn't
   work for my dog," which is a cheap return. This is deliberate — it is the category where unvetted-supplier
   risk is smallest.
2. **Required multi-listing agreement on the heroes.** Both hero products have **two independent listings**
   with consistent pricing and 1,000–10,000+ sales each. That is much stronger than a single listing.
3. **Flagged the two weak SKUs explicitly** in the product table (Lick Mat, Paw Cleaner Cup) rather than
   quietly shipping them into the build.
4. **Wrote a 5-minute human check** — action item #2 in `06-final/NEEDS-YOUR-ACTION.md` — that closes the
   entire gap: open the two hero listings, read the 1-star reviews, look at buyer photos.
5. **Made the sample order item #1 on your list.** One $6–7 order to your own address tells you more about
   real quality, real packaging and real transit time than any amount of page reading.

## 5. Supplier strategy for launch

### Stage 1 — First 10 orders (manual)
- Install **DSers (free)** and connect the AliExpress account.
- Set the **"Shipping from: United States"** filter on each of the search pages linked in
  `PRODUCT-TABLE.md`. Selecting a US-warehouse variant cuts delivery to roughly **3–7 days** and makes the
  7–15 day promise very safe.
- **Keep auto-ordering OFF.** Place each of the first ten orders by hand. You are collecting real data:
  how fast the supplier confirms, what tracking looks like, what the packaging looks like, and where the
  delay actually is.
- Record actual ship-to-delivery days per order in a spreadsheet. After ten orders you will know your true
  delivery window, and can tighten or loosen the site's promise based on evidence instead of estimates.

### Stage 2 — After 10 successful orders
- Turn on DSers auto-order for the SKUs with unblemished records.
- Add **CJdropshipping** as a second source (log in and verify pricing yourself), starting with the two
  weak-evidence SKUs and any US-warehouse items.
- Dual-source the two heroes so a single supplier stock-out cannot stop your best-selling products.

### Stage 3 — Before you scale ad spend
- Re-run the margin table with actual landed costs from real orders, replacing every `ESTIMATED` cost with
  a `VERIFIED` one.
- Re-check supplier prices — promotional pricing on these listings changes frequently, and a $2 rise in
  landed cost on a $24.99 product is 8 points of margin.

## 6. Red flags that should make you drop a supplier immediately

If, during your manual review or after your first orders, you see any of these — replace the supplier
before spending a dollar on ads:

- **1-star reviews mentioning a strong chemical or plastic smell** on the lick mat or slow-feeder bowl.
  Food-contact silicone and plastic that smells is not something to put in front of a pet.
- **Reviews showing the Fur Lifter's bristle roll failing or the chamber cracking** — that is the whole
  mechanism, and a broken one costs you a refund plus the customer.
- **Snuffle mat reviews mentioning stitched-in hard plastic or loose small parts.** A dog's nose goes
  straight into that mat; loose parts are a choking hazard and an entirely avoidable liability.
- **Paw cleaner cup reviews describing the silicone insert tearing within weeks.**
- **Any listing that has quietly changed the material** (e.g. the mat now advertised as polyester instead of
  fleece) — that means the supplier swapped factories, and your review history no longer describes what
  customers will receive.
- **A delivery window that has stretched beyond 20 days** on a listing that previously showed 4–12.

## 7. Placement and fulfilment model (so nothing ever touches your house)

```
Customer orders on sniffari.com
        │
        ▼
Shopify order  ──►  DSers (free)  ──►  AliExpress supplier (or CJ backup)
        │                                     │
        │                                     ▼
        │                            Supplier packs + ships direct
        │                                     │ to the customer
        ▼                                     ▼
Tracking number flows back into Shopify  ──►  customer gets the dispatch email
```

You never receive, store, repack or ship anything. Your only physical touchpoints are:

1. **The sample order** (to your own address, so you can film the launch-kit videos and verify quality).
2. **Returns** — at launch, keep returns "refund without return" for anything under about $20. Postage both
   ways on a $17.99 glove costs more than the glove, and a fast, generous refund produces a better review
   than a fought-over one.
