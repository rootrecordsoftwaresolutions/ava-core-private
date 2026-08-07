# HTTP 502 cluster — gold / dividends / sync / vote mirror (2026-08-03→04)

## What happened

Slack `#server-logs` via `incoming-webhook` (relay only) showed clustered warnings on Towny/Claims:

- Discord gold transfer fetch failed — `HTTP 502: error code: 502`
- Activity dividend apply failed — same
- Cloud sync failed — same
- Claims vote mirror failed (Alexrs94, Melee__) — same

Players still got **listing vote rewards** in-game; **Claims cloud credit mirror** failed.

Timestamps (UTC): ~2026-08-03 23:52–23:54 (Alex) and ~2026-08-04 00:59–01:00 (Melee), MC-day rollover window.

## Root cause

Shockbyte plugins prefer **`https://api-local.rootmc.net`** (OptiPlex Cloudflare tunnel) over production Worker.

When the tunnel origin is down / Gateway 502s, CF returns body literally `error code: 502`.

`RootMcApiBases.looksLikeEdgeDownMessage` only treated **530 / 1033 / timeout / refused** as fallback triggers — **not 502** — so clients never retried **`https://api.rootmc.net`**.

Same class of bug as solar gold mult fix (`SOLAR-GOLD-MULT-FIX-2026-08-03.md`), which already went production-first in Root-Economy 1.8.1.

## Fix (code)

`rootrecord-common` `RootMcApiBases`:

- Treat `HTTP 502` / `error code: 502` / `upstream unavailable` as edge-down
- Added `looksLikeEdgeDownStatus(status, body)` helper

Files:

- `Plugin Building/Minecraft/plugins/rootrecord-common/.../RootMcApiBases.java`
- `github-plugin-repos/staging/rootrecord-common/.../RootMcApiBases.java`

`CloudApiClient` / `HelpCloudClient` already call `looksLikeEdgeDownMessage` on the exception text (`HTTP 502: error code: 502`) — once common is rebuilt into RootMC + Root-Play jars, fallback fires.

## Ship checklist (human)

1. Rebuild **rootrecord-common** then dependents (**RootMC**, **Root-Play**, any other cloud clients)
2. Stage jars → Claims + Towny handoffs
3. FileZilla + Shockbyte restart when quiet
4. Optional: keep OptiPlex `api-local` tunnel healthy for free-tier relief — fallback is the safety net
5. Confirm next vote / MC-day: no vote-mirror 502 spam; gold transfer / dividend / sync OK

## Not the problem

- Slack `incoming-webhook` (just the log relay)
- Towny flatfile backups / tax settlements (healthy noise)
- Plugin enable banners / NBTAPI version warnings (unrelated)

## Related

- Urgent still open: D1 listing-vote **ingest** (`ops-listing-vote-ingest`) — separate from Claims vote **mirror**
- Solar prefer-prod: already in Root-Economy 1.8.1 staged
