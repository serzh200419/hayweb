# HayWeb mobile layout review

Local review of the optimized Astro build, 2026-10-15. Source changes are committed locally only; no push, deployment or real Telegram submission was performed.

## Problems found and changes

- The full navigation wrapped into multiple rows on phones. Below 1001px, a native details/summary menu replaces it, with the enquiry link still visible. It supports native keyboard operation without JavaScript. The existing shared script adds Escape-to-close with focus restoration, outside-click closing, link closing and safe focus transfer when resizing to desktop. The menu is a nonmodal dropdown in the document, with no fixed bars or focus trap.
- Promotional buttons squeezed long Armenian/Russian words. The mobile strip now reserves a readable CTA column, a minimum 44px button height and safe wrapping at enlarged text sizes.
- Mobile copy, FAQ questions, price conditions and footer links were unnecessarily small. Component-scoped mobile typography, line height, gutters and section spacing now provide a clearer hierarchy. Headings wrap naturally; no manual line breaks were added.
- Calculator comparison text was about 10.6px. It is now about 13.6px at default text size, in a labeled, keyboard-focusable horizontal scroll region with a translated swipe/scroll hint. Its native table semantics and every column remain available. Totals stack below, with the discounted one-time estimate emphasized and maintenance separate.
- Form controls used sub-16px text. They now have 16px text, comfortable heights, visible labels and a single-column phone layout. Added email/tel/url input modes and a numeric quantity keyboard hint. Checkbox labels, consent and submit controls have more generous tap areas. Field values and submission logic are unchanged.
- At 200% text enlargement, promotional CTA text and intrinsic grid minimum widths caused overflow. Flexible grid tracks, min-width:0 and wrapping on the relevant content resolve it without global overflow hiding. Article links, footer addresses and long headings also wrap safely.
- The existing vertical process flow, navy/mint/ivory sections, ATELIER device composition, localized illustrative label, reduced-motion behavior and touch cursor suppression remain intact. A low-contrast link on the navy Services card now uses the existing aqua color on mobile.

## Files changed

- `src/styles/mobile.css`: shared responsive refinements, scoped below desktop widths.
- `src/components/SiteHeader.astro`, `src/lib/mobile-menu.ts`, `src/components/StudioEffects.astro`: native mobile navigation and shared-module enhancement.
- `src/mobile-copy.ts`: typed localized menu labels and estimate scroll guidance.
- `src/components/EstimateSummary.astro`: accessible scroll region and translated hint.
- `src/components/Enquiry.astro`, `src/components/ProjectOptions.astro`: keyboard/input hints, with validation and delivery code preserved.
- `src/layouts/Base.astro`: imports the mobile stylesheet.
- `scripts/mobile-audit.mjs`, `scripts/mobile-interactions.mjs`: responsive and interaction regression coverage.
- `scripts/browser-check.mjs`, `scripts/browser-pages.mjs`, `scripts/studio-browser-check.mjs`, `scripts/seo-browser-check.mjs`, `scripts/verify.mjs`: target FAQ disclosures separately from the new navigation disclosure; no-JS navigation checks open the native menu.
- `README.md` and this review: updated navigation and test instructions.

No prices, existing translations/content, route metadata, branding assets, libraries, fonts, runtime secrets, server endpoint or Telegram configuration were changed. New menu/scroll guidance is translated in all three languages. Navigation enhancement is bundled into the existing shared module; homepage verification still enforces one module script.

## Verification

- Astro check: 0 errors, 0 warnings, 0 hints (74 files). Static build: 29 HTML pages.
- Existing content, pricing, internal-link, contrast, metadata, sitemap and hosting checks passed for all 28 canonical pages plus branded 404 output.
- Before and after browser audit: all 29 pages at 320, 360, 390, 430, 768 and 1440px (174 cases per phase), including all locales, both dedicated service pages, both articles per language, the language entry and 404. No unintended horizontal page scrolling, off-screen main controls or browser exceptions. Request endpoint blocked; zero submissions.
- Menu tested in all three languages at 320/360/390/430/768: Enter, Tab, Escape/focus restoration, outside click, destination navigation and resizing into desktop. Enlarged-text menus also checked at 320/390/768.
- All 29 pages passed 200% root text enlargement at 320/390/768 (87 cases), and touch landscape at 844x390 (29 cases). No off-screen form controls or visible decorative cursor. This is text enlargement, not a claim of testing physical browser pinch zoom.
- Keyboard validation focus, form values retained across resize/orientation changes, input modes and keyboard scrolling of the estimate table passed. Native navigation and direct-contact alternatives remain usable without JavaScript.
- Existing browser, FAQ and ATELIER suites passed, including keyboard/focus/language switching, static answers and responsive miniature contents.
- Existing offer suite passed in all three languages: calculator selections and quantity transfer, 190,000 regular / 85,000 offer for all options plus one extra page, separate 15,000/month maintenance, accessible validation, retained inputs, repeated-submit protection, unchanged retry ID, mocked delivery rejection/timeout and mocked confirmed success. No real Telegram notification was sent.
- All 10 server test groups passed, including 128 price combinations, trusted totals, missing configuration, Telegram rejection/timeout and retry behavior with mock providers/KV.
- Desktop captures at 1440px retain their dimensions and composition. Seven of eight full-page captures matched baseline pixels exactly; the Armenian homepage has small raster differences and was visually inspected with its device composition intact. Root, 404, English/Russian home, Contact, Services and article comparisons matched exactly.

