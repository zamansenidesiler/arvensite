import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Services() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section id="services" ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="section-header">
          <div className="section-badge sr">{t.services.badge}</div>
          <h2 className="section-title sr sr-d1">{t.services.title}</h2>
          <p className="section-subtitle sr sr-d2">{t.services.subtitle}</p>
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {t.services.items.map((item, i) => (
            <div key={i} className={`service-card sr-scale sr-d${Math.min(i + 1, 7)}`}>
              <div className="service-icon">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-display font-bold" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                {item.desc}
              </p>
              <div className="service-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
