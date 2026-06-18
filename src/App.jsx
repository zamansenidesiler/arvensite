import { lazy, Suspense } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import SectionLoader from './components/SectionLoader'
import CustomCursor from './components/CustomCursor'

const About = lazy(() => import('./components/About'))
const Trust = lazy(() => import('./components/Trust'))
const Gallery = lazy(() => import('./components/Gallery'))
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
      <CustomCursor />
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar />
      <main id="main-content">
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
      </main>
      <Footer />
    </LanguageProvider>
  )
}
