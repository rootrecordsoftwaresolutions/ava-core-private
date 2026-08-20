# Ava progress channel (Melee ask)

**Request (2026-08-05, #development):** Melee asked Ava to create **“Ava’s progress”** and post a daily report of what she learned and got better/quicker at.

## Created

| Field | Value |
|-------|-------|
| Channel | `#ava-progress` |
| Id | `1534974849489965197` |
| Watch | Added to `DEFAULT_WATCH_CHANNELS` in `core/src/config.mjs` |

**Topic:** Daily Ava progress — what she learned and got quicker at (Melee ask). Short honest reports; no dig-theater.

## Recreate / verify

```bash
cd /home/ava-core/ava/core
node scripts/create-ava-progress-channel.mjs
```

Idempotent — exits 0 with existing id if channel already present.

## Manual create (if bot loses Manage Channels)

1. RootMC Discord → **Server Settings → Channels** → Text → `ava-progress`.
2. Topic: line above; staff + Ava bot can view/send.
3. Copy channel id → append to `AVA_WATCH_CHANNELS` in `.env` → `sudo systemctl restart ava-ivy`.

## Daily report (follow-up)

Not cron-wired yet. Until automated, Ava answers when pinged in `#ava-progress`.
