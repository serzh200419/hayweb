# HayWeb

Multilingual HayWeb business website with dedicated services, about, contact and journal pages. Astro + TypeScript static pages with one Cloudflare Pages submission Function. **Not deployed.**

## Local development

Use Node.js 24.16.0 (pinned in `.node-version`) and npm. The project requires at least Node 22.12. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run verify
npm run verify:hosting
npm run preview
```

The preview serves `dist/` at http://localhost:4321. `verify` checks the generated production HTML, so run it after building. In restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` to prevent Astro writing telemetry preferences outside the project.

## Configuration and eventual hosting

Ordinary local development and `npm run build` require no environment variables. Local review metadata defaults to `http://localhost:4321`; this output is for local review only. Copy `.env.example` to `.env` if local configuration is needed. Real process environment variables take precedence.

Hosted builds require `HAYWEB_BUILD_TARGET=production` or `preview` and `PUBLIC_SITE_URL` set to the confirmed HTTPS **production** origin. `CF_PAGES=1` prevents a local-mode build on Cloudflare. `npm run build:production` also enforces the production guard locally. Missing URLs, non-HTTPS origins, localhost/IPs, reserved example/test domains, Pages preview aliases, paths, credentials and ports fail clearly. Do not infer availability of any particular project name. Canonicals, reciprocal language alternatives, structured data, sharing metadata, sitemap and robots all derive from the same origin.

The configuration is centralized in `config/site.mjs`; the Astro integration writes preview-only indexing headers after the build. See the exact checklist below before creating a hosted project. No deployment or hosting registration has been performed.

Business contacts, regular prices and the form-only promotion live in `src/config.ts`. `src/lib/pricing.ts` calculates all estimates from those values. Public URL, build target and optional Google verification configuration live in `config/site.mjs`; `astro.config.mjs` consumes them. Localized offer wording in `src/offer-copy.ts` and relevant content must also be reviewed if the offer changes.

## Architecture

