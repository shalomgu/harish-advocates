import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../lib/useFocusTrap'

export interface IframePopupProps {
  title: string
  src: string
  onClose: () => void
  /** Optional modifier on .iframe-popup-stage (e.g. compact newsletter sizing). */
  stageClassName?: string
  /**
   * Optional iframe sandbox token list. Omit for full iframe privileges (legal
   * HTML pages). For third-party forms (Brevo), pass a list that allows the
   * form to run but blocks top-level navigation out of the site.
   */
  sandbox?: string
  /** postMessage payload from the iframe that should close the popup. */
  closeMessage?: string
}

/** Full-screen lightbox that hosts an iframe (legal pages, Brevo form, etc.). */
export default function IframePopup({
  title,
  src,
  onClose,
  stageClassName = '',
  sandbox,
  closeMessage,
}: IframePopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onMessage = (e: MessageEvent) => {
      if (closeMessage && e.data === closeMessage) onClose()
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('message', onMessage)
    }
  }, [onClose, closeMessage])

  return createPortal(
    <div
      ref={dialogRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <button
        className="media-lightbox-close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="סגירה"
      >
        ×
      </button>
      <div
        className={`iframe-popup-stage${stageClassName ? ` ${stageClassName}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="iframe-popup-frame"
          src={src}
          title={title}
          sandbox={sandbox}
          // Brevo may open confirmation / thank-you links; keep them in the frame.
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>,
    document.body,
  )
}
