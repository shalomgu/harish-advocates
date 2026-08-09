// String table: all page copy, links and asset references.
// Edit text here; page components only handle layout.
import { asset } from './shared'
import { FIRM_NAME } from './site'

// Undefined when imported from the Vite config (Node) context; see asset() note.
const base = import.meta.env?.BASE_URL ?? '/'

// Bottom-of-page legal/utility links shown on the cover and back-cover.
// Each opens its standalone page inside an in-app popup (see LegalLinks).
export const legalLinks = [
  { label: 'תנאי שימוש', href: `${base}terms.html` },
  { label: 'מדיניות פרטיות', href: `${base}privacy.html` },
  { label: 'הצהרת נגישות', href: `${base}accessibility.html` },
] as const

// First-visit cookie notice shown on the cover right after the intro clip closes.
// The privacy link opens the standalone policy in the same in-app popup as the
// legal links above.
export const cookieConsent = {
  before: 'לידיעתך האתר עושה שימוש בעוגיות (COOKIES) לצורך תפעולו ושיפור השימוש בו כמפורט ב',
  policyLabel: 'מדיניות הפרטיות',
  policyHref: `${base}privacy.html`,
  after: '. ניתן לשנות את העדפות השימוש בהגדרות הדפדפן.',
  accept: 'הבנתי',
  ariaLabel: 'הודעה על שימוש בעוגיות',
} as const

export const cover = {
  logo: asset('cover-logo.png'),
  logoAlt: `${FIRM_NAME} – Harish Advocates`,
  title: FIRM_NAME,
  taglineParts: ['יצירתיות', 'תגובתיות', 'אסטרטגיה'],
  portrait: asset('lior-harish-nobg-sm.png'),
  portraitAlt: 'עו״ד ליאור חריש',
  author: 'עו״ד ליאור חריש – מייסד',
  promise: 'מקצועיות. אמינות. ניסיון.',
  footer: '',
  // Intro clip that morphs out of the cover portrait on first visit.
  introVideo: asset('videos/intro.mp4'),
}

export const about = {
  title: '',
  badge: FIRM_NAME,
  paragraphs: [
    'המשרד נוסד בסוף שנת 1996 על ידי עו״ד ליאור חריש, יוצא משרד הרצוג, פוקס, נאמן ושות׳.',
    'יחודו של המשרד בשירות המקצועי, היעיל והמהיר שהוא מעניק ללקוחותיו, בקשר האישי שהוא מקפיד לקיים עימם, ובמחויבותו למצוינות חסרת פשרות.',
    'הטיפול שלנו מתאפיין בחשיבה יצירתית „מחוץ לקופסא“, הבנה יסודית של צורכי הלקוח, הקפדה על הפרטים, וליווי ותמיכה רחבים יותר מיעוץ משפטי נטו, הכוללים יעוץ אסטרטגי – כללי.',
  ],
  teamLabel: 'כיום מונה המשרד שני עורכי דין',
  teamList: ['עו״ד ליאור חריש', 'עו״ד איריס חריש'],
}

