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
    `אימות/הרשאה נכשלו (${step}): ${detail}. בדקו: PAT בתוקף, גישה ל־repo, Contents Read and write, והרשאה לדחוף ל־dev.`,
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

/** @deprecated Use commitOwnerVideo */
export const commitArticlesVideo = (
  opts: Omit<Parameters<typeof commitOwnerVideo>[0], 'target'> & { target?: OwnerVideoTarget },
) => commitOwnerVideo({ ...opts, target: opts.target ?? 'articlesVideos' })
