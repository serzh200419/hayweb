# HayWeb studio redesign review — 2026-10-14

Local review only. No push, deployment or real notification was sent. Static Astro pages, canonical routes, official SVG logos, translated content, form pricing and Pages delivery/validation code were preserved.

## Design decisions

The homepage now alternates navy, mint, paper and a turquoise final CTA. Benefits use editorial rows, services use an asymmetric bento with original inline SVG icons, process steps use an uninterrupted numbered navy timeline, and prices emphasize the form offer in a joined comparison layout. The language option remains free, maintenance stays separate, and coral is reserved for the promotion. The original illustrative desktop/mobile concept is larger and framed by restrained technical SVG details; it remains explicitly illustrative. About uses the untouched official symbol in a light arch-shaped panel. FAQs retain native details/summary controls. Inner pages share these materials; Contact stays a plain readable form and articles use a mint introduction followed by a narrow reading column.

## Mobile Lighthouse comparison

Three independent cold-navigation runs per page and phase; table values are medians, with no omitted runs. Lighthouse 13.5.0, HeadlessChrome/155.0.0.0, Windows. The optimized static build was served at http://127.0.0.1:4330; metadata retained local-review mode because no real production origin has been assigned. These are local diagnostics, not live hosting or ranking measurements. Browser suites finished before the after measurements.

Mobile emulation: 412 × 823, scale 1.75; simulated RTT 150 ms, throughput 1638.4 Kbps, CPU slowdown 4×. Identical Lighthouse flags and settings in both phases.

| Page | Phase | Performance | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| /hy/ | before | 99 | 1370 | 1669 | 0.0103 | 0 |
| /hy/ | after | 100 | 1358 | 1658 | 0.0115 | 0 |
| /hy/contact/ | before | 99 | 1520 | 1670 | 0.0250 | 0 |
| /hy/contact/ | after | 99 | 1433 | 1658 | 0.0420 | 0 |

No material timing regression was observed in this local comparison: median LCP stayed near 1.66 seconds and TBT stayed at zero. This is not identical performance: Contact CLS increased from 0.0250 to 0.0420, below the 0.1 target; Lighthouse attributes that shift to existing web-font loading in the header/main transition. Motion itself uses transforms rather than layout changes. The small LCP changes are within the variation shown by individual runs.

All individual performance scores / LCP values (ms), in run order:

- before-home: 99 / 1679, 99 / 1595, 99 / 1669.
- before-contact: 99 / 1670, 99 / 1666, 99 / 1670.
- after-home: 100 / 1732, 100 / 1658, 100 / 1658.
- after-contact: 99 / 1658, 99 / 1660, 99 / 1658.

## Initial assets

Browser Resource Timing encoded-body sizes below are compressed payload bytes, excluding response headers. Gzip sizes for inline modules are separate estimates of their contribution inside the HTML; they are not extra network requests. Asset capture used a fresh 390 × 844 touch context, waited for fonts and idle initialization, and did not scroll or submit. The same procedure was used before and after.

| Page | Phase | External JS bytes | Inline JS gzip bytes | CSS bytes | Font requests / bytes | Image requests / bytes |
| --- | --- | ---: | ---: | ---: | --- | --- |
| home | before | 0 | 0 | 6400 | 3 / 82712 | 3 / 2761 |
| contact | before | 2981 | 0 | 6400 | 3 / 82712 | 2 / 2139 |
| home | after | 0 | 1167 | 10432 | 3 / 82712 | 3 / 2761 |
| contact | after | 2981 | 1167 | 10432 | 3 / 82712 | 2 / 2139 |

Added decorative JavaScript: **1167 bytes gzip** (2726 bytes minified inline), below 10 KB gzip. Astro inlines this small processed module, so it creates no extra JS request. Contact's existing form modules remain unchanged. The three original Latin/Cyrillic/Armenian WOFF2 requests total 82,712 bytes in both phases; no new family or external runtime request was added. Image requests remain the supplied wordmark, favicon, and (on the homepage) symbol. All new icons and technical details are inline SVG/CSS.

## Motion and checks

Content is rendered visible. IntersectionObserver starts during idle time, adds a short transform/opacity animation only on entry, unobserves each target and disconnects when finished. Main headline and CTA never wait for animation. The desktop halo keeps the native cursor, uses pointer-events:none, one requestAnimationFrame per pending pointer update, and no layout reads in pointermove. Hero bounds are read on pointer entry. Fine-pointer/hover eligibility and reduced-motion changes install/remove scoped listeners; pointer exit and hidden-page state cancel pending frames. No continuous animation loop, library, canvas or new framework runtime was added. Cursor overlays are suppressed over form controls and absent on touch.

Actual browser interaction passed: pointer visual response, interactive halo, pointer-exit hiding, one-time reveal, reduced-motion cleanup, touch without a halo, and all 28 canonical pages with JavaScript disabled. Interaction-session layout shifts: desktop 0.0013, touch 0.0000; no browser exceptions. Native FAQs remain usable without JS.

Astro check: 0 errors, warnings or hints. Build: 29 HTML pages. Metadata/link/sitemap/hosting checks passed. Existing keyboard, language-switching and no-JS checks passed. All 28 canonical pages passed overflow/CTA checks at 320, 390, 768 and 1440px. Calculator/form browser checks passed for all three languages, including 190,000 → 85,000 AMD plus 15,000 AMD/month separately, accessible error focus, retained inputs, repeated-submit protection and mocked success. Seven server test groups passed, including 128 price combinations and provider/unconfigured failures. No actual Telegram request was made.

Contrast review found the previous teal was 4.34:1 on the new mint surface, so the text/control teal was deepened to #006e73 (5.45:1 on mint). The official SVG colors were not altered. Contrast checks include the new mint/paper surfaces and navy text on turquoise. Visible keyboard focus and form status/errors retain their meaning.

## Reproduction and artifacts

Run `npm run check`, `npm run build`, `npm run verify`, `npm run verify:hosting` and `npm run test:requests`. Start `npm run preview -- --host 127.0.0.1 --port 4330`. Set `PREVIEW_URL=http://127.0.0.1:4330`, then run `npm run test:browser`, `npm run test:offer`, `node scripts/studio-browser-check.mjs` and `node scripts/studio-assets.mjs after`.

For each phase/page, run three sequential mobile Lighthouse checks through temporary tooling (no project dependency): `npm exec --yes --package=lighthouse -- lighthouse http://127.0.0.1:4330/hy/ --only-categories=performance,accessibility --output=json --output-path=artifacts/studio-after-home-1.json --chrome-flags="--headless --no-sandbox" --quiet`. Use the Contact URL and correct phase/page/run filename, and set CHROME_PATH to the installed Chrome executable. Avoid running browser suites concurrently with Lighthouse. Run `node scripts/studio-report.mjs` after both phases to regenerate this table.

Raw Lighthouse reports, resource inventories, interaction results and full-page/viewport screenshots live in ignored artifacts/studio-*. Files are local review artifacts, not committed production assets. Representative desktop/mobile screenshots of all three locales were inspected.

## Limits and performance decisions

Motion was deliberately limited to one-time reveals, a short desktop visual entrance and event-driven pointer response; no perpetual floating, particles, autoplay or heavy animation package was added. There is no physical low-end-device test or full assistive-technology audit. Scores and timing vary across environments; the actual medians above must be read together rather than treating a score as proof of identical performance. Real Cloudflare edge performance and Telegram delivery still need owner configuration and future live verification. The previous submission setup guide remains authoritative; this redesign did not change delivery credentials or bindings. No push or deployment was performed.
