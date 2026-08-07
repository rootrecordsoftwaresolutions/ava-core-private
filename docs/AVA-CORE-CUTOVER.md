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

- Cloudflare Worker **cron triggers emptied** on RootMC + Root Record (weather/kilauea/account).
- Ava cronRunner owns schedules; watermarks in MariaDB va_cron.
- local-api on :8791 with Worker proxy soft-ack (AVA_PROXY_TO_WORKERS=1).
- Tunnel hostnames: va.rootmc.net, pi-ava.rootmc.net, pi-local.rootmc.net → OptiPlex.
- D1 replicas: local-api/data/root-record.sqlite, 
ootmc.sqlite, 
ootmc-webstat.sqlite, 
ootmc-live.sqlite.
- MariaDB schemas ready: va_cron, 
ootmc_api, 
oot_record.
- Catch-up sequencer ran successfully (incl. RRTT + treasury force).
- Soft-ack undeploy: 
ode scripts/undeploy-api-workers.mjs after 7 days.


## Soft-ack day-7

Prep checklist (no undeploy until ~2026-08-13): [SOFT-ACK-DAY7-CHECKLIST.md](./SOFT-ACK-DAY7-CHECKLIST.md)