## Mobile Lighthouse diagnostics

Identical settings were verified programmatically across all four reports: Lighthouse version, mobile screen emulation, form factor, simulated throttling and throttling method. One baseline and one final run for each page are shown below. Interim measurements used during layout adjustments are not the final comparison. Chrome was run alone, after the browser suites, against the same local static-build server, with default mobile throttling and clean navigation. These are local diagnostics, not Cloudflare/live or physical-device results; small timing differences include run-to-run variation.

| Page | Phase | Performance | Accessibility | FCP | LCP | Speed index | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Home | before | 100 | 100 | 1.36 s | 1.66 s | 1.36 s | 0 ms | 0.0053 |
| Home | after | 100 | 100 | 1.36 s | 1.66 s | 1.36 s | 0 ms | 0.0120 |
| Contact | before | 99 | 100 | 1.44 s | 1.66 s | 1.44 s | 0 ms | 0.0420 |
| Contact | after | 99 | 100 | 1.43 s | 1.81 s | 1.43 s | 0 ms | 0.0008 |

Lighthouse 13.5.0. Raw reports: `artifacts/mobile-{before,after}-{home,contact}.json`. URLs: `http://127.0.0.1:4330/hy/` and `/hy/contact/`. This is an optimized production build with local-review metadata, not a published production origin. No ranking outcome is implied.

## Screenshots

Captured with reduced motion; screenshots are ignored local review artifacts, not deployed assets.

| Language | Home | Open menu | Pricing | Form | Article | Desktop home |
|---|---|---|---|---|---|---|
| hy | [Home](../artifacts/mobile-hy-home-390.png) | [Menu](../artifacts/mobile-hy-menu.png) | [Pricing](../artifacts/mobile-hy-pricing-390.png) | [Form](../artifacts/mobile-hy-form-390.png) | [Article](../artifacts/mobile-hy-article-390.png) | [Desktop](../artifacts/mobile-hy-home-1440.png) |
| en | [Home](../artifacts/mobile-en-home-390.png) | [Menu](../artifacts/mobile-en-menu.png) | [Pricing](../artifacts/mobile-en-pricing-390.png) | [Form](../artifacts/mobile-en-form-390.png) | [Article](../artifacts/mobile-en-article-390.png) | [Desktop](../artifacts/mobile-en-home-1440.png) |
| ru | [Home](../artifacts/mobile-ru-home-390.png) | [Menu](../artifacts/mobile-ru-menu.png) | [Pricing](../artifacts/mobile-ru-pricing-390.png) | [Form](../artifacts/mobile-ru-form-390.png) | [Article](../artifacts/mobile-ru-article-390.png) | [Desktop](../artifacts/mobile-ru-home-1440.png) |

Additional captures include complete hero/ATELIER, estimate, footer, complete Contact, article body, About, dedicated services, blog listing, root and 404. See `artifacts/mobile-*`. Full-page desktop before/after captures use `mobile-{before,after}-*-1440.png`.

## Reproduce

Use `npm run build`, `npm run check`, `npm run verify`, `npm run verify:hosting`, `npm run test:requests`. Start the static server with `npm run preview -- --host 127.0.0.1 --port 4330`; this does not load the real Function. Set `PREVIEW_URL=http://127.0.0.1:4330`, then run `npm run test:browser`, `npm run test:offer`, `node scripts/faq-browser-check.mjs`, `node scripts/atelier-browser-check.mjs`, `node scripts/mobile-audit.mjs after` and `node scripts/mobile-interactions.mjs`. All delivery tests use mocks; do not make manual live form submissions for layout testing.

For Lighthouse, set CHROME_PATH to the installed Chrome executable, then run `npm exec --yes --package=lighthouse@13.5.0 -- lighthouse http://127.0.0.1:4330/hy/ --only-categories=performance,accessibility --output=json --output-path=artifacts/mobile-after-home.json --chrome-flags="--headless --no-sandbox" --quiet`. Repeat for Contact, using its URL and filename. Run measurements sequentially, without other browser suites.

## Limits

No physical iPhone/Android device, mobile Safari, real on-screen keyboard or full assistive-technology audit was available. Landscape and touch behavior were emulated in installed desktop Chrome. Actual keyboard/visual-viewport behavior still merits an owner check on those devices. There are no known remaining layout failures in the tested matrix. Branded 404 rendering was checked as static output; this task does not verify live Cloudflare HTTP routing. No real delivery, deployment or indexing claim is made.
