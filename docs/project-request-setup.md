# Project request delivery — owner setup

The site stays static Astro. `/functions/api/project-request.ts` provides a Cloudflare Pages POST endpoint at `/api/project-request`. The implementation sends an owner's notification through Telegram Bot API `sendMessage`. The public Telegram username and the owner's Gmail address alone do not provide server-side delivery. No real bot, credentials or destination have been configured by this task, and no real notification has been sent.

Official references reviewed: [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/), [bindings and secrets](https://developers.cloudflare.com/pages/functions/bindings/), [Telegram bot creation](https://core.telegram.org/bots/tutorial), [Telegram Bot API](https://core.telegram.org/bots/api#sendmessage), and [KV consistency](https://developers.cloudflare.com/kv/api/write-key-value-pairs/).

## Secure owner setup, before future publication

1. In Telegram, open the verified **@BotFather**, create a bot with `/newbot`, and keep the returned token private. Enter the token only in Cloudflare's secret field below; never put it in this chat, a PUBLIC_ variable, source, browser code, URL shared with others or a log.
2. Open the new bot from the owner's receiving account and send `/start`. For a group destination, use a private group, add the bot and send it a command there. Use a private destination because requests contain contact details and project descriptions.
3. Obtain the numeric destination chat ID from the bot's `getUpdates` response after `/start`. Perform this privately on your own machine. With the bot token in a local environment variable, a local script can call `https://api.telegram.org/bot<TOKEN>/getUpdates` without printing or sharing the URL; read the `message.chat.id` value locally. Do not paste the token, API URL or whole response into chat. A group ID may be negative. If getUpdates is empty, message the bot again; a bot cannot initiate a new private conversation before the user starts it. No webhook is needed for this outgoing-only integration.
4. In Cloudflare, create a Workers KV namespace for request deduplication/rate limiting. In the Pages project, open **Settings > Bindings > Add > KV namespace**, name the binding **`PROJECT_REQUESTS_KV`**, and select that namespace. The binding name is exact; a namespace ID is not a PUBLIC_ variable. Use a separate local/preview namespace if preview testing is required.
5. Under the Pages project's **Settings > Variables and Secrets**, add **encrypted server-side secrets** `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` for **Production**. Use the genuine token and chat ID from steps 1–3. Leave delivery secrets unset in Preview by default, so a public preview cannot generate real project notifications. Preview submissions will truthfully report unavailable. Any configured preview should use a separate test bot/chat and every real test must be explicitly labeled TEST ONLY.
6. Retain the build configuration below and, only when publication is authorized, use Git-based Pages deployment. Cloudflare automatically builds root-level `/functions`; dashboard Direct Upload does not support this Functions folder. Rebuild/redeploy after adding secrets or bindings. No Astro SSR conversion, paid email service or domain purchase is needed.

| Configuration | Production | Preview |
| --- | --- | --- |
| Branch / output | `main` / `dist` | Preview branch / `dist` |
| Build command | `npm run build` | `npm run build` |
| `NODE_VERSION` | `24.16.0` | `24.16.0` |
| `PUBLIC_SITE_URL` | Confirmed HTTPS production origin | Same production origin |
| `HAYWEB_BUILD_TARGET` | `production` | `preview` |
| `ASTRO_TELEMETRY_DISABLED` | `1` recommended | `1` recommended |
| `GOOGLE_SITE_VERIFICATION` | Optional genuine Google token | Normally unset |
| `TELEGRAM_BOT_TOKEN` | Genuine bot token, encrypted secret | Unset; or isolated test-bot secret |
| `TELEGRAM_CHAT_ID` | Genuine private destination ID, encrypted secret | Unset; or isolated test-chat secret |
| KV binding `PROJECT_REQUESTS_KV` | Owner-created namespace | Separate namespace if used |

`CF_PAGES` is supplied automatically by Cloudflare. The function does not use PUBLIC_ delivery credentials. Suggested Functions compatibility date: `2026-10-14`; the endpoint uses standard Web APIs and requires no Node compatibility flag. Observe the applicable free-plan quotas; this task does not enable a paid plan.

## Local checks

`npm run build` and Astro preview serve the HTML but **do not execute Pages Functions**. For local endpoint execution, use `npm exec --package=wrangler -- wrangler pages dev dist --kv PROJECT_REQUESTS_KV`. Create ignored `.dev.vars` only if you intentionally want to use real private provider credentials locally. Those names are the same server-side `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Do not use real credentials for automated tests.

`npm run test:requests` uses an in-memory KV mock and injected mock delivery. `npm run test:offer` uses mocked API responses in the browser; no request reaches Telegram. `npm exec --package=wrangler -- wrangler pages functions build functions --outdir artifacts/functions` compiles the endpoint without deploying. All generated diagnostics and screenshots stay in ignored `artifacts/`.

After secure configuration and an authorized future deployment, send one **explicitly labeled TEST ONLY** owner request. Confirm the actual private Telegram notification contains the supplied contacts, selected services/quantity, 190,000 → 85,000 AMD full-option example, separate 15,000 AMD/month maintenance, preferred language/contact, description, reference and timestamp. Then check the visible confirmation. This live verification has not been performed here.

## Validation, privacy and retry behavior

The client and server validate required name/description/acknowledgement, a valid email or phone, matching preferred contact, HTTP(S) profile URL, boolean service options and integer additional-page quantity 0–100. Name/business/email/phone/URL/description length limits are 100/120/254/40/400/2,000 characters. The request body is capped at 16 KB. The server ignores client totals and recalculates from `src/config.ts` through `src/lib/pricing.ts`.

Spam checks include same-origin JSON POSTs, a hidden honeypot, a best-effort five-attempts-per-minute limit keyed by a salted IP hash, and a brief in-progress request marker. The browser prevents repeat submissions while loading and retains the same request ID after an unchanged retry. KV retains a sent-request fingerprint and confirmation for 24 hours; it does not retain full contact details or description. No localStorage, analytics capture or marketing subscription is added. Notifications use plain text without Telegram parse_mode, so submitted text cannot become executable markup. Credentials/provider URLs and personal data are not logged.

KV is eventually consistent and has per-key write limits: deduplication/rate limiting is practical best-effort protection, **not exactly-once delivery or an atomic global lock**. Separate pending/sent keys avoid immediate double writes to the same request key. A provider timeout can leave delivery uncertain and a later retry could duplicate a notification; stronger transactional behavior would need a separately scoped design. Names and single-line fields normalize embedded line breaks; descriptions retain their lines. The complete bounded notification fits Telegram's text limit.

Only a successful Telegram HTTP response with `ok: true` permits a success response. Missing secrets/binding return 503; provider rejection/timeout returns 502; invalid fields return 422; throttling returns 429. Browser errors preserve details and never display a purchase/payment completion. After confirmed delivery, the localized confirmation promises contact within **1 hour**, as explicitly requested by the owner, without invented business-hour restrictions. The owner must be able to meet that response commitment.

**Current status:** integration implemented and tested with mocks; real submission delivery awaits the owner's secure configuration and future live verification. Nothing was deployed.
