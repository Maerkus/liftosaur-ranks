# Self-hosted Liftosaur

This fork runs the whole app against your own backend — no AWS account, no liftosaur.com
services, no subscription. Everything premium is unlocked, and all costs are $0 at personal
scale (the stack is Docker Compose on any machine you own, or a free-tier VM).

## What changed vs upstream

- **Premium unlocked**: `Subscriptions_hasSubscription` returns true client-side, and the
  server always injects a claimed free-access key (`FreeUserDao` with `SELFHOST=true`).
- **Telemetry removed**: Rollbar and Google Analytics are stubbed/disabled on web, SSR pages,
  and the server. No external tracking requests.
- **AWS swapped out** behind the DI seam (`lambda/utils/di.ts`, active when `SELFHOST=true`):
  - DynamoDB → DynamoDB Local (`DYNAMODB_ENDPOINT`)
  - Secrets Manager → env vars (`lambda/utils/secretsEnv.ts`)
  - S3 → local filesystem under `LFT_DATA_DIR` (`lambda/utils/s3Fs.ts`)
  - SES / Lambda-invoke / CloudWatch → no-ops (`lambda/utils/awsNoop.ts`)
- **Session cookie** is host-only (no more hardcoded `.liftosaur.com` domain); CORS accepts
  extra origins via `LFT_ALLOWED_HOSTS`.
- **Hosts are env-driven at build time**: `LIFTOSAUR_HOST` / `LIFTOSAUR_API_HOST` /
  `LIFTOSAUR_GOOGLE_CLIENT_ID` override the DefinePlugin globals.
- Payments, AI generation, MCP, admin dashboards, affiliates stay in the code but are inert
  without their secrets (AI can be re-enabled with `LFT_ANTHROPIC_KEY`/`LFT_OPENAI_KEY`).

New files: `server.ts` (plain-HTTP production server), `scripts/create-selfhost-tables.ts`,
`docker-compose.selfhost.yml`, `Caddyfile.selfhost`, `Dockerfile.selfhost`,
`.env.selfhost.example`.

## Setup

### 1. Google OAuth client (for login)

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create an
   OAuth client ID, type **Web application** (a project is free; no billing needed).
2. Authorized JavaScript origins: `http://localhost:8080` (and later your public domain).
3. Authorized redirect URIs: `http://localhost:8080/googleauthcallback.html` (and later
   `https://<your-domain>/googleauthcallback.html`).
4. Note the client ID — it goes into the frontend build below.

### 2. Configure

```bash
cp .env.selfhost.example .env.selfhost
# fill in LFT_COOKIE_SECRET, LFT_API_KEY, LFT_CRYPTO_KEY (openssl rand -hex 32 each),
# HOST and LFT_ALLOWED_HOSTS
```

### 3. Build the frontend

```bash
npm ci
LIFTOSAUR_HOST=http://localhost:8080 \
LIFTOSAUR_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com \
npm run build
```

This produces `dist/` (app shell, JS/CSS, program catalog JSON) which Caddy serves.
Rebuild with your public domain as `LIFTOSAUR_HOST` when you deploy (step 6).

### 4. Run

```bash
docker compose -f docker-compose.selfhost.yml up -d
```

The API container creates all DynamoDB tables on startup (idempotent) and serves on
port 3000 internally; Caddy exposes everything on **http://localhost:8080**. Data persists
in `./data/` (DynamoDB files + object storage).

Without Docker: `DYNAMODB_ENDPOINT=http://localhost:8000 npm run selfhost:tables`, then
`npm run start:selfhost` with the env vars from `.env.selfhost` plus `SELFHOST=true
IS_DEV=false DYNAMODB_ENDPOINT=... LFT_DATA_DIR=./data/s3`, and any static file server
for `dist/` that proxies misses to port 3000.

### 5. Verify locally

- `http://localhost:8080/app` loads; pick a program, log a workout — works offline too.
- Sign in with Google → workout syncs; the response includes `key: "key-selfhost"`.
- Graphs, plate calculator, muscle maps etc. are unlocked without any subscription.

### 6. Phone access (Android PWA)

1. Install [Tailscale](https://tailscale.com) (free personal plan) on the server and phone.
2. `tailscale serve --bg http://localhost:8080` gives you a stable
   `https://<machine>.<tailnet>.ts.net` URL with valid certificates.
3. Rebuild the frontend with `LIFTOSAUR_HOST=https://<machine>.<tailnet>.ts.net`, set the
   same value as `HOST` in `.env.selfhost`, add the host to `LFT_ALLOWED_HOSTS`, and add the
   origin + redirect URI to your Google OAuth client. Restart the stack.
4. On the phone open the URL in Chrome → menu → **Add to Home screen**. The PWA works fully
   offline and syncs when the server is reachable.

Alternative: Cloudflare Tunnel works too, but requires owning a domain (~$10/yr);
Tailscale is free.

## Important invariants

- **Keep `IS_DEV=false` forever** — it selects the prod table names (`lftUsers` etc.).
  Changing it splits your data across two table sets. It would also enable the
  `forceuseremail` login bypass, which must never be exposed publicly.
- `LFT_COOKIE_SECRET` changes log everyone out; `data/` holds all your data — back it up.
- Do not modify the sync protocol files (`src/utils/sync.ts`, `src/models/versionTracker.ts`,
  `lambda/dao/userDao.ts` sync methods) — cross-device sync depends on them.

## Known degradations (by design)

- User image uploads (presigned S3 URLs) return empty URLs — feature is inert.
- Emails (login notifications) are logged, not sent.
- Apple sign-in, in-app purchases, OTA updates, web push: not configured; irrelevant for
  the PWA use case.
- DynamoDB Local ignores TTLs, so analytics events accumulate — harmless at personal scale.
