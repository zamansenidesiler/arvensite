import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
        padding: '3rem 0',
      }}
    >
      <div className="container-site">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '0.6rem' }}>
              <img className="theme-logo-dark" src="/logo.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
              <img className="theme-logo-light" src="/logo-light.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Right side: copyright + DMCA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              © {year} {siteConfig.brandName}. {t.footer.rights}
            </p>
            <a
              href="https://www.dmca.com/compliance/arvenmods.com"
              title="DMCA Compliance information for arvenmods.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ opacity: 0.45, transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
            >
              <img
                src="https://www.dmca.com/img/dmca-compliant-grayscale.png"
                alt="DMCA compliant"
                style={{ height: 24, display: 'block', filter: 'brightness(0) invert(0.45)' }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
