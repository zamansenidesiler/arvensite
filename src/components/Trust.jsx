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
    <section ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">

        {/* Divider */}
        <div className="gradient-line" style={{ marginBottom: '5rem' }} />

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-badge sr" style={{ marginBottom: '0.875rem' }}>
            {t.trust.badge}
          </div>
          <h2
            className="font-display font-extrabold sr sr-d1"
            style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', lineHeight: 1.1, maxWidth: 560 }}
          >
            {t.trust.title}
          </h2>
        </div>

        {/* Bento grid */}
        <div className="trust-grid">

          {/* ── Chat card — slides from left ── */}
          <div
            className="sr-left sr-d2"
            style={{
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}
          >
            {/* Title bar */}
            <div style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-hover)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {['rgba(255,90,90,0.55)', 'rgba(255,190,0,0.55)', 'rgba(50,215,75,0.55)'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, height: 22, borderRadius: 6,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  arvenmods.com / support
                </span>
              </div>
            </div>

            {/* Chat header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <AvatarA size={36} />
              <div style={{ flex: 1 }}>
                <div
                  className="font-display font-bold"
                  style={{ fontSize: '0.82rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}
                >
                  ARVENMODS SUPPORT
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 3 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px rgba(34,197,94,0.9)',
                  }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t.trust.online}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages — staggered via inline transition-delay */}
            <div
              className="trust-chat-body"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
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

                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: msg.role === 'support'
                        ? '2px 14px 14px 14px'
                        : '14px 2px 14px 14px',
                      background: msg.role === 'support'
                        ? 'var(--surface-hover)'
                        : 'linear-gradient(135deg, rgba(146,64,0,0.92) 0%, rgba(180,100,0,0.96) 100%)',
                      border: msg.role === 'support'
                        ? '1px solid var(--border)'
                        : '1px solid rgba(245,158,11,0.3)',
                      fontSize: '0.875rem',
                      lineHeight: 1.65,
                      color: msg.role === 'support' ? 'var(--text-primary)' : '#fff',
                    }}>
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

              {/* Typing indicator */}
              <div
                className="sr"
                style={{
                  display: 'flex', alignItems: 'flex-end', gap: '0.625rem',
                  transitionDelay: `${0.45 + msgs.length * 0.28}s`,
                }}
              >
                <AvatarA size={28} />
                <div style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '2px 12px 12px 12px',
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

          {/* ── Stat cards — slide from right with stagger ── */}
          <div className="trust-stats-col">
            {t.trust.stats.map((stat, i) => (
              <div
                key={i}
                className="sr-right"
                style={{
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  padding: '1.625rem',
                  position: 'relative', overflow: 'hidden',
                  transitionDelay: `${0.2 + i * 0.12}s`,
                }}
              >
                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: 80, height: 80,
                  background: `radial-gradient(circle at 0% 0%, ${stat.glow} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div
                  className="font-display font-extrabold"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    marginBottom: '0.5rem',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-display font-bold"
                  style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}
                >
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
