import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { contact } from '../content/pages'
import { useFocusTrap } from '../lib/useFocusTrap'

type Status = 'idle' | 'loading' | 'success' | 'error'

type BrevoAjaxResponse = {
  success?: boolean
  message?: string
  redirect?: string
  errors?: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Israeli national number: mobile 5X… or landline area 2–4/8–9 + 7 digits. */
const IL_NATIONAL_RE = /^(?:5\d|[2-489])\d{7}$/
const IL_COUNTRY_CODE = '+972'

function digitsOnly(raw: string): string {
  return raw.trim().replace(/\D/g, '')
}

/** National number for Brevo SMS field (no country code, no leading 0). */
function toBrevoSmsNumber(raw: string): string | null {
  let digits = digitsOnly(raw)
  if (digits.startsWith('972')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return IL_NATIONAL_RE.test(digits) ? digits : null
}

/**
 * In-app Brevo subscribe popup.
 *
 * We POST with `?isAjax=1` ourselves and never load Brevo's main.js — that
 * script calls `window.top.location.replace(redirect)` on double-opt-in, which
 * kicks the user out of the flipbook to sibforms.com.
 */
export default function NewsletterPopup({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { newsletter } = contact
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  useFocusTrap(true, dialogRef)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    const form = e.currentTarget
    const data = new FormData(form)
    const email = data.get('EMAIL')
    const phoneRaw = data.get('SMS')
    const consented = data.get('CONSENT') === '1'

    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      setStatus('error')
      setMessage(newsletter.invalidEmail)
      return
    }

    const smsNumber =
      typeof phoneRaw === 'string' ? toBrevoSmsNumber(phoneRaw) : null
    if (!smsNumber) {
      setStatus('error')
      setMessage(newsletter.invalidPhone)
      return
    }

    if (!consented) {
      setStatus('error')
      setMessage(newsletter.consentRequired)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const body = new FormData(form)
      // Brevo SMS field expects country code + national number separately.
      body.set('SMS__COUNTRY_CODE', IL_COUNTRY_CODE)
      body.set('SMS', smsNumber)
      body.delete('CONSENT')

      const action = newsletter.formAction
      const url = `${action}${action.includes('?') ? '&' : '?'}isAjax=1`
      const res = await fetch(url, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      const text = await res.text()
      let parsed: BrevoAjaxResponse = {}
      try {
        parsed = text ? (JSON.parse(text) as BrevoAjaxResponse) : {}
      } catch {
        // Non-JSON body — treat HTTP ok as success (DOI often still redirects in HTML).
        if (res.ok) {
          setStatus('success')
          setMessage(newsletter.success)
          return
        }
        setStatus('error')
        setMessage(newsletter.error)
        return
      }

      if (parsed.success) {
        // Ignore data.redirect — that is Brevo's DOI confirmation page.
        setStatus('success')
        setMessage(newsletter.success)
        return
      }

      const fieldError = parsed.errors && Object.values(parsed.errors)[0]
      const serverMessage = fieldError || parsed.message?.trim()
      setStatus('error')
      setMessage(serverMessage || newsletter.error)
    } catch {
      setStatus('error')
      setMessage(newsletter.networkError)
    }
  }

  return createPortal(
    <div
      ref={dialogRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={newsletter.popupTitle}
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
        className="iframe-popup-stage iframe-popup-stage--newsletter newsletter-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'error' && (
          <div className="newsletter-flash newsletter-flash--error" role="alert">
            {message || newsletter.error}
          </div>
        )}
        {status === 'success' && (
          <div className="newsletter-flash newsletter-flash--success" role="status">
            {message || newsletter.success}
          </div>
        )}

        {status !== 'success' && (
          <form id="sib-form" method="POST" action={newsletter.formAction} onSubmit={onSubmit} noValidate>
            <div className="newsletter-block">
              <h3 className="newsletter-heading">{newsletter.heading}</h3>
              <p className="newsletter-intro">{newsletter.intro}</p>
            </div>

            <div className="newsletter-block">
              <label className="newsletter-label" htmlFor="EMAIL">
                {newsletter.emailLabel}
              </label>
              <div className="newsletter-field">
                <input
                  className="newsletter-input"
                  type="email"
                  id="EMAIL"
                  name="EMAIL"
                  autoComplete="email"
                  placeholder={newsletter.emailPlaceholder}
                  required
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <div className="newsletter-block">
              <label className="newsletter-label" htmlFor="SMS">
                {newsletter.phoneLabel}
              </label>
              <div className="newsletter-field">
                <input
                  className="newsletter-input"
                  type="tel"
                  id="SMS"
                  name="SMS"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={newsletter.phonePlaceholder}
                  required
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <div className="newsletter-block">
              <label className="newsletter-consent">
                <input
                  type="checkbox"
                  name="CONSENT"
                  value="1"
                  required
                  disabled={status === 'loading'}
                />
                <span>{newsletter.consentLabel}</span>
              </label>
            </div>

            <div className="newsletter-block">
              <button
                className="newsletter-submit"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '...' : newsletter.submit}
              </button>
            </div>

            {/* Brevo honeypot — leave empty */}
            <input
              type="text"
              name="email_address_check"
              defaultValue=""
              className="newsletter-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input type="hidden" name="locale" value="he" />
            <input type="hidden" name="SMS__COUNTRY_CODE" value={IL_COUNTRY_CODE} />
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
