import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container-site">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ marginBottom: '0.6rem' }}>
              <img className="theme-logo-dark" src="/logo.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
              <img className="theme-logo-light" src="/logo-light.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 280, lineHeight: 1.6 }}>
              {t.footer.tagline}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              © {year} {siteConfig.brandName}. {t.footer.rights}
            </p>
            <a
              href="https://www.dmca.com/compliance/arvenmods.com"
              title="DMCA Compliance information for arvenmods.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dmca"
            >
              <img
                src="https://www.dmca.com/img/dmca-compliant-grayscale.png"
                alt="DMCA compliant"
                style={{ height: 24, display: 'block' }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