export const team = {
  title: 'הצוות',
  lior: {
    name: 'עו״ד ליאור חריש',
    photo: asset('lior-harish-speaking.png'),
    professionalHeading: 'עיסוק מקצועי כעו״ד',
    credentials: [
      'בוגר משפטים LLB בהצטיינות מאוניברסיטת בר אילן.',
      'עורך דין משנת 1995.',
      'מוסמך כמגשר מטעם הנהלת בתי המשפט משנת 2001.',
      'יו״ר משותף של הועדה הארצית להגנה על זכויות בעלי חיים בלשכת עורכי הדין משנת 2024.',
      'יו״ר משותף של פורום עורכי דין ישראליים להגנת בעלי חיים משנת 2023.',
    ],
    experience: [
      'שלוש שנים במשרד הרצוג, פוקס נאמן – עו״ד, מתמחה וסטודנט (93-96).',
      'התמחות בבית המשפט המחוזי בת״א בהרכב ערעורים (1994).',
      'עו״ד בעל משרד עצמאי מ 1996 (למעלה מ-30 שנה). התמחות בדיני תקשורת, מדיה ואינטרנט, קשרי ממשל ורגולציה, מקרקעין, תאגידים, צוואות, ירושות ועזבונות, דיני עבודה וזכויות בעלי חיים.',
      'יועץ משפטי של עמותת התאחדות תחנות הרדיו ושל תחנות רדיו אזוריות. עיסוק אינטנסיבי ברגולציה וחקיקה, במשך למעלה מ-12 שנה.',
    ],
    casesHeading: 'נושאי טיפול לדוגמא:',
    cases: [
      'הובלת מכרזי ענק למתן זיכיונות לשידורי רדיו אזוריים – ניהול הקבוצה וכתיבת המכרזים על כל פרקיהם.',
      'ייצוג חברת טלוויזיה בכבלים (טל״כ) באופן שוטף במכלול תחומי העיסוק, ובפרט רגולציית תקשורת.',
      'ייצוג ראש לשכת עורכי הדין בהליכים מינהליים במסגרת הבחירות ללשכה.',
      'ייצוג אגודת הסטודנטים של אוניברסיטת תל אביב כנגד האוניברסיטה בתיק עקרוני לשינוי שיטת הניקוד של סטודנטים בפקולטה למשפטים.',
      'ייצוג בתיק תקדימי בתחום דיני העבודה שכלל ביטול הסכם קיבוצי בטענה להיותו מכוון אינדיבידואלית לפגיעה בעובד ספציפי.',
      'ייצוג בתביעת ענק של תחנות הרדיו כנגד מדינת ישראל בגין מחדליה בטיפול ברדיו פיראטי.',
      'ייצוג הרשות השניה כפרוייקטור במכרז לבחירת משרד עו״ד חיצוני לרשות השניה.',
      'ייצוג בהליכים להסדרת בחירות בעמותת התאחדות הסקי בישראל.',
      'יעוץ משפטי שוטף לעמותת צליאק בישראל, ועמותות למען בעלי חיים בכל היבטי הפעילות, לרבות רגולציה והסדרה חוקית.',
    ],
    writingHeading: 'פעילות בתחום הכתיבה והיצירה',
    writing: [
      'כתיבת מאמרי דעה ומאמרים מקצועיים בעיתונות הכתובה.',
      'משדר מזה 15 שנים תוכנית סאטירה אקטואלית ברדיו לב המדינה.',
      'שידור תוכניות יעוץ משפטי למאזינים בתחנות הרדיו רדיוס ורדיו צפון.',
      'שידור פינה משפטית שבועית בתחנת הרדיו ׳רדיו ללא הפסקה׳.',
      'כתיבת רשימות משפטיות בענייני עבודה ועובדים, אשר התפרסמו במגזין ׳העולם הזה׳ ושודרו במסגרת פינה משפטית בתוכנית רדיו של ההסתדרות הכללית בתחנת קול השלום בשנים 91-92.',
      'עבודה כעיתונאי במקומון בגבעתיים.',
      'כתיבה והוצאה לאור של 5 ספרי ילדים. אחד מהם "יער החיים" המיועד להקנות ערכים חברתיים לילדים, שימש לתוכנית לימודים שקיים מכון אדם לדמוקרטיה. אחד הסיפורים נכנס לפרוייקט ׳הפעלופדיה׳ של משרד החינוך.',
    ],
  },
  iris: {
    name: 'עו״ד איריס חריש',
    photo: asset('iris-harish.png'),
    bio: [
      'נולדה בתל אביב בתאריך 2.9.1968',
      'בעלת תואר ראשון (L.L.B.) מטעם הפקולטה למשפטים, אוניברסיטת בר אילן ברמת גן + בית הספר ללימודי משפט המוכר על ידי אוניברסיטת בר אילן. (1992-1996).',
      'בעלת תואר ראשון (B.A.) בהצטיינות, במדעי ההתנהגות (פסיכולוגיה ראשי, אנתרופולוגיה וסוציולוגיה משני), אוניברסיטת "בן גוריון" בנגב (1989-1992).',
      'בעלת רישיון עריכת דין מיום 29.5.1997.',
      'מתמחה בדיני עבודה, זכויות יוצרים וקנין רוחני.',
    ],
    experienceHeading: 'נסיון עבודה:',
    experience: [
      'עבדה כסטודנטית במשרד עורכי הדין פוליאק - רביץ, מרח׳ הר סיני 1 תל אביב, בתחום דיני העבודה (03.93-10.93).',
      'עבדה כסטודנטית במשרד עורכי הדין אמיר דוידוב מרח׳ קפלן 2, תל אביב, בתחום דיני העבודה ומשפט מסחרי (11.94-03.96).',
      'התמחתה חצי שנה במשרד עורכי הדין אמיר דוידוב ועסקה בעיקר בתחום דיני העבודה (03.96-09.96).',
      'התמחתה חצי שנה בבית המשפט המחוזי בתל אביב יפו, אצל כבוד השופט אפרים שלו ז״ל, ועסקה בצווי מניעה, וסעדים זמניים (09.96-03.97).',
      'הצטרפה למשרד בחודש יולי 1997.',
    ],
  },
}

