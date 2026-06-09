// Central string table for shared chrome text and asset helpers.
// All user-facing copy lives in this folder so layout components stay clean.

export const asset = (name: string): string =>
  `${import.meta.env.BASE_URL}assets/${name}`

export const shared = {
  firmName: 'חריש עורכי דין',
  topbarTitle: 'חריש עורכי דין',
  pageStatus: (current: number, total: number) => `עמוד ${current} מתוך ${total}`,
  nav: {
    first: 'לעמוד הראשון',
    prev: 'העמוד הקודם',
    next: 'העמוד הבא',
    last: 'לעמוד האחרון',
    thumbnails: 'תצוגה מקדימה',
    fullscreen: 'מסך מלא',
    goTo: 'מעבר לעמוד',
  },
  modeToggle: {
    label: 'מצב דפדוף',
    mirror: 'מראה',
    native: 'מקורי',
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
