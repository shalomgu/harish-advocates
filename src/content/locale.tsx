import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  shared,
  localeMeta,
  locales,
  type ChromeStrings,
  type Locale,
} from './shared'
import { content, type SiteContent } from './pages'

const STORAGE_KEY = 'harish.locale'

function isLocale(value: string | null): value is Locale {
  return value != null && (locales as string[]).includes(value)
}

// Resolution order: URL (?lang=) > localStorage > Hebrew default.
function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'he'
  const param = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(param)) return param
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // ignore storage access errors (private mode, etc.)
  }
  return 'he'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  // Localized page copy for the current locale.
  t: SiteContent
  // Localized chrome strings (nav labels, status text, etc.).
  chrome: ChromeStrings
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage access errors
    }
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    window.history.replaceState(null, '', url)
  }, [])

  // Keep the document direction and language in sync with the active locale.
  useEffect(() => {
    const { dir } = localeMeta[locale]
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: content[locale], chrome: shared[locale] }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
