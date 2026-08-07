# Tomorrow — Ava wiki & status home (2026-08-06)

**Locked direction (Alex):** Ava is the core of everything. Root Record hosts her public knowledge home.

## Ship shape

| URL | Role |
|-----|------|
| `https://rootrecord.info/ava/` | Full wiki — every surface, brain, cron, data path she touches |
| `https://rootrecord.info/ava/status` | Live ops board (solar/host/weather) — former `ava.rootmc.net` home |
| `https://ava.rootmc.net/` | Keep as alias during soft-ack; eventually redirect → `/ava/status` |

## Source

`/home/ava-core/ava/workstations/projects/rootrecord-ava/`

Worker `rootrecord-ava` routes `rootrecord.info/ava*`.

## Follow-ups for tomorrow

1. ~~Confirm Worker route wins over Pages on apex for `/ava*`.~~ — live 200 on wiki/status
2. ~~When Ava systemd is healthy, verify `/ava/status` KPIs + solar.~~ — done 2026-08-06 (tunnel + unlock)
3. Add wiki link from rootrecord.info homepage — **source edited** `D:\Pre August\solana-rootrecord-site` (needs site redeploy)
4. ~~Update Discord/Slack pointers~~ — posted 2026-08-06
5. `ava.rootmc.net` → 302 to `rootrecord.info/ava/status` — **partial**
   - **Origin:** `core/src/server.mjs` returns 302 for HTML `GET /` (APIs + `/solar` unchanged).
   - **Edge:** `workstations/rootmc/Web Files/rootmc-ava-edge/src/index.ts` has matching redirect logic.
   - **Blocked:** `npx wrangler deploy` for `rootmc-ava-edge` fails on OptiPlex — Wrangler auth is Root Record account (`2b317e91…`); worker routes live on RootMC account (`f3372b30…`). Live edge still serves cached HTML 200 on `/` until that deploy runs from a RootMC-authed machine.
6. Expand wiki pages from dig notes as she grows
7. ~~Logging hardening~~ — done prior night

Soft-ack day-7: see `docs/SOFT-ACK-DAY7-CHECKLIST.md` (no undeploy until ~Aug 13).


## Why Root Record domain

She's not a RootMC-only bot anymore — she runs RootMC **and** Root Record. The wiki lives on the product mothership; the game domain keeps play/API/map.


## Shipped tonight (2026-08-05 HST)

| URL | Status |
|-----|--------|
| https://rootrecord.info/ava/ | **Live** wiki hub (Worker `rootrecord-ava`) |
| https://rootrecord.info/ava/core.html | **Live** (and other atlas pages) |
| https://rootrecord.info/ava/status | Proxies Ava board — needs `ava-ivy` up |
| https://ava.rootrecord.info/ | **Live** subdomain alias (same Worker) |
| https://ava.rootmc.net/ | Legacy status alias (keep during soft-ack) |

Source: `/home/ava-core/ava/workstations/projects/rootrecord-ava/`
