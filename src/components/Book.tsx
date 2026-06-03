import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
const SPREAD_GAP = 16

const Book = forwardRef<BookHandle, BookProps>(function Book({ mode, onState }, ref) {
  const flipRef = useRef<FlipInstance | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const startPageRef = useRef(0)
  const [dims, setDims] = useState({ pageW: 420, pageH: 594, spread: false })

  // Size the book to fit the available stage area (minus margins) so it stays
  // clear of the top bar and bottom toolbar. stretch mode derives height from the
  // full container width and ignores maxHeight, which overflows; computing an
  // exact fit avoids that.
  const measure = useCallback(() => {
    const stage = wrapRef.current?.parentElement
    if (!stage) return
    const availW = Math.max(260, stage.clientWidth - 40)
    const availH = Math.max(340, stage.clientHeight - 28)
    const ratio = 460 / 650
    const spread = availW >= 720
    // Extra outer margin so the spread parent is strictly wider than 2*pageWidth
    // (page-flip treats parent <= 2*pageWidth as portrait).
    const gap = spread ? SPREAD_GAP : 0
    const maxPageH = spread ? (availW - gap) / 2 / ratio : availW / ratio
    const pageH = Math.floor(Math.min(availH, maxPageH))
    const pageW = Math.floor(pageH * ratio)
    setDims((d) => (d.pageW === pageW && d.pageH === pageH && d.spread === spread ? d : { pageW, pageH, spread }))
  }, [])

  useLayoutEffect(() => {
    measure()
    const stage = wrapRef.current?.parentElement
    const ro = new ResizeObserver(measure)
    if (stage) ro.observe(stage)
    return () => ro.disconnect()
  }, [measure])

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
    width: dims.pageW,
    height: dims.pageH,
    size: 'fixed' as const,
    minWidth: 120,
    maxWidth: 2000,
    minHeight: 160,
    maxHeight: 2000,
    drawShadow: true,
    flippingTime: 650,
    // Force landscape for the spread; allow portrait only for single-page sizing.
    usePortrait: !dims.spread,
    startZIndex: 1,
    autoSize: false,
    maxShadowOpacity: 0.28,
    showCover: true,
    mobileScrollSupport: true,
    swipeDistance: 30,
    clickEventForward: true,
    startPage: startPageRef.current,
    // Native mode: let the engine handle pointer/corner peel directly.
    // Mirror mode: the CSS mirror makes the engine's corner detection land on the
    // wrong side, so we disable engine pointer handling and drive flips via the
    // side arrows, keyboard, and swipe instead.
    useMouseEvents: mode === 'native',
    showPageCorners: mode === 'native',
    disableFlipByClick: mode === 'mirror',
    className: 'flip-root',
    style: {} as CSSProperties,
  }

  const wrapStyle: CSSProperties = {
    width: dims.spread ? dims.pageW * 2 + SPREAD_GAP : dims.pageW,
    height: dims.pageH,
  }

  return (
    <>
      <div
        ref={wrapRef}
        className={`book-wrap${mode === 'mirror' ? ' book--mirror' : ''}`}
        style={wrapStyle}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* key forces a clean re-init when strategy or computed size changes */}
        <HTMLFlipBook
          key={`${mode}-${dims.spread ? 'L' : 'P'}-${dims.pageW}x${dims.pageH}`}
          ref={flipRef}
          {...settings}
          onInit={handleInit}
          onFlip={handleFlip}
        >
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
