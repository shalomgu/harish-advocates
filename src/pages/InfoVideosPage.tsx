import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { mergePageVideos } from '../content/ownerVideos'
import { tips } from '../content/pages'

const InfoVideosPage = forwardRef<HTMLDivElement>(function InfoVideosPage(_props, ref) {
  const videos = mergePageVideos(tips.videos, 'infoVideos')
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.videos.heading}>
      <MediaShowcase videos={videos} showHeadings={false} />
    </Page>
  )
})

export default InfoVideosPage
