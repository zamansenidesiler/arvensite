import { useLang } from '../context/LanguageContext'

export default function Marquee() {
  const { t } = useLang()
  const items = t.marquee

  // Duplicate for infinite loop illusion
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div
      className="marquee-outer"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '1.125rem 0',
        background: 'rgba(255,255,255,0.015)',
      }}
    >
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5rem',
              paddingRight: '1.5rem',
            }}
          >
            <span
              className="font-display font-bold tracking-widest"
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              {item}
            </span>
            <span style={{ color: 'var(--accent)', fontSize: '0.6rem', opacity: 0.6, flexShrink: 0 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
