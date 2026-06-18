import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

function FaqItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq-item sr sr-d${Math.min(index + 1, 7)} ${isOpen ? 'open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.75rem',
            color: 'var(--accent)', opacity: isOpen ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {item.q}
        </span>
        <span className="faq-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className="faq-a-wrap">
        <p className="faq-a">{item.a}</p>
      </div>
    </div>
  )
}

export default function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState(0)
  const sectionRef = useScrollReveal()

  return (
    <section id="faq" ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="section-header">
          <div className="section-badge sr">{t.faq.badge}</div>
          <h2 className="section-title sr sr-d1">
            {t.faq.titleA} <span className="text-gradient">{t.faq.titleB}</span> {t.faq.titleC}
          </h2>
          <p className="section-subtitle sr sr-d2">{t.faq.subtitle}</p>
        </div>

        <div className="faq-list">
          {t.faq.items.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
