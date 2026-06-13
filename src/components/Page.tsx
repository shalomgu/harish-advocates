import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'

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

  const scrollRef = useRef<HTMLElement>(null)
  const [showFade, setShowFade] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      const overflow = el.scrollHeight - el.clientHeight > 2
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
      setShowFade(overflow && !atBottom)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div className={`page${isCover ? ' page--cover' : ''}`} ref={ref}>
      <div className={`page-inner${showFade ? ' show-fade' : ''}`}>
        <section ref={scrollRef} className={sectionClass}>
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
