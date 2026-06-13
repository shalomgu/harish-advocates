import { useCallback, useEffect, useRef, useState } from 'react'
import Book, { type BookHandle, type RtlMode } from './components/Book'
import AccessibilityWidget from './components/AccessibilityWidget'
import { shared } from './content/shared'
import { pageTitles } from './content/pages'

export default function App() {
  const bookRef = useRef<BookHandle>(null)
  const { locale, setLocale, chrome } = useLocale()
  const mode = localeMeta[locale].mode
  const titles = pageTitles[locale]
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(titles.length)
  const [thumbsOpen, setThumbsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLButtonElement>(null)

  const onState = useCallback((cur: number, tot: number) => {
    setCurrent(cur)
    if (tot) setTotal(tot)
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

  // Chevron direction follows reading direction: in RTL "previous" points right.
  const isRtl = localeMeta[locale].dir === 'rtl'
  const prevGlyph = isRtl ? '›' : '‹'
  const nextGlyph = isRtl ? '‹' : '›'

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

        <div className="lang-switch" role="group" aria-label={chrome.language.label}>
          {locales.map((code) => (
            <button
              key={code}
              className={`lang-btn${code === locale ? ' active' : ''}`}
              aria-pressed={code === locale}
              onClick={() => setLocale(code)}
              title={localeMeta[code].label}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          className="icon-btn"
          aria-pressed={thumbsOpen}
          onClick={() => setThumbsOpen((v) => !v)}
          title={chrome.nav.thumbnails}
          aria-label={chrome.nav.thumbnails}
        >
          ▦
        </button>
        <button className="icon-btn" onClick={toggleFullscreen} title={chrome.nav.fullscreen} aria-label={chrome.nav.fullscreen}>
          ⛶
        </button>
      </header>

      <main id="main-content" className="stage" aria-label={shared.topbarTitle} tabIndex={-1}>
        <Book ref={bookRef} mode={mode} onState={onState} />
      </main>

      <div className={`thumbs${thumbsOpen ? ' open' : ''}`} aria-label={chrome.nav.thumbnails}>
        {titles.map((label, i) => (
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
        <button className="nav-btn" onClick={() => bookRef.current?.first()} disabled={atFirst} title={chrome.nav.first} aria-label={chrome.nav.first}>
          ⏮
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.prev()} disabled={atFirst} title={shared.nav.prev} aria-label={shared.nav.prev}>
          ‹
        </button>
        <div className="divider" />
        <button className="nav-btn" onClick={() => bookRef.current?.next()} disabled={atLast} title={shared.nav.next} aria-label={shared.nav.next}>
          ›
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.last()} disabled={atLast} title={chrome.nav.last} aria-label={chrome.nav.last}>
          ⏭
        </button>
      </footer>

      <AccessibilityWidget />
    </div>
  )
}