export interface PracticeBlock {
  title: string
  tagline?: string
  intro?: string
  items: string[]
}

export const practice = {
  title: 'תחומי עיסוק',
  blocks: [
    {
      title: 'מקרקעין ונדל"ן',
      tagline: 'רכישה, מכירה, שכירות וליווי עסקאות',
      items: [
        'רכישת ומכירת דירות ובתים',
        'חוזי שכירות',
        'עסקאות קבלן וייצוג רוכשים',
        'בדיקות זכויות ונסח טאבו',
        'עסקאות מסחריות',
        'מיסוי מקרקעין',
      ],
    },
    {
      title: 'משפט מסחרי ותאגידים',
      tagline: 'חוזים, הקמת עסקים וייצוג מסחרי',
      items: [
        'הקמת חברות ועמותות',
        'ניסוח וביקורת חוזים מסחריים',
        'הסכמי שותפות',
        'ליווי עסקי שוטף',
        'רכישת ומכירת חברות',
        'פירוק והחייאה של חברות',
        'טיפול בעמותות ומלכ״רים – הקמה ויעוץ שוטף',
      ],
    },
    {
      title: 'דיני ירושה ועזבונות',
      items: [
        'יפוי כח מתמשך',
        'הכנת צוואות',
        'הוצאת צווי ירושה וקיום צוואות',
        'הסכמי חלוקת עיזבון',
        'ניהול עזבונות',
      ],
    },
    {
      title: 'תקשורת, מדיה ואינטרנט',
      items: [
        'ייצוג שותף של גופי שידור',
        'טיפול במכרזי תקשורת',
        'קניין רוחני וזכויות יוצרים',
        'לשון הרע והגנת הפרטיות',
      ],
    },
    {
      title: 'דיני עבודה',
      tagline: 'ייצוג עובדים ומעסיקים בכל ענייני תעסוקה',
      items: [
        'הכנה ובדיקה של הסכמי העסקה',
        'יעוץ למעסיקים ולעובדים',
        'זכויות סוציאליות — חופשה, מחלה, פנסיה',
        'הלנת שכר ותביעות שכר',
        'הטרדה מינית והתעמרות בעבודה',
        'הסכמים קיבוציים וצווי הרחבה',
      ],
    },
    {
      title: 'קשרי ממשל ורגולציה',
      items: [
        'ניסוח ותגובה על הצעות חוק',
        'ליווי הליכי חקיקה',
        'קידום פרוייקטים וטיפול במכרזים מורכבים',
        'קשר מול גופי ממשל וגופים ציבוריים',
      ],
    },
  ] as PracticeBlock[],
}

