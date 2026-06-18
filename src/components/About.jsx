import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Click-to-play YouTube facade — loads the heavy iframe only on demand
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
          <span className="video-play"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
        </button>
      )}
    </div>
  )
}

function StatCard({ value, suffix, label, delay }) {
  const numRef = useRef(null)

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    const obj = { val: 0 }
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 1.8,
          delay: delay || 0,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix
          },
        })
      },
    })

    return () => trigger.kill()
  }, [value, suffix, delay])

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={numRef}
        className="font-display font-extrabold text-gradient"
        style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1 }}
      >
        0{suffix}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginTop: '0.625rem',
          lineHeight: 1.35,
        }}
      >
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
    <section id="about" ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}
        >
          {/* Visual side — YouTube showcase video */}
          <VideoShowcase />

          {/* Text side */}
          <div>
            <div className="section-badge sr" style={{ marginBottom: '1.5rem' }}>
              {t.about.badge}
            </div>
            <h2
              className="font-display font-bold sr sr-d1"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
              }}
            >
              {t.about.title}
            </h2>
            <p
              className="sr sr-d2"
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '0.95rem',
                marginBottom: '1rem',
              }}
            >
              {t.about.p1}
            </p>
            <p
              className="sr sr-d3"
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '0.95rem',
                marginBottom: '3rem',
              }}
            >
              {t.about.p2}
            </p>

            {/* Stats */}
            <div
              className="about-stats-row sr sr-d4"
              style={{
                display: 'flex',
                borderRadius: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                    background: i === 0
                      ? 'linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)'
                      : i === 1
                      ? 'linear-gradient(to right, transparent, rgba(251,191,36,0.4), transparent)'
                      : 'linear-gradient(to right, transparent, rgba(245,158,11,0.3), transparent)',
                  }} />
                  <StatCard value={s.value} suffix={s.suffix} label={s.label} delay={s.delay} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
