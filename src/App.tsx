import { useCallback, useEffect, useRef, useState } from 'react'
import Book, { type BookHandle, type RtlMode } from './components/Book'
import { shared } from './content/shared'
import { pageTitles } from './content/pages'

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

  return (
    <div className="app">
      <header className="topbar">
        <div className="title">{shared.topbarTitle}</div>
        <div className="page-status">{shared.pageStatus(current + 1, total)}</div>
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

      <main className="stage">
        <Book ref={bookRef} mode={mode} onState={onState} />
      </main>

      <div className={`thumbs${thumbsOpen ? ' open' : ''}`} aria-label={shared.nav.thumbnails}>
        {pageTitles.map((label, i) => (
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
        <button className="nav-btn" onClick={() => bookRef.current?.first()} disabled={atFirst} title={shared.nav.first} aria-label={shared.nav.first}>
          ⏮
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.prev()} disabled={atFirst} title={shared.nav.prev} aria-label={shared.nav.prev}>
          ›
        </button>
        <div className="divider" />
        <button className="nav-btn" onClick={() => bookRef.current?.next()} disabled={atLast} title={shared.nav.next} aria-label={shared.nav.next}>
          ‹
        </button>
        <button className="nav-btn" onClick={() => bookRef.current?.last()} disabled={atLast} title={shared.nav.last} aria-label={shared.nav.last}>
          ⏭
        </button>
      </footer>
    </div>
  )
}