- `src/pages/index.astro`: lightweight Armenian language entry, with no automatic redirect.
- `src/pages/[lang]/index.astro`: reusable landing page for `/hy/`, `/en/`, `/ru/`; dedicated routes and cross-page section anchors.
- `src/i18n.ts`: Armenian, English and Russian copy with a shared TypeScript shape, including metadata, accessibility labels, FAQs and contact messages.
- `src/components/`: wordmark, language switcher and original CSS desktop/mobile concept. It is explicitly illustrative, not client work. The shared route map and stable article translation IDs preserve equivalent pages through the switcher.
- `src/layouts/Base.astro`: localized metadata, canonical, hreflang and truthful Organization/WebSite data.
- `src/styles/`: responsive design tokens, typography, focus treatments and reduced-motion behavior.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts`: build-time static SEO endpoints.
- `public/`: original SVG identity and sharing artwork, plus font license notices.
- `scripts/verify.mjs`: production content/link/price/metadata/contrast checks.
- `scripts/browser-check.mjs`: optional Chrome QA and screenshot capture. Start preview first, then `node scripts/browser-check.mjs`. Set `CHROME_PATH` if Chrome is elsewhere. Screenshots are saved in ignored `artifacts/`.

## Verification and performance

Astro/type checks and production build pass. Generated HTML verification passes across all three languages: actual server-rendered content, eight FAQs per route, internal links, equivalent language links, canonicals, language alternatives, structured data, promotion arithmetic and encoded WhatsApp enquiries.

Headless Chrome checks pass at 390px and 1440px for all locales, plus overflow checks at 320px. Checked successful responses, loaded fonts, absence of horizontal overflow and browser errors, keyboard skip links, keyboard FAQ toggles, and language switching. Desktop and mobile screenshots were captured for each locale and representative captures inspected. This is focused QA, not a full assistive-technology audit.

Main foreground/background pairs exceed WCAG AA's 4.5:1 normal-text threshold; turquoise on off-white is 4.55:1 and navy on aqua is 9.56:1. Visible focus, native FAQ disclosure and semantic sections work without client JavaScript.

Informational pages ship no browser JavaScript. Services and Contact progressively enhance their tools with small page-specific modules and a shared pricing/contact module (small shared client modules). Localized tool copy is embedded per page; full translation dictionaries are not shipped to browsers. Only three locally bundled WOFF2 script subsets (Latin, Cyrillic, Armenian) are used, with variable normal weights and `font-display: swap`. Noto fonts are licensed under SIL OFL; notices are included in `public/licenses/`. Hero artwork uses CSS, with no remote image or font requests. No performance score or search indexing outcome is guaranteed.

## Known limitations and next steps

- The project request endpoint requires server-side delivery credentials and a KV binding; until configured, it returns unavailable rather than claiming success.
- Sharing metadata uses a real 1200 x 630 PNG rasterized from the original brand SVG.
- Translations are complete but can benefit from final editorial review by the business before publication.
- Domain, hosting, translation/content work, delivery timing, revisions and maintenance scope are agreed per quote. No external costs or outcomes are implicitly guaranteed.


## Dedicated pages and navigation

For each of `hy`, `en`, `ru`: homepage, `services/`, `about/`, `contact/`, `blog/`, and two localized `blog/[slug]/` articles. There are 28 canonical HTML pages including the Armenian root entry, plus a branded top-level `404.html` excluded from the sitemap. `src/routes.ts` defines page IDs and route builders. The header and footer use dedicated page links; process, pricing and FAQ link to homepage anchors. Navigation wraps on small screens and needs no JavaScript or hidden menu toggle.

`src/page-copy.ts` contains typed new-page translations. `src/layouts/Page.astro` provides page introductions; `SiteHeader` and `SiteFooter` are shared with the preserved homepage. Metadata uses each actual canonical route, with matching page/article language alternatives. Articles include BlogPosting and BreadcrumbList data; dedicated pages have breadcrumbs. The sitemap includes only published pages and articles. The root entry has consistent title/description and social metadata.

## Publishing articles

Articles are typed build-time content in `src/articles.ts`, rather than a database or CMS. Add one record per language with a shared stable `id`, unique localized `slug`, title, description, actual ISO publication date, paragraphs grouped under headings, related translation IDs and `draft` status. Set `updated` only when a real revision occurs; it adds dateModified to structured data. Reading time is derived from article text at 200 words per minute, with a one-minute minimum.

Draft and future-dated entries are excluded from routes, listings, related links and sitemap. Current published translation groups must have all three languages; missing equivalents fail the build rather than sending readers to an unrelated page. Do not change an existing slug casually; a published URL change would need a redirect plan. Prices in cost articles use placeholders resolved from `src/config.ts` by `src/lib/article-text.ts`; do not duplicate price arithmetic in article prose. HayWeb is the actual publisher/byline. Current articles were created on 2026-10-14.

## Estimates and project requests

The Services calculator and Contact form use `src/lib/pricing.ts` for the same one-time regular/form-offer amounts. Languages are optional and zero-cost with a submitted request. Additional pages are beyond the agreed base scope; monthly maintenance is fixed and separate. Only option flags and quantity travel in the calculator-to-form URL, never personal details.

Contact is now a real project request form. It requires a name, description, project selection and permission to contact the visitor, plus at least one valid email or phone. The preferred contact method must match supplied details. The same rules run in the client and the Pages Function. Submission is a quote request, not a purchase; no payment is requested. Entered details remain in the form after errors. Successful delivery displays the owner's requested one-hour response commitment and a request reference. Direct WhatsApp, phone, Telegram and email remain secondary contacts and work without JavaScript.

The static site remains Astro static output. A single root-level Pages Function handles `/api/project-request`; only that path invokes Functions through `_routes.json`. Setup details and limitations are in [docs/project-request-setup.md](docs/project-request-setup.md). The delivery provider is Telegram, not email; the owner's email remains a direct-contact address. No real delivery has been verified or configured by this task.

## Extended QA

After building, run `npm run verify` (includes both verification scripts). It checks all 28 canonical pages, unique page titles/descriptions, self-canonicals, reciprocal translated URLs, structured data, internal paths and anchors, article rendering, sitemap and PNG dimensions.

If preview selects a different address, set `PREVIEW_URL` to that local origin for `test:offer`. With preview running, `npm run test:browser` checks navigation, keyboard controls, language switching, responsive pages and no-JavaScript contact alternatives. `npm run test:offer` checks every canonical page at 320, 390, 768 and 1440px, all-option pricing and selection transfer, accessible validation, retained details, unchanged retry IDs, failed delivery without false success and mocked confirmation in all three languages. `npm run test:requests` checks 128 pricing combinations and server validation/delivery behavior with mock Telegram and KV implementations. No real notification is sent by these checks. Screenshots stay in ignored `artifacts/`; the success image explicitly uses a MOCK reference. This is focused QA, not a full screen-reader audit or production performance measurement.

Latest offer verification: Astro check reported 0 errors, 0 warnings and 0 hints; the static build generates 29 HTML pages. Static SEO/link/price checks and the offer browser suite passed. Representative desktop/mobile offer screenshots were manually inspected. Actual provider delivery and live Cloudflare behavior still await private configuration and publication.


## Exact Cloudflare Pages deployment checklist

These are instructions for the owner to use when publication is authorized. Nothing in this task connected an account, created a project, pushed Git changes or deployed. Official Cloudflare guidance was reviewed on 2026-10-14: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build image / Node overrides](https://developers.cloudflare.com/pages/configuration/build-image/), [preview indexing](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), and [static serving / 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).

1. Review and commit the local website changes, then push them to the existing `serzh200419/hayweb` GitHub repository. The current branch is `main`; local commits exist, but these changes have not been pushed. The remote must contain the actual source and `package-lock.json`, not just its original README. Keep `.env`, `node_modules/`, `dist/` and `artifacts/` out of Git.
2. When ready to publish, open Cloudflare **Workers & Pages > Create application > Pages > Connect to Git**. Select GitHub, authorize access to the existing repository and choose `serzh200419/hayweb`. Select Git integration rather than Direct Upload.
3. Choose an available Pages project name and confirm the production hostname Cloudflare assigns. Do not assume `hayweb.pages.dev` is available. Use the confirmed `https://<assigned-project>.pages.dev` origin. If the initial setup cannot confirm the final name before its build, leave the public URL unset so the guard fails instead of publishing bad metadata; then configure the assigned origin in project settings and retry the build.
4. Select production branch `main`, Astro preset (or manual settings), repository root as the root directory, **build command `npm run build`**, and **output directory `dist`**. Use the supported v3 build image. No Astro server adapter is needed. The root-level Pages Function is bundled by Git-based Pages deployment; do not use dashboard Direct Upload for this integration.
5. Configure build environment variables in the setup screen, or project **Settings > Environment variables / Variables and Secrets**, separately for **Production** and **Preview**:

   | Variable | Production | Preview |
   | --- | --- | --- |
   | `NODE_VERSION` | `24.16.0` | `24.16.0` |
   | `PUBLIC_SITE_URL` | Confirmed HTTPS production origin | The same production origin |
   | `HAYWEB_BUILD_TARGET` | `production` | `preview` |
   | `ASTRO_TELEMETRY_DISABLED` | `1` | `1` |
   | `GOOGLE_SITE_VERIFICATION` | Optional real content token from Google | Usually leave unset |

   `.node-version` also pins Node 24.16.0. Cloudflare supports Node overrides through this file or `NODE_VERSION`; do not rely on `package.json` engines being detected. Do not put a branch/hash preview URL into `PUBLIC_SITE_URL`.
