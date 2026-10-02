# Brand — **Sniffari**

> "Sniffari" = sniff + safari. Memorable, sayable, spellable, and it describes exactly what the products
> sell: the mental safari your indoor pet goes on when they work for their food.

## Positioning

**Sniffari — enrichment & everyday care for indoor pets.**

We are not a general pet store. We sell to one person: **the indoor pet parent** — apartment/condo
dwellers, city walkers, people whose dog or cat spends most of the day inside and whose couch is
covered in fur. Every product answers one of three jobs:

1. **"My pet is bored and it's showing."** → enrichment (snuffle mat, lick mat, slow feeder, puzzle bowl)
2. **"My pet's fur is on everything I own."** → grooming (fur lifter, slicker brush, deshedding glove)
3. **"My pet brings the outside back inside."** → cleanup & walks (paw cleaner cup, travel bottle)

## Name & trademark check (best-effort, flagged honestly)

- The wordmark is original. **I could not run a formal trademark search** — no USPTO/TESS or EUIPO
  access exists in this environment, and those databases block automated fetches.
- Sanity checks I *could* do: a web search for the exact term returns no pet brand using "Sniffari"
  as its primary trading name. That is **weak evidence**, not clearance.
- ⚠️ **You must do the real check before you print packaging or buy a domain** — USPTO TESS search
  (free, 5 minutes) for "Sniffari" in Nice class 31 (pet food) and 20/21/28 (pet accessories), plus a
  quick check of the .com, .co and the Instagram/TikTok handles. It is item 6 on your action list.
- **Backup names** (same positioning, if Sniffari is taken): *Sniffwell*, *Pawtrail Co.*, *Nosework Club*,
  *Forage & Fetch*. All are equally unverified.

## Logo

**Concept: the "sniff line."** A single continuous stroke that starts as a dog's snout profile and
loops into a spiral — the spiral being both a sniff swirl and a snuffle mat seen from above.
Two elements only, so it stays legible at 16px in a browser tab.

- Files: `03-store/preview/assets/logo.svg` (full wordmark lockup),
  `assets/logo-mark.svg` (mark only, for favicon + social avatar).
- Rules: mark is always forest ink `#16211C` or cream `#FBF7F0` on ink. Never recolour to brand-accent
  colours. Clear space = the height of the mark's spiral on all sides. Minimum mark size 20px.

## Palette

| Role | Hex | Use |
|---|---|---|
| **Ink** (primary) | `#16211C` | Text, logo, footer, buttons |
| **Cream** (canvas) | `#FBF7F0` | Page background |
| **Sand** | `#EFE6D8` | Section alternation, cards |
| **Sage** | `#7E9C86` | Secondary buttons, benefit icons, tags |
| **Clay** | `#C0663A` | Accent: sale price, links, "hero" highlights, CTA hover |
| **Pine** | `#2E4A3D` | Deep section backgrounds (footer top band) |

Contrast: Ink on Cream = 13.9:1, Cream on Ink = 13.9:1, Clay on Cream = 4.8:1 — all pass WCAG AA
for body text; Clay is only used for accents/large text where it passes AA-large.

## Typography

- **Headings:** `Fraunces` (variable serif, warm, editorial, free on Google Fonts) — weights 500/600.
- **Body & UI:** `Inter` — weights 400/500/600.
- Both load via a single Google Fonts `@import` in the theme CSS, with a
  `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` fallback stack so a blocked font CDN
  never breaks the layout. **No paid font licences are used, and no font files are redistributed.**
- Scale (mobile-first): h1 34/1.15 · h2 26/1.2 · h3 19/1.3 · body 16/1.65 · small 14/1.5.

## Voice

- Warm, dry, a little funny. Talks about the *owner's* problem first, the pet second.
- Short sentences. Concrete numbers. No health claims, no "vet-approved", no guarantees.
- Never says: "revolutionary", "must-have", "cure", "treats anxiety" (a health claim), "guaranteed".
- Always says: what it's made of, how big it is, how to clean it, how long shipping takes.
- Example, product bullet: *"Holds a full meal in the fabric folds, so dinner takes 12 minutes instead
  of 90 seconds."* Example, NOT allowed: *"Prevents bloat and cures anxiety."*

## Honest-marketing rules baked into the build

No fake reviews, no invented customer counts, no countdown timers, no "only 3 left", no press logos,
no before/after health results. The social-proof section ships with a clearly-marked honest empty state
and a review-collection flow, because the store has never sold anything yet — the fastest way to lose
a customer is to be caught faking a review, and it is also illegal in the US under the FTC's 2024
rules on fake and AI-generated reviews.
