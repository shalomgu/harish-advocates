import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { useLocale } from '../content/locale'

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  const { tips } = useLocale().t
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title}>
      <MediaShowcase videos={tips.videos} articles={tips.articles} />
    </Page>
  )
})

export default TipsPage
