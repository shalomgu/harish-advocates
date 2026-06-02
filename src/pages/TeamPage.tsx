import { forwardRef } from 'react'
import Page from '../components/Page'
import { team } from '../content/pages'

const { lior, iris } = team

const TeamPage = forwardRef<HTMLDivElement>(function TeamPage(_props, ref) {
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

      <footer className="team-footer">
        <div className="profile-row">
          <img src={iris.photo} alt={iris.name} className="profile-photo" />
          <p className="subtitle">{iris.name}</p>
        </div>

        <div className="member-bio">
          {iris.bio.map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <h3>{iris.experienceHeading}</h3>
          <ul>
            {iris.experience.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </footer>
    </Page>
  )
})

export default TeamPage
