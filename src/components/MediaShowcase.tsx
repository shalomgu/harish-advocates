import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { TipArticle, TipVideo } from '../content/pages'

type LightboxItem =
  | { kind: 'video'; src: string; poster?: string; alt: string }
  | { kind: 'image'; images: string[]; alt: string }
  | { kind: 'pdf'; src: string; alt: string }

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

      {item.kind === 'pdf' ? (
        <div className="media-stage media-stage--pdf" onClick={stop}>
          <iframe src={item.src} title={item.alt} />
          <a className="media-pdf-open" href={item.src} target="_blank" rel="noopener noreferrer">
            פתיחה בכרטיסייה חדשה ↗
          </a>
        </div>
      ) : item.kind === 'video' ? (
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
                      '--offset': (i - active) / 3,
                      '--direction': Math.sign(i - active),
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
            className="carousel-nav carousel-nav--left"
            onClick={(e) => { stop(e); go(1) }}
            disabled={active === count - 1}
            aria-label="הבא"
          >
            ‹
          </button>
          <button
            className="carousel-nav carousel-nav--right"
            onClick={(e) => { stop(e); go(-1) }}
            disabled={active === 0}
            aria-label="הקודם"
          >
            ›
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

export interface ShowcaseVideos {
  heading: string
  items: TipVideo[]
}

export interface ShowcaseArticles {
  heading: string
  items: TipArticle[]
  empty?: string
}

export default function MediaShowcase({
  videos,
  articles,
}: {
  videos: ShowcaseVideos
  articles: ShowcaseArticles
}) {
  const [active, setActive] = useState<LightboxItem | null>(null)

  return (
    <div className="showcase">
      <section className="showcase-section">
        <h3>{videos.heading}</h3>
        <div className="video-grid">
          {videos.items.map((video) =>
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
                  {video.icon === 'radio' ? (
                    <span className="video-play video-play--radio" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M15.5 3.2a1 1 0 0 1 .46 1.87L11.8 7h6.7A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-8A2.5 2.5 0 0 1 5.5 7h1.86l7.2-3.69a1 1 0 0 1 .94-.11zM7.5 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM17 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 3.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="video-play" aria-hidden="true">
                      ▶
                    </span>
                  )}
                </span>
                <span className="video-label">{video.label}</span>
              </a>
            ),
          )}
        </div>
      </section>

      <section className="showcase-section">
        <h3>{articles.heading}</h3>
        {articles.items.length > 0 ? (
          <div className="article-grid">
            {articles.items.map((article) => (
              <button
                className="article-card"
                key={article.title}
                onClick={() =>
                  setActive(
                    article.pdf
                      ? { kind: 'pdf', src: article.pdf, alt: article.title }
                      : { kind: 'image', images: article.images ?? [], alt: article.title },
                  )
                }
              >
                <span className="article-thumb">
                  <img src={article.thumbnail} alt={article.title} loading="lazy" />
                  <span className="article-zoom" aria-hidden="true">
                    ⤢
                  </span>
                </span>
                <span className="article-title">{article.title}</span>
                {article.source && <span className="article-source">{article.source}</span>}
              </button>
            ))}
          </div>
        ) : (
          articles.empty && <p className="showcase-empty">{articles.empty}</p>
        )}
      </section>

      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </div>
  )
}
