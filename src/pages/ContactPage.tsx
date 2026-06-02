import { forwardRef } from 'react'
import Page from '../components/Page'
import { contact } from '../content/pages'

const ContactPage = forwardRef<HTMLDivElement>(function ContactPage(_props, ref) {
  return (
    <Page
      ref={ref}
      pageClass="contact-page"
      showHeader
      title={contact.title}
      showFooter
      footer={<p>{contact.footer}</p>}
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
            <br />
            {contact.phone.fax}
          </p>
        </article>

        <article className="contact-item">
          <h3>{contact.email.title}</h3>
          <p>
            <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
          </p>
        </article>

        <article className="contact-item">
          <h3>{contact.hours.title}</h3>
          <p>
            {contact.hours.lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < contact.hours.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </article>
      </div>
    </Page>
  )
})

export default ContactPage
