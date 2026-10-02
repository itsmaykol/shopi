#!/usr/bin/env node
/**
 * Generates the Shopify handoff package from the same data model as the storefront:
 *
 *   03-store/shopify-import/products.csv     → Admin → Products → Import (official Shopify CSV format)
 *   03-store/shopify-import/pages/*.html     → paste-ready HTML for each required page
 *   03-store/shopify-import/collections.md   → smart-collection setup (uses the tags in the CSV)
 *   03-store/shopify-import/navigation.md    → main menu + footer menu maps
 *   03-store/shopify-import/shipping-rates.md→ shipping zones/rates to enter
 *   03-store/emails/*.md                     → the 4 free email flows
 *
 * Run: node handoff.mjs
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { brand, collections, products } from "./data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const IMP = join(ROOT, "shopify-import");
const EMAILS = join(ROOT, "emails");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// HARD GUARD: Shopify tag conditions match on an exact tag string, and a comma inside a tag makes
// the CSV split it into two tags — which silently produces an automated collection that matches
// nothing. Fail the build loudly instead of shipping a dead collection.
for (const c of collections) {
  if (c.title.includes(",")) {
    throw new Error(
      `Collection title "${c.title}" contains a comma. Shopify tags cannot contain commas — ` +
        `the CSV import will split it and the automated collection will match zero products. ` +
        `Rename the collection in data.mjs.`
    );
  }
}
const money = (n) => n.toFixed(2);

// ── CSV helpers
const cell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (arr) => arr.map(cell).join(",");

const bodyHtml = (p) => `<p><strong>${esc(p.hook)}</strong></p>
<p>${esc(p.intro)}</p>
<h3>What it actually does</h3>
<ul>
${p.bullets.map((b) => `  <li>${esc(b)}</li>`).join("\n")}
</ul>
<h3>Specs</h3>
<table>
  <tbody>
${p.specs.map(([k, v]) => `    <tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join("\n")}
  </tbody>
</table>
<h3>Shipping &amp; returns</h3>
<p>Ships from our supplier partner directly to you. Most US orders arrive in <strong>7–15 days</strong> with
tracking. Free US shipping over $${brand.freeShipThreshold}. Returns accepted within 30 days of delivery on
unused, unwashed items — see our refund policy.</p>
<h3>Care &amp; safety</h3>
<p>Supervise use. This is not a chew toy and it is not indestructible. Wash per the specs above and replace
if torn. Nothing here is medical advice or a treatment for any condition.</p>
<h3>Questions</h3>
${p.faq.map(([q, a]) => `<p><strong>${esc(q)}</strong><br>${esc(a)}</p>`).join("\n")}`;

// ── products.csv (official Shopify product import format)
//
// IMAGE FORMAT NOTE (this matters — read it):
// AliExpress serves images with an on-the-fly format parameter, e.g.
//   .../S8354...jpg_600x600q75.jpg_.avif
// The trailing `_.avif` asks the CDN for AVIF (so does the `_` before it). Shopify's "download image from URL" importer is
// stricter about formats than the admin uploader, so we strip that suffix to request the plain
// JPEG variant, which every version of the importer accepts:
//   .../S8354...jpg_600x600q75.jpg
// If the JPEG variant 404s for any file, the fallback CSV (products-avif-fallback.csv) uses the
// original URLs verbatim.
const toJpegVariant = (u) => u.replace(/_?\.avif$/, "");
const HEAD = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option2 Name",
  "Option2 Value",
  "Option3 Name",
  "Option3 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Variant Barcode",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Gift Card",
  "SEO Title",
  "SEO Description",
  "Google Shopping / Google Product Category",
  "Google Shopping / Gender",
  "Google Shopping / Age Group",
  "Google Shopping / MPN",
  "Google Shopping / AdWords Grouping",
  "Google Shopping / AdWords Labels",
  "Google Shopping / Condition",
  "Google Shopping / Custom Product",
  "Google Shopping / Custom Label 0",
  "Google Shopping / Custom Label 1",
  "Google Shopping / Custom Label 2",
  "Google Shopping / Custom Label 3",
  "Google Shopping / Custom Label 4",
  "Variant Image",
  "Variant Weight Unit",
  "Variant Tax Code",
  "Cost per item",
  "Included / United States",
  "Price / United States",
  "Compare At Price / United States",
  "Included / International",
  "Price / International",
  "Compare At Price / International",
  "Status",
];

const CATEGORY = "Animals & Pet Supplies > Pet Supplies";
// NOTE: the badge "Bestseller" is renamed to "Hero product" as a tag, so the admin does not end up
// with both "Bestseller" and "Bestsellers" tags (the latter is a collection title and must stay exact).
const tagsFor = (p) =>
  [
    ...p.collections.map((c) => (collections.find((x) => x.handle === c) || {}).title),
    p.badge ? (p.badge.split("·")[0].trim() === "Bestseller" ? "Hero product" : p.badge.split("·")[0].trim()) : null,
    "Free shipping eligible",
    p.collections.includes("bundles") ? "Bundle" : "Single item",
  ]
    .filter(Boolean)
    .join(", ");

const gramsFor = (p) => {
  const m = JSON.stringify(p.specs).match(/(\d+)\s*g\b/);
  if (m) return Number(m[1]);
  return p.collections.includes("bundles") ? 600 : 250; // sensible default, editable in Shopify
};

const buildCsv = (imgTransform) => {
  const lines = [row(HEAD)];

products.forEach((p) => {
  const base = new Array(HEAD.length).fill("");
  const set = (name, v) => {
    const i = HEAD.indexOf(name);
    if (i >= 0) base[i] = v;
  };

  // first row = product + first variant + first image
  set("Handle", p.handle);
  set("Title", p.title);
  set("Body (HTML)", bodyHtml(p));
  set("Vendor", brand.name);
  set("Product Category", CATEGORY);
  set("Type", (collections.find((c) => c.handle === p.collections[0]) || {}).title || "Pet supplies");
  set("Tags", tagsFor(p));
  set("Published", "TRUE");
  set("Option1 Name", "Title");
  set("Option1 Value", "Default Title");
  set("Variant SKU", "SNF-" + p.handle.toUpperCase().replace(/-/g, "").slice(0, 12));
  set("Variant Grams", gramsFor(p));
  set("Variant Inventory Tracker", "shopify");
  set("Variant Inventory Qty", 0);
  set("Variant Inventory Policy", "continue"); // never oversell-block; we dropship
  set("Variant Fulfillment Service", "manual");
  set("Variant Price", money(p.price));
  set("Variant Compare At Price", money(p.compareAt));
  set("Variant Requires Shipping", "TRUE");
  set("Variant Taxable", "TRUE");
  set("Image Src", imgTransform(p.images[0]));
  set("Image Position", 1);
  set("Image Alt Text", p.title);
  set("Gift Card", "FALSE");
  set("SEO Title", p.title.slice(0, 65));
  set("SEO Description", `${p.hook} ${p.bullets[0]}`.slice(0, 155));
  set("Google Shopping / Condition", "new");
  set("Variant Weight Unit", "g");
  set("Status", "active"); // store stays password-protected until you approve launch
  lines.push(row(base));

  // additional images
  for (let i = 1; i < p.images.length; i++) {
    const im = new Array(HEAD.length).fill("");
    im[HEAD.indexOf("Handle")] = p.handle;
    im[HEAD.indexOf("Image Src")] = imgTransform(p.images[i]);
    im[HEAD.indexOf("Image Position")] = i + 1;
    im[HEAD.indexOf("Image Alt Text")] = `${p.title} — image ${i + 1}`;
    lines.push(row(im));
  }
});

  return lines;
};

const lines = buildCsv(toJpegVariant);          // primary: plain JPEG URLs
const linesAvif = buildCsv((u) => u);           // fallback: original AVIF URLs

// ── write everything
if (existsSync(IMP)) rmSync(IMP, { recursive: true, force: true });
mkdirSync(join(IMP, "pages"), { recursive: true });
mkdirSync(EMAILS, { recursive: true });

writeFileSync(join(IMP, "products.csv"), lines.join("\n") + "\n");
writeFileSync(join(IMP, "products-avif-fallback.csv"), linesAvif.join("\n") + "\n");

/**
 * Page HTML. Shopify's rich-text editor accepts pasted HTML; these are deliberately simple
 * (headings, paragraphs, lists, tables) so nothing gets stripped on paste.
 */
