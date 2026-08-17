import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { articlesVideos } from '../content/articlesVideos'
import { tips } from '../content/pages'

const ArticlesPage = forwardRef<HTMLDivElement>(function ArticlesPage(_props, ref) {
  const hasVideos = articlesVideos.items.length > 0
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.articles.heading}>
      <MediaShowcase
        videos={hasVideos ? articlesVideos : undefined}
        articles={tips.articles}
        showHeadings={hasVideos}
      />
    </Page>
  )
})

export default ArticlesPage
