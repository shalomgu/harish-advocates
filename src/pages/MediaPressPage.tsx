import { forwardRef } from 'react'
import Page from '../components/Page'
import MediaShowcase from '../components/MediaShowcase'
import { useLocale } from '../content/locale'

const MediaPressPage = forwardRef<HTMLDivElement>(function MediaPressPage(_props, ref) {
  const { media } = useLocale().t
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.articles.heading}>
      <MediaShowcase articles={media.articles} showHeadings={false} />
    </Page>
  )
})

export default MediaPressPage
