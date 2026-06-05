import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Page from '../components/Page'
import { tips, type TipVideo } from '../content/pages'

function VideoLightbox({ video, onClose }: { video: TipVideo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="video-lightbox" onClick={onClose}>
      <div className="video-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="video-lightbox-close" onClick={onClose} aria-label="סגירה">
          ×
        </button>
        <video src={video.url} poster={video.poster} controls autoPlay playsInline onEnded={onClose} />
      </div>
    </div>,
    document.body,
  )
}

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  const [active, setActive] = useState<TipVideo | null>(null)

  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title}>
      <section className="tips-section">
        <h3>{tips.videos.heading}</h3>
        <div className="video-grid">
          {tips.videos.items.map((video) =>
            video.type === 'video' ? (
              <button className="video-tile video-tile--play" key={video.url} onClick={() => setActive(video)}>
                <span className="video-media">
                  <video src={video.url} poster={video.poster} muted playsInline preload="metadata" tabIndex={-1} />
                  <span className="video-play" aria-hidden="true">
                    ▶
                  </span>
                </span>
                <span className="video-label">{video.label}</span>
              </button>
            ) : video.type === 'embed' ? (
              <div className="video-tile" key={video.url}>
                <div className="video-media">
                  <iframe
                    src={video.url}
                    title={video.label}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <span className="video-label">{video.label}</span>
              </div>
            ) : (
              <a
                className="video-tile video-tile--link"
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="video-media">
                  <span className="video-play" aria-hidden="true">
                    ▶
                  </span>
                </span>
                <span className="video-label">{video.label}</span>
              </a>
            ),
          )}
        </div>
      </section>

      <section className="tips-section">
        <h3>{tips.articles.heading}</h3>
        <div className="article-grid">
          {tips.articles.items.map((article, i) => (
            <article className="article-card" key={i}>
              <span className="article-icon" aria-hidden="true">
                {article.icon}
              </span>
              <h4>{article.title}</h4>
              <p>{article.text}</p>
            </article>
          ))}
        </div>
      </section>

      {active && <VideoLightbox video={active} onClose={() => setActive(null)} />}
    </Page>
  )
})

export default TipsPage
