import type { ArticlesVideosFile } from '../content/pages'
import { fileToBase64, githubConfig } from './utils'

const VIDEO_DIR = 'public/assets/videos'
const JSON_PATH = 'src/content/articles-videos.json'

type GhJson = Record<string, unknown>

function authHeaders(pat: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    // Trim aggressively — pasted tokens often pick up newlines/spaces.
    Authorization: `Bearer ${pat.trim()}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function readGhError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; documentation_url?: string }
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

export type CommitVideoResult = {
  commitSha: string
  filename: string
  htmlUrl?: string
}

/**
 * Single commit on the configured branch: new MP4 under public/assets/videos/
 * plus an appended entry in articles-videos.json.
 */
export async function commitArticlesVideo(opts: {
  pat: string
  title: string
  file: File
  filename: string
  onProgress?: (step: string) => void
}): Promise<CommitVideoResult> {
  const pat = opts.pat.trim()
  const { title, file, filename, onProgress } = opts
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
  const jsonRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${JSON_PATH}?ref=${branch}`,
    { headers: authHeaders(pat) },
  )
  if (jsonRes.status === 401 || jsonRes.status === 403) {
    throw authError(await readGhError(jsonRes), 'קריאת JSON')
  }

  // File may not exist on `dev` until the first admin upload (or until this
  // feature is merged). Start from an empty list in that case.
  let current: ArticlesVideosFile = { heading: 'סרטונים', items: [] }
  if (jsonRes.ok) {
    const jsonMeta = (await jsonRes.json()) as { content: string }
    current = JSON.parse(decodeBase64Utf8(jsonMeta.content)) as ArticlesVideosFile
    if (!Array.isArray(current.items)) {
      throw new Error('מבנה articles-videos.json אינו תקין.')
    }
  } else if (jsonRes.status !== 404) {
    throw new Error(`שגיאה בקריאת רשימת הסרטונים (${jsonRes.status}).`)
  }

  if (current.items.some((item) => item.file === filename)) {
    throw new Error(`הקובץ ${filename} כבר רשום ב־JSON.`)
  }

  const next: ArticlesVideosFile = {
    heading: current.heading || 'סרטונים',
    items: [...current.items, { type: 'video', file: filename, label: title.trim() }],
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

  const tree = await gh<{ sha: string }>(
    pat,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: parentCommit.tree.sha,
        tree: [
          { path: videoPath, mode: '100644', type: 'blob', sha: videoBlob.sha },
          { path: JSON_PATH, mode: '100644', type: 'blob', sha: jsonBlob.sha },
        ],
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
        message: `content: add articles video ${filename}`,
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

  return { commitSha: commit.sha, filename, htmlUrl: commit.html_url }
}
