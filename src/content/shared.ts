// Central string table for shared chrome text, locale metadata and asset helpers.
// All user-facing copy lives in this folder so layout components stay clean.

export type Locale = 'he' | 'en'

// Page-flip rendering strategy. 'mirror' fakes RTL by flipping the engine
// horizontally; 'native' lets the LTR engine run as-is.
export type RtlMode = 'mirror' | 'native'

export const asset = (name: string): string =>
  `${import.meta.env.BASE_URL}assets/${name}`

export interface ChromeStrings {
  firmName: string
  topbarTitle: string
  pageStatus: (current: number, total: number) => string
  nav: {
    first: string
    prev: string
    next: string
    last: string
    thumbnails: string
    fullscreen: string
    goTo: string
  }
  language: {
    label: string
  }
  legalLinksLabel: string
  lightbox: {
    close: string
    next: string
    prev: string
    slide: (index: number) => string
    openNewTab: string
    audioPlay: string
    audioPause: string
  }
  a11y: {
    open: string
    title: string
    fontSize: string
    increase: string
    decrease: string
    contrast: string
    grayscale: string
    links: string
    readable: string
    bigCursor: string
    noMotion: string
    reset: string
    statement: string
    close: string
    skipToContent: string
  }
}

export const shared: Record<Locale, ChromeStrings> = {
  he: {
    firmName: 'חריש עורכי דין',
    topbarTitle: 'חריש עורכי דין',
    pageStatus: (current, total) => `עמוד ${current} מתוך ${total}`,
    nav: {
      first: 'לעמוד הראשון',
      prev: 'העמוד הקודם',
      next: 'העמוד הבא',
      last: 'לעמוד האחרון',
      thumbnails: 'תצוגה מקדימה',
      fullscreen: 'מסך מלא',
      goTo: 'מעבר לעמוד',
    },
    language: {
      label: 'שפה',
    },
    legalLinksLabel: 'קישורים משפטיים',
    lightbox: {
      close: 'סגירה',
      next: 'הבא',
      prev: 'הקודם',
      slide: (index) => `שקופית ${index}`,
      openNewTab: 'פתיחה בכרטיסייה חדשה ↗',
      audioPlay: 'נגינה',
      audioPause: 'השהיה',
    },
    a11y: {
      open: 'תפריט נגישות',
      title: 'התאמות נגישות',
      fontSize: 'גודל טקסט',
      increase: 'הגדלת טקסט',
      decrease: 'הקטנת טקסט',
      contrast: 'ניגודיות גבוהה',
      grayscale: 'גווני אפור',
      links: 'הדגשת קישורים',
      readable: 'גופן קריא',
      bigCursor: 'סמן גדול',
      noMotion: 'עצירת אנימציות',
      reset: 'איפוס הגדרות',
      statement: 'הצהרת נגישות',
      close: 'סגירת תפריט הנגישות',
      skipToContent: 'דלג לתוכן הראשי',
    },
  },
  en: {
    firmName: 'Harish Advocates',
    topbarTitle: 'Harish Advocates',
    pageStatus: (current, total) => `Page ${current} of ${total}`,
    nav: {
      first: 'First page',
      prev: 'Previous page',
      next: 'Next page',
      last: 'Last page',
      thumbnails: 'Thumbnails',
      fullscreen: 'Fullscreen',
      goTo: 'Go to page',
    },
    language: {
      label: 'Language',
    },
    legalLinksLabel: 'Legal links',
    lightbox: {
      close: 'Close',
      next: 'Next',
      prev: 'Previous',
      slide: (index) => `Slide ${index}`,
      openNewTab: 'Open in a new tab ↗',
      audioPlay: 'Play',
      audioPause: 'Pause',
    },
    a11y: {
      open: 'Accessibility menu',
      title: 'Accessibility adjustments',
      fontSize: 'Text size',
      increase: 'Increase text',
      decrease: 'Decrease text',
      contrast: 'High contrast',
      grayscale: 'Grayscale',
      links: 'Highlight links',
      readable: 'Readable font',
      bigCursor: 'Large cursor',
      noMotion: 'Stop animations',
      reset: 'Reset settings',
      statement: 'Accessibility statement',
      close: 'Close accessibility menu',
      skipToContent: 'Skip to main content',
    },
  },
}

export interface LocaleMeta {
  dir: 'rtl' | 'ltr'
  mode: RtlMode
  // Short label shown on the language switch button.
  label: string
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  he: { dir: 'rtl', mode: 'mirror', label: 'עברית' },
  en: { dir: 'ltr', mode: 'native', label: 'English' },
}

export const locales: Locale[] = ['he', 'en']
