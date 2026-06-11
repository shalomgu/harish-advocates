import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { media } from '../content/pages'

const MediaPressPage = forwardRef<HTMLDivElement>(function MediaPressPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.articles.heading}>
      <MediaShowcase articles={media.articles} showHeadings={false} />
    </Page>
  )
})

export default MediaPressPage