const pageHtml = (title, blocks) => `<!-- ${title} — paste into Shopify: Online Store → Pages → Add page → Show HTML (</>) -->
<h2>${esc(title)}</h2>
${blocks}`;

const li = (arr) => `<ul>\n${arr.map((x) => `  <li>${x}</li>`).join("\n")}\n</ul>`;

const PAGES = {
  "about": {
    title: "About Sniffari",
    seoTitle: "About Sniffari — why we only sell the unglamorous stuff",
    seoDesc:
      "Enrichment and everyday-care products for indoor pets. How we choose products, and what we refuse to do.",
    html: pageHtml("About Sniffari", `
<p><strong>We sell the small, unglamorous things that make living with an indoor pet easier.</strong></p>
<p>Most pet stores sell you the fun stuff: a toy shaped like a taco, a bed in the shape of a donut. Meanwhile
the two things that actually change daily life — a bored animal and a house covered in fur — get nothing.</p>
<p>Sniffari stocks only the unglamorous jobs:</p>
${li([
  "<strong>Boredom.</strong> Snuffle mats, lick mats and slow feeders that turn a meal into a job.",
  "<strong>Fur.</strong> A roller, a slicker brush and a glove that between them handle almost all shedding.",
  "<strong>The outside coming inside.</strong> A paw cleaner cup and a leakproof walk bottle.",
])}
<h3>How we choose products</h3>
<ol>
  <li><strong>It solves something specific.</strong> If we cannot describe the problem in one sentence, it does not go in.</li>
  <li><strong>It demos in fifteen seconds.</strong> If it is not obvious on camera, we cannot show you why it is worth buying.</li>
  <li><strong>It costs 3× less than it sells for.</strong> Otherwise shipping and returns eat the business and the price goes up.</li>
  <li><strong>It is small, light and hard to break.</strong> Nothing fragile, nothing heavy, nothing with a battery that can fail.</li>
  <li><strong>It has real supplier feedback.</strong> We print the supplier's rating and units sold on the product page, so you see what we saw.</li>
</ol>
<h3>What we refuse to do</h3>
${li([
  "<strong>No fake reviews.</strong> Not one. The review section says so out loud until real reviews exist.",
  "<strong>No fake urgency.</strong> No countdown timers, no “only 3 left”, no “17 people are looking at this”.",
  "<strong>No health claims.</strong> Nothing here treats, cures or prevents anything.",
  "<strong>No invented shipping times.</strong> We quote 7–15 days because that is what the carriers actually do.",
  "<strong>No branded or knock-off goods.</strong> Everything is unbranded, generic and legally clean.",
])}
<h3>How the money works</h3>
<p>We do not hold stock. When you order, our supplier partner packs and ships your item directly, which is
why delivery takes 7–15 days instead of two, and why prices are what they are. It also means we only make
money if the product is good enough that you do not return it — which is a decent incentive.</p>
<h3>Where we are</h3>
<p>Sniffari is a small independent store. Questions, problems, or a product you think we should stock:
<a href="/pages/contact">contact us</a> — a human answers, usually within one business day.</p>`),
  },

  "contact": {
    title: "Contact us",
    seoTitle: "Contact Sniffari — order help, returns and suggestions",
    seoDesc: "A human reads every message. Include your order number for the fastest reply.",
    html: pageHtml("Contact us", `
<p><strong>A human reads every message. Usually a reply within one business day.</strong></p>
<h3>Order &amp; delivery questions</h3>
<p>Include your order number (it starts with #SN) and the email you used.</p>
<h3>Returns</h3>
<p>Tell us the order number and what went wrong. Refunds follow our <a href="/policies/refund-policy">refund policy</a>.</p>
<h3>Product suggestions</h3>
<p>Tell us the problem you are trying to solve, not the product. We source from problems.</p>
<p><em>Replace this block with your live contact form (Shopify's built-in contact form works) and your real
support email address.</em></p>
<p><strong>Support hours:</strong> Monday to Friday, 9am–5pm. We do not operate a phone line; email keeps
everything in writing, which protects you on returns.</p>`),
  },

  "faq": {
    title: "Frequently asked questions",
    seoTitle: "FAQ — shipping times, returns and product safety",
    seoDesc: "Honest answers on 7–15 day US delivery, free shipping over $35, 30-day returns and product safety.",
    html: pageHtml("Frequently asked questions", `
<p><strong>Short answers, no small print games — including the ones that cost us sales.</strong></p>
<h3>Ordering &amp; payment</h3>
<p><strong>What payment methods do you take?</strong><br>Card payments and the usual wallets are handled by our
checkout provider. We never see or store your card details.</p>
<p><strong>Do you charge sales tax?</strong><br>Sales tax is calculated at checkout based on your delivery
address, wherever it applies.</p>
<p><strong>Can I change or cancel my order?</strong><br>If it has not been dispatched yet, yes — email us with
your order number as soon as you can.</p>
<p><strong>Is there a discount code?</strong><br>New customers get 10% off for joining the email list. Bundles
are already discounted 12–17%.</p>
<h3>Shipping</h3>
<p><strong>How long will my order take?</strong><br>Most US orders arrive in 7–15 days. Every order gets
tracking by email when it dispatches.</p>
<p><strong>Why does it take longer than Amazon?</strong><br>We do not hold stock. Your item is packed and
shipped by our supplier partner, which keeps prices low and means we never charge you for guessed-at inventory.</p>
<p><strong>What does shipping cost?</strong><br>Free over $35. Below that it is a flat $4.95 in the US.</p>
<p><strong>My tracking has not updated.</strong><br>That is normal on international legs — tracking often
pauses between handover points. If it has been over 15 business days with no movement, contact us.</p>
<h3>Returns &amp; problems</h3>
<p><strong>What if it arrives damaged or wrong?</strong><br>Send a photo with your order number within 7 days.
We replace or refund in full, including shipping.</p>
<p><strong>What if my pet just does not like it?</strong><br>Return it unused and unwashed within 30 days of
delivery for a refund of the item price.</p>
<p><strong>How long do refunds take?</strong><br>We process refunds within 2 business days; your bank then takes
5–10 business days to post it.</p>
<h3>The products</h3>
<p><strong>Are any of these safe to leave with a pet unattended?</strong><br>No. Supervise, then put them away.
They are feeding tools, not chew toys, and none are indestructible.</p>
<p><strong>Do any products need batteries or an app?</strong><br>No. No electronics, no subscriptions, ever.</p>
<p><strong>Are these vet-approved or do they treat anything?</strong><br>No, and we will never claim that. They
are enrichment and grooming accessories. For a diagnosed condition, talk to your vet.</p>
<p><strong>How do I clean them?</strong><br>Exact care instructions are in the specs table on each product page.</p>`),
  },

  "track-your-order": {
    title: "Track your order",
    seoTitle: "Track your order — Sniffari",
    seoDesc: "Track your Sniffari parcel and see the typical delivery timeline for US orders.",
    html: pageHtml("Track your order", `
<p><strong>Enter the order number from your confirmation email (it looks like #SN1042).</strong></p>
<p><em>Install the free Shopify “Order status” / “Track your order” feature here, or paste your carrier tracking
widget. Shopify's free order-status page link is included automatically in every notification email.</em></p>
<h3>Typical timeline for a US order</h3>
<table>
  <tbody>
    <tr><td><strong>Day 0</strong></td><td>Order placed, confirmation email sent</td></tr>
    <tr><td><strong>Day 1–3</strong></td><td>Packed and submitted to the carrier</td></tr>
    <tr><td><strong>Day 3–15</strong></td><td>In transit, tracking updates at handover points</td></tr>
    <tr><td><strong>Day 7–15</strong></td><td>Delivered for most US orders</td></tr>
  </tbody>
</table>
<p>During the last week of November and the first three weeks of December, add about 5–7 days. Peak season is
genuinely slower everywhere, and it is better to plan for it.</p>
<p>No movement for more than 15 business days? <a href="/pages/contact">Contact us</a> and we will chase it,
then reship or refund under our <a href="/policies/refund-policy">refund policy</a>.</p>`),
  },
};

