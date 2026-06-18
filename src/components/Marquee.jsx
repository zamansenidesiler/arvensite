import { useLang } from '../context/LanguageContext'

export default function Marquee() {
  const { t } = useLang()
  const repeated = [...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee]

  return (
    <div className="marquee-outer">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-text">{item}</span>
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
