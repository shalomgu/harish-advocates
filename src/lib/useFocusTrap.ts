import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Traps keyboard focus inside `ref` while `active`, moves focus into it on open,
 * and restores focus to the previously-focused element on close. Pair with a
 * container that has role="dialog"/aria-modal for an accessible overlay.
 */
export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement>): void {
  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusFirst = () => {
      const first = container.querySelector<HTMLElement>(FOCUSABLE)
      if (first) first.focus()
      else container.focus()
    }
    focusFirst()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey && (activeEl === first || !container.contains(activeEl))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      previouslyFocused?.focus?.()
    }
  }, [active, ref])
}
