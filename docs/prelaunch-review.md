# HayWeb pre-launch review — 2026-10-14

The existing website was reviewed and updated locally. No new articles, product features, hosting project, account connection, Git push or deployment were added.

## Concrete issues fixed

- The root entry previously had only a general promise and language-selection prompt. It now uses the HayWeb navy card, an explicit business-website heading, the translated service explanation, an Armenian entry button and visible English/Russian links. It stays concise.
- The shared header hid its enquiry CTA below 760px. It now presents a visible, keyboard-accessible quote link on mobile, including inner pages where there is no homepage hero button.
- Discounted price cards and the homepage bundle did not repeat their starting-price qualification. They now say starting from in every language, including standard and discounted bundle amounts. Calculator output was already explicitly an estimated starting total, not a final quote.
- A hosted build could previously use a reserved placeholder origin. Shared configuration now rejects missing, nonpublic or malformed origins for production/preview, and Cloudflare cannot silently select local mode. Ordinary local builds use localhost without configuration. The explicit production build command fails clearly if the owner has not supplied the real origin.
- There was no top-level 404 page or static hosting header configuration. A useful trilingual branded `404.html`, security headers and caching for fingerprinted assets are now generated. Preview builds additionally emit `X-Robots-Tag: noindex`; production builds do not.
- Search Console verification had no configuration. An optional, centralized token now renders the actual supplied Google meta tag; no token was invented or configured. Exact HTML file upload is also documented.

## Customer experience review

The browser checks visited all seven published routes in each language. Representative root, Armenian homepage, English Services, Russian Contact and article screenshots were inspected. The hero's supporting copy explains professional website creation, mobile use and contact. The mobile header enquiry link is visible before the hero. Confirmed base/add-on prices, the 20% code and third-party exclusions are consistent; the service groups distinguish translation, copywriting, ongoing SEO, support and subscriptions from the agreed scope. The calculator includes the base website, and its draft link lists selected additions and the estimated starting amount. The Contact action prepares a draft rather than reporting a message sent.

No fabricated clients, testimonials, team/history claims, performance guarantees or portfolio were found in the reviewed content. The original hero mockup is labeled illustrative. No visible placeholder copy or implementation commentary was found. Platform names, the brand and WEBSERVICE are intentionally unchanged across translations.

Coverage and glyph rendering were checked, but native Armenian/Russian accuracy is not certified. Human editorial review should focus on hero and CTA idiom, technical SEO/integration terminology, translation/content responsibilities, promotion exclusions and the inflected price wording in Armenian articles. Existing useful copy was retained rather than broadly rewritten.

## Actual local Lighthouse results

