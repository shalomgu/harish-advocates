import { forwardRef } from 'react'
import Page from '../components/Page'
import { backCover, cover } from '../content/pages'

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

      <ul className="back-cover-links">
        {backCover.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Page>
  )
})

export default BackCoverPage
