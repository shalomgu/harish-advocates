// SEO landing pages: standalone, crawlable HTML pages generated at build time
// (see the seoPages() plugin in vite.config.ts). Each entry becomes its own
// indexable URL with focused content + structured data, single-sourced from the
// same copy the flipbook uses (practice / team / contact in pages.ts).
//
// This module must stay free of `import.meta.env` so it can be imported from the
// Vite config (Node) context. It reuses text from pages.ts (which guards its own
// BASE_URL access) but never relies on bundler-only globals here.
import { FIRM_NAME, FIRM_TAGLINE } from './site'
import { contact, practice, team } from './pages'

export const ORIGIN = 'https://www.harish-adv.com'
const ORG = `${ORIGIN}/#organization`

// Cities the firm serves, reused across structured data + body copy.
const AREA = ['גבעתיים', 'רמת גן', 'תל אביב']

export interface SeoSection {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export interface SeoLink {
  label: string
  href: string
}

export interface SeoPage {
  /** Output path relative to dist, with trailing slash, e.g. "services/real-estate/". */
  slug: string
  title: string
  description: string
  h1: string
  /** Lead paragraphs shown under the H1. */
  intro: string[]
  sections: SeoSection[]
  /** Cross-links to sibling landing pages shown in a "related" block. */
  related: SeoLink[]
  /** CTA into the interactive flipbook. */
  cta: SeoLink
  /** Visible + structured breadcrumb trail (excludes the current page). */
  breadcrumb: SeoLink[]
  /** Primary structured-data entity(ies) for this page (besides breadcrumb). */
  jsonLd: Record<string, unknown>[]
}

/** Absolute URL for a landing-page slug. */
export const pageUrl = (slug: string): string =>
  slug ? `${ORIGIN}/${slug}` : `${ORIGIN}/`

// Map each practice block (by order in pages.ts) to its landing-page metadata.
const practiceMeta: {
  slug: string
  title: string
  description: string
  h1: string
  serviceType: string
}[] = [
  {
    slug: 'services/real-estate/',
    title: 'עורך דין מקרקעין ונדל״ן בגבעתיים | ' + FIRM_NAME,
    description:
      'ליווי משפטי בעסקאות מקרקעין ונדל״ן בגבעתיים, רמת גן ותל אביב: רכישה ומכירת דירות, חוזי שכירות, עסקאות קבלן, בדיקת זכויות ומיסוי מקרקעין. ☎ 03-7528111.',
    h1: 'עורך דין מקרקעין ונדל״ן',
    serviceType: 'דיני מקרקעין ונדל״ן',
  },
  {
    slug: 'services/commercial/',
    title: 'עורך דין מסחרי ותאגידים בגבעתיים | ' + FIRM_NAME,
    description:
      'ייעוץ וליווי משפטי מסחרי בגבעתיים: הקמת חברות ועמותות, ניסוח חוזים מסחריים, הסכמי שותפות, רכישת ומכירת חברות וליווי עסקי שוטף. ☎ 03-7528111.',
    h1: 'עורך דין מסחרי ותאגידים',
    serviceType: 'משפט מסחרי ותאגידים',
  },
  {
    slug: 'services/inheritance/',
    title: 'עורך דין צוואות וירושה בגבעתיים | ' + FIRM_NAME,
    description:
      'עריכת צוואות, צווי ירושה וקיום צוואה, ייפוי כוח מתמשך, הסכמי חלוקת עיזבון וניהול עזבונות. ליווי אישי בגבעתיים, רמת גן ותל אביב. ☎ 03-7528111.',
    h1: 'עורך דין צוואות, ירושה ועזבונות',
    serviceType: 'דיני ירושה ועזבונות',
  },
  {
    slug: 'services/media/',
    title: 'עורך דין תקשורת, מדיה ואינטרנט | ' + FIRM_NAME,
    description:
      'ייצוג גופי שידור, טיפול במכרזי תקשורת, קניין רוחני וזכויות יוצרים, לשון הרע והגנת הפרטיות. ניסיון רב-שנים ברגולציית תקשורת. ☎ 03-7528111.',
    h1: 'עורך דין תקשורת, מדיה ואינטרנט',
    serviceType: 'דיני תקשורת, מדיה ואינטרנט',
  },
  {
    slug: 'services/labor-law/',
    title: 'עורך דין דיני עבודה בגבעתיים | ' + FIRM_NAME,
    description:
      'ייצוג עובדים ומעסיקים בגבעתיים: הסכמי העסקה, זכויות סוציאליות, הלנת שכר ותביעות שכר, הטרדה מינית והתעמרות בעבודה, הסכמים קיבוציים. ☎ 03-7528111.',
    h1: 'עורך דין דיני עבודה',
    serviceType: 'דיני עבודה',
  },
  {
    slug: 'services/regulation/',
    title: 'עורך דין קשרי ממשל ורגולציה | ' + FIRM_NAME,
    description:
      'ליווי הליכי חקיקה, ניסוח ותגובה על הצעות חוק, קידום פרויקטים, טיפול במכרזים מורכבים וקשר מול גופי ממשל וגופים ציבוריים. ☎ 03-7528111.',
    h1: 'עורך דין קשרי ממשל ורגולציה',
    serviceType: 'קשרי ממשל ורגולציה',
  },
]

// Shared CTA + breadcrumb for the practice pages (all open the flipbook's
// "תחומי עיסוק" spread, page index 4 in components/Book.tsx).
const practiceCta: SeoLink = { label: 'לצפייה בחוברת המשרד האינטראקטיבית', href: `${ORIGIN}/?page=4` }

const homeCrumb: SeoLink = { label: 'דף הבית', href: `${ORIGIN}/` }
const servicesCrumb: SeoLink = { label: 'תחומי עיסוק', href: `${ORIGIN}/services/` }

const areaSentence = `המשרד מלווה לקוחות ב${AREA.join(', ')} ובכל אזור המרכז.`

const practicePages: SeoPage[] = practice.blocks.map((block, i) => {
  const meta = practiceMeta[i]
  const intro = [
    `${FIRM_NAME} הוא משרד עורכי דין ותיק בגבעתיים (נוסד ב-1996) המעניק שירות מקצועי, אישי ומהיר בתחום ${block.title}.`,
    block.tagline ? `${block.tagline}. ${areaSentence}` : areaSentence,
  ]
  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    h1: meta.h1,
    intro,
    sections: [
      {
        heading: `שירותים בתחום ${block.title}`,
        items: block.items,
      },
      {
        heading: 'אזורי שירות',
        paragraphs: [
          `אנו מייצגים לקוחות פרטיים ועסקיים ב${AREA.join(', ')} ובמחוז תל אביב כולו. לתיאום פגישת ייעוץ ניתן ליצור קשר בטלפון 03-7528111 או 052-2778848.`,
        ],
      },
    ],
    related: [
      servicesCrumb,
      ...practiceMeta
        .filter((_, j) => j !== i)
        .map((m) => ({ label: m.h1, href: pageUrl(m.slug) })),
      { label: 'צור קשר', href: `${ORIGIN}/contact/` },
    ],
    cta: practiceCta,
    breadcrumb: [homeCrumb, servicesCrumb],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: meta.serviceType,
        name: meta.h1,
        description: meta.description,
        url: pageUrl(meta.slug),
        inLanguage: 'he-IL',
        provider: { '@id': ORG },
        areaServed: AREA.map((name) => ({ '@type': 'City', name })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: block.title,
          itemListElement: block.items.map((item) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: item },
          })),
        },
      },
    ],
  }
})

