import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCountUp } from '../hooks/useCountUp'

function VideoShowcase() {
  const [playing, setPlaying] = useState(false)
  const id = siteConfig.videoId

  return (
    <div className="sr-left video-frame">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title="Arvenmods showcase"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      ) : (
        <button className="video-facade" onClick={() => setPlaying(true)} aria-label="Videoyu oynat">
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            onError={e => { e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }}
          />
          <span className="video-play">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </button>
      )}
    </div>
  )
}

function StatCard({ value, suffix, label, delay }) {
  const { ref, display } = useCountUp(value, { suffix, duration: 1800, delay })

  return (
    <div className="about-stat-cell">
      <div
        ref={ref}
        className="font-display font-extrabold text-gradient"
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {display}
      </div>
      <div style={{
        fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-secondary)',
        marginTop: '0.625rem', lineHeight: 1.35,
      }}>
        {label}
      </div>
    </div>
  )
}

export default function About() {
  const { t } = useLang()
  const sectionRef = useScrollReveal()

  const stats = [
    { ...t.about.stat1, delay: 0 },
    { ...t.about.stat2, delay: 0.15 },
    { ...t.about.stat3, delay: 0.3 },
  ]

  return (
    <section id="about" ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <VideoShowcase />

          <div>
            <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
              <div className="badge-skew sr">{t.about.badge}</div>
            </div>
            <h2 className="section-title sr sr-d1" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              {t.about.title}
            </h2>
            <p className="section-subtitle sr sr-d2" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {t.about.p1}
            </p>
            <p className="section-subtitle sr sr-d3" style={{ textAlign: 'left', marginBottom: '3rem' }}>
              {t.about.p2}
            </p>

            <div className="about-stats-panel about-stats-row sr sr-d4">
              {stats.map((s, i) => (
                <StatCard key={i} value={s.value} suffix={s.suffix} label={s.label} delay={s.delay} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
