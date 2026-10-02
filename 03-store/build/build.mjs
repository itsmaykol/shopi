#!/usr/bin/env node
/**
 * Sniffari static storefront builder.
 * Zero dependencies. Outputs a fully clickable store to 03-store/preview/
 *
 *   node build.mjs
 *
 * The output is (a) a design/preview artifact you can click before importing anything into
 * Shopify, and (b) the single source of truth for copy that gets pasted into Shopify pages.
 */
import { writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { brand, collections, products, byHandle } from "./data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "preview");
const ASSETS = join(OUT, "assets");

// ───────────────────────────────────────────────────────────── helpers
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const money = (n) => "$" + n.toFixed(2);

/** Inline SVG icons — self-contained so they render regardless of fonts or network. */
const ICON = {
  truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E9C86" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7h11v9H2z"/><path d="M13 10h4l3.5 3.2V16H13z"/><circle cx="6.5" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/></svg>`,
  returns: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E9C86" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9a8 8 0 1 1 2 6"/><path d="M4 4v5h5"/></svg>`,
  battery: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E9C86" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="15" height="10" rx="2"/><path d="M20 10.5v3"/><path d="M8 12h5"/><path d="M10.5 9.5v5"/><path d="M6.5 4.5l11 15" stroke="#C0663A"/></svg>`,
  wash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7E9C86" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M5 8h14"/><circle cx="12" cy="14" r="3.4"/><path d="M9.6 13.2c1.4-1.2 3.4-1.2 4.8 0"/></svg>`,
};

const savePct = (p) => Math.round((1 - p.price / p.compareAt) * 100);

/**
 * Branded SVG placeholder, used as the onerror fallback for every product image and as the
 * image behind the wish-list card front. Deliberately looks like an intentional brand graphic
 * (logo mark + wordmark + category line), never like a broken image.
 */
const placeholder = (label, tint, i = 0) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
<rect width="600" height="600" fill="${tint}"/>
<g transform="translate(300 250)" fill="none" stroke="#16211C" stroke-opacity="0.30" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
<path d="M-62 46c0-44 34-80 76-80h22"/>
<path d="M36 -34c20 0 36 14 36 32 0 17-13 30-30 30-15 0-25-10-25-23 0-11 9-20 20-20 9 0 15 6 15 14 0 7-5 12-12 12-5 0-9-4-9-9"/>
<circle cx="-42" cy="6" r="7" fill="#16211C" fill-opacity="0.30" stroke="none"/>
</g>
<text x="300" y="392" font-family="Fraunces,Georgia,serif" font-size="40" font-weight="600" fill="#16211C" fill-opacity="0.62" text-anchor="middle">Sniffari</text>
<text x="300" y="436" font-family="Inter,system-ui,sans-serif" font-size="22" letter-spacing="4" fill="#16211C" fill-opacity="0.40" text-anchor="middle">${esc(
    label
  )
    .toUpperCase()
    .replace(/&AMP;/g, "&")}</text>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

const pixelPlaceholders = () => `<!--
  ══════════════════════════════════════════════════════════════════════════
  TRACKING PIXELS — PLACEHOLDERS ONLY. NOTHING IS LOADED AND NOTHING FIRES.
  Replace the ID placeholders below with your own IDs at launch.
  In Shopify: Settings → Customer events → Add custom pixel (free), or paste
  into theme.liquid just before </head>.
  ══════════════════════════════════════════════════════════════════════════

  META PIXEL
  <script>
    !function(f,b,e,v,n,t,s){...standard meta loader...}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_META_PIXEL_ID');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=YOUR_META_PIXEL_ID&ev=PageView&noscript=1"/></noscript>

  TIKTOK PIXEL
  <script>
    !function (w, d, t) { ...standard tiktok loader... }(window, document, 'ttq');
    ttq.load('YOUR_TIKTOK_PIXEL_ID');
    ttq.page();
  </script>
-->`;

// ───────────────────────────────────────────────────────────── layout
const nav = () => `
<a class="skip" href="#main">Skip to content</a>
<div class="announce">
  <div class="wrap announce-in">
    <span>Free US shipping over $${brand.freeShipThreshold}</span>
    <span class="dot" aria-hidden="true">·</span>
    <span>${brand.shipPromise}</span>
    <span class="dot" aria-hidden="true">·</span>
    <span>30-day returns</span>
  </div>
</div>
<header class="header">
  <div class="wrap header-in">
    <a class="brandlink" href="/index.html" aria-label="${esc(brand.name)} home">
      <img src="/assets/logo.svg" alt="${esc(brand.name)} — ${esc(brand.tagline)}" height="34" width="152">
    </a>
    <nav class="mainnav" aria-label="Main">
      <a href="/collection/bestsellers.html">Shop all</a>
      <a href="/collection/enrichment.html">Enrichment</a>
      <a href="/collection/grooming.html">Grooming</a>
      <a href="/collection/cleanup.html">Walks &amp; cleanup</a>
      <a href="/collection/bundles.html">Bundles</a>
      <a href="/pages/about.html">About</a>
    </nav>
    <div class="headeractions">
      <a class="iconbtn" href="/pages/track-order.html" aria-label="Track your order">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>
      </a>
      <button class="iconbtn cartbtn" type="button" data-cart-open aria-label="Open cart">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>
        <span class="cartcount" data-cart-count hidden>0</span>
      </button>
      <button class="menubtn" type="button" data-menu-open aria-label="Open menu" aria-expanded="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>
<div class="mobilemenu" data-mobilemenu hidden>
  <div class="wrap">
    <button class="mobileclose" type="button" data-menu-close aria-label="Close menu">✕</button>
    <nav aria-label="Mobile">
      <a href="/collection/bestsellers.html">Shop all</a>
      <a href="/collection/enrichment.html">Enrichment &amp; feeder puzzles</a>
      <a href="/collection/grooming.html">Grooming &amp; shed control</a>
      <a href="/collection/cleanup.html">Paws, walks &amp; cleanup</a>
      <a href="/collection/bundles.html">Value bundles</a>
      <a href="/pages/about.html">About</a>
      <a href="/pages/faq.html">FAQ</a>
      <a href="/pages/track-order.html">Track your order</a>
      <a href="/pages/contact.html">Contact</a>
    </nav>
  </div>
</div>`;

const footer = () => `
<footer class="footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <img src="/assets/logo-cream.svg" alt="${esc(brand.name)}" height="32" width="143">
      <p>${esc(brand.tagline)}. Small, useful things that keep indoor pets busy and their homes fur-free.</p>
      <form class="newsletter" data-newsletter novalidate>
        <label for="nl-${Math.random().toString(36).slice(2, 7)}" class="sr-only">Email address</label>
        <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
        <button class="btn btn-clay" type="submit">Get 10% off</button>
        <p class="newsletter-note">One email with your code, then occasional useful stuff. Unsubscribe anytime.</p>
        <p class="newsletter-ok" data-newsletter-ok hidden>Thanks — check your inbox for the code. (Preview only: no email is sent from this preview.)</p>
      </form>
    </div>
    <div class="footer-col">
      <h3>Shop</h3>
      <a href="/collection/bestsellers.html">Bestsellers</a>
      <a href="/collection/enrichment.html">Enrichment</a>
      <a href="/collection/grooming.html">Grooming</a>
      <a href="/collection/cleanup.html">Walks &amp; cleanup</a>
      <a href="/collection/bundles.html">Bundles</a>
    </div>
    <div class="footer-col">
      <h3>Help</h3>
      <a href="/pages/faq.html">FAQ</a>
      <a href="/pages/track-order.html">Track your order</a>
      <a href="/pages/shipping-policy.html">Shipping policy</a>
      <a href="/pages/refund-policy.html">Refund policy</a>
      <a href="/pages/contact.html">Contact us</a>
    </div>
    <div class="footer-col">
      <h3>Company</h3>
      <a href="/pages/about.html">About</a>
      <a href="/pages/privacy-policy.html">Privacy policy</a>
      <a href="/pages/terms-of-service.html">Terms of service</a>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(brand.name)}. All rights reserved.</p>
    <p class="footer-note">Demonstration storefront. Prices shown are planned retail prices.</p>
  </div>
</footer>
<div class="cartdrawer" data-cart-drawer hidden aria-label="Cart" role="dialog" aria-modal="true">
  <div class="cartbackdrop" data-cart-close></div>
  <aside class="cartpanel">
    <header class="carthead">
      <h2>Your cart</h2>
      <button class="iconbtn" type="button" data-cart-close aria-label="Close cart">✕</button>
    </header>
    <div class="shipbar" data-shipbar></div>
    <div class="cartlines" data-cart-lines></div>
    <div class="cartfoot">
      <div class="cartrow"><span>Subtotal</span><strong data-cart-subtotal>$0.00</strong></div>
      <p class="cartsmall">Shipping and taxes are calculated at checkout. <a href="/pages/shipping-policy.html">Shipping details</a></p>
      <button class="btn btn-clay btn-block" type="button" data-checkout>Checkout</button>
      <p class="cartsmall cartwarn" data-checkout-note hidden>
        This is a preview storefront — checkout is not connected. Payment details are added by the store
        owner in Shopify before launch.
      </p>
    </div>
  </aside>
</div>`;

const searchJs = () => `
<script>
(function () {
  var KEY = 'sniffari_cart_v1';
  var PRODUCTS = window.__SNIFFARI_PRODUCTS__ || {};
  var FREE = ${brand.freeShipThreshold};
  var FLAT = ${brand.flatShipping};

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(v) { localStorage.setItem(KEY, JSON.stringify(v)); render(); }
  function add(handle, qty) {
    var c = read(); var hit = c.filter(function (l) { return l.handle === handle; })[0];
    if (hit) { hit.qty += qty || 1; } else { c.push({ handle: handle, qty: qty || 1 }); }
    write(c); open();
  }
  function setQty(handle, qty) {
    var c = read().map(function (l) { if (l.handle === handle) l.qty = qty; return l; })
      .filter(function (l) { return l.qty > 0; });
    write(c);
  }
  function subtotal() {
    return read().reduce(function (s, l) { var p = PRODUCTS[l.handle]; return s + (p ? p.price * l.qty : 0); }, 0);
  }
  function open() { var d = document.querySelector('[data-cart-drawer]'); if (d) { d.hidden = false; document.body.classList.add('noscroll'); } }
  function close() { var d = document.querySelector('[data-cart-drawer]'); if (d) { d.hidden = true; document.body.classList.remove('noscroll'); } }

  function render() {
    var cart = read();
    var count = cart.reduce(function (s, l) { return s + l.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count; el.hidden = count === 0;
    });
    var sub = subtotal();
    document.querySelectorAll('[data-cart-subtotal]').forEach(function (el) { el.textContent = '$' + sub.toFixed(2); });
    var lines = document.querySelector('[data-cart-lines]');
    if (lines) {
      if (!cart.length) {
        lines.innerHTML = '<p class="cartempty">Your cart is empty. <a href="/collection/bestsellers.html">Start with the bestsellers →</a></p>';
      } else {
        lines.innerHTML = cart.map(function (l) {
          var p = PRODUCTS[l.handle]; if (!p) return '';
          return '<div class="cartline">' +
            '<img src="' + p.image + '" alt="' + p.title.replace(/"/g, '&quot;') + '" onerror="this.onerror=null;this.src=\\'' + p.fallback + '\\'">' +
            '<div class="cartline-info"><a href="/products/' + p.handle + '.html">' + p.title + '</a>' +
            '<span class="cartline-price">$' + p.price.toFixed(2) + '</span>' +
            '<div class="qty"><button type="button" data-dec="' + p.handle + '" aria-label="Decrease quantity">−</button>' +
            '<span>' + l.qty + '</span>' +
            '<button type="button" data-inc="' + p.handle + '" aria-label="Increase quantity">+</button></div></div>' +
            '<button class="cartline-x" type="button" data-del="' + p.handle + '" aria-label="Remove ' + p.title.replace(/"/g, '&quot;') + '">✕</button>' +
          '</div>';
        }).join('');
      }
    }
    var bar = document.querySelector('[data-shipbar]');
    if (bar) {
      if (sub >= FREE && sub > 0) {
        bar.className = 'shipbar done';
        bar.innerHTML = '✓ You have unlocked <strong>free US shipping</strong>.';
      } else {
        var left = FREE - sub;
        bar.className = 'shipbar';
        bar.innerHTML = 'You are <strong>$' + Math.max(left, 0).toFixed(2) + '</strong> away from free US shipping.' +
          '<span class="shipbar-track"><span style="width:' + Math.min(100, (sub / FREE) * 100) + '%"></span></span>';
      }
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-cart-open],[data-cart-close],[data-inc],[data-dec],[data-del],[data-menu-open],[data-menu-close],[data-checkout],[data-qtybtn]');
    if (!t) return;
    if (t.hasAttribute('data-add')) { e.preventDefault(); add(t.getAttribute('data-add'), parseInt(t.getAttribute('data-qty') || '1', 10)); }
    else if (t.hasAttribute('data-cart-open')) { e.preventDefault(); open(); }
    else if (t.hasAttribute('data-cart-close')) { close(); }
    else if (t.hasAttribute('data-inc')) { var h = t.getAttribute('data-inc'); var l = read().filter(function (x) { return x.handle === h; })[0]; setQty(h, l.qty + 1); }
    else if (t.hasAttribute('data-dec')) { var h2 = t.getAttribute('data-dec'); var l2 = read().filter(function (x) { return x.handle === h2; })[0]; setQty(h2, l2.qty - 1); }
    else if (t.hasAttribute('data-del')) { setQty(t.getAttribute('data-del'), 0); }
    else if (t.hasAttribute('data-menu-open')) { var m = document.querySelector('[data-mobilemenu]'); m.hidden = false; t.setAttribute('aria-expanded', 'true'); }
    else if (t.hasAttribute('data-menu-close')) { var m2 = document.querySelector('[data-mobilemenu]'); m2.hidden = true; }
    else if (t.hasAttribute('data-checkout')) { var n = document.querySelector('[data-checkout-note]'); if (n) n.hidden = false; }
    else if (t.hasAttribute('data-qtybtn')) {
      var wrap = t.closest('.buybox-qty');
      var out = wrap.querySelector('input');
      var v = Math.max(1, parseInt(out.value || '1', 10) + (t.getAttribute('data-qtybtn') === 'up' ? 1 : -1));
      out.value = v;
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.hasAttribute && f.hasAttribute('data-newsletter')) {
      e.preventDefault();
      var ok = f.querySelector('[data-newsletter-ok]');
      if (ok) { ok.hidden = false; }
      var i = f.querySelector('input'); if (i) i.value = '';
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.addEventListener('DOMContentLoaded', render);
  render();
})();
</script>`;

const page = (title, desc, body, extraHead = "") => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://sniffari.example/">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="/assets/hero-illustration.png">
<meta name="theme-color" content="#16211C">
<link rel="stylesheet" href="/assets/styles.css">
<script src="/assets/products.js"></script>
${pixelPlaceholders()}
${extraHead}
</head>
<body>
${nav()}
<main id="main">
${body}
</main>
${footer()}
${searchJs()}
</body>
</html>`;

const productCard = (p) => `
<li class="card">
  <a class="card-media" href="/products/${p.handle}.html">
    <img src="${p.images[0]}" alt="${esc(p.title)}" loading="lazy" width="600" height="600"
         onerror="this.onerror=null;this.src='${placeholder(p.short, p.tints[0])}'">
    ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
    <span class="save">Save ${savePct(p)}%</span>
  </a>
  <div class="card-body">
    <h3><a href="/products/${p.handle}.html">${esc(p.short)}</a></h3>
    <p class="card-hook">${esc(p.hero || p.hook)}</p>
    <p class="card-price"><strong>${money(p.price)}</strong> <s>${money(p.compareAt)}</s></p>
    <button class="btn btn-ink btn-block" type="button" data-add="${p.handle}">Add to cart</button>
  </div>
</li>`;

const stars = () => `<span class="stars" aria-hidden="true">★★★★★</span>`;

// ───────────────────────────────────────────────────────────── pages
const home = () => {
  const featured = products.filter((p) => p.collections.includes("bestsellers")).slice(0, 4);
  const enrich = products.filter((p) => p.collections.includes("enrichment")).slice(0, 3);
  return page(
    `${brand.name} — ${brand.tagline}`,
    `${brand.promise}. Snuffle mats, slow feeders, lick mats, self-cleaning brushes and pet hair rollers. Free US shipping over $${brand.freeShipThreshold}.`,
    `
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">For dogs &amp; cats who live indoors</p>
      <h1>A bored pet is an expensive pet.</h1>
      <p class="lead">Snuffle mats, slow feeders and lick mats turn a 40-second meal into fifteen minutes
      of nose work — the closest thing to a walk you can do on a rainy Tuesday.</p>
      <div class="hero-cta">
        <a class="btn btn-clay" href="/collection/bestsellers.html">Shop bestsellers</a>
        <a class="btn btn-ghost" href="/collection/bundles.html">See the bundles</a>
      </div>
      <ul class="hero-points">
        <li>No batteries, no apps, no subscriptions</li>
        <li>Free US shipping over $${brand.freeShipThreshold}</li>
        <li>30-day returns, no arguing</li>
      </ul>
    </div>
    <div class="hero-art">
      <img src="/assets/hero-illustration.png" alt="Illustration of a dog sniffing a textured snuffle mat on a living-room floor"
           width="1024" height="1024">
    </div>
  </div>
</section>

<section class="trustbar">
  <div class="wrap trustbar-in">
    <div class="trust"><span class="ti">${ICON.truck}</span><div><strong>Ships straight to you</strong><p>${esc(brand.shipPromise)}</p></div></div>
    <div class="trust"><span class="ti">${ICON.returns}</span><div><strong>30-day returns</strong><p>Unused and unwashed, we take it back</p></div></div>
    <div class="trust"><span class="ti">${ICON.battery}</span><div><strong>Nothing to charge</strong><p>No batteries, no app, no subscription</p></div></div>
    <div class="trust"><span class="ti">${ICON.wash}</span><div><strong>Actually washable</strong><p>Machine or top-rack dishwasher</p></div></div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sectionhead">
      <div><p class="eyebrow">Start here</p><h2>The three that sell themselves</h2></div>
      <a class="textlink" href="/collection/bestsellers.html">All bestsellers →</a>
    </div>
    <ul class="grid grid-4">${featured.slice(0, 3).map(productCard).join("")}</ul>
  </div>
</section>

<section class="section band">
  <div class="wrap">
    <div class="sectionhead"><div><p class="eyebrow">Why it works</p><h2>enrichment isn't a luxury. It's the cheapest behaviour fix there is.</h2></div></div>
    <div class="benefits">
      <div class="benefit"><span class="bnum">01</span><h3>Sniffing tires a dog out faster than walking</h3>
        <p>Fifteen minutes of nose work does more for a restless indoor dog than a thirty-minute march
        around the block. That is the entire reason a snuffle mat exists.</p></div>
      <div class="benefit"><span class="bnum">02</span><h3>Fast eating is the thing owners notice first</h3>
        <p>If dinner is over in under a minute, the bowl is doing nothing. A maze bowl buys you ten
        minutes of calm and a dog that settles afterwards.</p></div>
      <div class="benefit"><span class="bnum">03</span><h3>Fur is a maintenance job, not an event</h3>
        <p>Two minutes with a glove, once a day, beats an hour of wrestling once a month. Every grooming
        tool here is designed to be quick enough that you actually do it.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sectionhead"><div><p class="eyebrow">Enrichment</p><h2>Food puzzles that get used twice a day</h2></div>
      <a class="textlink" href="/collection/enrichment.html">All enrichment →</a></div>
    <ul class="grid grid-3">${enrich.map(productCard).join("")}</ul>
  </div>
</section>

<section class="section band-sand">
  <div class="wrap">
    <div class="sectionhead"><div><p class="eyebrow">Honest social proof</p><h2>We have no reviews yet. Here's exactly why.</h2></div></div>
    <div class="honest">
      <div class="honest-card">
        <p class="honest-lead">This is a brand-new store. It has not shipped an order yet.</p>
        <p>That means there are no customer reviews on this page — and I am not going to invent any.
        Fake or AI-generated testimonials are not just tacky, they are illegal in the US under the FTC's
        rules on deceptive reviews, and one screenshot of a fake review can end a small store's reputation.</p>
        <p><strong>What we can show you instead:</strong> the exact supplier listings every product is sourced
        from, with their live ratings and units-sold figures — links in each product page's
        "Where this comes from" section. Judge the product on the supplier's real feedback, not our fiction.</p>
        <p class="honest-note">This block is designed to be replaced. As real reviews come in — through the
        post-purchase email flow set up in the launch kit — swap this section for a review carousel.
        Honest placeholder now, real proof later.</p>
        <a class="btn btn-ink" href="/pages/about.html">Read how we choose products</a>
      </div>
      <div class="honest-side">
        <h3>What we promise instead of testimonials</h3>
        <ul class="ticks">
          <li>Supplier rating and units sold printed on every product page</li>
          <li>Honest 7–15 day delivery window, not a fake 2-day promise</li>
          <li>30-day returns, written in plain English</li>
          <li>No countdown timers, no "only 3 left", ever</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <div class="sectionhead"><div><p class="eyebrow">Questions</p><h2>The ones people actually ask</h2></div>
      <a class="textlink" href="/pages/faq.html">Full FAQ →</a></div>
    <details class="faq"><summary>How long does shipping take?</summary>
      <p>Most US orders arrive in <strong>7–15 days</strong>. Items ship directly from our supplier
      partners, which is how we keep prices where they are. You get tracking by email as soon as it is
      dispatched, and you can check status any time on the <a href="/pages/track-order.html">track your order</a> page.</p></details>
    <details class="faq"><summary>Why is it not 2-day shipping like a big store?</summary>
      <p>Because we are not stocking a warehouse. Two-day shipping would mean buying inventory up front
      and charging you for it. We would rather be honest about a 7–15 day window than promise two days
      and miss it — which is the single most common complaint about stores like this one.</p></details>
    <details class="faq"><summary>What if my pet doesn't like it?</summary>
      <p>Send it back unused within 30 days of delivery and we refund the item price. Full details,
      including who pays return postage, are in the <a href="/pages/refund-policy.html">refund policy</a>.</p></details>
    <details class="faq"><summary>Are these safe for a puppy or a chewer?</summary>
      <p>Nothing here is a chew toy. Snuffle mats and lick mats are feeding tools and should be used
      supervised, then put away. If your pet destroys fabric or silicone, take it away and try again
      when they are calmer — swallowed fabric or silicone is a vet visit.</p></details>
    <details class="faq"><summary>Do you make health claims?</summary>
      <p>No. Nothing here treats, cures or prevents anything. These are enrichment and grooming
      accessories. If your pet has a diagnosed condition or a behaviour problem, that is a
      conversation with your vet or a qualified trainer, not a shopping cart.</p></details>
  </div>
</section>

<section class="section band-ink">
  <div class="wrap narrow emailcap">
    <h2>Get 10% off your first order</h2>
    <p>One email, one code, then only the occasional useful thing. No daily spam, no "last chance" nonsense.</p>
    <form class="newsletter newsletter-wide" data-newsletter novalidate>
      <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
      <button class="btn btn-clay" type="submit">Send my code</button>
      <p class="newsletter-ok" data-newsletter-ok hidden>Thanks — check your inbox for the code. (Preview only: no email is sent from this preview.)</p>
    </form>
  </div>
</section>
`
  );
};

const collectionPage = (c) => {
  const items = products.filter((p) => p.collections.includes(c.handle));
  return page(
    `${c.title} — ${brand.name}`,
    c.blurb,
    `
<section class="pagehead">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>${esc(c.title)}</span></nav>
    <h1>${esc(c.title)}</h1>
    <p class="lead">${esc(c.blurb)}</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="resultcount">${items.length} product${items.length === 1 ? "" : "s"}</p>
    <ul class="grid grid-4">${items.map(productCard).join("")}</ul>
    <div class="infobox">
      <h2>Not sure where to start?</h2>
      <p>The <a href="/products/snuffle-mat.html">Snuffle Mat</a> and the
      <a href="/products/fur-lifter.html">Fur Lifter</a> are the two products that solve the most common
      complaints. If you want both problems handled at once, the
      <a href="/collection/bundles.html">bundles</a> save you between 12% and 17%.</p>
    </div>
  </div>
</section>`
  );
};

const productPage = (p) => {
  const related = products
    .filter((x) => x.handle !== p.handle && x.collections.some((c) => p.collections.includes(c)))
    .slice(0, 3);
  const bundleTarget = products.filter((x) => x.collections.includes("bundles"))[0];
  return page(
    `${p.short} · ${brand.name}`,
    `${p.hook} ${p.bullets[0]}`.slice(0, 300),
    `
<section class="section productpage">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/index.html">Home</a> <span>/</span>
      <a href="/collection/${p.collections[0]}.html">${esc((collections.find((c) => c.handle === p.collections[0]) || {}).title || "Shop")}</a>
      <span>/</span> <span>${esc(p.short)}</span>
    </nav>
    <div class="pdp">
      <div class="gallery">
        <div class="gallery-main">
          <img id="pdp-main" src="${p.images[0]}" alt="${esc(p.title)}" width="600" height="600"
               onerror="this.onerror=null;this.src='${placeholder(p.short, p.tints[0])}'">
        </div>
        <ul class="thumbs">
          ${p.images
            .map(
              (src, i) => `<li><button type="button" class="thumb${i === 0 ? " is-active" : ""}"
            data-thumb="${src}" data-fallback="${placeholder(p.short, p.tints[i % p.tints.length])}"
            aria-label="View image ${i + 1} of ${p.images.length}">
            <img src="${src}" alt="${esc(p.short)} — view ${i + 1}" loading="lazy" width="120" height="120"
                 onerror="this.onerror=null;this.src='${placeholder(p.short, p.tints[i % p.tints.length])}'">
          </button></li>`
            )
            .join("")}
        </ul>
      </div>

      <div class="buybox">
        ${p.badge ? `<span class="pill">${esc(p.badge)}</span>` : ""}
        <h1>${esc(p.short)}</h1>
        <p class="pdp-hook">${esc(p.hook)}</p>
        <p class="pdp-price"><strong>${money(p.price)}</strong> <s>${money(p.compareAt)}</s> <span class="pdp-save">Save ${savePct(p)}%</span></p>
        <p class="pdp-tax">Free US shipping over $${brand.freeShipThreshold} · ${esc(brand.shipPromise)}</p>

        <div class="buybox-qty">
          <label for="qty">Quantity</label>
          <button type="button" data-qtybtn="down" aria-label="Decrease quantity">−</button>
          <input id="qty" name="qty" type="number" min="1" value="1" inputmode="numeric">
          <button type="button" data-qtybtn="up" aria-label="Increase quantity">+</button>
        </div>

        <button class="btn btn-clay btn-block btn-lg" type="button" data-add="${p.handle}">Add to cart — ${money(p.price)}</button>
        <p class="pdp-under">Or 4 interest-free payments at checkout where available. Taxes calculated at checkout.</p>

        <ul class="ticks pdp-ticks">
          <li>${esc(brand.shipPromise)} with tracking</li>
          <li>30-day returns — see the <a href="/pages/refund-policy.html">refund policy</a></li>
          <li>No batteries, no app, no subscription</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section band-sand">
  <div class="wrap pdp-cols">
    <div>
      <h2>${esc(p.intro.split(".")[0])}.</h2>
      <p>${esc(p.intro)}</p>
      <h3>What it actually does</h3>
      <ul class="ticks">${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>
    <div>
      <h3>Specs</h3>
      <table class="specs"><tbody>
        ${p.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
      </tbody></table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <h2>${esc(p.short)} — questions</h2>
    ${p.faq.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}

    <h2 class="mt">Shipping &amp; returns, in one paragraph</h2>
    <p>Ships from our supplier partner directly to you. Most US orders arrive in
    <strong>7–15 days</strong>, and you get tracking by email when it leaves. Returns are accepted within
    30 days of delivery if the item is unused and unwashed — see the
    <a href="/pages/shipping-policy.html">shipping policy</a> and
    <a href="/pages/refund-policy.html">refund policy</a> for the details, including who pays return postage.</p>

    <h2 class="mt">Where this comes from</h2>
    <div class="supplierbox">
      <p class="supplier-label">Supplier listing used for this product:</p>
      <p><a href="${p.supplier.url}" target="_blank" rel="noopener nofollow">${esc(p.supplier.label)}</a>
        ${p.supplier.altUrl ? `· <a href="${p.supplier.altUrl}" target="_blank" rel="noopener nofollow">alternate listing</a>` : ""}</p>
      <ul class="ticks">
        <li>Observed supplier price: <strong>${esc(p.supplier.observedPrice)}</strong></li>
        <li>Supplier feedback: <strong>${esc(p.supplier.evidence)}</strong></li>
        <li>Delivery to the US: <strong>${esc(p.supplier.shipping)}</strong></li>
      </ul>
      <p class="supplier-note">We publish this so you can judge the source yourself. Prices and delivery
      estimates are recorded from the listing on 2026-10-02 and can change — your order is always charged
      the price shown at checkout.</p>
    </div>
    <h2 class="mt">Care &amp; safety</h2>
    <p>Supervise use. This is not a chew toy and it is not indestructible. Wash per the specs above and
    replace it if it tears — a swallowed piece of fabric or silicone is a vet visit. Nothing on this page
    is medical advice or a treatment for any condition.</p>
  </div>
</section>

${
  bundleTarget && bundleTarget.handle !== p.handle
    ? `<section class="section band">
  <div class="wrap">
    <h2>Buying more than one? Bundles save 12–17%</h2>
    <p class="lead">The bundles pair this with the other things people buy at the same time — and they
    are the cheapest way to clear the free-shipping threshold.</p>
    <ul class="grid grid-3">${products
      .filter((x) => x.collections.includes("bundles"))
      .slice(0, 3)
      .map(productCard)
      .join("")}</ul>
  </div>
</section>`
    : ""
}

<section class="section">
  <div class="wrap">
    <h2>Goes well with</h2>
    <ul class="grid grid-3">${related.map(productCard).join("")}</ul>
  </div>
</section>

<script>
document.querySelectorAll('[data-thumb]').forEach(function (b) {
  b.addEventListener('click', function () {
    var m = document.getElementById('pdp-main');
    m.src = b.getAttribute('data-thumb');
    m.onerror = function () { this.onerror = null; this.src = b.getAttribute('data-fallback'); };
    document.querySelectorAll('.thumb').forEach(function (x) { x.classList.remove('is-active'); });
    b.classList.add('is-active');
  });
});
</script>`
  );
};

const staticPages = {
  about: () =>
    page(
      `About ${brand.name}`,
      `How ${brand.name} picks products, and what we refuse to do.`,
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>About</span></nav><h1>About ${esc(brand.name)}</h1><p class="lead">We sell the small, unglamorous things that make living with an indoor pet easier.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <h2>Why this store exists</h2>
  <p>Most pet stores sell you the fun stuff: a toy shaped like a taco, a bed in the shape of a donut.
  Meanwhile the two things that actually change daily life — a bored animal and a house covered in fur —
  get nothing.</p>
  <p>${esc(brand.name)} stocks only the unglamorous jobs:</p>
  <ul class="ticks">
    <li><strong>Boredom.</strong> Snuffle mats, lick mats and slow feeders that turn a meal into a job.</li>
    <li><strong>Fur.</strong> A roller, a slicker brush and a glove that between them handle 95% of shedding.</li>
    <li><strong>The outside coming inside.</strong> A paw cleaner cup and a leakproof walk bottle.</li>
  </ul>

  <h2>How we choose products</h2>
  <p>Every product has to clear the same bar before it goes on the site:</p>
  <ol class="numbered">
    <li><strong>It solves something specific.</strong> If we cannot describe the problem in one sentence, it does not go in.</li>
    <li><strong>It demos in fifteen seconds.</strong> If it is not obvious on camera, we cannot show you why it is worth buying.</li>
    <li><strong>It costs 3× less than it sells for.</strong> Otherwise shipping and returns eat the business and the price goes up.</li>
    <li><strong>It is small, light and hard to break.</strong> Nothing fragile, nothing heavy, nothing with a battery that can fail.</li>
    <li><strong>It has real supplier feedback.</strong> We print the supplier's rating and units sold on the product page, so you can see what we saw.</li>
  </ol>

  <h2>What we refuse to do</h2>
  <ul class="ticks">
    <li><strong>No fake reviews.</strong> Not one. The review section says so out loud until real reviews exist.</li>
    <li><strong>No fake urgency.</strong> No countdown timers, no "only 3 left", no "17 people are looking at this".</li>
    <li><strong>No health claims.</strong> Nothing here treats, cures or prevents anything.</li>
    <li><strong>No invented shipping times.</strong> We quote 7–15 days because that is what the carriers actually do.</li>
    <li><strong>No branded or knock-off goods.</strong> Everything is unbranded, generic and legally clean.</li>
  </ul>

  <h2>How the money works</h2>
  <p>We do not hold stock. When you order, our supplier partner packs and ships your item directly, which
  is why delivery takes 7–15 days instead of two, and why prices are what they are. It also means we only
  make money if the product is good enough that you do not return it — which is a decent incentive.</p>

  <h2>Where we are</h2>
  <p>${esc(brand.name)} is a small independent store. Questions, problems, or a product you think we should
  stock: <a href="/pages/contact.html">contact us</a> — a human answers, usually within one business day.</p>
</div></section>`
    ),

  contact: () =>
    page(
      `Contact ${brand.name}`,
      `Contact the ${brand.name} team — order help, returns, or product suggestions.`,
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Contact</span></nav><h1>Contact us</h1><p class="lead">A human reads every message. Usually a reply within one business day.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <div class="contactgrid">
    <div><h3>Order &amp; delivery questions</h3><p>Include your order number (it starts with #SN) and the email you used.</p></div>
    <div><h3>Returns</h3><p>Tell us the order number and what went wrong. Refunds follow the <a href="/pages/refund-policy.html">refund policy</a>.</p></div>
    <div><h3>Product suggestions</h3><p>Tell us the problem you are trying to solve, not the product. We source from problems.</p></div>
  </div>
  <form class="contactform" onsubmit="event.preventDefault(); this.querySelector('[data-sent]').hidden=false; this.reset();">
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" type="text" autocomplete="name" required></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="c-order">Order number <span class="opt">(optional)</span></label><input id="c-order" name="order" type="text" placeholder="#SN0000"></div>
    <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="6" required></textarea></div>
    <button class="btn btn-clay" type="submit">Send message</button>
    <p class="formok" data-sent hidden>Thanks — your message is queued. (Preview only: this form is not connected to a mailbox yet. Connect it in Shopify's contact form or to a free form service before launch.)</p>
  </form>
  <div class="infobox">
    <h2>Contact details</h2>
    <p>Email: <strong>${esc(brand.email)}</strong> — <em>placeholder, replace with your real address before launch.</em></p>
    <p>Support hours: Monday to Friday, 9am–5pm. We do not operate a phone line; email keeps everything in writing, which protects you on returns.</p>
  </div>
</div></section>`
    ),

  faq: () => {
    const groups = [
      [
        "Ordering & payment",
        [
          ["What payment methods do you take?", "Card payments and the usual wallets are handled by our checkout provider. We never see or store your card details. Available methods are shown at checkout based on your country."],
          ["Do you charge sales tax?", "Sales tax is calculated at checkout based on your delivery address, wherever it applies. The price you see on the product page is before tax and shipping."],
          ["Can I change or cancel my order?", "If the order has not been dispatched yet, yes — email us with your order number as soon as you can. Once it is with the carrier we cannot recall it, but you can use the returns process when it arrives."],
          ["Is there a discount code?", "New customers get 10% off for signing up to the email list — the code arrives instantly. Bundles are already discounted 12–17% and stack on top."],
        ],
      ],
      [
        "Shipping",
        [
          ["How long will my order take?", "Most US orders arrive in 7–15 days. Every order gets tracking by email when it dispatches, and you can check status on the track your order page."],
          ["Why does it take longer than Amazon?", "We do not hold stock. Your item is packed and shipped by our supplier partner, which is what keeps prices low and means we never charge you for inventory we are guessing at."],
          ["Do you ship outside the US?", "The store is set up for US delivery at launch. International options are being added — contact us and we will tell you honestly whether we can ship to you yet."],
          ["What does shipping cost?", "Free over $35. Below that it is a flat $4.95 in the US."],
          ["My tracking has not updated in a few days.", "That is normal on international legs — tracking often pauses between handover points. If it has been more than 15 business days with no movement, contact us and we will chase it, then refund or reship under the refund policy."],
        ],
      ],
      [
        "Returns & problems",
        [
          ["What if it arrives damaged or wrong?", "Send a photo with your order number within 7 days. We will replace it or refund it in full, including shipping — you do not pay return postage when the fault is ours."],
          ["What if my pet just does not like it?", "Return it unused and unwashed within 30 days of delivery for a refund of the item price. See the refund policy for who pays return postage."],
          ["How long do refunds take?", "We process refunds within 2 business days of receiving the return or approving the claim. Your bank then takes 5–10 business days to post it."],
        ],
      ],
      [
        "The products",
        [
          ["Are any of these safe to leave with a pet unattended?", "No. Supervise, then put them away. Snuffle mats, lick mats and slow feeders are feeding tools, not chew toys, and none of them are indestructible."],
          ["Do any products need batteries or an app?", "No. There is no electronic device in this store and there never will be a subscription."],
          ["Are these vet-approved or do they treat anything?", "No, and we will never claim that. They are enrichment and grooming accessories. For a diagnosed condition or a serious behaviour problem, talk to your vet or a qualified trainer."],
          ["How do I clean them?", "Each product page has the exact care instructions in the specs table. As a rule: bowl and lick mat are dishwasher safe, snuffle mat is machine washable and air dry, brushes and rollers just need emptying and a wipe."],
        ],
      ],
    ];
    return page(
      `FAQ — ${brand.name}`,
      "Shipping times, returns, payments and product safety — answered honestly.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>FAQ</span></nav><h1>Frequently asked questions</h1><p class="lead">Short answers, no small print games. Including the ones that cost us sales.</p></div></section>
<section class="section"><div class="wrap narrow">
${groups
  .map(
    ([g, items]) => `<h2>${esc(g)}</h2>
${items.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}`
  )
  .join("")}
<div class="infobox"><h2>Still stuck?</h2><p><a href="/pages/contact.html">Contact us</a> with your order number and we will sort it.</p></div>
</div></section>`
    );
  },

  "shipping-policy": () =>
    page(
      `Shipping Policy — ${brand.name}`,
      "Honest delivery times, costs and zones for Sniffari orders.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Shipping policy</span></nav><h1>Shipping policy</h1><p class="lead">Last updated 2 October 2026. Written to be read, not to hide things.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <h2>The short version</h2>
  <ul class="ticks">
    <li><strong>US delivery: 7–15 days</strong> for most orders, tracked.</li>
    <li><strong>Free shipping over $${brand.freeShipThreshold}.</strong> Below that, a flat $4.95 in the US.</li>
    <li>Orders are processed in <strong>1–3 business days</strong>, then shipped.</li>
    <li>Your item ships <strong>directly from our supplier partner</strong> — we do not hold stock.</li>
    <li>Tracking number by email as soon as it dispatches.</li>
  </ul>

  <h2>Processing time</h2>
  <p>Orders placed before 12pm on a business day are usually submitted to the supplier the same day.
  Orders placed at weekends or on public holidays go out the next business day. Processing takes
  1–3 business days, and you will get a confirmation email at each step.</p>

  <h2>Delivery times</h2>
  <table class="specs"><tbody>
    <tr><th scope="row">United States (standard)</th><td>7–15 business days</td></tr>
    <tr><th scope="row">United States (US-warehouse items, when available)</th><td>3–7 business days</td></tr>
    <tr><th scope="row">Tracking</th><td>Included on all orders</td></tr>
    <tr><th scope="row">Shipping cost</th><td>Free over $${brand.freeShipThreshold}, otherwise $${brand.flatShipping.toFixed(2)}</td></tr>
  </tbody></table>
  <p class="small">Delivery estimates are estimates. Carrier delays, customs checks and peak season
  (late November to late December) can add time. We would rather tell you that up front than have you
  discover it.</p>

  <h2>International orders</h2>
  <p>At launch we ship to the United States only. We are adding international destinations; if you are
  outside the US, <a href="/pages/contact.html">contact us</a> and we will tell you honestly whether we
  can reach you yet.</p>

  <h2>Split shipments</h2>
  <p>Bundles contain items that may be stored in different supplier locations. Occasionally they ship
  separately and arrive a day or two apart. You will get tracking for each parcel, and you are never
  charged extra shipping for a split order.</p>

  <h2>Customs, duties and import tax</h2>
  <p>US orders under the current de minimis threshold are not subject to import duty in normal
  circumstances. If any customs charge is applied to your order, it is your responsibility — this is rare
  for the product types and values we sell, but it is a real possibility in any cross-border shipment and
  we will not pretend otherwise.</p>

  <h2>Incorrect addresses</h2>
  <p>Please check your address at checkout — it is the single most common reason a parcel goes missing.
  If you spot an error, email us immediately. Once dispatched we cannot redirect a parcel, and a
  replacement for an address you entered incorrectly is not covered by the refund policy.</p>

  <h2>Lost in transit</h2>
  <p>If tracking shows no movement for more than 15 business days, contact us. We will investigate with
  the carrier, and if the parcel is genuinely lost we will reship or refund — see the
  <a href="/pages/refund-policy.html">refund policy</a>.</p>

  <h2>Questions</h2>
  <p><a href="/pages/contact.html">Contact us</a> with your order number. Support hours are Monday to
  Friday, 9am–5pm, and a human answers.</p>
</div></section>`
    ),

  "refund-policy": () =>
    page(
      `Refund Policy — ${brand.name}`,
      "30-day returns, who pays postage, and how refunds are processed.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Refund policy</span></nav><h1>Refund policy</h1><p class="lead">Last updated 2 October 2026. Plain English, including the parts that are not in your favour.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <h2>The short version</h2>
  <ul class="ticks">
    <li><strong>30 days</strong> from delivery to request a return on unused, unwashed items.</li>
    <li><strong>Damaged, defective or wrong item?</strong> We pay return postage and refund or replace in full.</li>
    <li><strong>Changed your mind or your pet does not like it?</strong> You pay return postage; we refund the item price.</li>
    <li>Refunds are processed within <strong>2 business days</strong> of approval.</li>
  </ul>

  <h2>What qualifies for a return</h2>
  <ul class="ticks">
    <li>Requested within 30 days of the delivery date.</li>
    <li>Item unused, unwashed, undamaged, and in its original packaging.</li>
    <li>Order number provided.</li>
  </ul>

  <h2>What does not qualify</h2>
  <ul class="ticks">
    <li>Items that have been chewed, torn, or damaged by a pet.</li>
    <li>Items washed or used (for hygiene reasons — food-contact mats and bowls cannot be resold).</li>
    <li>Returns requested more than 30 days after delivery.</li>
    <li>Orders where an incorrect delivery address was supplied and the parcel was lost as a result.</li>
    <li>Items damaged by misuse or by leaving them somewhere unsuitable.</li>
  </ul>

  <h2>How to start a return</h2>
  <ol class="numbered">
    <li><a href="/pages/contact.html">Contact us</a> with your order number and the reason.</li>
    <li>We reply within one business day with the return address and instructions.</li>
    <li>Ship the item back. If the fault is ours, we cover postage — send us the receipt and we reimburse it.</li>
    <li>Once received and checked, we refund within 2 business days.</li>
  </ol>

  <h2>Damaged or defective on arrival</h2>
  <p>Send a photo of the item and the packaging within <strong>7 days</strong> of delivery. We will replace
  it, or refund it in full including shipping — your choice. No return postage cost to you.</p>

  <h2>Wrong item sent</h2>
  <p>Same as damaged: photo within 7 days, we cover everything. Keep the wrong item — posting it back is
  usually more expensive than the item and worse for the planet.</p>

  <h2>How long refunds take</h2>
  <p>We approve and process refunds within 2 business days. Your bank or card issuer then needs
  5–10 business days to post the credit. If it has not appeared after 10 business days, contact us and we
  will send you the refund reference.</p>

  <h2>Order cancellations</h2>
  <p>Email us as soon as possible. If the order has not been submitted to the supplier, we cancel it and
  refund in full. If it has already shipped, the return process applies instead.</p>

  <h2>Late or missing deliveries</h2>
  <p>If tracking shows no movement for 15 business days, contact us. We will chase the carrier, and if the
  parcel is lost we will reship or refund in full — your choice. This does not affect your other rights.</p>

  <h2>Your statutory rights</h2>
  <p>Nothing in this policy limits any rights you have under applicable consumer protection law. Where
  this policy and the law conflict, the law wins.</p>
</div></section>`
    ),

  "privacy-policy": () =>
    page(
      `Privacy Policy — ${brand.name}`,
      "What data this store collects, why, and how to have it deleted.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Privacy policy</span></nav><h1>Privacy policy</h1><p class="lead">Last updated 2 October 2026.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <p class="small"><em>This is a good-faith, plain-English policy template for a small store. It is not legal
  advice. Have a lawyer review it against your jurisdiction, and against GDPR/CCPA obligations if you
  sell into California or the EU.</em></p>

  <h2>What we collect</h2>
  <ul class="ticks">
    <li><strong>Order information:</strong> name, delivery address, email, phone number if you supply one, and what you bought.</li>
    <li><strong>Payment information:</strong> handled entirely by our payment provider. <strong>We never see or store your card number.</strong></li>
    <li><strong>Contact messages:</strong> whatever you write to us, and your email address.</li>
    <li><strong>Basic technical data:</strong> the pages you visit on this store and how you arrived, so we can see what is working.</li>
  </ul>

  <h2>Why we collect it</h2>
  <ul class="ticks">
    <li>To take payment and deliver your order — including passing your delivery details to the supplier who ships it.</li>
    <li>To send order confirmations and tracking.</li>
    <li>To handle returns, refunds and support.</li>
    <li>To send marketing emails — <strong>only if you opted in</strong>. Every marketing email has a one-click unsubscribe.</li>
    <li>To measure store performance and prevent fraud.</li>
  </ul>

  <h2>Who we share it with</h2>
  <ul class="ticks">
    <li><strong>Our payment provider</strong> — to process your payment.</li>
    <li><strong>Our supplier and shipping partners</strong> — only the details needed to pack and deliver your order (name, address, items).</li>
    <li><strong>Our email and analytics providers</strong> — to send order emails and to measure site usage.</li>
    <li>We do <strong>not</strong> sell your personal information.</li>
  </ul>

  <h2>Cookies</h2>
  <p>This store uses essential cookies to run the cart and checkout, and analytics cookies to understand
  which pages work. You can block cookies in your browser; the cart and checkout may not function
  correctly if you do.</p>

  <h2>How long we keep it</h2>
  <p>Order records are kept as long as required for tax and accounting rules in our jurisdiction. Marketing
  contact details are kept until you unsubscribe. Support emails are kept for two years.</p>

  <h2>Your rights</h2>
  <p>You can ask for a copy of the data we hold about you, ask us to correct it, or ask us to delete it —
  and we will, except where we are legally required to keep order records. Email us at
  <strong>${esc(brand.email)}</strong> (placeholder) and we will respond within 30 days.</p>

  <h2>Children</h2>
  <p>This store is not directed at children and we do not knowingly collect data from anyone under 16.</p>

  <h2>Changes</h2>
  <p>If this policy changes materially we will update the date at the top of the page. Continued use of the
  store after a change means you accept the updated policy.</p>

  <h2>Contact</h2>
  <p>Privacy questions: <a href="/pages/contact.html">contact us</a>.</p>
</div></section>`
    ),

  "terms-of-service": () =>
    page(
      `Terms of Service — ${brand.name}`,
      "The terms that apply when you buy from Sniffari.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Terms of service</span></nav><h1>Terms of service</h1><p class="lead">Last updated 2 October 2026.</p></div></section>
<section class="section"><div class="wrap narrow prose">
  <p class="small"><em>Plain-English template terms for a small store. Not legal advice — have them reviewed for your jurisdiction before launch.</em></p>

  <h2>1. About these terms</h2>
  <p>By placing an order on this store you agree to these terms. If you do not agree, please do not order.
  We may update these terms; the version that applies to your order is the one published when you bought.</p>

  <h2>2. Who we are</h2>
  <p>${esc(brand.name)} is a small independent online retailer. <em>Owner legal entity, trading address and
  registration details must be inserted here before launch.</em></p>

  <h2>3. Products</h2>
  <p>We describe every product as accurately as we can, including supplier ratings and observed delivery
  windows. Product colours and packaging can vary slightly between supplier batches. Nothing we sell is a
  medical device, a treatment, or a substitute for veterinary advice.</p>

  <h2>4. Prices and payment</h2>
  <p>Prices are shown in US dollars. Prices and availability can change without notice, but the price shown
  at checkout is the price that applies to your order. Taxes are calculated at checkout where applicable.
  Payment is taken at the time of order by our payment provider.</p>

  <h2>5. Shipping and delivery</h2>
  <p>Delivery estimates are estimates, not guarantees. Our current estimate and the details of processing
  times, split shipments and customs are set out in the <a href="/pages/shipping-policy.html">shipping policy</a>,
  which forms part of these terms.</p>

  <h2>6. Returns and refunds</h2>
  <p>Returns are governed by the <a href="/pages/refund-policy.html">refund policy</a>, which forms part of
  these terms. It does not limit any statutory rights you have.</p>

  <h2>7. Your responsibilities</h2>
  <ul class="ticks">
    <li>Provide an accurate delivery address and contact details.</li>
    <li>Supervise your pet when using any product we sell. None of our products are chew toys and none are indestructible.</li>
    <li>Follow the care and safety instructions on the product page.</li>
    <li>Do not use this store for anything unlawful, or attempt to disrupt or scrape it.</li>
  </ul>

  <h2>8. Product safety and no health claims</h2>
  <p>Our products are enrichment and grooming accessories. They do not diagnose, treat, cure or prevent any
  condition in any animal, and we make no such claim. If your pet has a health or behaviour problem,
  consult a veterinarian or qualified trainer. Stop using any product immediately if it becomes damaged.</p>

  <h2>9. Limitation of liability</h2>
  <p>To the fullest extent permitted by law, our liability for any claim relating to an order is limited to
  the amount you paid for that order. We are not liable for indirect or consequential losses, or for
  damage caused by misuse, by unsupervised chewing, or by failing to follow care instructions. Nothing here
  excludes liability that cannot legally be excluded.</p>

  <h2>10. Intellectual property</h2>
  <p>The ${esc(brand.name)} name, logo, copy and site design belong to us. Supplier product photography is
  used with reference to the originating listings and remains the property of its owners.</p>

  <h2>11. Governing law</h2>
  <p>These terms are governed by the laws of <em>[insert your state/country]</em>, and disputes will be
  handled by the courts of that jurisdiction.</p>

  <h2>12. Contact</h2>
  <p><a href="/pages/contact.html">Contact us</a> for anything relating to these terms.</p>
</div></section>`
    ),

  "track-order": () =>
    page(
      `Track Your Order — ${brand.name}`,
      "Enter your order number to see where your parcel is.",
      `
<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/index.html">Home</a> <span>/</span> <span>Track your order</span></nav><h1>Track your order</h1><p class="lead">Enter the order number from your confirmation email (it looks like #SN1042).</p></div></section>
<section class="section"><div class="wrap narrow">
  <form class="trackform" onsubmit="event.preventDefault(); this.querySelector('[data-tracked]').hidden=false; this.querySelector('[data-tracked]').scrollIntoView({block:'nearest'});">
    <div class="field"><label for="t-order">Order number</label><input id="t-order" name="order" type="text" placeholder="#SN1042" required></div>
    <div class="field"><label for="t-email">Email used on the order</label><input id="t-email" name="email" type="email" required></div>
    <button class="btn btn-clay" type="submit">Track order</button>
  </form>
  <div class="infobox" data-tracked hidden>
    <h2>How tracking works here</h2>
    <p><strong>This preview page is not connected to a live system yet.</strong> Once the store is live,
    this page is replaced by Shopify's order-status app (free), which emails and displays live carrier
    tracking automatically.</p>
    <p>What you should expect in the meantime: a dispatch email with a tracking number when the supplier
    hands your parcel to the carrier, and status updates at each handover. Tracking can pause for a few days
    during international handover — that is normal and not a lost parcel.</p>
    <p>No movement for more than 15 business days? <a href="/pages/contact.html">Contact us</a> and we will
    chase it, then reship or refund under the <a href="/pages/refund-policy.html">refund policy</a>.</p>
  </div>
  <div class="infobox">
    <h2>Typical timeline for a US order</h2>
    <table class="specs"><tbody>
      <tr><th scope="row">Day 0</th><td>Order placed, confirmation email sent</td></tr>
      <tr><th scope="row">Day 1–3</th><td>Packed and submitted to the carrier</td></tr>
      <tr><th scope="row">Day 3–15</th><td>In transit to you, tracking updates at handover points</td></tr>
      <tr><th scope="row">Day 7–15</th><td>Delivered for most US orders</td></tr>
    </tbody></table>
    <p class="small">During the last week of November and the first three weeks of December, add about
    5–7 days. Peak season is genuinely slower everywhere, and it is better to plan for it.</p>
  </div>
</div></section>`
    ),
};

// ───────────────────────────────────────────────────────────── write
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "collection"), { recursive: true });
mkdirSync(join(OUT, "products"), { recursive: true });
mkdirSync(join(OUT, "pages"), { recursive: true });
mkdirSync(ASSETS, { recursive: true });

const write = (rel, content) => {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  return p;
};

// brand assets (source of truth lives in build/assets-src so the build stays reproducible)
cpSync(join(__dirname, "assets-src"), ASSETS, { recursive: true });

// global cart catalogue — lets add-to-cart work from any page
write(
  "assets/products.js",
  "window.__SNIFFARI_PRODUCTS__ = " +
    JSON.stringify(
      Object.fromEntries(
        products.map((p) => [
          p.handle,
          {
            handle: p.handle,
            title: p.short,
            price: p.price,
            image: p.images[0],
            fallback: placeholder(p.short, p.tints[0]),
          },
        ])
      ),
      null,
      0
    ) +
    ";\n"
);

// pages
write("index.html", home());
collections.forEach((c) => write(`collection/${c.handle}.html`, collectionPage(c)));
products.forEach((p) => write(`products/${p.handle}.html`, productPage(p)));
Object.entries(staticPages).forEach(([slug, fn]) => write(`pages/${slug}.html`, fn()));

// robots + sitemap (SEO basics)
write(
  "robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /cart\n\nSitemap: https://sniffari.example/sitemap.xml\n`
);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${["index.html", ...collections.map((c) => `collection/${c.handle}.html`), ...products.map((p) => `products/${p.handle}.html`), ...Object.keys(staticPages).map((s) => `pages/${s}.html`)]
  .map((u) => `  <url><loc>https://sniffari.example/${u}</loc></url>`)
  .join("\n")}
</urlset>`
);

console.log(`✓ built ${products.length} products, ${collections.length} collections, ${Object.keys(staticPages).length} pages`);
console.log(`  output: ${OUT}`);
