# Set up your Sniffari store — start to finish

**Everything you need is in this folder.** Six steps, about 20 minutes of clicking, $0.
Work top to bottom; the order matters (collections need the products to exist first).

| Step | Do this | File | Time |
|---|---|---|---|
| 1 | Import the 12 products | `1-products.csv` | 3 min |
| 2 | Create 5 collections | this guide → Step 2 | 4 min |
| 3 | Create 4 pages + 4 policies | `pages/` + this guide → Step 3 | 6 min |
| 4 | Set shipping rates | this guide → Step 4 | 3 min |
| 5 | Set up navigation | this guide → Step 5 | 3 min |
| 6 | Upload the theme | `2-sniffari-dawn-theme.zip` | 3 min |

---

## Step 1 — Import the products

Admin → **Products** → **Import** → **Add file** → choose `1-products.csv` →
**Upload and preview** → check the count says **12 products** → **Import**.

This single file creates all 12 products with:

- Titles, prices and compare-at prices (the "on sale" strikethrough)
- Full descriptions: hook, benefits, specs table, shipping summary, care and safety, FAQ
- Alt text on every image, plus SEO title and meta description
- Tags that the collections in Step 2 look for
- Inventory set to **continue** with no stock tracking — deliberate, so a product never silently
  goes "sold out" when you are dropshipping and have no holding

**The 12 products it creates:**

| Product | Handle | Price |
|---|---|---|
| Snuffle Mat | `snuffle-mat` | $35.0 |
| Fur Lifter | `fur-lifter` | $25.0 |
| Slow Feeder Bowl | `slow-feeder-bowl` | $25.0 |
| Lick & Chill Mat | `lick-mat` | $22.0 |
| Self-Cleaning Brush | `slicker-brush` | $25.0 |
| Deshedding Glove | `deshedding-glove` | $18.0 |
| Paw Cleaner Cup | `paw-cleaner-cup` | $28.0 |
| Trail-Sip Bottle | `travel-water-bottle` | $25.0 |
| Calm & Clean Kit | `calm-and-clean-kit` | $50.0 |
| Shed-Control Trio | `shed-control-trio` | $60.0 |
| New Puppy Kit | `new-puppy-starter-kit` | $65.0 |
| Enrichment Duo | `enrichment-treat-duo` | $40.0 |

### ⚠️ Read this before you import — the images

Shopify does not store the image files; it **downloads them from the supplier's CDN during import**.
AliExpress normally serves images in the **AVIF** format, which Shopify's importer is unreliable
about. So I stripped the format parameter off all 37 URLs in `1-products.csv`, so they request the
plain **JPEG/PNG** version instead — the format every version of the importer accepts:

```
before:  .../S8354bb...jpg_600x600q75.jpg_.avif     ← AVIF, may be rejected
after:   .../S8354bb...jpg_600x600q75.jpg           ← JPEG, imports cleanly
```

**Do this immediately after importing:** scroll your product list and count the thumbnails. There
should be **12 products, all with images.**

**If images are missing, here is the fix ladder — go down it in order:**

1. **Re-import with `1b-products-avif-fallback.csv`** — identical products, original AVIF URLs.
   Worth trying first because it costs nothing and sometimes the AVIF path is the one that resolves.
2. **Add them by hand** — open the product, **Add image → Add from URL**, paste the links from that
   product's supplier listing (all links are in `../02-products/PRODUCT-TABLE.md`). About 30
   seconds per product.
3. **Import through DSers instead** — the free app copies images into your Shopify Files properly
   rather than hot-linking, and it is the most reliable route. This is what I would do if more than
   two or three products come through blank.

Either way, nothing else in the import depends on the images — titles, prices, descriptions, specs,
FAQs, SEO and tags all land correctly regardless.

---

## Step 2 — Create the 5 collections

The CSV already applied the tags below, so these are **automated** collections: create them once and
every future product with the right tag files itself.

Admin → **Products** → **Collections** → **Create collection** → set **Collection type: Automated**
→ condition **Product tag is equal to** the value below → **Save**. Repeat five times.

