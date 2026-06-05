import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { media } from '../content/pages'

const MediaPage = forwardRef<HTMLDivElement>(function MediaPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.title}>
      <MediaShowcase videos={media.videos} articles={media.articles} />
    </Page>
  )
})

export default MediaPage
