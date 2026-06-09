import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { legalLinks } from '../content/pages'
import { useFocusTrap } from '../lib/useFocusTrap'

interface LegalLinksProps {
  /** Extra modifier class for context-specific spacing/colors. */
  className?: string
}

export function LegalPopup({ title, src, onClose }: { title: string; src: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    // The iframed pages post this when their "back to site" link is clicked.
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'legal-popup-close') onClose()
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('message', onMessage)
    }
  }, [onClose])

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
      <div className="legal-stage" onClick={(e) => e.stopPropagation()}>
        <iframe className="legal-frame" src={src} title={title} />
      </div>
    </div>,
    document.body,
  )
}

/** Compact row of legal/utility links that open in an in-app popup. */
export default function LegalLinks({ className = '' }: LegalLinksProps) {
  const [active, setActive] = useState<{ label: string; href: string } | null>(null)

  return (
    <>
      <nav className={`legal-links${className ? ` ${className}` : ''}`} aria-label="קישורים משפטיים">
        {legalLinks.map((link, i) => (
          <span key={link.href} className="legal-links-item">
            <button type="button" className="legal-links-btn" onClick={() => setActive(link)}>
              {link.label}
            </button>
            {i < legalLinks.length - 1 && (
              <span className="legal-links-sep" aria-hidden="true">
                •
              </span>
            )}
          </span>
        ))}
      </nav>

      {active && <LegalPopup title={active.label} src={active.href} onClose={() => setActive(null)} />}
    </>
  )
}
