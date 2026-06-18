import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

const icons = {
  delivery: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  quality: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  setup: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
}

export default function Features() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section ref={sectionRef} className="features-section" aria-labelledby="features-title">
      <div className="container-site">
        <div className="features-grid">
          {t.features.items.map((item, i) => (
            <article key={i} className={`feature-card sr sr-d${i + 1}`}>
              <div className="feature-icon">{icons[item.icon]}</div>
              <h3 className="feature-title font-display font-bold">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
