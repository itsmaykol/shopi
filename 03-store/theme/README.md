# Sniffari theme — customized Dawn 16.0.0

**Source:** the official free Shopify theme `Shopify/dawn` (MIT-licensed), pulled from
`codeload.github.com/Shopify/dawn` and customized from the same data model as the storefront preview.
Free forever, no licence cost, and it is the theme Shopify itself maintains for speed.

## Upload

Online Store → **Themes → Add theme → Upload zip file** → `sniffari-dawn-theme.zip`.
It arrives as an **unpublished** theme, so nothing goes live until you choose to publish it.

## What is already done

| Area | Status |
|---|---|
| Palette | 5 colour schemes mapped to the brand (cream, sand, pine, ink, clay) |
| Typography | Serif headings + Inter body, sized for mobile first |
| Shape | Pill buttons, 12px card radius — matches the storefront preview |
| Homepage | Branded hero, Bestsellers row, "why it works" columns, Enrichment row, honest no-reviews-yet block, FAQ accordion, email capture |
| Product pages | Added *Shipping & returns*, *Care & safety* and *Where this comes from* accordion tabs |
| Pixels | Commented placeholder block at the end of `layout/theme.liquid` — nothing loads until you fill it in |
| Brand art | `sniffari-logo.svg`, `sniffari-logo-cream.svg`, `sniffari-favicon.svg`, `sniffari-hero.png` ship inside the theme's `assets/` folder |

## Three things you must still do by hand (5 minutes)

Shopify does not let a theme file set image-picker settings, so these need clicks:

1. **Logo** — Settings → **Files** → upload `sniffari-logo.svg` (find it in `03-store/preview/assets/`).
   Then Customize → Header → Logo → select it. Set logo width to about **150px**.
2. **Favicon** — same Files upload of `sniffari-favicon.svg`, then Theme settings → Logo favicon.
3. **Collections in the homepage sections** — the hero, Bestsellers and Enrichment rows point at
   collections by handle. If you upload this theme *before* creating the collections, open the theme
   editor and pick them from the dropdowns on those two sections.

## Fonts

The theme is set to **Playfair Display** (headings) and **Inter** (body) — both free Shopify library
fonts. The design mock-up used Fraunces; if it is available in your theme editor's font picker, choose it
for headings to match the preview exactly. No paid fonts are used anywhere.

## Editing notes

- The hero is a **custom-liquid** section, so all of its HTML/CSS lives in
  `templates/index.json` under `sniffari_hero.settings.custom_liquid`. Edit it there or in the
  theme editor's code field.
- Dawn's Liquid logic is **untouched** apart from the pixel comment. That means you can pull a future
  Dawn release and diff it cleanly against this folder.
