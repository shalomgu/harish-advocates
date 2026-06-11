import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { tips } from '../content/pages'

const ArticlesPage = forwardRef<HTMLDivElement>(function ArticlesPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.articles.heading}>
      <MediaShowcase articles={tips.articles} showHeadings={false} />
    </Page>
  )
})

export default ArticlesPage