Object.entries(PAGES).forEach(([slug, p]) => {
  writeFileSync(join(IMP, "pages", `${slug}.html`), p.html + "\n");
});

writeFileSync(
  join(IMP, "pages", "_PAGE-SETUP.md"),
  `# Pages to create in Shopify

Admin → **Online Store → Pages → Add page**. For each one: set the title, paste the HTML in the
*Show HTML* (\`</>\`) view, then set the SEO fields from the table below.

| Page title | Paste this file | Suggested handle | Add to footer? |
|---|---|---|---|
| About Sniffari | \`pages/about.html\` | \`about\` | Yes |
| Contact us | \`pages/contact.html\` | \`contact\` | Yes |
| Frequently asked questions | \`pages/faq.html\` | \`faq\` | Yes |
| Track your order | \`pages/track-your-order.html\` | \`track-your-order\` | Yes |

**The four legal pages are already written into the storefront at \`/policies/...\`** — Shopify generates
these from **Settings → Policies** (Refund, Privacy, Terms of service, Shipping). Copy the text from the
live preview pages into those four policy boxes rather than creating them as pages; that way Shopify
links them automatically in the footer and at checkout, which is where customers and card networks
expect to find them:

| Shopify policy | Copy from the preview page |
|---|---|
| **Refund policy** | \`/pages/refund-policy.html\` |
| **Privacy policy** | \`/pages/privacy-policy.html\` |
| **Terms of service** | \`/pages/terms-of-service.html\` |
| **Shipping policy** | \`/pages/shipping-policy.html\` |

> ⚠️ **Before you publish:** fill the bracketed placeholders in the Privacy Policy, Terms of Service and
> About page (legal entity name, address, jurisdiction, support email). Search the pasted text for
> \`[\` and for \`placeholder\`.
`
);

