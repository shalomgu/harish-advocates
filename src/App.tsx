import { useCallback, useEffect, useRef, useState } from 'react'
import Book, { type BookHandle } from './components/Book'
import { useLocale } from './content/locale'
import { localeMeta, locales } from './content/shared'
import { pageTitles } from './content/pages'

export default function App() {
  const bookRef = useRef<BookHandle>(null)
  const { locale, setLocale, chrome } = useLocale()
  const mode = localeMeta[locale].mode
  const titles = pageTitles[locale]
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(titles.length)
  const [thumbsOpen, setThumbsOpen] = useState(false)

  const onState = useCallback((cur: number, tot: number) => {
    setCurrent(cur)
    if (tot) setTotal(tot)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setThumbsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
      <header className="topbar">
        <div className="title">{chrome.topbarTitle}</div>
        <div className="page-status">{chrome.pageStatus(current + 1, total)}</div>
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

      <main className="stage">
        <Book ref={bookRef} locale={locale} mode={mode} onState={onState} />
      </main>

      <div className={`thumbs${thumbsOpen ? ' open' : ''}`} aria-label={chrome.nav.thumbnails}>
        {titles.map((label, i) => (
          <button
            key={label}
            className={`thumb-btn${i === current ? ' active' : ''}`}
            onClick={() => {
              bookRef.current?.flip(i)
              setThumbsOpen(false)
            }}
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
        <button className="nav-btn" onClick={() => bookRef.current?.prev()} disabled={atFirst} title={chrome.nav.prev} aria-label={chrome.nav.prev}>
          {prevGlyph}
        </button>
        <div className="divider" />
        <button className="nav-btn" onClick={() => bookRef.current?.next()} disabled={atLast} title={chrome.nav.next} aria-label={chrome.nav.next}>
          {nextGlyph}
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.last()} disabled={atLast} title={chrome.nav.last} aria-label={chrome.nav.last}>
          ⏭
        </button>
      </footer>
    </div>
  )
}
