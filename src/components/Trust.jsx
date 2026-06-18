import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

const AvatarA = ({ size = 30 }) => (
  <div
    aria-hidden="true"
    style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff',
      fontSize: size * 0.38, lineHeight: 1, flexShrink: 0,
    }}
  >A</div>
)

export default function Trust() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()
  const msgs = t.trust.messages

  return (
    <section ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="gradient-line" style={{ marginBottom: '5rem' }} />

        <div style={{ marginBottom: '3rem' }}>
          <div className="section-badge sr" style={{ marginBottom: '0.875rem' }}>{t.trust.badge}</div>
          <h2 className="section-title sr sr-d1" style={{ textAlign: 'left', maxWidth: 560 }}>
            {t.trust.title}
          </h2>
        </div>

        <div className="trust-grid">
          <div className="sr-left sr-d2 card-modern trust-chat-card">
            <div className="trust-chat-header">
              <AvatarA size={36} />
              <div style={{ flex: 1 }}>
                <div className="font-display font-bold" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                  ARVENMODS SUPPORT
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 3 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.9)',
                  }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t.trust.online}
                  </span>
                </div>
              </div>
            </div>

            <div className="trust-chat-body">
              {msgs.map((msg, i) => (
                <div
                  key={i}
                  className="sr"
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'support' ? 'row' : 'row-reverse',
                    alignItems: 'flex-end',
                    gap: '0.625rem',
                    transitionDelay: `${0.45 + i * 0.28}s`,
                  }}
                >
                  {msg.role === 'support' && <AvatarA size={28} />}

                  <div style={{ maxWidth: '76%' }}>
                    {msg.role === 'support' && (
                      <div style={{
                        fontSize: '0.56rem', fontWeight: 700,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: 'var(--accent)', marginBottom: '0.3rem',
                      }}>
                        ARVENMODS
                      </div>
                    )}

                    <div className={`trust-msg-bubble ${msg.role === 'support' ? 'trust-msg-support' : 'trust-msg-client'}`}>
                      {msg.text}
                    </div>

                    {msg.role === 'client' && (
                      <div style={{
                        textAlign: 'right', marginTop: '0.2rem',
                        fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.06em',
                      }}>
                        {t.trust.delivered}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="sr" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', transitionDelay: `${0.45 + msgs.length * 0.28}s` }}>
                <AvatarA size={28} />
                <div style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '4px 12px 12px 12px',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.22}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="trust-stats-col">
            {t.trust.stats.map((stat, i) => (
              <div key={i} className={`trust-stat-card sr-right sr-d${Math.min(i + 2, 7)}`} style={{ transitionDelay: `${0.2 + i * 0.12}s` }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: 80, height: 80,
                  background: `radial-gradient(circle at 0% 0%, ${stat.glow} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div className="font-display font-extrabold text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.25rem)', lineHeight: 1, marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div className="font-display font-bold" style={{ fontSize: '0.92rem', marginBottom: '0.375rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
