// Single source of truth for the firm's brand strings.
// Reused by the React app (shared.ts, pages.ts, App.tsx) AND injected into the
// static index.html at build time via the html-brand-vars plugin in
// vite.config.ts (placeholders: %FIRM_NAME%, %FIRM_TAGLINE%, %FIRM_TITLE%).
export const FIRM_NAME = 'חריש עורכי דין'
export const FIRM_TAGLINE = 'משרד עורכי דין בגבעתיים'
export const FIRM_TITLE = `${FIRM_NAME} | ${FIRM_TAGLINE}`
