# HayWeb typography review

Reviewed the latest site, starting from commit `3b70188`, including the current ATELIER illustration. The old reference hero was not restored. Local source changes only; no push, deployment or real Telegram notification.

## Design changes

The main imbalance was small supporting text, not an insufficiently large headline. Shared rem-based tokens now distinguish body, lead, navigation, controls, FAQ, supporting text and metadata. The existing Noto family is retained. The headline's complete computed-style snapshots (size, weight, line height, spacing, family and height) match the baseline in all 12 language/width combinations.

Paragraph line height is generally 1.65, hero supporting text 1.6, and FAQ questions 1.55. Lead paragraphs are limited to 44-52ch and normal reading paragraphs to 68ch where relevant. Armenian body weight is gently raised from 400 to 450; labels have normal letter spacing and Armenian eyebrow spacing is reduced to .025em. Colors and contrast remain unchanged.

The menu breakpoint moves from 1000 to 1200px to accommodate readable navigation. Labels, buttons, cards and summaries wrap naturally; no fixed heights or smaller fallback type were introduced to force fitting. At 320px the promotional strip places its CTA on a separate row. A footer min-content issue exposed by 200% enlargement was fixed. Tables retain local scrolling, semantic structure and separate one-time/monthly totals.

ATELIER text is isolated on its existing 16px base with its own small component sizes, normal line height and original weight. Its device proportions, SVG architecture and responsive compositions are preserved. The localized explanatory caption is page metadata, so it is now 14.5px.

## Actual computed sizes

Measured with loaded fonts at 1440px desktop and 390px mobile. The same size scale applies to all three languages. A dash means that navigation variant is hidden at that width.

| Element | Desktop before -> after | Mobile before -> after |
|---|---|---|
| Body | 16px -> 18px | 16px -> 17.5px |
| Hero supporting paragraph | 15.36px -> 21px | 16px -> 18px |
| Desktop navigation | 12.48px -> 16px | - |
| Mobile menu toggle | - | 13.6px -> 16px |
| Primary button | 12.8px -> 17px | 14.4px -> 17px |
| Hero offer | 12.48px -> 16.5px | 14.08px -> 16px |
| Hero note | 11.52px -> 16.5px | 12.8px -> 16px |
| FAQ question | 13.76px -> 19px | 15.2px -> 18px |
| FAQ answer | 13.28px -> 18px | 15.2px -> 17.5px |
| Form label | 12.48px -> 16px | 14.4px -> 16px |
| Form input | 13.6px -> 16px | 16px -> 16px |
| Article paragraph | 16px -> 18px | 16px -> 17.5px |
| Article metadata | 12.48px -> 14.5px | 12.48px -> 14.5px |

Weights: English/Russian body remains 400; Armenian body and inherited supporting copy/input text changes 400 -> 450. Navigation links change 400 -> 550; menu toggle changes 600 -> 550 for a consistent medium navigation weight. Buttons remain 650, FAQ questions and form labels remain 600, and the hero headline remains 680. The headline is still 64.8px at 1440px and 32px at 390px. Primary hero buttons measure 59.5px high on desktop and 53.5px on mobile. Paragraphs and useful support copy throughout Services, dedicated services, About, Contact, Blog, articles, root and 404 use the shared scale.

## Font loading

No font-loading or Armenian/Cyrillic rendering defect was found in the reviewed samples. All three existing local WOFF2 subsets returned HTTP 200. The loaded faces declare a variable weight range of 400-750, supporting all used weights. Chrome's CSS.getPlatformFontsForNode confirms custom Noto Sans Armenian and Noto Sans glyphs in the Armenian lead, and custom Noto Sans in English/Russian leads. There was no system fallback in those body-text samples. Before/after font filenames match exactly. No font files, additional families, remote requests or dependencies were added. Raw evidence is in `artifacts/type-font-review.json` and `artifacts/type-{before,after}-styles.json`.

## Verification

- Astro check: 0 errors, warnings or hints (75 files). Optimized build: 29 HTML pages. Existing pricing, content, metadata, internal links, sitemap and contrast checks passed.
- All 29 pages passed the browser layout audit at 320/360/390/430/768/1440px (174 cases), covering all locales, dedicated services, articles, root and 404. No horizontal page scrolling, off-screen main controls or browser exceptions.
- Focused computed-font and screenshot checks passed for home, Contact and a cost article in all three languages at 320/390/768/1440, including 200% root text enlargement. A separate all-page scan at those four widths and 200% text found no overflow (116 cases).
- Menu behavior, keyboard/focus, FAQ expansion, field values across resize, numeric/email/telephone input modes, and keyboard table scrolling passed in the mobile interaction suite. All 29 pages were also checked with 200% text at 320/390/768 and touch landscape 844x390; no-JS navigation/direct contacts remain usable. Navigation breakpoint checks passed in all locales at 1100/1200/1201/1280.
- ATELIER's existing suite passed all locales at 320/390/768/1440: responsive phone, original text and SVG, no clipping/overflow, passive contents and no browser exceptions.
- Existing offer suite passed all three languages: 190,000 AMD regular / 85,000 AMD form-offer all-option estimate with one additional page; maintenance remains separately 15,000 AMD/month. Calculator selection transfer, accessible validation, retained details after failures, unchanged retry ID, mocked Telegram rejection/timeout and mocked confirmed success passed.
- All 10 server test groups passed with mock providers/KV, including 128 pricing combinations, trusted amounts and delivery/retry errors. No real notification was sent.