// Services hub.
const servicesHub: SeoPage = {
  slug: 'services/',
  title: 'תחומי עיסוק – ' + FIRM_NAME + ' | ' + FIRM_TAGLINE,
  description:
    'תחומי העיסוק של משרד חריש עורכי דין בגבעתיים: מקרקעין ונדל״ן, משפט מסחרי ותאגידים, צוואות וירושה, תקשורת ומדיה, דיני עבודה וקשרי ממשל ורגולציה.',
  h1: 'תחומי עיסוק',
  intro: [
    `${FIRM_NAME} מעניק ייעוץ וליווי משפטי במגוון תחומים, מתוך מחויבות למצוינות, חשיבה יצירתית "מחוץ לקופסא" וקשר אישי עם כל לקוח. ${areaSentence}`,
  ],
  sections: practice.blocks.map((block, i) => ({
    heading: practiceMeta[i].h1,
    paragraphs: [
      block.tagline ? `${block.tagline}.` : '',
      `${block.items.slice(0, 4).join(' · ')}. לפרטים נוספים בקרו בעמוד ${practiceMeta[i].h1}.`,
    ].filter(Boolean),
  })),
  related: [
    ...practiceMeta.map((m) => ({ label: m.h1, href: pageUrl(m.slug) })),
    { label: 'צור קשר', href: `${ORIGIN}/contact/` },
  ],
  cta: practiceCta,
  breadcrumb: [homeCrumb],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'תחומי עיסוק – ' + FIRM_NAME,
      description:
        'תחומי העיסוק של משרד חריש עורכי דין בגבעתיים.',
      url: pageUrl('services/'),
      inLanguage: 'he-IL',
      about: { '@id': ORG },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: practiceMeta.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: m.h1,
          url: pageUrl(m.slug),
        })),
      },
    },
  ],
}

