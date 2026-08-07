# Pit-stop — E on Ubuntu while D is flashed

**Mode:** temporary host for Ava + Cursor Remote-SSH.  
**Windows laptop** controls Ubuntu. **E:** SATA parks on the OptiPlex as mass storage. **D:** twin may be offline / wiped / re-imaged during this window.

Canonical procedure. Do not invent a third tree.

---

## Topology (locked)

| Role | Where |
|------|--------|
| Control plane | Laptop Cursor → Remote-SSH → Ubuntu |
| Source of truth | E mount → `/mnt/e/.1 Work Stations/RootMC/` |
| Caches / builders | Ubuntu SSD home (`~/.npm`, `~/.gradle`, Ollama) |
| Optional thin runtime | `/srv/rootmc` bind **or** `ava-ivy.service.mnt-e` (run straight off `/mnt/e`) |
| Shockbyte jars | Still FileZilla from laptop using E handoff folders (or copy jars over SCP) |

**Disk identity:** wipe/flash by **serial**, never by drive letter alone — see `DISK-IDENTITY-LOCK.md`.

---

## Before unplugging E / flashing D

1. Confirm `E:\.1 Work Stations\RootMC\.env` exists (do not paste secrets in chat).
2. Confirm `E:\windows backup\logs\e-workstations-FINISHED.txt`.
3. Prefer finishing `d-drive-FINISHED.txt` **or** accept you only trust E for RootMC during the pit-stop.
4. Stop **Windows Ava** (Task Scheduler + any `node src/index.mjs`) — see `SINGLE-AVA-TREE.md`.
5. Stage any urgent plugin jars into:
   - `Server Handoffs/1. RootMC - Claims/plugins/`
   - `Server Handoffs/2. RootMC - Towny/plugins/`
   - `Server Handoffs/Upload Staging/`
6. Leave Live Backups alone unless you explicitly need them on E (they are large).

Do **not** create `E:\MIGRATION-READY.txt` until the operator checklist in `workspace-context/MIGRATION-CHECKLIST.md` is honestly green.

---

## First Ubuntu boot (pit-stop)

```bash
# 1) Mount E (adjust device by SERIAL — see DISK-IDENTITY-LOCK.md)
sudo mkdir -p /mnt/e
sudo mount /dev/disk/by-id/<E-SERIAL>-partN /mnt/e   # or fstab UUID

ROOT="/mnt/e/.1 Work Stations/RootMC"
test -f "$ROOT/.env" || { echo "missing .env on E"; exit 1; }

# 2) Toolchains on SSD (source stays on E)
sudo bash "$ROOT/scripts/ubuntu-provision-ecosystem.sh"

# 3) Env helper (never prints secrets)
# shellcheck source=/dev/null
source "$ROOT/scripts/load-rootmc-env.sh"

# 4) Optional: bind for /srv unit, OR use mnt-e unit
# sudo mkdir -p /srv/rootmc
# sudo mount --bind "$ROOT" /srv/rootmc
# bash "$ROOT/scripts/sync-env-to-device.sh"   # if using /srv copy path

# 5) Smoke
chmod +x "$ROOT/scripts/pitstop-smoke.sh"
"$ROOT/scripts/pitstop-smoke.sh"

# 6) Ava — pick ONE:
# A) straight off E
sudo cp "$ROOT/Web Files/rootmc-ava/scripts/ava-ivy.service.mnt-e" /etc/systemd/system/ava-ivy.service
# B) /srv bind (stock unit)
# sudo cp "$ROOT/Web Files/rootmc-ava/scripts/ava-ivy.service" /etc/systemd/system/ava-ivy.service

sudo systemctl daemon-reload
sudo systemctl enable --now ava-ivy
sudo journalctl -u ava-ivy -f
```

From laptop:

```bash
ssh -L 8787:127.0.0.1:8787 user@rootatmus-prime
# http://127.0.0.1:8787/
```

Cursor: Remote-SSH → open folder  
`/mnt/e/.1 Work Stations/RootMC`

---

## While D is being flashed

| Do | Don't |
|----|--------|
| Edit / build / Ava on **E** (`/mnt/e`) | Assume `D:\` paths still exist |
| FileZilla Claims/Towny from E handoffs | Stage jars into legacy Desktop / Gen3 folders |
| Prefer `load-rootmc-env.sh` + layout-relative scripts | Hardcode `D:\.1 Work Stations\…` in new scripts |
| Keep one Ava tree posting | Leave Windows Task Scheduler Ava running |

Plugin Gradle on Ubuntu: copy  
`Plugin Building/Minecraft/local.properties.linux` → `local.properties`  
(then adjust `org.gradle.java.home` if Temurin path differs).

---

## After D flash / Windows side returns

1. Re-sync policy is **E is still canonical** until you explicitly re-twin.
2. Re-enable Windows only if Ubuntu Ava is stopped (`SINGLE-AVA-TREE.md`).
3. Recreate D twin from E only when you want a Windows-local mirror again (`sync-e-workstations` direction may invert — operator call).
4. Update `DISK-IDENTITY-LOCK.md` if the flashed disk’s role/serial changed.

---

## Related

- `DISK-IDENTITY-LOCK.md` — wipe by serial
- `SINGLE-AVA-TREE.md` — one poster
- `UBUNTU-VERSION-LOCK.md` — installer vs docs
- `workspace-context/MIGRATION-CHECKLIST.md`
- `Web Files/rootmc-ava/docs/SSH-LINUX.md`
- `scripts/load-rootmc-env.sh` · `scripts/pitstop-smoke.sh`
