import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { packages } from '../config/packages'
import { useTilt } from '../hooks/useTilt'
import { siteConfig } from '../config/site'

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
  </svg>
)

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function ProductGallery({ images, youtubeUrl }) {
  const youtubeId = getYouTubeId(youtubeUrl)
  const [activeView, setActiveView] = useState({ type: 'image', value: images[0] || '' })
  const tilt = useTilt()

  useEffect(() => {
    if (images[0]) {
      setActiveView({ type: 'image', value: images[0] })
    }
  }, [images])

  if (images.length === 0 && !youtubeId) return null

  return (
    <div className="product-gallery-container">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="product-main-image-wrap tilt-card card-glow-orange"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {activeView.type === 'video' ? (
          <iframe
            className="product-main-video"
            src={`https://www.youtube.com/embed/${activeView.value}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: '0', display: 'block' }}
          ></iframe>
        ) : (
          <img src={activeView.value} alt="" className="product-main-image" />
        )}
      </div>

      {(images.length > 1 || youtubeId) && (
        <div className="product-thumbnails-grid">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveView({ type: 'image', value: img })}
              className={`product-thumb-btn ${activeView.type === 'image' && activeView.value === img ? 'active' : ''}`}
              aria-label={`Görsel ${i + 1}`}
            >
              <img src={img} alt="" />
            </button>
          ))}
          
          {youtubeId && (
            <button
              onClick={() => setActiveView({ type: 'video', value: youtubeId })}
              className={`product-thumb-btn video-thumb ${activeView.type === 'video' ? 'active' : ''}`}
              aria-label="YouTube Video"
              style={{ position: 'relative' }}
            >
              <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="YouTube Video Thumbnail" />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 'inherit'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent)' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function PackageDetails({ packageId }) {
  const { lang } = useLang()
  const pack = packages.find(p => p.id === packageId)
  const [activeTab, setActiveTab] = useState('description')

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    window.lenis?.scrollTo(0, { immediate: true })
  }, [packageId])

  if (!pack) {
    return (
      <div className="container-site" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <h2 className="font-display font-bold" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          {lang === 'tr' ? 'Paket Bulunamadı' : 'Package Not Found'}
        </h2>
        <a href="#" className="btn-primary">
          <ArrowLeftIcon />
          {lang === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Homepage'}
        </a>
      </div>
    )
  }

  const isTr = lang === 'tr'
  const otherPackages = packages.filter(p => p.id !== packageId).slice(0, 3)

  return (
    <div className="package-details-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container-site">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-nav">
          <a href="#" className="breadcrumb-back-btn">
            <ArrowLeftIcon />
            {isTr ? 'Geri Dön' : 'Go Back'}
          </a>
          <div className="breadcrumb-path">
            <a href="#">{isTr ? 'Ana Sayfa' : 'Home'}</a>
            <span>/</span>
            <a href="#pricing">{isTr ? 'Paketler' : 'Packages'}</a>
            <span>/</span>
            <span className="current">{pack.name[lang]}</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="product-main-grid">
          {/* Gallery Column */}
          <div>
            <ProductGallery images={pack.images} youtubeUrl={pack.youtubeUrl} />
          </div>

          {/* Pricing & Checkout Column */}
          <div className="product-info-sidebar">
            <div className="product-badges-row">
              {pack.badges[lang].map((badge, idx) => (
                <span key={idx} className="product-info-badge">
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="font-display font-extrabold product-detail-title">
              {pack.name[lang]}
            </h1>

            <div className="product-price-box">
              <span className="product-price-label">{isTr ? 'Fiyat' : 'Price'}</span>
              <div className="product-price-value text-gradient">{pack.price}</div>
              <span className="product-price-sub">{isTr ? 'Tek Seferlik Ödeme' : 'One-time Payment'}</span>
            </div>

            <a
              href={siteConfig.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary product-buy-btn"
              style={{ background: '#5865F2', borderColor: '#5865F2', color: '#fff' }}
            >
              <DiscordIcon />
              {isTr ? 'Discord Üzerinden Satın Al' : 'Purchase via Discord'}
            </a>

            {/* Spec Details Grid */}
            <div className="product-specs-card">
              <h3 className="font-display font-bold specs-title">{isTr ? 'Ürün Özellikleri' : 'Technical Specs'}</h3>
              <div className="specs-grid-layout">
                <div>
                  <span className="spec-label">{isTr ? 'Dosya Boyutu' : 'File Size'}</span>
                  <span className="spec-val">{pack.specs.fileSize}</span>
                </div>
                <div>
                  <span className="spec-label">{isTr ? 'Uyumlu Platform' : 'Platform'}</span>
                  <span className="spec-val">{pack.specs.platform}</span>
                </div>
                <div>
                  <span className="spec-label">{isTr ? 'Lisans Tipi' : 'License'}</span>
                  <span className="spec-val">{pack.specs.license}</span>
                </div>
                <div>
                  <span className="spec-label">{isTr ? 'Teslimat Formatı' : 'Format'}</span>
                  <span className="spec-val">{pack.specs.format}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Component */}
        <div className="product-tabs-section">
          <div className="product-tabs-header" role="tablist">
            {[
              { id: 'description', label: isTr ? 'Açıklama' : 'Description' },
              { id: 'features', label: isTr ? 'Paket İçeriği' : 'Pack Features' },
              { id: 'installation', label: isTr ? 'Kurulum Kılavuzu' : 'Installation Guide' },
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`product-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="product-tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane-content">
                <p className="tab-desc-paragraph">{pack.description[lang]}</p>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div className="tab-badge-bullet">
                    <span className="bullet-icon"><CheckIcon /></span>
                    <span>{isTr ? 'FiveM sunucuları için hazır, FPS optimize edilmiş giysi' : 'FiveM server ready, FPS optimized assets'}</span>
                  </div>
                  <div className="tab-badge-bullet">
                    <span className="bullet-icon"><CheckIcon /></span>
                    <span>{isTr ? 'Tebex Escrow sistemi ile güvenli, anında teslimat' : 'Secure instant delivery via Tebex Escrow system'}</span>
                  </div>
                  <div className="tab-badge-bullet">
                    <span className="bullet-icon"><CheckIcon /></span>
                    <span>{isTr ? 'Geliştirici ekibimizden 7/24 Discord teknik destek garantisi' : '24/7 Discord technical support guarantee from our dev team'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="tab-pane-content">
                <ul className="tab-bullets-list">
                  {pack.features[lang].map((feat, i) => (
                    <li key={i}>
                      <span className="bullet-icon"><CheckIcon /></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'installation' && (
              <div className="tab-pane-content">
                <ol className="tab-steps-list">
                  {pack.installation[lang].map((step, i) => (
                    <li key={i}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {otherPackages.length > 0 && (
          <div className="related-packages-section" style={{ marginTop: '80px' }}>
            <div className="gradient-line" style={{ marginBottom: '40px' }} />
            <h2 className="font-display font-extrabold related-title" style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
              {isTr ? 'İlginizi Çekebilecek Diğer Paketler' : 'Other Packs You Might Like'}
            </h2>
            <div className="related-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {otherPackages.map(other => (
                <a
                  href={`#/package/${other.id}`}
                  key={other.id}
                  className="related-pack-card card-glow-orange"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={other.images[0]}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      className="related-card-img"
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(6,6,16,0.85)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>
                      {other.price}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 className="font-display font-bold" style={{ fontSize: '0.95rem', marginBottom: '8px', lineHeight: 1.4 }}>
                      {other.name[lang]}
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {other.badges[lang].slice(0, 2).join(' • ')}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
