# How to add a video (admin UI)

Midterm flow:

1. Upload an `.mp4` + Hebrew title to **`dev`** (test on the [dev site](https://shalomgu.github.io/harish-advocates-dev/)).
2. When ready for production, click **פרסום ל־main (יצירת PR)** — the admin copies only owner video files + `owner-videos.json` onto a new branch and opens a **Pull Request** into `main` (required because `main` is protected).
3. Review and merge the PR on GitHub → production deploy runs.

---

### Prerequisites

1. A **GitHub Personal Access Token** for `shalomgu/harish-advocates`.
2. Video must be `.mp4`, ideally under **40MB**.

#### Creating a fine-grained PAT (recommended)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Resource owner:** your user (`shalomgu`).
3. **Repository access:** **Only select repositories** → `harish-advocates`.
4. **Permissions → Repository permissions:**
   - **Contents:** Read and write (search for `Contents`, not `read`)
   - **Pull requests:** Read and write (needed to open the PR to `main`)
   - **Metadata:** Read-only (automatic)
5. Generate, copy once (`github_pat_…`), paste into the admin form.

Classic PAT alternative: **`repo`** scope.

Optional env overrides:

- `VITE_GITHUB_OWNER` (default `shalomgu`)
- `VITE_GITHUB_REPO` (default `harish-advocates`)
- `VITE_GITHUB_BRANCH` (default `dev`)
- `VITE_GITHUB_MAIN_BRANCH` (default `main`)

---

### Steps — upload to dev

1. Open admin:
   - Local: `pnpm dev` → `http://localhost:5173/harish-advocates/admin.html`
   - Dev: [https://shalomgu.github.io/harish-advocates-dev/admin.html](https://shalomgu.github.io/harish-advocates-dev/admin.html)
2. Paste the PAT.
3. Choose the target page (סרטוני מידע / מאמרים ומדריכים / רדיו וטלויזיה / עיתונות כתובה).
4. Enter title + MP4 → **שמירה ל־dev**.
5. Confirm on the [dev flipbook](https://shalomgu.github.io/harish-advocates-dev/).

### Steps — publish to production

1. On the same admin page, click **פרסום ל־main (יצירת PR)**.
2. Confirm the dialog.
3. Open the PR link → review → **Merge**.
4. Wait for the production Pages deploy.

This promotes **only** owner videos (`owner-videos.json` + referenced MP4s). It does **not** merge the entire `dev` branch.

---

### What gets committed (upload)

| Path | Change |
|------|--------|
| `public/assets/videos/<slug>.mp4` | New file on `dev` |
| `src/content/owner-videos.json` | New item under the matching key |

### What the promote PR contains

| Path | Change |
|------|--------|
| `src/content/owner-videos.json` | Full list from `dev` |
| `public/assets/videos/<…>.mp4` | Every file referenced in that JSON |

---

### Safety notes

- Do not share the admin URL publicly.
- Never commit a PAT. Use **נקה טוקן** when finished.
- Prefer English filenames with hyphens for the MP4.

---

### Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Auth error on upload | Contents not **Read and write**, or repo not selected on the token |
| Auth error on promote / create PR | Missing **Pull requests: Read and write** |
| 422 on PR | Empty PR (nothing new vs `main`), or branch protection rules |
| Video missing on prod after merge | Wait for production deploy; hard-refresh |
