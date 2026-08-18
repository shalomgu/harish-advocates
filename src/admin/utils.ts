/** Soft limit for browser base64 + GitHub Contents/Git Data API. */
export const MAX_VIDEO_BYTES = 40 * 1024 * 1024

const PAT_STORAGE_KEY = 'harish.admin.githubPat'

export function readStoredPat(): string {
  try {
    return sessionStorage.getItem(PAT_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function storePat(pat: string): void {
  sessionStorage.setItem(PAT_STORAGE_KEY, pat)
}

export function clearStoredPat(): void {
  sessionStorage.removeItem(PAT_STORAGE_KEY)
}

/** Prefer Latin slug from the original filename; fall back to a timestamp. */
export function slugifyVideoFilename(originalName: string): string {
  const base = originalName.replace(/\.mp4$/i, '')
  let slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug || slug.length < 2) {
    slug = `video-${Date.now()}`
  }
  return `${slug}.mp4`
}

export async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function githubConfig() {
  return {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'shalomgu',
    repo: import.meta.env.VITE_GITHUB_REPO || 'harish-advocates',
    branch: import.meta.env.VITE_GITHUB_BRANCH || 'dev',
    mainBranch: import.meta.env.VITE_GITHUB_MAIN_BRANCH || 'main',
  }
}
