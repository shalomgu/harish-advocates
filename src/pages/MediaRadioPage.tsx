import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { mergePageVideos } from '../content/ownerVideos'
import { media } from '../content/pages'

const MediaRadioPage = forwardRef<HTMLDivElement>(function MediaRadioPage(_props, ref) {
  const videos = mergePageVideos(media.videos, 'radioTvVideos')
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.videos.heading}>
      <MediaShowcase videos={videos} showHeadings={false} />
    </Page>
  )
})

export default MediaRadioPage
