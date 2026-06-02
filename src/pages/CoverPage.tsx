import { forwardRef, Fragment } from 'react'
import Page from '../components/Page'
import { cover } from '../content/pages'

const CoverPage = forwardRef<HTMLDivElement>(function CoverPage(_props, ref) {
  return (
    <Page ref={ref} variant="cover">
      <div className="cover-scene">
        <article className="cover-face">
          <img src={cover.logo} alt={cover.logoAlt} className="cover-logo" />
          <h1 className="cover-title">{cover.title}</h1>
          <div className="cover-gold-line" aria-hidden="true" />
          <p className="cover-tagline">
            {cover.taglineParts.map((part, i) => (
              <Fragment key={part}>
                {part}
                {i < cover.taglineParts.length - 1 && <span>|</span>}
              </Fragment>
            ))}
          </p>
          <figure className="cover-portrait">
            <img src={cover.portrait} alt={cover.portraitAlt} className="cover-photo" />
          </figure>
          <p className="cover-author">{cover.author}</p>
          <p className="cover-promise">{cover.promise}</p>
          <div className="cover-gold-line" aria-hidden="true" />
          <p className="cover-footer">{cover.footer}</p>
        </article>
      </div>
    </Page>
  )
})

export default CoverPage
