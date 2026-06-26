import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FIRM_NAME, FIRM_TAGLINE, FIRM_TITLE } from './src/content/site'

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

// `base` must match the GitHub Pages project path the app is served from.
// Final home is the existing repo -> https://shalomgu.github.io/harish-advocates/
// Override at build time with: VITE_BASE=/h-a-2/ npm run build
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/harish-advocates/',
  plugins: [react(), brandVars()],
}))
