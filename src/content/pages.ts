// String table: all page copy, links and asset references, per locale.
// Edit text here; page components only handle layout.
import { asset, type Locale } from './shared'

const base = import.meta.env.BASE_URL

export interface LegalLink {
  label: string
  href: string
}

export interface CoverContent {
  logo: string
  logoAlt: string
  title: string
  taglineParts: string[]
  portrait: string
  portraitAlt: string
  author: string
  promise: string
  footer: string
}

export interface AboutContent {
  title: string
  badge: string
  paragraphs: string[]
  teamLabel: string
  teamList: string[]
}

export interface LiorProfile {
  name: string
  photo: string
  professionalHeading: string
  credentials: string[]
  experience: string[]
  casesHeading: string
  cases: string[]
  writingHeading: string
  writing: string[]
}

export interface IrisProfile {
  name: string
  photo: string
  bio: string[]
  experienceHeading: string
  experience: string[]
}

export interface TeamContent {
  title: string
  lior: LiorProfile
  iris: IrisProfile
}

export interface PracticeBlock {
  title: string
  tagline?: string
  intro?: string
  items: string[]
}

export interface PracticeContent {
  title: string
  blocks: PracticeBlock[]
}

export interface TipVideo {
  // 'video' = self-hosted MP4, true inline playback (recommended);
  // 'embed' = Instagram iframe preview (plays once, then links out — IG's own behavior);
  // 'link'  = poster tile that opens the post in a new tab;
  // 'iframe' = poster tile that opens the URL embedded inside the in-app popup.
  type: 'embed' | 'link' | 'video' | 'iframe'
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
  // Image shown on the card.
  thumbnail: string
  // Carousel slides shown in the enlarged view (image articles).
  images?: string[]
  // When set, the card opens this PDF instead of the image carousel.
  pdf?: string
  // Optional publication credit shown under the title.
  source?: string
}

export interface ShowcaseVideosContent {
  heading: string
  items: TipVideo[]
}

export interface ShowcaseArticlesContent {
  heading: string
  items: TipArticle[]
  empty?: string
}

export interface TipsContent {
  title: string
  videos: ShowcaseVideosContent
  articles: ShowcaseArticlesContent
}

export interface MediaContent {
  title: string
  videos: ShowcaseVideosContent
  articles: ShowcaseArticlesContent
}

export interface ContactContent {
  title: string
  intro: string
  address: { title: string; lines: string[] }
  phone: {
    title: string
    titleMobile: string
    tel: string
    telDisplay: string
    mobile: string
    mobileDisplay: string
  }
  email: { title: string; address: string }
  hours: { title: string; lines: string[] }
}

export interface BackCoverLink {
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'whatsapp' | 'linkedin'
}

export interface BackCoverContent {
  logo: string
  logoAlt: string
  intro: string
  footer: string
  links: BackCoverLink[]
}

export interface SiteContent {
  legalLinks: LegalLink[]
  cover: CoverContent
  about: AboutContent
  team: TeamContent
  practice: PracticeContent
  tips: TipsContent
  media: MediaContent
  contact: ContactContent
  backCover: BackCoverContent
}

// Localized social/contact links reused across locales (hrefs never change).
const socialLinks = {
  instagram: 'https://www.instagram.com/liorharish_adv?igsh=MWNsc2FjcDVxanF0NQ==',
  facebook: 'https://www.facebook.com/share/1FsDPj9un9/',
  linkedin:
    'https://www.linkedin.com/in/lior-harish-95399622?utm_source=share_via&utm_content=profile&utm_medium=member_android',
}

