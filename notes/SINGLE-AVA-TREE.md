# Single Ava tree

Only **one** host may run `rootmc-ava` posting to Discord/Slack as Ava.

## Why

Two supervisors → duplicate replies, raced EcoFlow polls, confusing status UIs.

## Before Ubuntu pit-stop

### Windows (OptiPlex if still booting Windows, or laptop if Ava was moved)

1. Stop Task Scheduler task that starts Ava (see `install-ava-autostart.ps1` / `start-ava-on-boot.ps1`).
2. Kill leftover processes:
   ```powershell
   Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
     Where-Object { $_.CommandLine -match 'rootmc-ava' } |
     ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
   ```
3. Confirm no heartbeat posts after ~2 minutes.

### Sticky power-off

Clear before Linux start so Ava actually boots:

```bash
rm -f "/mnt/e/.1 Work Stations/RootMC/Server Handoffs/Ava Ivy/data/power-off.json"
```

(`start-ava.sh` does this automatically.)

## Linux is the live tree (pit-stop)

- systemd: `ava-ivy` enabled
- Verify author is Ava bot, not Alex / RootMC Official
- Status: `ssh -L 8787:127.0.0.1:8787` → http://127.0.0.1:8787/

## Returning Ava to Windows later

1. `sudo systemctl disable --now ava-ivy`
2. Confirm no Linux `node` under rootmc-ava
3. Then re-enable Windows Task Scheduler / start script
4. Never run both for “redundancy”

## EcoFlow

Polling is Discord-independent (dedicated loop). That does **not** justify two Node trees — still one host owns EcoFlow + D1 bank pushes.
