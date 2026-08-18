// Owner-added videos (admin UI). Kept separate from pages.ts so the Vite config
// (Node) can import pages/seo without resolving a JSON module.
import { asset } from './shared'
import type { OwnerVideoEntry, OwnerVideosFile, OwnerVideoTarget, TipVideo } from './pages'
import ownerVideosJson from './owner-videos.json'

const EMPTY: OwnerVideosFile = {
  infoVideos: [],
  articlesVideos: [],
  radioTvVideos: [],
  pressVideos: [],
}

function normalize(raw: unknown): OwnerVideosFile {
  const data = (raw ?? {}) as Partial<OwnerVideosFile>
  return {
    infoVideos: Array.isArray(data.infoVideos) ? data.infoVideos : [],
    articlesVideos: Array.isArray(data.articlesVideos) ? data.articlesVideos : [],
    radioTvVideos: Array.isArray(data.radioTvVideos) ? data.radioTvVideos : [],
    pressVideos: Array.isArray(data.pressVideos) ? data.pressVideos : [],
  }
}

export const OWNER_VIDEO_TARGETS: {
  id: OwnerVideoTarget
  label: string
  /** Heading used when the page shows a separate owner-video section. */
  sectionHeading: string
}[] = [
  { id: 'infoVideos', label: 'סרטוני מידע', sectionHeading: 'סרטונים נוספים' },
  { id: 'articlesVideos', label: 'מאמרים ומדריכים', sectionHeading: 'סרטונים' },
  { id: 'radioTvVideos', label: 'רדיו וטלויזיה', sectionHeading: 'סרטונים נוספים' },
  { id: 'pressVideos', label: 'עיתונות כתובה', sectionHeading: 'סרטונים' },
]

const data = normalize(ownerVideosJson)

function toTipVideos(entries: OwnerVideoEntry[]): TipVideo[] {
  return entries.map((item) => ({
    type: 'video' as const,
    url: asset(`videos/${item.file}`),
    label: item.label,
  }))
}

export function getOwnerVideoEntries(target: OwnerVideoTarget): OwnerVideoEntry[] {
  return data[target] ?? []
}

export function getOwnerTipVideos(target: OwnerVideoTarget): TipVideo[] {
  return toTipVideos(getOwnerVideoEntries(target))
}

/** Merge hardcoded page videos with owner-added ones (owner items last). */
export function mergePageVideos(
  base: { heading: string; items: TipVideo[] },
  target: OwnerVideoTarget,
): { heading: string; items: TipVideo[] } {
  const extra = getOwnerTipVideos(target)
  if (extra.length === 0) return base
  return { heading: base.heading, items: [...base.items, ...extra] }
}

/** Standalone showcase block for pages that are mostly articles. */
export function ownerVideosSection(target: OwnerVideoTarget): { heading: string; items: TipVideo[] } | undefined {
  const items = getOwnerTipVideos(target)
  if (items.length === 0) return undefined
  const meta = OWNER_VIDEO_TARGETS.find((t) => t.id === target)
  return { heading: meta?.sectionHeading ?? 'סרטונים', items }
}

export function emptyOwnerVideosFile(): OwnerVideosFile {
  return { ...EMPTY, infoVideos: [], articlesVideos: [], radioTvVideos: [], pressVideos: [] }
}

export function parseOwnerVideosFile(raw: unknown): OwnerVideosFile {
  return normalize(raw)
}