export interface TipVideo {
  // 'video' = self-hosted MP4, true inline playback (recommended);
  // 'youtube' = poster tile that streams the YouTube video inside the in-app popup
  //             (url may be a youtu.be/ or watch?v= link; thumbnail is auto-derived);
  // 'embed' = Instagram iframe preview (plays once, then links out — IG's own behavior);
  // 'link'  = poster tile that opens the post in a new tab;
  // 'iframe' = poster tile that opens the URL embedded inside the in-app popup.
  type: 'embed' | 'link' | 'video' | 'iframe' | 'youtube'
  url: string
  label: string
  poster?: string
  // Overlay glyph shown on 'link' tiles. Defaults to a play triangle.
  icon?: 'play' | 'radio'
  // 'video' items that are really audio recordings: keep the poster image on
  // screen while the track plays instead of showing the (blank) video frames.
  audio?: boolean
}

export interface TipArticle {
  title: string
  // Optional deep-link slug. When the site is opened with ?guide=<slug>, the
  // book flips to this article's page and auto-opens its carousel/PDF.
  slug?: string
  // Image shown on the card.
  thumbnail: string
  // Carousel slides shown in the enlarged view (image articles).
  images?: string[]
  // When set, the card opens this PDF in a new tab instead of the image carousel.
  pdf?: string
  // Optional publication credit shown under the title.
  source?: string
}

export const tips = {
  title: 'חשוב לדעת',
  videos: {
    heading: 'סרטוני מידע',
    // Reusing the מהתקשורת reels for now; more will be supplied later.
    items: [
      { type: 'video', url: asset('videos/monopol.mp4'), label: 'מכירה וקנית דירה- מה קודם?' },
      { type: 'video', url: asset('videos/lior-likes.mp4'), label: 'עושים לייק? - תיזהרו' },
      { type: 'video', url: asset('videos/will.mp4'), label: 'על החשיבות בעריכת צוואה' },
      { type: 'video', url: asset('videos/will-diy.mp4'), label: 'צוואה – לערוך לבד?' },
      { type: 'video', url: asset('videos/yipuy-koach-mitmashech.mp4'), label: 'ייפוי כוח מתמשך' },
      { type: 'video', url: asset('videos/copy-rights.mp4'), label: 'זכויות יוצרים על רעיון' },
      { type: 'video', url: asset('videos/buying-home-in-a-bag.mp4'), label: 'טיפים לרכישת דירה מקבלן' },
      { type: 'video', url: asset('videos/give-dira-risk.mp4'), label: 'על הסיכון שבדירה במתנה לקרוב' },
      { type: 'video', url: asset('videos/present-for-kids.mp4'), label: 'על ההגנות הדרושות בסיוע לילדים במימון רכישת דירה' },
    ] as TipVideo[],
  },
  articles: {
    heading: 'מאמרים ומדריכים',
    items: [
      {
        title: 'המדריך המשפטי למשכירי דירות',
        slug: 'renters',
        thumbnail: asset('renters-guide.png'),
        images: [
          asset('renters-slide-1.png'),
          asset('renters-slide-2.png'),
          asset('renters-slide-3.png'),
          asset('renters-slide-4.png'),
          asset('renters-slide-5.png'),
          asset('renters-slide-6.png'),
          asset('renters-slide-7.png'),
          asset('renters-slide-8.png'),
        ],
      },
      {
        title: 'על ניצול כלכלי של קשישים',
        source: 'דה מרקר',
        thumbnail: asset('articles/nizul-kshihim.png'),
        images: [asset('articles/nizul-kshihim.png')],
      },
      {
        title: 'כמה שווים מיליון לייקים',
        source: 'דה מרקר',
        thumbnail: asset('articles/million-likes.png'),
        pdf: asset('articles/million-likes.pdf'),
      },
      {
        title: 'ישראל היא גן עדן לחייבים',
        source: 'דה מרקר',
        thumbnail: asset('articles/demarker-debtors-paradise.png'),
        pdf: asset('articles/demarker-debtors-paradise.pdf'),
      },
      {
        title: 'המזומן הוגבל? העבריינים יעברו לביטקוין',
        source: 'דה מרקר',
        thumbnail: asset('articles/demarker-bitcoin-cash.png'),
        pdf: asset('articles/demarker-bitcoin-cash.pdf'),
      },
      {
        title: 'היזהרו מ„Winter is coming“',
        source: 'דה מרקר',
        thumbnail: asset('articles/demarker-wine-dine-scam.png'),
        pdf: asset('articles/demarker-wine-dine-scam.pdf'),
      },
      {
        title: 'מה זה עיתון?',
        source: 'דה מרקר',
        thumbnail: asset('articles/demarker-what-is-newspaper.png'),
        pdf: asset('articles/demarker-what-is-newspaper.pdf'),
      },
      {
        title: 'חלית? הגעת לגבורות? חכה בתור',
        source: 'דה מרקר',
        thumbnail: asset('articles/wait-in-line.png'),
        pdf: asset('articles/wait-in-line.pdf'),
      },
      {
        title: 'דרוש רובין הוד לשידורי ספורט',
        source: 'גלובס',
        thumbnail: asset('articles/globes-sports-broadcast.png'),
        pdf: asset('articles/globes-sports-broadcast.pdf'),
      },
      {
        title: 'איומי השביתה של לשכת עורכי הדין',
        source: 'כלכליסט',
        thumbnail: asset('articles/calcalist-lawyers-strike.png'),
        pdf: asset('articles/calcalist-lawyers-strike.pdf'),
      },
      {
        title: 'על חזירי הבר בחיפה',
        source: 'דה מרקר',
        thumbnail: asset('articles/puppies-are-dying.png'),
        images: [asset('articles/puppies-are-dying.png')],
      },
    ] as TipArticle[],
  },
}

