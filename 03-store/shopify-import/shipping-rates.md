# Shipping rates & zones

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
