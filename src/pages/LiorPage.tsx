import { forwardRef } from 'react'
import Page from '../components/Page'
import { team } from '../content/pages'

const { lior } = team

const LiorPage = forwardRef<HTMLDivElement>(function LiorPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="team-page" showHeader title={team.title}>
      <div className="profile-row">
        <img src={lior.photo} alt={lior.name} className="profile-photo" />
        <p className="subtitle">{lior.name}</p>
      </div>

      <section className="content-section">
        <h3>{lior.professionalHeading}</h3>
        <ul className="credentials-list">
          {lior.credentials.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <ul>
          {lior.experience.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <h4>{lior.casesHeading}</h4>
        <ul className="cases-list">
          {lior.cases.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="content-section">
        <h3>{lior.writingHeading}</h3>
        <ul>
          {lior.writing.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </Page>
  )
})

export default LiorPage
