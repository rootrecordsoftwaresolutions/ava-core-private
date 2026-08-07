# Flight recorder — three brains, one machine memory

**Locked (Alex, 2026-08-03/04):** full record on `ava-core` so **Llama Ava**, **Cursor Ava (Root Server)**, and **Grok Ava (dream)** can all see and operate this machine for Ava's purpose — without the laptop.

## Canonical tree

`/mnt/e/.Ava_Ivy/data/`

| Path | Brain writes | Contents |
|------|--------------|----------|
| `logs/inbound.jsonl` | pipeline | Watched ingest |
| `logs/outbound.jsonl` | all surfaces | Every Ava utterance |
| `logs/actions.jsonl` | all | Jobs / digs / flight events |
| `logs/host-audit.jsonl` | flightRecorder | mounts, df, systemd, ollama ps |
| `training/digs.jsonl` | dig path | Q&A training |
| `training/utterances.jsonl` | all posts | Training utterances |
| `training/local-lessons.jsonl` | Llama | Organizer lessons |
| `training/ollama-calls.jsonl` | Llama | KNOWS/ROUTE + snippets |
| `training/cursor-digs.jsonl` | Cursor | Prompt + result + tool keys |
| `training/dream-calls.jsonl` | Dream/Grok | System/user/reply snippets |
| `training/rcon-pairs.jsonl` | host | RCON cmd + output |
| `flight/ops-snapshot.json` | host | Latest host snapshot |
| `flight/brain-events.jsonl` | all | Thin cross-brain timeline |
| `flight/patches.jsonl` | Cursor/self-fix | Patch notes when recorded |

Secrets stay redacted. Pre-universal history cannot be backfilled.

## Shared pack

`gatherOpsContextPack()` in `src/flightRecorder.mjs` is injected into:

- Llama organizer packs
- Cursor dig prompts
- Dream/Grok prompts

Every brain must **read and write** this tree — no private silos.

## Runtime

- Module: `Web Files/rootmc-ava/src/flightRecorder.mjs`
- Boot + every 15m: `recordHostAudit`
- Telegram Llama free-talk + visibility: `localBrain.mjs` (`AVA_LLAMA_TELEGRAM=1`)

## Operator chat locks (this Cursor session)

1. Full machine flight recorder (this note).
2. See Llama on Telegram — side-channel + ollama-calls.
3. Let her talk freely with Alex on Telegram (not clipped "mm?").
4. Discord stays dream communal; Slack/Telegram/on-device = local → Cursor → dream.
5. OptiPlex = brain; E drive = home; laptop optional.
