import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { shared } from '../content/shared'
import { motionDisabled } from '../lib/a11y'

// Matches the CSS mobile breakpoint; below it the clip simply plays centred,
// above it the clip opens toward the right of the cover.
const MOBILE_MAX = 720
const MORPH_MS = 520
// Portrait clip: width / height.
const VIDEO_RATIO = 9 / 16

type Phase = 'opening' | 'open' | 'closing'

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Final resting box for the clip. Desktop opens it to the right of the cover;
 * mobile centres it. A 9:16 box keeps the portrait video un-cropped.
 */
function computeTargetRect(): Rect {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mobile = vw <= MOBILE_MAX

  if (mobile) {
    let h = vh * 0.82
    let w = h * VIDEO_RATIO
    const maxW = vw * 0.92
    if (w > maxW) {
      w = maxW
      h = w / VIDEO_RATIO
    }
    return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
  }

  const marginX = Math.max(28, vw * 0.035)
  const marginY = 40
  let h = vh - marginY * 2
  let w = h * VIDEO_RATIO
  const maxW = vw * 0.46
  if (w > maxW) {
    w = maxW
    h = w / VIDEO_RATIO
  }
  // Right-aligned: the clip slides out to the right of the centred cover.
  return { x: vw - marginX - w, y: (vh - h) / 2, w, h }
}

export default function IntroVideo({
  src,
  originRef,
  onClose,
}: {
  src: string
  originRef: RefObject<HTMLElement | null>
  onClose: () => void
}) {
  const intro = shared.intro
  const reduce = motionDisabled()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [target] = useState(computeTargetRect)
  const [phase, setPhase] = useState<Phase>(reduce ? 'open' : 'opening')
  const [muted, setMuted] = useState(false)
  const doneRef = useRef(false)

  const close = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    videoRef.current?.pause()
    if (reduce) {
      onClose()
      return
    }
    setPhase('closing')
    // Fallback in case the transition end event is missed (e.g. tab blur).
    window.setTimeout(onClose, MORPH_MS + 120)
  }, [onClose, reduce])

  // Kick off playback. Browsers block sound on the first autoplay, so fall back
  // to a muted start and surface a "tap for sound" control.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {
      v.muted = true
      setMuted(true)
      v.play().catch(() => {})
    })
  }, [])

  // Animate from the portrait box to the resting box on the next frame.
  useEffect(() => {
    if (reduce) return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase('open'))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [reduce])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [close])

  const unmute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    setMuted(false)
    void v.play().catch(() => {})
  }

  const stageStyle = (): CSSProperties => {
    if (phase === 'open') {
      return { left: target.x, top: target.y, width: target.w, height: target.h, borderRadius: 16 }
    }
    // Opening (first paint) and closing both sit on the live portrait box so the
    // clip appears to grow out of / shrink back into Lior's photo.
    const o = originRef.current?.getBoundingClientRect()
    if (!o) {
      return { left: target.x, top: target.y, width: target.w, height: target.h, borderRadius: 16, opacity: 0 }
    }
    return { left: o.left, top: o.top, width: o.width, height: o.height, borderRadius: '50%' }
  }

  return createPortal(
    <div
      className={`intro-overlay${phase === 'open' ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={intro.replay}
      onClick={close}
    >
      <div
        className="intro-stage"
        style={stageStyle()}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          if (phase === 'closing' && e.propertyName === 'width') onClose()
        }}
      >
        <video
          ref={videoRef}
          src={src}
          playsInline
          autoPlay
          onEnded={close}
        />
        {muted && (
          <button type="button" className="intro-unmute" onClick={unmute}>
            <span aria-hidden="true">🔊</span>
            {intro.unmute}
          </button>
        )}
        <button type="button" className="intro-close" onClick={(e) => { e.stopPropagation(); close() }} aria-label={intro.close}>
          ×
        </button>
      </div>
    </div>,
    document.body,
  )
}
