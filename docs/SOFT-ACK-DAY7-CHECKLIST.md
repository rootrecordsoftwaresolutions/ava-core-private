# Soft-ack day-7 checklist (do NOT run early)

**Clock:** soft-ack started `2026-08-06T06:39:06Z` (`core/data/cron/soft-ack-started.json`).  
**Earliest undeploy:** ~**2026-08-13** (`undeployAfterDays: 7`).  
**Today (2026-08-06): prep only — do not undeploy API Workers.**

## Already true (soft-ack in progress)

- [x] Local API `:8791` up (`ava-local-api`)
- [x] Ava cronRunner owns schedules; CF Worker cron triggers emptied
- [x] Catch-up sequencer ran (RRTT + treasury)
- [x] Tunnel hostnames live via **cloudflared systemd** (token-based, `enabled`, `Restart=always`)
  - `ava.rootmc.net` → `:8787`
  - `api-ava.rootmc.net` / `api-local.rootmc.net` → `:8791`
- [x] `AVA_PROXY_TO_WORKERS=1` during soft-ack (Workers remain cold backup)

## Day-7 cutover (run only after ~Aug 13 + operator OK)

1. **Health gate (same day):** `ava-ivy`, `ava-local-api`, `cloudflared` active; `https://ava.rootmc.net/api/status` + `/api/solar` 200; wiki/status 200; no tunnel 530s for 24h+.
2. **DNS:** confirm production API hostnames (`api.rootmc.net`, `api.rootrecord.info`, any Stripe/webhook targets) resolve through the OptiPlex tunnel, not Worker-only origins.
3. **Stripe webhooks:** retarget endpoint URLs to tunnel-backed API host; send test event; confirm ledger/finance paths.
4. **Discord OAuth:** retarget redirect URIs to tunnel/Pages hosts as needed; smoke login.
5. **Kick routes:** with Worker crons still empty, confirm Ava kick/admin routes still work if anything still hits Worker HTTP.
6. **Undeploy API Workers (keep Pages):** from Ava handoff  
   `cd /home/ava-core/ava/core && node scripts/undeploy-api-workers.mjs`  
   (review script flags/dry-run first; do **not** undeploy Pages).
7. **Flip proxy:** set `AVA_PROXY_TO_WORKERS=0` (or remove) on `ava-local-api` after Workers are gone; restart unit; confirm local SQLite/MariaDB paths still serve.
8. **Mark complete:** append day-7 completion note to `docs/AVA-CORE-CUTOVER.md`; keep `soft-ack-started.json` for audit.

## Explicit non-goals until day 7

- Do not run `undeploy-api-workers.mjs`
- Do not wipe CF Pages sites
- Do not remove tunnel hostnames

## Pointers

- Cutover overview: [`AVA-CORE-CUTOVER.md`](./AVA-CORE-CUTOVER.md)
- Undeploy script: `core/scripts/undeploy-api-workers.mjs`
- Soft-ack marker: `core/data/cron/soft-ack-started.json`
