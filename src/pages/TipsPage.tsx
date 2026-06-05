import { forwardRef } from 'react'
import Page from '../components/Page'
import { tips } from '../content/pages'

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title}>
      <section className="tips-section">
        <h3>{tips.videos.heading}</h3>
        <div className="video-grid">
          {tips.videos.items.map((video) =>
            video.type === 'video' ? (
              <div className="video-tile" key={video.url}>
                <div className="video-media">
                  <video src={video.url} poster={video.poster} controls playsInline preload="metadata" />
                </div>
                <span className="video-label">{video.label}</span>
              </div>
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
    </Page>
  )
})

export default TipsPage
