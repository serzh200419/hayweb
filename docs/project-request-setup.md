# Telegram project requests: local and production setup

The existing endpoint remains `functions/api/project-request.ts` at `/api/project-request`. It uses Telegram `sendMessage` with plain text. No duplicate endpoint or WhatsApp redirect was added.

## Observed cause and result

Before repair, a real browser submission in Wrangler returned **HTTP 503 / `{"error":"unconfigured"}`**. Routing and locally emulated KV worked; neither Telegram secret was configured and `.dev.vars` did not exist. The old `npm run dev` ran Astro only, which does not run root-level Pages Functions.

After repair, the real endpoint returns **503 with `missing: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"]`** in the empty-configuration test before the owner entered credentials. Safe server diagnostics name missing configuration. All three localized forms retain details, show the helpful error/direct-contact alternative and re-enable submission. This correctly refused unconfigured delivery. After the owner entered local credentials, restarting the runtime was required to load them.

## Owner setup

1. In Telegram's official **@BotFather**, use `/newbot` and follow its instructions. Keep the resulting token private; never paste it in chat, source, PUBLIC_ variables or shared URLs.
2. From **your receiving account**, open your new bot and send `/start`. Use a new bot for this integration; no webhook is required.
3. Enter the genuine token as `TELEGRAM_BOT_TOKEN` privately in the repository-root **`.dev.vars`**, then run **`npm.cmd run telegram:chat-id`** on PowerShell. This owner-only helper reads the file, calls `getUpdates` privately and prints candidate chat IDs/types in your local terminal. It never prints the token, API URL or message bodies. Choose your receiving account's ID and enter it as `TELEGRAM_CHAT_ID`. If no ID appears, send `/start` again and retry. A reused bot with an existing webhook cannot use getUpdates; do not remove another integration's webhook casually.
4. The example starts empty. Enter both values privately in the ignored local file:

   ```dotenv
   TELEGRAM_BOT_TOKEN=""
   TELEGRAM_CHAT_ID=""
   ```

   `.dev.vars.example` is the committed empty template. Do not overwrite your real file with it after entering credentials. `.dev.vars`, environment-specific variants and `.wrangler/` state are ignored. The assistant created the file empty; the owner subsequently entered genuine values locally. Those values remain private and uncommitted.
5. For future production, create a **Workers KV namespace** in Cloudflare's KV area. Open the Pages project **Settings > Bindings > Add > KV namespace**, name the binding exactly **`PROJECT_REQUESTS_KV`**, select your production namespace and save. Under **Settings > Variables and Secrets > Add**, enter `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, select **Encrypt**, and save for **Production**. Rebuild/redeploy when authorized. Local files are never production configuration. Preview must leave delivery secrets unset or use a separate test bot/chat and separate preview namespace. No production namespace ID is invented in this repository.
6. From the repository root run **`npm.cmd run dev`**, then open **http://127.0.0.1:8788/en/contact/** (or `/hy/contact/`, `/ru/contact/`). This command builds the static site and starts its real endpoint and local KV:

   ```sh
   npm run build && wrangler pages dev dist --kv PROJECT_REQUESTS_KV --ip 127.0.0.1 --port 8788 --compatibility-date 2026-10-14
   ```

Wrangler is pinned in devDependencies; run `npm ci` on a new checkout. Local emulation requires no Cloudflare login or production namespace. State persists under ignored `.wrangler/`, not remote production data. Restart after changing credentials; page/content edits need a rebuild/restart. `npm run dev:astro` is the optional fast layout server and `npm run preview` is static preview; neither runs the endpoint. The agent's filesystem sandbox required elevation for Wrangler's normal log/runtime access; the exact startup command was successfully verified outside that sandbox.

