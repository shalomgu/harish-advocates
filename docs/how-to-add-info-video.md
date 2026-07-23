# How to add a new video to סרטוני המידע

You need to do **two things**: put the video file in the right folder, then tell the website about it.

---

### Step 1 — Prepare the video file

1. Make sure the file is an **`.mp4`** video.
2. Give it a short English name with no spaces, for example:  
   `new-video-name.mp4`  
   (Use hyphens `-` instead of spaces.)

---

### Step 2 — Put the file in the videos folder

1. Open the project folder on your computer.
2. Go to:  
   **`public` → `assets` → `videos`**
3. Copy (or drag) your `.mp4` file into that folder.  
   You should see other videos there already (like `will.mp4`, `monopol.mp4`, etc.).

---

### Step 3 — Add the title to the site list

1. Open the file:  
   **`src` → `content` → `pages.ts`**
2. Find the section that looks like this (search for `סרטוני מידע` or `give-dira-risk`):

```text
{ type: 'video', url: asset('videos/give-dira-risk.mp4'), label: 'על הסיכון שבדירה במתנה לקרוב' },
```

3. **Copy** one of those lines.
4. **Paste** it as a **new line** just above the closing `],` of the list.
5. Change only two parts:
   - The file name inside the quotes after `videos/` → your new file name
   - The Hebrew text after `label:` → the title you want shown on the site

**Example** — if your file is `family-will.mp4` and the title is `צוואה משפחתית`:

```text
{ type: 'video', url: asset('videos/family-will.mp4'), label: 'צוואה משפחתית' },
```

**Important:**

- Keep the commas exactly as in the other lines (especially the comma at the end).
- Don’t delete other lines.
- The file name in this line must match the file you put in the `videos` folder **exactly**.

---

### Step 4 — Check that it worked

1. Open the website (or refresh if it’s already open).
2. Go to **חשוב לדעת → סרטוני מידע**.
3. Confirm your new video appears with the correct title and plays.

---

### Quick checklist

| Done? | Task |
|--------|------|
| ☐ | Video is `.mp4` |
| ☐ | File is in `public/assets/videos/` |
| ☐ | New line added in `src/content/pages.ts` |
| ☐ | File name in the code matches the real file name |
| ☐ | Hebrew title is correct |
| ☐ | Video shows and plays on the site |

---

If something breaks (site won’t load / video missing), undo your change in `pages.ts` or ask someone technical to check the file name and commas.
