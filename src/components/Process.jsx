import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Process() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="gradient-line" style={{ marginBottom: '5rem' }} />

        <div className="section-header">
          <div className="section-badge sr">{t.process.badge}</div>
          <h2 className="section-title sr-up sr-d1">{t.process.title}</h2>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
          <div
            className="hidden md:block"
            style={{
              position: 'absolute', top: '2.35rem', left: '12%', right: '12%', height: 2,
              background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.35), rgba(251,191,36,0.45), rgba(245,158,11,0.35), transparent)',
              zIndex: 0, borderRadius: 1,
            }}
          />

          {t.process.steps.map((step, i) => (
            <div key={i} className={`step-card sr sr-d${i + 1}`}>
              <div className="step-circle">
                <div className="step-circle-inner" />
                <span className="font-display font-extrabold" style={{ fontSize: '0.9rem', color: 'var(--accent)', letterSpacing: '0.05em', position: 'relative' }}>
                  {step.num}
                </span>
              </div>
              <div className="step-text">
                <h3 className="font-display font-bold" style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.75 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
