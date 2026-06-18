import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Services() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section id="services" ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 580, margin: '0 auto 4rem' }}>
          <div className="section-badge sr" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {t.services.badge}
          </div>
          <h2
            className="font-display font-extrabold sr sr-d1"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1, marginBottom: '1rem' }}
          >
            {t.services.title}
          </h2>
          <p className="sr sr-d2" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {t.services.subtitle}
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {t.services.items.map((item, i) => (
            <div
              key={i}
              className={`service-card sr-scale sr-d${Math.min(i + 1, 7)}`}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  color: 'var(--accent)',
                  marginBottom: '1.5rem',
                }}
              >
                {item.icon}
              </div>

              <h3
                className="font-display font-bold"
                style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}
              >
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                {item.desc}
              </p>

              <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '1.25rem', color: 'rgba(245,158,11,0.45)', transition: 'color .25s' }}>
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
