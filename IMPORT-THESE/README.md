# IMPORT-THESE

Four files and one guide. This is everything that goes into your Shopify store.

## 👉 Open `SETUP-GUIDE.md` first

It walks you through all six steps in order, with everything you need to paste inlined into that one
document. About 20 minutes, start to finish.

## The files

| File | What it is | Where it goes |
|---|---|---|
| **`1-products.csv`** (46 KB) | All 12 products — titles, prices, descriptions, specs, FAQs, SEO, tags, **JPEG** image URLs | Admin → **Products → Import** |
| **`1b-products-avif-fallback.csv`** | The same 12 products with the original **AVIF** image URLs | Only if product images fail to download — see Step 1 |
| **`2-sniffari-dawn-theme.zip`** (2323 KB) | Customized **Dawn** theme (free, MIT) with the brand palette, homepage and product tabs | Admin → **Online Store → Themes → Add theme → Upload zip** |
| **`pages/`** (4 files) | Paste-ready HTML for About, Contact, FAQ and Track your order | Admin → **Online Store → Pages** (paste in the `</>` HTML view) |
| **`SETUP-GUIDE.md`** | The full walkthrough: collections, navigation, shipping rates, placement of every file | Read it and follow along |

## Two quick warnings before you start

1. **Policies do not go in the `pages/` folder process.** Refund, Privacy, Terms and Shipping go into
   **Settings → Policies**, not into Pages. Put them in the wrong place and they will not appear at
   checkout, where card networks expect them. Step 3b explains it.
2. **Upload the theme *after* you create the collections** (Step 2 before Step 6), or the two
   homepage product rows will have nothing to point at. If you already uploaded it, it is a two-dropdown
   fix in the theme editor.

## Not in this folder

The emails, the 14-day content calendar, the video scripts and the pre-launch checklists live in the
repo: `03-store/emails/`, `04-launch-kit/`, and `06-final/NEEDS-YOUR-ACTION.md`.
