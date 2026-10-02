# Needs your action

Everything I could not do, cannot do, or deliberately did not do. Ordered by how much it blocks launch.

**Nothing here has been done for you. Nothing here costs money unless it says so.**

---

## 🔴 Blockers — the store cannot take an order without these

### 1. Order a sample of the hero product (~$6–7) · 15 minutes · *costs money*
The highest-value money you will spend on this business. Order **one Snuffle Mat and one Fur Lifter** to
your own address.
- **Where:** the supplier links in `02-products/PRODUCT-TABLE.md` (they are clickable there).
- **Why it matters:** it is the only way to verify real quality, real packaging, real transit time — and
  you need the physical products in hand to film the launch-kit videos.
- **This is the one purchase I am recommending.** Everything else on this list is free or optional.

### 2. Read the buyer reviews on the two hero listings · 5 minutes · free
This closes the single biggest gap in my research (AliExpress item pages are reCAPTCHA-walled, so I could
read star averages and review counts but **not** the review text or buyer photos).
- Open both hero listings, filter to **1-star reviews**, and read them.
- Look at **buyer photos** — they show what actually arrives.
- **Reject and swap the listing if you see:** chemical/plastic smell on food-contact items, the Fur Lifter's
  bristle roll or chamber failing, or loose hard parts stitched into the snuffle mat.
- Second-source the two flagged SKUs (Lick Mat, Paw Cleaner Cup) while you are there — both have
  alternatives on the same search pages I linked.

### 3. Add your payment details · 10 minutes · free to set up
Settings → **Payments**. I deliberately left this untouched — I cannot and will not handle card or bank
details. Shopify Payments or PayPal both work. **No plan upgrade is needed to configure this.**

### 4. Run a real tax check · 15 minutes · free
Settings → **Taxes**. Shopify's US tax calculation is plan-dependent; confirm whether your plan auto-calculates
or whether you need to set rates manually for your state. This is compliance, not profit — do not skip it.

---

## 🟠 Required before you turn the password page off

### 5. Do a trademark sanity check on "Sniffari" · 10 minutes · free
I could not run a formal search — USPTO/EUIPO databases block automated access, and a web search is not
clearance. **My check was weak evidence and I am flagging it as such.**
- Search **USPTO TESS** for "Sniffari" in classes **31** (pet food), **20/21/28** (pet accessories/toys).
- Check the `.com`, `.co` domains and the Instagram/TikTok handles.
- **If it is taken**, the store rebuilds in one command: change `name` in `03-store/build/data.mjs` and
  re-run the three build scripts. Backup names in `03-store/BRAND.md`.

### 6. Fill the bracketed placeholders in the legal pages · 15 minutes · free
Search the pasted text for `[` and for the word `placeholder`:
- **Terms of service:** legal entity name, trading address, jurisdiction/governing law
- **Privacy policy:** your support email
- **About page:** the same
- **Contact page:** replace `hello@sniffari.example` with a real address you actually monitor

> These are good-faith plain-English templates, **not legal advice**. If you are selling into California or
> the EU, have someone review them for CCPA/GDPR.

### 7. Three theme clicks Shopify does not let a file do · 5 minutes · free
1. Settings → **Files** → upload `sniffari-logo.svg` (in `03-store/preview/assets/`), then Customize →
   Header → Logo. Set width to ~150px.
2. Upload `sniffari-favicon.svg` the same way → Theme settings → favicon.
3. In the theme editor, point the homepage **Bestsellers** and **Enrichment** sections at the two
   collections you create on import.

### 8. Set shipping rates from `shipping-rates.md` · 5 minutes · free
Settings → Shipping and delivery → Manage rates. Two rates for the US: free over $35, $4.95 under it.
**Do not enable carrier-calculated rates** — you have no carrier account and Shopify would quote prices
you cannot honour.

---

## 🟡 Do these in your first week of trading

### 9. Place your first 10 supplier orders by hand · ~20 minutes total · free
Install **DSers (free plan)** and connect AliExpress. **Keep auto-ordering OFF** for the first ten orders.
You are collecting the data that replaces every `ESTIMATED` number in the product table: real confirmation
times, real tracking behaviour, real delivery days. After ten orders, turn automation on with evidence.

