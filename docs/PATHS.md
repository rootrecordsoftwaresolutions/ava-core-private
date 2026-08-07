# Ava Ivy — Paths & shortcuts

## Canonical (SSD — current ops mode)

**Ava runs entirely from the OptiPlex internal SSD.** External E: / `/mnt/e` is optional mirror only.

| Role | Path |
|------|------|
| Handoff / brain | `/home/ava-core/ava` |
| Workspace (RootMC) | `/home/ava-core/ava/workstations/rootmc` |
| Cloudflare workers | `/home/ava-core/ava/workstations/cloudflare` |
| Solana site | `/home/ava-core/ava/workstations/rootrecord/solana-rootrecord-site` |
| Project pointers | `/home/ava-core/ava/workstations/projects/*/ssd-source` |
| systemd | `ava-ivy.service` (`AVA_HANDOFF=/home/ava-core/ava`) |

Lock note: [`SSD-HOME-LOCK.md`](./SSD-HOME-LOCK.md)

---
## Legacy notes (pit-stop / E era — historical)

## Pit-stop (current ops mode)

While Ubuntu comes online and **D is flashed**, treat **E** / `/mnt/e` as the only RootMC tree:

- Runbook: [`notes/PITSTOP-E-UBUNTU-WHILE-D-FLASH.md`](../notes/PITSTOP-E-UBUNTU-WHILE-D-FLASH.md)
- Disk serials: [`notes/DISK-IDENTITY-LOCK.md`](../notes/DISK-IDENTITY-LOCK.md)
- One Ava host: [`notes/SINGLE-AVA-TREE.md`](../notes/SINGLE-AVA-TREE.md)
- Env (Linux): `scripts/load-rootmc-env.sh` · smoke: `scripts/pitstop-smoke.sh`
- systemd off E: `Web Files/rootmc-ava/scripts/ava-ivy.service.mnt-e`

## This handoff

Windows (**primary / Cursor source — E handoff**): `E:\.1 Work Stations\RootMC\Server Handoffs\Ava Ivy\`  
Windows (D twin — offline during flash): `D:\.1 Work Stations\RootMC\Server Handoffs\Ava Ivy\`  
Linux mount: `/mnt/e/.1 Work Stations/RootMC/Server Handoffs/Ava Ivy/`  
Optional bind: `/srv/rootmc/Server Handoffs/Ava Ivy/`  
Override anytime: `AVA_HANDOFF`.

**Storage lock:** Laptop Cursor → Remote-SSH. OptiPlex mounts **E:** at `/mnt/e`. Caches/builders → **Ubuntu SSD**.  
Handoff note: `notes/workspace-context/SESSION-HANDOFF-2026-08-02-E.md`  
See `notes/LINUX-E-SSD-LAYOUT.md` + `notes/workspace-context/MASTER-CONTEXT.md`.

## Runtime (code)

Windows (primary): `E:\.1 Work Stations\RootMC\Web Files\rootmc-ava\`  
Windows (D twin): `D:\.1 Work Stations\RootMC\Web Files\rootmc-ava\`  
Linux: `/mnt/e/.1 Work Stations/RootMC/Web Files/rootmc-ava/` (or `/srv/rootmc/…` bind)

- Shortcut: `runtime\rootmc-ava-CODE.lnk`
- Start poller: `runtime\start-ava.lnk`
- Status window: `runtime\open-ava-status-window.lnk` → http://127.0.0.1:8787/
- Also: `Server Handoffs\Ava Ivy - runtime (rootmc-ava).lnk`
- **SSH:** `scripts/start-ava.sh` · systemd `scripts/ava-ivy.service` · see `Web Files/rootmc-ava/docs/SSH-LINUX.md`

Legacy folder `Web Files/rootmc-sexi/` is a stub if still present — use `rootmc-ava`.

## Env

RootMC `.env`:

- `AVA_DISCORD_BOT_TOKEN` / `AVA_DISCORD_APPLICATION_ID` (legacy `SEXI_*` still accepted)
- `CURSOR_API_KEY` (Root Server)
- `AVA_HANDOFF` — optional; defaults to `Server Handoffs/Ava Ivy` under the workspace
- Headless: `AVA_HEADLESS=1` `AVA_NO_STATUS_WINDOW=1` `AVA_RICH_PRESENCE=0`

## Related RootMC surfaces

- Workspace root: `E:\.1 Work Stations\RootMC\` (D twin still present; Linux: `/mnt/e/.1 Work Stations/RootMC/` or `/srv/rootmc/`)
- Wiki (public): https://rootmc.net/wiki/
- Governance API: https://api.rootmc.net/api/governance/
- Plugin handoffs: `Server Handoffs\1. RootMC - Claims\`, `2. RootMC - Towny\`
- OptiPlex Ubuntu plan: `docs/ROOTATMUS_PRIME-Ubuntu-Server-SSH-Plan.md`
