import { socialIcons } from './socialIcons'
import { backCover } from '../content/pages'
import { shared } from '../content/shared'

/**
 * Fixed social/contact bar pinned to the screen edge on every page. Reuses the
 * same links and glyphs as the back cover so the two never drift apart.
 */
export default function QuickContact() {
  return (
    <nav className="quick-contact" aria-label={shared.quickContact}>
      <span className="quick-contact-label" aria-hidden="true">
        {shared.quickContact}
      </span>
      <ul className="quick-contact-list">
        {backCover.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`quick-contact-link quick-contact-link--${link.icon}`}
              aria-label={link.label}
              title={link.label}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                {socialIcons[link.icon]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
