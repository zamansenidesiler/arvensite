import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// Expose for scrollTo calls in components
window.lenis = lenis

// ── Parallax: translate [data-parallax] elements as the page scrolls ──────
// data-parallax = speed factor (e.g. 0.08). Base position is cached once so
// the running transform never feeds back into the measurement.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduceMotion) {
  let items = []
  const measure = () => {
    items = [...document.querySelectorAll('[data-parallax]')].map(el => {
      el.style.transform = 'none'
      const baseTop = el.getBoundingClientRect().top + window.scrollY
      return { el, speed: parseFloat(el.dataset.parallax) || 0.08, baseTop }
    })
  }
  const apply = (scroll) => {
    const mid = window.innerHeight / 2
    for (const { el, speed, baseTop } of items) {
      const y = (scroll - (baseTop - mid)) * speed
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
    }
  }
  // Measure after first paint, then keep in sync with scroll & resize
  requestAnimationFrame(() => { measure(); apply(window.scrollY) })
  setTimeout(() => { measure(); apply(window.scrollY) }, 600) // re-measure after fonts/layout settle
  lenis.on('scroll', ({ scroll }) => apply(scroll))
  window.addEventListener('resize', () => { measure(); apply(window.scrollY) }, { passive: true })
}

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
