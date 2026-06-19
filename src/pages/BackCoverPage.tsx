import { forwardRef } from 'react'
import Page from '../components/Page'
import LegalLinks from '../components/LegalLinks'
import { socialIcons } from '../components/socialIcons'
import { backCover, cover } from '../content/pages'

const BackCoverPage = forwardRef<HTMLDivElement>(function BackCoverPage(_props, ref) {
  return (
    <Page 
    ref={ref} 
    variant="backcover"
    showFooter
    footer={
      <>
        <LegalLinks className="legal-links--backcover" />
        <p className="cover-footer back-cover-footer">{backCover.footer}</p>
      </>
    }
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
