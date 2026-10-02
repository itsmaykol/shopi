// Sniffari — store data model
// Every price/cost here traces back to 02-products/PRODUCT-TABLE.md
// Supplier image URLs are the live AliExpress listing CDN URLs recorded on 2026-10-02.

export const brand = {
  name: "Sniffari",
  tagline: "Enrichment & everyday care for indoor pets",
  promise: "Boredom-proof gear for indoor dogs & cats",
  freeShipThreshold: 35,
  flatShipping: 4.95,
  shipPromise: "Most US orders arrive in 7–15 days",
  email: "hello@sniffari.example", // placeholder — replace with your real address on launch
  currency: "USD",
};

const IMG = (id) => `https://ae-pic-a1.aliexpress-media.com/kf/${id}`;

export const collections = [
  {
    handle: "bestsellers",
    title: "Bestsellers",
    blurb: "The three things people come back for, plus the bundles that save the most.",
    featured: true,
  },
  {
    handle: "enrichment",
    title: "Enrichment & Feeder Puzzles",
    blurb: "Turn one 40-second meal into fifteen minutes of sniffing, licking and thinking.",
    featured: true,
  },
  {
    handle: "grooming",
    title: "Grooming & Shed Control",
    blurb: "For the fur that has somehow ended up inside a closed drawer.",
    featured: true,
  },
  {
    handle: "cleanup",
    title: "Paws, Walks & Cleanup",
    blurb: "Keep the outside outside — muddy paws, shared water bowls, wet-dog floors.",
    featured: true,
  },
  {
    handle: "bundles",
    title: "Value Bundles",
    blurb: "Two or three things that fix the whole problem, priced better than buying them apart.",
    featured: true,
  },
];

