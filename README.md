# HayWeb

Multilingual HayWeb business website with dedicated services, about, contact and journal pages. Astro + TypeScript, entirely static. **Not deployed.**

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

Business contacts, base pricing and promotion percentage/code live in `src/config.ts`. Prices and bundles are calculated from those values. Public URL, build target and optional Google verification configuration live in `config/site.mjs`; `astro.config.mjs` consumes them. Localized promotion wording in `src/i18n.ts` must also be reviewed if the offer changes.

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

Informational pages ship no browser JavaScript. Services and Contact progressively enhance their tools with small page-specific modules and a shared pricing/contact module (about 2.3 KB combined, uncompressed). Localized tool copy is embedded per page; full translation dictionaries are not shipped to browsers. Only three locally bundled WOFF2 script subsets (Latin, Cyrillic, Armenian) are used, with variable normal weights and `font-display: swap`. Noto fonts are licensed under SIL OFL; notices are included in `public/licenses/`. Hero artwork uses CSS, with no remote image or font requests. No performance score or search indexing outcome is guaranteed.

## Known limitations and next steps

- There is no submission backend. The contact composer prepares a WhatsApp draft for the visitor to review and send.
- Sharing metadata uses a real 1200 x 630 PNG rasterized from the original brand SVG.
- Translations are complete but can benefit from final editorial review by the business before publication.
- Domain, hosting, translation/content work, delivery timing, revisions and maintenance scope are agreed per quote. No external costs or outcomes are implicitly guaranteed.


## Dedicated pages and navigation

For each of `hy`, `en`, `ru`: homepage, `services/`, `about/`, `contact/`, `blog/`, and two localized `blog/[slug]/` articles. There are 22 canonical HTML pages including the Armenian root entry, plus a branded top-level `404.html` excluded from the sitemap. `src/routes.ts` defines page IDs and route builders. The header and footer use dedicated page links; process, pricing and FAQ link to homepage anchors. Navigation wraps on small screens and needs no JavaScript or hidden menu toggle.

`src/page-copy.ts` contains typed new-page translations. `src/layouts/Page.astro` provides page introductions; `SiteHeader` and `SiteFooter` are shared with the preserved homepage. Metadata uses each actual canonical route, with matching page/article language alternatives. Articles include BlogPosting and BreadcrumbList data; dedicated pages have breadcrumbs. The sitemap includes only published pages and articles. The root entry has consistent title/description and social metadata.

## Publishing articles

Articles are typed build-time content in `src/articles.ts`, rather than a database or CMS. Add one record per language with a shared stable `id`, unique localized `slug`, title, description, actual ISO publication date, paragraphs grouped under headings, related translation IDs and `draft` status. Set `updated` only when a real revision occurs; it adds dateModified to structured data. Reading time is derived from article text at 200 words per minute, with a one-minute minimum.

Draft and future-dated entries are excluded from routes, listings, related links and sitemap. Current published translation groups must have all three languages; missing equivalents fail the build rather than sending readers to an unrelated page. Do not change an existing slug casually; a published URL change would need a redirect plan. Prices in cost articles use placeholders resolved from `src/config.ts` by `src/lib/article-text.ts`; do not duplicate price arithmetic in article prose. HayWeb is the actual publisher/byline. Current articles were created on 2026-10-14.

## Estimates and enquiries

The Services calculator always includes the base website, with optional three-language setup, blog setup and WEBSERVICE promotion. `src/lib/estimate.ts` uses the same configured prices and discount as the homepage. Its WhatsApp link includes selected options, promotion when applied and estimated starting total. It is not a final quote. Without JavaScript, prices and the direct enquiry link remain usable and interactive fields are disabled.

The Contact composer accepts optional name, business, URL and promotion code, service interest, description and preferred language. All fields have visible localized labels. Either a service choice or short description is sufficient; provided URLs must use HTTP or HTTPS. Validation marks and focuses the relevant field with an associated localized explanation. A valid submit prepares an encoded WhatsApp draft and navigates in the same tab. The visitor must send it in WhatsApp. There is no success claim, persistence, localStorage, analytics capture or backend. Direct WhatsApp, telephone, Telegram and email links remain available without JavaScript.

## Extended QA

After building, run `npm run verify` (includes both verification scripts). It checks all 22 pages, unique page titles/descriptions, self-canonicals, reciprocal translated URLs, structured data, internal paths and anchors, article rendering, sitemap and PNG dimensions.

With preview running, run `npm run test:browser` (runs both browser scripts). The latter covers all seven routes per language at 320, 390, 768 and 1440px, plus equivalent-page/article language switching, keyboard focus, all eight calculator combinations, localized WhatsApp drafts preserving punctuation and newlines, validation, keyboard form submission and no-JavaScript navigation/contact alternatives. WhatsApp requests are intercepted during testing; no enquiry is sent. Screenshots of home, services, contact and one article are captured for every language at 390 and 1440px into ignored `artifacts/`, including viewport-only variants. Inspect representative screenshots manually. This is focused browser QA, not a full screen-reader audit or a production performance measurement.

Latest verification: Astro check reported 0 errors, 0 warnings and 0 hints; the production build now generates 23 pages (22 canonical pages plus the branded 404). Both static verification scripts and both browser scripts passed. All language routes passed overflow checks at 320, 390, 768 and 1440px. Eight calculator combinations and encoded enquiry drafts passed for each locale. Representative desktop/mobile screenshots of the homepage, Services, Contact and an article were manually inspected. No deployment was performed.


