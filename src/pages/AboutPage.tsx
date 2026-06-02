import { forwardRef } from 'react'
import Page from '../components/Page'
import { about } from '../content/pages'

const AboutPage = forwardRef<HTMLDivElement>(function AboutPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="about-page" showHeader title={about.title} badge={about.badge}>
      {about.paragraphs.map((text, i) => (
        <p key={i} className={i === 0 ? 'intro' : i === 1 ? 'values' : 'approach'}>
          {text}
        </p>
      ))}

      <div className="team">
        <p className="team-label">{about.teamLabel}</p>
        <ul className="team-list">
          {about.teamList.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </Page>
  )
})

export default AboutPage