**Why smart collections:** the import CSV cannot create collections, but it *does* apply the tags each
collection needs. Create five **automated** collections once, and every future product with the right tag
files itself automatically.

Admin → **Products → Collections → Create collection** → set **Collection type: Automated** →
condition **Product tag → is equal to → (tag below)** → Save.

| Collection title | Handle | Condition type | Condition value |
|---|---|---|---|
| Bestsellers | `bestsellers` | Product tag is equal to | `Bestsellers` |
| Enrichment & Feeder Puzzles | `enrichment` | Product tag is equal to | `Enrichment & Feeder Puzzles` |
| Grooming & Shed Control | `grooming` | Product tag is equal to | `Grooming & Shed Control` |
| Paws & Walks | `cleanup` | Product tag is equal to | `Paws & Walks` |
| Value Bundles | `bundles` | Product tag is equal to | `Value Bundles` |

Then, in each collection's **Description** field, paste:

**Bestsellers**
> The three things people come back for, plus the bundles that save the most.

**Enrichment & Feeder Puzzles**
> Turn one 40-second meal into fifteen minutes of sniffing, licking and thinking.

**Grooming & Shed Control**
> For the fur that has somehow ended up inside a closed drawer.

**Paws & Walks**
> Keep the outside outside — muddy paws, shared water bowls, wet-dog floors.

**Value Bundles**
> Two or three things that fix the whole problem, priced better than buying them apart.


## Recommended collection settings

- **Sort order:** Bestsellers (or Manual for `bundles`, so you control the order).
- **Products:** leave "in stock" and availability filters **off** — dropship products may show zero stock
  at the supplier and would silently drop out of the collection.
- **Bestsellers collection:** add all 12 products via the tag, then use **Manual** sort to pin the three
  hero items to the top for the first month.
- **Image:** use the product images from the hero items; the storefront preview shows how each collection
  looks with a mixed grid.

---

## Step 3 — Pages and policies

### 3a. Four pages (paste-ready HTML)

Admin → **Online Store** → **Pages** → **Add page**. For each: set the title, then click the
**`</>` (Show HTML)** button in the editor and paste the whole file. If you paste into the normal
rich-text view instead, the formatting breaks.

| Paste this file | Page title | Handle | Add to menu? |
|---|---|---|---|
| `pages/about.html` | About Sniffari | `about` | Yes |
| `pages/contact.html` | Contact us | `contact` | Yes |
| `pages/faq.html` | Frequently asked questions | `faq` | Yes |
| `pages/track-your-order.html` | Track your order | `track-your-order` | Yes |

### 3b. Four policies — put these in Settings, NOT as pages

This matters: policies entered under **Settings → Policies** get linked automatically in the footer
*and* on the checkout page, which is where customers and card networks expect to find them. As plain
pages, they will not appear at checkout.

Open each policy in the clickable store preview (in the repo at `03-store/preview/pages/`), and copy
the text into the matching box:

| Shopify policy box | Copy from |
|---|---|
| **Refund policy** | `03-store/preview/pages/refund-policy.html` |
| **Privacy policy** | `03-store/preview/pages/privacy-policy.html` |
| **Terms of service** | `03-store/preview/pages/terms-of-service.html` |
| **Shipping policy** | `03-store/preview/pages/shipping-policy.html` |

> **⚠️ Before you save them — fill in the placeholders.** Search each one for `[` and for the word
> `placeholder`. You need to insert: your legal entity name, trading address, governing
> jurisdiction, and a real support email address (the templates currently use
> `hello@sniffari.example`). These are plain-English templates, not legal advice.

---

## Step 4 — Shipping rates

The storefront *promises* these numbers, so set them here or the promise and the checkout will
disagree — a mismatch on shipping cost is the fastest way to lose a sale at the last step.

Admin → **Settings** → **Shipping and delivery** → **Manage rates** → United States.

