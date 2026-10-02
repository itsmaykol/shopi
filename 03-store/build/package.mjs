#!/usr/bin/env node
/**
 * Assembles every importable file into ONE flat folder at the repo root:  IMPORT-THESE/
 *
 * So you never have to hunt through the repo to find the four things you actually upload.
 * Everything is copied from the generated sources (never hand-edited here), and the four
 * reference docs are inlined into a single SETUP-GUIDE.md.
 *
 * Run: node package.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brand, collections, products } from "./data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE = join(__dirname, "..");
const REPO = join(STORE, "..");
const IMP = join(STORE, "shopify-import");
const OUT = join(REPO, "IMPORT-THESE");

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "pages"), { recursive: true });

const read = (p) => readFileSync(p, "utf8");
const kb = (p) => (statSync(p).size / 1024).toFixed(0) + " KB";

// ── copy the four uploadable things
copyFileSync(join(IMP, "products.csv"), join(OUT, "1-products.csv"));
copyFileSync(join(IMP, "products-avif-fallback.csv"), join(OUT, "1b-products-avif-fallback.csv"));
copyFileSync(join(STORE, "theme", "sniffari-dawn-theme.zip"), join(OUT, "2-sniffari-dawn-theme.zip"));
["about.html", "contact.html", "faq.html", "track-your-order.html"].forEach((f) =>
  copyFileSync(join(IMP, "pages", f), join(OUT, "pages", f))
);

// ── inline the four reference docs so there is one document to follow
const stripTitle = (md) => md.replace(/^#\s.*\n+/, "").trim();
const collectionsDoc = stripTitle(read(join(IMP, "collections.md")));
const navDoc = stripTitle(read(join(IMP, "navigation.md")));
const shipDoc = stripTitle(read(join(IMP, "shipping-rates.md")));

const pageCount = products.length;
const priceRow = (p) => `| ${p.short} | \`${p.handle}\` | $${p.price.toFixed(1)} |`;

const SETUP = `# Set up your Sniffari store — start to finish

**Everything you need is in this folder.** Six steps, about 20 minutes of clicking, $0.
Work top to bottom; the order matters (collections need the products to exist first).

| Step | Do this | File | Time |
|---|---|---|---|
| 1 | Import the 12 products | \`1-products.csv\` | 3 min |
| 2 | Create 5 collections | this guide → Step 2 | 4 min |
| 3 | Create 4 pages + 4 policies | \`pages/\` + this guide → Step 3 | 6 min |
| 4 | Set shipping rates | this guide → Step 4 | 3 min |
| 5 | Set up navigation | this guide → Step 5 | 3 min |
| 6 | Upload the theme | \`2-sniffari-dawn-theme.zip\` | 3 min |

---

## Step 1 — Import the products

Admin → **Products** → **Import** → **Add file** → choose \`1-products.csv\` →
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
${products.map(priceRow).join("\n")}

### ⚠️ Read this before you import — the images

Shopify does not store the image files; it **downloads them from the supplier's CDN during import**.
AliExpress normally serves images in the **AVIF** format, which Shopify's importer is unreliable
about. So I stripped the format parameter off all 37 URLs in \`1-products.csv\`, so they request the
plain **JPEG/PNG** version instead — the format every version of the importer accepts:

\`\`\`
before:  .../S8354bb...jpg_600x600q75.jpg_.avif     ← AVIF, may be rejected
after:   .../S8354bb...jpg_600x600q75.jpg           ← JPEG, imports cleanly
\`\`\`

**Do this immediately after importing:** scroll your product list and count the thumbnails. There
should be **12 products, all with images.**

**If images are missing, here is the fix ladder — go down it in order:**

1. **Re-import with \`1b-products-avif-fallback.csv\`** — identical products, original AVIF URLs.
   Worth trying first because it costs nothing and sometimes the AVIF path is the one that resolves.
2. **Add them by hand** — open the product, **Add image → Add from URL**, paste the links from that
   product's supplier listing (all links are in \`../02-products/PRODUCT-TABLE.md\`). About 30
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

${collectionsDoc}

---

## Step 3 — Pages and policies

### 3a. Four pages (paste-ready HTML)

Admin → **Online Store** → **Pages** → **Add page**. For each: set the title, then click the
**\`</>\` (Show HTML)** button in the editor and paste the whole file. If you paste into the normal
rich-text view instead, the formatting breaks.

| Paste this file | Page title | Handle | Add to menu? |
|---|---|---|---|
| \`pages/about.html\` | About Sniffari | \`about\` | Yes |
| \`pages/contact.html\` | Contact us | \`contact\` | Yes |
| \`pages/faq.html\` | Frequently asked questions | \`faq\` | Yes |
| \`pages/track-your-order.html\` | Track your order | \`track-your-order\` | Yes |

### 3b. Four policies — put these in Settings, NOT as pages

This matters: policies entered under **Settings → Policies** get linked automatically in the footer
*and* on the checkout page, which is where customers and card networks expect to find them. As plain
pages, they will not appear at checkout.

Open each policy in the clickable store preview (in the repo at \`03-store/preview/pages/\`), and copy
the text into the matching box:

| Shopify policy box | Copy from |
|---|---|
| **Refund policy** | \`03-store/preview/pages/refund-policy.html\` |
| **Privacy policy** | \`03-store/preview/pages/privacy-policy.html\` |
| **Terms of service** | \`03-store/preview/pages/terms-of-service.html\` |
| **Shipping policy** | \`03-store/preview/pages/shipping-policy.html\` |

> **⚠️ Before you save them — fill in the placeholders.** Search each one for \`[\` and for the word
> \`placeholder\`. You need to insert: your legal entity name, trading address, governing
> jurisdiction, and a real support email address (the templates currently use
> \`hello@sniffari.example\`). These are plain-English templates, not legal advice.

---

## Step 4 — Shipping rates

The storefront *promises* these numbers, so set them here or the promise and the checkout will
disagree — a mismatch on shipping cost is the fastest way to lose a sale at the last step.

Admin → **Settings** → **Shipping and delivery** → **Manage rates** → United States.

${shipDoc}

---

## Step 5 — Navigation

Admin → **Online Store** → **Navigation**.

${navDoc}

---

## Step 6 — Upload the theme

Admin → **Online Store** → **Themes** → **Add theme** → **Upload zip file** →
\`2-sniffari-dawn-theme.zip\`.

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
- Meta and TikTok pixel placeholders written into \`layout/theme.liquid\` and **commented out** —
  nothing loads or tracks until you fill in the IDs

### Three clicks Shopify will not let a file do

1. **Logo** — Settings → **Files** → upload \`sniffari-logo.svg\` (find it in
   \`03-store/preview/assets/\`). Then Customize → Header → Logo → select it, width ≈ **150px**.
2. **Favicon** — upload \`sniffari-favicon.svg\` the same way → Theme settings → favicon.
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

These are **not** part of this folder; they are covered in \`../06-final/NEEDS-YOUR-ACTION.md\`:

- **Order a sample** of the two hero products (~$6–7) — you need them in hand to film the launch kit
- **Read the buyer reviews** on the two hero listings (5 minutes, free) — closes the one research gap
- **Add payment details** — Settings → Payments
- **Trademark check** on "Sniffari" — I could not clear the name
- **Fill the legal placeholders** (flagged in Step 3b)
- **Turn OFF the password page** — but only once the six checks above pass

---

*Generated ${new Date().toISOString().slice(0, 10)}. If you edit prices or copy, change them in
\`03-store/build/data.mjs\` and re-run \`node package.mjs\` from \`03-store/build/\` so this folder and
the storefront stay in sync.*
`;

writeFileSync(join(OUT, "SETUP-GUIDE.md"), SETUP);

writeFileSync(
  join(OUT, "README.md"),
  `# IMPORT-THESE

Four files and one guide. This is everything that goes into your Shopify store.

## 👉 Open \`SETUP-GUIDE.md\` first

It walks you through all six steps in order, with everything you need to paste inlined into that one
document. About 20 minutes, start to finish.

## The files

| File | What it is | Where it goes |
|---|---|---|
| **\`1-products.csv\`** (${kb(join(OUT, "1-products.csv"))}) | All 12 products — titles, prices, descriptions, specs, FAQs, SEO, tags, **JPEG** image URLs | Admin → **Products → Import** |
| **\`1b-products-avif-fallback.csv\`** | The same 12 products with the original **AVIF** image URLs | Only if product images fail to download — see Step 1 |
| **\`2-sniffari-dawn-theme.zip\`** (${kb(join(OUT, "2-sniffari-dawn-theme.zip"))}) | Customized **Dawn** theme (free, MIT) with the brand palette, homepage and product tabs | Admin → **Online Store → Themes → Add theme → Upload zip** |
| **\`pages/\`** (4 files) | Paste-ready HTML for About, Contact, FAQ and Track your order | Admin → **Online Store → Pages** (paste in the \`</>\` HTML view) |
| **\`SETUP-GUIDE.md\`** | The full walkthrough: collections, navigation, shipping rates, placement of every file | Read it and follow along |

## Two quick warnings before you start

1. **Policies do not go in the \`pages/\` folder process.** Refund, Privacy, Terms and Shipping go into
   **Settings → Policies**, not into Pages. Put them in the wrong place and they will not appear at
   checkout, where card networks expect them. Step 3b explains it.
2. **Upload the theme *after* you create the collections** (Step 2 before Step 6), or the two
   homepage product rows will have nothing to point at. If you already uploaded it, it is a two-dropdown
   fix in the theme editor.

## Not in this folder

The emails, the 14-day content calendar, the video scripts and the pre-launch checklists live in the
repo: \`03-store/emails/\`, \`04-launch-kit/\`, and \`06-final/NEEDS-YOUR-ACTION.md\`.
`
);

console.log("✓ IMPORT-THESE/ assembled at the repo root");
for (const f of ["1-products.csv", "2-sniffari-dawn-theme.zip", "SETUP-GUIDE.md", "README.md"]) {
  console.log(`   ${kb(join(OUT, f)).padStart(8)}  ${f}`);
}
console.log(`   ${kb(join(OUT, "pages")).padStart(8)}  pages/  (4 files)`);
