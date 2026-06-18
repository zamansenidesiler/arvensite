import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { galleryImages } from '../config/gallery'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Lightbox ──────────────────────────────────────────────────────────────────
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
      <img
        src={src}
        alt=""
        className="lightbox-img"
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        aria-label="Kapat"
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          width: 44, height: 44, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', fontSize: '1.1rem', cursor: 'pointer', transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.25)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
      >
        ✕
      </button>
    </div>
  )
}

// ── Bento tile ────────────────────────────────────────────────────────────────
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
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Subtle darken + zoom icon on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(6,6,16,0.45) 0%, transparent 45%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: '1rem',
      }}>
        <span style={{
          width: 38, height: 38, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(245,158,11,0.9)', color: '#1a1200', fontSize: '1rem',
          transform: hovered ? 'scale(1)' : 'scale(0.6)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>⤢</span>
      </div>
    </button>
  )
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t, lang } = useLang()
  const [lightbox, setLightbox] = useState(null)
  const sectionRef = useScrollReveal()

  const isEmpty = galleryImages.length === 0

  return (
    <section id="gallery" ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem' }}>
          <div className="section-badge sr" style={{ justifyContent: 'center', marginBottom: '0.875rem' }}>
            {t.gallery.badge}
          </div>
          <h2
            className="font-display font-extrabold sr sr-d1"
            style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}
          >
            {t.gallery.title}
          </h2>
          <p className="sr sr-d2" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {t.gallery.subtitle}
          </p>
        </div>

        {/* ── Bento grid ── */}
        {isEmpty ? (
          <div style={{
            padding: 'clamp(3rem, 7vw, 5rem) 2rem', textAlign: 'center',
            borderRadius: 18, border: '1px solid var(--border)', background: 'var(--surface)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem',
            }}>🎨</div>
            <div className="font-display font-bold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {lang === 'tr' ? 'Tasarımlar yakında' : 'Designs coming soon'}
            </div>
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
