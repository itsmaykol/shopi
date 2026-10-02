#!/usr/bin/env node
/**
 * Builds the customized Dawn theme from the official Shopify/dawn source.
 *
 *   node theme.mjs /path/to/extracted/dawn
 *
 * What it customizes:
 *   - config/settings_data.json : brand palette (5 schemes), fonts, button radius, layout
 *   - templates/index.json      : homepage — branded hero, bestsellers, benefits, enrichment,
 *                                 honest social proof, FAQ, email capture
 *   - templates/product.json    : collapsible Shipping/Care tabs + supplier-evidence tab
 *   - assets/                   : logo, favicon, hero illustration (so asset_url works in-theme)
 *   - layout/theme.liquid       : the pixel placeholder comment block
 *
 * It does NOT touch Dawn's Liquid logic, so a future Dawn update can be diffed cleanly.
 */
import { readFileSync, writeFileSync, cpSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { brand } from "./data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2] || "/tmp/dawn";
const THEME_ROOT = join(__dirname, "..", "theme");
const DEST = join(THEME_ROOT, "sniffari-dawn");
const ASSETS_SRC = join(__dirname, "assets-src");

if (!existsSync(join(SRC, "config", "settings_schema.json"))) {
  console.error(`✗ Not a Dawn theme at ${SRC}`);
  process.exit(1);
}

if (existsSync(DEST)) rmSync(DEST, { recursive: true, force: true });
mkdirSync(THEME_ROOT, { recursive: true });
cpSync(SRC, DEST, { recursive: true });

// ── 1. brand assets into the theme so asset_url references resolve
mkdirSync(join(DEST, "assets"), { recursive: true });
cpSync(join(ASSETS_SRC, "hero-illustration.png"), join(DEST, "assets", "sniffari-hero.png"));
cpSync(join(ASSETS_SRC, "logo.svg"), join(DEST, "assets", "sniffari-logo.svg"));
cpSync(join(ASSETS_SRC, "logo-cream.svg"), join(DEST, "assets", "sniffari-logo-cream.svg"));
cpSync(join(ASSETS_SRC, "favicon.svg"), join(DEST, "assets", "sniffari-favicon.svg"));

// ── 2. settings_data.json — palette, fonts, shape
const settingsPath = join(DEST, "config", "settings_data.json");
const sd = JSON.parse(readFileSync(settingsPath, "utf8"));
const base = JSON.parse(JSON.stringify(sd.presets?.Dawn || sd.current));

const SCHEMES = {
  // Cream page, ink text — the default surface
  "scheme-1": {
    background: "#FBF7F0",
    background_gradient: "",
    text: "#16211C",
    button: "#16211C",
    button_label: "#FBF7F0",
    secondary_button_label: "#16211C",
    shadow: "#16211C",
  },
  // Sand band — alternating sections
  "scheme-2": {
    background: "#EFE6D8",
    background_gradient: "",
    text: "#16211C",
    button: "#16211C",
    button_label: "#EFE6D8",
    secondary_button_label: "#16211C",
    shadow: "#16211C",
  },
  // Pine — deep green band
  "scheme-3": {
    background: "#2E4A3D",
    background_gradient: "",
    text: "#FBF7F0",
    button: "#FBF7F0",
    button_label: "#2E4A3D",
    secondary_button_label: "#FBF7F0",
    shadow: "#16211C",
  },
  // Ink — footer and email capture
  "scheme-4": {
    background: "#16211C",
    background_gradient: "",
    text: "#FBF7F0",
    button: "#FBF7F0",
    button_label: "#16211C",
    secondary_button_label: "#FBF7F0",
    shadow: "#16211C",
  },
  // Clay — accent / promotional
  "scheme-5": {
    background: "#C0663A",
    background_gradient: "",
    text: "#FFFFFF",
    button: "#FFFFFF",
    button_label: "#C0663A",
    secondary_button_label: "#FFFFFF",
    shadow: "#16211C",
  },
};

Object.assign(base, {
  // typography — Shopify font handles (verified against the font library; if you prefer the
  // preview's Fraunces, pick it in the theme editor, it is not guaranteed to exist in the library)
  type_header_font: "playfair_display_n4",
  heading_scale: 110,
  type_body_font: "inter_n4",
  body_scale: 100,
  // shape — matches the storefront's pill buttons and soft cards
  buttons_border_thickness: 0,
  buttons_radius: 40,
  buttons_shadow_opacity: 0,
  inputs_radius: 8,
  inputs_border_thickness: 1,
  variant_pills_radius: 40,
  card_corner_radius: 12,
  card_border_thickness: 1,
  card_border_opacity: 8,
  card_shadow_opacity: 0,
  collection_card_corner_radius: 12,
  collection_card_border_thickness: 1,
  collection_card_border_opacity: 8,
  // layout
  page_width: 1200,
  spacing_sections: 0,
  // cards off by default for a cleaner grid
  card_style: "standard",
  card_image_padding: 0,
  // favicon can't be set here (needs a file upload) — see theme/README.md
  color_schemes: SCHEMES,
});

// Make sure the Dawn preset keeps our values too, so "Reset" in the editor does not lose the brand.
if (sd.presets?.Dawn) {
  sd.presets.Dawn = { ...sd.presets.Dawn, ...base };
}
sd.current = base;
writeFileSync(settingsPath, JSON.stringify(sd, null, 2) + "\n");

// ── 3. homepage
const HERO_LIQUID = `<div class="sniffari-hero">
  <div class="sniffari-hero__inner">
    <div class="sniffari-hero__copy">
      <p class="sniffari-hero__eyebrow">For dogs &amp; cats who live indoors</p>
      <h1 class="sniffari-hero__title">A bored pet is an expensive pet.</h1>
      <p class="sniffari-hero__lead">Snuffle mats, slow feeders and lick mats turn a 40-second meal into fifteen minutes of nose work &mdash; the closest thing to a walk you can do on a rainy Tuesday.</p>
      <div class="sniffari-hero__cta">
        <a class="button" href="/collections/bestsellers">Shop bestsellers</a>
        <a class="button button--secondary" href="/collections/bundles">See the bundles</a>
      </div>
      <ul class="sniffari-hero__points">
        <li>No batteries, no apps, no subscriptions</li>
        <li>Free US shipping over $${brand.freeShipThreshold}</li>
        <li>30-day returns, no arguing</li>
      </ul>
    </div>
    <div class="sniffari-hero__art">
      <img src="{{ 'sniffari-hero.png' | asset_url }}" alt="Illustration of a dog sniffing a textured snuffle mat on a living-room floor" width="1024" height="1024" loading="eager">
    </div>
  </div>
</div>
<style>
  .sniffari-hero { background: linear-gradient(180deg, #EFE6D8 0%, #FBF7F0 100%); padding: 2.6rem 0 1.6rem; }
  .sniffari-hero__inner { max-width: 120rem; margin: 0 auto; padding: 0 2rem; display: grid; gap: 2.4rem; }
  .sniffari-hero__eyebrow { text-transform: uppercase; letter-spacing: .11em; font-size: 1.1rem; font-weight: 600; color: #C0663A; margin: 0 0 1rem; }
  .sniffari-hero__title { margin: 0 0 1.2rem; }
  .sniffari-hero__lead { font-size: 1.6rem; color: rgba(22,33,28,.72); max-width: 34em; margin: 0 0 1.8rem; }
  .sniffari-hero__cta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.8rem; }
  .sniffari-hero__cta .button { margin: 0; }
  .sniffari-hero__cta .button--secondary { background: transparent; color: #16211C; box-shadow: inset 0 0 0 1px #16211C; }
  .sniffari-hero__points { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; font-size: 1.4rem; color: rgba(22,33,28,.72); }
  .sniffari-hero__points li::before { content: "✓"; color: #7E9C86; font-weight: 700; margin-right: .7rem; }
  .sniffari-hero__art img { width: 100%; height: auto; border-radius: 22px; display: block; }
  @media screen and (min-width: 750px) {
    .sniffari-hero { padding: 4.4rem 0 2.4rem; }
    .sniffari-hero__inner { grid-template-columns: 1.05fr .95fr; align-items: center; gap: 3.4rem; }
    .sniffari-hero__title { font-size: 4.6rem; }
  }
</style>`;

const index = {
  sections: {
    sniffari_hero: {
      type: "custom-liquid",
      settings: { custom_liquid: HERO_LIQUID, color_scheme: "scheme-1", padding_top: 0, padding_bottom: 0 },
    },
    bestsellers: {
      type: "featured-collection",
      settings: {
        title: "The three that sell themselves",
        heading_size: "h2",
        description: "Start here if you are not sure. These are the products people come back for.",
        show_description: true,
        description_style: "body",
        collection: "bestsellers",
        products_to_show: 4,
        columns_desktop: 4,
        columns_mobile: "2",
        color_scheme: "scheme-1",
        full_width: false,
        show_view_all: true,
        view_all_style: "link",
        enable_desktop_slider: false,
        swipe_on_mobile: true,
        image_ratio: "square",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "standard",
        padding_top: 52,
        padding_bottom: 36,
      },
    },
    why_it_works: {
      type: "multicolumn",
      blocks: {
        b1: {
          type: "column",
          settings: {
            title: "Sniffing tires a dog out faster than walking",
            text: "<p>Fifteen minutes of nose work does more for a restless indoor dog than a thirty-minute march around the block. That is the entire reason a snuffle mat exists.</p>",
          },
        },
        b2: {
          type: "column",
          settings: {
            title: "Fast eating is the thing owners notice first",
            text: "<p>If dinner is over in under a minute, the bowl is doing nothing. A maze bowl buys you ten minutes of calm and a dog that settles afterwards.</p>",
          },
        },
        b3: {
          type: "column",
          settings: {
            title: "Fur is a maintenance job, not an event",
            text: "<p>Two minutes with a glove, once a day, beats an hour of wrestling once a month. Every grooming tool here is designed to be quick enough that you actually do it.</p>",
          },
        },
      },
      block_order: ["b1", "b2", "b3"],
      settings: {
        title: "Why it works",
        heading_size: "h2",
        columns_desktop: 3,
        columns_mobile: "1",
        column_alignment: "left",
        background_style: "none",
        color_scheme: "scheme-2",
        swipe_on_mobile: false,
        padding_top: 48,
        padding_bottom: 48,
      },
    },
    enrichment: {
      type: "featured-collection",
      settings: {
        title: "Food puzzles that get used twice a day",
        heading_size: "h2",
        description: "",
        show_description: false,
        collection: "enrichment",
        products_to_show: 4,
        columns_desktop: 4,
        columns_mobile: "2",
        color_scheme: "scheme-1",
        show_view_all: true,
        view_all_style: "link",
        swipe_on_mobile: true,
        image_ratio: "square",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "standard",
        padding_top: 48,
        padding_bottom: 36,
      },
    },
    honest_proof: {
      type: "rich-text",
      blocks: {
        h: { type: "heading", settings: { heading: "We have no reviews yet. Here is exactly why.", heading_size: "h2" } },
        t: {
          type: "text",
          settings: {
            text: "<p><strong>This is a brand-new store. It has not shipped an order yet.</strong></p><p>That means there are no customer reviews on this page &mdash; and we are not going to invent any. Fake testimonials are not just tacky, they are illegal in the US under the FTC's rules on deceptive reviews.</p><p>What we can show you instead: the exact supplier listing every product is sourced from, with its real rating and units-sold figures, printed on each product page. Judge the product on the supplier's feedback, not our fiction.</p><p>As real reviews arrive, this section becomes a review carousel. Honest placeholder now, real proof later.</p>",
          },
        },
      },
      block_order: ["h", "t"],
      settings: {
        desktop_content_position: "middle",
        content_alignment: "left",
        color_scheme: "scheme-2",
        full_width: false,
        padding_top: 52,
        padding_bottom: 52,
      },
    },
    faq: {
      type: "collapsible-content",
      blocks: {
        r1: {
          type: "collapsible_row",
          settings: {
            heading: "How long does shipping take?",
            row_content:
              "<p>Most US orders arrive in <strong>7–15 days</strong>. Items ship directly from our supplier partners, which is how we keep prices where they are. You get tracking by email as soon as it is dispatched.</p>",
          },
        },
        r2: {
          type: "collapsible_row",
          settings: {
            heading: "Why is it not 2-day shipping like a big store?",
            row_content:
              "<p>Because we are not stocking a warehouse. Two-day shipping would mean buying inventory up front and charging you for it. We would rather be honest about a 7–15 day window than promise two days and miss it.</p>",
          },
        },
        r3: {
          type: "collapsible_row",
          settings: {
            heading: "What if my pet doesn't like it?",
            row_content:
              "<p>Send it back unused within 30 days of delivery and we refund the item price. Full details, including who pays return postage, are in our refund policy.</p>",
          },
        },
        r4: {
          type: "collapsible_row",
          settings: {
            heading: "Are these safe for a puppy or a chewer?",
            row_content:
              "<p>Nothing here is a chew toy. Snuffle mats and lick mats are feeding tools and should be used supervised, then put away. Swallowed fabric or silicone is a vet visit.</p>",
          },
        },
        r5: {
          type: "collapsible_row",
          settings: {
            heading: "Do you make health claims?",
            row_content:
              "<p>No. Nothing here treats, cures or prevents anything. These are enrichment and grooming accessories. If your pet has a diagnosed condition, that is a conversation with your vet, not a shopping cart.</p>",
          },
        },
      },
      block_order: ["r1", "r2", "r3", "r4", "r5"],
      settings: {
        caption: "",
        heading: "The ones people actually ask",
        heading_size: "h2",
        heading_alignment: "left",
        layout: "none",
        color_scheme: "scheme-1",
        container_color_scheme: "scheme-1",
        open_first_collapsible_row: true,
        desktop_layout: "question-answer",
        padding_top: 48,
        padding_bottom: 36,
      },
    },
    newsletter: {
      type: "newsletter",
      settings: {
        color_scheme: "scheme-4",
        full_width: true,
        padding_top: 48,
        padding_bottom: 48,
        desktop_content_position: "middle",
      },
    },
  },
  order: ["sniffari_hero", "bestsellers", "why_it_works", "enrichment", "honest_proof", "faq", "newsletter"],
};
writeFileSync(join(DEST, "templates", "index.json"), JSON.stringify(index, null, 2) + "\n");

// ── 4. product template — add collapsible tabs + supplier evidence
const productPath = join(DEST, "templates", "product.json");
const pt = JSON.parse(readFileSync(productPath, "utf8"));
const main = pt.sections.main;
main.blocks.supplier = {
  type: "collapsible_tab",
  settings: {
    heading: "Where this comes from",
    icon: "none",
    content:
      "<p>Every product page prints the supplier listing it is sourced from, with the live rating and units-sold figure we saw when we chose it, so you can judge the source yourself. See the supplier links at the bottom of the description above.</p><p>Prices and delivery estimates can change at the supplier; your order is always charged the price shown at checkout.</p>",
  },
};
main.blocks.care = {
  type: "collapsible_tab",
  settings: {
    heading: "Care & safety",
    icon: "none",
    content:
      "<p>Supervise use. Nothing in this store is a chew toy and none of it is indestructible. Wash per the specs in the description and replace anything that tears &mdash; a swallowed piece of fabric or silicone is a vet visit.</p><p>Nothing here is medical advice or a treatment for any condition.</p>",
  },
};
main.blocks.shipping_tab = {
  type: "collapsible_tab",
  settings: {
    heading: "Shipping & returns",
    icon: "none",
    content:
      "<p>Most US orders arrive in <strong>7&ndash;15 days</strong>, tracked. Free US shipping over $" +
      brand.freeShipThreshold +
      ". Returns accepted within 30 days of delivery on unused, unwashed items &mdash; see our refund policy for who pays return postage.</p>",
  },
};
// put the useful tabs before "share"
const order = main.block_order.filter((b) => b !== "share");
main.block_order = [...order, "shipping_tab", "care", "supplier", "share"];
writeFileSync(productPath, JSON.stringify(pt, null, 2) + "\n");

// ── 5. pixel placeholder comment in theme.liquid
const themeLiquidPath = join(DEST, "layout", "theme.liquid");
let tl = readFileSync(themeLiquidPath, "utf8");
const PIXELS = `{%- comment -%}
  ══════════════════════════════════════════════════════════════════════════
  TRACKING PIXELS — PLACEHOLDERS ONLY. NOTHING IS LOADED UNTIL YOU FILL THEM IN.
  Replace YOUR_META_PIXEL_ID / YOUR_TIKTOK_PIXEL_ID, then uncomment the block.

  META PIXEL
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_META_PIXEL_ID'); fbq('track', 'PageView');
  </script>

  TIKTOK PIXEL
  <script>
    !function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load('YOUR_TIKTOK_PIXEL_ID'); ttq.page();}(window, document, 'ttq');
  </script>
{%- endcomment -%}
`;
if (!tl.includes("TRACKING PIXELS — PLACEHOLDERS ONLY")) {
  tl = tl.replace("</head>", PIXELS + "</head>");
  writeFileSync(themeLiquidPath, tl);
}

// ── 6. write the theme README + zip
writeFileSync(
  join(THEME_ROOT, "README.md"),
  `# Sniffari theme — customized Dawn ${JSON.parse(readFileSync(join(DEST, "config/settings_schema.json"), "utf8"))[0].theme_version}

**Source:** the official free Shopify theme \`Shopify/dawn\` (MIT-licensed), pulled from
\`codeload.github.com/Shopify/dawn\` and customized from the same data model as the storefront preview.
Free forever, no licence cost, and it is the theme Shopify itself maintains for speed.

## Upload

Online Store → **Themes → Add theme → Upload zip file** → \`sniffari-dawn-theme.zip\`.
It arrives as an **unpublished** theme, so nothing goes live until you choose to publish it.

## What is already done

| Area | Status |
|---|---|
| Palette | 5 colour schemes mapped to the brand (cream, sand, pine, ink, clay) |
| Typography | Serif headings + Inter body, sized for mobile first |
| Shape | Pill buttons, 12px card radius — matches the storefront preview |
| Homepage | Branded hero, Bestsellers row, "why it works" columns, Enrichment row, honest no-reviews-yet block, FAQ accordion, email capture |
| Product pages | Added *Shipping & returns*, *Care & safety* and *Where this comes from* accordion tabs |
| Pixels | Commented placeholder block at the end of \`layout/theme.liquid\` — nothing loads until you fill it in |
| Brand art | \`sniffari-logo.svg\`, \`sniffari-logo-cream.svg\`, \`sniffari-favicon.svg\`, \`sniffari-hero.png\` ship inside the theme's \`assets/\` folder |

## Three things you must still do by hand (5 minutes)

Shopify does not let a theme file set image-picker settings, so these need clicks:

1. **Logo** — Settings → **Files** → upload \`sniffari-logo.svg\` (find it in \`03-store/preview/assets/\`).
   Then Customize → Header → Logo → select it. Set logo width to about **150px**.
2. **Favicon** — same Files upload of \`sniffari-favicon.svg\`, then Theme settings → Logo favicon.
3. **Collections in the homepage sections** — the hero, Bestsellers and Enrichment rows point at
   collections by handle. If you upload this theme *before* creating the collections, open the theme
   editor and pick them from the dropdowns on those two sections.

## Fonts

The theme is set to **Playfair Display** (headings) and **Inter** (body) — both free Shopify library
fonts. The design mock-up used Fraunces; if it is available in your theme editor's font picker, choose it
for headings to match the preview exactly. No paid fonts are used anywhere.

## Editing notes

- The hero is a **custom-liquid** section, so all of its HTML/CSS lives in
  \`templates/index.json\` under \`sniffari_hero.settings.custom_liquid\`. Edit it there or in the
  theme editor's code field.
- Dawn's Liquid logic is **untouched** apart from the pixel comment. That means you can pull a future
  Dawn release and diff it cleanly against this folder.
`
);

const zipPath = join(THEME_ROOT, "sniffari-dawn-theme.zip");
if (existsSync(zipPath)) rmSync(zipPath);
// Shopify only accepts the seven theme directories at the zip root — everything else
// (.github/, README.md, .gitignore, package.json…) must be excluded or the upload is rejected.
const THEME_DIRS = ["assets", "config", "layout", "locales", "sections", "snippets", "templates"];
execSync(`cd ${DEST} && zip -qr "${zipPath}" ${THEME_DIRS.join(" ")} -x "*.DS_Store"`, { stdio: "inherit" });

console.log(`✓ theme built → ${DEST}`);
console.log(`✓ zip → ${zipPath} (${(execSync(`stat -c%s "${zipPath}"`).toString().trim() / 1024 / 1024).toFixed(1)} MB)`);
