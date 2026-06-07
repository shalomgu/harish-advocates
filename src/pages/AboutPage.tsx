import { forwardRef } from 'react'
import Page from '../components/Page'
import { useLocale } from '../content/locale'

const AboutPage = forwardRef<HTMLDivElement>(function AboutPage(_props, ref) {
  const { about } = useLocale().t
  return (
    <Page ref={ref} pageClass="about-page" showHeader title={about.title} badge={about.badge}>
      {about.paragraphs.map((text, i) => (
        <p key={i} className={i === 0 ? 'intro' : i === 1 ? 'values' : 'approach'}>
          {text}
        </p>
      ))}

      <p className="team-label">{about.teamLabel}</p>
      <div className="team">
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
