import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Reviews() {
  const { t } = useLang()
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
          <div className="section-badge sr">{t.reviews.badge}</div>
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
            {t.reviews.items.map((review, i) => (
              <article key={i} className="review-card card-modern" role="listitem">
                <div className="review-stars" aria-label={`${t.reviews.rating} / 5`}>
                  {'★★★★★'}
                </div>
                <blockquote className="review-text">"{review.text}"</blockquote>
                <footer className="review-author font-display font-bold">{review.author}</footer>
              </article>
            ))}
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
