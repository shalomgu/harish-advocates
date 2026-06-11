import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { media } from '../content/pages'

const MediaRadioPage = forwardRef<HTMLDivElement>(function MediaRadioPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.videos.heading}>
      <MediaShowcase videos={media.videos} showHeadings={false} />
    </Page>
  )
})

export default MediaRadioPage
