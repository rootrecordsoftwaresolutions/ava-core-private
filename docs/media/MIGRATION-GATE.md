# Migration gate — do not wipe Windows yet

**Hard rule:** Do **not** wipe or reimage the Windows box until:

```
E:\MIGRATION-READY.txt
```

exists on the portable archive drive.

## Why

- Full E: robocopy mirror landed on `D:\08052026` (2026-08-05)
- E: remains the verify/source-of-truth until the ready marker is written after spot-checks
- Site source also at `D:\Pre August\solana-rootrecord-site` (and under the D archive)

## When ready

1. Spot-check critical trees on `D:\08052026` vs E:
2. Write `E:\MIGRATION-READY.txt` with date + who verified
3. Only then consider Windows wipe / OptiPlex-only ops

Logged: 2026-08-06 day run-through (P4).