6. Before publishing, run the local checks using the confirmed origin: `npm run check`, `npm run build:production`, `npm run verify` and `npm run verify:hosting`. Keep `HAYWEB_BUILD_TARGET=production` in the environment for verification too. On PowerShell, use `$env:PUBLIC_SITE_URL='https://<confirmed-origin>'` and `$env:HAYWEB_BUILD_TARGET='production'`, replacing the placeholder. These commands only build locally.
7. Only when publication is authorized, finish the dashboard's **Save and Deploy** flow or retry the correctly configured production build. After confirming or changing the public URL, trigger a **new build** of the production branch; old artifacts cannot update their canonicals by changing variables alone. Subsequent pushes to connected branches can trigger automatic deployments.
8. Check the actual production site after that future deployment: root language choice, all three homepages, deep article URLs, pricing calculator, project request delivery (a clearly labeled owner test), secondary contact links, `/social.png`, `/robots.txt`, `/sitemap.xml`, and an unknown path. Confirm the unknown path responds with HTTP 404 and the branded page, not a 200 homepage fallback. Check that a no-slash URL such as `/en/services` resolves to `/en/services/`; files are generated as `index.html` under each route and Pages supplies static URL normalization. Deep links need no browser router or SPA fallback.

### Preview indexing and response headers

