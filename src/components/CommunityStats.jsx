import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCountUp } from '../hooks/useCountUp'

function StatItem({ value, suffix = '', label, delayClass }) {
  const { ref, display } = useCountUp(value, { suffix, duration: 2000 })

  return (
    <div className={`community-stat sr ${delayClass}`}>
      <div ref={ref} className="community-stat-value font-display font-extrabold text-gradient">
        {display}
      </div>
      <div className="community-stat-label">{label}</div>
    </div>
  )
}

export default function CommunityStats() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  return (
    <section ref={sectionRef} className="community-stats-section" aria-labelledby="stats-title">
      <div className="container-site">
        <div className="section-header">
          <div className="section-badge sr">{t.community.badge}</div>
          <h2 id="stats-title" className="section-title sr sr-d1">{t.community.title}</h2>
          <p className="section-subtitle sr sr-d2">{t.community.subtitle}</p>
        </div>
        <div className="community-stats-grid">
          {t.community.stats.map((stat, i) => (
            <StatItem
              key={i}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delayClass={`sr-d${Math.min(i + 3, 7)}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
