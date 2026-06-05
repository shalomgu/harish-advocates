import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Page from '../components/Page'
import { tips } from '../content/pages'

type LightboxItem =
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'image'; src: string; alt: string }

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="media-lightbox" onClick={onClose}>
      <div
        className={`media-lightbox-inner${item.kind === 'image' ? ' media-lightbox-inner--image' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="media-lightbox-close" onClick={onClose} aria-label="סגירה">
          ×
        </button>
        {item.kind === 'video' ? (
          <video src={item.src} poster={item.poster} controls autoPlay playsInline onEnded={onClose} />
        ) : (
          <img className="media-lightbox-image" src={item.src} alt={item.alt} />
        )}
      </div>
    </div>,
    document.body,
  )
}

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  const [active, setActive] = useState<LightboxItem | null>(null)

  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title}>
      <section className="tips-section">
        <h3>{tips.videos.heading}</h3>
        <div className="video-grid">
          {tips.videos.items.map((video) =>
            video.type === 'video' ? (
              <button
                className="video-tile video-tile--play"
                key={video.url}
                onClick={() => setActive({ kind: 'video', src: video.url, poster: video.poster, alt: video.label })}
              >
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
          {tips.articles.items.map((article) => (
            <button
              className="article-card"
              key={article.image}
              onClick={() => setActive({ kind: 'image', src: article.image, alt: article.title })}
            >
              <span className="article-thumb">
                <img src={article.image} alt={article.title} loading="lazy" />
                <span className="article-zoom" aria-hidden="true">
                  ⤢
                </span>
              </span>
              <span className="article-title">{article.title}</span>
            </button>
          ))}
        </div>
      </section>

      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </Page>
  )
})

export default TipsPage
