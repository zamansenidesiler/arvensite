import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { scrollToSection } from '../utils/scrollTo'
import { useTilt } from '../hooks/useTilt'

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function PricingCard({ pack, variant, delayClass }) {
  const isFeatured = variant === 'featured'
  const tilt = useTilt()

  return (
    <article
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`pricing-card card-glow-orange ${isFeatured ? 'pricing-card-featured' : ''} tilt-card sr-scale ${delayClass}`}
    >
      <div className="pricing-card-body">
        <span className="pricing-pack-label">{pack.name}</span>
        <div className="pricing-price-row">
          <span className="pricing-price">{pack.price}</span>
          <span className="pricing-period">{pack.period}</span>
        </div>
        <p className="pricing-desc">{pack.desc}</p>
        <ul className="pricing-features">
          {pack.features.map((feature, i) => (
            <li key={i}>
              <span className="pricing-check" aria-hidden="true"><CheckIcon /></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <a
        href={siteConfig.discord}
        target="_blank"
        rel="noopener noreferrer"
        className="pricing-cta"
      >
        {pack.cta}
      </a>
    </article>
  )
}

export default function Pricing() {
  const { t } = useLang()
  const [openSource, setOpenSource] = useState(false)
  const sectionRef = useScrollReveal()

  const packs = openSource ? t.pricing.openSource : t.pricing.escrow

  return (
    <section id="pricing" ref={sectionRef} className="section-block">
      <div className="container-site">
        <div className="section-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div className="badge-skew sr">{t.pricing.badge}</div>
          </div>
          <h2 className="section-title sr sr-d1">{t.pricing.title}</h2>
          <p className="section-subtitle sr sr-d2">{t.pricing.subtitle}</p>
        </div>

        <div className="pricing-toggle-wrap sr sr-d3">
          <span className={`pricing-toggle-label ${!openSource ? 'active' : ''}`}>
            {t.pricing.toggleEscrow}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={openSource}
            aria-label={t.pricing.toggleLabel}
            className={`pricing-toggle ${openSource ? 'on' : ''}`}
            onClick={() => setOpenSource(v => !v)}
          >
            <span className="pricing-toggle-knob" />
          </button>
          <span className={`pricing-toggle-label ${openSource ? 'active' : ''}`}>
            {t.pricing.toggleOpen}
          </span>
        </div>

        <div className="pricing-grid">
          <PricingCard pack={packs[0]} variant="default" delayClass="sr-d4" />
          <PricingCard pack={packs[1]} variant="featured" delayClass="sr-d5" />
        </div>

        <p className="pricing-footer-note sr sr-d6">
          {t.pricing.corporate}{' '}
          <button type="button" className="pricing-contact-link" onClick={() => scrollToSection('contact')}>
            {t.pricing.contactUs}
          </button>
        </p>
      </div>
    </section>
  )
}
