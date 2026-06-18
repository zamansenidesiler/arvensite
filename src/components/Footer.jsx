import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'

// ── SVG Icons ──────────────────────────────────────────────────────────────

const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const DiscordIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.127 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container-site">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <img className="theme-logo-dark" src="/logo.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
              <img className="theme-logo-light" src="/logo-light.webp" alt="arvenmods" style={{ height: 34, width: 'auto' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 280, lineHeight: 1.6 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="footer-col-title">{t.footer.colLegal}</h4>
            <ul className="footer-links">
              <li>
                <a href="https://checkout.tebex.io/terms" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href="https://www.tebex.io/terms-creator-agreement/privacy-policy" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="https://checkout.tebex.io/impressum" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  {t.footer.impressum}
                </a>
              </li>
            </ul>
          </div>

          {/* Socials Col */}
          <div>
            <h4 className="footer-col-title">{t.footer.colSocials}</h4>
            <ul className="footer-links">
              <li>
                <a href="https://youtube.com/@arvenmods" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  <YoutubeIcon />
                  {t.footer.youtube}
                </a>
              </li>
              <li>
                <a href="https://instagram.com/arvenmods" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  <InstagramIcon />
                  {t.footer.instagram}
                </a>
              </li>
              <li>
                <a href="https://github.com/zezedeyeter/arvensite" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  <GithubIcon />
                  {t.footer.github}
                </a>
              </li>
              <li>
                <a href={siteConfig.discord} target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  <DiscordIcon />
                  {t.footer.discord}
                </a>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="footer-col-title">{t.footer.colSupport}</h4>
            <ul className="footer-links">
              <li>
                <a href={siteConfig.discord} target="_blank" rel="noopener noreferrer" className="footer-link-item">
                  {t.footer.ticketSupport}
                </a>
              </li>
              <li>
                <a href="#" className="footer-link-item">
                  {t.footer.documentation}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and DMCA compliance */}
        <div className="footer-bottom">
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            © {year} {siteConfig.brandName}. {t.footer.rights}
          </p>

          <a
            href="https://www.dmca.com/compliance/arvenmods.com"
            title="DMCA Compliance information for arvenmods.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-dmca"
            style={{ opacity: 0.5, transition: 'opacity 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.95' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.5' }}
          >
            <img
              src="https://www.dmca.com/img/dmca-compliant-grayscale.png"
              alt="DMCA compliant"
              style={{ height: 22, display: 'block' }}
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