// ── collections
writeFileSync(
  join(IMP, "collections.md"),
  `# Collections

**Why smart collections:** the import CSV cannot create collections, but it *does* apply the tags each
collection needs. Create five **automated** collections once, and every future product with the right tag
files itself automatically.

Admin → **Products → Collections → Create collection** → set **Collection type: Automated** →
condition **Product tag → is equal to → (tag below)** → Save.

| Collection title | Handle | Condition type | Condition value |
|---|---|---|---|
${collections
  .map((c) => `| ${c.title} | \`${c.handle}\` | Product tag is equal to | \`${c.title}\` |`)
  .join("\n")}

Then, in each collection's **Description** field, paste:

${collections
  .map(
    (c) => `**${c.title}**
> ${c.blurb}
`
  )
  .join("\n")}

## Recommended collection settings

- **Sort order:** Bestsellers (or Manual for \`bundles\`, so you control the order).
- **Products:** leave "in stock" and availability filters **off** — dropship products may show zero stock
  at the supplier and would silently drop out of the collection.
- **Bestsellers collection:** add all 12 products via the tag, then use **Manual** sort to pin the three
  hero items to the top for the first month.
- **Image:** use the product images from the hero items; the storefront preview shows how each collection
  looks with a mixed grid.
`
);

// ── navigation
writeFileSync(
  join(IMP, "navigation.md"),
  `# Navigation

Admin → **Online Store → Navigation**.

## Main menu  (handle: \`main-menu\`)

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

\`\`\`
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
\`\`\`

## Footer menu  (handle: \`footer\`)

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
\`#C0663A\` and the button colour to \`#16211C\`. The preview storefront uses the same values so the
checkout matches the store.
`
);