The prices in this file are the ones the storefront shows as promises. Set them here so the promise and
the checkout agree — a mismatch on shipping cost is the fastest route to an abandoned cart.

Admin → **Settings → Shipping and delivery → Manage rates** (US profile).

## Zone 1 — United States (default)

| Rate name | Condition | Price |
|---|---|---|
| **Free US shipping** | Order price is over $35 | $0.00 |
| **Standard US shipping** | Order price is under $35 | $4.95 |

**Transit time shown to customers:** 7–15 business days. (Add "US warehouse" as a second, faster rate only
if you actually select US-warehouse variants in DSers — promising 3–7 days and delivering 14 is worse than
promising 7–15 and delivering 9.)

**Do not enable** carrier-calculated rates at launch: you are dropshipping, so you do not have a live
carrier account and Shopify would quote rates you cannot honour.

## Zone 2 — International

Leave **off** at launch. The storefront states US-only delivery; adding international shipping before you
have a supplier who ships reliably there creates refund exposure. Add it after your first 20 US orders.

## Why the free-shipping threshold is $35

Blended cost to ship one of these items to the US is roughly $2.50–4.50. The average single-item cart is
around $22–28 (see the product table), so a $35 threshold pushes roughly half of
single-item buyers into adding the $17.99 glove or the $21.99 lick mat — which is exactly what the
"you are $X away from free shipping" bar in the cart drawer is designed to do.

## Order processing

Orders are submitted to the supplier within 1–3 business days. If you install DSers (**free plan**),
it can place supplier orders automatically — but **keep auto-order OFF for the first two weeks** and place
the first ten orders manually so you see exactly what the supplier confirms, what tracking looks like, and
how long each step really takes. Then turn automation on with real data behind it.

## Fulfilment setup reminder

Every variant in the imported CSV is set to **Inventory policy: continue** and **Inventory tracker: shopify**
with quantity 0. That is deliberate for dropshipping: it stops a product silently going "sold out" when
you have no stock holding, so you are never blocked from selling something you can still source.

---

## Step 5 — Navigation

Admin → **Online Store** → **Navigation**.

Admin → **Online Store → Navigation**.

## Main menu  (handle: `main-menu`)

| Label | Link to |
|---|---|
| Shop all | Collections → Bestsellers |
| Enrichment | Collections → Enrichment & Feeder Puzzles |
| Grooming | Collections → Grooming & Shed Control |
| Paws & walks | Collections → Paws & Walks |
| Bundles | Collections → Value Bundles |
| About | Pages → About |

> Keep it to six items. The storefront's mobile menu adds FAQ, Track your order and Contact
> automatically in the drawer — Shopify's Dawn drawer shows the same main menu, so add those three as
> children of a single "Help" item if you want them available on mobile too.

### Suggested structure with a Help submenu

```
Shop all          → /collections/bestsellers
Enrichment        → /collections/enrichment
Grooming          → /collections/grooming
Paws & walks      → /collections/cleanup
Bundles           → /collections/bundles
About             → /pages/about
Help  ▾
  ├─ FAQ                 → /pages/faq
  ├─ Track your order    → /pages/track-your-order
  ├─ Shipping policy     → Shopify policy page
  ├─ Refund policy       → Shopify policy page
  └─ Contact us          → /pages/contact
```

## Footer menu  (handle: `footer`)

Shopify has **three** footer menus (Dawn: "Footer menu", plus optional second/third). Split them like this:

**Footer menu — Shop**
| Label | Link to |
|---|---|
| Bestsellers | /collections/bestsellers |
| Enrichment | /collections/enrichment |
| Grooming | /collections/grooming |
| Paws & walks | /collections/cleanup |
| Bundles | /collections/bundles |

**Footer menu 2 — Help**
| Label | Link to |
|---|---|
| FAQ | /pages/faq |
| Track your order | /pages/track-your-order |
| Shipping policy | Policy |
| Refund policy | Policy |
| Contact us | /pages/contact |

**Footer menu 3 — Company**
| Label | Link to |
|---|---|
| About | /pages/about |
| Privacy policy | Policy |
| Terms of service | Policy |

