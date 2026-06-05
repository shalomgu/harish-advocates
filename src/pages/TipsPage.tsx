import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { tips } from '../content/pages'

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title}>
      <MediaShowcase videos={tips.videos} articles={tips.articles} />
    </Page>
  )
})

export default TipsPage
