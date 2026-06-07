import { forwardRef } from 'react'
import Page from '../components/Page'
import { useLocale } from '../content/locale'

const ContactPage = forwardRef<HTMLDivElement>(function ContactPage(_props, ref) {
  const { contact } = useLocale().t
  return (
    <Page
      ref={ref}
      pageClass="contact-page"
      showHeader
      title={contact.title}
    >
      <p className="contact-intro">{contact.intro}</p>

      <div className="contact-grid">
        <article className="contact-item">
          <h3>{contact.address.title}</h3>
          <p>
            {contact.address.lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < contact.address.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </article>

        <article className="contact-item">
          <h3>{contact.phone.title}</h3>
          <p>
            <a href={`tel:${contact.phone.tel}`}>{contact.phone.telDisplay}</a>
          </p>
        </article>

        <article className="contact-item">
          <h3>{contact.phone.titleMobile}</h3>
          <p>
            <a href={`tel:${contact.phone.mobile}`}>{contact.phone.mobileDisplay}</a>
          </p>
        </article>

        <article className="contact-item">
          <h3>{contact.email.title}</h3>
          <p>
            <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
          </p>
        </article>

      </div>
    </Page>
  )
})

export default ContactPage
