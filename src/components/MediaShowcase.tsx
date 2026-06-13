import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { TipArticle, TipVideo } from '../content/pages'
import { useFocusTrap } from '../lib/useFocusTrap'

type LightboxItem =
  | { kind: 'video'; src: string; poster?: string; alt: string; audio?: boolean }
  | { kind: 'image'; images: string[]; alt: string }
  | { kind: 'pdf'; src: string; alt: string }
  | { kind: 'web'; src: string; alt: string }

const MAX_VISIBILITY = 3

/**
 * Audio recordings stored as MP4 (no meaningful picture): show the poster image
 * on screen while the track plays; click the image to pause/resume.
 */
function AudioStage({
  src,
  poster,
  alt,
  onEnded,
}: {
  src: string
  poster?: string
  alt: string
  onEnded: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }

  return (
    <div className="media-stage media-stage--audio" onClick={(e) => e.stopPropagation()}>
      <button className="audio-cover-btn" onClick={toggle} aria-label={playing ? 'השהיה' : 'נגינה'}>
        {poster && <img className="audio-cover" src={poster} alt={alt} draggable={false} />}
        <span className={`audio-glyph${playing ? ' is-playing' : ''}`} aria-hidden="true">
          {playing ? '❚❚' : '▶'}
        </span>
      </button>
      <video
        ref={videoRef}
        className="audio-track"
        src={src}
        autoPlay
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
      />
    </div>
  )
}

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const { lightbox } = useLocale().chrome
  const count = item.kind === 'image' ? item.images.length : 0
  const [active, setActive] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(true, dialogRef)

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
    <div
      ref={dialogRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
    >
      <button className="media-lightbox-close" onClick={(e) => { stop(e); onClose() }} aria-label="סגירה">
        ×
      </button>

      {item.kind === 'pdf' || item.kind === 'web' ? (
        <div className="media-stage media-stage--pdf" onClick={stop}>
          <iframe
            src={item.src}
            title={item.alt}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
          <a className="media-pdf-open" href={item.src} target="_blank" rel="noopener noreferrer">
            פתיחה בכרטיסייה חדשה ↗
          </a>
        </div>
      ) : item.kind === 'video' && item.audio ? (
        <AudioStage src={item.src} poster={item.poster} alt={item.alt} onEnded={onClose} />
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
                      // Fade neighbours out progressively so the active slide
                      // dominates instead of competing with full-opacity cards.
                      opacity: distance >= MAX_VISIBILITY ? 0 : 1 - distance * 0.4,
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
            aria-label={lightbox.next}
          >
            ‹
          </button>
          <button
            className="carousel-nav carousel-nav--right"
            onClick={(e) => { stop(e); go(-1) }}
            disabled={active === 0}
            aria-label={lightbox.prev}
          >
            ›
          </button>

          <div className="carousel-dots" onClick={stop}>
            {item.images.map((src, i) => (
              <button
                key={src}
                className={`carousel-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={lightbox.slide(i + 1)}
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
  showHeadings = true,
}: {
  videos?: ShowcaseVideos
  articles?: ShowcaseArticles
  showHeadings?: boolean
}) {
  const [active, setActive] = useState<LightboxItem | null>(null)

  return (
    <div className="showcase">
      {videos && (
      <section className="showcase-section">
        {showHeadings && <h3>{videos.heading}</h3>}
        <div className="video-grid">
          {videos.items.map((video) =>
            video.type === 'video' ? (
              <button
                className="video-tile video-tile--play"
                key={video.url}
                onClick={() => setActive({ kind: 'video', src: video.url, poster: video.poster, alt: video.label, audio: video.audio })}
              >
                <span className="video-media">
                  <video src={video.url} poster={video.poster} muted playsInline preload="metadata" tabIndex={-1} aria-hidden="true" />
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
            ) : video.type === 'iframe' ? (
              <button
                className="video-tile video-tile--link"
                key={video.url}
                onClick={() => setActive({ kind: 'web', src: video.url, alt: video.label })}
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
              </button>
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
      )}

      {articles && (
      <section className="showcase-section">
        {showHeadings && <h3>{articles.heading}</h3>}
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
      )}

      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </div>
  )
}