// ── shipping rates
writeFileSync(
  join(IMP, "shipping-rates.md"),
  `# Shipping rates & zones

The prices in this file are the ones the storefront shows as promises. Set them here so the promise and
the checkout agree — a mismatch on shipping cost is the fastest route to an abandoned cart.

Admin → **Settings → Shipping and delivery → Manage rates** (US profile).

## Zone 1 — United States (default)

| Rate name | Condition | Price |
|---|---|---|
| **Free US shipping** | Order price is over $${brand.freeShipThreshold} | $0.00 |
| **Standard US shipping** | Order price is under $${brand.freeShipThreshold} | $${brand.flatShipping.toFixed(2)} |

**Transit time shown to customers:** 7–15 business days. (Add "US warehouse" as a second, faster rate only
if you actually select US-warehouse variants in DSers — promising 3–7 days and delivering 14 is worse than
promising 7–15 and delivering 9.)

**Do not enable** carrier-calculated rates at launch: you are dropshipping, so you do not have a live
carrier account and Shopify would quote rates you cannot honour.

## Zone 2 — International

Leave **off** at launch. The storefront states US-only delivery; adding international shipping before you
have a supplier who ships reliably there creates refund exposure. Add it after your first 20 US orders.

## Why the free-shipping threshold is $${brand.freeShipThreshold}

Blended cost to ship one of these items to the US is roughly $2.50–4.50. The average single-item cart is
around $22–28 (see the product table), so a $${brand.freeShipThreshold} threshold pushes roughly half of
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
`
);

