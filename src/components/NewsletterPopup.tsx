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
    const email = new FormData(form).get('EMAIL')
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error')
      setMessage(newsletter.invalidEmail)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const body = new FormData(form)
      const action = newsletter.formAction
      const url = `${action}${action.includes('?') ? '&' : '?'}isAjax=1`
      const res = await fetch(url, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      const text = await res.text()
      let data: BrevoAjaxResponse = {}
      try {
        data = text ? (JSON.parse(text) as BrevoAjaxResponse) : {}
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

      if (data.success) {
        // Ignore data.redirect — that is Brevo's DOI confirmation page.
        setStatus('success')
        setMessage(newsletter.success)
        return
      }

      const fieldError = data.errors && Object.values(data.errors)[0]
      const serverMessage = fieldError || data.message?.trim()
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
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
