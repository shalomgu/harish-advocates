import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { useLocale } from '../content/locale'

const MediaPage = forwardRef<HTMLDivElement>(function MediaPage(_props, ref) {
  const { media } = useLocale().t
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.title}>
      <MediaShowcase videos={media.videos} articles={media.articles} />
    </Page>
  )
})

export default MediaPage