// ── emails
const emailShell = (title, body) => `# ${title}

**Where this goes:** Shopify → Settings → Notifications (transactional) or Shopify Email / Shopify Messaging
(app, free tier) for the flows. Copy is written to be pasted as-is; keep the tone, drop the \`[brackets]\`.

---
${body}`;

writeFileSync(
  join(EMAILS, "01-welcome-discount.md"),
  emailShell(
    "Welcome + 10% discount code",
    `**Trigger:** customer joins the email list (footer or homepage form).
**Subject line A:** Your 10% code is inside
**Subject line B:** Here's 10% off — plus the one thing most pet owners get wrong
**Preview text:** Valid for 14 days. No catch, no minimum.

Hi [First name],

Here is your 10% off code:

## **WELCOME10**

It works on everything, stacks with the bundle discounts, and lasts 14 days.

While you are here — the thing most people get wrong is buying a toy when their pet is *bored*. A bored
dog does not need another squeaky hedgehog. It needs a job. Fifteen minutes of nose work does more for a
restless indoor dog than a thirty-minute march around the block.

**If you only buy one thing, make it this:** the [Snuffle Mat →] — it turns a 90-second dinner into twelve
minutes of sniffing, and it is the product people come back to tell us about.

Or start with a bundle and save 12–17%:
- [Calm & Clean Kit →] — snuffle mat + lick mat, $49.99
- [Shed-Control Trio →] — the entire shedding problem, $59.99

[Shop bestsellers →]

Shipping is free over $${brand.freeShipThreshold}, and most US orders arrive in 7–15 days with tracking.
We will tell you exactly where your parcel is the whole way.

— The Sniffari team

*You are getting this because you signed up on our site. [Unsubscribe] any time.*

---
**Notes for the build:** two emails in this flow. This is email 1. Email 2 (send 36 hours later, only to
people who have not ordered) should be a single hero product with a 15-second video demo — the snuffle mat
is the right one — and nothing else. Do not add a discount to email 2; the first code already did that job.`
  )
);

