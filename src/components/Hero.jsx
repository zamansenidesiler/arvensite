import { useLang } from '../context/LanguageContext'
import { scrollToSection } from '../utils/scrollTo'

const ease = 'cubic-bezier(0.17, 0.55, 0.55, 1)'
const easeOut = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="hero-section">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      <div className="orb orb-mid" />

      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="hero-badge-pill"
          style={{ animation: `heroFadeIn 0.7s ${easeOut} both`, animationDelay: '0.15s' }}
        >
          <div className="section-badge">{t.hero.badge}</div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {[
            { text: t.hero.line1, style: 'solid' },
            { text: t.hero.line2, style: 'outline' },
            { text: t.hero.line3, style: 'gradient' },
          ].map(({ text, style }, i) => (
            <h1
              key={i}
              className={`hero-word font-display font-extrabold ${
                style === 'outline' ? 'text-outline' : style === 'gradient' ? 'text-gradient' : ''
              }`}
              style={{
                fontSize: 'clamp(3.25rem, 10vw, 9.5rem)',
                display: 'block',
                lineHeight: 0.95,
                paddingBottom: '0.08em',
                color: style === 'outline' ? 'transparent' : style === 'gradient' ? undefined : 'var(--text-primary)',
                animation: `heroFadeUp 1s ${ease} both`,
                animationDelay: `${0.35 + i * 0.12}s`,
              }}
            >
              {text}
            </h1>
          ))}
        </div>

        <p
          className="hero-sub"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            lineHeight: 1.75,
            maxWidth: 480,
            marginBottom: '2.5rem',
            animation: `heroFadeIn 0.7s ${easeOut} both`,
            animationDelay: '0.75s',
          }}
        >
          {t.hero.sub}
        </p>

        <div
          className="hero-ctas flex flex-wrap gap-4 items-center"
          style={{
            animation: `heroFadeIn 0.6s ${easeOut} both`,
            animationDelay: '0.9s',
          }}
        >
          <button onClick={() => scrollToSection('gallery')} className="btn-primary">
            {t.hero.cta}
            <span style={{ fontSize: '1.1em' }}>→</span>
          </button>
          <button onClick={() => scrollToSection('contact')} className="btn-ghost">
            {t.hero.ctaSecondary}
          </button>
        </div>
      </div>

      <div
        className="hero-scroll-indicator"
        style={{ animation: `heroFadeIn 0.5s ${easeOut} both`, animationDelay: '1.1s' }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
          }}
        >
          {t.hero.scroll}
        </span>
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
      </div>
    </section>
  )
}
