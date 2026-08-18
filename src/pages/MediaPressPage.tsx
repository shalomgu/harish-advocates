import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { ownerVideosSection } from '../content/ownerVideos'
import { media } from '../content/pages'

const MediaPressPage = forwardRef<HTMLDivElement>(function MediaPressPage(_props, ref) {
  const videos = ownerVideosSection('pressVideos')
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.articles.heading}>
      <MediaShowcase
        videos={videos}
        articles={media.articles}
        showHeadings={Boolean(videos)}
      />
    </Page>
  )
})

export default MediaPressPage
