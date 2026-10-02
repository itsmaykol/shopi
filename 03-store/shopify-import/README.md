# Shopify import package — start here

Everything below moves the preview store into your Shopify admin. **Total time: about 20 minutes.**

## 1. Products — one file does all 12

Admin → **Products → Import → Add file** → `products.csv` → **Upload and preview** → **Import**.

This creates all 12 products with prices, compare-at prices, tags, SEO fields, the full description, the
FAQ and spec tables in the body, and the image URLs. Choose **"Overwrite any current products that have
the same handle"** only if you are re-importing.

> **The images are hot-linked from the supplier's CDN.** Shopify will fetch them at import. If any fail to
> download (supplier CDNs sometimes rate-limit bulk fetches), the product still imports correctly — just
> re-add those images by hand from the supplier links on each product page, or do the import through
> DSers, which copies images into your Shopify Files properly.

## 2. Collections — 5 automated collections, 5 minutes

Follow `collections.md`. The CSV already applied the tags the conditions look for, so every product files
itself the moment you save each collection.

## 3. Pages — paste-ready HTML

Follow `pages/_PAGE-SETUP.md`. Four pages to create; the four legal policies go into **Settings → Policies**
instead, so Shopify wires them into the footer and checkout automatically.

## 4. Navigation, shipping, branding

- `navigation.md` — main menu and the three footer menus
- `shipping-rates.md` — the exact rates and zones, and why the free-shipping threshold is $35
- `../theme/` — the customized Dawn theme, ready to upload (see `../theme/README.md`)

## 5. Emails, pixels, reviews

- `../emails/` — four flows, written to paste
- Meta and TikTok pixel placeholders are already in the storefront markup — see the comment block in
  `../preview/index.html` and paste the same into `theme.liquid`

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
