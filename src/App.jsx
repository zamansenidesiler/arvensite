import { lazy, Suspense, useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import SectionLoader from './components/SectionLoader'
import { scrollToSection } from './utils/scrollTo'

const About = lazy(() => import('./components/About'))
const Trust = lazy(() => import('./components/Trust'))
const Gallery = lazy(() => import('./components/Gallery'))
const Services = lazy(() => import('./components/Services'))
const Reviews = lazy(() => import('./components/Reviews'))
const Process = lazy(() => import('./components/Process'))
const Pricing = lazy(() => import('./components/Pricing'))
const Faq = lazy(() => import('./components/Faq'))
const Contact = lazy(() => import('./components/Contact'))
const PackageDetails = lazy(() => import('./components/PackageDetails'))
const ProductsList = lazy(() => import('./components/ProductsList'))
const Admin = lazy(() => import('./components/Admin'))
const Portal = lazy(() => import('./components/Portal'))

function LazySection({ children }) {
  return <Suspense fallback={<SectionLoader />}>{children}</Suspense>
}

function parseHashRoute() {
  const hash = window.location.hash
  if (hash.startsWith('#/package/')) {
    return { name: 'package', id: hash.split('/').pop() }
  }
  if (hash === '#/products') {
    return { name: 'products' }
  }
  if (hash === '#/admin') {
    return { name: 'admin' }
  }
  if (hash === '#/portal') {
    return { name: 'portal' }
  }
  return { name: 'home' }
}

export default function App() {
  const [route, setRoute] = useState(parseHashRoute)

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashRoute()
      setRoute(parsed)
      
      if (parsed.name === 'package' || parsed.name === 'products' || parsed.name === 'admin' || parsed.name === 'portal') {
        window.lenis?.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (route.name === 'home') {
      const hash = window.location.hash
      if (hash && !hash.startsWith('#/package/') && hash !== '#/products' && hash !== '#/admin' && hash !== '#/portal') {
        const id = hash.replace('#', '')
        setTimeout(() => {
          scrollToSection(id)
        }, 200)
      }
    }
  }, [route])

  return (
    <LanguageProvider>
      <SeoHead />
      <div className="scroll-progress" aria-hidden="true" />
      {route.name !== 'admin' && <Navbar />}
      <main id="main-content">
        {route.name === 'package' ? (
          <LazySection>
            <PackageDetails packageId={route.id} />
          </LazySection>
        ) : route.name === 'products' ? (
          <LazySection>
            <ProductsList />
          </LazySection>
        ) : route.name === 'admin' ? (
          <LazySection>
            <Admin />
          </LazySection>
        ) : route.name === 'portal' ? (
          <LazySection>
            <Portal />
          </LazySection>
        ) : (
          <>
            <Hero />
            <Marquee />
            <LazySection><About /></LazySection>
            <LazySection><Trust /></LazySection>
            <LazySection><Gallery /></LazySection>
            <LazySection><Services /></LazySection>
            <LazySection><Reviews /></LazySection>
            <LazySection><Process /></LazySection>
            <LazySection><Pricing /></LazySection>
            <LazySection><Faq /></LazySection>
            <LazySection><Contact /></LazySection>
          </>
        )}
      </main>
      {route.name !== 'admin' && <Footer />}
    </LanguageProvider>
  )
}
