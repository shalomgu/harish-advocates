import { forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import Page from '../components/Page'
import LegalLinks from '../components/LegalLinks'
import IntroVideo from '../components/IntroVideo'
import CookieConsent from '../components/CookieConsent'
import { cover } from '../content/pages'
import { shared } from '../content/shared'

// One-time flag so the intro clip auto-plays only on a visitor's first arrival.
const INTRO_SEEN_KEY = 'harish.introSeen'
// One-time flag so the cookie notice only shows until it has been acknowledged.
const COOKIE_CONSENT_KEY = 'harish.cookieConsent'

function readCookieConsent(): boolean {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === '1'
  } catch {
    return false
  }
}

// Guard against the flip-book remounting CoverPage during its initial sizing
// pass: without it the first mount would arm the autoplay and the remount would
// cancel it, so the clip would never appear.
let introAutoTriggered = false

const CoverPage = forwardRef<HTMLDivElement>(function CoverPage(_props, ref) {
  const portraitRef = useRef<HTMLElement>(null)
  const [introOpen, setIntroOpen] = useState(false)
  const [showCookie, setShowCookie] = useState(false)

  const acceptCookies = () => {
    setShowCookie(false)
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, '1')
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }

  // Once the intro clip closes, surface the cookie notice on a first visit.
  const closeIntro = () => {
    setIntroOpen(false)
    if (!readCookieConsent()) setShowCookie(true)
  }

  useEffect(() => {
    if (introAutoTriggered) return
    let seen = true
    try {
      seen = window.localStorage.getItem(INTRO_SEEN_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) {
      // Returning visitor (no intro to play) who hasn't acknowledged cookies yet.
      if (!readCookieConsent()) setShowCookie(true)
      return
    }
    // Let the flip-book finish sizing so the portrait is measured in its final
    // spot. The flag is only persisted once the clip actually opens, so a
    // remount before then simply re-arms the timer instead of skipping it.
    const id = window.setTimeout(() => {
      introAutoTriggered = true
      try {
        window.localStorage.setItem(INTRO_SEEN_KEY, '1')
      } catch {
        // ignore storage errors (private mode, etc.)
      }
      setIntroOpen(true)
    }, 600)
    return () => window.clearTimeout(id)
  }, [])

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
          <figure className="cover-portrait" ref={portraitRef}>
            <button
              type="button"
              className="cover-portrait-btn"
              onClick={(e) => { e.stopPropagation(); setIntroOpen(true) }}
              aria-label={shared.intro.replay}
            >
              <img src={cover.portrait} alt={cover.portraitAlt} className="cover-photo" />
            </button>
          </figure>
          <p className="cover-author">{cover.author}</p>
          <p className="cover-promise">{cover.promise}</p>
          {cover.footer && (
            <>
              <div className="cover-gold-line" aria-hidden="true" />
              <p className="cover-footer">{cover.footer}</p>
            </>
          )}
          <LegalLinks className="legal-links--cover" />
        </article>
      </div>

      {introOpen && cover.introVideo && (
        <IntroVideo src={cover.introVideo} originRef={portraitRef} onClose={closeIntro} />
      )}

      {showCookie && <CookieConsent onAccept={acceptCookies} />}
    </Page>
  )
})

export default CoverPage
