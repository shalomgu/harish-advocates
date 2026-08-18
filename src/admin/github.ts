import type { OwnerVideoTarget, OwnerVideosFile } from '../content/pages'
import { emptyOwnerVideosFile, parseOwnerVideosFile } from '../content/ownerVideos'
import { fileToBase64, githubConfig } from './utils'

const VIDEO_DIR = 'public/assets/videos'
const JSON_PATH = 'src/content/owner-videos.json'
const LEGACY_JSON_PATH = 'src/content/articles-videos.json'

type GhJson = Record<string, unknown>

function authHeaders(pat: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${pat.trim()}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function readGhError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string }
    if (body.message) return body.message
  } catch {
    /* ignore */
  }
  return res.statusText || `HTTP ${res.status}`
}

function authError(detail: string, step: string): Error {
  return new Error(
    `אימות/הרשאה נכשלו (${step}): ${detail}. בדקו: PAT בתוקף, גישה ל־repo, Contents Read and write, ו־Pull requests Read and write (לפרסום ל־main).`,
  )
}

async function gh<T = GhJson>(
  pat: string,
  path: string,
  init: RequestInit = {},
  step = path,
): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      ...authHeaders(pat),
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const detail = await readGhError(res)
    if (res.status === 401 || res.status === 403) {
      throw authError(detail, step)
    }
    if (res.status === 404) {
      throw new Error(`לא נמצא ב־GitHub (${step}): ${path} — ${detail}`)
    }
    if (res.status === 409) {
      throw new Error('הענף השתנה במקביל — נסו שוב.')
    }
    if (res.status === 422) {
      throw new Error(
        `GitHub דחה את העדכון (${step}): ${detail}. אם הענף מוגן (branch protection), ייתכן שנדרשת הרשאת bypass או מיזוג דרך PR.`,
      )
    }
    throw new Error(`שגיאת GitHub (${res.status}, ${step}): ${detail}`)
  }
  if (res.status === 204) return {} as T
  return (await res.json()) as T
}

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function fetchJsonFile(
  pat: string,
  owner: string,
  repo: string,
  branch: string,
  path: string,
): Promise<{ ok: true; content: string } | { ok: false; status: number; detail: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: authHeaders(pat) },
  )
  if (res.ok) {
    const meta = (await res.json()) as { content: string }
    return { ok: true, content: meta.content }
  }
  return { ok: false, status: res.status, detail: await readGhError(res) }
}

export type CommitVideoResult = {
  commitSha: string
  filename: string
  target: OwnerVideoTarget
  htmlUrl?: string
}

/**
 * Single commit on the configured branch: new MP4 under public/assets/videos/
 * plus an appended entry in owner-videos.json for the chosen page target.
 */
