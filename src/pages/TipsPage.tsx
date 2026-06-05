import { forwardRef, useCallback, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import Page from '../components/Page'
import { tips } from '../content/pages'

type LightboxItem =
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'image'; images: string[]; alt: string }

const MAX_VISIBILITY = 3

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const count = item.kind === 'image' ? item.images.length : 0
  const [active, setActive] = useState(0)

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return
      setActive((i) => Math.min(count - 1, Math.max(0, i + delta)))
    },
    [count],
  )

  useEffect(() => {
    // Capture phase so arrow keys drive the carousel instead of flipping the book behind it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (item.kind === 'image' && count > 1) {
        if (e.key === 'ArrowRight') {
          e.stopPropagation()
          go(-1)
        } else if (e.key === 'ArrowLeft') {
          e.stopPropagation()
          go(1)
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose, go, count, item.kind])

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return createPortal(
    <div className="media-lightbox" onClick={onClose}>
      <button className="media-lightbox-close" onClick={(e) => { stop(e); onClose() }} aria-label="סגירה">
        ×
      </button>

      {item.kind === 'video' ? (
        <div className="media-stage" onClick={stop}>
          <video src={item.src} poster={item.poster} controls autoPlay playsInline onEnded={onClose} />
        </div>
      ) : count > 1 ? (
        <>
          <div className="carousel3d" onClick={stop}>
            {item.images.map((src, i) => {
              const distance = Math.abs(active - i)
              const visible = distance <= MAX_VISIBILITY
              return (
                <div
                  key={src}
                  className="carousel3d-card"
                  onClick={() => setActive(i)}
                  style={
                    {
                      '--active': i === active ? 1 : 0,
                      '--offset': (active - i) / 3,
                      '--direction': Math.sign(active - i),
                      '--abs-offset': distance / 3,
                      pointerEvents: visible ? 'auto' : 'none',
                      opacity: distance >= MAX_VISIBILITY ? 0 : 1,
                      display: distance > MAX_VISIBILITY ? 'none' : 'block',
                    } as CSSProperties
                  }
                >
                  <img src={src} alt={`${item.alt} ${i + 1}`} draggable={false} />
                </div>
              )
            })}
          </div>

          <button
            className="carousel-nav carousel-prev"
            onClick={(e) => { stop(e); go(-1) }}
            disabled={active === 0}
            aria-label="הקודם"
          >
            ›
          </button>
          <button
            className="carousel-nav carousel-next"
            onClick={(e) => { stop(e); go(1) }}
            disabled={active === count - 1}
            aria-label="הבא"
          >
            ‹
          </button>

          <div className="carousel-dots" onClick={stop}>
            {item.images.map((src, i) => (
              <button
                key={src}
                className={`carousel-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`שקופית ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="media-stage media-stage--image" onClick={stop}>
          <img className="media-lightbox-image" src={item.images[0]} alt={item.alt} />
        </div>
      )}
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
              key={article.title}
              onClick={() => setActive({ kind: 'image', images: article.images, alt: article.title })}
            >
              <span className="article-thumb">
                <img src={article.thumbnail} alt={article.title} loading="lazy" />
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