## Performance diagnostics

One mobile Lighthouse navigation per page/phase, sequentially with other browser suites stopped, against the same optimized static server at `http://127.0.0.1:4330`. This is local-review output, not a live Cloudflare deployment. Lighthouse version, Chrome user agent, simulated throttling, screen emulation, form factor and throttling method are identical across the four reports. Measurements include normal run-to-run variation.

| Page | Phase | Performance | FCP | LCP | Speed index | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|
| Home | before | 99 | 1.36s | 1.66s | 1.36s | 0ms | 0.0120 |
| Home | after | 100 | 1.36s | 1.66s | 1.36s | 0ms | 0.0025 |
| Contact | before | 99 | 1.51s | 1.66s | 1.51s | 0ms | 0.0013 |
| Contact | after | 99 | 1.43s | 1.66s | 1.43s | 0ms | 0.0014 |

Lighthouse 13.5.0. Raw reports: `artifacts/type-{before,after}-{home,contact}.json`. The typography stylesheet is 7,753 source bytes (about 2,212 bytes gzip); no new client module or font asset was added. These diagnostics show no material performance regression and do not guarantee a score, physical-device result or ranking.

## Matched screenshots

Identical widths, installed Chrome, loaded fonts, reduced motion and the same first three FAQ answers expanded. All links below point to ignored local review artifacts.

| Language / width | Hero before | Hero after | FAQ before | FAQ after |
|---|---|---|---|---|
| hy / 390 | [hero before](../artifacts/type-before-hy-hero-390.png) | [hero after](../artifacts/type-after-hy-hero-390.png) | [faq before](../artifacts/type-before-hy-faq-390.png) | [faq after](../artifacts/type-after-hy-faq-390.png) |
| hy / 1440 | [hero before](../artifacts/type-before-hy-hero-1440.png) | [hero after](../artifacts/type-after-hy-hero-1440.png) | [faq before](../artifacts/type-before-hy-faq-1440.png) | [faq after](../artifacts/type-after-hy-faq-1440.png) |
| en / 390 | [hero before](../artifacts/type-before-en-hero-390.png) | [hero after](../artifacts/type-after-en-hero-390.png) | [faq before](../artifacts/type-before-en-faq-390.png) | [faq after](../artifacts/type-after-en-faq-390.png) |
| en / 1440 | [hero before](../artifacts/type-before-en-hero-1440.png) | [hero after](../artifacts/type-after-en-hero-1440.png) | [faq before](../artifacts/type-before-en-faq-1440.png) | [faq after](../artifacts/type-after-en-faq-1440.png) |
| ru / 390 | [hero before](../artifacts/type-before-ru-hero-390.png) | [hero after](../artifacts/type-after-ru-hero-390.png) | [faq before](../artifacts/type-before-ru-faq-390.png) | [faq after](../artifacts/type-after-ru-faq-390.png) |
| ru / 1440 | [hero before](../artifacts/type-before-ru-hero-1440.png) | [hero after](../artifacts/type-after-ru-hero-1440.png) | [faq before](../artifacts/type-before-ru-faq-1440.png) | [faq after](../artifacts/type-after-ru-faq-1440.png) |

## Changes and reproduction

Source: `src/styles/typography.css` owns the new rem scale and component mappings; `src/layouts/Base.astro` imports it after existing layout styles; `src/lib/mobile-menu.ts` uses the matching 1201px desktop breakpoint. `scripts/typography-check.mjs` records computed sizes, checks the actual fonts with Chrome DevTools, captures matched sections, verifies controls and tests enlarged text. README links this review. Pricing, translations, SEO configuration, form code, delivery and animation code are otherwise unchanged.

Run `npm run check`, `npm run build`, `npm run verify`, `npm run test:requests`. Start `npm run preview -- --host 127.0.0.1 --port 4330`, then run `node scripts/typography-check.mjs after`, `node scripts/mobile-audit.mjs typography`, `node scripts/mobile-interactions.mjs` and `node scripts/atelier-browser-check.mjs`. Set `PREVIEW_URL=http://127.0.0.1:4330` before `npm run test:offer`. These tests use static serving and mock delivery, not live runtime credentials.

For Lighthouse, set CHROME_PATH to the installed Chrome executable; run `npm exec --yes --package=lighthouse@13.5.0 -- lighthouse http://127.0.0.1:4330/hy/ --only-categories=performance --output=json --output-path=artifacts/type-after-home.json --chrome-flags="--headless --no-sandbox" --quiet`. Repeat sequentially for `/hy/contact/` and the Contact filename, with other browser work stopped.

No physical iOS/Android device, mobile Safari, full screen-reader audit or real pinch zoom was tested. Enlargement uses 200% root text, which exercises rem scaling and wrapping; it is not a physical-device zoom claim. No remaining layout failure was found in the tested matrix. No push or deployment was performed.
