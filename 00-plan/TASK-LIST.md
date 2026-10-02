# Task List

Status legend: ✅ done · ⚠️ done with a documented gap · ⛔ blocked (needs you) · ➖ not applicable in this environment

## Phase 0 — Access & setup
| # | Task | Status | Notes |
|---|---|---|---|
| 0.1 | Probe available tools (browser, CLI, network, MCP) | ✅ | Full results in `FINAL-REPORT.md` §1 |
| 0.2 | Establish a working web-research method | ✅ | `fetch_page` + `web_search`; shell internet is allowlisted-only |
| 0.3 | Build a real screenshot pipeline | ✅ | Installed headless Chromium + sourced the missing NSS/NSPR libs; 27 screenshots captured |
| 0.4 | Obtain the official free Dawn theme | ✅ | `codeload.github.com/Shopify/dawn`, v16.0.0 |

## Phase 1 — Niche selection
| # | Task | Status | Notes |
|---|---|---|---|
| 1.1 | Research 10 niches on 8 weighted criteria | ✅ | `01-research/NICHE-SCORING.md` |
| 1.2 | Verify demand direction with current data | ✅ | APPA, GMI, Simporter, Marketing Dive, Accio — all cited |
| 1.3 | Score, rank, pick ONE winner | ✅ | Pet enrichment & everyday care — 8.36/10 |
| 1.4 | Write the 3-sentence winner justification | ✅ | In the scoring artifact |

## Phase 2 — Product selection
| # | Task | Status | Notes |
|---|---|---|---|
| 2.1 | Source 8–12 products meeting every gate | ✅ | 8 singles + 4 bundles = 12 SKUs |
| 2.2 | Verify live supplier prices | ✅ | All 8 supplier items `VERIFIED-LIVE` on 2026-10-02 |
| 2.3 | Calculate markup + net margin at 3 ad-cost scenarios | ✅ | Recomputed programmatically; table corrected |
| 2.4 | Flag every data point VERIFIED or ESTIMATED | ✅ | `02-products/PRODUCT-TABLE.md` |

## Phase 3 — Supplier vetting
| # | Task | Status | Notes |
|---|---|---|---|
| 3.1 | Assess CJ / Zendrop / Spocket / DSers / Alibaba | ⚠️ | CJ product pages are bot-gated; Zendrop 404; Alibaba CAPTCHA — all documented |
| 3.2 | Verify ratings, units sold, delivery windows | ✅ | Live for all items; windows recorded |
| 3.3 | Read full buyer reviews and buyer photos | ⛔ | AliExpress item pages are reCAPTCHA-walled — **your 5-minute check**, item #2 on your action list |
| 3.4 | Confirm US shipping ≤7–12 days | ✅ | Observed 3–13 days across listings; promise padded to 7–15 |
| 3.5 | Re-verify price + availability immediately before writing the import CSV | ✅ | Done; re-check again at actual import time |

## Phase 4 — Build the store
| # | Task | Status | Notes |
|---|---|---|---|
| 4.1 | Brand: name, logo, palette, fonts, voice | ⚠️ | Done; trademark check is a documented gap → action list |
| 4.2 | Free mobile-first theme, customized | ✅ | Dawn v16, 5 colour schemes, branded homepage |
| 4.3 | Homepage: hero, featured collection, benefits, social proof, FAQ, email capture | ✅ | All present, mobile-first |
| 4.4 | Collections incl. Bestsellers | ✅ | 5 collections + tag conditions for automated setup |
| 4.5 | Full product pages (12) | ✅ | Hook, bullets, description, specs, shipping, FAQ, supplier evidence |
| 4.6 | All required pages | ✅ | About, Contact, Shipping, Refund, Privacy, Terms, FAQ, Track order |
| 4.7 | Nav, footer, favicon, checkout branding | ✅ | Logo/favicon files + instructions; checkout colours specified |
| 4.8 | Free conversion features | ⚠️ | Bundles, cross-sell, free-ship threshold/bar, 4 emails, social share, SEO, pixels — all built as files; **installing free apps needs your login** |
| 4.9 | Shipping rates matched to real supplier costs | ✅ | `shipping-rates.md` with reasoning |
| 4.10 | Keep store unpublished | ✅ | Nothing was published; nothing *could* be — no admin access |
| 4.11 | Payment settings ready for you | ✅ | Left untouched by design |

## Phase 5 — Launch kit
| # | Task | Status | Notes |
|---|---|---|---|
| 5.1 | 3 scripts per hero product | ✅ | 6 scripts with timed shot tables |
| 5.2 | 5 ad hooks per hero | ✅ | 10 hooks, labelled by best use |
| 5.3 | Shot lists | ✅ | 12 + 10 shots, one filming session each |
| 5.4 | Captions + hashtags | ✅ | Master sets + per-angle variations |
| 5.5 | 14-day organic calendar | ✅ | Plus a post-day-14 cadence |
| 5.6 | 3 ad angles + audiences | ✅ | Marked do-not-run-yet, with budget discipline |

## Phase 6 — QA
| # | Task | Status | Notes |
|---|---|---|---|
| 6.1 | Crawl every page for broken links, missing images, alt text, typos | ✅ | 26 pages, 0 issues |
| 6.2 | Price consistency vs. the product table | ✅ | Programmatic check, 0 orphans |
| 6.3 | Desktop (1440×900) + mobile (390×844) walkthrough | ✅ | 27 screenshots |
| 6.4 | Add to cart → cart → checkout-to-payment-boundary | ✅ | Tested; checkout correctly stops with an explanation |
| 6.5 | Policy accuracy vs. what is actually promised | ✅ | Cross-checked shipping/refund claims against supplier windows |
| 6.6 | Load-speed / page-weight check | ✅ | Static build; see QA report |
| 6.7 | Fix every issue and re-test | ✅ | Fixed missing hero copy (6 products), emoji tofu boxes, over-long titles, placeholder design; re-crawled clean |
| 6.8 | Test the theme on a real Shopify store | ⛔ | Requires your admin login — verify against `NEEDS-YOUR-ACTION.md` checklist |

## Final
| # | Task | Status |
|---|---|---|
| 7.1 | Final report (tool check, niche, products, checklist, risks) | ✅ `06-final/FINAL-REPORT.md` |
| 7.2 | Needs-your-action list | ✅ `06-final/NEEDS-YOUR-ACTION.md` |
| 7.3 | Evidence + screenshots as artifacts | ✅ `05-qa/screenshots/`, `01-research/RESEARCH-SOURCES.md` |
| 7.4 | Commit and push to `arena/01a0fc19-shopi` | ✅ |
