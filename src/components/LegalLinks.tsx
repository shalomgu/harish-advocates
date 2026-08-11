import { useState } from 'react'
import { legalLinks } from '../content/pages'
import IframePopup from './IframePopup'

interface LegalLinksProps {
  /** Extra modifier class for context-specific spacing/colors. */
  className?: string
}

/** In-app popup for standalone legal HTML pages (privacy, terms, a11y). */
export function LegalPopup({ title, src, onClose }: { title: string; src: string; onClose: () => void }) {
  return <IframePopup title={title} src={src} onClose={onClose} closeMessage="legal-popup-close" />
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
