import { forwardRef } from 'react'
import Page from '../components/Page'
import { useLocale } from '../content/locale'

const PracticePage = forwardRef<HTMLDivElement>(function PracticePage(_props, ref) {
  const { practice } = useLocale().t
  return (
    <Page ref={ref} pageClass="practice-page" showHeader title={practice.title}>
      {practice.blocks.map((block) => (
        <article className="practice-block" key={block.title}>
          <h3>{block.title}</h3>
          {block.tagline && <p className="practice-tagline">{block.tagline}</p>}
          {block.intro && <p className="practice-intro">{block.intro}</p>}
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </Page>
  )
})

export default PracticePage