const he: SiteContent = {
  legalLinks: [
    { label: 'תנאי שימוש', href: `${base}terms.html` },
    { label: 'מדיניות פרטיות', href: `${base}privacy.html` },
    { label: 'הצהרת נגישות', href: `${base}accessibility.html` },
  ],
  cover: {
    logo: asset('logo-new.png'),
    logoAlt: 'חריש עורכי דין – Harish Advocates',
    title: 'חריש עורכי דין',
    taglineParts: ['יצירתיות', 'תגובתיות', 'אסטרטגיה'],
    portrait: asset('lior-harish-nobg.png'),
    portraitAlt: 'עו״ד ליאור חריש',
    author: 'עו״ד ליאור חריש – מייסד',
    promise: 'מקצועיות. אמינות. ניסיון.',
    footer: '',
  },
  about: {
    title: '',
    badge: 'חריש עורכי דין',
    paragraphs: [
      'המשרד נוסד בסוף שנת 1996 על ידי עו״ד ליאור חריש, יוצא משרד הרצוג, פוקס, נאמן ושות׳.',
      'יחודו של המשרד בשירות המקצועי, היעיל והמהיר שהוא מעניק ללקוחותיו, בקשר האישי שהוא מקפיד לקיים עימם, ובמחויבותו למצוינות חסרת פשרות.',
      'הטיפול שלנו מתאפיין בחשיבה יצירתית „מחוץ לקופסא“, הבנה יסודית של צורכי הלקוח, הקפדה על הפרטים, וליווי ותמיכה רחבים יותר מיעוץ משפטי נטו, הכוללים יעוץ אסטרטגי – כללי.',
    ],
    teamLabel: 'כיום מונה המשרד שני עורכי דין',
    teamList: ['עו״ד ליאור חריש', 'עו״ד איריס חריש'],
  },
  team: {
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
  },
  practice: {
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
    ],
  },
  tips: {
    title: 'חשוב לדעת',
    videos: {
      heading: 'סרטוני מידע',
      items: [
        { type: 'video', url: asset('videos/monopol.mp4'), label: 'מכירה וקנית דירה- מה קודם?' },
        { type: 'video', url: asset('videos/lior-likes.mp4'), label: 'עושים לייק? - תיזהרו' },
        { type: 'video', url: asset('videos/will.mp4'), label: 'על החשיבות בעריכת צוואה' },
        { type: 'video', url: asset('videos/will-diy.mp4'), label: 'צוואה – לערוך לבד?' },
        { type: 'video', url: asset('videos/yipuy-koach-mitmashech.mp4'), label: 'ייפוי כוח מתמשך' },
        { type: 'video', url: asset('videos/copy-rights.mp4'), label: 'זכויות יוצרים על רעיון' },
        { type: 'video', url: asset('videos/buying-home-in-a-bag.mp4'), label: 'טיפים לרכישת דירה מקבלן' },
      ],
    },
    articles: {
      heading: 'מאמרים ומדריכים',
      items: [
        {
          title: 'המדריך המשפטי למשכירי דירות',
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
        { title: 'על ניצול כלכלי של קשישים', source: 'דה מרקר', thumbnail: asset('articles/nizul-kshihim.png'), images: [asset('articles/nizul-kshihim.png')] },
        { title: 'כמה שווים מיליון לייקים', source: 'דה מרקר', thumbnail: asset('articles/million-likes.png'), pdf: asset('articles/million-likes.pdf') },
        { title: 'ישראל היא גן עדן לחייבים', source: 'דה מרקר', thumbnail: asset('articles/demarker-debtors-paradise.png'), pdf: asset('articles/demarker-debtors-paradise.pdf') },
        { title: 'המזומן הוגבל? העבריינים יעברו לביטקוין', source: 'דה מרקר', thumbnail: asset('articles/demarker-bitcoin-cash.png'), pdf: asset('articles/demarker-bitcoin-cash.pdf') },
        { title: 'היזהרו מ„Winter is coming“', source: 'דה מרקר', thumbnail: asset('articles/demarker-wine-dine-scam.png'), pdf: asset('articles/demarker-wine-dine-scam.pdf') },
        { title: 'מה זה עיתון?', source: 'דה מרקר', thumbnail: asset('articles/demarker-what-is-newspaper.png'), pdf: asset('articles/demarker-what-is-newspaper.pdf') },
        { title: 'חלית? הגעת לגבורות? חכה בתור', source: 'דה מרקר', thumbnail: asset('articles/wait-in-line.png'), pdf: asset('articles/wait-in-line.pdf') },
        { title: 'דרוש רובין הוד לשידורי ספורט', source: 'גלובס', thumbnail: asset('articles/globes-sports-broadcast.png'), pdf: asset('articles/globes-sports-broadcast.pdf') },
        { title: 'איומי השביתה של לשכת עורכי הדין', source: 'כלכליסט', thumbnail: asset('articles/calcalist-lawyers-strike.png'), pdf: asset('articles/calcalist-lawyers-strike.pdf') },
        { title: 'על חזירי הבר בחיפה', source: 'דה מרקר', thumbnail: asset('articles/puppies-are-dying.png'), images: [asset('articles/puppies-are-dying.png')] },
      ],
    },
  },
  media: {
    title: 'מהתקשורת',
    videos: {
      heading: 'רדיו וטלויזיה',
      items: [
        { type: 'video', url: asset('videos/binyamini-and-gueta.mp4'), label: 'ראיון בכאן 111 - 6.11.2023' },
        { type: 'video', url: asset('videos/radio-vaadat-huz.m4a'), poster: asset('videos/radio-vaadat-huz.jpeg'), label: 'ראיון כאן11-חוק כלבי שירות', audio: true },
        { type: 'iframe', url: 'https://103fm.maariv.co.il/programs/media.aspx?ZrqvnVq=EMFGKH&c41t4nzVQ=EF', label: 'ראיון ברדיו 103FM – הצעת חוק לעידוד יצור מזון לחולי צליאק', icon: 'radio' },
      ],
    },
    articles: {
      heading: 'עיתונות כתובה',
      items: [
        { title: '“The trial of Bill Burn” – myth and facts', source: 'A-LAW', thumbnail: asset('articles/bill-burn-trial.png'), pdf: asset('articles/bill-burn-trial.pdf') },
        { title: 'אדוני, אז מה אם צפוף', source: 'ynet', thumbnail: asset('articles/so-what-if-crowded.png'), pdf: asset('articles/so-what-if-crowded.pdf') },
        { title: 'תחנות הרדיו האיזורי תובעות מהמדינה פיצוי בשל הנזקים מהתחנות הפירטיות', source: 'גלובס', thumbnail: asset('articles/globes-regional-radio-pirate-damages.png'), pdf: asset('articles/globes-regional-radio-pirate-damages.pdf') },
        { title: 'בעלי חיים ברשויות המקומיות', source: 'מעריב', thumbnail: asset('articles/maariv-animals-municipalities.png'), pdf: asset('articles/maariv-animals-municipalities.pdf') },
        { title: 'התחנות האיזוריות למפקד גלי צה״ל: חידלו משידור חסויות', source: 'וואלה ברנז׳ה', thumbnail: asset('articles/walla-regional-stations-galatz.png'), pdf: asset('articles/walla-regional-stations-galatz.pdf') },
        { title: 'ועדת הכלכלה אישרה: הרשות השנייה תוכל להאריך אוטומטית את הזכיונות של תחנות הרדיו האזורי', source: 'הארץ', thumbnail: asset('articles/economy-committee-radio-licenses.png'), pdf: asset('articles/economy-committee-radio-licenses.pdf') },
        { title: 'בכנסת יוחלט על הזכיונות של הרדיו האזורי', source: 'ערוץ 7', thumbnail: asset('articles/channel7-knesset-radio-licenses.png'), pdf: asset('articles/channel7-knesset-radio-licenses.pdf') },
        { title: 'יותר מגוון לחולי הצליאק: סימון הגלוטן ישתנה', source: 'ynet', thumbnail: asset('articles/celiac-gluten-labeling-variety.png'), pdf: asset('articles/celiac-gluten-labeling-variety.pdf') },
        { title: 'בדיון על המשלוחים החיים בכנסת: עבירות פליליות שעונשן מאסר', source: 'המקום הכי חם בגיהנום', thumbnail: asset('articles/live-shipments-knesset-criminal.png'), pdf: asset('articles/live-shipments-knesset-criminal.pdf') },
        { title: 'לראשונה: קרקעות חקלאיות יהפכו למרחבי ריפוי ושיקום', source: 'ynet', thumbnail: asset('articles/agricultural-land-healing-spaces.png'), pdf: asset('articles/agricultural-land-healing-spaces.pdf') },
        { title: 'בשורה לחולי צליאק: סימון הגלוטן במוצרי מזון ישתנה', source: 'נגישות ישראל', thumbnail: asset('articles/celiac-gluten-labeling-news.png'), pdf: asset('articles/celiac-gluten-labeling-news.pdf') },
        { title: 'הרדיו האזורי: החמרה בכללי הפרסום תדון אותנו לכליה', source: 'גלובס', thumbnail: asset('articles/globes-regional-radio-advertising.png'), pdf: asset('articles/globes-regional-radio-advertising.pdf') },
        { title: 'יו״ר לשכת עורכי הדין: אישור תקציב 2012 נועד לפגוע בתפקוד הלשכה', source: 'דה מרקר', thumbnail: asset('articles/themarker-bar-budget-2012.png'), pdf: asset('articles/themarker-bar-budget-2012.pdf') },
      ],
      empty: 'פרסומים וכתבות — יתווספו בקרוב.',
    },
  },
  contact: {
    title: 'צור קשר',
    intro: 'מוכנים לדון בצרכים המשפטיים שלכם? פנו אלינו לייעוץ משפטי מקצועי.',
    address: { title: '📍 כתובת', lines: ['חריש עורכי דין', ' דליה 7, גבעתיים'] },
    phone: { title: '📞 טלפון', titleMobile: '📞 סלולרי', tel: '037528111', telDisplay: '03-7528111', mobile: '0522778848', mobileDisplay: '052-2778848' },
    email: { title: '✉️ דוא"ל', address: 'harish-l@barak.net.il' },
    hours: { title: '🕐 שעות', lines: ['בתיאום מראש', 'ייעוץ מקצועי זמין'] },
  },
  backCover: {
    logo: asset('harish-logo-contact.jpg'),
    logoAlt: 'חריש עורכי דין – Harish Advocates',
    intro: 'ליצירת קשר מיידי, תיאום פגישה או קבלת מידע נוסף לחצו על אחת האפשרויות הבאות:',
    footer: '© חריש עורכי דין - המידע באתר הינו כללי ואינו מהווה תחליף ליעוץ משפטי',
    links: [
      { label: 'אינסטגרם', href: socialLinks.instagram, icon: 'instagram' },
      { label: 'פייסבוק', href: socialLinks.facebook, icon: 'facebook' },
      { label: 'וואטסאפ', href: 'https://wa.me/972522778848?text=ברצוני לתאם פגישה', icon: 'whatsapp' },
      { label: 'לינקדאין', href: socialLinks.linkedin, icon: 'linkedin' },
    ],
  },
}

