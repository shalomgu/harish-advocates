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
  }
  language: {
    label: string
  }
  lightbox: {
    close: string
    next: string
    prev: string
    slide: (index: number) => string
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
    },
    language: {
      label: 'שפה',
    },
    lightbox: {
      close: 'סגירה',
      next: 'הבא',
      prev: 'הקודם',
      slide: (index) => `שקופית ${index}`,
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
    },
    language: {
      label: 'Language',
    },
    lightbox: {
      close: 'Close',
      next: 'Next',
      prev: 'Previous',
      slide: (index) => `Slide ${index}`,
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
