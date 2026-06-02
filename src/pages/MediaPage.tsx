import { forwardRef } from 'react'
import Page from '../components/Page'
import { media } from '../content/pages'

const MediaPage = forwardRef<HTMLDivElement>(function MediaPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="media-page" showHeader title={media.title}>
      {media.sections.map((section) => (
        <section className="media-section" key={section.heading}>
          <h3>{section.heading}</h3>
          <ul className="media-links">
            {section.links.map((link) => (
              <li className="media-link" key={link.href}>
                <span className="media-link-icon" aria-hidden="true">
                  {link.icon}
                </span>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="media-section">
        <h3>{media.pressHeading}</h3>
        <p className="media-empty">{media.pressEmpty}</p>
      </section>
    </Page>
  )
})

export default MediaPage
