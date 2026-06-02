import { forwardRef } from 'react'
import Page from '../components/Page'
import { tips } from '../content/pages'

const TipsPage = forwardRef<HTMLDivElement>(function TipsPage(_props, ref) {
  return (
    <Page ref={ref} pageClass="tips-page" showHeader title={tips.title} subtitle={tips.subtitle}>
      <div className="tips-list">
        {tips.cards.map((card) => (
          <article className="tip-card" key={card.title}>
            <span className="tip-icon" aria-hidden="true">
              {card.icon}
            </span>
            <div className="tip-body">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
})

export default TipsPage
