import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Streetwear / FiveM Stylized SVG Avatars ────────────────────────────────

const Avatar0 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#13141f" stroke="var(--accent)" strokeWidth="1.5"/>
    <path d="M22 82 C 22 62, 78 62, 78 82" fill="#242730" />
    <path d="M38 82 L 50 68 L 62 82" fill="var(--accent)" />
    <circle cx="50" cy="46" r="16" fill="#ffd0a1" />
    <rect x="37" y="42" width="26" height="7" rx="2" fill="#111" />
    <path d="M40 44 H 48 V 47 H 40 Z" fill="var(--accent)" opacity="0.85" />
    <path d="M52 44 H 60 V 47 H 52 Z" fill="var(--accent)" opacity="0.85" />
    <path d="M34 44 C 34 26, 66 26, 66 44 Z" fill="#111" />
  </svg>
)

const Avatar1 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#1b1c24" stroke="var(--accent-2)" strokeWidth="1.5"/>
    <path d="M20 85 C 20 64, 80 64, 80 85" fill="#111" />
    <circle cx="50" cy="47" r="16" fill="#e0ac69" />
    <path d="M34 50 C 34 62, 66 62, 66 50 Z" fill="#242730" />
    <line x1="50" y1="50" x2="50" y2="58" stroke="var(--accent)" strokeWidth="2" />
    <circle cx="43" cy="43" r="2.5" fill="#111" />
    <circle cx="57" cy="43" r="2.5" fill="#111" />
    <path d="M34 40 C 34 25, 66 25, 66 40 Z" fill="var(--accent)" />
    <rect x="32" y="38" width="36" height="5" rx="1.5" fill="var(--accent-glow)" />
  </svg>
)

const Avatar2 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#1c1310" stroke="var(--accent)" strokeWidth="1.5"/>
    <path d="M20 85 C 20 65, 80 65, 80 85" fill="#2d3748" />
    <circle cx="50" cy="46" r="16" fill="#c68642" />
    <path d="M34 46 C 34 28, 66 28, 66 46 Z" fill="#1a202c" />
    <path d="M32 46 H 68 V 49 H 32 Z" fill="#1a202c" />
    <rect x="30" y="38" width="5" height="12" rx="2" fill="var(--accent-2)" />
    <rect x="65" y="38" width="5" height="12" rx="2" fill="var(--accent-2)" />
    <path d="M32 38 C 32 20, 68 20, 68 38" stroke="var(--accent-2)" strokeWidth="2.5" fill="none" />
    <rect x="40" y="42" width="6" height="3" rx="1" fill="#111" />
    <rect x="54" y="42" width="6" height="3" rx="1" fill="#111" />
  </svg>
)

const Avatar3 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#0c101b" stroke="var(--accent-2)" strokeWidth="1.5"/>
    <path d="M22 82 C 22 62, 78 62, 78 82" fill="#32243d" />
    <circle cx="50" cy="47" r="16" fill="#f1c27d" />
    <circle cx="43" cy="45" r="5" stroke="#111" strokeWidth="1.5" fill="rgba(245,158,11,0.2)" />
    <circle cx="57" cy="45" r="5" stroke="#111" strokeWidth="1.5" fill="rgba(245,158,11,0.2)" />
    <line x1="48" y1="45" x2="52" y2="45" stroke="#111" strokeWidth="1.5" />
    <path d="M30 40 L 34 26 C 36 24, 64 24, 66 26 L 70 40 Z" fill="#1a202c" />
    <path d="M26 39 C 26 39, 50 43, 74 39 L 76 42 L 24 42 Z" fill="#2d3748" />
  </svg>
)

const Avatar4 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#1a1c29" stroke="var(--accent)" strokeWidth="1.5"/>
    <path d="M18 85 C 18 64, 82 64, 82 85" fill="#1a202c" />
    <path d="M35 68 L 50 85 L 65 68" fill="var(--accent)" />
    <circle cx="50" cy="45" r="16" fill="#ffd0a1" />
    <path d="M34 35 C 34 25, 66 25, 66 35 C 66 40, 34 40, 34 35 Z" fill="#D97706" />
    <rect x="32" y="34" width="36" height="4" fill="var(--accent-2)" />
    <circle cx="43" cy="44" r="2" fill="#111" />
    <circle cx="57" cy="44" r="2" fill="#111" />
  </svg>
)

