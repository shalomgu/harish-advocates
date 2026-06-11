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

import { A11Y_MOTION_EVENT, motionDisabled } from '../lib/a11y'
import CoverPage from '../pages/CoverPage'
import AboutPage from '../pages/AboutPage'
import LiorPage from '../pages/LiorPage'
import IrisPage from '../pages/IrisPage'
import PracticePage from '../pages/PracticePage'
import InfoVideosPage from '../pages/InfoVideosPage'
import ArticlesPage from '../pages/ArticlesPage'
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
  turnToPage: (page: number) => void
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
// Printed-page proportions used for the two-page spread.
const DESIGN_RATIO = 460 / 650

const Book = forwardRef<BookHandle, BookProps>(function Book({ mode, onState }, ref) {
  const flipRef = useRef<FlipInstance | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const startPageRef = useRef(0)
  const [dims, setDims] = useState({ pageW: 420, pageH: 594, spread: false })
  const [reduceMotion, setReduceMotion] = useState(motionDisabled)

  // Track motion preference from both the OS setting and the accessibility
  // widget so the flip animation can be effectively disabled.
  useEffect(() => {
    const sync = () => setReduceMotion(motionDisabled())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener?.('change', sync)
    window.addEventListener(A11Y_MOTION_EVENT, sync)
    return () => {
      mq.removeEventListener?.('change', sync)
      window.removeEventListener(A11Y_MOTION_EVENT, sync)
    }
  }, [])

  // Size the book to fit the available stage area (minus margins) so it stays
  // clear of the top bar and bottom toolbar. stretch mode derives height from the
  // full container width and ignores maxHeight, which overflows; computing an
  // exact fit avoids that.
  const measure = useCallback(() => {
    const stage = wrapRef.current?.parentElement
    if (!stage) return
    const availW = Math.max(260, stage.clientWidth)
    const availH = Math.max(340, stage.clientHeight)
    const spread = availW >= 720
    let pageW: number
    let pageH: number
    if (spread) {
      // Spread keeps the printed-page proportions. Extra outer margin so the
      // parent is strictly wider than 2*pageWidth (page-flip treats parent
      // <= 2*pageWidth as portrait).
      pageH = Math.floor(Math.min(availH, (availW - SPREAD_GAP) / 2 / DESIGN_RATIO))
      pageW = Math.floor(pageH * DESIGN_RATIO)
    } else {
      // Single page fills the entire stage (the band between the top bar and
      // bottom toolbar) so there are no side or top/bottom gutters.
      pageW = Math.floor(availW)
      pageH = Math.floor(availH)
    }
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

  // StPageFlip's flip calls (flipPrev/flip-to-index in particular) can silently
  // no-op while disableFlipByClick is true, which is the case in mirror mode.
  // Every programmatic flip must briefly clear the flag for the (synchronous)
  // call, then restore it, so all nav buttons work regardless of mode.
  const runFlip = useCallback(
    (action: (flip: PageFlipApi) => void) => {
      const flip = api()
      if (!flip) return
      const settings = flip.getSettings()
      const previous = settings.disableFlipByClick
      settings.disableFlipByClick = false
      action(flip)
      settings.disableFlipByClick = previous
    },
    [api],
  )

  const next = useCallback(() => {
    runFlip((flip) => {
      if (flip.getCurrentPageIndex() >= flip.getPageCount() - 1) return
      flip.flipNext('top')
    })
  }, [runFlip])

  const prev = useCallback(() => {
    runFlip((flip) => {
      if (flip.getCurrentPageIndex() <= 0) return
      flip.flipPrev('top')
    })
  }, [runFlip])

  // Direct jumps (first/last/menu) use turnToPage: the animated flip() can
  // silently no-op or land mid-flight when the target is not adjacent — most
  // visibly in mirror mode — so an instant, reliable turn is used instead.
  const first = useCallback(() => runFlip((flip) => flip.turnToPage(0)), [runFlip])
  const last = useCallback(() => runFlip((flip) => flip.turnToPage(flip.getPageCount() - 1)), [runFlip])
  const flipTo = useCallback((index: number) => runFlip((flip) => flip.turnToPage(index)), [runFlip])

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
  const touchStart = useRef<{ x: number; y: number; carousel: HTMLElement | null; scrollLeft: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    if (mode !== 'mirror') return
    const t = e.touches[0]
    // If the swipe begins inside a horizontal carousel, remember it and its scroll
    // position so we can let the carousel scroll first and only page at its edge.
    const carousel = (e.target as HTMLElement | null)?.closest<HTMLElement>('.video-grid, .article-grid') ?? null
    touchStart.current = { x: t.clientX, y: t.clientY, carousel, scrollLeft: carousel?.scrollLeft ?? 0 }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (mode !== 'mirror' || !touchStart.current) return
    const { x, y, carousel, scrollLeft } = touchStart.current
    const t = e.changedTouches[0]
    const dx = t.clientX - x
    const dy = t.clientY - y
    touchStart.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return
    // The carousel scrolls 1:1 with the finger while it has room, so a changed
    // scrollLeft means the gesture was a carousel scroll, not a page flip.
    if (carousel && carousel.scrollLeft !== scrollLeft) return
    // Swiping left-to-right advances (next), right-to-left goes back.
    if (dx > 0) next()
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

  const total = 10
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
    // Near-instant turn when motion is reduced (0 can wedge the engine).
    flippingTime: reduceMotion ? 1 : 650,
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
          key={`${mode}-${dims.spread ? 'L' : 'P'}-${dims.pageW}x${dims.pageH}-${reduceMotion ? 'rm' : 'm'}`}
          ref={flipRef}
          {...settings}
          onInit={handleInit}
          onFlip={handleFlip}
        >
          <CoverPage />
          <AboutPage />
          <LiorPage />
          <IrisPage />
          <PracticePage />
          <InfoVideosPage />
          <ArticlesPage />
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