Lighthouse **13.5.0**, Headless Chrome **155**, mobile form factor, default **simulated** throttling. Each audit ran sequentially against Astro's production-output preview on `127.0.0.1:4321`. No warnings were reported. Scores are one local diagnostic run per requested route, not production guarantees or field measurements.

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | Speed index | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/hy/` | 100 | 100 | 100 | 100 | 1.364 s | 1.364 s | 1.364 s | 0 ms | 0.0133 |
| `/en/services/` | 100 | 100 | 100 | 100 | 1.438 s | 1.513 s | 1.438 s | 0 ms | 0.0089 |
| `/ru/contact/` | 100 | 100 | 100 | 100 | 1.438 s | 1.513 s | 1.438 s | 0 ms | 0.0076 |
| `/en/blog/website-and-instagram/` | 100 | 100 | 100 | 100 | 1.364 s | 1.364 s | 1.364 s | 0 ms | 0.0088 |

Lighthouse still flags the short CSS-to-font dependency chain and the render-blocking stylesheet, estimating approximately 500–550 ms of potential savings. The stylesheet is compact; keeping the initial design styled avoids a flash of unstyled content. There was no material long task or large layout shift to justify changing delivery solely for a score. No application dependency or font preload was added. The three normal variable script subsets total about 83 KB before compression; the visible language switcher legitimately uses Armenian, Latin and Cyrillic. Font-display remains swap.

Chrome's actual rendered-font inspection confirmed **Noto Sans Armenian** custom glyphs on the Armenian heading and **Noto Sans** custom Cyrillic glyphs on the Russian heading. Browser checks confirmed no horizontal overflow at 320, 390, 768 and 1440px; visible focus, keyboard skip links, native FAQs, calculator controls, form validation and equivalent-page/article language switching work. No keyboard trap was observed. This is not a comprehensive screen-reader assessment, and a 100 automated accessibility score is not a WCAG certification.

Raw local diagnostics are in ignored `artifacts/lighthouse-*.json`, with `lighthouse-summary.json` and `font-review.json`. Lighthouse was run via temporary `npm exec --package=lighthouse`, without a package.json dependency. Example reproduction:

```powershell
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd exec --yes --package=lighthouse -- lighthouse http://127.0.0.1:4321/hy/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=artifacts/lighthouse-hy-home.json --chrome-flags="--headless --no-sandbox" --quiet
```

Run the ordinary production-output preview first. Local results do not measure Cloudflare network delivery or its response headers.

## Build and hosting verification

- Astro check: zero errors, warnings or hints.
- Build: 23 HTML pages, consisting of 22 canonical pages plus `404.html`. Sitemap contains exactly the 22 canonical pages, no 404/draft entries.
- Existing static verification: correct route-specific titles/descriptions, self-canonicals, reciprocal language links, translated article relationships, contact encoding, original prices and discounts, sitemap/robots and a 1200×630 PNG.
- Existing browser suites: all locale routes at four widths; all eight calculator combinations per language; validation and keyboard submission; punctuation, newlines and Armenian/Russian text retained in WhatsApp drafts; no-JavaScript navigation/direct-contact alternatives. Test requests to WhatsApp are intercepted; no message is sent.
- Additional review checks: rendered custom-script fonts, visible mobile header CTA, root language entry, HTTP 404 for an unknown deep path, recovery links and fresh screenshots.
- Hosting checks: public-origin guard cases, generated headers/cache rule, preview-only noindex, 404 exclusion from sitemap, optional verification tag omission and static-output scans for common secret patterns/local filesystem paths.
- `npm run build:production` without a public origin fails with the intended clear error. Preview and production builds were then validated against **`https://origin-validation.pages.dev` as an isolated diagnostic fixture only**. No claim is made that this name exists or is available. Generated canonicals, hreflang, social URLs, structured data, sitemap and robots matched the fixture; preview emitted noindex and production did not. Final output was rebuilt for ordinary local review so it contains no claimed production hostname.

Cloudflare's actual edge headers, project-name availability, real production metadata and Search Console cannot be verified before the owner's future publication. `_headers` is verified as emitted configuration; Astro preview does not implement those Cloudflare rules. A post-publication checklist is provided in README. Output pattern scans are a focused hygiene check, not a formal security audit.

## Fresh Armenian homepage screenshots

- [Desktop, full page](../artifacts/prelaunch-hy-1440.png)
- [Mobile, full page](../artifacts/prelaunch-hy-390.png)
- [Desktop, first viewport](../artifacts/prelaunch-hy-1440-top.png)
- [Mobile, first viewport](../artifacts/prelaunch-hy-390-top.png)

These screenshots are local review artifacts, not tracked deployment assets. The improved root entry is also captured as `artifacts/prelaunch-root-390.png` and `prelaunch-root-1440.png`.

## Publication prerequisites

Owner: choose an available Pages project name and confirm its HTTPS production origin, commit/push the reviewed source, authorize the repository connection when publication is allowed, and optionally obtain a genuine Google verification token/file. Armenian/Russian editorial approval remains recommended. Build command is `npm run build`, output directory `dist`, Node version `24.16.0`; the full Git-based deployment and Search Console checklist is in README. Nothing was deployed.
