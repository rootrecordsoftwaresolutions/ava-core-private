# Ava as core — Cloudflare Workers/D1 cutover

Ava on OptiPlex owns scheduling and the local API. Cloudflare keeps Pages/DNS/tunnels for websites and linking into Ava.

## Components

- `core/src/cronRunner.mjs` — schedules (replaces Worker cron triggers)
- `core/src/cronJobs.mjs` / `cronWatermarks.mjs` — job catalog + MariaDB `ava_cron` watermarks
- `local-api/` — `:8791` health, cron bridges, Worker proxy fallback, SQLite D1 replicas
- `scripts/ava-core-catchup.mjs` — offline catch-up (RRTT/treasury + RootMC/RR suites)
- `scripts/d1-export-to-local.mjs` — D1 → `local-api/data/*.sqlite`
- `scripts/disable-cf-crons.mjs` — empty all Worker cron triggers

## MariaDB

- `ava_cron` — watermarks / run log
- `rootmc_api` / `root_record` — target schemas for long-term MySQL store (SQLite replicas used operationally for D1 dialect)

## Soft-ack

1. Local API up on `:8791`
2. Catch-up script clean
3. CF crons emptied
4. Tunnel hostnames `api.rootmc.net` / `api.rootrecord.info` → `:8791`
5. After ~7 days, undeploy API Workers (keep Pages)

## Env

- `AVA_CRON_RUNNER=1` (default)
- `AVA_LOCAL_API_BASE=http://127.0.0.1:8791`
- `AVA_PROXY_TO_WORKERS=1` during soft-ack


## Status (live)

- Cloudflare Worker cron triggers for Root Record **restored** (2026-08-07):
  - `rootrecord-api-kilauea` → `*/10 * * * *`
  - `rootrecord-api-weather` → `*/5 * * * *`
  - `rootrecord-api-account` → `* * * * *`, `45 8 * * *`
- Ava `local-api` on `:8791` bridges Ava cronRunner → worker health / internal routes.
- **Blocker:** xAI / Grok API key is **disabled** (`permission-denied` on `api.x.ai`). Kīlauea AI reports cannot generate until the key is re-enabled or rotated in [console.x.ai](https://console.x.ai) and synced to Worker secret `GROK_API_BEARER_TOKEN` (+ `.env`).
- Last successful public AI report before gap: **2026-08-01**.

## Soft-ack day-7

Prep checklist (no undeploy until ~2026-08-13): [SOFT-ACK-DAY7-CHECKLIST.md](./SOFT-ACK-DAY7-CHECKLIST.md)