const en: SiteContent = {
  legalLinks: [
    { label: 'Terms of Use', href: `${base}terms.html` },
    { label: 'Privacy Policy', href: `${base}privacy.html` },
    { label: 'Accessibility Statement', href: `${base}accessibility.html` },
  ],
  cover: {
    logo: asset('logo-new.png'),
    logoAlt: 'Harish Advocates',
    title: 'Harish Advocates',
    taglineParts: ['Creativity', 'Responsiveness', 'Strategy'],
    portrait: asset('lior-harish-nobg.png'),
    portraitAlt: 'Adv. Lior Harish',
    author: 'Adv. Lior Harish – Founder',
    promise: 'Professionalism. Reliability. Experience.',
    footer: '',
  },
  about: {
    title: '',
    badge: 'Harish Advocates',
    paragraphs: [
      'The firm was founded in late 1996 by Adv. Lior Harish, formerly of Herzog, Fox & Neeman.',
      'The firm is distinguished by the professional, efficient and prompt service it provides to its clients, by the personal relationship it maintains with them, and by its commitment to uncompromising excellence.',
      'Our work is characterized by creative "out of the box" thinking, a thorough understanding of the client\u2019s needs, attention to detail, and support that goes beyond pure legal advice to include general strategic counsel.',
    ],
    teamLabel: 'The firm currently comprises two attorneys',
    teamList: ['Adv. Lior Harish', 'Adv. Iris Harish'],
  },
  team: {
    title: 'The Team',
    lior: {
      name: 'Adv. Lior Harish',
      photo: asset('lior-harish-speaking.png'),
      professionalHeading: 'Professional Practice',
      credentials: [
        'LLB in Law (cum laude) from Bar-Ilan University.',
        'Attorney since 1995.',
        'Certified mediator on behalf of the Courts Administration since 2001.',
        'Co-chair of the National Committee for the Protection of Animal Rights at the Israel Bar Association since 2024.',
        'Co-chair of the Forum of Israeli Attorneys for Animal Protection since 2023.',
      ],
      experience: [
        'Three years at Herzog, Fox & Neeman \u2013 attorney, intern and student (1993-96).',
        'Internship at the Tel Aviv District Court on the appeals panel (1994).',
        'Independent practice owner since 1996 (over 30 years). Specializing in communications, media and internet law, government relations and regulation, real estate, corporations, wills, inheritance and estates, labor law and animal rights.',
        'Legal counsel to the Association of Radio Stations and to regional radio stations. Intensive work in regulation and legislation for over 12 years.',
      ],
      casesHeading: 'Representative Matters:',
      cases: [
        'Leading major tenders for granting regional radio broadcasting franchises \u2013 managing the team and drafting the tenders in all their chapters.',
        'Ongoing representation of a cable television company across all practice areas, particularly communications regulation.',
        'Representing the Chair of the Israel Bar Association in administrative proceedings during the Bar elections.',
        'Representing the Tel Aviv University Student Association against the university in a landmark case to change the grading system for law faculty students.',
        'Representation in a precedent-setting labor law case that included the annulment of a collective agreement on the grounds that it was individually targeted to harm a specific employee.',
        'Representing the radio stations in a major lawsuit against the State of Israel over its failures in handling pirate radio.',
        'Representing the Second Authority as project manager in the tender for selecting external counsel for the Second Authority.',
        'Representation in proceedings to regulate elections in the Israel Ski Federation.',
        'Ongoing legal counsel to the Israel Celiac Association and to animal-welfare organizations in all aspects of their activity, including regulation and legal compliance.',
      ],
      writingHeading: 'Writing and Creative Work',
      writing: [
        'Writing opinion pieces and professional articles in the print press.',
        'Has broadcast a topical satire program on Radio Lev HaMedina for 15 years.',
        'Broadcast legal-advice programs for listeners on the Radius and Radio Tzafon stations.',
        'Broadcast a weekly legal segment on the "Radio Lelo Hafsaka" station.',
        'Wrote legal columns on labor and employment matters, published in "HaOlam HaZeh" magazine and broadcast as a legal segment on a Histadrut radio program on the Kol HaShalom station in 1991-92.',
        'Worked as a journalist for a Givatayim local paper.',
        'Wrote and published 5 children\u2019s books. One of them, "The Forest of Life," intended to instill social values in children, was used in a curriculum run by the Adam Institute for Democracy. One of the stories was included in the Ministry of Education\u2019s "Hafelopedia" project.',
      ],
    },
    iris: {
      name: 'Adv. Iris Harish',
      photo: asset('iris-harish.png'),
      bio: [
        'Born in Tel Aviv on 2 September 1968.',
        'Holds an LLB from the Faculty of Law, Bar-Ilan University, Ramat Gan + the School of Legal Studies recognized by Bar-Ilan University (1992-1996).',
        'Holds a BA (cum laude) in Behavioral Sciences (major in Psychology, minors in Anthropology and Sociology), Ben-Gurion University of the Negev (1989-1992).',
        'Licensed to practice law since 29 May 1997.',
        'Specializes in labor law, copyright and intellectual property.',
      ],
      experienceHeading: 'Work Experience:',
      experience: [
        'Worked as a student at the Poliak-Ravitz law firm, 1 Har Sinai St., Tel Aviv, in labor law (03.93-10.93).',
        'Worked as a student at the Amir Davidov law firm, 2 Kaplan St., Tel Aviv, in labor law and commercial law (11.94-03.96).',
        'Interned for six months at the Amir Davidov law firm, working mainly in labor law (03.96-09.96).',
        'Interned for six months at the Tel Aviv-Jaffa District Court with the late Honorable Judge Ephraim Shalev, working on injunctions and interim relief (09.96-03.97).',
        'Joined the firm in July 1997.',
      ],
    },
  },
  practice: {
    title: 'Practice Areas',
    blocks: [
      {
        title: 'Real Estate',
        tagline: 'Purchase, sale, leasing and transaction guidance',
        items: [
          'Purchase and sale of apartments and houses',
          'Lease agreements',
          'Developer transactions and buyer representation',
          'Title checks and land registry (Tabu) extracts',
          'Commercial transactions',
          'Real estate taxation',
        ],
      },
      {
        title: 'Commercial and Corporate Law',
        tagline: 'Contracts, business formation and commercial representation',
        items: [
          'Incorporation of companies and nonprofits',
          'Drafting and reviewing commercial contracts',
          'Partnership agreements',
          'Ongoing business counsel',
          'Purchase and sale of companies',
          'Liquidation and revival of companies',
          'Nonprofits and NPOs \u2013 formation and ongoing counsel',
        ],
      },
      {
        title: 'Inheritance and Estate Law',
        items: [
          'Enduring power of attorney',
          'Preparation of wills',
          'Obtaining inheritance orders and probate of wills',
          'Estate distribution agreements',
          'Estate administration',
        ],
      },
      {
        title: 'Communications, Media and Internet',
        items: [
          'Joint representation of broadcasting entities',
          'Handling communications tenders',
          'Intellectual property and copyright',
          'Defamation and privacy protection',
        ],
      },
      {
        title: 'Labor Law',
        tagline: 'Representing employees and employers in all employment matters',
        items: [
          'Preparing and reviewing employment agreements',
          'Counsel for employers and employees',
          'Social rights \u2014 vacation, sick leave, pension',
          'Wage withholding and wage claims',
          'Sexual harassment and workplace abuse',
          'Collective agreements and extension orders',
        ],
      },
      {
        title: 'Government Relations and Regulation',
        items: [
          'Drafting and responding to bills',
          'Guiding legislative processes',
          'Promoting projects and handling complex tenders',
          'Liaison with government and public bodies',
        ],
      },
    ],
  },
  tips: {
    title: 'Good to Know',
    videos: {
      heading: 'Informational Videos',
      items: [
        { type: 'video', url: asset('videos/monopol.mp4'), label: 'Selling and buying a home — which comes first?' },
        { type: 'video', url: asset('videos/lior-likes.mp4'), label: 'Hitting “like”? Be careful' },
        { type: 'video', url: asset('videos/will.mp4'), label: 'On the importance of making a will' },
        { type: 'video', url: asset('videos/will-diy.mp4'), label: 'A will \u2013 draft it yourself?' },
        { type: 'video', url: asset('videos/yipuy-koach-mitmashech.mp4'), label: 'Enduring power of attorney' },
        { type: 'video', url: asset('videos/copy-rights.mp4'), label: 'Copyright on an idea' },
        { type: 'video', url: asset('videos/buying-home-in-a-bag.mp4'), label: 'Tips for buying from a developer' },
      ],
    },
    articles: {
      heading: 'Articles and Guides',
      items: [
        {
          title: 'The Legal Guide for Apartment Landlords',
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
        { title: 'On the financial exploitation of the elderly', source: 'TheMarker', thumbnail: asset('articles/nizul-kshihim.png'), images: [asset('articles/nizul-kshihim.png')] },
        { title: 'How much is a million likes worth?', source: 'TheMarker', thumbnail: asset('articles/million-likes.png'), pdf: asset('articles/million-likes.pdf') },
        { title: 'Israel is a debtors\u2019 paradise', source: 'TheMarker', thumbnail: asset('articles/demarker-debtors-paradise.png'), pdf: asset('articles/demarker-debtors-paradise.pdf') },
        { title: 'Cash capped? Criminals will move to Bitcoin', source: 'TheMarker', thumbnail: asset('articles/demarker-bitcoin-cash.png'), pdf: asset('articles/demarker-bitcoin-cash.pdf') },
        { title: 'Beware of “Winter is coming”', source: 'TheMarker', thumbnail: asset('articles/demarker-wine-dine-scam.png'), pdf: asset('articles/demarker-wine-dine-scam.pdf') },
        { title: 'What is a newspaper?', source: 'TheMarker', thumbnail: asset('articles/demarker-what-is-newspaper.png'), pdf: asset('articles/demarker-what-is-newspaper.pdf') },
        { title: 'Fell ill? Reached old age? Wait in line', source: 'TheMarker', thumbnail: asset('articles/wait-in-line.png'), pdf: asset('articles/wait-in-line.pdf') },
        { title: 'A Robin Hood is needed for sports broadcasts', source: 'Globes', thumbnail: asset('articles/globes-sports-broadcast.png'), pdf: asset('articles/globes-sports-broadcast.pdf') },
        { title: 'The Bar Association\u2019s strike threats', source: 'Calcalist', thumbnail: asset('articles/calcalist-lawyers-strike.png'), pdf: asset('articles/calcalist-lawyers-strike.pdf') },
        { title: 'On the wild boars of Haifa', source: 'TheMarker', thumbnail: asset('articles/puppies-are-dying.png'), images: [asset('articles/puppies-are-dying.png')] },
      ],
    },
  },
  media: {
    title: 'In the Media',
    videos: {
      heading: 'Radio and Television',
      items: [
        { type: 'video', url: asset('videos/binyamini-and-gueta.mp4'), label: 'Interview on Kan 11 \u2013 6 Nov 2023' },
        { type: 'video', url: asset('videos/radio-vaadat-huz.m4a'), poster: asset('videos/radio-vaadat-huz.jpeg'), label: 'Kan 11 interview \u2013 service-dog law', audio: true },
        { type: 'iframe', url: 'https://103fm.maariv.co.il/programs/media.aspx?ZrqvnVq=EMFGKH&c41t4nzVQ=EF', label: 'Interview on 103FM Radio \u2013 Bill to encourage production of food for celiac patients', icon: 'radio' },
      ],
    },
    articles: {
      heading: 'Print Press',
      items: [
        { title: '“The trial of Bill Burn” – myth and facts', source: 'A-LAW', thumbnail: asset('articles/bill-burn-trial.png'), pdf: asset('articles/bill-burn-trial.pdf') },
        { title: 'Sir, so what if it\u2019s crowded', source: 'ynet', thumbnail: asset('articles/so-what-if-crowded.png'), pdf: asset('articles/so-what-if-crowded.pdf') },
        { title: 'Regional radio stations sue the State for damages caused by pirate stations', source: 'Globes', thumbnail: asset('articles/globes-regional-radio-pirate-damages.png'), pdf: asset('articles/globes-regional-radio-pirate-damages.pdf') },
        { title: 'Animals in local authorities', source: 'Maariv', thumbnail: asset('articles/maariv-animals-municipalities.png'), pdf: asset('articles/maariv-animals-municipalities.pdf') },
        { title: 'Regional stations to the Galei Tzahal commander: stop broadcasting sponsorships', source: 'Walla Branja', thumbnail: asset('articles/walla-regional-stations-galatz.png'), pdf: asset('articles/walla-regional-stations-galatz.pdf') },
        { title: 'Economic Affairs Committee approved: the Second Authority may automatically extend regional radio licenses', source: 'Haaretz', thumbnail: asset('articles/economy-committee-radio-licenses.png'), pdf: asset('articles/economy-committee-radio-licenses.pdf') },
        { title: 'The Knesset will decide on regional radio licenses', source: 'Channel 7', thumbnail: asset('articles/channel7-knesset-radio-licenses.png'), pdf: asset('articles/channel7-knesset-radio-licenses.pdf') },
        { title: 'More variety for celiac patients: gluten labeling to change', source: 'ynet', thumbnail: asset('articles/celiac-gluten-labeling-variety.png'), pdf: asset('articles/celiac-gluten-labeling-variety.pdf') },
        { title: 'At the Knesset live-shipments hearing: criminal offenses punishable by imprisonment', source: 'The Hottest Place in Hell', thumbnail: asset('articles/live-shipments-knesset-criminal.png'), pdf: asset('articles/live-shipments-knesset-criminal.pdf') },
        { title: 'For the first time: agricultural land to become healing and rehabilitation spaces', source: 'ynet', thumbnail: asset('articles/agricultural-land-healing-spaces.png'), pdf: asset('articles/agricultural-land-healing-spaces.pdf') },
        { title: 'Good news for celiac patients: gluten labeling on food products to change', source: 'Accessibility Israel', thumbnail: asset('articles/celiac-gluten-labeling-news.png'), pdf: asset('articles/celiac-gluten-labeling-news.pdf') },
        { title: 'Regional radio: stricter advertising rules will doom us', source: 'Globes', thumbnail: asset('articles/globes-regional-radio-advertising.png'), pdf: asset('articles/globes-regional-radio-advertising.pdf') },
        { title: 'Bar Association chair: approving the 2012 budget was meant to harm the Bar\u2019s functioning', source: 'TheMarker', thumbnail: asset('articles/themarker-bar-budget-2012.png'), pdf: asset('articles/themarker-bar-budget-2012.pdf') },
      ],
      empty: 'Publications and articles \u2014 coming soon.',
    },
  },
  contact: {
    title: 'Contact Us',
    intro: 'Ready to discuss your legal needs? Contact us for professional legal advice.',
    address: { title: '📍 Address', lines: ['Harish Advocates', '7 Dalia St., Givatayim'] },
    phone: { title: '📞 Phone', titleMobile: '📞 Mobile', tel: '037528111', telDisplay: '03-7528111', mobile: '0522778848', mobileDisplay: '052-2778848' },
    email: { title: '✉️ Email', address: 'harish-l@barak.net.il' },
    hours: { title: '🕐 Hours', lines: ['By appointment', 'Professional consultation available'] },
  },
  backCover: {
    logo: asset('harish-logo-contact.jpg'),
    logoAlt: 'Harish Advocates',
    intro: 'For immediate contact, to schedule a meeting or to receive more information, click one of the following options:',
    footer: '© Harish Advocates - The information on this site is general and does not constitute a substitute for legal advice',
    links: [
      { label: 'Instagram', href: socialLinks.instagram, icon: 'instagram' },
      { label: 'Facebook', href: socialLinks.facebook, icon: 'facebook' },
      { label: 'WhatsApp', href: 'https://wa.me/972522778848?text=I%20would%20like%20to%20schedule%20a%20meeting', icon: 'whatsapp' },
      { label: 'LinkedIn', href: socialLinks.linkedin, icon: 'linkedin' },
    ],
  },
}

export const content: Record<Locale, SiteContent> = { he, en }

export const pageTitles: Record<Locale, string[]> = {
  he: [
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
  ],
  en: [
    'Cover',
    'About',
    'Team – Adv. Lior Harish',
    'Team – Adv. Iris Harish',
    'Practice Areas',
    'Informational Videos',
    'Articles and Guides',
    'Radio and Television',
    'Print Press',
    'Contact',
    'Back Cover',
  ],
}

