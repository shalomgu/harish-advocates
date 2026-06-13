import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { tips } from '../content/pages'

const InfoVideosPage = forwardRef<HTMLDivElement>(function InfoVideosPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.videos.heading}>
      <MediaShowcase videos={tips.videos} showHeadings={false} />
    </Page>
  )
})

export default InfoVideosPage