export async function commitOwnerVideo(opts: {
  pat: string
  title: string
  file: File
  filename: string
  target: OwnerVideoTarget
  onProgress?: (step: string) => void
}): Promise<CommitVideoResult> {
  const pat = opts.pat.trim()
  const { title, file, filename, target, onProgress } = opts
  const { owner, repo, branch } = githubConfig()
  const videoPath = `${VIDEO_DIR}/${filename}`

  onProgress?.('בודקים אם הקובץ כבר קיים…')
  const existingFile = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${videoPath}?ref=${branch}`,
    { headers: authHeaders(pat) },
  )
  if (existingFile.ok) {
    throw new Error(`הקובץ ${filename} כבר קיים בענף ${branch}. שנו את שם הקובץ ונסו שוב.`)
  }
  if (existingFile.status === 401 || existingFile.status === 403) {
    throw authError(await readGhError(existingFile), 'בדיקת קובץ קיים')
  }
  if (existingFile.status !== 404) {
    throw new Error(`שגיאה בבדיקת קובץ קיים (${existingFile.status}).`)
  }

  onProgress?.('קוראים את רשימת הסרטונים…')
  let current = emptyOwnerVideosFile()
  let removeLegacy = false

  const primary = await fetchJsonFile(pat, owner, repo, branch, JSON_PATH)
  if (primary.ok) {
    current = parseOwnerVideosFile(JSON.parse(decodeBase64Utf8(primary.content)))
  } else if (primary.status === 401 || primary.status === 403) {
    throw authError(primary.detail, 'קריאת JSON')
  } else if (primary.status === 404) {
    // Migrate from the older articles-only JSON if present on the branch.
    const legacy = await fetchJsonFile(pat, owner, repo, branch, LEGACY_JSON_PATH)
    if (legacy.ok) {
      const old = JSON.parse(decodeBase64Utf8(legacy.content)) as {
        items?: { type?: string; file: string; label: string }[]
      }
      if (Array.isArray(old.items)) {
        current.articlesVideos = old.items
          .filter((i) => i.file && i.label)
          .map((i) => ({ type: 'video' as const, file: i.file, label: i.label }))
      }
      removeLegacy = true
    } else if (legacy.status === 401 || legacy.status === 403) {
      throw authError(legacy.detail, 'קריאת JSON ישן')
    } else if (legacy.status !== 404) {
      throw new Error(`שגיאה בקריאת רשימת הסרטונים (${legacy.status}).`)
    }
  } else {
    throw new Error(`שגיאה בקריאת רשימת הסרטונים (${primary.status}).`)
  }

  const allFiles = [
    ...current.infoVideos,
    ...current.articlesVideos,
    ...current.radioTvVideos,
    ...current.pressVideos,
  ]
  if (allFiles.some((item) => item.file === filename)) {
    throw new Error(`הקובץ ${filename} כבר רשום ברשימת הסרטונים.`)
  }

  const next: OwnerVideosFile = {
    ...current,
    [target]: [...current[target], { type: 'video', file: filename, label: title.trim() }],
  }

  onProgress?.('מעלים את קובץ הווידאו…')
  const videoB64 = await fileToBase64(file)
  const videoBlob = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/blobs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: videoB64, encoding: 'base64' }),
    },
    'יצירת blob לווידאו',
  )

  onProgress?.('מעדכנים את רשימת הסרטונים…')
  const jsonBlob = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/blobs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: JSON.stringify(next, null, 2) + '\n',
        encoding: 'utf-8',
      }),
    },
    'יצירת blob ל־JSON',
  )

  onProgress?.('יוצרים commit בענף dev…')
  const ref = await gh<{ object: { sha: string } }>(
    pat,
    `/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    {},
    `קריאת ענף ${branch}`,
  )
  const parentSha = ref.object.sha
  const parentCommit = await gh<{ tree: { sha: string } }>(
    pat,
    `/repos/${owner}/${repo}/git/commits/${parentSha}`,
    {},
    'קריאת commit',
  )

  const treeEntries: { path: string; mode: string; type: string; sha: string }[] = [
    { path: videoPath, mode: '100644', type: 'blob', sha: videoBlob.sha },
    { path: JSON_PATH, mode: '100644', type: 'blob', sha: jsonBlob.sha },
  ]

  if (removeLegacy) {
    // Deleting a path in the Git Data API: omit from tree with sha null is not
    // enough with base_tree; use an empty blob replacement is wrong. Leave the
    // legacy file in place — the app no longer reads it.
  }

  const tree = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: parentCommit.tree.sha,
        tree: treeEntries,
      }),
    },
    'יצירת tree',
  )

  const commit = await gh<{ sha: string; html_url?: string }>(
    pat,
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `content: add ${target} video ${filename}`,
        tree: tree.sha,
        parents: [parentSha],
      }),
    },
    'יצירת commit',
  )

  await gh(
    pat,
    `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: commit.sha }),
    },
    `עדכון ענף ${branch}`,
  )

  return { commitSha: commit.sha, filename, target, htmlUrl: commit.html_url }
}

export type PromoteVideosResult = {
  branch: string
  prNumber: number
  prUrl: string
  fileCount: number
}

/**
 * Copy owner-videos.json + all referenced MP4s from the upload branch (`dev`)
 * onto a new branch based on `main`, then open a PR into `main` (required when
 * main is protected).
 */
export async function promoteOwnerVideosViaPr(opts: {
  pat: string
  onProgress?: (step: string) => void
}): Promise<PromoteVideosResult> {
  const pat = opts.pat.trim()
  const { onProgress } = opts
  const { owner, repo, branch: sourceBranch, mainBranch } = githubConfig()

  onProgress?.(`קוראים את רשימת הסרטונים מ־${sourceBranch}…`)
  const sourceJson = await fetchJsonFile(pat, owner, repo, sourceBranch, JSON_PATH)
  if (!sourceJson.ok) {
    if (sourceJson.status === 401 || sourceJson.status === 403) {
      throw authError(sourceJson.detail, 'קריאת JSON מ־dev')
    }
    if (sourceJson.status === 404) {
      throw new Error(`אין עדיין owner-videos.json בענף ${sourceBranch}. העלו סרטון קודם.`)
    }
    throw new Error(`שגיאה בקריאת JSON מ־${sourceBranch} (${sourceJson.status}).`)
  }

  const ownerVideos = parseOwnerVideosFile(JSON.parse(decodeBase64Utf8(sourceJson.content)))
  const entries = [
    ...ownerVideos.infoVideos,
    ...ownerVideos.articlesVideos,
    ...ownerVideos.radioTvVideos,
    ...ownerVideos.pressVideos,
  ]
  if (entries.length === 0) {
    throw new Error('רשימת הסרטונים ריקה — אין מה לפרסם ל־main.')
  }

  const uniqueFiles = [...new Set(entries.map((e) => e.file))]
  onProgress?.(`אוספים ${uniqueFiles.length} קבצי וידאו מ־${sourceBranch}…`)

  type TreeEntry = { path: string; mode: '100644'; type: 'blob'; sha: string }
  const treeEntries: TreeEntry[] = []

  // Re-create the JSON blob so the PR always carries the current list text.
  const jsonBlob = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/blobs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: JSON.stringify(ownerVideos, null, 2) + '\n',
        encoding: 'utf-8',
      }),
    },
    'יצירת blob ל־JSON',
  )
  treeEntries.push({ path: JSON_PATH, mode: '100644', type: 'blob', sha: jsonBlob.sha })

  for (const file of uniqueFiles) {
    const path = `${VIDEO_DIR}/${file}`
    const metaRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${sourceBranch}`,
      { headers: authHeaders(pat) },
    )
    if (metaRes.status === 401 || metaRes.status === 403) {
      throw authError(await readGhError(metaRes), `קריאת ${file}`)
    }
    if (!metaRes.ok) {
      throw new Error(`הקובץ ${file} חסר בענף ${sourceBranch} אך רשום ב־JSON.`)
    }
    const meta = (await metaRes.json()) as { sha: string }
    treeEntries.push({ path, mode: '100644', type: 'blob', sha: meta.sha })
  }

  onProgress?.(`יוצרים ענף מ־${mainBranch}…`)
  const mainRef = await gh<{ object: { sha: string } }>(
    pat,
    `/repos/${owner}/${repo}/git/ref/heads/${mainBranch}`,
    {},
    `קריאת ענף ${mainBranch}`,
  )
  const mainSha = mainRef.object.sha
  const mainCommit = await gh<{ tree: { sha: string } }>(
    pat,
    `/repos/${owner}/${repo}/git/commits/${mainSha}`,
    {},
    `קריאת commit של ${mainBranch}`,
  )

  const promoteBranch = `promote-owner-videos-${Date.now()}`
  await gh(
    pat,
    `/repos/${owner}/${repo}/git/refs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: `refs/heads/${promoteBranch}`,
        sha: mainSha,
      }),
    },
    'יצירת ענף לפרסום',
  )

  onProgress?.('כותבים את קבצי הסרטונים לענף החדש…')
  const tree = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: mainCommit.tree.sha,
        tree: treeEntries,
      }),
    },
    'יצירת tree לפרסום',
  )

  const commit = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `content: promote owner videos from ${sourceBranch}`,
        tree: tree.sha,
        parents: [mainSha],
      }),
    },
    'יצירת commit לפרסום',
  )

  await gh(
    pat,
    `/repos/${owner}/${repo}/git/refs/heads/${promoteBranch}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: commit.sha }),
    },
    'עדכון ענף הפרסום',
  )

  onProgress?.('פותחים Pull Request ל־main…')
  const pr = await gh<{ number: number; html_url: string }>(
    pat,
    `/repos/${owner}/${repo}/pulls`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'content: promote owner videos to production',
        head: promoteBranch,
        base: mainBranch,
        body: [
          '## Summary',
          `- Promotes \`owner-videos.json\` and ${uniqueFiles.length} owner-uploaded MP4(s) from \`${sourceBranch}\` to \`${mainBranch}\`.`,
          '- Does **not** merge the rest of \`dev\` — video content only.',
          '',
          '## Test plan',
          '- [ ] Confirm videos appear on the target flipbook pages after production deploy',
        ].join('\n'),
      }),
    },
    'יצירת Pull Request',
  )

  return {
    branch: promoteBranch,
    prNumber: pr.number,
    prUrl: pr.html_url,
    fileCount: uniqueFiles.length,
  }
}

/** @deprecated Use commitOwnerVideo */
export const commitArticlesVideo = (
  opts: Omit<Parameters<typeof commitOwnerVideo>[0], 'target'> & { target?: OwnerVideoTarget },
) => commitOwnerVideo({ ...opts, target: opts.target ?? 'articlesVideos' })