writeFileSync(
  join(EMAILS, "02-abandoned-cart.md"),
  emailShell(
    "Abandoned cart (3 emails)",
    `**Trigger:** checkout started, no order. Free in Shopify: Shopify Email / Shopify Messaging has a
built-in abandoned-cart automation. Turn it on — it is usually the highest-revenue email a new store has.

### Email 1 — 1 hour after abandonment
**Subject:** You left something behind
**Preview:** Still in your cart — and here is what shipping looks like.

Hi [First name],

Your cart is still here:

[Cart contents with images and prices]

**What happens next, honestly:** most US orders arrive in 7–15 days, tracked from the moment it leaves.
Free shipping over $${brand.freeShipThreshold}. Returns accepted within 30 days if it is unused.

[Finish checkout →]

No pressure, no fake countdown. If you have a question about which one suits your pet, reply to this
email and a human will answer.

### Email 2 — 24 hours after abandonment
**Subject:** The one question people ask before buying a snuffle mat
**Preview:** "Will my dog actually use it?" — short answer: yes, here's how to introduce it.

Hi [First name],

The most common question we get is whether a pet will actually use an enrichment mat.

They will — but the introduction matters. For the first three days, scatter a shallow layer of food
across the top instead of loading the folds. Let them win easily. Then start burying it deeper. By day
four, dinner takes twelve minutes instead of ninety seconds, and your dog is asleep by 8pm instead of
pacing the hallway.

[Finish checkout →]

### Email 3 — 72 hours after abandonment
**Subject:** Last nudge (we mean it)
**Preview:** We'll stop mentioning it after this one.

Hi [First name],

This is the last email about your cart — we are not going to chase you for a week.

If you have decided against it, no problem at all. If something is holding you up — sizing, shipping
time, which product fits your pet — reply and ask. That is genuinely why the address exists.

[Finish checkout →]

**Notes for the build:** do not add a discount to this flow. Discounting an abandoned cart teaches people
to abandon carts. The single biggest lever here is honest shipping information up front, because that is
what makes people hesitate on a store like this.`
  )
);

writeFileSync(
  join(EMAILS, "03-post-purchase.md"),
  emailShell(
    "Post-purchase (order confirmation + delivery + care)",
    `**Trigger:** order placed → dispatched → delivered.

### Order confirmation (immediately)
**Subject:** Order [order number] confirmed — here's exactly what happens next
**Preview:** We will email you again the moment it ships.

Hi [First name],

Thanks — your order is in.

**Here is the honest timeline:**
1. **Today–3 days:** we send your order to our supplier partner.
2. **Day 1–3:** it is packed and handed to the carrier. You get a tracking number by email.
3. **Day 7–15:** it arrives. Tracking can pause for a few days during international handover — that is
   normal and not a lost parcel.

**One thing that makes setup easier:** for the first three days, scatter food shallowly on the snuffle mat
rather than loading the folds. Let them win. Then start burying it deeper.

[View your order →]

Any problem at all, reply to this email with your order number. A human reads it.

### Dispatched
**Subject:** Your Sniffari order is on the way
**Preview:** Tracking inside — plus what to expect from the tracking updates.

Hi [First name],

Your order has left. Tracking: [tracking number]

**A note on tracking:** on international legs it often shows no movement for several days between handover
points. That is normal. If it has been more than 15 business days with no movement, reply to this email and
we will chase it — and reship or refund if it is genuinely lost.

### Delivered + 7 days (care & review request)
**Subject:** Did it work for [pet name]?
**Preview:** Two care notes, and one honest ask.

Hi [First name],

Your order arrived a week ago, so three things:

**1. Care.** Snuffle mats and lick mats go in the machine or dishwasher — see the specs table on the product
page. Give them a shake first, and always air dry the snuffle mat flat rather than tumble drying it.

**2. Supervise.** None of these are chew toys. If your pet starts treating fabric as a toy, take it away and
try again when they are calmer.

**3. An honest ask.** We are a new store with no reviews yet, and we would rather show real ones from real
customers than invent them. If the product worked, a one-line review and a photo helps enormously — and
it helps the next person decide honestly. If it did not work, reply instead and tell us; we would rather
fix or refund it than have you quietly disappointed.

[Leave a review →]

**Notes for the build:** review collection needs a free app (Judge.me Free, Loox trial, or Shopify's own
product reviews). See NEEDS-YOUR-ACTION for the choice.`
  )
);