export const media = {
  title: 'מהתקשורת',
  videos: {
    heading: 'רדיו וטלויזיה',
    items: [
      { type: 'video', url: asset('videos/binyamini-and-gueta.mp4'), label: 'ראיון בכאן 11 - 6.11.2023' },
      { type: 'video', url: asset('videos/radio-vaadat-huz.m4a'), poster: asset('videos/radio-vaadat-huz.jpeg'), label: 'ראיון כאן11-חוק כלבי שירות', audio: true },
      { type: 'iframe', url: 'https://103fm.maariv.co.il/programs/media.aspx?ZrqvnVq=EMFGKH&c41t4nzVQ=EF', label: 'ראיון ברדיו 103FM – הצעת חוק לעידוד יצור מזון לחולי צליאק', icon: 'radio' },
      { type: 'youtube', url: 'https://youtu.be/3DAeOVLUeW4', label: 'עו"ד ליאור חריש, על הלכת "אפרופים" שבוטלה - מתוך הפודקאסט של עו"ד אביב הראל' },
      { type: 'youtube', url: 'https://youtu.be/3GqKLAAgYEU', label: 'עו"ד ליאור חריש, על המורכבות בעריכת דין בתחום התקשורת – מתוך הפודקאסט של עו"ד אביב הראל' },
      { type: 'youtube', url: 'https://youtu.be/vMxSLiswrIE', label: 'עו"ד ליאור חריש, על ייצוג בעסקאות מקרקעין בעידן ה ai - מתוך הפודקאסט של עו"ד אביב הראל' },
      { type: 'youtube', url: 'https://youtu.be/k6b29yT_eoA', label: 'עו"ד ליאור חריש, על המורכבות של ייצוג משפטי בתחום התקשורת והמדיה – מתוך הפודקאסט של עו"ד אביב הראל' }
    ] as TipVideo[],
  },
  articles: {
    heading: 'עיתונות כתובה',
    items: [
      {
        title: '“The trial of Bill Burn” – myth and facts',
        source: 'A-LAW',
        thumbnail: asset('articles/bill-burn-trial.png'),
        pdf: asset('articles/bill-burn-trial.pdf'),
      },
      {
        title: 'אדוני, אז מה אם צפוף',
        source: 'ynet',
        thumbnail: asset('articles/so-what-if-crowded.png'),
        pdf: asset('articles/so-what-if-crowded.pdf'),
      },
      {
        title: 'תחנות הרדיו האיזורי תובעות מהמדינה פיצוי בשל הנזקים מהתחנות הפירטיות',
        source: 'גלובס',
        thumbnail: asset('articles/globes-regional-radio-pirate-damages.png'),
        pdf: asset('articles/globes-regional-radio-pirate-damages.pdf'),
      },
      {
        title: 'בעלי חיים ברשויות המקומיות',
        source: 'מעריב',
        thumbnail: asset('articles/maariv-animals-municipalities.png'),
        pdf: asset('articles/maariv-animals-municipalities.pdf'),
      },
      {
        title: 'התחנות האיזוריות למפקד גלי צה״ל: חידלו משידור חסויות',
        source: 'וואלה ברנז׳ה',
        thumbnail: asset('articles/walla-regional-stations-galatz.png'),
        pdf: asset('articles/walla-regional-stations-galatz.pdf'),
      },
      {
        title: 'ועדת הכלכלה אישרה: הרשות השנייה תוכל להאריך אוטומטית את הזכיונות של תחנות הרדיו האזורי',
        source: 'הארץ',
        thumbnail: asset('articles/economy-committee-radio-licenses.png'),
        pdf: asset('articles/economy-committee-radio-licenses.pdf'),
      },
      {
        title: 'בכנסת יוחלט על הזכיונות של הרדיו האזורי',
        source: 'ערוץ 7',
        thumbnail: asset('articles/channel7-knesset-radio-licenses.png'),
        pdf: asset('articles/channel7-knesset-radio-licenses.pdf'),
      },
      {
        title: 'יותר מגוון לחולי הצליאק: סימון הגלוטן ישתנה',
        source: 'ynet',
        thumbnail: asset('articles/celiac-gluten-labeling-variety.png'),
        pdf: asset('articles/celiac-gluten-labeling-variety.pdf'),
      },
      {
        title: 'בדיון על המשלוחים החיים בכנסת: עבירות פליליות שעונשן מאסר',
        source: 'המקום הכי חם בגיהנום',
        thumbnail: asset('articles/live-shipments-knesset-criminal.png'),
        pdf: asset('articles/live-shipments-knesset-criminal.pdf'),
      },
      {
        title: 'לראשונה: קרקעות חקלאיות יהפכו למרחבי ריפוי ושיקום',
        source: 'ynet',
        thumbnail: asset('articles/agricultural-land-healing-spaces.png'),
        pdf: asset('articles/agricultural-land-healing-spaces.pdf'),
      },
      {
        title: 'בשורה לחולי צליאק: סימון הגלוטן במוצרי מזון ישתנה',
        source: 'נגישות ישראל',
        thumbnail: asset('articles/celiac-gluten-labeling-news.png'),
        pdf: asset('articles/celiac-gluten-labeling-news.pdf'),
      },
      {
        title: 'הרדיו האזורי: החמרה בכללי הפרסום תדון אותנו לכליה',
        source: 'גלובס',
        thumbnail: asset('articles/globes-regional-radio-advertising.png'),
        pdf: asset('articles/globes-regional-radio-advertising.pdf'),
      },
      {
        title: 'יו״ר לשכת עורכי הדין: אישור תקציב 2012 נועד לפגוע בתפקוד הלשכה',
        source: 'דה מרקר',
        thumbnail: asset('articles/themarker-bar-budget-2012.png'),
        pdf: asset('articles/themarker-bar-budget-2012.pdf'),
      },
    ] as TipArticle[],
    empty: 'פרסומים וכתבות — יתווספו בקרוב.',
  },
}

