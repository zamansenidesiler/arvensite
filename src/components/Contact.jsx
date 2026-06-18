import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.127 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.847L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const easeOut = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

export default function Contact() {
  const { t, lang } = useLang()

  const socials = [
    siteConfig.twitter && { href: siteConfig.twitter, icon: <TwitterIcon />, label: 'Twitter / X' },
    siteConfig.instagram && { href: siteConfig.instagram, icon: <InstagramIcon />, label: 'Instagram' },
  ].filter(Boolean)

  return (
    <section id="contact" className="section-block" style={{ paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}>
      <div className="container-site">
        <div
          className="contact-panel"
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          {/* Floating decorative orbs inside the panel */}
          <div className="contact-orb orb-1" aria-hidden="true" />
          <div className="contact-orb orb-2" aria-hidden="true" />

          <div className="section-badge" style={{ justifyContent: 'center', marginBottom: '2rem', animation: `heroFadeIn 0.7s ${easeOut} both`, animationDelay: '0.1s', position: 'relative', zIndex: 2 }}>
            {t.contact.badge}
          </div>

          <h2 className="font-display font-extrabold" style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            lineHeight: 1.25,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            position: 'relative',
            zIndex: 2,
            animation: `heroFadeUp 0.9s ${easeOut} both`,
            animationDelay: '0.2s'
          }}>
            {lang === 'tr' ? (
              <>Birlikte <span className="text-gradient">Muhteşem Şeyler</span> Yapalım</>
            ) : (
              <>Let's Create <span className="text-gradient">Something Incredible</span></>
            )}
          </h2>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 'clamp(0.875rem, 1.5vw, 1.05rem)',
            lineHeight: 1.75, maxWidth: 500, margin: '0 auto 3rem',
            animation: `heroFadeIn 0.7s ${easeOut} both`, animationDelay: '0.55s',
            position: 'relative', zIndex: 2
          }}>
            {t.contact.sub}
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
            animation: `heroFadeIn 0.6s ${easeOut} both`, animationDelay: '0.7s',
            position: 'relative', zIndex: 2
          }}>
            <a href={siteConfig.discord} target="_blank" rel="noopener noreferrer" className="btn-primary discord-pulse" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              <DiscordIcon />
              {t.contact.discord}
            </a>

            {socials.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {t.contact.or}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="btn-ghost" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem', gap: '0.5rem' }}>
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
