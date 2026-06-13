import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LegalPopup } from './LegalLinks'
import { useLocale } from '../content/locale'
import {
  A11Y_MOTION_EVENT,
  DEFAULT_PREFS,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  applyPrefs,
  loadPrefs,
  savePrefs,
  type A11yPrefs,
} from '../lib/a11y'

const statementHref = `${import.meta.env.BASE_URL}accessibility.html`

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function round(n: number): number {
  return Math.round(n * 10) / 10
}

/** A single on/off accessibility option rendered as a pressed-state button. */
function ToggleRow({
  label,
  icon,
  active,
  onToggle,
}: {
  label: string
  icon: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={`a11y-option${active ? ' is-active' : ''}`}
      aria-pressed={active}
      onClick={onToggle}
    >
      <span className="a11y-option-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="a11y-option-label">{label}</span>
    </button>
  )
}

export default function AccessibilityWidget() {
  const { a11y } = useLocale().chrome
  const [open, setOpen] = useState(false)
  const [statementOpen, setStatementOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(loadPrefs)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  // Apply + persist whenever preferences change.
  useEffect(() => {
    applyPrefs(prefs)
    savePrefs(prefs)
    window.dispatchEvent(new CustomEvent(A11Y_MOTION_EVENT))
  }, [prefs])

  const toggle = useCallback(
    (key: keyof A11yPrefs) => {
      setPrefs((p) => ({ ...p, [key]: !p[key] }))
    },
    [],
  )

  const changeFont = useCallback((delta: number) => {
    setPrefs((p) => ({
      ...p,
      fontScale: round(Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, p.fontScale + delta))),
    }))
  }, [])

  const reset = useCallback(() => setPrefs({ ...DEFAULT_PREFS }), [])

  // Open/close side effects: focus the panel, trap Tab, Escape to close, and
  // restore focus to the trigger when the panel closes.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const first = panel.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open])

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const atMinFont = prefs.fontScale <= FONT_SCALE_MIN
  const atMaxFont = prefs.fontScale >= FONT_SCALE_MAX
  const fontPercent = Math.round(prefs.fontScale * 100)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="a11y-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={a11y.open}
        title={a11y.open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="3.6" r="2" />
          <path d="M21 6.5a1 1 0 0 1-.7 1.22l-5.3 1.4V13l1.9 6.1a1 1 0 1 1-1.9.6L13 14.2h-2l-1.99 5.5a1 1 0 1 1-1.9-.6L9 13V9.12l-5.3-1.4A1 1 0 0 1 4.2 5.8l5.55 1.47a8 8 0 0 0 4.5 0L19.8 5.8A1 1 0 0 1 21 6.5z" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="a11y-overlay" onClick={close}>
            <div
              ref={panelRef}
              className="a11y-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="a11y-panel-head">
                <h2 id={titleId}>{a11y.title}</h2>
                <button type="button" className="a11y-close" aria-label={a11y.close} onClick={close}>
                  ×
                </button>
              </header>

              <div className="a11y-panel-body">
                <div className="a11y-font" role="group" aria-label={a11y.fontSize}>
                  <span className="a11y-font-label">{a11y.fontSize}</span>
                  <div className="a11y-font-controls">
                    <button
                      type="button"
                      className="a11y-font-btn"
                      onClick={() => changeFont(-FONT_SCALE_STEP)}
                      disabled={atMinFont}
                      aria-label={a11y.decrease}
                    >
                      A−
                    </button>
                    <span className="a11y-font-value" aria-live="polite">
                      {fontPercent}%
                    </span>
                    <button
                      type="button"
                      className="a11y-font-btn"
                      onClick={() => changeFont(FONT_SCALE_STEP)}
                      disabled={atMaxFont}
                      aria-label={a11y.increase}
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div className="a11y-options">
                  <ToggleRow label={a11y.contrast} icon="◐" active={prefs.contrast} onToggle={() => toggle('contrast')} />
                  <ToggleRow label={a11y.grayscale} icon="🌗" active={prefs.grayscale} onToggle={() => toggle('grayscale')} />
                  <ToggleRow label={a11y.links} icon="🔗" active={prefs.links} onToggle={() => toggle('links')} />
                  <ToggleRow label={a11y.readable} icon="Aa" active={prefs.readable} onToggle={() => toggle('readable')} />
                  <ToggleRow label={a11y.bigCursor} icon="➤" active={prefs.bigCursor} onToggle={() => toggle('bigCursor')} />
                  <ToggleRow label={a11y.noMotion} icon="⏸" active={prefs.noMotion} onToggle={() => toggle('noMotion')} />
                </div>

                <div className="a11y-panel-foot">
                  <button type="button" className="a11y-reset" onClick={reset}>
                    {a11y.reset}
                  </button>
                  <button
                    type="button"
                    className="a11y-statement"
                    onClick={() => {
                      setOpen(false)
                      setStatementOpen(true)
                    }}
                  >
                    {a11y.statement}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {statementOpen && (
        <LegalPopup
          title={a11y.statement}
          src={statementHref}
          onClose={() => {
            setStatementOpen(false)
            triggerRef.current?.focus()
          }}
        />
      )}
    </>
  )
}
