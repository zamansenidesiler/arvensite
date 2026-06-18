import { useEffect } from 'react'
import { LanguageProvider, useLang } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Trust from './components/Trust'
import Gallery from './components/Gallery'
import Services from './components/Services'
import Process from './components/Process'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Syncs <html lang> and <title> with the active language for SEO
function DynamicHead() {
  const { lang } = useLang()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'tr'
      ? 'Arvenmods — Premium FiveM Giysi Tasarımcısı | Custom Clothing Designer'
      : 'Arvenmods — Premium FiveM Clothing Designer | Custom Clothing Design'
  }, [lang])

  return null
}

export default function App() {
  return (
    <LanguageProvider>
      <DynamicHead />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Trust />
        <Gallery />
        <Services />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
