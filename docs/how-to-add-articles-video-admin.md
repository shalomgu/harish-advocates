# How to add a video (admin UI)

Midterm flow: the owner opens a small admin page, chooses **which site page** the video belongs to, pastes a GitHub Personal Access Token, uploads an `.mp4` + Hebrew title, and the page commits both the file and metadata to the **`dev`** branch. Existing [`deploy-dev`](../.github/workflows/deploy-dev.yml) then publishes the dev site.

---

### Prerequisites

1. A **GitHub Personal Access Token** that can push to `shalomgu/harish-advocates` on branch **`dev`**.
2. Video must be `.mp4`, ideally under **40MB** (browser + GitHub API soft limit).

#### Creating a fine-grained PAT (recommended)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Resource owner:** your user (`shalomgu`).
3. **Repository access:** **Only select repositories** → `harish-advocates`.
4. **Permissions → Repository permissions:**
   - Find **Contents** in the list (search for `Contents`, not `read`)
   - Set **Contents** to **Read and write**
   - **Metadata:** Read-only (required automatically)
5. Generate, copy the token once (`github_pat_…`), paste into the admin form.

Classic PAT alternative: enable the **`repo`** scope.

If `dev` has **branch protection** that blocks direct pushes, either allow your account to push, or temporarily relax protection for testing.

Optional env overrides at build/dev time:

- `VITE_GITHUB_OWNER` (default `shalomgu`)
- `VITE_GITHUB_REPO` (default `harish-advocates`)
- `VITE_GITHUB_BRANCH` (default `dev`)

---

### Steps

1. Open the admin page:
   - Local: `pnpm dev` → `http://localhost:5173/harish-advocates/admin.html`
   - Dev site: `https://…/admin.html` (same base path as the flipbook)
2. Paste the PAT (stored only in `sessionStorage` for this tab).
3. Choose the target page:
   1. **סרטוני מידע**
   2. **מאמרים ומדריכים**
   3. **רדיו וטלויזיה**
   4. **עיתונות כתובה**
4. Enter a Hebrew **title**.
5. Choose an **MP4**. Prefer an English filename with hyphens (e.g. `family-will.mp4`).
6. Click **שמירה ל־dev**.
7. Wait for success. Check that `deploy-dev` ran and the video appears on the chosen page on the **dev** site.

---

### What gets committed

| Path | Change |
|------|--------|
| `public/assets/videos/<slug>.mp4` | New file |
| `src/content/owner-videos.json` | New item under the matching key (`infoVideos`, `articlesVideos`, `radioTvVideos`, or `pressVideos`) |

- **סרטוני מידע** / **רדיו וטלויזיה:** owner videos are **appended** after the hardcoded list.
- **מאמרים ומדריכים** / **עיתונות כתובה:** owner videos show as a **סרטונים** section above the articles.

Production (`main`) is unchanged until you merge `dev` → `main` as usual.

---

### Safety notes

- Do not share the admin URL publicly; it is not linked from the flipbook.
- Never commit a PAT. Use **נקה טוקן** when finished.
- If the filename already exists on `dev`, rename the file and retry.
- For larger libraries later, move hosting to object storage (R2 / Stream) and keep this JSON as metadata only.

---

### Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Auth / permission error | PAT wrong/expired; repo not selected on fine-grained token; Contents not **Read and write**; or `dev` branch protection blocks push. The UI shows GitHub’s exact message. |
| File already exists | Choose another filename |
| File too large | Compress under 40MB |
| Video missing on site | Wait for deploy-dev; hard-refresh; confirm commit is on `dev` and that the page-wiring code is deployed |