const Avatar5 = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="50" cy="50" r="48" fill="#151a1e" stroke="var(--accent-2)" strokeWidth="1.5"/>
    <path d="M22 82 C 22 62, 78 62, 78 82" fill="#2c3e50" />
    <circle cx="50" cy="47" r="16" fill="#ffdbb5" />
    <rect x="37" y="42" width="26" height="6" rx="1" fill="#111" />
    <path d="M34 42 C 34 26, 66 26, 66 42 Z" fill="#111" />
    <rect x="32" y="38" width="36" height="5" rx="1" fill="#2c3e50" />
    <circle cx="50" cy="24" r="4" fill="var(--accent)" />
  </svg>
)

const avatars = [<Avatar0 />, <Avatar1 />, <Avatar2 />, <Avatar3 />, <Avatar4 />, <Avatar5 />]

// ── Review Metadata Mapping ───────────────────────────────────────────────

const reviewMeta = {
  Reese: {
    tr: 'Premium Paket',
    en: 'Premium Pack',
  },
  Blitzkrieg: {
    tr: 'Özel Ceket Tasarımı',
    en: 'Custom Jacket Design',
  },
  'BIG J-ROCC': {
    tr: 'Ekip Kombin Seti',
    en: 'Crew Clothing Set',
  },
  Luks: {
    tr: 'Mega Paket Alıcısı',
    en: 'Mega Pack Owner',
  },
  nestea: {
    tr: 'Arven Paket Alıcısı',
    en: 'Arven Pack Owner',
  },
  Spalato: {
    tr: 'Açık Kaynak Geliştirici',
    en: 'Open Source Dev',
  },
}

export default function Reviews() {
  const { t, lang } = useLang()
  const sectionRef = useScrollReveal()
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('.review-card')
    const card = cards[index]
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    setActive(index)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || t.reviews.items.length <= 1) return

    const interval = setInterval(() => {
      if (pausedRef.current) return
      setActive(prev => {
        const next = (prev + 1) % t.reviews.items.length
        scrollToIndex(next)
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [t.reviews.items.length, scrollToIndex])

  const prev = () => scrollToIndex((active - 1 + t.reviews.items.length) % t.reviews.items.length)
  const next = () => scrollToIndex((active + 1) % t.reviews.items.length)

  return (
    <section ref={sectionRef} className="section-block reviews-section" aria-labelledby="reviews-title">
      <div className="container-site">
        <div className="section-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div className="badge-skew sr">{t.reviews.badge}</div>
          </div>
          <h2 id="reviews-title" className="section-title sr sr-d1">{t.reviews.title}</h2>
          <p className="section-subtitle sr sr-d2">{t.reviews.subtitle}</p>
        </div>

        <div
          className="reviews-carousel-wrap sr sr-d3"
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          <button type="button" className="reviews-nav reviews-nav-prev" onClick={prev} aria-label={t.reviews.prev}>
            ‹
          </button>

          <div ref={trackRef} className="reviews-track" role="list">
            {t.reviews.items.map((review, i) => {
              const meta = reviewMeta[review.author] || { tr: 'Müşteri', en: 'Customer' }
              const subtitle = lang === 'tr' ? meta.tr : meta.en
              return (
                <article key={i} className="review-card card-glow-orange" role="listitem">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        {avatars[i % avatars.length]}
                      </div>
                      <div>
                        <div className="font-display font-bold" style={{ fontSize: '0.82rem', letterSpacing: '0.04em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                          {review.author}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>
                          {subtitle}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-display" style={{ fontSize: '0.82rem', fontWeight: 900, margin: 0 }}>
                        <span className="text-gradient">5</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>/5</span>
                      </p>
                    </div>
                  </div>

                  <blockquote className="review-text" style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'normal' }}>
                    "{review.text}"
                  </blockquote>
                </article>
              )
            })}
          </div>

          <button type="button" className="reviews-nav reviews-nav-next" onClick={next} aria-label={t.reviews.next}>
            ›
          </button>
        </div>

        <div className="reviews-rating-badge sr sr-d4">
          <span className="font-display font-extrabold text-gradient">{t.reviews.rating}</span>
          <span>{t.reviews.ratingLabel}</span>
        </div>
      </div>
    </section>
  )
}