writeFileSync(
  join(EMAILS, "04-browse-and-winback.md"),
  emailShell(
    "Bundle upsell + win-back (send later)",
    `**Trigger:** customer browsed a collection / ordered once and hasn't returned in 45 days.

### Upsell — 10 days after first delivery
**Subject:** The other half of the problem
**Preview:** If you bought the mat, here is what pairs with it.

Hi [First name],

Most people who buy one of these come back for the pairing, so here it is in one step:

- **Bought the Snuffle Mat?** The [Lick & Chill Mat →] is the rainy-day counterpart. Together they are the
  [Calm & Clean Kit →] at $49.99 — $7 cheaper than buying them apart.
- **Bought a grooming tool?** One tool only does part of the job. The [Shed-Control Trio →] is the complete
  loop: brush out the undercoat, glove the fussy zones, then roll the loose fur off the sofa.

### Win-back — 45 days of no activity
**Subject:** Still bored, still shedding
**Preview:** One idea, and a code if you want it.

Hi [First name],

A simple one: if your pet has gone back to being restless, rotate the enrichment instead of replacing it.
Put the snuffle mat away for a week and use the lick mat only, then swap back. Novelty is most of what
makes these work.

If you want to add something: **COMEBACK10** gets you 10% off, valid for 14 days.

[Shop bestsellers →]

**Notes for the build:** the win-back code is deliberately time-limited but not scare-limited — no
countdown graphics, per the store's no-fake-urgency rule.`
  )
);

// ── index of the import folder
writeFileSync(
  join(IMP, "README.md"),
  `# Shopify import package — start here

Everything below moves the preview store into your Shopify admin. **Total time: about 20 minutes.**

## 1. Products — one file does all 12

Admin → **Products → Import → Add file** → \`products.csv\` → **Upload and preview** → **Import**.

This creates all 12 products with prices, compare-at prices, tags, SEO fields, the full description, the
FAQ and spec tables in the body, and the image URLs. Choose **"Overwrite any current products that have
the same handle"** only if you are re-importing.

> **The images are hot-linked from the supplier's CDN.** Shopify will fetch them at import. If any fail to
> download (supplier CDNs sometimes rate-limit bulk fetches), the product still imports correctly — just
> re-add those images by hand from the supplier links on each product page, or do the import through
> DSers, which copies images into your Shopify Files properly.

## 2. Collections — 5 automated collections, 5 minutes

Follow \`collections.md\`. The CSV already applied the tags the conditions look for, so every product files
itself the moment you save each collection.

## 3. Pages — paste-ready HTML

Follow \`pages/_PAGE-SETUP.md\`. Four pages to create; the four legal policies go into **Settings → Policies**
instead, so Shopify wires them into the footer and checkout automatically.

## 4. Navigation, shipping, branding

- \`navigation.md\` — main menu and the three footer menus
- \`shipping-rates.md\` — the exact rates and zones, and why the free-shipping threshold is $${brand.freeShipThreshold}
- \`../theme/\` — the customized Dawn theme, ready to upload (see \`../theme/README.md\`)

## 5. Emails, pixels, reviews

- \`../emails/\` — four flows, written to paste
- Meta and TikTok pixel placeholders are already in the storefront markup — see the comment block in
  \`../preview/index.html\` and paste the same into \`theme.liquid\`

## Order of operations that avoids rework

1. Import products
2. Create collections (needs the tags from step 1)
3. Set up shipping rates (needs the products to exist for weight sanity)
4. Create pages + policies
5. Set menus
6. Upload the theme
7. Set branding (logo, colours, favicon)
8. Turn on email flows
9. Leave the password page **on** until you have placed and received one test order yourself
`
);

console.log("✓ handoff package written");
console.log(`  ${IMP}/products.csv  (${lines.length - 1} rows incl. image rows)`);
console.log(`  ${IMP}/products-avif-fallback.csv  (same products, original image URLs)`);
console.log(`  ${IMP}/pages/ (${Object.keys(PAGES).length} pages)`);
console.log(`  ${IMP}/collections.md · navigation.md · shipping-rates.md`);
console.log(`  ${EMAILS}/ (4 flows)`);