// Lawyer bio pages.
const liorPage: SeoPage = {
  slug: 'team/lior-harish/',
  title: 'עו״ד ליאור חריש – מייסד המשרד | ' + FIRM_NAME,
  description:
    'עו״ד ליאור חריש, מייסד משרד חריש עורכי דין בגבעתיים (1996), מגשר מוסמך. מתמחה בתקשורת ומדיה, מקרקעין, תאגידים, צוואות וירושה, דיני עבודה וזכויות בעלי חיים.',
  h1: 'עו״ד ליאור חריש',
  intro: [
    'עו״ד ליאור חריש הוא מייסד המשרד, עורך דין משנת 1995 ומגשר מוסמך מטעם הנהלת בתי המשפט. יוצא משרד הרצוג, פוקס, נאמן ושות׳.',
  ],
  sections: [
    { heading: team.lior.professionalHeading, items: [...team.lior.credentials] },
    { heading: 'ניסיון מקצועי', items: [...team.lior.experience] },
    { heading: team.lior.casesHeading, items: [...team.lior.cases] },
    { heading: team.lior.writingHeading, items: [...team.lior.writing] },
  ],
  related: [
    { label: 'עו״ד איריס חריש', href: `${ORIGIN}/team/iris-harish/` },
    servicesCrumb,
    { label: 'צור קשר', href: `${ORIGIN}/contact/` },
  ],
  cta: { label: 'לצפייה בחוברת המשרד האינטראקטיבית', href: `${ORIGIN}/?page=2` },
  breadcrumb: [homeCrumb],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'עו״ד ליאור חריש',
      jobTitle: 'עורך דין, מייסד המשרד',
      url: pageUrl('team/lior-harish/'),
      worksFor: { '@id': ORG },
      alumniOf: 'אוניברסיטת בר אילן',
      knowsAbout: [
        'תקשורת, מדיה ואינטרנט',
        'מקרקעין ונדל״ן',
        'משפט מסחרי ותאגידים',
        'צוואות וירושות',
        'דיני עבודה',
      ],
      sameAs: [
        'https://www.instagram.com/liorharish_adv',
        'https://www.linkedin.com/in/lior-harish-95399622',
      ],
    },
  ],
}

const irisPage: SeoPage = {
  slug: 'team/iris-harish/',
  title: 'עו״ד איריס חריש | ' + FIRM_NAME,
  description:
    'עו״ד איריס חריש, בעלת רישיון עריכת דין משנת 1997, בוגרת אוניברסיטת בר אילן. מתמחה בדיני עבודה, זכויות יוצרים וקניין רוחני במשרד חריש עורכי דין בגבעתיים.',
  h1: 'עו״ד איריס חריש',
  intro: [
    'עו״ד איריס חריש מתמחה בדיני עבודה, זכויות יוצרים וקניין רוחני. בעלת רישיון עריכת דין מיום 29.5.1997 ובוגרת הפקולטה למשפטים באוניברסיטת בר אילן.',
  ],
  sections: [
    { heading: 'השכלה ורקע', items: [...team.iris.bio] },
    { heading: team.iris.experienceHeading, items: [...team.iris.experience] },
  ],
  related: [
    { label: 'עו״ד ליאור חריש', href: `${ORIGIN}/team/lior-harish/` },
    servicesCrumb,
    { label: 'צור קשר', href: `${ORIGIN}/contact/` },
  ],
  cta: { label: 'לצפייה בחוברת המשרד האינטראקטיבית', href: `${ORIGIN}/?page=3` },
  breadcrumb: [homeCrumb],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'עו״ד איריס חריש',
      jobTitle: 'עורכת דין',
      url: pageUrl('team/iris-harish/'),
      worksFor: { '@id': ORG },
      alumniOf: 'אוניברסיטת בר אילן',
      knowsAbout: ['דיני עבודה', 'זכויות יוצרים', 'קניין רוחני'],
    },
  ],
}

// Contact / location landing.
const contactPage: SeoPage = {
  slug: 'contact/',
  title: 'עורך דין בגבעתיים – צור קשר | ' + FIRM_NAME,
  description:
    'משרד חריש עורכי דין, דליה 7 גבעתיים. לתיאום פגישת ייעוץ: טלפון 03-7528111, סלולרי 052-2778848, דוא״ל harish-l@barak.net.il. שירות בגבעתיים, רמת גן ותל אביב.',
  h1: 'צור קשר – עורך דין בגבעתיים',
  intro: [
    contact.intro,
    `משרד ${FIRM_NAME} ממוקם ב${contact.address.lines.join('')}. ${areaSentence}`,
  ],
  sections: [
    {
      heading: 'פרטי התקשרות',
      items: [
        `כתובת: ${contact.address.lines.join('')}`,
        `טלפון: ${contact.phone.telDisplay}`,
        `סלולרי: ${contact.phone.mobileDisplay}`,
        `דוא״ל: ${contact.email.address}`,
        `שעות: ${contact.hours.lines.join(', ')}`,
      ],
    },
  ],
  related: [
    servicesCrumb,
    { label: 'עו״ד ליאור חריש', href: `${ORIGIN}/team/lior-harish/` },
    { label: 'עו״ד איריס חריש', href: `${ORIGIN}/team/iris-harish/` },
  ],
  cta: { label: 'לצפייה בחוברת המשרד האינטראקטיבית', href: `${ORIGIN}/?page=9` },
  breadcrumb: [homeCrumb],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'צור קשר – ' + FIRM_NAME,
      url: pageUrl('contact/'),
      inLanguage: 'he-IL',
      about: { '@id': ORG },
    },
  ],
}

export const seoPagesData: SeoPage[] = [
  servicesHub,
  ...practicePages,
  liorPage,
  irisPage,
  contactPage,
]