## Checkout branding

Settings → **Checkout → Customize** (free on all plans): upload the logo, set the accent colour to
`#C0663A` and the button colour to `#16211C`. The preview storefront uses the same values so the
checkout matches the store.

---

## Step 6 — Upload the theme

Admin → **Online Store** → **Themes** → **Add theme** → **Upload zip file** →
`2-sniffari-dawn-theme.zip`.

It arrives as an **unpublished** theme, so nothing goes live until you choose to publish it. This is
a customized build of **Dawn** — Shopify's own free theme, MIT-licensed, no cost, and the fastest
theme Shopify ships.

### What is already done inside it

- 5 colour schemes mapped to the brand (cream, sand, pine, ink, clay)
- Serif headings + Inter body, sized mobile-first
- Pill buttons, 12px card radius — matches the preview exactly
- Homepage: branded hero, Bestsellers row, "why it works" columns, Enrichment row, the honest
  no-reviews-yet block, FAQ accordion, email capture
- Product pages: added *Shipping & returns*, *Care & safety* and *Where this comes from* accordion tabs
- Meta and TikTok pixel placeholders written into `layout/theme.liquid` and **commented out** —
  nothing loads or tracks until you fill in the IDs

### Three clicks Shopify will not let a file do

1. **Logo** — Settings → **Files** → upload `sniffari-logo.svg` (find it in
   `03-store/preview/assets/`). Then Customize → Header → Logo → select it, width ≈ **150px**.
2. **Favicon** — upload `sniffari-favicon.svg` the same way → Theme settings → favicon.
3. **Point the homepage sections at your collections** — in the theme editor, set the
   **Bestsellers** section to the *Bestsellers* collection and **Enrichment** to *Enrichment &
   Feeder Puzzles*. If you uploaded the theme before creating collections in Step 2, these two
   dropdowns will be empty — that is the only reason they would not just work.

Fonts are already set to **Playfair Display** (headings) and **Inter** (body), both free Shopify
library fonts. No paid fonts, no paid theme, no licence fees anywhere.

---

## After importing — verify these six things

1. **Every product has an image.** 12 products, 12 thumbnails. (See the warning in Step 1.)
2. **Prices are right.** 12 products at $17.99–$64.99, each showing a struck-through compare-at price.
3. **Open one product page.** You should see the description, a specs table, and three accordion tabs
   (*Shipping & returns*, *Care & safety*, *Where this comes from*).
4. **The homepage looks finished** — hero illustration, product rows, FAQ accordion, email signup.
5. **Footer links resolve** — FAQ, Shipping, Refund, Privacy, Terms, Track your order.
6. **Add something to the cart**, then check the free-shipping progress bar moves and the subtotal is
   correct.

If any of those fail, the cause is almost always one of these three:

| Symptom | Cause | Fix |
|---|---|---|
| Product rows are empty on the homepage | Collections do not exist yet, or the sections are not pointed at them | Redo Step 2, then set both dropdowns in the theme editor |
| Product images missing | Supplier CDN rate-limited the bulk fetch | Re-add from URL, or re-import via DSers |
| Policies do not appear at checkout | They were created as pages instead of under Settings → Policies | Move the text into Settings → Policies |

---

## After that — the non-import launch steps

These are **not** part of this folder; they are covered in `../06-final/NEEDS-YOUR-ACTION.md`:

- **Order a sample** of the two hero products (~$6–7) — you need them in hand to film the launch kit
- **Read the buyer reviews** on the two hero listings (5 minutes, free) — closes the one research gap
- **Add payment details** — Settings → Payments
- **Trademark check** on "Sniffari" — I could not clear the name
- **Fill the legal placeholders** (flagged in Step 3b)
- **Turn OFF the password page** — but only once the six checks above pass

---

*Generated 2026-10-02. If you edit prices or copy, change them in
`03-store/build/data.mjs` and re-run `node package.mjs` from `03-store/build/` so this folder and
the storefront stay in sync.*
