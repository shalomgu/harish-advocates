import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { useLocale } from '../content/locale'

const InfoVideosPage = forwardRef<HTMLDivElement>(function InfoVideosPage(_props, ref) {
  const { tips } = useLocale().t
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.videos.heading}>
      <MediaShowcase videos={tips.videos} showHeadings={false} />
    </Page>
  )
})

export default InfoVideosPage
