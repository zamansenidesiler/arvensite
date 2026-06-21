import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import './index.css'
import App from './App.jsx'

const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// Expose for scrollTo calls in components
window.lenis = lenis

// Update scroll progress CSS variable for cross-browser support (Safari, Firefox fallback)
lenis.on('scroll', ({ scroll, limit, progress }) => {
  const p = progress !== undefined ? progress : (limit > 0 ? scroll / limit : 0)
  document.documentElement.style.setProperty('--scroll-progress', p.toFixed(4))
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