export const products = [
  // ───────────────────────────── HERO 1 ─────────────────────────────
  {
    handle: "snuffle-mat",
    title: "Sniffari Snuffle Mat — Interactive Foraging Mat for Dogs & Cats",
    short: "Snuffle Mat",
    hero: "The 10-minute dinner",
    price: 34.99,
    compareAt: 44.99,
    collections: ["bestsellers", "enrichment"],
    badge: "Bestseller",
    rating: null, // honest: no reviews yet
    sort: 1,
    images: [
      IMG("S8354bb3728ec40c89d306a3ebf6f35cae.jpg_600x600q75.jpg_.avif"),
      IMG("Sa0ec7a0aac9c402db158956b9480277fJ.jpg_600x600q75.jpg_.avif"),
      IMG("S14f189c415614ac1a0e7d9653ddc2e62z.jpg_600x600q75.jpg_.avif"),
      IMG("S638769c9e04b41f2a4a9adb28a0bf0b64.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#DFE7DE", "#F2E3D5"],
    hook: "Dinner takes 90 seconds. Which is why your dog is bored by 6:05pm.",
    intro:
      "A snuffle mat hides a meal in hundreds of fabric folds, so your dog has to work for every kibble the way they were built to — nose first. It is the closest thing to a walk you can do indoors, and it takes one minute to set up.",
    bullets: [
      "Holds a full meal in the fabric folds, so dinner takes about 12 minutes instead of 90 seconds.",
      "Made from soft fleece and plush with a non-slip base — gentle on noses and paws.",
      "Machine washable: shake it out, throw it in on a gentle cycle, air dry.",
      "Works for dogs and cats, from small breeds up to about 45 lb.",
      "Rolls up small enough to travel with — it fits in a carry-on.",
    ],
    specs: [
      ["Size", "38 × 38 × 6 cm / 15 × 15 × 2.4 in"],
      ["Material", "Fleece, plush, rubber non-slip base"],
      ["Colours", "Sand, sage (rotating stock)"],
      ["Care", "Machine washable, air dry"],
      ["Weight", "Approx. 200 g / 7 oz"],
      ["Best for", "Dogs and cats, small to medium"],
    ],
    faq: [
      [
        "My dog is a gulper. Will this slow them down?",
        "That is exactly what it is for. Most owners see mealtimes stretch from under two minutes to ten or more. Start with a shallow scatter for the first few days so it is not frustrating, then load the folds more heavily.",
      ],
      [
        "Can my cat use it?",
        "Yes. Cats take to snuffle mats quickly because it mimics hunting. Use a smaller portion — about a quarter of a meal — so the whole mat is not covered in food.",
      ],
      [
        "How do I clean it?",
        "Shake the crumbs out, machine wash cold on a gentle cycle in a mesh bag, then air dry flat. Do not tumble dry — the heat can distort the base.",
      ],
      [
        "Is it a chew toy?",
        "No. It is a feeding mat. Take it away once the food is gone, otherwise a determined chewer will treat the folds as a toy. It is not indestructible and no fabric mat is.",
      ],
    ],
    supplier: {
      label: "Interactive Foraging Snuffle Mat",
      url: "https://www.aliexpress.us/w/wholesale-snuffle-mat-dog.html",
      altUrl: "https://www.aliexpress.us/item/3256808640850699.html",
      observedPrice: "$4.06–5.59 (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.7★ · 500+ sold (listing A) · 4.9★ · 4,000+ sold (listing B)",
      shipping: "Delivery observed Oct 05–14 → 4–12 days",
    },
  },

  // ───────────────────────────── HERO 2 ─────────────────────────────
  {
    handle: "fur-lifter",
    title: "Sniffari Fur Lifter — Reusable Self-Cleaning Pet Hair Roller",
    short: "Fur Lifter",
    hero: "No refills, ever",
    price: 24.99,
    compareAt: 32.99,
    collections: ["bestsellers", "grooming"],
    badge: "Bestseller",
    rating: null,
    sort: 2,
    images: [
      IMG("Sfca2aa4a72b44013ba4723fcc44e16fai.jpg_600x600q75.jpg_.avif"),
      IMG("Scbfd26d743f4491396d7c9d097ac51cdl.jpg_600x600q75.jpg_.avif"),
      IMG("S7d23c816e2c14db08544a87547360a98l.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#E7EDE6", "#F2E3D5"],
    hook: "Roll it once. Watch a whole second dog come off your couch.",
    intro:
      "This is the tool that made lint rollers obsolete. Roll it in one direction and it drags hair out of upholstery, bedding and car seats. Then press the plunger and the hair drops into the built-in chamber — no sticky sheets, no refills, no running out at the worst moment.",
    bullets: [
      "Lifts embedded hair from fabric — couch, bed, car seat, stairs, cat tree.",
      "Self-cleaning chamber: press once and the collected hair drops out, ready for the bin.",
      "No adhesive sheets and no batteries, so it never needs a refill.",
      "One-handed operation, so you can hold a wriggling pet or a coffee in the other hand.",
      "Works on both dog and cat hair, including the short hairs that weave into weave.",
    ],
    specs: [
      ["Size", "Approx. 25 × 20 cm / 10 × 8 in"],
      ["Material", "ABS plastic, nylon bristle roll"],
      ["Colours", "Cream-white"],
      ["Care", "Wipe clean, empty the chamber"],
      ["Weight", "Approx. 300 g / 10.6 oz"],
      ["Not for", "Wet surfaces, or very loose long-pile rugs"],
    ],
    faq: [
      [
        "How is this better than a lint roller?",
        "A lint roller uses adhesive sheets that fill up and run out — one pass over a hairy couch can eat half a sheet. This has a reusable roller and a self-cleaning chamber, so it keeps working indefinitely and costs you nothing per use.",
      ],
      [
        "Will it damage my sofa?",
        "It is designed for fabric and upholstery and it is safe on standard woven and microfiber sofas. Test on a hidden edge first, and do not use it on silk, satin or very loose knitwear.",
      ],
      [
        "Does it work on the car seats?",
        "Yes — this is the second most common use. Roll in one direction, press to empty, repeat. It is the only tool most owners own that handles dog hair in fabric car seats.",
      ],
      [
        "How often do I have to clean it?",
        "The chamber holds a surprising amount. Empty it when it is full, or every few uses if you are dealing with a heavy shedder.",
      ],
    ],
    supplier: {
      label: "Reusable Pet Hair Remover Roller with self-cleaning base",
      url: "https://www.aliexpress.us/w/wholesale-pet-hair-remover.html",
      altUrl: "https://nl.aliexpress.com/item/1005005561806017.html",
      observedPrice: "$0.33–2.74 promotional; $0.99 seen with 248 reviews (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.9★ · 10,000+ sold (category listing) · sibling listing 4.5★ / 248 reviews / 1,000+ sold",
      shipping: "Delivery observed Oct 06–14 → 4–12 days",
    },
  },

  // ───────────────────────────── CORE ─────────────────────────────
  {
    handle: "slow-feeder-bowl",
    title: "Anti-Choke Slow Feeder Bowl — Non-Slip Puzzle Bowl",
    short: "Slow Feeder Bowl",
    hero: "Slows dinner to 10 minutes",
    price: 24.99,
    compareAt: 31.99,
    collections: ["enrichment", "bestsellers"],
    badge: null,
    rating: null,
    sort: 3,
    images: [
      IMG("Sded0cc7573f9412f89a87c99d70bcd9f8.jpg_600x600q75.jpg_.avif"),
      IMG("S9610a2987e34487bb9dbb0a89b8c4ccdb.jpg_600x600q75.jpg_.avif"),
      IMG("S8a4cf87b5f564bad9395bfcdce65ee21W.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#E7EDE6", "#F2E3D5"],
    hook: "If dinner lasts 40 seconds, the bowl is the problem.",
    intro:
      "A maze of ridges turns a single scoop of kibble into a 10-minute job. Slower eating means less air swallowed, less gulping, and a dog that leaves the bowl genuinely satisfied instead of looking at you for more.",
    bullets: [
      "Ridge-and-valley maze slows fast eaters without making the meal frustrating.",
      "Non-slip base: it stays where you put it, even on tile.",
      "Holds a full meal — about 3/4 cup of dry food, or use it for wet food and bone broth.",
      "Dishwasher safe and easy to rinse, so it does not become a science project.",
      "Works for both dry kibble and wet mixes; cats can use it too.",
    ],
    specs: [
      ["Capacity", "Approx. 3/4 cup / 180 ml"],
      ["Material", "Food-contact grade plastic, silicone anti-slip ring"],
      ["Size", "Approx. 20 cm diameter / 8 in"],
      ["Colours", "Sage, sand"],
      ["Care", "Dishwasher safe, top rack"],
      ["Good for", "Fast eaters, multi-dog households, wet food"],
    ],
    faq: [
      [
        "Will my dog just flip it over?",
        "Some will try. The non-slip ring grips most hard floors and the low profile makes it hard to tip. On carpet it is effectively immovable.",
      ],
      [
        "Can I use it for wet food?",
        "Yes — that is one of its best uses, because wet food takes even longer to work out of the grooves. Rinse it straight after.",
      ],
      [
        "My dog has a flat face (pug, Frenchie). Will this work?",
        "For flat-faced breeds, spread a thin layer over the whole bowl rather than filling the grooves. They can still work the surface comfortably.",
      ],
      [
        "Is this a medical product?",
        "No. It is a feeding accessory that slows eating speed. If your dog has a diagnosed condition, ask your vet what feeding setup suits them.",
      ],
    ],
    supplier: {
      label: "Anti-Choking Slow Feeder Dog Bowl, non-slip",
      url: "https://www.aliexpress.us/w/wholesale-dog-slow-feeder-bowl.html",
      observedPrice: "$1.09 promotional (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.7★ · 1,000+ sold",
      shipping: "Delivery observed Oct 07–13 → 5–11 days",
    },
  },
  {
    handle: "lick-mat",
    title: "Lick & Chill Mat — Soft Silicone Lick Mat with Suction Base",
    short: "Lick & Chill Mat",
    hero: "Ten quiet minutes",
    price: 21.99,
    compareAt: 27.99,
    collections: ["enrichment"],
    badge: null,
    rating: null,
    sort: 4,
    images: [
      IMG("Se0c53d9b51024e748faba0112612f4118.png_600x600.png_.avif"),
      IMG("Sd77dcfc9b3a943428493a9ea44be72e2d.jpg_600x600q75.jpg_.avif"),
      IMG("Sa15312a3f61940e392dc97427e49ccbfp.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#DFE7DE", "#EFE6D8", "#F2E3D5"],
    hook: "Spread. Stick. Ten quiet minutes.",
    intro:
      "Smear peanut butter, yoghurt or wet food across the grooves and the licking keeps your pet busy while you trim nails, clip a harness, or take a phone call. The suction base holds it to tile, glass or the side of the bath.",
    bullets: [
      "Textured silicone grooves hold wet food, peanut butter or yoghurt for long sessions.",
      "Suction base sticks to tile, glass or a bathtub wall — great for bath-time distraction.",
      "Soft food-grade silicone, flexible and gentle on tongues.",
      "Top-rack dishwasher safe, or rinse under warm water in seconds.",
      "Doubles as a travel bowl for wet food when you are away from home.",
    ],
    specs: [
      ["Size", "Approx. 18 cm / 7 in across"],
      ["Material", "Food-grade silicone"],
      ["Colours", "Sage / sand mix"],
      ["Care", "Top-rack dishwasher safe or hand rinse"],
      ["Suits", "Dogs and cats of all sizes"],
      ["Note", "Use xylitol-free peanut butter only"],
    ],
    faq: [
      [
        "Is peanut butter safe for dogs?",
        "Plain peanut butter is fine for most dogs, but you must check the label for xylitol (also listed as birch sugar), which is toxic to dogs. Many low-sugar 'healthy' nut butters now contain it.",
      ],
      [
        "How long does it actually keep them busy?",
        "A thin, firmly pressed layer typically lasts 5–15 minutes depending on how determined your pet is. Freeze it with yoghurt first to stretch it to 20+ minutes.",
      ],
      [
        "Will it stick to my floor?",
        "It sticks well to smooth, non-porous surfaces like tile and glass, less well to grout lines, matte concrete or wooden floors with a wax finish.",
      ],
      [
        "Is it a chew toy?",
        "No. Lick mats are for licking. If your pet starts biting chunks out of silicone, take it away and supervise next time — a swallowed piece of silicone is a vet visit.",
      ],
    ],
    supplier: {
      label: "Pet Licking Mat, soft silicone, anti-slip base",
      url: "https://www.aliexpress.us/w/wholesale-lick-mat-dog.html",
      observedPrice: "$5.43 (VERIFIED-LIVE 2026-10-02)",
      evidence: "New listing, low volume — second-source before launch (see action list)",
      shipping: "Delivery observed Oct 05–12 → 5–12 days",
    },
  },
  {
    handle: "slicker-brush",
    title: "Self-Cleaning Slicker Brush — One-Click Hair Release",
    short: "Self-Cleaning Brush",
    hero: "One-click hair release",
    price: 24.99,
    compareAt: 31.99,
    collections: ["grooming", "bestsellers"],
    badge: null,
    rating: null,
    sort: 5,
    images: [
      IMG("S795471ee870e4949a0244b9b0987c1fea.jpg_600x600q75.jpg_.avif"),
      IMG("Sb689846efaf44fc3a76cb1ca3b9e9f2fK.jpg_600x600q75.jpg_.avif"),
      IMG("S52901f1e35c54386b7721a56f6631ed88.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#E7EDE6", "#F2E3D5"],
    hook: "Click. The whole brushful falls out.",
    intro:
      "Fine stainless pins reach through the topcoat to lift loose undercoat and tangles, then a single button retracts the pins so the collected fur drops straight into the bin. No picking hair out of bristles with your fingers.",
    bullets: [
      "Fine pins get under the topcoat to lift loose fur and small mats.",
      "One-click cleaning: press the button and the fur releases into the bin.",
      "Rounded pin tips protect skin — comfortable enough for daily use.",
      "Non-slip handle stays put when a long-haired dog disagrees with the plan.",
      "Suits long, medium and double coats; works on cats too.",
    ],
    specs: [
      ["Size", "Approx. 20 × 7 cm head"],
      ["Material", "Stainless steel pins, ABS handle, TPR grip"],
      ["Colours", "Sage handle"],
      ["Care", "Click-clean after each use; wipe the handle"],
      ["Best for", "Double coats, long hair, medium to long cats"],
      ["Avoid on", "Areas with open skin or hot spots"],
    ],
    faq: [
      [
        "My dog hates being brushed. Will this help?",
        "It helps more than most brushes because the session is shorter — you can do a full pass in a couple of minutes and the pins are tipped, so it pulls less. Start with 30-second sessions and pair them with treats.",
      ],
      [
        "How is this different from a normal slicker?",
        "The retractable-pin mechanism. A normal slicker makes you dig the collected hair out with your fingers after every few passes, which is the part everyone quits over.",
      ],
      [
        "Can I use it on a short-haired dog?",
        "You can, and it will pick up loose hair, but a rubber curry or the deshedding glove usually does more for single coats. This brush is built for length and undercoat.",
      ],
      [
        "Can I use it on my cat?",
        "Yes, and it is the most reliable of our three grooming tools on cats, most of which object to gloves on their back.",
      ],
    ],
    supplier: {
      label: "Self-cleaning slicker brush for dogs and cats",
      url: "https://www.aliexpress.us/w/wholesale-self-cleaning-slicker-brush-dog.html",
      observedPrice: "$1.09–4.00 promotional (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.8★ · 10,000+ sold",
      shipping: "Delivery observed Oct 06–14 → 4–12 days",
    },
  },
  {
    handle: "deshedding-glove",
    title: "Deshedding Grooming Glove — 259 Bristles, Fur Collects in Seconds",
    short: "Deshedding Glove",
    hero: "Fur, in one sheet",
    price: 17.99,
    compareAt: 22.99,
    collections: ["grooming"],
    badge: "Under $20",
    rating: null,
    sort: 6,
    images: [
      IMG("S94e179f945f74cc08fb31e43ad315697e.jpg_600x600q75.jpg_.avif"),
      IMG("S195226f4115848cb97f38d906720b936U.jpg_600x600q75.jpg_.avif"),
      IMG("S0df70493ac3a45c99f1bdd8d1f3c7d36R.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#F2E3D5", "#EFE6D8", "#E7EDE6"],
    hook: "Your pet thinks it's a massage. You know it's a fur harvest.",
    intro:
      "Soft rubber bristles lift loose hair while feeling like a pet, which is why even fussy cats tolerate it. The hair rolls into a pad you peel off the glove in one piece — the most satisfying two seconds of your week.",
    bullets: [
      "Hundreds of soft rubber bristles collect loose fur instead of scattering it.",
      "Feels like petting, so most nervous pets stay put.",
      "Peel the collected hair off in one sheet and bin it.",
      "Adjustable wrist strap for a secure fit on adult hands.",
      "Works on dogs, cats, and even long-haired horses and rabbits.",
    ],
    specs: [
      ["Bristles", "259 soft rubber tips"],
      ["Material", "Rubber, breathable mesh back, adjustable strap"],
      ["Size", "One size, adjustable wrist"],
      ["Fits", "Left or right hand"],
      ["Care", "Hand wash, air dry"],
      ["Best for", "Sensitive pets who hate brushes"],
    ],
    faq: [
      [
        "Is this better than a brush?",
        "It is better for *fussy* pets and for quick daily passes. A slicker brush lifts more undercoat in one session; the glove wins on compliance, which matters more day to day.",
      ],
      [
        "Will it work on a thick double coat?",
        "It will remove surface and loose hair, but a double-coated dog (Husky, GSD, Collie) still needs a slicker or undercoat rake to reach the deep layer.",
      ],
      [
        "Does it work on cats?",
        "Yes — this is the tool cats object to least in our range, because the sensation is closer to being stroked than brushed.",
      ],
      [
        "How do I clean it?",
        "Peel the hair off after each use and hand wash the glove occasionally with warm water and mild soap. Air dry it flat.",
      ],
    ],
    supplier: {
      label: "Pet Grooming Deshedding Glove",
      url: "https://www.aliexpress.us/w/wholesale-pet-hair-remover.html",
      observedPrice: "$1.09 promotional (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.9★ · 1,000+ sold",
      shipping: "Delivery observed Oct 06–14 → 4–12 days",
    },
  },
  {
    handle: "paw-cleaner-cup",
    title: "Mud-Buster Paw Cleaner Cup — Rinse Four Paws in Ten Seconds",
    short: "Paw Cleaner Cup",
    hero: "Clean floor, clean paws",
    price: 27.99,
    compareAt: 35.99,
    collections: ["cleanup"],
    badge: null,
    rating: null,
    sort: 7,
    images: [
      IMG("S3b99a82e6dba4d6db355465127546952j.jpg_600x600q75.jpg_.avif"),
      IMG("S673ec8ca3a22415eb0f6d1951cee46ef0.jpg_600x600q75.jpg_.avif"),
      IMG("Sa6487598a5a54c3a89d8e8b51ea3b6adl.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#E7EDE6", "#EFE6D8", "#F2E3D5"],
    hook: "Rainy walk. Clean floor. Pick one.",
    intro:
      "Fill it, dip a paw, twist, dry. The soft silicone fingers scrub between the pads and around the toes — exactly where mud, grit and road salt hide — without you wrestling a towel around a wriggling dog at the front door.",
    bullets: [
      "Soft silicone fingers scrub between toes and under pads where a towel cannot reach.",
      "Rinses four paws in seconds — no bath, no wet floor, no wrestling.",
      "Wide, stable base so it stays upright with one hand on the lead.",
      "Easy to empty and rinse; the insert lifts out.",
      "Useful year-round: mud in autumn and winter, road salt, and pollen in spring.",
    ],
    specs: [
      ["Capacity", "Approx. 380 ml"],
      ["Material", "BPA-free plastic cup, soft silicone insert"],
      ["Colours", "Cream, sage (rotating stock)"],
      ["Size", "Approx. 11 cm diameter × 15 cm tall"],
      ["Care", "Rinse and air dry after use"],
      ["Suits", "Small to large breeds"],
    ],
    faq: [
      [
        "Will my dog tolerate it?",
        "Most do, because it is quick and does not involve water on the body. Introduce it with an empty cup and a treat first, then one paw at a time.",
      ],
      [
        "Do I need soap?",
        "Usually no. Warm water alone handles mud and grit. If paws are very muddy, wipe the worst off first, then use the cup — otherwise you are washing mud with mud.",
      ],
      [
        "My dog has very hairy feet. Does it still work?",
        "Yes, it is actually most useful for hairy-footed breeds, where mud packs into the fur between the pads. You may need two dips for the muddiest days.",
      ],
      [
        "Should I dry the paws after?",
        "Yes. Pat them dry with a towel — leaving paws wet between the pads for long periods can irritate the skin.",
      ],
    ],
    supplier: {
      label: "Pet Foot Washer Cup, silicone soft foot cup",
      url: "https://www.aliexpress.us/w/wholesale-dog-paw-cleaner-cup.html",
      observedPrice: "$1.09 promotional (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.3★ · 29 sold — thin volume, second-source before launch",
      shipping: "Delivery observed Oct 08–15 → 6–13 days",
    },
  },
  {
    handle: "travel-water-bottle",
    title: "Trail-Sip Water Bottle — Leakproof One-Handed Dog Bottle",
    short: "Trail-Sip Bottle",
    hero: "No more public bowls",
    price: 24.99,
    compareAt: 31.99,
    collections: ["cleanup"],
    badge: null,
    rating: null,
    sort: 8,
    images: [
      IMG("Scda8b99e37db429ca3f321204b161202J.jpg_600x600q75.jpg_.avif"),
      IMG("Sd39460945e0642009d88e8311c3ab0e7H.jpg_600x600q75.jpg_.avif"),
      IMG("Sa076d63a0caf4c4dae5ce003b5f4f94ci.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#DFE7DE", "#EFE6D8", "#F2E3D5"],
    hook: "Stop letting your dog drink out of a public bowl.",
    intro:
      "Squeeze, water rises into the trough, dog drinks, release, and the leftover water flows back into the bottle. One hand the whole time, with the other on the lead. Nothing leaks in your bag on the way home.",
    bullets: [
      "One-handed squeeze-and-release: the dog drinks from the trough, not the bottle.",
      "Unused water flows back inside, so nothing is wasted on a walk.",
      "Silicone-sealed cap — it does not leak in a backpack or on a car seat.",
      "Built-in carry loop clips to a lead, belt or bag strap.",
      "Roughly 380–550 ml depending on variant, enough for a decent walk.",
    ],
    specs: [
      ["Capacity", "Approx. 380–550 ml depending on variant"],
      ["Material", "Food-contact plastic, silicone gasket"],
      ["Colours", "Sage, cream, sand"],
      ["Size", "Approx. 24 cm tall"],
      ["Care", "Hand rinse, air dry open"],
      ["Note", "Replace water at least daily; do not leave standing in a hot car"],
    ],
    faq: [
      [
        "Does it actually not leak?",
        "The cap seals with a silicone gasket and the valve only opens when squeezed. In practice that means it is dry in a bag — but no bottle is immortal, so replace the gasket if you ever see a drip.",
      ],
      [
        "Is it safe to leave water in it?",
        "Short term, yes. Change the water at least daily and rinse the trough after use — bacteria grow fast in a warm plastic trough with dog saliva in it.",
      ],
      [
        "Can my cat use it?",
        "Cats drink from the trough fine, but most owners just use a bowl at home. This is really a walking and travel product.",
      ],
      [
        "Is it dishwasher safe?",
        "Hand washing is best. Hot dishwasher cycles can distort the gasket and cause exactly the leak you bought it to avoid.",
      ],
    ],
    supplier: {
      label: "Dog Water Bottle, leakproof, outdoor travel",
      url: "https://www.aliexpress.us/w/wholesale-portable-pet-water-bottle.html",
      observedPrice: "$1.09 promotional (VERIFIED-LIVE 2026-10-02)",
      evidence: "4.8★ · 5,000+ sold — strongest volume evidence of any item in the store",
      shipping: "No window shown on search page — assume 7–15 days, confirm at import",
    },
  },

  // ───────────────────────────── BUNDLES ─────────────────────────────
  {
    handle: "calm-and-clean-kit",
    title: "Calm & Clean Kit — Snuffle Mat + Lick & Chill Mat",
    short: "Calm & Clean Kit",
    hero: "Save 15%",
    price: 49.99,
    compareAt: 56.98,
    collections: ["bestsellers", "bundles", "enrichment"],
    badge: "Bundle · Save 15%",
    rating: null,
    sort: 9,
    images: [
      IMG("S8354bb3728ec40c89d306a3ebf6f35cae.jpg_600x600q75.jpg_.avif"),
      IMG("Se0c53d9b51024e748faba0112612f4118.png_600x600.png_.avif"),
      IMG("Sa0ec7a0aac9c402db158956b9480277fJ.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#DFE7DE", "#F2E3D5"],
    hook: "Two tools. One much calmer animal.",
    intro:
      "The snuffle mat handles meals. The lick mat handles the in-between hours — nail trims, bath time, the hour before you leave for work. Together they cover almost every 'my pet is driving me up the wall' moment indoors.",
    bullets: [
      "Snuffle mat turns a full meal into about 12 minutes of nose work.",
      "Lick mat holds peanut butter or yoghurt for 5–15 quiet minutes, and sticks to tile.",
      "Both are washable and need no batteries, no refills and no supervision beyond the usual.",
      "Cheaper than buying the two separately — the bundle saves you 15%.",
      "The most-gifted combination in the range for someone who just got a puppy.",
    ],
    specs: [
      ["Includes", "1 × Snuffle Mat (38 × 38 cm), 1 × Lick & Chill Mat (18 cm)"],
      ["Batteries", "None — both non-electrical"],
      ["Care", "Both machine/top-rack dishwasher safe"],
      ["Best for", "Indoor dogs and cats, evenings and bad-weather days"],
      ["Suits", "Small to medium dogs, all cats"],
    ],
    faq: [
      [
        "Can I use them at the same time?",
        "Yes, and many owners do: kibble in the snuffle mat, a thin lick-mat layer on top of a frozen treat for the second half. Just keep both supervised.",
      ],
      [
        "Is this suitable as a gift?",
        "It is the bundle most often bought for someone else — a new puppy owner, or a friend whose dog is destroying furniture. It arrives as two separate items boxed together.",
      ],
      [
        "What if one part isn't right for my pet?",
        "Our refund policy covers the whole order for 30 days from delivery. See the Refund Policy page for how it works, including who pays return postage.",
      ],
    ],
    supplier: {
      label: "Bundle of the two verified listings below",
      url: "https://www.aliexpress.us/w/wholesale-snuffle-mat-dog.html",
      altUrl: "https://www.aliexpress.us/w/wholesale-lick-mat-dog.html",
      observedPrice: "Component prices verified 2026-10-02",
      evidence: "Components: 4.9★ · 4,000+ sold + new listing",
      shipping: "Ships as two parcels from the same supplier region — allow 7–15 days",
    },
  },
  {
    handle: "shed-control-trio",
    title: "Shed-Control Trio — Fur Lifter + Self-Cleaning Brush + Deshedding Glove",
    short: "Shed-Control Trio",
    hero: "Best value",
    price: 59.99,
    compareAt: 67.97,
    collections: ["bestsellers", "bundles", "grooming"],
    badge: "Bundle · Save 12%",
    rating: null,
    sort: 10,
    images: [
      IMG("Sfca2aa4a72b44013ba4723fcc44e16fai.jpg_600x600q75.jpg_.avif"),
      IMG("S795471ee870e4949a0244b9b0987c1fea.jpg_600x600q75.jpg_.avif"),
      IMG("S94e179f945f74cc08fb31e43ad315697e.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#E7EDE6", "#F2E3D5"],
    hook: "One box. The entire shedding problem.",
    intro:
      "The glove handles daily passes on a fussy pet. The slicker brush digs out loose undercoat properly. The Fur Lifter cleans off everything the first two knock loose — couch, bed, car. It is the complete loop, and it is the highest-margin, highest-AOV product we sell.",
    bullets: [
      "Deshedding glove: daily two-minute passes your pet will actually allow.",
      "Self-cleaning slicker brush: reaches undercoat and releases the hair in one click.",
      "Fur Lifter roller: clears the sofa, bed and car seats with no refills.",
      "Together they cut visible fur in the home dramatically — the effect people photograph.",
      "Saves you about 12% versus buying all three separately.",
    ],
    specs: [
      ["Includes", "1 × Deshedding Glove, 1 × Self-Cleaning Slicker Brush, 1 × Fur Lifter Roller"],
      ["Batteries", "None"],
      ["Care", "Hand wash glove, click-clean brush, empty roller chamber"],
      ["Best for", "Double coats, heavy shedders, multi-pet homes"],
      ["Suits", "Dogs and cats"],
    ],
    faq: [
      [
        "Which tool do I use first?",
        "Brush first (glove for fussy pets, slicker for thick coats) to lift the loose fur, then go over the furniture with the roller. You will collect far more that way than roller-only.",
      ],
      [
        "Will this stop shedding entirely?",
        "No, and nothing does. It removes loose fur before it lands on your floor, which is a big practical difference. It is not a treatment for hair loss or skin conditions.",
      ],
      [
        "Does the bundle ship together?",
        "It ships as three items from the same supplier region, usually arriving within a day or two of each other. You will get tracking for the consolidated parcel.",
      ],
    ],
    supplier: {
      label: "Bundle of the three verified grooming listings",
      url: "https://www.aliexpress.us/w/wholesale-pet-hair-remover.html",
      altUrl: "https://www.aliexpress.us/w/wholesale-self-cleaning-slicker-brush-dog.html",
      observedPrice: "Component prices verified 2026-10-02",
      evidence: "Components: 4.9★ 10,000+ sold · 4.8★ 10,000+ sold · 4.9★ 1,000+ sold",
      shipping: "Allow 7–15 days; may arrive as separate parcels",
    },
  },
  {
    handle: "new-puppy-starter-kit",
    title: "New Puppy Starter Kit — Slow Feeder + Snuffle Mat + Deshedding Glove",
    short: "New Puppy Kit",
    hero: "One-click setup",
    price: 64.99,
    compareAt: 77.97,
    collections: ["bundles", "bestsellers"],
    badge: "Bundle · Save 17%",
    rating: null,
    sort: 11,
    images: [
      IMG("Sded0cc7573f9412f89a87c99d70bcd9f8.jpg_600x600q75.jpg_.avif"),
      IMG("S8354bb3728ec40c89d306a3ebf6f35cae.jpg_600x600q75.jpg_.avif"),
      IMG("S94e179f945f74cc08fb31e43ad315697e.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#F2E3D5", "#EFE6D8", "#DFE7DE"],
    hook: "Just got a puppy? This is the boring stuff, handled.",
    intro:
      "New puppy owners buy wildly at 11pm — and the things that actually get used for the next two years are these three: a bowl that slows eating, a mat that turns a meal into a job, and a glove that makes grooming a thing the puppy likes. It is also the bundle most often bought as a gift.",
    bullets: [
      "Slow feeder bowl slows the 40-second dinner that puppy stomachs hate.",
      "Snuffle mat turns one of those meals into about 12 minutes of nose work.",
      "Deshedding glove starts a grooming habit while the puppy still thinks it is a game.",
      "Saves about 17% versus buying the three separately.",
      "Arrives as three items in one order — the standard new-puppy gift box.",
    ],
    specs: [
      ["Includes", "1 × Slow Feeder Bowl, 1 × Snuffle Mat, 1 × Deshedding Glove"],
      ["Batteries", "None"],
      ["Care", "Bowl dishwasher safe · mat machine washable · glove hand wash"],
      ["Best for", "Puppies from about 3 months, small to medium breeds"],
      ["Gift-ready", "Boxed together with a printed care card"],
    ],
    faq: [
      [
        "Is the bowl suitable for a very young puppy?",
        "Yes for most puppies from around 3 months. Before that, use a shallow dish and supervise — very young puppies can tire of working for food.",
      ],
      [
        "Can I leave the snuffle mat down permanently?",
        "Not advisable. Put it down for meals, then pick it up. A bored puppy will chew fabric, and no mat survives a determined teething session.",
      ],
      [
        "Where can I read the care card?",
        "A short printed card is included. It covers cleaning, first-use introduction and the sensible supervision rules.",
      ],
    ],
    supplier: {
      label: "Bundle of three verified listings",
      url: "https://www.aliexpress.us/w/wholesale-dog-slow-feeder-bowl.html",
      altUrl: "https://www.aliexpress.us/w/wholesale-snuffle-mat-dog.html",
      observedPrice: "Component prices verified 2026-10-02",
      evidence: "Components: 4.7★ 1,000+ sold · 4.9★ 4,000+ sold · 4.9★ 1,000+ sold",
      shipping: "Allow 7–15 days; may arrive as separate parcels",
    },
  },
  {
    handle: "enrichment-treat-duo",
    title: "Enrichment Treat Duo — Slow Feeder + Lick & Chill Mat",
    short: "Enrichment Duo",
    hero: "Add-on favourite",
    price: 39.99,
    compareAt: 46.98,
    collections: ["bundles", "enrichment"],
    badge: "Bundle · Save 15%",
    rating: null,
    sort: 12,
    images: [
      IMG("Sded0cc7573f9412f89a87c99d70bcd9f8.jpg_600x600q75.jpg_.avif"),
      IMG("Se0c53d9b51024e748faba0112612f4118.png_600x600.png_.avif"),
      IMG("S8a4cf87b5f564bad9395bfcdce65ee21W.jpg_600x600q75.jpg_.avif"),
    ],
    tints: ["#EFE6D8", "#DFE7DE", "#E7EDE6"],
    hook: "The cheap add-on that makes dinner last.",
    intro:
      "If you are not ready for the full kit, this is the entry point: a bowl that slows mealtimes down and a mat that turns a treat into an activity. Both are the kind of thing that gets used twice a day, every day.",
    bullets: [
      "Slow feeder bowl stretches a 40-second dinner into a proper meal.",
      "Lick mat holds wet food, yoghurt or peanut butter for quiet time.",
      "Both washable, neither needs batteries.",
      "The most common addition to a first order — it clears the free-shipping line.",
      "Saves about 15% versus buying them separately.",
    ],
    specs: [
      ["Includes", "1 × Anti-Choke Slow Feeder Bowl, 1 × Lick & Chill Mat"],
      ["Batteries", "None"],
      ["Care", "Both dishwasher safe (mat top rack)"],
      ["Best for", "Fast eaters, wet food, indoor evenings"],
      ["Suits", "Dogs and cats"],
    ],
    faq: [
      [
        "Is this good for a small dog or a cat?",
        "Yes. The bowl is shallow enough for small pets and the mat suits cats well — quarter-portions are plenty.",
      ],
      [
        "Can I add this to a bigger order?",
        "It is built to be added to another bundle. Bundles are priced across the whole order, and shipping is free over $35.",
      ],
      [
        "Are these two separate items in the box?",
        "Yes, two items in one shipment from the same region — one tracking number.",
      ],
    ],
    supplier: {
      label: "Bundle of two verified listings",
      url: "https://www.aliexpress.us/w/wholesale-dog-slow-feeder-bowl.html",
      altUrl: "https://www.aliexpress.us/w/wholesale-lick-mat-dog.html",
      observedPrice: "Component prices verified 2026-10-02",
      evidence: "Components: 4.7★ 1,000+ sold + new listing",
      shipping: "Allow 7–15 days",
    },
  },
];

export const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));
