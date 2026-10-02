# Navigation

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
