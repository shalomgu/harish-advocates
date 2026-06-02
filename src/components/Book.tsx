import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import HTMLFlipBook from 'react-pageflip'

import CoverPage from '../pages/CoverPage'
import AboutPage from '../pages/AboutPage'
import TeamPage from '../pages/TeamPage'
import PracticePage from '../pages/PracticePage'
import TipsPage from '../pages/TipsPage'
import MediaPage from '../pages/MediaPage'
import ContactPage from '../pages/ContactPage'
import BackCoverPage from '../pages/BackCoverPage'
import { shared } from '../content/shared'

export type RtlMode = 'mirror' | 'native'

export interface BookHandle {
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  flip: (index: number) => void
}

interface PageFlipApi {
  flipNext: (corner?: 'top' | 'bottom') => void
  flipPrev: (corner?: 'top' | 'bottom') => void
  flip: (page: number, corner?: 'top' | 'bottom') => void
  getCurrentPageIndex: () => number
  getPageCount: () => number
  getSettings: () => { disableFlipByClick: boolean }
}

interface FlipInstance {
  pageFlip: () => PageFlipApi | undefined
}

interface BookProps {
  mode: RtlMode
  onState: (current: number, total: number) => void
}

const SWIPE_THRESHOLD = 50

const Book = forwardRef<BookHandle, BookProps>(function Book({ mode, onState }, ref) {
  const flipRef = useRef<FlipInstance | null>(null)
  const [current, setCurrent] = useState(0)
  const startPageRef = useRef(0)

  const api = useCallback(() => flipRef.current?.pageFlip(), [])

  const next = useCallback(() => {
    api()?.flipNext('top')
  }, [api])

  const prev = useCallback(() => {
    const flip = api()
    if (!flip || flip.getCurrentPageIndex() <= 0) return
    // StPageFlip's flipPrev() can no-op while disableFlipByClick is true, so we
    // briefly clear the flag for the (synchronous) call, then restore it.
    const settings = flip.getSettings()
    const previous = settings.disableFlipByClick
    settings.disableFlipByClick = false
    flip.flipPrev('top')
    settings.disableFlipByClick = previous
  }, [api])

  const first = useCallback(() => api()?.flip(0), [api])
  const last = useCallback(() => {
    const flip = api()
    if (flip) flip.flip(flip.getPageCount() - 1)
  }, [api])
  const flipTo = useCallback(
    (index: number) => {
      api()?.flip(index)
    },
    [api],
  )

  useImperativeHandle(ref, () => ({ next, prev, first, last, flip: flipTo }), [next, prev, first, last, flipTo])

  const handleInit = useCallback(() => {
    const flip = api()
    if (!flip) return
    const total = flip.getPageCount()
    const idx = flip.getCurrentPageIndex()
    setCurrent(idx)
    onState(idx, total)
  }, [api, onState])

  const handleFlip = useCallback(
    (event: { data: number }) => {
      const flip = api()
      const total = flip ? flip.getPageCount() : 0
      startPageRef.current = event.data
      setCurrent(event.data)
      onState(event.data, total)
    },
    [api, onState],
  )

  // Lightweight horizontal swipe for mirror mode (native mode has its own).
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    if (mode !== 'mirror') return
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (mode !== 'mirror' || !touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return
    // RTL: swiping leftwards advances (next), rightwards goes back.
    if (dx < 0) next()
    else prev()
  }

  // Keyboard arrows: in RTL the LEFT key advances.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') next()
      else if (e.key === 'ArrowRight') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const total = 8
  const atFirst = current <= 0
  const atLast = current >= total - 1

  const settings = {
    width: 460,
    height: 650,
    size: 'stretch' as const,
    minWidth: 300,
    maxWidth: 920,
    minHeight: 420,
    maxHeight: 720,
    drawShadow: true,
    flippingTime: 650,
    usePortrait: true,
    startZIndex: 1,
    autoSize: true,
    maxShadowOpacity: 0.28,
    showCover: true,
    mobileScrollSupport: true,
    swipeDistance: 30,
    clickEventForward: true,
    startPage: startPageRef.current,
    // Mirror mode: engine does no pointer handling; we drive flips ourselves.
    useMouseEvents: mode === 'native',
    showPageCorners: mode === 'native',
    disableFlipByClick: mode === 'mirror',
    className: 'flip-root',
    style: {} as CSSProperties,
  }

  return (
    <>
      <div
        className={`book-wrap${mode === 'mirror' ? ' book--mirror' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* key forces a clean re-init when the RTL strategy changes */}
        <HTMLFlipBook key={mode} ref={flipRef} {...settings} onInit={handleInit} onFlip={handleFlip}>
          <CoverPage />
          <AboutPage />
          <TeamPage />
          <PracticePage />
          <TipsPage />
          <MediaPage />
          <ContactPage />
          <BackCoverPage />
        </HTMLFlipBook>
      </div>

      <button
        className="side-arrow forward"
        onClick={next}
        disabled={atLast}
        aria-label={shared.nav.next}
        title={shared.nav.next}
      >
        ‹
      </button>
      <button
        className="side-arrow back"
        onClick={prev}
        disabled={atFirst}
        aria-label={shared.nav.prev}
        title={shared.nav.prev}
      >
        ›
      </button>
    </>
  )
})

export default Book
