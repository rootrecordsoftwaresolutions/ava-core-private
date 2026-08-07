# Ava SSD home lock (2026-08-06)

**Runtime truth:** `/home/ava-core/ava` on the OptiPlex internal SSD.

- systemd `ava-ivy.service`: `AVA_HANDOFF=/home/ava-core/ava`, `AVA_WORKSPACE=.../workstations/rootmc`
- Cloudflare workers: `/home/ava-core/ava/workstations/cloudflare/`
- Solana site: `/home/ava-core/ava/workstations/rootrecord/solana-rootrecord-site/`
- Project pointers: `workstations/projects/*/ssd-source` (no `/mnt/e` required)
- `Server Handoffs/Ava Ivy` → `/home/ava-core/ava`

E: / Windows Linux-shaped mirror is optional backup for the laptop — not a runtime mount.

Ava does not need the portable archive mounted to operate.
