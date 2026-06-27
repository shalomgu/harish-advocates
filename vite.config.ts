import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FIRM_NAME, FIRM_TAGLINE, FIRM_TITLE } from './src/content/site'
import {
  ORIGIN,
  pageUrl,
  seoPagesData,
  type SeoLink,
  type SeoPage,
} from './src/content/seo'

// Central brand strings (src/content/site.ts) injected wherever these
// placeholders appear, so the firm name/tagline live in exactly one place:
//   %FIRM_NAME%    -> "חריש עורכי דין"
//   %FIRM_TAGLINE% -> "משרד עורכי דין בגבעתיים"
//   %FIRM_TITLE%   -> "<name> | <tagline>"
const applyBrand = (s: string): string =>
  s
    .replaceAll('%FIRM_TITLE%', FIRM_TITLE)
    .replaceAll('%FIRM_TAGLINE%', FIRM_TAGLINE)
    .replaceAll('%FIRM_NAME%', FIRM_NAME)

// Static files in public/ that may contain the placeholders above.
const BRAND_EXTENSIONS = new Set(['.html', '.webmanifest', '.svg', '.xml', '.txt'])
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name)
      return e.isDirectory() ? walk(full) : Promise.resolve([full])
    }),
  )
  return files.flat()
}

function brandVars(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'html-brand-vars',
    configResolved(resolved) {
      config = resolved
    },
    // 1) The bundled entry HTML.
    transformIndexHtml(html) {
      return applyBrand(html)
    },
    // 2) Dev server: substitute on the fly when public files are requested.
    // Registered at the front of the stack so it runs before Vite's own static
    // (public dir) middleware, which would otherwise serve the raw file first.
    configureServer(server) {
      const handle = async (
        req: { url?: string },
        res: import('node:http').ServerResponse,
        next: (err?: unknown) => void,
      ) => {
        try {
          const url = (req.url ?? '').split('?')[0]
          let pathname = decodeURIComponent(url)
          if (config.base !== '/' && pathname.startsWith(config.base)) {
            pathname = '/' + pathname.slice(config.base.length)
          }
          const ext = path.extname(pathname)
          if (!BRAND_EXTENSIONS.has(ext) || pathname.endsWith('/index.html')) {
            return next()
          }
          const file = path.join(config.publicDir, pathname)
          if (!file.startsWith(config.publicDir)) return next()
          const raw = await fs.readFile(file, 'utf8').catch(() => null)
          if (raw == null) return next()
          res.setHeader('Content-Type', CONTENT_TYPES[ext] ?? 'text/plain; charset=utf-8')
          res.end(applyBrand(raw))
        } catch {
          next()
        }
      }
      server.middlewares.stack.unshift({ route: '', handle: handle as never })
    },
    // 3) Production build: rewrite the copied public files in the output dir.
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const exists = await fs.stat(outDir).then(() => true).catch(() => false)
      if (!exists) return
      const files = await walk(outDir)
      await Promise.all(
        files
          .filter((f) => BRAND_EXTENSIONS.has(path.extname(f)))
          .map(async (f) => {
            const raw = await fs.readFile(f, 'utf8')
            if (raw.includes('%FIRM_')) await fs.writeFile(f, applyBrand(raw))
          }),
      )
    },
  }
}

// --- Static SEO landing pages -------------------------------------------------
// Generate one standalone, crawlable HTML page per topic (defined in
// src/content/seo.ts) into the build output. These are plain content pages (not
// the React flipbook) so search engines and social scrapers get focused,
// keyword-rich content at distinct URLs, each linking back into the flipbook.

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// JSON-LD embedded in <script>: escape "<" so a stray "</script>" in the data
// can never break out of the tag.
const jsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')

const SEO_STYLES = `
  :root{--navy:#062642;--navy-dark:#031729;--gold:#c7a24a;--ink:#1f2a36}
  *{box-sizing:border-box}
  body{margin:0;font-family:'Heebo',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);background:radial-gradient(circle at 50% -10%,#0b3154 0%,var(--navy) 45%,var(--navy-dark) 100%);min-height:100vh;line-height:1.7}
  .wrap{max-width:820px;margin:0 auto;padding:clamp(20px,5vw,56px) clamp(16px,5vw,40px) 64px}
  .crumbs{color:rgba(255,255,255,.8);font-size:13px;margin-bottom:14px}
  .crumbs a{color:#e6c878;text-decoration:none}
  .crumbs a:hover{text-decoration:underline}
  .card{background:#fff;border-radius:18px;box-shadow:0 22px 60px rgba(3,23,41,.35);overflow:hidden}
  .card-head{background:linear-gradient(180deg,#0b3154,var(--navy));color:#fff;padding:clamp(24px,5vw,40px);text-align:center;border-bottom:4px solid var(--gold)}
  .card-head h1{margin:0;font-size:clamp(22px,4.6vw,32px);font-weight:900;letter-spacing:.02em}
  .card-head p{margin:10px 0 0;color:#e6c878;font-weight:600;font-size:clamp(13px,2.4vw,16px)}
  .card-body{padding:clamp(22px,5vw,44px)}
  .lede p{font-size:clamp(15px,2.8vw,18px);margin:0 0 12px}
  .card-body h2{color:var(--navy);font-size:clamp(16px,3.2vw,21px);margin:26px 0 8px;padding-bottom:8px;border-bottom:1px solid rgba(199,162,74,.4)}
  .card-body p{margin:0 0 12px;font-size:clamp(14px,2.6vw,16px)}
  .card-body ul{margin:0 0 14px;padding-inline-start:22px;font-size:clamp(14px,2.6vw,16px)}
  .card-body li{margin-bottom:5px}
  .cta{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:11px 22px;border-radius:999px;background:var(--navy);color:#fff;font-weight:700;text-decoration:none;font-size:15px;border:1px solid var(--gold)}
  .cta:hover{background:#0b3154}
  .related{margin-top:30px}
  .related h2{margin-bottom:10px}
  .related ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
  .related a{display:inline-block;padding:7px 14px;border-radius:999px;background:#f1f5fa;color:var(--navy);text-decoration:none;font-weight:600;font-size:14px;border:1px solid #dbe5f0}
  .related a:hover{background:#e3edf7}
  footer{margin-top:28px;text-align:center;color:rgba(255,255,255,.7);font-size:clamp(11px,2.2vw,13px)}
  footer a{color:#e6c878}
`

