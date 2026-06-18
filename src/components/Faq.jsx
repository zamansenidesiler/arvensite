import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

function FaqItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq-item sr sr-d${Math.min(index + 1, 7)} ${isOpen ? 'open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
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
    <section id="faq" ref={sectionRef} style={{ padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-site">

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
          <div className="section-badge sr" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            {t.faq.badge}
          </div>
          <h2
            className="font-display font-extrabold sr sr-d1"
            style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}
          >
            {t.faq.titleA} <span className="text-gradient">{t.faq.titleB}</span> {t.faq.titleC}
          </h2>
          <p className="sr sr-d2" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion */}
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
