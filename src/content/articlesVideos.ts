// Owner-added videos for מאמרים ומדריכים. Kept separate from pages.ts so the
// Vite config (Node) can import pages/seo without resolving a JSON module.
import { asset } from './shared'
import type { ArticlesVideosFile, TipVideo } from './pages'
import articlesVideosJson from './articles-videos.json'

const data = articlesVideosJson as ArticlesVideosFile

export const articlesVideos = {
  heading: data.heading,
  items: data.items.map(
    (item): TipVideo => ({
      type: 'video',
      url: asset(`videos/${item.file}`),
      label: item.label,
    }),
  ),
}
