# Root Record main site — Ava link polish (2026-08-06)

Source edited on Windows: `D:\Pre August\solana-rootrecord-site`  
Pointer on ava-core: `workstations/projects/rootrecord-site/SOURCE.txt` → `E:\old\solana-rootrecord-site` (E mount not attached on OptiPlex today).

## Changes (already in Windows tree)

- `components/Footer.tsx` — Program links: Ava wiki, Ava status, The Root
- `app/page.tsx` — principles blurb + link strip to wiki / status / The Root

Match reference: `D:\Pre August\solana-rootrecord-site` (same edits staged on laptop).

## Deploy (run on machine with the Next.js source)

```powershell
cd "D:\Pre August\solana-rootrecord-site"
npm ci
npm run build
```

Then ship production (pick the pipeline that normally owns `rootrecord.info`):

**If Vercel-linked (common for this site):**

```powershell
npx vercel --prod
```

**If Cloudflare Pages (confirm project name in dashboard first):**

```powershell
npx wrangler pages deploy .vercel/output/static --project-name=rootrecord-site
# or: out/ / .next/ per your next.config export — verify build output dir
```

**Verify after deploy:** homepage footer + hero strip link to:

- https://rootrecord.info/ava/
- https://rootrecord.info/ava/status
- https://merged.rootrecord.info/

## Already live (no main-site deploy needed)

- https://rootrecord.info/ava/
- https://rootrecord.info/ava/status
- https://merged.rootrecord.info/

## Chat pointers (done)

Posted as Ava to Discord `#updates` and Slack `#development-feed` with wiki/status/tunnel URLs.

## OptiPlex staging (2026-08-06 continuation)

E: pointer `/mnt/e/old/solana-rootrecord-site` is **unmounted**. Staged copies on SSD:

- `workstations/projects/rootrecord-site/Footer.tsx.staged`
- `workstations/projects/rootrecord-site/page.tsx.staged`

When E returns (or deploy from `D:\Pre August\solana-rootrecord-site` on Windows), apply these into the Next tree and redeploy the marketing site.
