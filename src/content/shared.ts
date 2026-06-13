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
    first: 'לעמוד הראשון',
    prev: 'העמוד הקודם',
    next: 'העמוד הבא',
    last: 'לעמוד האחרון',
    thumbnails: 'תצוגה מקדימה',
    fullscreen: 'מסך מלא',
    goTo: 'מעבר לעמוד',
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
} as const
