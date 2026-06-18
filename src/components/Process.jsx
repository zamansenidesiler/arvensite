import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Process() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">

        {/* Divider */}
        <div className="gradient-line" style={{ marginBottom: '8rem' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-badge sr" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            {t.process.badge}
          </div>
          <h2
            className="font-display font-extrabold sr-up sr-d1"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1 }}
          >
            {t.process.title}
          </h2>
        </div>

        {/* Steps */}
        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            position: 'relative',
          }}
        >
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              top: '2.2rem',
              left: '12%',
              right: '12%',
              height: 1,
              background: 'linear-gradient(to right, rgba(245,158,11,0.2), rgba(251,191,36,0.3), rgba(245,158,11,0.2))',
              zIndex: 0,
            }}
          />

          {t.process.steps.map((step, i) => (
            <div
              key={i}
              className={`step-card sr sr-d${i + 1}`}
            >
              {/* Number circle */}
              <div className="step-circle">
                <div
                  style={{
                    position: 'absolute',
                    inset: 4,
                    borderRadius: '50%',
                    background: 'rgba(245,158,11,0.07)',
                  }}
                />
                <span
                  className="font-display font-extrabold"
                  style={{ fontSize: '0.9rem', color: 'var(--accent)', letterSpacing: '0.05em', position: 'relative' }}
                >
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <div className="step-text">
                <h3
                  className="font-display font-bold"
                  style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}
                >
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
