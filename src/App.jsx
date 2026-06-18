import { lazy, Suspense } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Features from './components/Features'
import Footer from './components/Footer'
import SectionLoader from './components/SectionLoader'

const About = lazy(() => import('./components/About'))
const Trust = lazy(() => import('./components/Trust'))
const Gallery = lazy(() => import('./components/Gallery'))
const CommunityStats = lazy(() => import('./components/CommunityStats'))
const Services = lazy(() => import('./components/Services'))
const Reviews = lazy(() => import('./components/Reviews'))
const Process = lazy(() => import('./components/Process'))
const Pricing = lazy(() => import('./components/Pricing'))
const Faq = lazy(() => import('./components/Faq'))
const Contact = lazy(() => import('./components/Contact'))

function LazySection({ children }) {
  return <Suspense fallback={<SectionLoader />}>{children}</Suspense>
}

export default function App() {
  return (
    <LanguageProvider>
      <SeoHead />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Features />
        <LazySection><About /></LazySection>
        <LazySection><Trust /></LazySection>
        <LazySection><Gallery /></LazySection>
        <LazySection><CommunityStats /></LazySection>
        <LazySection><Services /></LazySection>
        <LazySection><Reviews /></LazySection>
        <LazySection><Process /></LazySection>
        <LazySection><Pricing /></LazySection>
        <LazySection><Faq /></LazySection>
        <LazySection><Contact /></LazySection>
      </main>
      <Footer />
    </LanguageProvider>
  )
}
