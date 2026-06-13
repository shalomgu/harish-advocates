import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { useLocale } from '../content/locale'

const ArticlesPage = forwardRef<HTMLDivElement>(function ArticlesPage(_props, ref) {
  const { tips } = useLocale().t
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.articles.heading}>
      <MediaShowcase articles={tips.articles} showHeadings={false} />
    </Page>
  )
})

export default ArticlesPage