Cloudflare automatically sends `X-Robots-Tag: noindex` for native preview deployments. As an explicit safeguard, the build additionally inserts that header in `dist/_headers` only for `HAYWEB_BUILD_TARGET=preview`. Production builds regenerate the base file without that header. Preview canonicals and sitemap still reference the real production origin. Root/homepage x-default points to the Armenian entry at `/`; inner-page and article x-default points to the equivalent Armenian URL. The 404 has no hreflang and its own noindex meta tag.

After publication, use `curl -I` (or `curl.exe -I` in PowerShell) against the production root, `/hy/`, `/social.png`, a deep article and an unknown path. Repeat against a real branch/hash preview URL. Preview responses must contain `X-Robots-Tag: noindex`; valid production content must not. Also check `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` and the camera/microphone/geolocation Permissions-Policy. Use a generated `/_astro/<fingerprinted-file>` URL to check `Cache-Control: public, max-age=31536000, immutable`. There is no long-lived custom cache rule for HTML or the unversioned sharing image.

`public/_headers` is copied into the output and applies to static Pages responses. No CSP was introduced, so inline structured data and current calculator/form scripts are not accidentally blocked. The top-level `404.html` tells Pages to use genuine not-found behavior instead of treating the site as an SPA. Astro's local preview does not apply Cloudflare `_headers` rules; emitted files were verified locally, but real edge response headers require the post-publication checks above. Never use a global noindex rule in the production base headers.

### Search Console after publication

Follow Google's [property setup](https://support.google.com/webmasters/answer/34592) and [ownership verification](https://support.google.com/webmasters/answer/9008080) guidance. Add the exact `https://<assigned-project>.pages.dev/` address as a **URL-prefix** property, including the correct HTTPS protocol and hostname.

For HTML-tag verification, Google provides a `google-site-verification` meta tag. Copy only its exact `content` value into the centralized `GOOGLE_SITE_VERIFICATION` Production build variable, rebuild, inspect the live root HTML for that tag, then select Verify in Search Console. Do not invent a token. Keep the tag present after verification. Alternatively, place Google's exact downloaded HTML verification file unchanged in `public/`, commit/push it, rebuild, and confirm its exact URL returns 200. No verification file or token has been supplied yet.