Official references: [local Pages runtime](https://developers.cloudflare.com/pages/functions/local-development/), [bindings and secrets](https://developers.cloudflare.com/pages/functions/bindings/), [bot creation](https://core.telegram.org/bots/tutorial), and [Telegram API](https://core.telegram.org/bots/api).

## Separate build configuration

Optional `.env` is for Astro and `config/site.mjs` build configuration; `.env.example` documents those values. Telegram secrets belong in `.dev.vars`. Do not assume Astro's `.env` populates Function `context.env`. Wrangler reports `Using secrets defined in .dev.vars`; when this file exists it does not merge `.env` into runtime bindings. Neither private file is committed.

| Setting | Production | Preview |
| --- | --- | --- |
| Build / output | `npm run build` / `dist` | Same |
| `NODE_VERSION` | `24.16.0` | `24.16.0` |
| `PUBLIC_SITE_URL` | Confirmed HTTPS production origin, not assigned yet | Same production origin |
| `HAYWEB_BUILD_TARGET` | `production` | `preview` |
| `ASTRO_TELEMETRY_DISABLED` | `1` recommended | `1` recommended |
| `GOOGLE_SITE_VERIFICATION` | Optional genuine Google token | Normally unset |
| `TELEGRAM_BOT_TOKEN` | Encrypted genuine bot token | Unset or isolated test bot |
| `TELEGRAM_CHAT_ID` | Encrypted genuine receiving ID | Unset or isolated test chat |
| KV binding `PROJECT_REQUESTS_KV` | Selected production namespace | Separate test namespace if used |

`CF_PAGES` is supplied by Cloudflare. No PUBLIC_ delivery secrets, paid upgrade, purchase, push or deployment was introduced.

## One explicitly labeled real TEST

After entering both credentials privately and restarting `npm run dev`, submit **one** form request with name **TEST ONLY — owner delivery verification** and description **TEST ONLY. Not a customer request. Verify the four-page base package and separate maintenance.** Use your receiving contact details. Select website, languages, blog, catalog, logo, **one additional page**, and maintenance. Check **190,000 → 85,000 AMD** plus **15,000 AMD/month separately**.

Confirm HTTP 200 with `ok: true` and a reference, then confirm the matching message actually appears in your receiving chat. It must contain reference/time, name/business, email/phone, language/contact preference, the four included pages, all services and extra-page quantity, one-time/monthly estimates and the TEST description. A fresh form visit generates a fresh request ID; do not create multiple new requests casually to test retries.

Success appears only after Telegram accepts the notification: “Thank you! Your project request has been submitted. We’ll contact you within 1 hour using your preferred contact method.” API acceptance does not prove a person read it. **Local real TEST verified:** after a restart, the real form returned HTTP 200 / `ok: true`, proving Telegram accepted the labeled notification. Reference: `HW-493F353B-FDD9-4F59-8B1F-20CF22B345DB`; submitted `2026-10-14T19:26:44.495Z`. The success UI appeared with 190,000/85,000 AMD and separate 15,000 AMD/month. Exactly one real notification was accepted; the initial attempt before restart returned unconfigured and did not notify Telegram. The owner still needs to confirm seeing that reference in their receiving chat. Production configuration was not changed and production delivery was not tested; nothing was deployed.

## Errors and privacy

| Response | Meaning / owner action |
| --- | --- |
| 503 `unconfigured` with `missing` | Supply listed secrets or the actual KV binding; names only, never values |
| 503 `storage` | KV unavailable; inspect binding and retry later |
| 502 `delivery` / `bot_token_rejected` | Check bot token privately |
| 502 `delivery` / `chat_not_found` | Check receiving ID and send `/start` |
| 502 `delivery` / `bot_chat_forbidden` | Bot blocked or missing destination permissions |
| 502 `delivery` / `telegram_rate_limited` | Wait before retrying |
| 504 `timeout` / 502 `delivery_uncertain` | Acceptance unconfirmed; message may have arrived. Check chat and wait at least a minute before retrying |
| 409 `pending` | Same request pending; wait without editing details |
| 422 / 429 | Invalid fields / application rate limit |

The Telegram timeout is 12 seconds. Confirmed rejection clears the pending marker; timeout/uncertain transport retains it for 60 seconds to prevent immediate duplicates. Confirmed acceptance stores a fingerprint/result for 24 hours, without full personal data. KV is eventually consistent: this is best-effort deduplication, not exactly-once delivery. A late accepted message may still duplicate after expiry. Plain text has no parse_mode. Logs contain only fixed diagnostic categories, HTTP status and missing configuration names, never tokens, provider URLs or full payloads.

`npm run test:requests` uses mock Telegram/KV for configuration, rejection, abort-signal timeout, success, trusted prices and retry checks. `npm run test:offer` mocks browser responses including timeout/rejection. With `npm run dev` running and credentials empty, `npm run test:runtime` tests the real Function in all languages and refuses to submit if both credentials are present. Automated checks do not send Telegram notifications.

The base website includes **exactly four pages: Landing/Home, Services, About, Contact**. Prices remain 80,000/40,000 AMD; additional pages beyond those four are 10,000/5,000 AMD each. Blog/catalog add-ons are separate and their included functionality is not counted again as extra pages. Free language structure and all other prices remain unchanged; maintenance is 15,000 AMD/month separately, undiscounted.
