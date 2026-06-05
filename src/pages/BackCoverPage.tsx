import { forwardRef } from 'react'
import Page from '../components/Page'
import { backCover, cover } from '../content/pages'

const socialIcons: Record<string, JSX.Element> = {
  instagram: (
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.8 6a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17.8 6z" />
  ),
  facebook: (
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  ),
  whatsapp: (
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91a9.85 9.85 0 0 0 1.35 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91A9.91 9.91 0 0 0 12.04 2zm5.8 14.06c-.25.69-1.45 1.32-1.99 1.37-.53.05-1.03.24-3.47-.72-2.93-1.16-4.8-4.15-4.95-4.34-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.3.59-.37.78-.37l.56.01c.18.01.42-.07.66.5.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.71.81 2 .96.3.15.5.22.57.34.07.13.07.74-.18 1.43z" />
  ),
  linkedin: (
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.86H5.56v8.48h2.78zM6.95 8.62a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22zm11.39 9.72v-4.65c0-2.49-1.33-3.65-3.1-3.65a2.68 2.68 0 0 0-2.43 1.33h-.04V9.86h-2.78v8.48h2.78v-4.2c0-1.1.21-2.17 1.58-2.17s1.36 1.26 1.36 2.24v4.13h2.85z" />
  ),
}

const BackCoverPage = forwardRef<HTMLDivElement>(function BackCoverPage(_props, ref) {
  return (
    <Page 
    ref={ref} 
    variant="backcover"
    showFooter
    footer={<p>className="cover-footer" {backCover.footer}</p>}
    >
      <div className="back-cover-logo-wrap">
      <img src={cover.logo} alt={cover.logoAlt} className="cover-logo" />
      </div>

      <p className="back-cover-intro">{backCover.intro}</p>

      <ul className="back-cover-links">
        {backCover.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <span className={`back-cover-link-icon back-cover-link-icon--${link.icon}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  {socialIcons[link.icon]}
                </svg>
              </span>
              <span className="back-cover-link-label">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </Page>
  )
})

export default BackCoverPage
