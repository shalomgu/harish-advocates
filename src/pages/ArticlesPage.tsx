import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { ownerVideosSection } from '../content/ownerVideos'
import { tips } from '../content/pages'

const ArticlesPage = forwardRef<HTMLDivElement>(function ArticlesPage(_props, ref) {
  const videos = ownerVideosSection('articlesVideos')
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.articles.heading}>
      <MediaShowcase
        videos={videos}
        articles={tips.articles}
        showHeadings={Boolean(videos)}
      />
    </Page>
  )
})

export default ArticlesPage
