import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { galleryImages } from '../config/gallery'
import { useScrollReveal } from '../hooks/useScrollReveal'

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
      <button onClick={onClose} aria-label="Kapat" className="lightbox-close">✕</button>
    </div>
  )
}

function BentoTile({ item, index, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className={`bento-tile bento-${item.span} sr-scale sr-d${Math.min(index + 1, 7)}`}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Görseli büyüt"
    >
      <img
        src={item.src}
        alt=""
        loading="lazy"
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      <span className="bento-zoom-btn" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </span>
    </button>
  )
}

export default function Gallery() {
  const { t, lang } = useLang()
  const [lightbox, setLightbox] = useState(null)
  const sectionRef = useScrollReveal()
  const isEmpty = galleryImages.length === 0

  return (
    <section id="gallery" ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="section-header">
          <div className="section-badge sr">{t.gallery.badge}</div>
          <h2 className="section-title sr sr-d1">{t.gallery.title}</h2>
          <p className="section-subtitle sr sr-d2">{t.gallery.subtitle}</p>
        </div>

        {isEmpty ? (
          <div className="empty-state sr sr-d3">
            <div className="empty-state-icon">AM</div>
            <div className="font-display font-bold" style={{ fontSize: '1.1rem' }}>
              {lang === 'tr' ? 'Tasarımlar yakında' : 'Designs coming soon'}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 320 }}>
              {lang === 'tr' ? 'Yeni tasarımlar eklendikçe burada görünecek.' : 'New designs will appear here as they are added.'}
            </p>
          </div>
        ) : (
          <div className="bento-gallery">
            {galleryImages.map((item, i) => (
              <BentoTile key={item.id} item={item} index={i} onOpen={() => setLightbox(item.src)} />
            ))}
          </div>
        )}
      </div>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  )
}
