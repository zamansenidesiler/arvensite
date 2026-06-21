import { useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { packages } from '../config/packages'

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const ShoppingBagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export default function ProductsList() {
  const { lang } = useLang()
  const isTr = lang === 'tr'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    window.lenis?.scrollTo(0, { immediate: true })
  }, [])

  return (
    <div className="products-catalog-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container-site">
        
        {/* Breadcrumbs */}
        <div className="breadcrumb-nav">
          <a href="#" className="breadcrumb-back-btn">
            <ArrowLeftIcon />
            {isTr ? 'Geri Dön' : 'Go Back'}
          </a>
          <div className="breadcrumb-path">
            <a href="#">{isTr ? 'Ana Sayfa' : 'Home'}</a>
            <span>/</span>
            <span className="current">{isTr ? 'Mağaza' : 'Store'}</span>
          </div>
        </div>

        {/* Catalog Header */}
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div className="badge-skew">{isTr ? 'MAĞAZA' : 'STORE'}</div>
          </div>
          <h2 className="section-title">
            {isTr ? 'Tüm Tasarımlar & ' : 'All Designs & '}
            <span className="text-gradient">{isTr ? 'Paketler' : 'Packs'}</span>
          </h2>
          <p className="section-subtitle">
            {isTr 
              ? 'FiveM sunucunuz için özenle optimize edilmiş, yüksek kaliteli giysi paketlerimiz.' 
              : 'Our high-quality clothing packages meticulously optimized for your FiveM server.'}
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="products-catalog-grid">
          {packages.map((pack) => (
            <article key={pack.id} className="catalog-product-card card-glow-orange">
              {/* Product Image Gallery Preview */}
              <div className="catalog-card-image-wrap">
                <img src={pack.images[0]} alt="" className="catalog-card-img" />
                <div className="catalog-card-price-badge">
                  {pack.price}
                </div>
              </div>

              {/* Product Info Block */}
              <div className="catalog-card-body">
                <div className="catalog-card-badges">
                  {pack.badges[lang].slice(0, 2).map((badge, i) => (
                    <span key={i} className="catalog-badge-tag">
                      {badge}
                    </span>
                  ))}
                </div>

                <h3 className="font-display font-bold catalog-product-title">
                  {pack.name[lang]}
                </h3>

                <p className="catalog-product-desc">
                  {pack.description[lang]}
                </p>

                {/* Direct Action Buttons */}
                <div className="catalog-card-actions">
                  <a href={`#/package/${pack.id}`} className="btn-primary catalog-action-details-btn" style={{ justifyContent: 'center' }}>
                    {isTr ? 'Detayları İncele' : 'View Details'}
                    <span style={{ marginLeft: '4px' }}>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}
