// Back-compat re-export — prefer ownerVideos.ts.
export { ownerVideosSection as articlesVideosSection, getOwnerTipVideos } from './ownerVideos'
import { ownerVideosSection } from './ownerVideos'

/** @deprecated Use ownerVideosSection('articlesVideos') */
export const articlesVideos = ownerVideosSection('articlesVideos') ?? {
  heading: 'סרטונים',
  items: [],
}