export const contact = {
  title: 'צור קשר',
  intro: 'מוכנים לדון בצרכים המשפטיים שלכם? פנו אלינו לייעוץ משפטי מקצועי.',
  address: { title: '📍 כתובת', lines: [FIRM_NAME, ' דליה 7, גבעתיים'] },
  phone: { title: '📞 טלפון', titleMobile: '📞 סלולרי', tel: '037528111', telDisplay: '03-7528111', mobile: '0522778848', mobileDisplay: '052-2778848'  },
  email: { title: '✉️ דוא"ל', address: 'harish-l@barak.net.il' },
  hours: { title: '🕐 שעות', lines: ['בתיאום מראש', 'ייעוץ מקצועי זמין'] },
  // Brevo list signup via NewsletterPopup: we POST ?isAjax=1 ourselves and
  // ignore Brevo's double-opt-in redirect so the flipbook stays open.
  newsletter: {
    title: 'הצטרפו לרשימת התפוצה',
    button: 'להרשמה לרשימת התפוצה',
    popupTitle: 'טופס הרשמה לרשימת תפוצה',
    heading: 'ניוזלטר',
    intro: 'הירשמו לניוזלטר שלנו והישארו מעודכנים',
    emailLabel: 'הזינו את כתובת האימייל שלכם כדי להירשם',
    emailPlaceholder: 'email@example.com',
    submit: 'הרשמה',
    success:
      'כמעט שם! שלחנו אימייל לאישור — לחצו על הקישור בהודעה כדי להשלים את ההרשמה.',
    error: 'לא ניתן היה לשמור את ההרשמה. נסו שוב.',
    formAction:
      'https://dfa194f2.sibforms.com/serve/MUIFANeqfrdizRaYGv2w8KMdkK2gRcckgZ88NHhe3xpbdbgrrWpEfn7FDoC_yPhWLviG1wSv65phy5imsPztao57eFJYR1XKlzKHSq0Kb5VJcEFpbGTM5xBgeCnelRwdwKOcBTxfh_0gVtOOyKRc7J_ME0kvqLc87frVq8fXiNcwttMQarmyrJgIeBQ7yYNHv95AXqH_fJ6C1EMd8g==',
  },
}

