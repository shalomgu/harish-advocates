import { forwardRef, type ReactNode } from 'react'

type Variant = 'cover' | 'content' | 'backcover'

export interface PageProps {
  /** Page-specific modifier class, e.g. "about-page". */
  pageClass?: string
  variant?: Variant
  showHeader?: boolean
  showFooter?: boolean
  title?: string
  badge?: string
  subtitle?: string
  footer?: ReactNode
  children?: ReactNode
}

/**
 * Shared page layout. Forwards its ref to the outer `.page` element so
 * react-pageflip can register it as a flippable sheet. Header and footer are
 * opt-in via props, so cover/back-cover can omit them.
 */
const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { pageClass = '', variant = 'content', showHeader = false, showFooter = false, title, badge, subtitle, footer, children },
  ref,
) {
  const isCover = variant !== 'content'
  const sectionClass =
    variant === 'content'
      ? `placeholder-page content-page ${pageClass}`.trim()
      : `placeholder-page ${variant === 'cover' ? 'cover-page' : 'back-cover-page'} ${pageClass}`.trim()

  return (
    <div className={`page${isCover ? ' page--cover' : ''}`} ref={ref}>
      <div className="page-inner">
        <section className={sectionClass}>
          {showHeader && (
            <header className="page-header">
              {title && <h2>{title}</h2>}
              {badge && <span className="firm-badge">{badge}</span>}
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </header>
          )}
          {children}
          {showFooter && footer && <footer className="page-footer">{footer}</footer>}
        </section>
      </div>
    </div>
  )
})

export default Page
