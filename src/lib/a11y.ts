// Shared accessibility constants/helpers used by the widget and the flipbook.
// Keeping these in one place lets the widget toggle motion preferences while
// Book.tsx reacts to them without importing widget internals.

export const A11Y_STORAGE_KEY = 'harish-a11y-prefs'

// Dispatched on window whenever the user toggles the "stop animations" control,
// so motion-sensitive components (e.g. the flipbook) can react immediately.
export const A11Y_MOTION_EVENT = 'harish-a11y-motion'

export interface A11yPrefs {
  fontScale: number
  contrast: boolean
  grayscale: boolean
  links: boolean
  readable: boolean
  bigCursor: boolean
  noMotion: boolean
}

export const DEFAULT_PREFS: A11yPrefs = {
  fontScale: 1,
  contrast: false,
  grayscale: false,
  links: false,
  readable: false,
  bigCursor: false,
  noMotion: false,
}

export const FONT_SCALE_MIN = 0.9
export const FONT_SCALE_MAX = 1.6
export const FONT_SCALE_STEP = 0.1

/** True when the OS/browser asks for reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** True when motion should be suppressed: either via the widget or the OS. */
export function motionDisabled(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('a11y-no-motion') || prefersReducedMotion()
}

export function loadPrefs(): A11yPrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_PREFS }
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<A11yPrefs>
    return { ...DEFAULT_PREFS, ...parsed }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: A11yPrefs): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Ignore storage failures (private mode, quota, etc.).
  }
}

/** Reflect the given preferences onto the document root (classes + font scale). */
export function applyPrefs(prefs: A11yPrefs): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--a11y-font-scale', String(prefs.fontScale))
  root.classList.toggle('a11y-contrast', prefs.contrast)
  root.classList.toggle('a11y-grayscale', prefs.grayscale)
  root.classList.toggle('a11y-links', prefs.links)
  root.classList.toggle('a11y-readable', prefs.readable)
  root.classList.toggle('a11y-big-cursor', prefs.bigCursor)
  root.classList.toggle('a11y-no-motion', prefs.noMotion)
}