Submit the actual `https://<assigned-project>.pages.dev/sitemap.xml` URL through the [Sitemaps report](https://support.google.com/webmasters/answer/7451001). Use URL Inspection for `/hy/` and a representative translated page or article. Inspect the generated canonical, hreflang, content and whether indexing is allowed. Request indexing if appropriate; verification, sitemap submission and an indexing request do not guarantee indexing or rankings. A later production domain change needs rebuilt metadata and a new matching property.

### Owner inputs and remaining checks

The owner must choose an available project name, confirm the real production origin, authorize the GitHub connection when actually deploying, and optionally supply Google's genuine verification token/file. Local mock checks need no credentials; real submission delivery needs the private secrets and KV binding in the setup guide. Native Armenian/Russian editorial review is still recommended for the idiom of hero/CTA text, technical service terminology, promotion exclusions and article price phrasing. Rendering and translation coverage were checked; native-language accuracy is not certified. A full screen-reader audit and actual Cloudflare edge/header checks have not been performed.

See [the focused pre-launch report](docs/prelaunch-review.md) for observed issues, final checks and local Lighthouse metrics. Lighthouse was temporary QA tooling, not a new application dependency.


## Official branding

The supplied official SVGs are preserved unchanged in `public/branding/hayweb-logo.svg` (wordmark) and `hayweb-symbol.svg` (symbol). The shared header/footer home link renders the wordmark with explicit intrinsic dimensions, proportionate responsive sizing, a single HayWeb accessible name and a decorative image with empty alt text. Compact placements use the symbol. For navy contexts, `Wordmark` accepts `onDark` to use a neutral light panel; official lettering and colors are never inverted or recolored.

`favicon.svg` uses the official symbol on a light background for readability in dark browser chrome. PNG fallbacks are `favicon-32.png` and `apple-touch-icon.png`. `social.svg` composes the unchanged official wordmark paths on a light panel over the navy sharing canvas; `social.png` is its real 1200 x 630 raster export. No raster was traced or embedded as pretend vector artwork. The new screenshots in ignored `artifacts/branding-header-*` and `branding-footer-*` capture the header/footer at 390px and 1440px.

Deployment variables remain exactly those in the checklist table above: `NODE_VERSION=24.16.0` for both environments, `HAYWEB_BUILD_TARGET=production` for Production and `preview` for Preview, and `PUBLIC_SITE_URL` set to the same confirmed HTTPS production origin in both. `ASTRO_TELEMETRY_DISABLED=1` is optional and recommended; `GOOGLE_SITE_VERIFICATION` remains unset until Google's genuine content value is supplied. `CF_PAGES` is provided by Cloudflare itself, not an owner-entered variable. No production origin has been assigned in this repository yet.


## Focused SEO content and architecture review

The intent, suggested search phrases, rendered titles/descriptions/H1s and relevant internal links for every canonical page are recorded in [docs/seo-page-map.md](docs/seo-page-map.md). Qualitative search wording observations are separated from editorial recommendations; no volumes, difficulty scores or ranking forecasts are claimed. The shared noindex 404 is documented separately.

Two service topics are now available in every language at `/[lang]/services/business-websites/` and `/[lang]/services/multilingual-websites/`. They provide distinct audience guidance, preparation requirements, deliverables, price factors and relevant FAQs, without city/industry doorway pages. `src/service-copy.ts` holds typed translations; the shared route map includes both IDs and the sitemap derives its pages from that map. Descriptive service links appear in the homepage and Services overview; articles link to service details, which link to the existing guides and Contact. Header navigation remains concise. Redesign is retained in the overview pending a more concrete migration/audit offering.

`src/page-meta.ts` defines purpose-specific search titles and a distinct About introduction. Article descriptions now provide a direct opening answer, with prices resolved from the existing business configuration. Article titles, substantive body examples and publication dates were retained; no new article or artificial freshness date was added. The root has a distinct brand/language-entry H1. The SEO review preserved the official logos and interactive structure; the subsequent form-offer update is documented below.

After building, `npm run verify` checks unique H1s, reciprocal language links and x-default, all canonical sitemap URLs and reachability from the root, in addition to the existing metadata/link checks. Run `node scripts/seo-page-map.mjs` to regenerate the page records from built HTML; maintain its intent assignments when adding new pages. `node scripts/seo-browser-check.mjs` checks changed layouts and both service topics at 320, 390 and 1440px across the three languages and captures screenshots in ignored artifacts. The current site has 28 canonical pages plus the branded 404, 29 HTML pages total. Lighthouse was not repeated for these static text/link/CSS changes.

Actual production metadata and Search Console still require the real public origin, a rebuild and live verification. The short prioritized post-launch content plan is recorded in the SEO map and has not been implemented. No push or deployment was performed as part of this SEO review.


## Current form offer

| Item | Regular starting amount (AMD) | Starting amount with submitted project request (AMD) |
| --- | ---: | ---: |
| Business website | 80,000 | 40,000 |
| Three-language structure | 20,000 | 0 |
| Blog setup | 20,000 | 10,000 |
| Product/catalog setup | 30,000 | 15,000 |
| Each additional page beyond the agreed base | 10,000 | 5,000 |
| Logo design | 30,000 | 15,000 |

Maintenance is fixed at 15,000 AMD/month and excluded from the discount. Third-party charges are separate. Free language setup covers Armenian, English and Russian structure; translation/content responsibilities are agreed in the quote. Product count, payment integration, shipping and advanced store features are scoped separately. All one-time choices with one additional page: 190,000 AMD regular, 85,000 AMD through the form, with maintenance separate.

The coral offer strip is shared by all pages. Pricing cards use regular struck-through amounts and prominent form-offer amounts. Promotional/enquiry CTAs point to the localized project request form. The previous offer is retired; there is no promotional-code field. The cost articles were substantively updated for these prices and retain their publication date with an actual revision date of 2026-10-14.

Run `npm run test:requests` for trusted pricing, validation and mocked provider/idempotency checks. With preview running, `node scripts/offer-browser-check.mjs` checks all 28 canonical routes at four widths, all-option calculation and transfer, accessible validation, retry retention, mocked failure and mocked success. The success screenshot has a MOCK test reference and is not evidence of live delivery. `npm run check`, build, metadata/link/hosting checks and Wrangler's local Functions compilation remain applicable. Credentials must never be entered into chat, committed or prefixed PUBLIC_. See the setup guide for the exact secure environment and binding names. This task does not push or deploy.