export const backCover = {
  logo: asset('contact-logo.jpg'),
  logoAlt: `${FIRM_NAME} – Harish Advocates`,
  intro: 'ליצירת קשר מיידי, תיאום פגישה או קבלת מידע נוסף לחצו על אחת האפשרויות הבאות:',
  footer: `© ${FIRM_NAME} - המידע באתר הינו כללי ואינו מהווה תחליף ליעוץ משפטי`,
  links: [
    { label: 'אינסטגרם', href: 'https://www.instagram.com/liorharish_adv?igsh=MWNsc2FjcDVxanF0NQ==', icon: 'instagram' },
    { label: 'פייסבוק', href: 'https://www.facebook.com/share/1FsDPj9un9/', icon: 'facebook' },
    {
      label: 'וואטסאפ',
      href: 'https://wa.me/972522778848?text=ברצוני לתאם פגישה',
      icon: 'whatsapp',
    },
    {
      label: 'לינקדאין',
      href: 'https://www.linkedin.com/in/lior-harish-95399622?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      icon: 'linkedin',
    },
  ] as { label: string; href: string; icon: 'instagram' | 'facebook' | 'whatsapp' | 'linkedin' }[],
}

export const pageTitles = [
  'כריכה',
  'אודות',
  'הצוות – עו״ד ליאור חריש',
  'הצוות – עו״ד איריס חריש',
  'תחומי עיסוק',
  'סרטוני מידע',
  'מאמרים ומדריכים',
  'רדיו וטלויזיה',
  'עיתונות כתובה',
  'צור קשר',
  'כריכה אחורית',
]

// Shareable deep links: opening the site with ?guide=<slug> flips the book to
// the given page index. The matching article (by its `slug`) then auto-opens
// its carousel via MediaShowcase. Keep the page index in sync with the book
// page order defined in components/Book.tsx.
export const guideDeepLinks: Record<string, { page: number }> = {
  // "מאמרים ומדריכים" page → המדריך המשפטי למשכירי דירות
  renters: { page: 6 },
}

/** Read the requested guide slug from the current URL (?guide=<slug>). */
export function readGuideSlug(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('guide')
}

/**
 * Read a direct page index from the current URL (?page=<n>). Used by the static
 * SEO landing pages (see src/content/seo.ts) to deep-link into the matching
 * flipbook spread. Returns null when absent or out of range.
 */
export function readPageParam(): number | null {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('page')
  if (raw == null) return null
  const n = Number.parseInt(raw, 10)
  if (!Number.isInteger(n) || n < 0 || n >= pageTitles.length) return null
  return n
}
