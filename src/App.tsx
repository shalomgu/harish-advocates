import { useCallback, useEffect, useRef, useState } from 'react'
import Book, { type BookHandle, type RtlMode } from './components/Book'
import AccessibilityWidget from './components/AccessibilityWidget'
import { shared } from './content/shared'
import { guideDeepLinks, pageTitles, readGuideSlug } from './content/pages'

function readInitialMode(): RtlMode {
  const param = new URLSearchParams(window.location.search).get('rtl')
  return param === 'native' ? 'native' : 'mirror'
}

export default function App() {
  const bookRef = useRef<BookHandle>(null)
  const [mode] = useState<RtlMode>(readInitialMode)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(pageTitles.length)
  const [thumbsOpen, setThumbsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLButtonElement>(null)
  const deepLinkDone = useRef(false)

  const onState = useCallback((cur: number, tot: number) => {
    setCurrent(cur)
    if (tot) setTotal(tot)

    // On the first state report (book just initialized), honor a ?guide=<slug>
    // deep link by flipping straight to that article's page. MediaShowcase then
    // auto-opens the matching carousel.
    if (!deepLinkDone.current) {
      deepLinkDone.current = true
      const slug = readGuideSlug()
      const target = slug ? guideDeepLinks[slug] : undefined
      if (target) {
        requestAnimationFrame(() => bookRef.current?.flip(target.page))
      }
    }
  }, [])

  const goTo = useCallback((index: number) => {
    bookRef.current?.flip(index)
    setMenuOpen(false)
    setThumbsOpen(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setThumbsOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      const insideMenu = menuRef.current?.contains(target)
      const onStatus = statusRef.current?.contains(target)
      if (!insideMenu && !onStatus) setMenuOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  }

  const atFirst = current <= 0
  const atLast = current >= total - 1

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        {shared.a11y.skipToContent}
      </a>
      <header className="topbar">
        <div className="page-menu" ref={menuRef}>
          <button
            type="button"
            className={`icon-btn hamburger${menuOpen ? ' is-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            title={shared.nav.goTo}
            aria-label={shared.nav.goTo}
          >
            <span className="hamburger-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          {menuOpen && (
            <ul className="page-menu-list" role="listbox" aria-label={shared.nav.goTo}>
              {pageTitles.map((label, i) => (
                <li key={label} role="option" aria-selected={i === current}>
                  <button
                    type="button"
                    className={`page-menu-item${i === current ? ' active' : ''}`}
                    onClick={() => goTo(i)}
                  >
                    <span className="page-menu-num">{i + 1}</span>
                    <span className="page-menu-text">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="title">{shared.topbarTitle}</div>
        <button
          type="button"
          ref={statusRef}
          className="page-status"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          title={shared.nav.goTo}
        >
          {shared.pageStatus(current + 1, total)}
        </button>
        <div className="spacer" />

        <button
          className="icon-btn"
          aria-pressed={thumbsOpen}
          onClick={() => setThumbsOpen((v) => !v)}
          title={shared.nav.thumbnails}
          aria-label={shared.nav.thumbnails}
        >
          ▦
        </button>
        <button className="icon-btn" onClick={toggleFullscreen} title={shared.nav.fullscreen} aria-label={shared.nav.fullscreen}>
          ⛶
        </button>
      </header>

      <main id="main-content" className="stage" aria-label={shared.topbarTitle} tabIndex={-1}>
        <Book ref={bookRef} mode={mode} onState={onState} />
      </main>

      <div className={`thumbs${thumbsOpen ? ' open' : ''}`} aria-label={shared.nav.thumbnails}>
        {pageTitles.map((label, i) => (
          <button
            key={label}
            className={`thumb-btn${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            title={`${i + 1}. ${label}`}
            aria-label={`${i + 1}. ${label}`}
          >
            <span className="thumb-num">{i + 1}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <footer className="toolbar">
        <button className="nav-btn" onClick={() => bookRef.current?.first()} disabled={atFirst} title={shared.nav.first} aria-label={shared.nav.first}>
          ⏮
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.prev()} disabled={atFirst} title={shared.nav.prev} aria-label={shared.nav.prev}>
          ‹
        </button>
        <div className="divider" />
        <button className="nav-btn" onClick={() => bookRef.current?.next()} disabled={atLast} title={shared.nav.next} aria-label={shared.nav.next}>
          ›
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.last()} disabled={atLast} title={shared.nav.last} aria-label={shared.nav.last}>
          ⏭
        </button>
      </footer>

      <AccessibilityWidget />
    </div>
  )
}
