# ATELIER illustrative hero concept review - 2026-10-15

Only the website interiors of the existing homepage mockups changed. The fictional ATELIER concept uses shared English content, warm ivory/charcoal/turquoise tokens, a geometric SVG courtyard house, and a small concept-study preview. The phone uses a stacked composition. The localized illustrative caption and the decorative concept-grid remain unchanged. HayWeb hero copy, CTAs, grid layout, frame styles, placement, pointer interaction, pricing and server delivery were not edited.

Layout is driven by explicit desktop/phone variants and named CSS container queries. The two device interiors are aria-hidden, have no links/controls/tab stops, and use paragraphs rather than semantic headings. Only the localized figcaption is announced. No new fonts, libraries, JavaScript or animation loops were introduced. CSS is inlined only with the concept; the SVGs are inline.

## Performance comparison

Three sequential runs per version, same optimized static build server at http://127.0.0.1:4330/hy/. Lighthouse 13.5.0, Chrome 155, simulated mobile 412 x 823, CPU slowdown 4x, RTT 150 ms. No browser suites ran concurrently. Medians below; local diagnostics, not live hosting measurements.

| Version | Performance | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
| --- | ---: | ---: | ---: | ---: | ---: |
| before | 100 | 1359 | 1659 | 0.0115 | 0 |
| after | 100 | 1358 | 1658 | 0.0115 | 0 |

Individual score/LCP values in run order:
- before: 100 / 1659 ms, 100 / 1658 ms, 100 / 1734 ms
- after: 100 / 1659 ms, 100 / 1658 ms, 100 / 1658 ms

## Requests and verification

- before: 8 total requests, 1 stylesheet, 3 unchanged fonts. HTML transfer 8839 bytes; CSS transfer 10745 bytes (including response headers).
- after: 8 total requests, 1 stylesheet, 3 unchanged fonts. HTML transfer 12342 bytes; CSS transfer 10745 bytes (including response headers).

The initial draft added a separate CSS request; it was replaced with inline concept-only CSS. The final version adds no network requests. HTML is slightly larger due to the original SVG scene and CSS, while script/font/image requests are unchanged.

Astro check: 0 errors, warnings or hints. Static build: 29 pages. Existing metadata/link/sitemap checks passed. The focused browser review passed all three languages at 320, 390, 768 and 1440px: no horizontal/vertical clipping, page overflow, extra H1, interactive miniature controls or console exceptions. Desktop and phone close-ups and complete heroes were inspected. Reduced-motion screenshots retain the existing frame transforms without animation.

Device widths/heights match the pre-edit Armenian mockup measurements at all four widths. Frame CSS itself was not changed; fixed container-dependent screen heights reserve space for the new content. Phone overlap stays over the illustration, leaving the desktop headline and CTA readable.

Screenshots: ignored artifacts/atelier-{hy,en,ru}-{desktop,phone,hero}-{390,1440}.png. Desktop close-ups temporarily hide the overlapping phone only during capture to show the full miniature design; complete-hero captures show the actual overlap. Raw Lighthouse reports and layout measurements are in ignored artifacts/atelier-*.

Limits: checked in local Chrome, not a full physical-device or cross-browser audit. Performance timings vary; a 100 score alone is not proof of identical performance. No push, deployment or real form submission was performed.
