# Pages to create in Shopify

Admin → **Online Store → Pages → Add page**. For each one: set the title, paste the HTML in the
*Show HTML* (`</>`) view, then set the SEO fields from the table below.

| Page title | Paste this file | Suggested handle | Add to footer? |
|---|---|---|---|
| About Sniffari | `pages/about.html` | `about` | Yes |
| Contact us | `pages/contact.html` | `contact` | Yes |
| Frequently asked questions | `pages/faq.html` | `faq` | Yes |
| Track your order | `pages/track-your-order.html` | `track-your-order` | Yes |

**The four legal pages are already written into the storefront at `/policies/...`** — Shopify generates
these from **Settings → Policies** (Refund, Privacy, Terms of service, Shipping). Copy the text from the
live preview pages into those four policy boxes rather than creating them as pages; that way Shopify
links them automatically in the footer and at checkout, which is where customers and card networks
expect to find them:

| Shopify policy | Copy from the preview page |
|---|---|
| **Refund policy** | `/pages/refund-policy.html` |
| **Privacy policy** | `/pages/privacy-policy.html` |
| **Terms of service** | `/pages/terms-of-service.html` |
| **Shipping policy** | `/pages/shipping-policy.html` |

> ⚠️ **Before you publish:** fill the bracketed placeholders in the Privacy Policy, Terms of Service and
> About page (legal entity name, address, jurisdiction, support email). Search the pasted text for
> `[` and for `placeholder`.
