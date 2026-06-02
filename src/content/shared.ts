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
  },
  modeToggle: {
    label: 'מצב דפדוף',
    mirror: 'מראה',
    native: 'מקורי',
  },
} as const
