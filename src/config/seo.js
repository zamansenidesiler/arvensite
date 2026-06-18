import { siteConfig } from './site'

const { domain, brandName } = siteConfig

export const seoConfig = {
  tr: {
    title: 'Arvenmods — Premium FiveM Giysi Tasarımcısı | Özel Kıyafet Paketleri',
    description:
      'Arvenmods — FiveM sunucunuz için premium özel giysi tasarımı ve clothing pack. GTA V roleplay için FPS optimize, el yapımı ceketler, kombin setler ve çete giysileri. Discord destek.',
    keywords:
      'FiveM clothing, FiveM giysi, özel giysi tasarımı, FiveM kıyafet paketi, GTA V roleplay moda, arvenmods, FiveM texture, çete giysisi, escrow clothing pack',
    ogLocale: 'tr_TR',
  },
  en: {
    title: 'Arvenmods — Premium FiveM Clothing Designer | Custom Outfit Packs',
    description:
      'Arvenmods — Premium custom FiveM clothing design and outfit packs for GTA V roleplay servers. FPS-optimized jackets, full sets, gang uniforms. Discord support & escrow delivery.',
    keywords:
      'FiveM clothing, FiveM custom clothing, FiveM outfit pack, GTA V roleplay fashion, arvenmods, FiveM texture design, gang clothing fivem, escrow clothing',
    ogLocale: 'en_US',
  },
}

export function buildStructuredData({ lang, t }) {
  const isTr = lang === 'tr'
  const desc = seoConfig[lang].description

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandName,
    url: domain,
    logo: `${domain}/favicon.svg`,
    description: desc,
    sameAs: [siteConfig.discord].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: siteConfig.discord,
      availableLanguage: ['Turkish', 'English'],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brandName,
    url: domain,
    description: desc,
    inLanguage: ['tr', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${domain}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: brandName,
    url: domain,
    image: `${domain}/og-image.jpg`,
    description: desc,
    serviceType: isTr ? 'FiveM Özel Giysi Tasarımı' : 'FiveM Custom Clothing Design',
    areaServed: 'Worldwide',
    priceRange: '$$',
  }

  const pricingOffers = [...t.pricing.escrow, ...t.pricing.openSource].map(pack => ({
    '@type': 'Offer',
    name: pack.name,
    price: pack.price.replace(/[^0-9.]/g, ''),
    priceCurrency: 'USD',
    description: pack.desc,
    url: siteConfig.discord,
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: brandName },
  }))

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: isTr ? 'Arvenmods FiveM Giysi Paketleri' : 'Arvenmods FiveM Clothing Packs',
    itemListElement: pricingOffers,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isTr ? 'Ana Sayfa' : 'Home', item: domain },
      { '@type': 'ListItem', position: 2, name: isTr ? 'Fiyatlandırma' : 'Pricing', item: `${domain}/#pricing` },
      { '@type': 'ListItem', position: 3, name: 'FAQ', item: `${domain}/#faq` },
    ],
  }

  return [faqSchema, organizationSchema, websiteSchema, serviceSchema, catalogSchema, breadcrumbSchema]
}