## Exact Cloudflare Pages deployment checklist

These are instructions for the owner to use when publication is authorized. Nothing in this task connected an account, created a project, pushed Git changes or deployed. Official Cloudflare guidance was reviewed on 2026-10-14: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build image / Node overrides](https://developers.cloudflare.com/pages/configuration/build-image/), [preview indexing](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), and [static serving / 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).

1. Review and commit the local website changes, then push them to the existing `serzh200419/hayweb` GitHub repository. The current branch is `main`; the implementation has not been committed or pushed by this task. The remote must contain the actual source and `package-lock.json`, not just its original README. Keep `.env`, `node_modules/`, `dist/` and `artifacts/` out of Git.
2. When ready to publish, open Cloudflare **Workers & Pages > Create application > Pages > Connect to Git**. Select GitHub, authorize access to the existing repository and choose `serzh200419/hayweb`. Select Git integration rather than Direct Upload.
3. Choose an available Pages project name and confirm the production hostname Cloudflare assigns. Do not assume `hayweb.pages.dev` is available. Use the confirmed `https://<assigned-project>.pages.dev` origin. If the initial setup cannot confirm the final name before its build, leave the public URL unset so the guard fails instead of publishing bad metadata; then configure the assigned origin in project settings and retry the build.
4. Select production branch `main`, Astro preset (or manual settings), repository root as the root directory, **build command `npm run build`**, and **output directory `dist`**. Use the supported v3 build image. No adapter, Functions, server or Wrangler deploy command is needed.
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
8. Check the actual production site after that future deployment: root language choice, all three homepages, deep article URLs, pricing calculator, WhatsApp draft preparation, `/social.png`, `/robots.txt`, `/sitemap.xml`, and an unknown path. Confirm the unknown path responds with HTTP 404 and the branded page, not a 200 homepage fallback. Check that a no-slash URL such as `/en/services` resolves to `/en/services/`; files are generated as `index.html` under each route and Pages supplies static URL normalization. Deep links need no browser router or SPA fallback.

### Preview indexing and response headers

Cloudflare automatically sends `X-Robots-Tag: noindex` for native preview deployments. As an explicit safeguard, the build additionally inserts that header in `dist/_headers` only for `HAYWEB_BUILD_TARGET=preview`. Production builds regenerate the base file without that header. Preview canonicals and sitemap still reference the real production origin. Root/homepage x-default points to the Armenian entry at `/`; inner-page and article x-default points to the equivalent Armenian URL. The 404 has no hreflang and its own noindex meta tag.

After publication, use `curl -I` (or `curl.exe -I` in PowerShell) against the production root, `/hy/`, `/social.png`, a deep article and an unknown path. Repeat against a real branch/hash preview URL. Preview responses must contain `X-Robots-Tag: noindex`; valid production content must not. Also check `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` and the camera/microphone/geolocation Permissions-Policy. Use a generated `/_astro/<fingerprinted-file>` URL to check `Cache-Control: public, max-age=31536000, immutable`. There is no long-lived custom cache rule for HTML or the unversioned sharing image.

`public/_headers` is copied into the output and applies to static Pages responses. No CSP was introduced, so inline structured data and current calculator/form scripts are not accidentally blocked. The top-level `404.html` tells Pages to use genuine not-found behavior instead of treating the site as an SPA. Astro's local preview does not apply Cloudflare `_headers` rules; emitted files were verified locally, but real edge response headers require the post-publication checks above. Never use a global noindex rule in the production base headers.

### Search Console after publication

Follow Google's [property setup](https://support.google.com/webmasters/answer/34592) and [ownership verification](https://support.google.com/webmasters/answer/9008080) guidance. Add the exact `https://<assigned-project>.pages.dev/` address as a **URL-prefix** property, including the correct HTTPS protocol and hostname.

For HTML-tag verification, Google provides a `google-site-verification` meta tag. Copy only its exact `content` value into the centralized `GOOGLE_SITE_VERIFICATION` Production build variable, rebuild, inspect the live root HTML for that tag, then select Verify in Search Console. Do not invent a token. Keep the tag present after verification. Alternatively, place Google's exact downloaded HTML verification file unchanged in `public/`, commit/push it, rebuild, and confirm its exact URL returns 200. No verification file or token has been supplied yet.

Submit the actual `https://<assigned-project>.pages.dev/sitemap.xml` URL through the [Sitemaps report](https://support.google.com/webmasters/answer/7451001). Use URL Inspection for `/hy/` and a representative translated page or article. Inspect the generated canonical, hreflang, content and whether indexing is allowed. Request indexing if appropriate; verification, sitemap submission and an indexing request do not guarantee indexing or rankings. A later production domain change needs rebuilt metadata and a new matching property.

### Owner inputs and remaining checks

The owner must choose an available project name, confirm the real production origin, authorize the GitHub connection when actually deploying, and optionally supply Google's genuine verification token/file. No credentials are needed by the local implementation. Native Armenian/Russian editorial review is still recommended for the idiom of hero/CTA text, technical service terminology, promotion exclusions and article price phrasing. Rendering and translation coverage were checked; native-language accuracy is not certified. A full screen-reader audit and actual Cloudflare edge/header checks have not been performed.

See [the focused pre-launch report](docs/prelaunch-review.md) for observed issues, final checks and local Lighthouse metrics. Lighthouse was temporary QA tooling, not a new application dependency.
