import { forwardRef } from 'react'
import Page from '../components/Page'
import { useLocale } from '../content/locale'

const IrisPage = forwardRef<HTMLDivElement>(function IrisPage(_props, ref) {
  const { team } = useLocale().t
  const { iris } = team
  return (
    <Page ref={ref} pageClass="team-page" showHeader title={team.title}>
      <div className="profile-row">
        <img src={iris.photo} alt={iris.name} className="profile-photo" />
        <p className="subtitle">{iris.name}</p>
      </div>

      <section className="content-section">
        <div className="member-bio">
          {iris.bio.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <h3>{iris.experienceHeading}</h3>
        <ul>
          {iris.experience.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </Page>
  )
})

export default IrisPage
