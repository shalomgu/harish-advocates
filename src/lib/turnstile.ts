/** Minimal Cloudflare Turnstile typings used by NewsletterPopup. */
export type TurnstileRenderOptions = {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

export type TurnstileApi = {
  render: (el: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
  getResponse: (widgetId?: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let loading: Promise<TurnstileApi> | null = null

/** Load Turnstile once; resolves with `window.turnstile`. */
export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loading) return loading

  loading = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.turnstile) resolve(window.turnstile)
        else reject(new Error('Turnstile failed to initialize'))
      })
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')))
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile failed to initialize'))
    }
    script.onerror = () => reject(new Error('Turnstile script failed to load'))
    document.head.appendChild(script)
  }).catch((err) => {
    loading = null
    throw err
  })

  return loading
}
