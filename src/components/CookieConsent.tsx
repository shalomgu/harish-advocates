import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cookieConsent } from '../content/pages'
import { useFocusTrap } from '../lib/useFocusTrap'
import { LegalPopup } from './LegalLinks'

/**
 * First-visit cookie notice. It blocks interaction until the visitor confirms,
 * and the privacy link opens the policy in the shared in-app popup.
 */
export default function CookieConsent({ onAccept }: { onAccept: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [policyOpen, setPolicyOpen] = useState(false)
  useFocusTrap(!policyOpen, dialogRef)

  return createPortal(
    <>
      <div className={`cookie-consent-overlay${policyOpen ? ' is-behind' : ''}`}>
        <div
          ref={dialogRef}
          className="cookie-consent"
          role="alertdialog"
          aria-modal="true"
          aria-label={cookieConsent.ariaLabel}
        >
          <p className="cookie-consent-text">
            {cookieConsent.before}
            <button
              type="button"
              className="cookie-consent-link"
              onClick={() => setPolicyOpen(true)}
            >
              {cookieConsent.policyLabel}
            </button>
            {cookieConsent.after}
          </p>
          <button type="button" className="cookie-consent-accept" onClick={onAccept}>
            {cookieConsent.accept}
          </button>
        </div>
      </div>

      {policyOpen && (
        <LegalPopup
          title={cookieConsent.policyLabel}
          src={cookieConsent.policyHref}
          onClose={() => setPolicyOpen(false)}
        />
      )}
    </>,
    document.body,
  )
}