### 10. Pick one free review app · 10 minutes · free
Options with genuine free tiers: **Judge.me (free plan)**, **Loox** (trial), or Shopify's own product
reviews. The post-purchase email flow in `03-store/emails/03-post-purchase.md` is already written to ask for
a review and a photo — it just needs somewhere for those to land.

> ⚠️ **Do not enable any app's "auto-generate reviews" or "review importer" feature.** Several review apps
> ship with demo data. Publishing invented reviews would break your own rule *and* US law (FTC rules on
> deceptive reviews since 2024). Delete sample reviews if an app installs them.

### 11. Set up the 4 email flows · 30 minutes · free
Copy from `03-store/emails/`. Abandoned cart alone typically pays for the effort in the first month.
Check what your Shopify plan includes — the free/trial tiers have monthly email send limits.

### 12. Fire the pixels — but only when you are ready to advertise · 10 minutes · free
Meta and TikTok pixel placeholders are already written into the theme
(`layout/theme.liquid`) **and commented out** — nothing loads and nothing tracks today.
Set the IDs, uncomment, and verify with each platform's own test tool. **Do not install them before you
have a privacy policy live** (you do) and **do not run ads until you have organic proof** (see the launch kit).

---

## 💰 Money — you do not need any of it to launch

Everything below is genuinely optional. **The store works at $0.**

| Item | Cost | My recommendation |
|---|---|---|
| **Domain** (`sniffari.com`) | ~$10–15/yr | Nice, not required. A free `*.myshopify.com` URL works while you validate. Buy it once you have your first sale. |
| **Shopify plan** | ~$29–39/mo after trial | You need *a* plan to sell. Use the free trial as long as possible; **do not upgrade to a higher tier for features you have not yet used.** |
| **Paid theme** | $180–400 | ❌ **Skip entirely** — the customized free Dawn build already ships in this repo. |
| **Paid apps** (upsells, bundles) | $10–30/mo | ❌ Skip. Bundles, cross-sell and quantity breaks in this build are hand-coded into the product/collection structure and cost nothing. |
| **Paid ads** | Any amount | ❌ **Not yet.** Post organically first — the launch kit has 14 days of content ready. Run ads only after you have a real review and a real delivery-time number. |
| **Sample order** | ~$6–7 | ✅ **Yes.** Item #1. |

**Total required additional spend to launch: $0** (beyond whatever Shopify plan you choose).

---

## 🚫 Things I deliberately did NOT do

| Not done | Why | Your move |
|---|---|---|
| **Published the store** | Your explicit rule, and I have no admin access | Turn off the password page when items 1–8 are done — not before |
| **Removed the password page** | Same | Same |
| **Placed any order** | Your rule against spending money | Item #1 — the one order I *recommend* |
| **Sent any email campaign** | Your rule | Nothing is queued anywhere; the flows are files to paste |
| **Entered payment details** | Cannot and will not handle card/bank data | Item #3 |
| **Bought a domain** | Your rule | Optional; see the money table |
| **Started any subscription or trial** | Your rule | Choose your Shopify plan yourself |
| **Published fake reviews or scarcity timers** | Your rule, and illegal/misleading under US rules | Real reviews via item #10 |
| **Used branded or trademarked products** | Your rule | Everything is unbranded/generic |
| **Made any health claim** | Your rule | Copy stays on "enrichment" and "grooming" — nothing treats or cures anything |
| **Promised faster shipping than reality** | Accuracy | Store says 7–15 days while suppliers show 3–13 — deliberately under-promised |
| **Quoted a supplier price as a cost basis** | $0.33 and $1.09 are new-buyer loss-leaders, not real unit costs | Margin math uses padded planning costs instead |

---

## ⚠️ One thing I could not verify at all, stated plainly

I **could not** log into your Shopify admin, use a browser session, read TikTok Creative Center, the Meta Ad
Library, or Google Trends, open Alibaba or CJ Dropshipping product pages, or run Shopify CLI. There is no
browser, no MCP server, and no Shopify credentials in this environment.

**So the store was built as importable files instead of admin clicks.** That is why there are two paths to
launch in this repo — a 20-minute import path, and a full clickable preview of the destination. The honest
consequence: **I have never seen this theme running inside a real Shopify store**, so the theme upload and
the import are the two steps most likely to need a small fix. Both are covered by the checklists above, and
the QA report lists exactly what remains untested.

If any of those tools become available — a Shopify MCP server, or a browser session — say the word and I will
complete the import, set the collections, and QA the live store directly instead of handing you files.