const renderSection = (s: SeoPage['sections'][number]): string => {
  const parts = [`<h2>${esc(s.heading)}</h2>`]
  for (const p of s.paragraphs ?? []) parts.push(`<p>${esc(p)}</p>`)
  if (s.items?.length) {
    parts.push('<ul>')
    for (const item of s.items) parts.push(`<li>${esc(item)}</li>`)
    parts.push('</ul>')
  }
  return parts.join('\n          ')
}

const renderLinks = (links: SeoLink[]): string =>
  links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('\n            ')

function renderSeoPage(page: SeoPage): string {
  const url = pageUrl(page.slug)
  const ogImage = `${ORIGIN}/assets/og-image.png`
  const crumbTrail = [...page.breadcrumb, { label: page.h1, href: url }]

  // BreadcrumbList structured data built from the page's trail.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbTrail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href,
    })),
  }

  const crumbsHtml = page.breadcrumb
    .map((c) => `<a href="${esc(c.href)}">${esc(c.label)}</a>`)
    .join(' / ')

  const ldScripts = [...page.jsonLd, breadcrumbLd]
    .map((d) => `<script type="application/ld+json">${jsonLd(d)}</script>`)
    .join('\n    ')

  return `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="author" content="${esc(FIRM_NAME)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="theme-color" content="#064a96" />
    <link rel="canonical" href="${esc(url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(FIRM_NAME)}" />
    <meta property="og:locale" content="he_IL" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap"
      rel="stylesheet"
    />
    ${ldScripts}
    <style>${SEO_STYLES}</style>
  </head>
  <body>
    <div class="wrap">
      <nav class="crumbs" aria-label="ניווט מסלול">
        ${crumbsHtml} / <span aria-current="page">${esc(page.h1)}</span>
      </nav>
      <article class="card">
        <header class="card-head">
          <h1>${esc(page.h1)}</h1>
          <p>${esc(FIRM_NAME)} · ${esc(FIRM_TAGLINE)}</p>
        </header>
        <div class="card-body">
          <div class="lede">
            ${page.intro.map((p) => `<p>${esc(p)}</p>`).join('\n            ')}
          </div>
          ${page.sections.map(renderSection).join('\n          ')}
          <p><a class="cta" href="${esc(page.cta.href)}">${esc(page.cta.label)}</a></p>
          <nav class="related" aria-label="קישורים נוספים">
            <h2>מידע נוסף</h2>
            <ul>
            ${renderLinks(page.related)}
            </ul>
          </nav>
        </div>
      </article>
      <footer>
        © ${esc(FIRM_NAME)} · <a href="${ORIGIN}/">חזרה לדף הבית</a> · המידע באתר הינו כללי ואינו מהווה תחליף לייעוץ משפטי
      </footer>
    </div>
  </body>
</html>
`
}

// Static URLs that live in public/sitemap.xml; regenerated alongside the
// landing pages so the sitemap always lists everything that ships.
const STATIC_SITEMAP: { loc: string; changefreq: string; priority: string }[] = [
  { loc: `${ORIGIN}/`, changefreq: 'monthly', priority: '1.0' },
  { loc: `${ORIGIN}/terms.html`, changefreq: 'yearly', priority: '0.3' },
  { loc: `${ORIGIN}/privacy.html`, changefreq: 'yearly', priority: '0.3' },
  { loc: `${ORIGIN}/accessibility.html`, changefreq: 'yearly', priority: '0.3' },
]

function renderSitemap(): string {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [
    ...STATIC_SITEMAP,
    ...seoPagesData.map((p) => ({
      loc: pageUrl(p.slug),
      changefreq: 'monthly',
      priority: p.slug === 'services/' ? '0.8' : '0.7',
    })),
  ]
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function seoPages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'seo-landing-pages',
    configResolved(resolved) {
      config = resolved
    },
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const exists = await fs.stat(outDir).then(() => true).catch(() => false)
      if (!exists) return
      await Promise.all(
        seoPagesData.map(async (page) => {
          const dir = path.join(outDir, page.slug)
          await fs.mkdir(dir, { recursive: true })
          await fs.writeFile(path.join(dir, 'index.html'), renderSeoPage(page))
        }),
      )
      await fs.writeFile(path.join(outDir, 'sitemap.xml'), renderSitemap())
    },
  }
}

// `base` must match the GitHub Pages project path the app is served from.
// Final home is the existing repo -> https://shalomgu.github.io/harish-advocates/
// Override at build time with: VITE_BASE=/h-a-2/ npm run build
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/harish-advocates/',
  // seoPages() runs after brandVars() so its sitemap.xml write is the final one.
  plugins: [react(), brandVars(), seoPages()],
}))
